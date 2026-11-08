export {};
// Liga o mapa do localizador: (1) ao chegar perto da tela, o mapa 3D desenhado (Three.js, só do próprio site);
// (2) o mapa real em 3D (MapLibre + OpenFreeMap) só quando a pessoa pede ("Mapa real") ou se ela já
// aceitou os serviços de terceiros. Sem WebGL, fica a foto da fachada e os botões de rota.
import { lerConsentimento } from '../consentimento/consentimento.ts';

const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;

for (const caixa of document.querySelectorAll<HTMLElement>('[data-mapa]')) {
  const canvas = caixa.querySelector<HTMLCanvasElement>('[data-mapa-canvas]');
  const host = caixa.querySelector<HTMLElement>('[data-mapa-real]');
  const etiqueta = caixa.querySelector<HTMLElement>('[data-mapa-etiqueta]');
  const botoes = [...caixa.querySelectorAll<HTMLButtonElement>('[data-mapa-modo]')];
  if (!canvas || !host) continue;
  const lat = Number(caixa.dataset['lat']);
  const lng = Number(caixa.dataset['lng']);
  const rotulo = caixa.dataset['rotulo'] ?? '';

  let desenho: { ativo(sim: boolean): void } | null = null;
  let real: { resize(): void } | null = null;
  let carregandoReal = false;
  const dizer = (t: string) => {
    if (etiqueta) etiqueta.textContent = t;
  };

  const modo = (ehReal: boolean) => {
    caixa.classList.toggle('mapa--real', ehReal);
    for (const b of botoes)
      b.setAttribute('aria-pressed', String((b.dataset['mapaModo'] === 'real') === ehReal));
    desenho?.ativo(!ehReal);
    if (ehReal) {
      dizer(
        'Mapa real em 3D. Arraste para mover; botão direito ou dois dedos para girar e inclinar.',
      );
      setTimeout(() => real?.resize(), 50);
    } else if (desenho) dizer('Mapa 3D esquemático. Arraste ou use as setas para girar.');
  };

  const carregarReal = () => {
    if (real) return modo(true);
    if (carregandoReal) return;
    carregandoReal = true;
    caixa.classList.add('mapa--carregando');
    dizer('Carregando o mapa real…');
    import('./mapa-real.ts')
      .then(async (m) => {
        const [r] = await Promise.all([fetch(m.ESTILO), m.carregarCss()]);
        if (!r.ok) throw new Error('estilo');
        const estilo = await r.json();
        const mapa = m.montarMapaReal({
          caixa: host,
          lat,
          lng,
          estilo,
          reduzido,
          aoMostrar: () => {
            caixa.classList.remove('mapa--carregando');
            real = mapa;
            modo(true);
          },
          aoFalhar: () => falhou(),
        });
      })
      .catch(() => falhou());
  };
  const falhou = () => {
    carregandoReal = false;
    real = null;
    host.replaceChildren();
    caixa.classList.remove('mapa--carregando');
    modo(false);
    dizer('O mapa real não carregou agora. Use os botões de rota ao lado.');
  };

  for (const b of botoes)
    b.addEventListener('click', () =>
      b.dataset['mapaModo'] === 'real' ? carregarReal() : modo(false),
    );

  new IntersectionObserver(
    (es, io) => {
      if (!es[0]?.isIntersecting) return;
      io.disconnect();
      import('./mapa-desenhado.ts')
        .then((m) => {
          desenho = m.montarMapaDesenhado(caixa, canvas, rotulo, reduzido);
          caixa.classList.add('mapa--3d');
          if (!caixa.classList.contains('mapa--real')) modo(false);
        })
        .catch(() => {
          /* sem WebGL: fica a foto da fachada */
        });
      if (lerConsentimento() === 'aceito') carregarReal();
    },
    { rootMargin: '400px' },
  ).observe(caixa);
}
