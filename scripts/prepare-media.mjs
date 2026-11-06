// Gera os derivados de mídia a partir de media.manifest.json. Idempotente, com cache por hash.
// Roda em predev/prebuild e em `pnpm media:prepare`. Opções: --forcar (ignora o cache).
//
// Destinos (ver destino() em midia-comum.mjs):
//   public/media/<id>/   publicável (entra no site)
//   media-privada/<id>/  consentimento pendente (nunca no site nem no git)
//   naoUsar              nada é gerado
// Arquivos órfãos nesses dois diretórios são apagados ao final.
import { existsSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import sharp from 'sharp';
import { extrairStills } from './extract-stills.mjs';
import {
  DIR_CACHE,
  DIR_PRIVADO,
  DIR_PUBLICO,
  RAIZ,
  destino,
  exigirFerramentas,
  ffmpeg,
  garantirDir,
  garantirPai,
  gravarEstado,
  hashArquivo,
  hashTexto,
  indexar,
  lerEstado,
  lerManifesto,
} from './midia-comum.mjs';

const VERSAO = 'prepare-1';
const LARGURAS = [480, 800, 1200, 1600];
const forcar = process.argv.includes('--forcar');

exigirFerramentas();
const inicio = Date.now();
const manifesto = lerManifesto();
const idx = indexar(manifesto);
const estado = forcar ? {} : lerEstado();
const esperados = new Set(); // caminhos absolutos que devem existir ao final
const indice = { publico: {}, privado: {} };
let gerados = 0;
let reaproveitados = 0;

const dirDe = (tipo) => (tipo === 'publico' ? DIR_PUBLICO : DIR_PRIVADO);

/** Executa `gerar` só se a chave mudou ou alguma saída sumiu. */
async function comCache(nome, chave, saidas, gerar) {
  for (const s of saidas) esperados.add(s);
  if (!forcar && estado[nome] === chave && saidas.every((s) => existsSync(s))) {
    reaproveitados++;
    return false;
  }
  for (const s of saidas) garantirPai(s);
  await gerar();
  estado[nome] = chave;
  gerados++;
  return true;
}

/** Larguras do srcset: nunca acima da largura máxima (sem upscale). */
function larguras(max) {
  const lista = LARGURAS.filter((l) => l <= max);
  if (!lista.includes(max) && max < LARGURAS.at(-1)) lista.push(max);
  return lista;
}

async function lqip(entrada) {
  const buf = await sharp(entrada).resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

/** AVIF + WebP em várias larguras, a partir de um sharp() já recortado. */
async function derivarImagem(id, tipo, fonteAbs, preparar, max, extra = {}) {
  const dir = join(dirDe(tipo), id);
  const ls = larguras(max);
  const saidas = ls.flatMap((l) => [join(dir, `${id}-${l}.avif`), join(dir, `${id}-${l}.webp`)]);
  const chave = hashTexto(VERSAO, id, ls, extra, await hashArquivo(fonteAbs));
  await comCache(`img:${tipo}:${id}`, chave, saidas, async () => {
    for (const l of ls) {
      const base = preparar(sharp(fonteAbs)).resize({ width: l, withoutEnlargement: true });
      await base
        .clone()
        .avif({ quality: 55, effort: 5 })
        .toFile(join(dir, `${id}-${l}.avif`));
      await base
        .clone()
        .webp({ quality: 78 })
        .toFile(join(dir, `${id}-${l}.webp`));
    }
  });
  const meta = await preparar(sharp(fonteAbs)).toBuffer({ resolveWithObject: true });
  const proporcao = meta.info.height / meta.info.width;
  indice[tipo][id] = {
    tipo: 'imagem',
    larguras: ls.map((l) => ({
      largura: l,
      altura: Math.round(l * proporcao),
      avif: `/${relative(join(RAIZ, 'public'), join(dir, `${id}-${l}.avif`))}`,
      webp: `/${relative(join(RAIZ, 'public'), join(dir, `${id}-${l}.webp`))}`,
      bytes: {
        avif: statSync(join(dir, `${id}-${l}.avif`)).size,
        webp: statSync(join(dir, `${id}-${l}.webp`)).size,
      },
    })),
    lqip: await lqip(await preparar(sharp(fonteAbs)).toBuffer()),
    ...extra,
  };
}

function argsH264(crf) {
  return [
    '-c:v',
    'libx264',
    '-preset',
    'slow',
    '-crf',
    String(crf),
    '-profile:v',
    'high',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
  ];
}
function argsVP9(crf) {
  return [
    '-c:v',
    'libvpx-vp9',
    '-crf',
    String(crf),
    '-b:v',
    '0',
    '-row-mt',
    '1',
    '-deadline',
    'good',
    '-cpu-used',
    '2',
    '-pix_fmt',
    'yuv420p',
  ];
}

/** y de um corte no instante t (vy = deslocamento em px/s, para acompanhar a câmera). */
const yEm = (c, t) => Math.round(c.y + (c.vy ?? 0) * t);
const termoY = (c) => (c.vy ? `${c.y}+${c.vy}*t` : String(c.y));

/** Expressão de y por tempo para o recorte 16:9 por plano. */
function exprY(cortes) {
  return cortes.reduceRight(
    (acc, c, i) => (i === cortes.length - 1 ? termoY(c) : `if(lt(t,${c.ate}),${termoY(c)},${acc})`),
    '',
  );
}

async function derivarTrecho(tr) {
  const tipo = destino(tr);
  if (!tipo) return;
  const origem = idx.get(tr.origem);
  const fonte = join(RAIZ, origem.arquivo);
  const dir = join(dirDe(tipo), tr.id);
  const dur = +(tr.out - tr.in).toFixed(3);
  const hashFonte = await hashArquivo(fonte);
  const variantes = [];

  const alvos = [];
  for (const h of tr.saidas.alturas) {
    const w = Math.round((h * 9) / 16 / 2) * 2;
    alvos.push({ nome: `${w}x${h}`, vf: `scale=${w}:${h}:flags=lanczos` });
  }
  if (tr.horizontal16x9) {
    alvos.push({
      nome: '720x404',
      vf: `crop=w=720:h=404:x=0:y='${exprY(tr.horizontal16x9.cortes)}'`,
      horizontal: true,
    });
  }

  for (const alvo of alvos) {
    for (const fmt of tr.saidas.formatos) {
      const comSom = tr.audioLiberado ? [false, true] : [false];
      for (const som of comSom) {
        const arq = join(dir, `${tr.id}-${alvo.nome}${som ? '-som' : ''}.${fmt}`);
        let crf = fmt === 'mp4' ? 23 : 33;
        const chave = hashTexto(
          VERSAO,
          tr.in,
          dur,
          alvo,
          fmt,
          som,
          tr.orcamentoBytes ?? null,
          hashFonte,
        );
        await comCache(`vid:${tipo}:${relative(RAIZ, arq)}`, chave, [arq], async () => {
          for (let tentativa = 0; tentativa < 6; tentativa++) {
            ffmpeg([
              '-ss',
              String(tr.in),
              '-i',
              fonte,
              '-t',
              String(dur),
              '-vf',
              `${alvo.vf},format=yuv420p`,
              ...(fmt === 'mp4' ? argsH264(crf) : argsVP9(crf)),
              ...(som
                ? fmt === 'mp4'
                  ? ['-c:a', 'aac', '-b:a', '128k']
                  : ['-c:a', 'libopus', '-b:a', '96k']
                : ['-an']),
              '-map_metadata',
              '-1',
              arq,
            ]);
            const bytes = statSync(arq).size;
            if (!tr.orcamentoBytes || bytes <= tr.orcamentoBytes) return;
            console.log(
              `  ${relative(RAIZ, arq)}: ${(bytes / 1e6).toFixed(2)} MB > orçamento, crf ${crf} → ${crf + 2}`,
            );
            crf += 2;
          }
          throw new Error(`${tr.id}: orçamento de ${tr.orcamentoBytes} bytes não atingido`);
        });
        variantes.push({
          arquivo: `/${relative(join(RAIZ, 'public'), arq)}`,
          formato: fmt,
          largura: Number(alvo.nome.split('x')[0]),
          altura: Number(alvo.nome.split('x')[1]),
          horizontal: !!alvo.horizontal,
          som,
          bytes: statSync(arq).size,
        });
      }
    }
  }

  // pôster AVIF + WebP (vertical e, se houver, 16:9) a partir do quadro posterEm
  const pngPoster = join(DIR_CACHE, 'posters', `${tr.id}.png`);
  const chavePoster = hashTexto(VERSAO, tr.posterEm, hashFonte);
  if (estado[`poster:${tr.id}`] !== chavePoster || !existsSync(pngPoster)) {
    garantirPai(pngPoster);
    ffmpeg(['-i', fonte, '-ss', String(tr.posterEm), '-frames:v', '1', '-update', '1', pngPoster]);
    estado[`poster:${tr.id}`] = chavePoster;
  }
  const tPoster = tr.posterEm - tr.in;
  const cortePoster = tr.horizontal16x9?.cortes.find((c) => tPoster < c.ate);
  const yPoster = cortePoster ? yEm(cortePoster, tPoster) : undefined;
  const posters = [];
  for (const [nome, largura, recorte] of [
    ['poster-720', 720, null],
    ['poster-540', 540, null],
    ...(yPoster !== undefined
      ? [['poster-16x9-720', 720, { left: 0, top: yPoster, width: 720, height: 404 }]]
      : []),
  ]) {
    const saidas = [join(dir, `${tr.id}-${nome}.avif`), join(dir, `${tr.id}-${nome}.webp`)];
    await comCache(
      `poster:${tipo}:${tr.id}:${nome}`,
      hashTexto(VERSAO, chavePoster, largura, recorte),
      saidas,
      async () => {
        let img = sharp(pngPoster);
        if (recorte) img = img.extract(recorte);
        img = img.resize({ width: largura, withoutEnlargement: true });
        await img.clone().avif({ quality: 50, effort: 5 }).toFile(saidas[0]);
        await img.clone().webp({ quality: 75 }).toFile(saidas[1]);
      },
    );
    posters.push({
      nome,
      avif: `/${relative(join(RAIZ, 'public'), saidas[0])}`,
      webp: `/${relative(join(RAIZ, 'public'), saidas[1])}`,
    });
  }
  const lq = sharp(pngPoster);
  indice[tipo][tr.id] = {
    tipo: 'video',
    duracao: dur,
    loop: tr.loop,
    variantes,
    posters,
    lqip: await lqip(await lq.toBuffer()),
  };
}

function limparOrfaos(dir) {
  if (!existsSync(dir)) return 0;
  let n = 0;
  const andar = (d) => {
    for (const nome of readdirSync(d)) {
      const c = join(d, nome);
      if (statSync(c).isDirectory()) {
        andar(c);
        if (readdirSync(c).length === 0) rmSync(c, { recursive: true });
      } else if (!esperados.has(c) && nome !== 'indice.json') {
        rmSync(c);
        n++;
      }
    }
  };
  andar(dir);
  return n;
}

try {
  console.log('[midia] preparando derivados…');
  const stills = await extrairStills(manifesto, { log: (m) => console.log(m) });

  // 1) originais publicáveis em galeria pequena (capturas: máx. 480 px)
  for (const o of manifesto.originais) {
    if (o.tipo === 'video' || o.tipo === 'marca' || !o.uso.includes('galeria-pequena')) continue;
    const tipo = destino(o);
    if (!tipo) continue;
    await derivarImagem(o.id, tipo, join(RAIZ, o.arquivo), (s) => s, o.resolucaoMax.largura, {
      origem: o.id,
    });
  }
  // 2) recortes (diferenciais sem o texto queimado)
  for (const r of manifesto.recortes) {
    const tipo = destino(r);
    if (!tipo) continue;
    const o = idx.get(r.origem);
    const c = r.caixa;
    await derivarImagem(
      r.id,
      tipo,
      join(RAIZ, o.arquivo),
      (s) => s.extract({ left: c.x, top: c.y, width: c.largura, height: c.altura }),
      r.resolucaoMax.largura,
      { origem: r.origem, natureza: 'recorte' },
    );
  }
  // 3) stills (quadros de vídeo)
  for (const st of manifesto.stills) {
    const tipo = destino(st);
    if (!tipo) continue;
    await derivarImagem(st.id, tipo, stills.get(st.id), (s) => s, st.resolucaoMax.largura, {
      origem: st.origem,
      natureza: 'quadro de vídeo',
    });
  }
  // 4) trechos de vídeo
  for (const tr of manifesto.trechos) {
    process.stdout.write(`  vídeo ${tr.id}…`);
    const t0 = Date.now();
    await derivarTrecho(tr);
    console.log(
      ` ${destino(tr) ?? 'naoUsar (ignorado)'} · ${((Date.now() - t0) / 1000).toFixed(1)} s`,
    );
  }

  const removidos = limparOrfaos(DIR_PUBLICO) + limparOrfaos(DIR_PRIVADO);
  for (const [tipo, dir] of [
    ['publico', DIR_PUBLICO],
    ['privado', DIR_PRIVADO],
  ]) {
    garantirDir(dir);
    const ordenado = Object.fromEntries(
      Object.entries(indice[tipo]).sort(([a], [b]) => a.localeCompare(b)),
    );
    writeFileSync(
      join(dir, 'indice.json'),
      JSON.stringify({ versao: VERSAO, itens: ordenado }, null, 2) + '\n',
    );
  }
  console.log(
    `[midia] ${gerados} gerado(s), ${reaproveitados} do cache, ${removidos} órfão(s) removido(s) · ` +
      `${Object.keys(indice.publico).length} públicos, ${Object.keys(indice.privado).length} privados · ${((Date.now() - inicio) / 1000).toFixed(1)} s`,
  );
} finally {
  gravarEstado(estado);
}
