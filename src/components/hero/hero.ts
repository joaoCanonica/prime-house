export {};
// Vídeo do hero: começa depois do LCP (ou quando a abertura manda), só visível e sem movimento reduzido.
// O botão pausar fica sempre disponível (WCAG 2.2.2).
const reduzido = matchMedia('(prefers-reduced-motion: reduce)');

for (const hero of document.querySelectorAll<HTMLElement>('[data-hero]')) {
  const v = hero.querySelector<HTMLVideoElement>('[data-hero-video]');
  const botao = hero.querySelector<HTMLButtonElement>('[data-hero-pausa]');
  if (!v || !botao) continue;
  const pausar = botao.querySelector('[data-rotulo-pausar]');
  const tocar = botao.querySelector('[data-rotulo-tocar]');
  let liberado = false;
  let pausadoPeloUsuario = reduzido.matches;
  let visivel = true;

  const rotulo = () => {
    pausar?.toggleAttribute('hidden', v.paused);
    tocar?.toggleAttribute('hidden', !v.paused);
  };
  const tentar = () => {
    if (liberado && visivel && !pausadoPeloUsuario) v.play().catch(() => undefined);
  };
  v.addEventListener('playing', () => v.classList.add('tocando'));
  v.addEventListener('play', rotulo);
  v.addEventListener('pause', rotulo);
  botao.addEventListener('click', () => {
    liberado = true;
    if (v.paused) {
      pausadoPeloUsuario = false;
      v.play().catch(() => undefined);
    } else {
      pausadoPeloUsuario = true;
      v.pause();
    }
  });

  new IntersectionObserver(
    ([e]) => {
      visivel = !!e?.isIntersecting;
      if (visivel) tentar();
      else v.pause();
    },
    { threshold: 0.2 },
  ).observe(v);

  const liberar = () => {
    if (liberado) return;
    liberado = true;
    botao.hidden = false;
    rotulo();
    tentar();
  };
  const html = document.documentElement;
  if (html.dataset['abertura'] === 'on') {
    document.addEventListener('ph:abertura-video', liberar, { once: true });
    document.addEventListener('ph:abertura-fim', liberar, { once: true });
  } else {
    // depois do LCP: não disputa banda com o pôster
    const depois = () =>
      'requestIdleCallback' in window
        ? requestIdleCallback(liberar, { timeout: 1500 })
        : setTimeout(liberar, 300);
    if (document.readyState === 'complete') depois();
    else addEventListener('load', depois, { once: true });
  }
}
