// Imagem social (Open Graph) 1200×630, gerada no prebuild em public/og/prime-house.jpg:
// o interior com as molduras de LED do teto,
// o logo e "Lages/SC". A foto é a captura 01 (≈ 900 px): entra a no máximo 480 px (regra das capturas).
// Texto em curvas (Archivo e Inter Tight self-hosted), sem depender de fontes do sistema.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { abrirFonte, textoEmCurvas } from './lib/texto-em-curvas.mjs';
import { OG } from '../src/components/seo/og.ts';
import { contato } from '../src/config/contato.ts';
import { cores } from '../src/config/tema.ts';
import manifesto from '../media.manifest.json' with { type: 'json' };

const raiz = fileURLToPath(new URL('../', import.meta.url));
const fontes = join(raiz, 'node_modules', '@fontsource-variable');

async function gerar() {
  const { largura: W, altura: H } = OG;
  const captura = manifesto.originais.find((o) => o.id === 'captura-01');
  if (!captura || captura.naoUsar) throw new Error('[og] captura-01 indisponível');

  // foto: corta a borda da captura de tela e reduz para 470 px (≤ 480 px)
  const LADO = 470;
  const foto = await sharp(join(raiz, captura.arquivo))
    .extract({ left: 0, top: 0, width: 890, height: 888 })
    .resize(LADO, LADO, { fit: 'cover' })
    .modulate({ brightness: 0.92 })
    .toBuffer();
  const fx = W - 64 - LADO;
  const fy = (H - LADO) / 2;

  const titulo = abrirFonte(join(fontes, 'archivo/files/archivo-latin-wdth-normal.woff2'), {
    wght: 740,
    wdth: 62,
  });
  const texto = abrirFonte(join(fontes, 'inter-tight/files/inter-tight-latin-wght-normal.woff2'), {
    wght: 450,
  });
  const lages = textoEmCurvas(titulo, 'LAGES/SC', 132, { espacamento: 2 });
  const end = contato.endereco.valor;
  const linha1 = textoEmCurvas(texto, `${end.logradouro}, ${end.numero} · ${end.bairro}`, 26);
  const linha2 = textoEmCurvas(texto, 'Musculação · trânsito livre · 100% Cimerian', 26);

  const logo = readFileSync(join(raiz, 'media-originais/marca/primehouse-logo-linha.svg'), 'utf8')
    .replace(/fill="currentColor"/g, `fill="${cores.nevoa}"`)
    .replace(/fill="var\(--prime-laranja, (#[0-9A-Fa-f]+)\)"/g, `fill="${cores.laranja}"`)
    .replace(/<title>.*?<\/title>/, '');
  const logoW = 470;
  const logoH = Math.round((logoW * 160) / 1482);
  const logoPng = await sharp(Buffer.from(logo)).resize(logoW, logoH).png().toBuffer();

  const L = cores.luz;
  const hex = (cx, cy, r) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i;
      return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
    }).join(' ');

  // molduras de luz (assinatura "Luz de Treino"): finas, branco-quente, brilho suave
  const camada = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><filter id="b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter></defs>
    <g fill="none" stroke="${L}" stroke-width="2" opacity="0.5" filter="url(#b)">
      <rect x="${fx - 0.5}" y="${fy - 0.5}" width="${LADO + 1}" height="${LADO + 1}"/>
      <polygon points="${hex(470, 44, 40)}"/>
      <rect x="-40" y="-24" width="400" height="92"/>
    </g>
    <g fill="none" stroke="${L}" stroke-width="1.5">
      <rect x="${fx - 0.5}" y="${fy - 0.5}" width="${LADO + 1}" height="${LADO + 1}"/>
      <polygon points="${hex(470, 44, 40)}" opacity="0.8"/>
      <rect x="-40" y="-24" width="400" height="92" opacity="0.8"/>
    </g>
    <path transform="translate(64 ${H - 196})" d="${lages.d}" fill="${cores.nevoa}"/>
    <path transform="translate(66 ${H - 124})" d="${linha1.d}" fill="${cores.concreto}"/>
    <path transform="translate(66 ${H - 84})" d="${linha2.d}" fill="${cores.concreto}"/>
  </svg>`;

  const png = await sharp({ create: { width: W, height: H, channels: 3, background: cores.breu } })
    .composite([
      { input: foto, left: fx, top: fy },
      { input: logoPng, left: 64, top: 176 },
      { input: Buffer.from(camada), left: 0, top: 0 },
    ])
    .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toBuffer();

  const destino = join(raiz, 'public', OG.caminho);
  mkdirSync(join(destino, '..'), { recursive: true });
  writeFileSync(destino, png);
  console.log(`[og] ${OG.caminho} · ${W}×${H} · ${(png.length / 1024).toFixed(0)} KB`);
}

await gerar();
