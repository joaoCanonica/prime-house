export {};
// Timeline da abertura (WAAPI). Tempos em ms a partir do primeiro quadro.
//   0–400      Breu e "05:00"
//   400–1600   as luminárias acendem de perto para longe (3 cintilam)
//   1600–2300  a camada fica transparente: o pôster real (já pintado) aparece, 1,04 → 1,0; PRIME HOUSE ACADEMIA
//   2300–3000  o logo vai para o cabeçalho (View Transition ou FLIP); o vídeo começa; H1 e botões entram
const html = document.documentElement;
const raiz = document.querySelector<HTMLElement>('[data-abertura-camada]');
const CHAVE = 'ph-abertura';
const TOTAL = 3000;
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

  // medidas do FLIP antes de qualquer animação (o fill "backwards" já desloca o logo)
  const rA = logo?.getBoundingClientRect();
  const rB = destino?.getBoundingClientRect();
  const animacoes: Animation[] = [];
  const anima = (el: Element | null, quadros: Keyframe[], o: KeyframeAnimationOptions) => {
    if (!el) return;
    animacoes.push(el.animate(quadros, { fill: 'both', easing: 'linear', ...o }));
  };

  // 0–400 / 1600: "05:00" aparece e sai quando a luz acende
  anima(hora, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: 1600, easing: CURVA });

  // 400–1600: luminárias (ordem do TetoDeLuz: de perto para longe); 3 delas cintilam
  const passo = leds.length > 1 ? 1050 / (leds.length - 1) : 0;
  const cintilam = new Set([1, 7, 16]);
  leds.forEach((led, i) => {
    const delay = 400 + i * passo;
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
        { duration: 240, delay },
      );
    } else {
      anima(led, [{ opacity: 0 }, { opacity: 1 }], { duration: 90, delay, easing: CURVA });
    }
  });

  // 1600–2300: a camada fica transparente; o pôster do hero (LCP, já pintado) aparece 1,04 → 1,0
  anima(fundo, [{ opacity: 1 }, { opacity: 0 }], { duration: 700, delay: 1600, easing: CURVA });
  anima(posterHero, [{ transform: 'scale(1.04)' }, { transform: 'scale(1)' }], {
    duration: 900,
    delay: 1600,
    easing: CURVA,
  });
  anima(teto, [{ opacity: 1 }, { opacity: 0 }], { duration: 600, delay: 2000, easing: CURVA });
  anima(
    logo,
    [
      { opacity: 0, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'none' },
    ],
    { duration: 450, delay: 1650, easing: CURVA },
  );

  // 2300–3000: H1, apoio e botões entram
  entram.forEach((el, i) => {
    anima(
      el,
      [
        { opacity: 0, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 450, delay: 2350 + i * 120, easing: CURVA },
    );
  });

  // FLIP do logo grande para o do cabeçalho (sempre no modo congelado e sem View Transition)
  const usaVT = congelarEm === null && 'startViewTransition' in document;
  if (logo && rA && rB && !usaVT) {
    const a = rA;
    const b = rB;
    const s = b.width / a.width;
    const dx = b.left - a.left;
    const dy = b.top - a.top;
    animacoes.push(
      logo.animate(
        [
          { transform: 'none', transformOrigin: '0 0' },
          { transform: `translate(${dx}px, ${dy}px) scale(${s})`, transformOrigin: '0 0' },
        ],
        { duration: 650, delay: 2300, easing: CURVA, fill: 'both', composite: 'add' },
      ),
    );
  }

  let encerrado = false;
  let timerVideo = 0;
  let timerVT = 0;
  const encerrar = (pulou: boolean) => {
    if (encerrado) return;
    encerrado = true;
    clearTimeout(timerVideo);
    clearTimeout(timerVT);
    const focoDentro = raiz.contains(document.activeElement);
    for (const an of animacoes) an.cancel();
    marcarVista();
    html.dataset['abertura'] = 'fim';
    raiz.hidden = true;
    if (logo) logo.style.viewTransitionName = '';
    if (destino) destino.style.viewTransitionName = '';
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
      2300,
    );
    if (usaVT && logo && destino) {
      timerVT = window.setTimeout(() => {
        logo.style.viewTransitionName = 'ph-logo';
        try {
          document
            .startViewTransition(() => {
              logo.style.viewTransitionName = '';
              logo.style.visibility = 'hidden';
              destino.style.viewTransitionName = 'ph-logo';
              html.dataset['logo'] = 'cabecalho';
            })
            .finished.finally(() => {
              destino.style.viewTransitionName = '';
            });
        } catch {
          logo.style.visibility = 'hidden';
        }
      }, 2300);
    }
    const ultima = animacoes.reduce<Animation | null>((m, a) => {
      const t = a.effect?.getComputedTiming().endTime ?? 0;
      return !m || t > (m.effect?.getComputedTiming().endTime ?? 0) ? a : m;
    }, null);
    // garante o fim em ≤ 3,0 s mesmo se alguma animação atrasar
    window.setTimeout(() => encerrar(false), TOTAL);
    ultima?.finished.then(() => encerrar(false)).catch(() => undefined);
  }
}
