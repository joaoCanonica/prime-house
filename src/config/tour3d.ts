// Tour 3D. A maquete ESQUEMÁTICA (sem planta) vai para produção com o selo "Representação esquemática".
// Aprovada pelo João em 08/11/2026. Com a planta ou a captura real, trocar fonteLayout das zonas (docs/3d/README.md).
import { confirmado } from './tipos.ts';

export const tour3d = {
  maqueteEsquematicaAprovada: confirmado(
    true,
    'João (WAXLO), 08/11/2026: "o resto pode subir" (vídeos da academia completa virão depois)',
  ),
} as const;
