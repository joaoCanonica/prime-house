// Sobe o `astro preview` do dist/ atual numa porta própria e espera responder.
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = fileURLToPath(new URL('../../', import.meta.url));
export const CHROMIUM =
  process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';

export async function subirPreview(porta) {
  const base = `http://127.0.0.1:${porta}`;
  const proc = spawn(
    join(RAIZ, 'node_modules', '.bin', 'astro'),
    ['preview', '--ignore-lock', '--host', '127.0.0.1', '--port', String(porta)],
    { cwd: RAIZ, stdio: 'ignore' },
  );
  const inicio = Date.now();
  for (;;) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {
      /* subindo */
    }
    if (Date.now() - inicio > 30_000) throw new Error('preview não subiu');
    await new Promise((ok) => setTimeout(ok, 250));
  }
  return { base, parar: () => proc.kill('SIGTERM') };
}

/** Rotas públicas do dist (sem /_*), mais a 404. */
export async function rotasDoDist() {
  const { readdirSync, statSync } = await import('node:fs');
  const { relative, sep } = await import('node:path');
  const dist = join(RAIZ, 'dist');
  const rotas = [];
  const andar = (d) => {
    for (const n of readdirSync(d)) {
      const c = join(d, n);
      if (statSync(c).isDirectory()) andar(c);
      else if (n === 'index.html') {
        const r = relative(dist, d).split(sep).join('/');
        rotas.push(r ? `/${r}/` : '/');
      }
    }
  };
  andar(dist);
  return [...rotas.filter((r) => !r.startsWith('/_')).sort(), '/404.html'];
}
