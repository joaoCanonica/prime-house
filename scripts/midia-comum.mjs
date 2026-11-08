// Utilitários compartilhados pelos scripts de mídia.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
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

/**
 * ffmpeg do sistema, se houver; senão, o binário estático do pacote `ffmpeg-static` (devDependency).
 * Assim o build roda onde o ffmpeg não vem instalado (ex.: a imagem de build da Vercel).
 */
let binFfmpeg = null;
function acharFfmpeg() {
  if (binFfmpeg) return binFfmpeg;
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return (binFfmpeg = 'ffmpeg');
  } catch {
    /* sem ffmpeg no sistema */
  }
  try {
    const p = createRequire(import.meta.url)('ffmpeg-static');
    if (p && existsSync(p)) {
      execFileSync(p, ['-version'], { stdio: 'ignore' });
      console.log('[midia] sem ffmpeg no sistema: usando o do pacote ffmpeg-static');
      return (binFfmpeg = p);
    }
  } catch {
    /* pacote ausente ou binário não baixado */
  }
  return null;
}

export function exigirFerramentas() {
  if (!acharFfmpeg()) {
    console.error(
      '[midia] ffmpeg não encontrado: nem no sistema nem no pacote ffmpeg-static (rode pnpm install).',
    );
    process.exit(1);
  }
}

export function ffmpeg(args) {
  execFileSync(acharFfmpeg() ?? 'ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], {
    stdio: ['ignore', 'ignore', 'inherit'],
  });
}

export function garantirPai(arquivo) {
  garantirDir(dirname(arquivo));
  return arquivo;
}
