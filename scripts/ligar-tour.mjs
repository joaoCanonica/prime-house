// Pós-build: escreve no HTML a URL real (com hash) do chunk da ilha 3D, onde houver o marcador __PH_TOUR_URL__.
// Assim o teaser da home usa import() nativo, sem helper do Vite no caminho do LCP.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const chunk = readdirSync(join(DIST, '_astro')).find((f) => /^tour\.[\w-]+\.js$/.test(f));
let trocas = 0;
const andar = (d) => {
  for (const n of readdirSync(d)) {
    const c = join(d, n);
    if (statSync(c).isDirectory()) andar(c);
    else if (n.endsWith('.html')) {
      const h = readFileSync(c, 'utf8');
      if (!h.includes('__PH_TOUR_URL__')) continue;
      if (!chunk) throw new Error('[ligar-tour] chunk tour.*.js não encontrado no dist/_astro');
      writeFileSync(c, h.replaceAll('__PH_TOUR_URL__', `/_astro/${chunk}`));
      trocas++;
    }
  }
};
andar(DIST);
console.log(`[ligar-tour] ${trocas} página(s) → /_astro/${chunk ?? '—'}`);
