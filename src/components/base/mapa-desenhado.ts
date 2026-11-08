// Mapa 3D desenhado (Three.js, nada de terceiros): quarteirões esquemáticos em grafite com arestas de luz, a
// avenida larga no meio e a Prime House acesa, com o alfinete laranja e o nome da rua. Gira sozinho (sem
// movimento reduzido) e com o arraste. Baseado no mapa desenhado do site do Dr. Agenor (Marco Oliver).
import {
  BoxGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  Fog,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  RingGeometry,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  WebGLRenderer,
} from 'three';

const BREU = 0x0a0a0b;
const GRAFITE = 0x161719;
const LUZ = 0xfff4e0;
const LARANJA = 0xec8a2a;

export interface MapaDesenhado {
  /** liga/desliga o laço de desenho (ex.: quando o mapa real está na frente) */
  ativo(sim: boolean): void;
}

export function montarMapaDesenhado(
  caixa: HTMLElement,
  canvas: HTMLCanvasElement,
  rotulo: string,
  reduzido: boolean,
): MapaDesenhado {
  // sorteio com semente: a cidade é sempre a mesma
  const rnd = ((s: number) => () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  })(1253);

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  const cena = new Scene();
  cena.fog = new Fog(BREU, 95, 215);
  cena.add(new HemisphereLight(0xfff1dc, BREU, 0.9));
  const sol = new DirectionalLight(0xffffff, 0.7);
  sol.position.set(40, 80, 30);
  cena.add(sol);
  const chao = new Mesh(new PlaneGeometry(500, 500), new MeshLambertMaterial({ color: BREU }));
  chao.rotation.x = -Math.PI / 2;
  cena.add(chao);

  // grade de quarteirões; a coluna AV é a avenida (mais larga)
  const NX = 7;
  const NZ = 6;
  const BS = 15;
  const ST = 5;
  const AV = 3;
  const LARG_AV = 12;
  const xDe = (i: number) =>
    (i - (NX - 1) / 2) * (BS + ST) + (i >= AV ? (LARG_AV - ST) / 2 : -(LARG_AV - ST) / 2);
  const zDe = (j: number) => (j - (NZ - 1) / 2) * (BS + ST);
  const aresta = new LineBasicMaterial({ color: LUZ, transparent: true, opacity: 0.16 });
  const cidade = new Group();
  cena.add(cidade);

  // ruas: fios de luz fracos; a avenida, uma faixa mais clara
  const rua = new MeshBasicMaterial({ color: 0x232427 });
  const comprimento = NZ * (BS + ST) + ST;
  const largura = NX * (BS + ST) + LARG_AV;
  for (let j = 0; j <= NZ; j++) {
    const m = new Mesh(new BoxGeometry(largura, 0.05, 0.45), rua);
    m.position.set(0, 0.06, zDe(j) - (BS + ST) / 2);
    cidade.add(m);
  }
  const avenida = new Mesh(
    new BoxGeometry(LARG_AV - 2, 0.05, comprimento),
    new MeshBasicMaterial({ color: 0x2b2a27 }),
  );
  const xAv = (xDe(AV - 1) + xDe(AV)) / 2;
  avenida.position.set(xAv, 0.06, 0);
  cidade.add(avenida);
  // faixa central da avenida, tracejada em luz
  for (let k = -NZ; k <= NZ; k++) {
    const f = new Mesh(
      new BoxGeometry(0.25, 0.06, 4),
      new MeshBasicMaterial({ color: LUZ, transparent: true, opacity: 0.35 }),
    );
    f.position.set(xAv, 0.1, k * 9);
    cidade.add(f);
  }

  let academia: Mesh | null = null;
  for (let i = 0; i < NX; i++)
    for (let j = 0; j < NZ; j++) {
      const cx = xDe(i);
      const cz = zDe(j);
      const base = new Mesh(
        new BoxGeometry(BS, 0.5, BS),
        new MeshLambertMaterial({ color: 0x111214 }),
      );
      base.position.set(cx, 0.25, cz);
      cidade.add(base);
      const n = 1 + ((rnd() * 3) | 0);
      const w = BS / n;
      for (let k = 0; k < n; k++) {
        // a Prime House: de frente para a avenida (primeiro lote do quarteirão à direita dela)
        const ehAcademia = i === AV && j === 2 && k === 0;
        const h = ehAcademia ? 9 : 2 + rnd() * 7 * (1 - Math.hypot(i - AV, j - 2.5) / 6.5);
        const bw = w - 1.2;
        const bd = BS - 2 - rnd() * 3;
        const cor = ehAcademia
          ? new Color(0x1c1c1f)
          : new Color(GRAFITE).offsetHSL(0, 0, rnd() * 0.05);
        const mat = new MeshLambertMaterial({ color: cor });
        if (ehAcademia) mat.emissive = new Color(0x0d0c0b);
        const m = new Mesh(new BoxGeometry(bw, h, bd), mat);
        m.position.set(cx - BS / 2 + w * (k + 0.5), 0.5 + h / 2, cz);
        cidade.add(m);
        const linha = new LineSegments(
          new EdgesGeometry(m.geometry),
          ehAcademia ? new LineBasicMaterial({ color: LUZ }) : aresta,
        );
        linha.position.copy(m.position);
        cidade.add(linha);
        if (ehAcademia) academia = m;
      }
    }
  if (!academia) throw new Error('[mapa] sem a academia');
  const alvo = (academia as Mesh).position;

  // alfinete laranja girando e um anel que pulsa no chão
  const pino = new Group();
  const laranja = new MeshLambertMaterial({ color: LARANJA, emissive: new Color(0x3a1d05) });
  const cone = new Mesh(new ConeGeometry(2.2, 5.5, 24), laranja);
  cone.rotation.x = Math.PI;
  cone.position.y = 2.75;
  const bola = new Mesh(new SphereGeometry(2.8, 28, 20), laranja);
  bola.position.y = 6.8;
  const ponto = new Mesh(new SphereGeometry(1, 16, 12), new MeshBasicMaterial({ color: LUZ }));
  ponto.position.set(0, 7, 2.2);
  pino.add(cone, bola, ponto);
  const ALTURA_PINO = 12.5;
  pino.position.set(alvo.x, ALTURA_PINO, alvo.z);
  cena.add(pino);
  const pulso = new Mesh(
    new RingGeometry(5, 5.6, 64),
    new MeshBasicMaterial({
      color: LARANJA,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      side: DoubleSide,
    }),
  );
  pulso.rotation.x = -Math.PI / 2;
  pulso.position.set(alvo.x, 0.6, alvo.z);
  cena.add(pulso);

  // nome da rua numa placa (canvas → sprite)
  const tela = document.createElement('canvas');
  tela.width = 640;
  tela.height = 96;
  const g = tela.getContext('2d');
  if (g) {
    g.fillStyle = 'rgba(255,244,224,0.96)';
    g.fillRect(8, 8, 624, 80);
    g.fillStyle = '#0A0A0B';
    g.font = '600 38px "Inter Tight", Arial, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(rotulo, 320, 50);
  }
  const placa = new Sprite(
    new SpriteMaterial({ map: new CanvasTexture(tela), transparent: true, depthTest: false }),
  );
  placa.scale.set(34, 5.1, 1);
  placa.position.set(alvo.x, 24, alvo.z);
  cena.add(placa);

  const cam = new PerspectiveCamera(32, 1, 1, 600);
  let az = 0.7;
  let vel = 0;
  let segurando = false;
  let ultimoX = 0;
  let visivel = false;
  let ligado = true;
  let raf = 0;
  const t0 = performance.now();
  let auto = !reduzido;

  const posicionar = () => {
    const W = caixa.clientWidth || 1;
    const H = caixa.clientHeight || 1;
    const k = W / H < 1.1 ? 1.25 : 1;
    const R = 92 * k;
    cam.position.set(alvo.x + Math.sin(az) * R, 62 * k, alvo.z + Math.cos(az) * R);
    cam.lookAt(alvo.x, 6, alvo.z);
  };
  const quadro = () => {
    raf = 0;
    if (!visivel || !ligado || document.hidden) return;
    const t = (performance.now() - t0) / 1000;
    if (!segurando) {
      if (Math.abs(vel) > 0.0003) {
        az += vel;
        vel *= 0.94;
      } else if (auto) az += 0.0022;
    }
    if (!reduzido) {
      pino.position.y = ALTURA_PINO + Math.sin(t * 2.2) * 0.8;
      pino.rotation.y = t * 0.8;
      const fase = (t % 2.4) / 2.4;
      pulso.scale.set(1 + fase * 1.6, 1 + fase * 1.6, 1);
      (pulso.material as MeshBasicMaterial).opacity = 0.7 * (1 - fase);
    }
    posicionar();
    renderer.render(cena, cam);
    // sem movimento reduzido: só redesenha enquanto há arraste ou inércia
    if (!reduzido || segurando || Math.abs(vel) > 0.0003) raf = requestAnimationFrame(quadro);
  };
  const chutar = () => {
    if (!raf && visivel && ligado && !document.hidden) raf = requestAnimationFrame(quadro);
  };
  const redimensionar = () => {
    const W = caixa.clientWidth || 1;
    const H = caixa.clientHeight || 1;
    renderer.setSize(W, H, false);
    cam.aspect = W / H;
    cam.updateProjectionMatrix();
    posicionar();
    renderer.render(cena, cam);
  };
  new ResizeObserver(redimensionar).observe(caixa);
  redimensionar();
  new IntersectionObserver(([e]) => {
    visivel = !!e?.isIntersecting;
    chutar();
  }).observe(caixa);
  document.addEventListener('visibilitychange', chutar);

  canvas.addEventListener('pointerdown', (e) => {
    segurando = true;
    ultimoX = e.clientX;
    vel = 0;
    auto = false;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      /* sem captura: segue sem ela */
    }
    chutar();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!segurando) return;
    const dx = e.clientX - ultimoX;
    ultimoX = e.clientX;
    az -= dx * 0.008;
    vel = -dx * 0.008;
  });
  const soltar = () => {
    segurando = false;
    chutar();
  };
  canvas.addEventListener('pointerup', soltar);
  canvas.addEventListener('pointercancel', soltar);
  // teclado: setas giram (o canvas é focável e descrito para leitores de tela)
  canvas.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    auto = false;
    az += e.key === 'ArrowLeft' ? 0.18 : -0.18;
    posicionar();
    renderer.render(cena, cam);
  });

  return {
    ativo(sim) {
      ligado = sim;
      if (sim) chutar();
    },
  };
}
