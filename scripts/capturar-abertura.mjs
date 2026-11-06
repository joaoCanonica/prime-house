// Sequência da abertura congelada em 0; 0,8; 1,4; 2,0; 3,0 s, em 390 e 1440 px (+ reduced-motion).
// Uso: node scripts/capturar-abertura.mjs [--porta=4332]   (usa o dist/ atual)
// Saída: docs/capturas/<data>/abertura/*.png e docs/design/abertura-<largura>.jpg (tira para revisão)
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const RAIZ = fileURLToPath(new URL('../', import.meta.url));
const porta = Number(process.argv.find((a) => a.startsWith('--porta='))?.slice(8) ?? 4332);
const base = `http://127.0.0.1:${porta}`;
const TEMPOS = [0, 800, 1400, 2000, 3000];
const d = new Date();
const dia = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const destino = join(RAIZ, 'docs', 'capturas', dia, 'abertura');
mkdirSync(destino, { recursive: true });

const preview = spawn(
  join(RAIZ, 'node_modules/.bin/astro'),
  ['preview', '--ignore-lock', '--host', '127.0.0.1', '--port', String(porta)],
  { cwd: RAIZ, stdio: 'ignore' },
);
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(base)).ok) break;
  } catch {
    /* subindo */
  }
  await new Promise((r) => setTimeout(r, 250));
}

const nav = await chromium.launch(
  process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
);
try {
  for (const largura of [390, 1440]) {
    const altura = largura < 800 ? 844 : 900;
    const quadros = [];
    for (const t of TEMPOS) {
      const ctx = await nav.newContext({
        viewport: { width: largura, height: altura },
        deviceScaleFactor: 2,
      });
      const p = await ctx.newPage();
      await p.goto(`${base}/?abertura=${t}`, { waitUntil: 'networkidle' });
      await p.evaluate(() => document.fonts.ready);
      await p.waitForFunction(() => [...document.images].every((i) => i.complete));
      await p.waitForTimeout(150);
      const arq = join(destino, `abertura__${largura}__${String(t).padStart(4, '0')}ms.png`);
      await p.screenshot({ path: arq });
      quadros.push(arq);
      console.log(`  ✓ ${largura}px ${t} ms`);
      await ctx.close();
    }
    // reduced-motion: estado final direto
    const ctx = await nav.newContext({
      viewport: { width: largura, height: altura },
      deviceScaleFactor: 2,
      reducedMotion: 'reduce',
    });
    const p = await ctx.newPage();
    await p.goto(`${base}/`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(150);
    const abertura = await p.evaluate(() => document.documentElement.dataset.abertura ?? 'ausente');
    await p.screenshot({ path: join(destino, `abertura__${largura}__reduzido.png`) });
    console.log(`  ✓ ${largura}px reduced-motion (abertura: ${abertura})`);
    await ctx.close();

    // tira para revisão
    const w = largura < 800 ? 300 : 560;
    const imgs = await Promise.all(quadros.map((q) => sharp(q).resize({ width: w }).toBuffer()));
    const h = (await sharp(imgs[0]).metadata()).height;
    await sharp({
      create: { width: (w + 8) * imgs.length - 8, height: h, channels: 3, background: '#333' },
    })
      .composite(imgs.map((input, i) => ({ input, left: i * (w + 8), top: 0 })))
      .jpeg({ quality: 76, mozjpeg: true })
      .toFile(join(RAIZ, 'docs', 'design', `abertura-${largura}.jpg`));
  }
} finally {
  await nav.close();
  preview.kill();
}
console.log(`› ${destino.replace(RAIZ, '')} · docs/design/abertura-390.jpg e -1440.jpg`);
