// Pesos do dist/ contra o orçamento (CLAUDE.md §4): JS inicial ≤ 40 KB gzip por página (sem a ilha 3D);
// ilha 3D ≤ 180 KB gzip; GLB ≤ 3 MB; splat ≤ 40 MB. Também lista vídeos, imagens, fontes e CSS embutido.
// "JS inicial" = scripts <script src> da página + os imports estáticos deles (import() dinâmico fica de fora).
// Uso: node scripts/audit-pesos.mjs [--saida=docs/qa/pesos.json]
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
import { RAIZ } from './lib/servidor.mjs';

const DIST = join(RAIZ, 'dist');
const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3);
const LIMITES = { jsInicialKB: 40, ilha3dKB: 180, glbMB: 3, splatMB: 40 };
const gz = (b) => gzipSync(b, { level: 9 }).length;
const kb = (n) => Number((n / 1024).toFixed(1));
const mb = (n) => Number((n / 1024 / 1024).toFixed(2));

const arquivos = [];
const andar = (d) => {
  for (const n of readdirSync(d)) {
    const c = join(d, n);
    if (statSync(c).isDirectory()) andar(c);
    else arquivos.push(c);
  }
};
andar(DIST);
const rel = (a) => relative(DIST, a).split(sep).join('/');

/** JS estático alcançável a partir de um módulo (segue import/from "./x.js"). */
function alcancavel(inicio, vistos = new Set()) {
  if (vistos.has(inicio)) return vistos;
  vistos.add(inicio);
  const s = readFileSync(join(DIST, inicio), 'utf8');
  for (const m of s.matchAll(/(?:\bfrom|\bimport)\s*["']\.\/([^"']+\.js)["']/g))
    alcancavel(`_astro/${m[1]}`, vistos);
  return vistos;
}

let falhas = 0;
const erro = (m) => {
  falhas++;
  console.log(`  ✗ ${m}`);
};

// páginas: JS inicial e CSS embutido
const paginas = [];
for (const a of arquivos.filter((x) => x.endsWith('.html') && !rel(x).startsWith('_'))) {
  const html = readFileSync(a, 'utf8');
  const mods = new Set();
  for (const m of html.matchAll(/<script[^>]*\bsrc="\/([^"]+\.js)"/g)) alcancavel(m[1], mods);
  let js = 0;
  for (const m of mods) js += gz(readFileSync(join(DIST, m)));
  for (const m of html.matchAll(
    /<script(?![^>]*\bsrc)(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/g,
  ))
    js += gz(m[1]);
  const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].reduce(
    (t, m) => t + gz(m[1]),
    0,
  );
  const rota = `/${rel(a)}`.replace(/index\.html$/, '');
  paginas.push({ rota, jsInicialKB: kb(js), cssEmbutidoKB: kb(css), htmlKB: kb(gz(html)) });
  if (js / 1024 > LIMITES.jsInicialKB)
    erro(`${rota}: JS inicial ${kb(js)} KB gzip > ${LIMITES.jsInicialKB}`);
}

// ilha 3D: módulo do tour + dependências estáticas (three.core etc.)
const tour = arquivos.map(rel).find((r) => /^_astro\/tour\.[\w-]+\.js$/.test(r));
let ilha = 0;
const ilhaArquivos = [];
if (tour) {
  for (const m of alcancavel(tour)) {
    const g = gz(readFileSync(join(DIST, m)));
    ilha += g;
    ilhaArquivos.push({ arquivo: m, gzipKB: kb(g) });
  }
  if (ilha / 1024 > LIMITES.ilha3dKB) erro(`ilha 3D ${kb(ilha)} KB gzip > ${LIMITES.ilha3dKB}`);
}
const sobDemanda = arquivos
  .map(rel)
  .filter((r) => /^_astro\/(spark|DRACOLoader|KTX2Loader|draco_|basis_)/.test(r))
  .map((r) => ({
    arquivo: r,
    KB: kb(statSync(join(DIST, r)).size),
    gzipKB: kb(gz(readFileSync(join(DIST, r)))),
  }));

