// Utilitários compartilhados pelos scripts de mídia.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = fileURLToPath(new URL('../', import.meta.url));
export const DIR_PUBLICO = join(RAIZ, 'public', 'media');
export const DIR_PRIVADO = join(RAIZ, 'media-privada');
export const DIR_CACHE = join(RAIZ, '.cache', 'media');

export function lerManifesto() {
  return JSON.parse(readFileSync(join(RAIZ, 'media.manifest.json'), 'utf8'));
}

/** Índice id → item (originais, trechos, stills, recortes). */
export function indexar(manifesto) {
  const mapa = new Map();
  for (const grupo of ['originais', 'trechos', 'stills', 'recortes']) {
    for (const item of manifesto[grupo]) mapa.set(item.id, { ...item, grupo });
  }
  return mapa;
}

/**
 * Destino de um derivado:
 *  - "publico": vai para public/media (entra no site);
 *  - "privado": consentimento pendente → media-privada/ (fora do git e do site);
 *  - null: naoUsar → não gera nada.
 */
export function destino(item) {
  if (item.naoUsar) return null;
  const algumPendente =
    item.consentimento === 'pendente' || item.pessoas.some((p) => p.consentimento === 'pendente');
  return algumPendente ? 'privado' : 'publico';
}

export function garantirDir(caminho) {
  mkdirSync(caminho, { recursive: true });
  return caminho;
}

const cacheHash = new Map();
/** sha256 de um arquivo (memorizado por execução). */
export async function hashArquivo(caminho) {
  if (cacheHash.has(caminho)) return cacheHash.get(caminho);
  const h = createHash('sha256');
  await new Promise((ok, erro) => {
    createReadStream(caminho)
      .on('data', (d) => h.update(d))
      .on('end', ok)
      .on('error', erro);
  });
  const valor = h.digest('hex');
  cacheHash.set(caminho, valor);
  return valor;
}

export function hashTexto(...partes) {
  return createHash('sha256')
    .update(partes.map((p) => (typeof p === 'string' ? p : JSON.stringify(p))).join('\u0000'))
    .digest('hex');
}

/** Estado do cache: chave por saída. */
export function lerEstado() {
  const arq = join(DIR_CACHE, 'estado.json');
  return existsSync(arq) ? JSON.parse(readFileSync(arq, 'utf8')) : {};
}
export function gravarEstado(estado) {
  garantirDir(DIR_CACHE);
  writeFileSync(join(DIR_CACHE, 'estado.json'), JSON.stringify(estado, null, 2) + '\n');
}

export function exigirFerramentas() {
  for (const bin of ['ffmpeg', 'ffprobe']) {
    try {
      execFileSync(bin, ['-version'], { stdio: 'ignore' });
    } catch {
      console.error(`[midia] "${bin}" não encontrado no PATH. Instale o ffmpeg (inclui ffprobe).`);
      process.exit(1);
    }
  }
}

export function ffmpeg(args) {
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], {
    stdio: ['ignore', 'ignore', 'inherit'],
  });
}

export function garantirPai(arquivo) {
  garantirDir(dirname(arquivo));
  return arquivo;
}
