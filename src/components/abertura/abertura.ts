export {};
// Timeline da abertura (WAAPI). Tempos em ms a partir do primeiro quadro.
//   0–600      Breu e "05:00"
//   600–2600   as luminárias acendem de perto para longe (3 cintilam)
//   2800–4300  PRIME HOUSE ACADEMIA aparece sozinho, sob as luzes (sem vídeo por trás)
//   4300–5100  o letreiro se dissolve no lugar e a sala real (vídeo) aparece por trás; o logo do cabeçalho acende
//   5000–5600  apoio, botões e informações entram
const html = document.documentElement;
const raiz = document.querySelector<HTMLElement>('[data-abertura-camada]');
const CHAVE = 'ph-abertura';
// Tempos (ms). A abertura ficou mais longa (pedido do João, 08/11/2026): luzes com calma, letreiro sozinho, revelação.
const T = {
  horaSai: 2600,
  ledsInicio: 600,
  ledsFim: 2600,
  logoEntra: 2800,
  revela: 4300,
  revelaDur: 800,
  entram: 5000,
} as const;
const TOTAL = 5600;
const CURVA = 'cubic-bezier(0.16, 1, 0.3, 1)';

function marcarVista() {
  try {
    sessionStorage.setItem(CHAVE, '1');
  } catch {
    /* modo privado: tudo bem, só não lembra */
  }
}

