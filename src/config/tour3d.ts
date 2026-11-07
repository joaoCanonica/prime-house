// Tour 3D. A maquete ESQUEMÁTICA (sem planta) só vai para produção com aprovação expressa do João.
import { bloqueante } from './tipos.ts';

export const tour3d = {
  /** preview: mostra (com selo); produção: só quando virar confirmado(true, 'João, <data>') */
  maqueteEsquematicaAprovada: bloqueante<boolean>(
    'aprovação do João para publicar a maquete esquemática',
    true,
  ),
} as const;
