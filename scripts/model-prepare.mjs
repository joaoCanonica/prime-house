// Prepara os modelos do tour 3D. Idempotente (cache por hash). Uso: node scripts/model-prepare.mjs [--forcar]
//
// Entradas (modelos-originais/):
//   maquete.glb | maquete.gltf        GLB feito a partir da PLANTA (Prompt 3D). Contrato de nomes em docs/3d/README.md.
//   splats/<zona>.{ply,spz,splat,ksplat,sog}   captura real por zona (Gaussian Splatting)
// Saídas (public/modelos/, fora do git):
//   maquete.glb            otimizado (dedupe, weld, simplify controlado, Meshopt; texturas KTX2 ou WebP)
//                          SEM PLANTA: maquete ESQUEMÁTICA gerada aqui (extras.esquematica = true)
//   splats/<zona>.sog      splat comprimido (SOG, via @playcanvas/splat-transform)
//   indice.json            o que existe (a ilha 3D lê isto)
// Relatório: docs/3d/RELATORIO.md (peso, polígonos, nós, zonas, splats).
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { dedup, meshopt, prune, simplify, textureCompress, weld } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';

const VERSAO = 'modelos-3';
const RAIZ = fileURLToPath(new URL('../', import.meta.url));
const ORIG = join(RAIZ, 'modelos-originais');
const SAIDA = join(RAIZ, 'public', 'modelos');
const CACHE = join(RAIZ, '.cache', 'modelos.json');
const RELATORIO = join(RAIZ, 'docs', '3d', 'RELATORIO.md');
const forcar = process.argv.includes('--forcar');
const ZONAS = [
  'recepcao',
  'musculacao',
  'cardio',
  'vestiarios',
  'avaliacao-fisio',
  'conveniencia',
  'espaco-kids',
];
const SUBZONAS = ['costas-puxadas', 'pernas', 'peito-ombro', 'peso-livre'];

const hash = (...p) =>
  createHash('sha256').update(p.map(String).join('\u0000')).digest('hex').slice(0, 16);
const hashArq = (f) => createHash('sha256').update(readFileSync(f)).digest('hex').slice(0, 16);
const estado = !forcar && existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
mkdirSync(join(SAIDA, 'splats'), { recursive: true });
mkdirSync(join(RAIZ, 'docs', '3d'), { recursive: true });

await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder });

