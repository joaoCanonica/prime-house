// Favicon e apple-touch-icon a partir do logo empilhado sobre Breu. Uso: node scripts/gerar-icones.mjs
// Saída (versionada em public/): favicon.svg, favicon.ico (32 px), apple-touch-icon.png (180 px), icone-512.png.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RAIZ = fileURLToPath(new URL('../', import.meta.url));
const BREU = '#0C0B0A';
const NEVOA = '#E9E8E5';
const LARANJA = '#EC8A2A'; // PROVISÓRIO (marca.laranja)

const original = readFileSync(join(RAIZ, 'media-originais/marca/primehouse-logo.svg'), 'utf8');
const interno = original
  .replace(/<title>.*?<\/title>/s, '')
  .replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10))
  .replace(/fill="currentColor"/g, `fill="${NEVOA}"`)
  .replace(/fill="var\(--prime-laranja[^"]*"/g, `fill="${LARANJA}"`)
  .replace(/^<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '');

/** quadrado com o logo centralizado; margem em fração do lado */
function quadrado(margem) {
  const lado = 1000;
  const w = lado * (1 - 2 * margem);
  const h = (w * 685) / 857;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}"><rect width="${lado}" height="${lado}" fill="${BREU}"/><svg x="${(lado - w) / 2}" y="${(lado - h) / 2}" width="${w}" height="${h}" viewBox="0 0 857 685">${interno}</svg></svg>`;
}

const svgFavicon = quadrado(0.06);
writeFileSync(join(RAIZ, 'public/favicon.svg'), svgFavicon.replace(/\s+/g, ' '));

const png = (svg, px) =>
  sharp(Buffer.from(svg), { density: 600 }).resize(px, px).png({ compressionLevel: 9 }).toBuffer();
const apple = await png(quadrado(0.14), 180);
writeFileSync(join(RAIZ, 'public/apple-touch-icon.png'), apple);
writeFileSync(join(RAIZ, 'public/icone-512.png'), await png(quadrado(0.14), 512));

// ICO com um PNG de 32 px dentro (formato aceito por todos os navegadores atuais)
const p32 = await png(svgFavicon, 32);
const cab = Buffer.alloc(6 + 16);
cab.writeUInt16LE(0, 0);
cab.writeUInt16LE(1, 2);
cab.writeUInt16LE(1, 4);
cab.writeUInt8(32, 6);
cab.writeUInt8(32, 7);
cab.writeUInt8(0, 8);
cab.writeUInt8(0, 9);
cab.writeUInt16LE(1, 10);
cab.writeUInt16LE(32, 12);
cab.writeUInt32LE(p32.length, 14);
cab.writeUInt32LE(22, 18);
writeFileSync(join(RAIZ, 'public/favicon.ico'), Buffer.concat([cab, p32]));
console.log('[icones] public/favicon.svg, favicon.ico, apple-touch-icon.png, icone-512.png');
