export {};
// Teaser do tour 3D na home. Autossuficiente de propósito (sem imports): assim o Astro o embute no HTML e a home
// não ganha requisições no caminho do LCP. A ilha 3D vem por import() nativo na URL do chunk "tour", que o
// pós-build (scripts/ligar-tour.mjs) escreve em data-modulo.
// Sozinho só quando aparece na tela, com WebGL, sem Save-Data/2g e sem movimento reduzido; senão, só no clique.
interface Tour {
  irPara(id: string): void;
  destruir(): void;
}
interface ModuloTour {
  montarTour(o: Record<string, unknown>): Promise<Tour>;
}

const ZONAS_TEASER = ['musculacao', 'cardio', 'conveniencia'];

function podeCarregarSozinho() {
  const c = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  if (c?.saveData) return false;
  return !/(^|-)2g$/.test(c?.effectiveType ?? '');
}
function temWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    return false;
  }
}

for (const palco of document.querySelectorAll<HTMLElement>('[data-tour3d]')) {
  const botao = palco.querySelector<HTMLButtonElement>('[data-tour3d-carregar]');
  const alvo = palco.querySelector<HTMLElement>('[data-tour3d-alvo]');
  const aviso = palco.querySelector<HTMLElement>('[data-tour3d-aviso]');
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  palco.dataset['economia'] = podeCarregarSozinho() ? 'nao' : 'sim';
  let tour: Tour | null = null;
  let carregando = false;

  const carregar = async () => {
    if (tour || carregando || !alvo) return;
    carregando = true;
    if (botao) botao.disabled = true;
    try {
      const url = palco.dataset['modulo'] ?? '';
      if (!temWebGL() || !url.endsWith('.js')) throw new Error('sem WebGL ou sem módulo');
      const indice = (await (await fetch('/modelos/indice.json')).json()) as {
        maquete?: { esquematica?: boolean };
      };
      if (indice.maquete?.esquematica && palco.dataset['esquematicaOk'] !== 'true')
        throw new Error('esquemática não aprovada');
      const { montarTour } = (await import(/* @vite-ignore */ url)) as ModuloTour;
      const nomes = new Map(
        [...palco.querySelectorAll<HTMLElement>('[data-zona]')].map((a) => [
          a.dataset['zona'] ?? '',
          a.textContent?.trim() ?? '',
        ]),
      );
      tour = await montarTour({
        alvo,
        indice,
        zonas: ZONAS_TEASER.map((id) => ({ id, nome: nomes.get(id) ?? id, camera: null })),
        zonaInicial: 'musculacao',
        reduzido,
      });
      palco.dataset['modo'] = '3d';
      // medição (src/lib/medicao.ts ouve "prime:medir"; sem import para não pesar o caminho do LCP)
      dispatchEvent(
        new CustomEvent('prime:medir', { detail: { nome: 'tour_3d_aberto', zona: 'musculacao' } }),
      );
      if (indice.maquete?.esquematica) palco.dataset['esquematica'] = 'sim';
    } catch (erro) {
      if (aviso) {
        aviso.textContent = 'Não foi possível abrir o tour 3D aqui. Abra o tour completo.';
        aviso.hidden = false;
      }
      console.warn('[teaser 3D]', erro);
    } finally {
      carregando = false;
      if (botao) botao.disabled = false;
    }
  };
  botao?.addEventListener('click', () => void carregar());
  // zonas do teaser: com o 3D aberto, voam até a zona; sem ele, vão para /a-casa?zona=
  for (const a of palco.querySelectorAll<HTMLAnchorElement>('[data-zona]')) {
    a.addEventListener('click', (e) => {
      if (!tour) return;
      e.preventDefault();
      tour.irPara(a.dataset['zona'] ?? '');
    });
  }
  // sem 3D no build (produção sem a maquete aprovada) não há o que carregar: nem tenta, nem avisa erro
  const tem3d = palco.dataset['tem3d'] === 'true';
  if (tem3d && podeCarregarSozinho() && !reduzido && temWebGL() && alvo) {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        if ('requestIdleCallback' in window)
          requestIdleCallback(() => void carregar(), { timeout: 1500 });
        else setTimeout(() => void carregar(), 300);
      },
      { threshold: 0.35 },
    );
    io.observe(alvo);
  }
  addEventListener('pagehide', () => {
    tour?.destruir();
    tour = null;
  });
}