// ------------------------------------------------------------------ maquete esquemática
/** Galpão e zonas em unidades abstratas (SEM medidas reais). Só existe enquanto não há planta. */
function maqueteEsquematica() {
  const doc = new Document();
  const buf = doc.createBuffer();
  const cena = doc.createScene('maquete');
  doc.getRoot().setExtras({
    esquematica: true,
    versao: VERSAO,
    aviso: 'Representação esquemática: posições e tamanhos não são da planta.',
  });

  const mat = (nome, cor, rough = 0.92) =>
    doc
      .createMaterial(nome)
      .setBaseColorFactor([...cor, 1])
      .setRoughnessFactor(rough)
      .setMetallicFactor(0);
  const srgb = (h) =>
    [1, 3, 5].map((i) =>
      ((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))(
        parseInt(h.slice(i, i + 2), 16) / 255,
      ),
    );
  const argila = mat('argila', srgb('#E9E8E5'));
  const piso = mat('piso', srgb('#CFCDC8'));
  const luz = mat('luz', srgb('#FFF4E0'), 1).setEmissiveFactor(srgb('#FFF4E0'));
  const estrutura = mat('estrutura', srgb('#8E8C89'), 1);

  const acc = (tipo, arr, nome) =>
    doc.createAccessor(nome).setType(tipo).setArray(arr).setBuffer(buf);

  function caixa(nome, [cx, cy, cz], [sx, sy, sz], material, extras) {
    const [x0, x1, y0, y1, z0, z1] = [
      cx - sx / 2,
      cx + sx / 2,
      cy - sy / 2,
      cy + sy / 2,
      cz - sz / 2,
      cz + sz / 2,
    ];
    const faces = [
      [
        [x1, y0, z0],
        [x1, y1, z0],
        [x1, y1, z1],
        [x1, y0, z1],
        [1, 0, 0],
      ],
      [
        [x0, y0, z1],
        [x0, y1, z1],
        [x0, y1, z0],
        [x0, y0, z0],
        [-1, 0, 0],
      ],
      [
        [x0, y1, z0],
        [x0, y1, z1],
        [x1, y1, z1],
        [x1, y1, z0],
        [0, 1, 0],
      ],
      [
        [x0, y0, z1],
        [x0, y0, z0],
        [x1, y0, z0],
        [x1, y0, z1],
        [0, -1, 0],
      ],
      [
        [x0, y0, z1],
        [x1, y0, z1],
        [x1, y1, z1],
        [x0, y1, z1],
        [0, 0, 1],
      ],
      [
        [x1, y0, z0],
        [x0, y0, z0],
        [x0, y1, z0],
        [x1, y1, z0],
        [0, 0, -1],
      ],
    ];
    const pos = [];
    const nor = [];
    const idx = [];
    faces.forEach(([a, b, c, d, n], f) => {
      pos.push(...a, ...b, ...c, ...d);
      for (let i = 0; i < 4; i++) nor.push(...n);
      const o = f * 4;
      idx.push(o, o + 1, o + 2, o, o + 2, o + 3);
    });
    const prim = doc
      .createPrimitive()
      .setAttribute('POSITION', acc('VEC3', new Float32Array(pos)))
      .setAttribute('NORMAL', acc('VEC3', new Float32Array(nor)))
      .setIndices(acc('SCALAR', new Uint16Array(idx)))
      .setMaterial(material);
    const no = doc.createNode(nome).setMesh(doc.createMesh(nome).addPrimitive(prim));
    if (extras) no.setExtras(extras);
    return no;
  }

  function linhas(nome, pares, material, extras) {
    const prim = doc
      .createPrimitive()
      .setMode(1)
      .setAttribute('POSITION', acc('VEC3', new Float32Array(pares.flat())))
      .setMaterial(material);
    const no = doc.createNode(nome).setMesh(doc.createMesh(nome).addPrimitive(prim));
    if (extras) no.setExtras(extras);
    return no;
  }

  /** contorno fechado → pares de segmentos */
  const contorno = (pts) => pts.flatMap((p, i) => [p, pts[(i + 1) % pts.length]]);
  /** moldura de LED no teto: retângulo ou hexágono alongado (pontas nas laterais), como as luminárias reais */
  function moldura([cx, cz], [w, d], forma, y = 4.6) {
    const [x0, x1, z0, z1] = [cx - w / 2, cx + w / 2, cz - d / 2, cz + d / 2];
    const p = Math.min(w * 0.18, 0.9);
    const pts =
      forma === 'hexagono'
        ? [
            [x0 + p, y, z0],
            [x1 - p, y, z0],
            [x1, y, cz],
            [x1 - p, y, z1],
            [x0 + p, y, z1],
            [x0, y, cz],
          ]
        : [
            [x0, y, z0],
            [x1, y, z0],
            [x1, y, z1],
            [x0, y, z1],
          ];
    return contorno(pts);
  }

  const raiz = doc.createNode('galpao').setExtras({ tipo: 'galpao' });
  cena.addChild(raiz);
  // piso e muretas (corte: paredes baixas para ver por dentro)
  raiz.addChild(caixa('piso', [0, -0.1, 0], [24, 0.2, 40], piso));
  for (const [n, c, s] of [
    ['parede-fundo', [0, 0.5, -20], [24, 1, 0.2]],
    ['parede-esq', [-12, 0.5, 0], [0.2, 1, 40]],
    ['parede-dir', [12, 0.5, 0], [0.2, 1, 40]],
    ['parede-frente-a', [-7.5, 0.5, 20], [9, 1, 0.2]],
    ['parede-frente-b', [7.5, 0.5, 20], [9, 1, 0.2]],
  ])
    raiz.addChild(caixa(n, c, s, argila));
  // telhado curvo estilizado: só as costelas, em linha
  const costelas = [];
  for (let z = -20; z <= 20; z += 5) {
    const seg = 16;
    for (let i = 0; i < seg; i++) {
      const a0 = Math.PI * (i / seg);
      const a1 = Math.PI * ((i + 1) / seg);
      costelas.push(
        [-12 * Math.cos(a0), 5 + 2.2 * Math.sin(a0), z],
        [-12 * Math.cos(a1), 5 + 2.2 * Math.sin(a1), z],
      );
    }
  }
  raiz.addChild(linhas('telhado', costelas, estrutura, { tipo: 'estrutura' }));

  // zonas: [id, centro xz, tamanho (x, altura, z), forma da moldura, pai]
  const zonas = [
    ['recepcao', [0, 16.5], [7, 1, 3], 'retangulo'],
    ['costas-puxadas', [-6, -6], [5, 1.6, 7], 'hexagono', 'musculacao'],
    ['pernas', [1, -6], [5, 1.6, 7], 'retangulo', 'musculacao'],
    ['peito-ombro', [-6, 4], [5, 1.6, 7], 'retangulo', 'musculacao'],
    ['peso-livre', [1, 4], [5, 1.6, 7], 'hexagono', 'musculacao'],
    ['cardio', [8.8, -1], [3.6, 1.2, 14], 'retangulo'],
    ['vestiarios', [-8.8, -16.2], [5.2, 2.4, 6], 'retangulo'],
    ['avaliacao-fisio', [8.2, -16.2], [5.6, 2.4, 6], 'retangulo'],
    ['conveniencia', [-8.8, 15], [5, 1.1, 5], 'hexagono'],
    ['espaco-kids', [8.8, 15], [5, 0.9, 5], 'retangulo'],
  ];
  const grupos = new Map();
  const poses = {};
  const pose = (id, [cx, cz], h, dist) => {
    const p = doc
      .createNode(`pose:${id}`)
      .setTranslation([cx * 0.55, h + dist * 0.62, cz + dist * 1.05])
      .setExtras({ tipo: 'pose', zona: id });
    const a = doc
      .createNode(`alvo:${id}`)
      .setTranslation([cx, h * 0.5, cz])
      .setExtras({ tipo: 'alvo', zona: id });
    raiz.addChild(p).addChild(a);
    poses[id] = true;
  };
  for (const [id, [cx, cz], [sx, sy, sz], forma, pai] of zonas) {
    const bloco = caixa(`zona:${id}`, [cx, sy / 2, cz], [sx, sy, sz], argila, {
      tipo: 'zona',
      zona: id,
      ...(pai ? { pai } : {}),
    });
    const led = linhas(`luz:${id}`, moldura([cx, cz], [sx * 0.86, sz * 0.8], forma), luz, {
      tipo: 'luz',
      zona: id,
      ...(pai ? { pai } : {}),
    });
    if (pai) {
      if (!grupos.has(pai))
        grupos.set(pai, doc.createNode(`grupo:${pai}`).setExtras({ tipo: 'grupo', zona: pai }));
      grupos.get(pai).addChild(bloco).addChild(led);
    } else {
      raiz.addChild(bloco).addChild(led);
    }
    pose(id, [cx, cz], sy, pai ? 13 : 16);
  }
  for (const g of grupos.values()) raiz.addChild(g);
  pose('musculacao', [-2.5, -1], 1.6, 24);
  pose('geral', [0, 0], 0, 40);
  return { doc, poses: Object.keys(poses) };
}

