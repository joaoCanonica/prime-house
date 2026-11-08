// Lê public/media/indice.json (gerado pelo media:prepare) em tempo de build.
// Só mídia publicável existe aí: pedir um id pendente ou naoUsar derruba o build.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface Largura {
  largura: number;
  altura: number;
  avif: string;
  webp: string;
}
export interface ImagemIndice {
  tipo: 'imagem';
  larguras: Largura[];
  lqip: string;
}
export interface VarianteVideo {
  arquivo: string;
  formato: 'mp4' | 'webm';
  largura: number;
  altura: number;
  horizontal: boolean;
  som: boolean;
}
export interface VideoIndice {
  tipo: 'video';
  duracao: number;
  loop: boolean;
  variantes: VarianteVideo[];
  posters: { nome: string; avif: string; webp: string }[];
  lqip: string;
}

let cache: Record<string, ImagemIndice | VideoIndice> | null = null;
function indice() {
  if (!cache) {
    const arq = join(process.cwd(), 'public', 'media', 'indice.json');
    cache = (
      JSON.parse(readFileSync(arq, 'utf8')) as { itens: Record<string, ImagemIndice | VideoIndice> }
    ).itens;
  }
  return cache;
}

export function imagem(id: string): ImagemIndice {
  const item = indice()[id];
  if (!item || item.tipo !== 'imagem')
    throw new Error(`[midia] imagem "${id}" não é publicável (ou não existe)`);
  return item;
}

export function video(id: string): VideoIndice {
  const item = indice()[id];
  if (!item || item.tipo !== 'video')
    throw new Error(`[midia] vídeo "${id}" não é publicável (ou não existe)`);
  return item;
}

export const srcset = (ls: Largura[], fmt: 'avif' | 'webp') =>
  ls.map((l) => `${l[fmt]} ${l.largura}w`).join(', ');
