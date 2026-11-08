// Pós-build: garante que todo <script> e <style> inline de cada página tenha o seu SHA-256 na CSP (<meta>).
// O Astro já põe os hashes do que ele gera; scripts is:inline (ex.: o que decide a abertura antes da 1ª
// pintura) ficam de fora — este passo os acrescenta. JSON-LD não executa e não precisa de hash.
// Falha se a página tiver script inline antes do <meta> da CSP (ele rodaria sem política).
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const hash = (s) => `'sha256-${createHash('sha256').update(s, 'utf8').digest('base64')}'`;
const RE_META = /(<meta http-equiv="content-security-policy" content=")([^"]*)(")/;
let paginas = 0;
let acrescentados = 0;
let falhas = 0;

const andar = (d) => {
  for (const n of readdirSync(d)) {
    const c = join(d, n);
    if (statSync(c).isDirectory()) andar(c);
    else if (n.endsWith('.html')) tratar(c);
  }
};

function tratar(arq) {
  let html = readFileSync(arq, 'utf8');
  const meta = RE_META.exec(html);
  if (!meta) return;
  paginas++;
  let politica = meta[2].replaceAll('&#39;', "'");
  const faltam = { 'script-src': [], 'style-src': [] };
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/ld\+json/.test(m[1])) continue;
    if (m.index < meta.index) {
      falhas++;
      console.error(`✗ ${relative(DIST, arq)}: script inline antes da CSP`);
    }
    const h = hash(m[2]);
    if (!politica.includes(h)) faltam['script-src'].push(h);
  }
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    const h = hash(m[1]);
    if (!politica.includes(h)) faltam['style-src'].push(h);
  }
  for (const [dir, hs] of Object.entries(faltam)) {
    if (!hs.length) continue;
    const novos = [...new Set(hs)];
    acrescentados += novos.length;
    politica = politica.replace(new RegExp(`(${dir} [^;]*)`), `$1 ${novos.join(' ')}`);
  }
  const escrito = politica.replaceAll("'", '&#39;');
  if (escrito !== meta[2]) {
    html = html.replace(RE_META, `$1${meta[2].includes('&#39;') ? escrito : politica}$3`);
    writeFileSync(arq, html);
  }
}

andar(DIST);
console.log(
  `[csp-completar] ${paginas} página(s) · ${acrescentados} hash(es) acrescentado(s)${falhas ? ` · ${falhas} falha(s)` : ''}`,
);
process.exit(falhas ? 1 : 0);