if (raiz && html.dataset['abertura'] === 'on') {
  const q = new URLSearchParams(location.search).get('abertura');
  const congelarEm = q !== null && q !== '' && !Number.isNaN(Number(q)) ? Number(q) : null;
  const $ = <T extends Element>(s: string, base: ParentNode = raiz) => base.querySelector<T>(s);
  const fundo = $<HTMLElement>('[data-ab-fundo]');
  const hora = $<HTMLElement>('[data-ab-hora]');
  const teto = $<HTMLElement>('[data-ab-teto]');
  const logo = $<HTMLElement>('[data-ab-logo]');
  const pular = $<HTMLButtonElement>('[data-ab-pular]');
  const leds = [...raiz.querySelectorAll<SVGElement>('.luz-led')];
  const posterHero = document.querySelector<HTMLElement>('[data-hero-midia] picture');
  const destino = document.querySelector<HTMLElement>('[data-logo-destino] svg');
  const entram = [...document.querySelectorAll<HTMLElement>('[data-entra]')];

  const animacoes: Animation[] = [];
  const anima = (el: Element | null, quadros: Keyframe[], o: KeyframeAnimationOptions) => {
    if (!el) return;
    animacoes.push(el.animate(quadros, { fill: 'both', easing: 'linear', ...o }));
  };

  // 0–2700: "05:00" no escuro; as luminárias acendem uma a uma, de perto para longe (3 cintilam)
  anima(hora, [{ opacity: 1 }, { opacity: 0 }], { duration: 400, delay: T.horaSai, easing: CURVA });
  const passo = leds.length > 1 ? (T.ledsFim - T.ledsInicio) / (leds.length - 1) : 0;
  const cintilam = new Set([1, 7, 16]);
  leds.forEach((led, i) => {
    const delay = T.ledsInicio + i * passo;
    if (cintilam.has(i)) {
      anima(
        led,
        [
          { opacity: 0 },
          { opacity: 0.85, offset: 0.12 },
          { opacity: 0.08, offset: 0.22 },
          { opacity: 1, offset: 0.4 },
          { opacity: 0.3, offset: 0.52 },
          { opacity: 1, offset: 0.7 },
          { opacity: 1 },
        ],
        { duration: 320, delay },
      );
    } else {
      anima(led, [{ opacity: 0 }, { opacity: 1 }], { duration: 140, delay, easing: CURVA });
    }
  });

  // 2800–4300: o letreiro aparece SOZINHO sob as luzes (a camada continua opaca: nada do vídeo por trás)
  anima(
    logo,
    [
      { opacity: 0, transform: 'translateY(12px)' },
      { opacity: 1, transform: 'none', offset: 0.35 },
      { opacity: 1, transform: 'none', offset: 0.78 },
      // 4300–5100: dissolve no lugar, crescendo de leve, enquanto a sala real aparece por trás
      { opacity: 0, transform: 'scale(1.06)' },
    ],
    { duration: T.revela + T.revelaDur - T.logoEntra, delay: T.logoEntra, easing: CURVA },
  );
  anima(fundo, [{ opacity: 1 }, { opacity: 0 }], {
    duration: T.revelaDur,
    delay: T.revela,
    easing: CURVA,
  });
  anima(teto, [{ opacity: 1 }, { opacity: 0 }], {
    duration: T.revelaDur - 100,
    delay: T.revela + 100,
    easing: CURVA,
  });
  anima(posterHero, [{ transform: 'scale(1.06)' }, { transform: 'scale(1)' }], {
    duration: T.revelaDur + 400,
    delay: T.revela,
    easing: CURVA,
  });
  // o logo do cabeçalho acende quando o letreiro grande já saiu
  anima(destino, [{ opacity: 0 }, { opacity: 1 }], {
    duration: 500,
    delay: T.revela + T.revelaDur - 300,
    easing: CURVA,
  });

  // 5000–5600: apoio, botões e informações entram (o H1 já está pintado por baixo desde o 1º quadro)
  entram.forEach((el, i) => {
    anima(
      el,
      [
        { opacity: 0, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 500, delay: T.entram + i * 120, easing: CURVA },
    );
  });

  let encerrado = false;
  let timerVideo = 0;
  const encerrar = (pulou: boolean) => {
    if (encerrado) return;
    encerrado = true;
    clearTimeout(timerVideo);
    const focoDentro = raiz.contains(document.activeElement);
    for (const an of animacoes) an.cancel();
    marcarVista();
    html.dataset['abertura'] = 'fim';
    raiz.hidden = true;
    html.dataset['logo'] = 'cabecalho';
    document.dispatchEvent(new CustomEvent('ph:abertura-video'));
    document.dispatchEvent(new CustomEvent('ph:abertura-fim', { detail: { pulou } }));
    if (focoDentro)
      document.querySelector<HTMLElement>('#hero-titulo')?.focus({ preventScroll: true });
    removeEventListener('keydown', aoTeclar, true);
    for (const ev of ['pointerdown', 'wheel', 'touchmove', 'scroll'] as const)
      removeEventListener(ev, aoPular, true);
  };
  const aoPular = () => encerrar(true);
  const aoTeclar = (e: KeyboardEvent) => {
    // Tab/Shift navegam até o "Pular" (Enter/Espaço o acionam); qualquer outra tecla pula
    if (['Tab', 'Shift', 'Alt', 'Control', 'Meta'].includes(e.key)) return;
    if (e.target === pular && (e.key === 'Enter' || e.key === ' ')) return;
    encerrar(true);
  };

  if (congelarEm !== null) {
    // modo de captura: congela no instante pedido
    for (const an of animacoes) {
      an.pause();
      an.currentTime = congelarEm;
    }
    if (congelarEm >= TOTAL) encerrar(false);
  } else {
    pular?.addEventListener('click', () => encerrar(true));
    addEventListener('keydown', aoTeclar, true);
    for (const ev of ['pointerdown', 'wheel', 'touchmove', 'scroll'] as const)
      addEventListener(ev, aoPular, { capture: true, passive: true });
    timerVideo = window.setTimeout(
      () => document.dispatchEvent(new CustomEvent('ph:abertura-video')),
      T.revela,
    );
    const ultima = animacoes.reduce<Animation | null>((m, a) => {
      const t = a.effect?.getComputedTiming().endTime ?? 0;
      return !m || t > (m.effect?.getComputedTiming().endTime ?? 0) ? a : m;
    }, null);
    // garante o fim no tempo total mesmo se alguma animação atrasar
    window.setTimeout(() => encerrar(false), TOTAL);
    ultima?.finished.then(() => encerrar(false)).catch(() => undefined);
  }
}
