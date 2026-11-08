import { defineCollection } from 'astro:content';
import { diferenciais } from './content/dados/diferenciais.ts';
import { equipamentos } from './content/dados/equipamentos.ts';
import { planos } from './content/dados/planos.ts';
import { zonas } from './content/dados/zonas.ts';
import * as s from './content/schemas.ts';

export const collections = {
  zonas: defineCollection({ loader: () => zonas.map((z) => ({ ...z, id: z.id })), schema: s.zona }),
  equipamentos: defineCollection({ loader: () => equipamentos, schema: s.equipamento }),
  planos: defineCollection({ loader: () => planos, schema: s.plano }),
  diferenciais: defineCollection({ loader: () => diferenciais, schema: s.diferencial }),
};
