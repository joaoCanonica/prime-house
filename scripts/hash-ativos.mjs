// Pós-build: põe o hash do conteúdo no nome de cada arquivo de /media e /modelos (nome.<hash8>.ext) e
// reescreve as referências no dist/. Assim esses arquivos podem ter cache de 1 ano "immutable" (vercel.json):
// mudou o arquivo, mudou o nome. Ficam fixos: /modelos/indice.json (é o que aponta para os outros) e /media/indice.json.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const FIXOS = new Set(['modelos/indice.json', 'media/indice.json']);
const TEXTO = /\.(html?|js|mjs|css|json|xml|txt|webmanifest)$/i;
const JA_TEM_HASH = /\.[0-9a-f]{8}\.[a-z0-9]+$/i;

const listar = (d, out = []) => {
  for (const n of readdirSync(d)) {
    const c = join(d, n);
    if (statSync(c).isDirectory()) listar(c, out);
    else out.push(c);
  }
  return out;
};
const rel = (a) => relative(DIST, a).split(sep).join('/');

const mapa = new Map();
for (const pasta of ['media', 'modelos']) {
  let arquivos;
  try {
    arquivos = listar(join(DIST, pasta));
  } catch {
    continue;
  }
  for (const a of arquivos) {
    const r = rel(a);
    // os decodificadores do three.js são pedidos por nome fixo (setDecoderPath)
    if (FIXOS.has(r) || r.startsWith('modelos/libs/') || JA_TEM_HASH.test(r)) continue;
    const h = createHash('sha256').update(readFileSync(a)).digest('hex').slice(0, 8);
    const ext = extname(r);
    const novo = `${r.slice(0, -ext.length)}.${h}${ext}`;
    renameSync(a, join(DIST, novo));
    mapa.set(`/${r}`, `/${novo}`);
  }
}

// reescreve as referências (caminhos absolutos /media/… e /modelos/…) em todos os arquivos de texto
const padrao = /\/(?:media|modelos)\/[A-Za-z0-9._\-/]+/g;
let arquivosReescritos = 0;
let trocas = 0;
for (const a of listar(DIST)) {
  if (!TEXTO.test(a)) continue;
  const s = readFileSync(a, 'utf8');
  let n = 0;
  const novo = s.replace(padrao, (m) => {
    const t = mapa.get(m);
    if (!t) return m;
    n++;
    return t;
  });
  if (n) {
    writeFileSync(a, novo);
    arquivosReescritos++;
    trocas += n;
  }
}
console.log(
  `[hash-ativos] ${mapa.size} arquivo(s) renomeado(s) · ${trocas} referência(s) em ${arquivosReescritos} arquivo(s)`,
);
