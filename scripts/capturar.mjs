// Captura as rotas do site em 390 e 1440 px, com e sem prefers-reduced-motion.
// Uso: pnpm capturar [--rotas=/,/a-casa] [--porta=4329] [--sem-build]
// Saída: docs/capturas/<AAAA-MM-DD>/<rota>__<largura>[__reduzido].png
//
// Contrato da ilha 3D: o elemento raiz tem [data-ilha-3d] e marca
// data-estado="pronto" (ou "erro"/"fallback") quando estabiliza.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const raiz = fileURLToPath(new URL('../', import.meta.url));
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=');
    return [k, v];
  }),
);

const porta = Number(args.porta ?? 4329);
const base = `http://127.0.0.1:${porta}`;
const larguras = [390, 1440];
const movimentos = /** @type {const} */ (['no-preference', 'reduce']);
const ESPERA_3D_MS = 20_000;

function hoje() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Descobre as rotas a partir de dist/**\/index.html. */
function rotasDoDist(dir) {
  const rotas = [];
  const andar = (d) => {
    for (const nome of readdirSync(d)) {
      const c = join(d, nome);
      if (statSync(c).isDirectory()) andar(c);
      else if (nome === 'index.html') {
        const r = relative(dir, d).split(sep).join('/');
        rotas.push(r ? `/${r}/` : '/');
      }
    }
  };
  andar(dir);
  return rotas.filter((r) => !r.startsWith('/404')).sort();
}

async function esperarServidor(url, limiteMs = 30_000) {
  const inicio = Date.now();
  while (Date.now() - inicio < limiteMs) {
    try {
      const r = await fetch(url);
      if (r.ok || r.status === 404) return;
    } catch {
      /* ainda subindo */
    }
    await new Promise((ok) => setTimeout(ok, 250));
  }
  throw new Error(`preview não respondeu em ${limiteMs} ms (${url})`);
}

/** Rola a página inteira para disparar IntersectionObserver e carregar a ilha 3D. */
async function percorrer(pagina) {
  await pagina.evaluate(async () => {
    const passo = Math.max(200, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += passo) {
      window.scrollTo(0, y);
      await new Promise((ok) => setTimeout(ok, 120));
    }
    window.scrollTo(0, 0);
  });
}

async function esperarIlha3D(pagina) {
  const ilha = await pagina.$('[data-ilha-3d]');
  if (!ilha) return 'ausente';
  await ilha.scrollIntoViewIfNeeded();
  try {
    await pagina.waitForFunction(
      () => {
        const el = document.querySelector('[data-ilha-3d]');
        const estado = el?.getAttribute('data-estado');
        return estado === 'pronto' || estado === 'erro' || estado === 'fallback';
      },
      undefined,
      { timeout: ESPERA_3D_MS },
    );
    // dois quadros extras para o canvas assentar
    await pagina.evaluate(
      () => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(() => ok()))),
    );
    return await ilha.getAttribute('data-estado');
  } catch {
    return 'sem-sinal (timeout)';
  }
}

function nomeArquivo(rota, largura, movimento) {
  const r = rota === '/' ? 'home' : rota.replace(/^\/|\/$/g, '').replace(/\//g, '_');
  return `${r}__${largura}${movimento === 'reduce' ? '__reduzido' : ''}.png`;
}

async function main() {
  const dist = join(raiz, 'dist');
  if (args['sem-build'] !== 'true' || !existsSync(dist)) {
    console.log('› build');
    const b = spawnSync('pnpm', ['build'], { cwd: raiz, stdio: 'inherit' });
    if (b.status !== 0) process.exit(b.status ?? 1);
  }

  const rotas = args.rotas ? String(args.rotas).split(',') : rotasDoDist(dist);
  const destino = join(raiz, 'docs', 'capturas', hoje());
  mkdirSync(destino, { recursive: true });

  console.log(`› preview em ${base}`);
  const preview = spawn(
    join(raiz, 'node_modules', '.bin', 'astro'),
    ['preview', '--ignore-lock', '--host', '127.0.0.1', '--port', String(porta)],
    { cwd: raiz, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  let saidaPreview = '';
  preview.stdout.on('data', (d) => (saidaPreview += d));
  preview.stderr.on('data', (d) => (saidaPreview += d));

  const navegador = await chromium.launch(
    process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  );
  let falhas = 0;
  try {
    await esperarServidor(base);
    for (const rota of rotas) {
      for (const largura of larguras) {
        for (const movimento of movimentos) {
          const contexto = await navegador.newContext({
            viewport: { width: largura, height: largura < 800 ? 844 : 900 },
            deviceScaleFactor: 2,
            reducedMotion: movimento,
            locale: 'pt-BR',
          });
          const pagina = await contexto.newPage();
          const erros = [];
          pagina.on('pageerror', (e) => erros.push(e.message));
          try {
            const resp = await pagina.goto(base + rota, { waitUntil: 'networkidle' });
            if (!resp?.ok()) throw new Error(`HTTP ${resp?.status()}`);
            await pagina.evaluate(() => document.fonts.ready);
            await percorrer(pagina);
            const ilha = await esperarIlha3D(pagina);
            await pagina.waitForLoadState('networkidle');
            const arquivo = nomeArquivo(rota, largura, movimento);
            await pagina.screenshot({ path: join(destino, arquivo), fullPage: true });
            const extra = ilha === 'ausente' ? '' : ` · 3D: ${ilha}`;
            const js = erros.length ? ` · ERROS JS: ${erros.join(' | ')}` : '';
            if (erros.length) falhas++;
            console.log(`  ✓ ${arquivo}${extra}${js}`);
          } catch (e) {
            falhas++;
            console.error(`  ✗ ${rota} ${largura}px ${movimento}: ${e.message}`);
          } finally {
            await contexto.close();
          }
        }
      }
    }
  } catch (e) {
    falhas++;
    console.error(`✗ ${e.message}\n${saidaPreview}`);
  } finally {
    await navegador.close();
    preview.kill('SIGTERM');
  }

  console.log(`› ${relative(raiz, destino)} · ${falhas ? `${falhas} falha(s)` : 'sem falhas'}`);
  process.exit(falhas ? 1 : 0);
}

await main();