// ------------------------------------------------------------------ otimização de GLB real
async function otimizarGlb(arquivo) {
  const doc = await io.read(arquivo);
  const temTexturas = doc.getRoot().listTextures().length > 0;
  const passos = [
    dedup(),
    prune(),
    weld(),
    simplify({ simplifier: MeshoptSimplifier, ratio: 0.75, error: 0.0008 }),
  ];
  let texturas = 'sem texturas';
  if (temTexturas) {
    const toktx = spawnSync('toktx', ['--version']).status === 0;
    if (toktx) {
      texturas = 'KTX2 (toktx)';
    } else {
      passos.push(textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [2048, 2048] }));
      texturas = 'WebP 2048 (toktx ausente: KTX2 pendente)';
    }
  }
  await doc.transform(...passos);
  return { doc, texturas, temTexturas };
}

function contar(doc) {
  let tris = 0;
  let linhasN = 0;
  for (const m of doc.getRoot().listMeshes())
    for (const p of m.listPrimitives()) {
      const n = (p.getIndices() ?? p.getAttribute('POSITION'))?.getCount() ?? 0;
      if (p.getMode() === 4) tris += n / 3;
      else if (p.getMode() === 1) linhasN += n / 2;
    }
  const nos = doc.getRoot().listNodes();
  const zonas = [
    ...new Set(
      nos.filter((n) => /^(zona|grupo):/.test(n.getName())).map((n) => n.getName().split(':')[1]),
    ),
  ];
  const poses = nos.filter((n) => /^pose:/.test(n.getName())).map((n) => n.getName().slice(5));
  return {
    triangulos: Math.round(tris),
    segmentosDeLinha: Math.round(linhasN),
    nos: nos.length,
    zonas,
    poses,
  };
}

// ------------------------------------------------------------------ execução
const indice = { versao: VERSAO, maquete: null, splats: {} };
const linhasRel = [];
const fonteGlb = ['maquete.glb', 'maquete.gltf']
  .map((f) => join(ORIG, f))
  .find((f) => existsSync(f));
const destinoGlb = join(SAIDA, 'maquete.glb');
const chaveGlb = fonteGlb ? hash(VERSAO, hashArq(fonteGlb)) : hash(VERSAO, 'esquematica');

