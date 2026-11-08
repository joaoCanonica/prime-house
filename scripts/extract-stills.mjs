// Extrai os stills (quadros de vídeo) definidos em media.manifest.json, sem upscale.
// Uso: node scripts/extract-stills.mjs [--folhas]
//   --folhas  gera também as folhas de contato em docs/capturas/midia/ (JPG).
// Saída dos stills: .cache/media/stills/<id>.png (fonte para o prepare-media).
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  DIR_CACHE,
  RAIZ,
  exigirFerramentas,
  ffmpeg,
  garantirDir,
  gerar,
  hashArquivo,
  hashTexto,
  indexar,
  lerEstado,
  lerManifesto,
  gravarEstado,
} from './midia-comum.mjs';

const VERSAO = 'stills-1';
export const DIR_STILLS = join(DIR_CACHE, 'stills');

/** Extrai (ou reaproveita do cache) todos os stills. Devolve id → caminho do PNG. */
export async function extrairStills(manifesto = lerManifesto(), { log = console.log } = {}) {
  exigirFerramentas();
  const idx = indexar(manifesto);
  const estado = lerEstado();
  garantirDir(DIR_STILLS);
  const saidas = new Map();
  for (const still of manifesto.stills) {
    if (!gerar(still)) continue; // naoUsar; privado no deploy
    const origem = idx.get(still.origem);
    const fonte = join(RAIZ, origem.arquivo);
    const png = join(DIR_STILLS, `${still.id}.png`);
    const chave = hashTexto(VERSAO, still.t, await hashArquivo(fonte));
    const k = `still:${still.id}`;
    if (estado[k] !== chave || !existsSync(png)) {
      // -ss depois do -i: posicionamento exato no quadro
      ffmpeg(['-i', fonte, '-ss', String(still.t), '-frames:v', '1', '-update', '1', png]);
      estado[k] = chave;
      log(`  still ${still.id} (${still.t} s)`);
    }
    saidas.set(still.id, png);
  }
  gravarEstado(estado);
  return saidas;
}

/** Folhas de contato para conferência humana (docs/capturas/midia/*.jpg). */
export function gerarFolhas(manifesto = lerManifesto()) {
  const destino = garantirDir(join(RAIZ, 'docs', 'capturas', 'midia'));
  const rotulo =
    "drawtext=text='%{eif\\:t\\:d}.%{eif\\:mod(t*10\\,10)\\:d}s':x=6:y=6:fontsize=20:fontcolor=yellow:box=1:boxcolor=black@0.7";
  for (const v of manifesto.originais.filter((o) => o.tipo === 'video')) {
    const fps = v.duracao > 30 ? 1 : 2;
    const colunas = 12;
    const linhas = Math.ceil((v.duracao * fps) / colunas);
    ffmpeg([
      '-i',
      join(RAIZ, v.arquivo),
      '-vf',
      `fps=${fps},scale=150:-2,${rotulo},tile=${colunas}x${linhas}:padding=2:color=0x0A0A0B`,
      '-frames:v',
      '1',
      '-q:v',
      '4',
      '-update',
      '1',
      join(destino, `${v.id}.jpg`),
    ]);
  }
  // fotos: uma folha para capturas e uma para as artes
  const grupos = {
    capturas: manifesto.originais.filter((o) => o.tipo === 'captura'),
    artes: manifesto.originais.filter((o) => o.tipo === 'arte-instagram'),
  };
  for (const [nome, itens] of Object.entries(grupos)) {
    const colunas = 7;
    const entradas = itens.flatMap((o) => ['-i', join(RAIZ, o.arquivo)]);
    const filtros = itens
      .map((o, i) => {
        const marca = o.naoUsar ? 'NAO USAR' : o.consentimento === 'pendente' ? 'PENDENTE' : '';
        const texto = `${o.numero ?? ''} ${marca}`.trim().replace(/ /g, '\\ ');
        return `[${i}]scale=240:300:force_original_aspect_ratio=decrease,pad=240:300:(ow-iw)/2:(oh-ih)/2:color=0x0A0A0B,drawtext=text=${texto}:x=6:y=6:fontsize=18:fontcolor=yellow:box=1:boxcolor=black@0.7[v${i}]`;
      })
      .join(';');
    const vazios = (colunas - (itens.length % colunas)) % colunas;
    const pads = Array.from(
      { length: vazios },
      (_, j) => `color=c=0x0A0A0B:s=240x300:d=1[p${j}]`,
    ).join(';');
    const todos = [
      ...itens.map((_, i) => `[v${i}]`),
      ...Array.from({ length: vazios }, (_, j) => `[p${j}]`),
    ];
    const n = todos.length;
    const layout = todos
      .map((_, i) => `${(i % colunas) * 240}_${Math.floor(i / colunas) * 300}`)
      .join('|');
    const grafo = `${filtros}${pads ? ';' + pads : ''};${todos.join('')}xstack=inputs=${n}:layout=${layout}`;
    ffmpeg([
      ...entradas,
      '-filter_complex',
      grafo,
      '-frames:v',
      '1',
      '-q:v',
      '4',
      '-update',
      '1',
      join(destino, `fotos-${nome}.jpg`),
    ]);
  }
  return readdirSync(destino).map((f) => join(destino, f));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const manifesto = lerManifesto();
  const stills = await extrairStills(manifesto);
  console.log(`[stills] ${stills.size} quadros em ${DIR_STILLS.replace(RAIZ, '')}`);
  if (process.argv.includes('--folhas')) {
    const folhas = gerarFolhas(manifesto);
    console.log(`[folhas] ${folhas.length} folhas em docs/capturas/midia/`);
  }
}
