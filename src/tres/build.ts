// Só no build (Node): lê o índice dos modelos gerado pelo model:prepare.
import { readFileSync } from 'node:fs';
import type { IndiceModelos } from './tipos.ts';

/** A maquete publicada é a esquemática? (sem o índice, assume que sim) */
export function maqueteEsquematicaNoBuild(): boolean {
  try {
    const i = JSON.parse(readFileSync('public/modelos/indice.json', 'utf8')) as IndiceModelos;
    return i.maquete?.esquematica ?? true;
  } catch {
    return true;
  }
}
