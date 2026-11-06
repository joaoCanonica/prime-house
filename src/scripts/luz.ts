// Liga a luz uma vez ao entrar na tela e controla os vídeos mudos (toca só visível; pausa sempre disponível).
const reduzido = matchMedia('(prefers-reduced-motion: reduce)');

const luzes = new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('acesa');
      luzes.unobserve(e.target);
    }
  },
  { threshold: 0.2 },
);
for (const el of document.querySelectorAll('[data-luz]:not(.acesa)')) luzes.observe(el);

const videos = new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      const v = e.target as HTMLVideoElement;
      const pausadoPeloUsuario = v.dataset['pausado'] === '1';
      if (e.isIntersecting && !reduzido.matches && !pausadoPeloUsuario)
        v.play().catch(() => undefined);
      else v.pause();
    }
  },
  { threshold: 0.25 },
);

for (const caixa of document.querySelectorAll<HTMLElement>('[data-video]')) {
  const v = caixa.querySelector('video');
  const botao = caixa.querySelector<HTMLButtonElement>('[data-video-controle]');
  if (!v || !botao) continue;
  const [pausar, tocar] = [
    botao.querySelector('[data-rotulo-pausar]'),
    botao.querySelector('[data-rotulo-tocar]'),
  ];
  const atualizar = () => {
    pausar?.toggleAttribute('hidden', v.paused);
    tocar?.toggleAttribute('hidden', !v.paused);
  };
  v.addEventListener('play', atualizar);
  v.addEventListener('pause', atualizar);
  botao.addEventListener('click', () => {
    if (v.paused) {
      v.dataset['pausado'] = '0';
      v.play().catch(() => undefined);
    } else {
      v.dataset['pausado'] = '1';
      v.pause();
    }
  });
  botao.hidden = false;
  atualizar();
  videos.observe(v);
}