// modelos
const glbs = arquivos
  .filter((a) => a.endsWith('.glb'))
  .map((a) => ({
    arquivo: rel(a),
    MB: mb(statSync(a).size),
    brotliEstimadoKB: kb(gz(readFileSync(a))),
  }));
for (const g of glbs) if (g.MB > LIMITES.glbMB) erro(`${g.arquivo}: ${g.MB} MB > ${LIMITES.glbMB}`);
const splats = arquivos
  .filter((a) => /\/splats\/[^/]+\.(sog|spz|splat|ksplat|ply)$/.test(rel(a)))
  .map((a) => ({ arquivo: rel(a), MB: mb(statSync(a).size) }));
for (const s of splats)
  if (s.MB > LIMITES.splatMB) erro(`${s.arquivo}: ${s.MB} MB > ${LIMITES.splatMB}`);

// mídia e fontes
const porExt = (re) =>
  arquivos.filter((a) => re.test(a)).map((a) => ({ arquivo: rel(a), bytes: statSync(a).size }));
const videos = porExt(/\.(mp4|webm)$/);
const imagens = porExt(/\/media\/.*\.(avif|webp|jpg|png)$/);
const fontes = porExt(/\.woff2$/);
const soma = (l) => l.reduce((t, x) => t + x.bytes, 0);
const maior = [...videos].sort((a, b) => b.bytes - a.bytes)[0];

const relatorio = {
  data: new Date().toISOString(),
  limites: LIMITES,
  paginas,
  ilha3d: { gzipKB: kb(ilha), arquivos: ilhaArquivos },
  sobDemanda,
  glbs,
  splats,
  videos: {
    arquivos: videos.length,
    totalMB: mb(soma(videos)),
    maior: maior ? { ...maior, MB: mb(maior.bytes) } : null,
  },
  imagens: { arquivos: imagens.length, totalMB: mb(soma(imagens)) },
  fontes: fontes.map((f) => ({ arquivo: f.arquivo, KB: kb(f.bytes) })),
  fontesTotalKB: kb(soma(fontes)),
};
const saida = join(RAIZ, arg('saida') ?? 'docs/qa/pesos.json');
mkdirSync(dirname(saida), { recursive: true });
writeFileSync(saida, JSON.stringify(relatorio, null, 2));

for (const p of paginas)
  console.log(
    `  ${p.rota.padEnd(28)} JS ${String(p.jsInicialKB).padStart(5)} KB · CSS ${p.cssEmbutidoKB} KB · HTML ${p.htmlKB} KB (gzip)`,
  );
console.log(
  `  ilha 3D ${kb(ilha)} KB gzip (${ilhaArquivos.map((x) => `${x.arquivo.replace('_astro/', '')} ${x.gzipKB}`).join(' + ')})`,
);
console.log(
  `  sob demanda: ${sobDemanda.map((x) => `${x.arquivo.replace('_astro/', '')} ${x.gzipKB} KB`).join(' · ')}`,
);
console.log(
  `  GLB: ${glbs.map((g) => `${g.arquivo} ${g.MB} MB`).join(' · ') || '—'} · splats: ${splats.length || 'nenhum'}`,
);
console.log(
  `  vídeos: ${videos.length} arquivos, ${mb(soma(videos))} MB (maior: ${maior?.arquivo} ${mb(maior?.bytes ?? 0)} MB) · imagens: ${imagens.length}, ${mb(soma(imagens))} MB`,
);
console.log(
  `  fontes: ${fontes.map((f) => `${f.arquivo.replace('_astro/', '')} ${kb(f.bytes)} KB`).join(' · ')}`,
);
console.log(
  `[audit-pesos] ${falhas ? `${falhas} acima do orçamento` : 'tudo dentro do orçamento'}`,
);
process.exit(falhas ? 1 : 0);
