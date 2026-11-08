export {};
// Vídeos do hero (1 no celular, 3 no desktop): começam depois do LCP (ou quando a abertura manda), só visíveis
// e sem movimento reduzido. Os painéis laterais só tocam no desktop. Um botão pausa e retoma todos (WCAG 2.2.2).
const reduzido = matchMedia('(prefers-reduced-motion: reduce)');
const desktop = matchMedia('(min-width: 64rem)');

for (const hero of document.querySelectorAll<HTMLElement>('[data-hero]')) {
  const videos = [...hero.querySelectorAll<HTMLVideoElement>('[data-hero-video]')];
  const botao = hero.querySelector<HTMLButtonElement>('[data-hero-pausa]');
  if (!videos.length || !botao) continue;
  const pausar = botao.querySelector('[data-rotulo-pausar]');
  const tocar = botao.querySelector('[data-rotulo-tocar]');
  let liberado = false;
  let pausadoPeloUsuario = reduzido.matches;
  let visivel = true;
  const ativos = () => videos.filter((v) => !v.hasAttribute('data-lado') || desktop.matches);
  const algumTocando = () => ativos().some((v) => !v.paused);

  const rotulo = () => {
    const t = algumTocando();
    pausar?.toggleAttribute('hidden', !t);
    tocar?.toggleAttribute('hidden', t);
  };
  const tentar = () => {
    if (!liberado || !visivel || pausadoPeloUsuario) return;
    for (const v of ativos()) v.play().catch(() => undefined);
  };
  const pararTodos = () => {
    for (const v of videos) v.pause();
  };
  for (const v of videos) {
    v.addEventListener('playing', () => v.classList.add('tocando'));
    v.addEventListener('play', rotulo);
    v.addEventListener('pause', rotulo);
  }
  botao.addEventListener('click', () => {
    liberado = true;
    if (algumTocando()) {
      pausadoPeloUsuario = true;
      pararTodos();
    } else {
      pausadoPeloUsuario = false;
      tentar();
    }
  });
  desktop.addEventListener('change', () => {
    if (!desktop.matches) for (const v of videos) if (v.hasAttribute('data-lado')) v.pause();
    tentar();
  });

  new IntersectionObserver(
    ([e]) => {
      visivel = !!e?.isIntersecting;
      if (visivel) tentar();
      else pararTodos();
    },
    { threshold: 0.2 },
  ).observe(hero);

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
