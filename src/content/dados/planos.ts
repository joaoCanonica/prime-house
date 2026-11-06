// Planos sem preço ("Fale com a equipe e conheça as condições"). Benefícios fixos: bloqueante até confirmação por escrito.
import type { z } from 'astro/zod';
import type { plano } from '../schemas.ts';

const CONFIRMAR = 'confirmar por escrito';

export const planos: z.input<typeof plano>[] = [
  {
    id: 'prime',
    ordem: 1,
    nome: 'Plano Prime',
    inclui: {
      id: 'prime-inclui',
      texto: 'Musculação em trânsito livre, no horário da academia.',
      estado: 'bloqueante',
      rotulo: 'confirmar com a academia o que o Plano Prime inclui',
    },
    beneficios: [
      {
        id: 'garantia-14-dias',
        texto: 'Garantia de 14 dias, com devolução integral.',
        estado: 'bloqueante',
        rotulo: CONFIRMAR,
      },
      {
        id: 'trancamento-30-dias',
        texto: 'No plano anual, trancamento de até 30 dias.',
        estado: 'bloqueante',
        rotulo: CONFIRMAR,
      },
      {
        id: 'sexta-prime',
        texto: 'Sexta Prime: toda sexta, traga um amigo ou familiar para treinar com você.',
        estado: 'bloqueante',
        rotulo: CONFIRMAR,
      },
    ],
    fonte: 'vídeo "Benefícios do Plano Prime" (Lucas)',
  },
  {
    id: 'select',
    ordem: 2,
    nome: 'Plano Select',
    inclui: {
      id: 'select-inclui',
      texto:
        'Um professor dedicado exclusivamente a você durante o treino, com acompanhamento e orientação individualizados.',
      estado: 'confirmado',
      fonte: 'post DfIBHAaO4ej (30/10/2026) e De-T3FHMqQg',
    },
    beneficios: [],
    fonte: 'posts De-T3FHMqQg e DfIBHAaO4ej',
  },
  {
    id: 'duo',
    ordem: 3,
    nome: 'Plano Duo',
    inclui: {
      id: 'duo-inclui',
      texto: 'Um plano para treinar em dupla.',
      estado: 'confirmado',
      fonte: 'post Da1NbqDBmrw (condição da 2ª pessoa não publicada: sem preço no site)',
    },
    beneficios: [],
    fonte: 'post Da1NbqDBmrw',
  },
];
