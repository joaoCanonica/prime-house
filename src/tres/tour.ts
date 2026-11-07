// Ilha 3D: maquete "argila clara" sobre Breu, molduras de LED como linhas, zonas clicáveis e câmera por zona.
// Carregada só sob demanda (import dinâmico). Pausa fora da tela/aba oculta; libera tudo em destruir().
import {
  Box3,
  Color,
  DirectionalLight,
  Fog,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  type Object3D,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import type { OpcoesTour, Tour, Vetor3 } from './tipos.ts';

const BREU = 0x0c0b0a;
const NEVOA = 0xe9e8e5;
const LUZ = 0xfff4e0;
const VOO_MS = 1050;
const ORBITA_YAW = 0.38; // ± rad em torno da pose
const ORBITA_PITCH = 0.14;

const suave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

interface ZonaCena {
  id: string;
  nome: string;
  blocos: Mesh[];
  luzes: LineSegments<never, LineBasicMaterial>[];
  pose: Vector3;
  alvo: Vector3;
  rotulo: HTMLButtonElement;
  topo: Vector3;
}

/** Lê o cabeçalho JSON do GLB para saber quais extensões ele exige (loaders extras só se preciso). */
function extensoesDoGlb(buf: ArrayBuffer): string[] {
  const dv = new DataView(buf);
  if (dv.getUint32(0, true) !== 0x46546c67) return [];
  const tam = dv.getUint32(12, true);
  const json = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 20, tam))) as {
    extensionsUsed?: string[];
  };
  return json.extensionsUsed ?? [];
}

