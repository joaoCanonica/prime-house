export {};
// Controlador da Casa 3D: abas (role=tablist) ↔ cena ↔ URL (?zona=), gaveta no celular, fallback e "Ver de verdade".
import {
  podeCarregarSozinho,
  temWebGL,
  type IndiceModelos,
  type Tour,
  type ZonaTour,
} from '../../tres/tipos.ts';

const raiz = document.querySelector<HTMLElement>('[data-casa3d]');
if (raiz) iniciar(raiz);

function iniciar(raiz: HTMLElement) {
  const zonas = JSON.parse(raiz.dataset['zonas'] ?? '[]') as ZonaTour[];
  const abas = [...raiz.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const paineis = [...raiz.querySelectorAll<HTMLElement>('[data-painel]')];
  const alvo = raiz.querySelector<HTMLElement>('[data-casa3d-alvo]');
  const selo = raiz.querySelector<HTMLElement>('[data-casa3d-selo]');
  const estado = raiz.querySelector<HTMLElement>('[data-casa3d-estado]');
  const estadoTexto = raiz.querySelector<HTMLElement>('[data-casa3d-estado-texto]');
  const barra = raiz.querySelector<HTMLElement>('[data-casa3d-barra]');
  const cancelar = raiz.querySelector<HTMLButtonElement>('[data-casa3d-cancelar]');
  const carregar = raiz.querySelector<HTMLButtonElement>('[data-casa3d-carregar]');
  const sairReal = raiz.querySelector<HTMLButtonElement>('[data-casa3d-sair-real]');
  const como = raiz.querySelector<HTMLElement>('[data-casa3d-como]');
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const celular = matchMedia('(max-width: 63.99rem)');
  const ids = zonas.map((z) => z.id);
  let tour: Tour | null = null;
  // medição sem import cruzado: src/lib/medicao.ts ouve "prime:medir"
  const medir = (detail: { nome: string; zona: string }) =>
    dispatchEvent(new CustomEvent('prime:medir', { detail }));
  let indice: IndiceModelos | null = null;

  const daUrl = new URLSearchParams(location.search).get('zona');
  let ativa = daUrl && ids.includes(daUrl) ? daUrl : (raiz.dataset['inicial'] ?? ids[0] ?? '');

  // ---------- abas
  function ativar(id: string, { foco = false, abrir = false, url = true } = {}) {
    if (!ids.includes(id)) return;
    ativa = id;
    for (const a of abas) {
      const sel = a.dataset['zona'] === id;
      a.setAttribute('aria-selected', String(sel));
      a.tabIndex = sel ? 0 : -1;
      if (sel && foco) a.focus();
    }
    for (const p of paineis) p.dataset['ativo'] = String(p.dataset['painel'] === id);
    tour?.irPara(id);
    if (url) {
      const u = new URL(location.href);
      u.searchParams.set('zona', id);
      history.replaceState(null, '', u);
    }
    if (abrir) abrirPainel();
  }
  function abrirPainel() {
    const painel = paineis.find((p) => p.dataset['painel'] === ativa);
    if (celular.matches) raiz.dataset['gaveta'] = 'aberta';
    painel?.focus({ preventScroll: !celular.matches });
  }
  function fecharGaveta() {
    raiz.dataset['gaveta'] = 'fechada';
    abas.find((a) => a.dataset['zona'] === ativa)?.focus();
  }
  for (const a of abas) {
    a.addEventListener('click', () => ativar(a.dataset['zona'] ?? '', { abrir: celular.matches }));
    a.addEventListener('keydown', (e) => {
      const i = ids.indexOf(a.dataset['zona'] ?? '');
      const ir = (j: number) => {
        e.preventDefault();
        ativar(ids[(j + ids.length) % ids.length] ?? '', { foco: true });
      };
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') ir(i + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ir(i - 1);
      else if (e.key === 'Home') ir(0);
      else if (e.key === 'End') ir(ids.length - 1);
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        ativar(ids[i] ?? '', { abrir: true });
      }
    });
  }
  for (const b of raiz.querySelectorAll('[data-casa3d-fechar]'))
    b.addEventListener('click', fecharGaveta);
  raiz.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && raiz.dataset['gaveta'] === 'aberta') fecharGaveta();
  });
  ativar(ativa, { url: false });

  // ---------- estado / progresso
  const mostrarEstado = (texto: string | null, fracao?: number, cancelavel = false) => {
    if (!estado || !estadoTexto || !barra || !cancelar) return;
    estado.hidden = texto === null;
    estadoTexto.textContent = texto ?? '';
    barra.style.width = `${Math.round((fracao ?? 0) * 100)}%`;
    cancelar.hidden = !cancelavel;
  };

  // ---------- 3D
  async function montar() {
    if (tour || !alvo) return;
    if (carregar) carregar.hidden = true;
    mostrarEstado('Carregando a maquete…', 0.1);
    try {
      indice ??= (await (await fetch('/modelos/indice.json')).json()) as IndiceModelos;
      if (!indice.maquete) throw new Error('sem maquete');
      if (indice.maquete.esquematica && raiz.dataset['esquematicaOk'] !== 'true') {
        raiz.dataset['modo'] = 'fallback'; // produção sem aprovação: fica o fallback
        mostrarEstado(null);
        return;
      }
      const { montarTour } = await import('../../tres/tour.ts');
      mostrarEstado('Carregando a maquete…', 0.6);
      tour = await montarTour({
        alvo,
        indice,
        zonas,
        zonaInicial: ativa,
        reduzido,
        medirFps: new URLSearchParams(location.search).has('fps'),
        aoSelecionar: (id) => ativar(id, { abrir: false }),
      });
      raiz.dataset['modo'] = '3d';
      medir({ nome: 'tour_3d_aberto', zona: ativa || 'geral' });
      if (selo) selo.hidden = !indice.maquete.esquematica;
      if (como) como.hidden = false;
      for (const b of raiz.querySelectorAll<HTMLButtonElement>('[data-ver-real]')) b.hidden = false;
      mostrarEstado(null);
    } catch (erro) {
      console.warn('[casa3d] fallback:', erro);
      raiz.dataset['modo'] = 'fallback';
      mostrarEstado(null);
    }
  }

  // ---------- "Ver de verdade": splat da zona (sob demanda, cancelável); sem splat, abre o vídeo da zona
  let abortar: AbortController | null = null;
  cancelar?.addEventListener('click', () => abortar?.abort());
  sairReal?.addEventListener('click', () => {
    tour?.sairDoReal();
    sairReal.hidden = true;
  });
  for (const b of raiz.querySelectorAll<HTMLButtonElement>('[data-ver-real]')) {
    b.addEventListener('click', async () => {
      const id = b.dataset['verReal'] ?? '';
      medir({ nome: 'tour_3d_realismo', zona: id });
      if (tour && indice?.splats[id]) {
        abortar = new AbortController();
        mostrarEstado('Carregando a captura real…', 0, true);
        try {
          await tour.verDeVerdade(
            id,
            (f) => mostrarEstado('Carregando a captura real…', f, true),
            abortar.signal,
          );
          if (sairReal) sairReal.hidden = false;
        } catch {
          /* cancelado ou erro: continua na maquete */
        }
        mostrarEstado(null);
        return;
      }
      const painel = b.closest<HTMLElement>('[data-painel]');
      const v = painel?.querySelector<HTMLVideoElement>('video');
      const midia = painel?.querySelector<HTMLElement>('.casa3d__midia');
      midia?.scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth', block: 'center' });
      if (v) {
        v.dataset['pausado'] = '0';
        v.play().catch(() => undefined);
      }
    });
  }

  // decisão: sem WebGL → fallback; Save-Data/2g/movimento reduzido → só no clique; senão, ao aparecer + ocioso
  if (!temWebGL()) {
    raiz.dataset['modo'] = 'fallback';
  } else if (reduzido || !podeCarregarSozinho()) {
    raiz.dataset['modo'] = 'fallback';
    if (carregar) {
      carregar.hidden = false;
      carregar.addEventListener('click', () => void montar());
    }
  } else {
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const ir = () => void montar();
      if ('requestIdleCallback' in window) requestIdleCallback(ir, { timeout: 1200 });
      else setTimeout(ir, 200);
    });
    if (alvo) io.observe(alvo);
  }

  // libera memória ao sair da página
  addEventListener('pagehide', () => {
    if (!tour) return;
    tour.destruir();
    tour = null;
    raiz.dataset['remontar'] = 'sim';
  });
  // voltou do bfcache: remonta
  addEventListener('pageshow', (e) => {
    if (e.persisted && raiz.dataset['remontar'] === 'sim') {
      raiz.dataset['remontar'] = 'nao';
      void montar();
    }
  });
}
