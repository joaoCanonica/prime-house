// Schemas das coleções (Zod). Usados pelo Astro (src/content.config.ts) e pelas travas (validate-config).
import { z } from 'astro/zod';

export const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'use kebab-case');
/** id de mídia em media.manifest.json (conferido nas travas) */
export const idMidia = slug;
const vetor3 = z.tuple([z.number(), z.number(), z.number()]);

/** Texto que precisa de conferência: confirmado (com fonte) ou bloqueante (provisório). */
export const itemConferido = z.discriminatedUnion('estado', [
  z.object({
    id: slug,
    texto: z.string().min(1),
    estado: z.literal('confirmado'),
    fonte: z.string().min(1),
  }),
  z.object({
    id: slug,
    texto: z.string().min(1),
    estado: z.literal('bloqueante'),
    rotulo: z.string().min(1),
  }),
]);

export const zona = z.object({
  id: slug,
  ordem: z.number().int(),
  nome: z.string().min(1),
  /** encaixa em "Vi a {nomeNoTour} no tour do site" */
  nomeNoTour: z.string().min(1),
  descricao: z.string().min(1),
  equipamentos: z.array(slug),
  subzonas: z
    .array(z.object({ id: slug, nome: z.string().min(1), equipamentos: z.array(slug) }))
    .default([]),
  itens: z.array(z.string().min(1)).default([]),
  midia: z.array(idMidia),
  /** null até existir planta ou captura: posição de câmera sem fonte é dado inventado */
  camera: z.object({ posicao: vetor3, alvo: vetor3 }).nullable(),
  fonteLayout: z.enum(['planta', 'captura', 'pendente']),
});

export const equipamento = z.object({
  id: slug,
  nome: z.string().min(1),
  tipo: z.enum(['maquina', 'estrutura', 'peso-livre', 'cardio']),
  musculos: z.array(z.string().min(1)),
  zona: slug,
  subzona: slug.nullable(),
  quantidade: z.number().int().positive().nullable(),
  foto: idMidia.nullable(),
  video: idMidia.nullable(),
  /** null = fabricante ainda não confirmado */
  fabricante: z.literal('Cimerian').nullable(),
  confirmado: z.boolean(),
  fonte: z.string().min(1),
});

export const plano = z.object({
  id: z.enum(['prime', 'select', 'duo']),
  ordem: z.number().int(),
  nome: z.string().min(1),
  inclui: itemConferido,
  beneficios: z.array(itemConferido),
  fonte: z.string().min(1),
});

export const diferencial = z.object({
  id: slug,
  ordem: z.number().int(),
  nome: z.string().min(1),
  categoria: z.enum(['conforto', 'treino', 'cuidado', 'servico']),
  prova: z.string().min(1),
  midia: idMidia.nullable(),
  confirmado: z.boolean(),
});

export type Zona = z.infer<typeof zona>;
export type Equipamento = z.infer<typeof equipamento>;
export type Plano = z.infer<typeof plano>;
export type Diferencial = z.infer<typeof diferencial>;
export type ItemConferido = z.infer<typeof itemConferido>;