export async function montarTour(o: OpcoesTour): Promise<Tour> {
  const { alvo, indice } = o;
  if (!indice.maquete) throw new Error('sem maquete');

  // ---------- renderer e cena
  const canvas = document.createElement('canvas');
  canvas.className = 'tour3d__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'default' });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(BREU, 1);
  const cena = new Scene();
  cena.background = new Color(BREU);
  cena.fog = new Fog(BREU, 38, 95);
  const camera = new PerspectiveCamera(38, 1, 0.5, 220);
  cena.add(new HemisphereLight(LUZ, BREU, 1.15));
  const sol = new DirectionalLight(0xffffff, 1.6);
  sol.position.set(10, 24, 16);
  cena.add(sol);

  // ---------- modelo (Meshopt sempre; Draco e KTX2 só se o arquivo exigir)
  const resp = await fetch(indice.maquete.arquivo);
  if (!resp.ok) throw new Error(`maquete: HTTP ${resp.status}`);
  const buf = await resp.arrayBuffer();
  const ext = extensoesDoGlb(buf);
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  if (ext.includes('KHR_draco_mesh_compression')) {
    const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');
    loader.setDRACOLoader(new DRACOLoader().setDecoderPath('/modelos/libs/draco/'));
  }
  if (ext.includes('KHR_texture_basisu')) {
    const { KTX2Loader } = await import('three/examples/jsm/loaders/KTX2Loader.js');
    loader.setKTX2Loader(
      new KTX2Loader().setTranscoderPath('/modelos/libs/basis/').detectSupport(renderer),
    );
  }
  const gltf = await loader.parseAsync(buf, '');
  const modelo = gltf.scene;
  cena.add(modelo);

  // materiais: argila clara (Névoa), estrutura discreta, molduras de LED emissivas
  const argila = new MeshStandardMaterial({ color: NEVOA, roughness: 0.92, metalness: 0 });
  const piso = new MeshStandardMaterial({ color: 0x24221f, roughness: 1, metalness: 0 });
  const estrutura = new LineBasicMaterial({ color: LUZ, transparent: true, opacity: 0.22 });
  const porNome = new Map<string, Object3D>();
  modelo.traverse((n) => {
    porNome.set(n.name, n);
    if (n instanceof Mesh)
      n.material = n.name === 'piso' || n.parent?.name === 'piso' ? piso : argila;
    if (n instanceof LineSegments) n.material = estrutura;
  });

  // ---------- zonas
  const camadaRotulos = document.createElement('div');
  camadaRotulos.className = 'tour3d__rotulos';
  camadaRotulos.setAttribute('aria-hidden', 'true');
  const zonas = new Map<string, ZonaCena>();
  // contrato: extras { tipo: 'zona'|'luz'|'grupo'|'pose'|'alvo', zona: '<id>' } (o GLTFLoader limpa ":" dos nomes)
  const porTipo = new Map<string, Object3D>();
  modelo.traverse((n) => {
    const u = n.userData as { tipo?: string; zona?: string };
    if (u.tipo && u.zona && !porTipo.has(`${u.tipo}:${u.zona}`))
      porTipo.set(`${u.tipo}:${u.zona}`, n);
  });
  const doNo = (prefixo: string, id: string) =>
    porTipo.get(`${prefixo}:${id}`) ??
    porNome.get(`${prefixo}${id}`) ??
    porNome.get(`${prefixo}_${id}`);
  for (const z of o.zonas) {
    const grupo = doNo('grupo', z.id);
    const blocos: Mesh[] = [];
    const luzes: LineSegments<never, LineBasicMaterial>[] = [];
    const coletar = (raiz: Object3D | undefined) =>
      raiz?.traverse((n) => {
        if (n instanceof Mesh) blocos.push(n);
        if (n instanceof LineSegments) {
          n.material = new LineBasicMaterial({ color: LUZ, transparent: true, opacity: 0.3 });
          luzes.push(n as LineSegments<never, LineBasicMaterial>);
        }
      });
    if (grupo) coletar(grupo);
    coletar(doNo('zona', z.id));
    coletar(doNo('luz', z.id));
    if (!blocos.length) continue;
    const caixa = new Box3();
    for (const b of blocos) caixa.expandByObject(b);
    const centro = caixa.getCenter(new Vector3());
    const pose = z.camera
      ? new Vector3(...z.camera.posicao)
      : doNo('pose', z.id)?.getWorldPosition(new Vector3());
    const alvoZ = z.camera
      ? new Vector3(...z.camera.alvo)
      : doNo('alvo', z.id)?.getWorldPosition(new Vector3());
    const rotulo = document.createElement('button');
    rotulo.type = 'button';
    rotulo.tabIndex = -1;
    rotulo.className = 'tour3d__rotulo';
    rotulo.textContent = z.nome;
    rotulo.addEventListener('click', () => selecionar(z.id, true));
    camadaRotulos.append(rotulo);
    zonas.set(z.id, {
      id: z.id,
      nome: z.nome,
      blocos,
      luzes,
      pose: pose ?? centro.clone().add(new Vector3(0, 10, 12)),
      alvo: alvoZ ?? centro,
      rotulo,
      topo: new Vector3(centro.x, caixa.max.y + 0.6, centro.z),
    });
  }
  const geral = {
    pose: doNo('pose', 'geral')?.getWorldPosition(new Vector3()) ?? new Vector3(0, 26, 34),
    alvo: doNo('alvo', 'geral')?.getWorldPosition(new Vector3()) ?? new Vector3(),
  };

  alvo.append(canvas, camadaRotulos);

  // ---------- câmera: voo entre poses + órbita pequena
  const atual = { pose: geral.pose.clone(), alvo: geral.alvo.clone() };
  let voo: { de: typeof atual; para: typeof atual; t0: number } | null = null;
  const orbita = { yaw: 0, pitch: 0 };
  let ativa = '';
  let destaque: { id: string; t0: number } | null = null;
  let sujo = true;
  const pedirRender = () => {
    sujo = true;
  };

  function selecionar(id: string, avisar: boolean, animar = true) {
    const z = zonas.get(id);
    if (!z) return;
    ativa = id;
    orbita.yaw = 0;
    orbita.pitch = 0;
    const para = { pose: z.pose.clone(), alvo: z.alvo.clone() };
    if (animar && !o.reduzido)
      voo = {
        de: { pose: atual.pose.clone(), alvo: atual.alvo.clone() },
        para,
        t0: performance.now(),
      };
    else {
      atual.pose.copy(para.pose);
      atual.alvo.copy(para.alvo);
      voo = null;
    }
    destaque = { id, t0: performance.now() };
    for (const [zid, zc] of zonas) zc.rotulo.classList.toggle('ativo', zid === id);
    if (avisar) o.aoSelecionar?.(id);
    pedirRender();
  }

  // ---------- interação: arrastar gira pouco; o canvas deixa a rolagem vertical para a página (touch-action: pan-y)
  const ray = new Raycaster();
  const ponteiro = new Vector2();
  let arrasto: { x: number; y: number; yaw: number; pitch: number; moveu: boolean } | null = null;
  const aoDescer = (e: PointerEvent) => {
    arrasto = { x: e.clientX, y: e.clientY, yaw: orbita.yaw, pitch: orbita.pitch, moveu: false };
  };
  const aoMover = (e: PointerEvent) => {
    if (!arrasto) return;
    const dx = e.clientX - arrasto.x;
    const dy = e.clientY - arrasto.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) arrasto.moveu = true;
    if (!arrasto.moveu) return;
    const w = canvas.clientWidth || 1;
    orbita.yaw = Math.max(-ORBITA_YAW, Math.min(ORBITA_YAW, arrasto.yaw - (dx / w) * 1.6));
    if (e.pointerType === 'mouse')
      orbita.pitch = Math.max(
        -ORBITA_PITCH,
        Math.min(ORBITA_PITCH, arrasto.pitch + (dy / w) * 1.2),
      );
    pedirRender();
  };
  const aoSubir = (e: PointerEvent) => {
    if (arrasto && !arrasto.moveu) {
      const r = canvas.getBoundingClientRect();
      ponteiro.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1,
      );
      ray.setFromCamera(ponteiro, camera);
      const alvos = [...zonas.values()].flatMap((z) => z.blocos);
      const hit = ray.intersectObjects(alvos, false)[0];
      if (hit)
        for (const z of zonas.values())
          if (z.blocos.includes(hit.object as Mesh)) selecionar(z.id, true);
    }
    arrasto = null;
  };
  canvas.addEventListener('pointerdown', aoDescer);
  window.addEventListener('pointermove', aoMover, { passive: true });
  window.addEventListener('pointerup', aoSubir);
  window.addEventListener('pointercancel', () => (arrasto = null));

  // ---------- tamanho
  const ajustar = () => {
    const w = alvo.clientWidth;
    const h = alvo.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 700 ? 1.75 : 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    pedirRender();
  };
  const ro = new ResizeObserver(ajustar);
  ro.observe(alvo);
  ajustar();

  // ---------- quadro
  const tmp = new Vector3();
  const offset = new Vector3();
  let fpsQuadros = 0;
  let fpsT0 = performance.now();
  const fpsEl = o.medirFps
    ? Object.assign(document.createElement('output'), { className: 'tour3d__fps' })
    : null;
  if (fpsEl) alvo.append(fpsEl);
  let real: { objetos: Object3D[] } | null = null;

  function quadro(agora: number) {
    let animando = false;
    if (voo) {
      const t = Math.min(1, (agora - voo.t0) / VOO_MS);
      const k = suave(t);
      atual.pose.lerpVectors(voo.de.pose, voo.para.pose, k);
      atual.alvo.lerpVectors(voo.de.alvo, voo.para.alvo, k);
      if (t >= 1) voo = null;
      animando = true;
    }
    if (destaque) {
      // a moldura da zona ativa acende (2 cintilações curtas); as outras ficam baixas
      const t = agora - destaque.t0;
      const cint =
        o.reduzido || t > 280 ? 1 : ([0.15, 0.9, 0.2, 1, 0.45, 1][Math.floor(t / 47)] ?? 1);
      for (const z of zonas.values())
        for (const l of z.luzes) l.material.opacity = z.id === destaque.id ? cint : 0.22;
      if (t <= 280 && !o.reduzido) animando = true;
    }
    if (o.medirFps && !real) {
      orbita.yaw = Math.sin(agora / 1600) * ORBITA_YAW;
      animando = true;
    }
    if (!sujo && !animando) return;
    sujo = false;

    offset.subVectors(atual.pose, atual.alvo);
    const r = offset.length();
    const yaw = Math.atan2(offset.x, offset.z) + orbita.yaw;
    const pitch = Math.asin(offset.y / r) + orbita.pitch;
    camera.position.set(
      atual.alvo.x + r * Math.cos(pitch) * Math.sin(yaw),
      atual.alvo.y + r * Math.sin(pitch),
      atual.alvo.z + r * Math.cos(pitch) * Math.cos(yaw),
    );
    camera.lookAt(atual.alvo);
    renderer.render(cena, camera);

    // rótulos (hotspots em HTML) acompanham as zonas
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    for (const z of zonas.values()) {
      tmp.copy(z.topo).project(camera);
      const fora = tmp.z > 1 || Math.abs(tmp.x) > 1.05 || Math.abs(tmp.y) > 1.05 || !!real;
      z.rotulo.style.transform = `translate(${((tmp.x + 1) / 2) * w}px, ${((1 - tmp.y) / 2) * h}px) translate(-50%, -100%)`;
      z.rotulo.hidden = fora;
    }
    if (fpsEl) {
      fpsQuadros++;
      if (agora - fpsT0 >= 1000) {
        fpsEl.value = `${Math.round((fpsQuadros * 1000) / (agora - fpsT0))} fps · ${renderer.info.render.calls} draw calls · ${renderer.info.render.triangles} tri`;
        fpsEl.dataset['fps'] = String(Math.round((fpsQuadros * 1000) / (agora - fpsT0)));
        fpsQuadros = 0;
        fpsT0 = agora;
      }
    }
  }

  // ---------- pausa: fora da tela ou aba oculta → setAnimationLoop(null)
  let visivel = true;
  const rodar = () => {
    const deve = visivel && document.visibilityState === 'visible';
    renderer.setAnimationLoop(deve ? quadro : null);
    if (deve) pedirRender();
  };
  const io = new IntersectionObserver(([e]) => {
    visivel = !!e?.isIntersecting;
    rodar();
  });
  io.observe(alvo);
  document.addEventListener('visibilitychange', rodar);

  const inicial = o.zonaInicial && zonas.has(o.zonaInicial) ? o.zonaInicial : null;
  if (inicial) selecionar(inicial, false, false);
  rodar();

  function sairDoReal() {
    if (!real) return;
    for (const ob of real.objetos) {
      cena.remove(ob);
      (ob as { dispose?: () => void }).dispose?.();
    }
    real = null;
    modelo.visible = true;
    pedirRender();
  }

  return {
    irPara: (id, animar = true) => {
      if (id !== ativa) selecionar(id, false, animar);
    },
    async verDeVerdade(id, progresso, sinal) {
      const s = indice.splats[id];
      if (!s) throw new Error('sem splat');
      const r = await fetch(s.arquivo, { signal: sinal });
      if (!r.ok || !r.body) throw new Error(`splat: HTTP ${r.status}`);
      const total = Number(r.headers.get('content-length')) || s.bytes;
      const leitor = r.body.getReader();
      const partes: Uint8Array[] = [];
      let lidos = 0;
      for (;;) {
        const { done, value } = await leitor.read();
        if (done) break;
        partes.push(value);
        lidos += value.length;
        progresso(Math.min(1, lidos / total));
      }
      const bytes = new Uint8Array(lidos);
      let p = 0;
      for (const parte of partes) {
        bytes.set(parte, p);
        p += parte.length;
      }
      const { SparkRenderer, SplatMesh } = await import('@sparkjsdev/spark');
      const spark = new SparkRenderer({ renderer });
      const splat = new SplatMesh({ fileBytes: bytes, fileName: s.arquivo });
      cena.add(spark, splat);
      modelo.visible = false;
      real = { objetos: [spark, splat] };
      pedirRender();
    },
    sairDoReal,
    destruir() {
      renderer.setAnimationLoop(null);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', rodar);
      window.removeEventListener('pointermove', aoMover);
      window.removeEventListener('pointerup', aoSubir);
      sairDoReal();
      cena.traverse((n) => {
        if (n instanceof Mesh || n instanceof LineSegments) {
          n.geometry.dispose();
          const m = n.material as { dispose?: () => void } | { dispose?: () => void }[];
          for (const mm of Array.isArray(m) ? m : [m]) mm.dispose?.();
        }
      });
      for (const m of [argila, piso, estrutura]) m.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      camadaRotulos.remove();
      fpsEl?.remove();
    },
  };
}

export type { Vetor3 };
