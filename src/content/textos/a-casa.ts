// /a-casa: introdução ao tour e um texto curto por zona (só o confirmado; layout das zonas pendente da planta).
import { F } from './fontes.ts';
import { fraseReal } from './tipos.ts';

export const aCasa = {
  rota: '/a-casa',
  meta: {
    title: 'A Casa em 3D · Prime House, academia em Lages',
    description:
      'Faça o tour pela Prime House, academia em Lages no Frei Rogério: musculação Cimerian, cardio com TV, vestiários, avaliação e espaço kids.',
  },
  resposta:
    'A Casa é o tour pela Prime House Academia, na Av. Duque de Caxias, 1253, no Frei Rogério, em Lages/SC. Escolha uma zona e veja onde fica cada coisa: musculação com máquinas Cimerian, cardio, vestiários, sala de avaliação, conveniência e espaço kids.',
  intro: {
    titulo: 'Entre. As *luzes* já estão acesas.',
    texto: fraseReal('Cada detalhe foi pensado para você querer voltar amanhã.', F.frasesMarca),
    comoUsar:
      'Toque numa zona para ir até ela. Arraste para olhar em volta. Todos os pontos também estão na lista abaixo.',
    verDeVerdade: 'Ver de verdade',
    verDeVerdadeNota: 'Carrega a captura real da sala (arquivo maior, só se você pedir).',
  },
  zonas: {
    recepcao: {
      titulo: 'Recepção',
      texto: 'Onde a equipe recebe você e onde começa a sua conversa com a academia.',
    },
    musculacao: {
      titulo: 'Musculação',
      texto:
        'A sala de musculação, 100% Cimerian, sob as molduras de LED do teto. São cinco máquinas de puxada alta, agachamento pêndulo, remadas, crossover, racks e halteres.',
      fonte: `${F.cimerian100} · ${F.puxadas} · ${F.capturas}`,
    },
    'costas-puxadas': {
      titulo: 'Costas e puxadas',
      texto: 'As cinco puxadas altas e a remada curvada na máquina.',
    },
    pernas: { titulo: 'Pernas', texto: 'O agachamento pêndulo e as máquinas de pernas.' },
    'peito-ombro': { titulo: 'Peito e ombro', texto: 'O crossover, sob uma das molduras de luz.' },
    'peso-livre': { titulo: 'Peso livre', texto: 'Racks e o suporte de halteres, com espelho.' },
    cardio: {
      titulo: 'Cardio',
      texto:
        'Esteiras com tela: YouTube, Netflix, Disney+, Prime Video e Spotify enquanto você caminha ou corre.',
      fonte: `${F.esteiraTv} · ${F.cardio}`,
    },
    vestiarios: {
      titulo: 'Vestiários',
      texto: 'Banheiro e vestiário completos.',
      fonte: `${F.diferenciais} · ${F.googleBanheiro}`,
    },
    'avaliacao-fisio': {
      titulo: 'Avaliação e fisioterapia',
      texto:
        'Onde acontece a avaliação funcional com o professor e o acompanhamento de fisioterapeuta.',
      fonte: `${F.avaliacaoFuncional} · ${F.fisioterapeuta}`,
    },
    conveniencia: {
      titulo: 'Conveniência',
      texto: 'Café, lanches, geladeira com bebidas e suplementos.',
      fonte: `${F.diferenciais} · ${F.suplementos}`,
    },
    'espaco-kids': {
      titulo: 'Espaço kids',
      texto: 'Um canto para as crianças enquanto você treina.',
      fonte: F.diferenciais,
    },
  },
  pendenteLayout: 'A posição exata de cada zona entra quando a planta da academia chegar.',
} as const;