let info;
if (estado.maquete?.chave === chaveGlb && existsSync(destinoGlb)) {
  info = estado.maquete.info;
  console.log('[modelos] maquete: do cache');
} else {
  let doc;
  let extra;
  if (fonteGlb) {
    const r = await otimizarGlb(fonteGlb);
    doc = r.doc;
    extra = {
      origem: basename(fonteGlb),
      bytesOriginal: statSync(fonteGlb).size,
      texturas: r.texturas,
    };
  } else {
    doc = maqueteEsquematica().doc;
    extra = { origem: 'gerada (esquemática)', texturas: 'sem texturas' };
  }
  doc
    .createExtension(EXTMeshoptCompression)
    .setRequired(true)
    .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });
  await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
  await io.write(destinoGlb, doc);
  info = { ...contar(doc), ...extra, esquematica: !fonteGlb, bytes: statSync(destinoGlb).size };
  estado.maquete = { chave: chaveGlb, info };
  console.log(
    `[modelos] maquete ${info.esquematica ? 'ESQUEMÁTICA' : 'da planta'}: ${(info.bytes / 1024).toFixed(1)} KB, ${info.triangulos} triângulos`,
  );
}
indice.maquete = {
  arquivo: '/modelos/maquete.glb',
  esquematica: info.esquematica,
  bytes: info.bytes,
  zonas: info.zonas,
  poses: info.poses,
};

// splats
const dirSplats = join(ORIG, 'splats');
const esperados = new Set();
if (existsSync(dirSplats)) {
  for (const f of readdirSync(dirSplats)) {
    const ext = extname(f).toLowerCase();
    if (!['.ply', '.spz', '.splat', '.ksplat', '.sog'].includes(ext)) continue;
    const zona = basename(f, ext).replace(/\.compressed$/, '');
    if (![...ZONAS, ...SUBZONAS].includes(zona)) {
      console.warn(`[modelos] splat ignorado: "${f}" não é o id de uma zona`);
      continue;
    }
    const fonte = join(dirSplats, f);
    const destino = join(SAIDA, 'splats', `${zona}.sog`);
    esperados.add(destino);
    const chave = hash(VERSAO, hashArq(fonte));
    if (estado.splats?.[zona]?.chave !== chave || !existsSync(destino)) {
      execFileSync(join(RAIZ, 'node_modules/.bin/splat-transform'), ['-w', fonte, destino], {
        stdio: 'inherit',
      });
      estado.splats = { ...estado.splats, [zona]: { chave, bytesOriginal: statSync(fonte).size } };
    }
    indice.splats[zona] = {
      arquivo: `/modelos/splats/${zona}.sog`,
      bytes: statSync(destino).size,
      bytesOriginal: estado.splats[zona].bytesOriginal,
    };
  }
}
for (const f of readdirSync(join(SAIDA, 'splats')))
  if (!esperados.has(join(SAIDA, 'splats', f))) rmSync(join(SAIDA, 'splats', f));

writeFileSync(join(SAIDA, 'indice.json'), JSON.stringify(indice, null, 2) + '\n');
writeFileSync(CACHE, JSON.stringify(estado, null, 2) + '\n');

// relatório (sem data, para ser idempotente)
const kb = (b) => `${(b / 1024).toFixed(1)} KB`;
linhasRel.push(
  '# Relatório dos modelos 3D',
  '',
  'Gerado por `pnpm model:prepare` (scripts/model-prepare.mjs). Não editar à mão.',
  '',
  '## Maquete',
  '',
  '| Campo | Valor |',
  '|---|---|',
  `| Origem | ${info.origem}${info.esquematica ? ' **(representação esquemática, sem planta)**' : ''} |`,
  `| Arquivo | public/modelos/maquete.glb |`,
  `| Peso | ${kb(info.bytes)}${info.bytesOriginal ? ` (original: ${kb(info.bytesOriginal)})` : ''} · limite 3 MB |`,
  `| Triângulos | ${info.triangulos} |`,
  `| Segmentos de linha (molduras e estrutura) | ${info.segmentosDeLinha} |`,
  `| Nós | ${info.nos} |`,
  `| Compressão | Meshopt (EXT_meshopt_compression, quantização) |`,
  `| Texturas | ${info.texturas} |`,
  `| Zonas encontradas | ${info.zonas.join(', ') || '—'} |`,
  `| Poses de câmera no modelo | ${info.poses.join(', ') || '—'} |`,
  '',
  '## Splats (captura real por zona)',
  '',
  Object.keys(indice.splats).length
    ? [
        '| Zona | Original | SOG |',
        '|---|---|---|',
        ...Object.entries(indice.splats).map(
          ([z, s]) => `| ${z} | ${kb(s.bytesOriginal)} | ${kb(s.bytes)} |`,
        ),
      ].join('\n')
    : 'Nenhum ainda. Coloque `modelos-originais/splats/<zona>.ply` (ver docs/3d/README.md).',
  '',
);
writeFileSync(RELATORIO, linhasRel.join('\n'));
console.log(
  `[modelos] ${Object.keys(indice.splats).length} splat(s) · relatório em docs/3d/RELATORIO.md`,
);
