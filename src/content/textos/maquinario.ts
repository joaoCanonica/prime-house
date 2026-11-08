// /maquinario: introdução (Cimerian, nacional) e um texto por equipamento confirmado.
// "dica" fica null: não há vídeo de execução transcrito no material recebido (pendência).
import { F } from './fontes.ts';

export const maquinario = {
  rota: '/maquinario',
  meta: {
    title: 'Maquinário Cimerian · Prime House, academia em Lages',
    description:
      'Academia em Lages no Frei Rogério 100% equipada com Cimerian, marca nacional: 5 puxadas altas, agachamento pêndulo, remadas e mais.',
  },
  resposta:
    'Todo o maquinário da Prime House Academia é Cimerian, marca nacional de máquinas de musculação. A academia fica na Av. Duque de Caxias, 1253, no Frei Rogério, em Lages/SC, e tem cinco máquinas de puxada alta, agachamento pêndulo, remadas, crossover, racks e halteres.',
  intro: {
    titulo: '100% *Cimerian*.',
    texto:
      'Cimerian é uma marca brasileira de máquinas de musculação. Na Prime House, toda a sala é Cimerian, máquina por máquina.',
    fonte: `${F.cimerian100} · ${F.cimerianPosts}`,
    filtro: 'Filtrar por grupo muscular',
    filtroTodos: 'Todos',
    naCasa: 'Ver na Casa',
    verExecucao: 'Ver execução',
  },
  equipamentos: {
    'puxada-alta': {
      paraQuem:
        'Para quem quer costas mais fortes e uma puxada bem guiada. São cinco: você não espera a vez.',
      dica: null,
      fonte: F.puxadas,
    },
    'agachamento-pendulo': {
      paraQuem: 'Para treinar pernas com o tronco apoiado e a trajetória guiada pela máquina.',
      dica: null,
      fonte: F.pendulo,
    },
    'remada-curvada-maquina': {
      paraQuem: 'A remada curvada com o peito apoiado: o foco fica nas costas.',
      dica: null,
      fonte: F.remadas,
    },
    crossover: {
      paraQuem: 'Polias dos dois lados para peito, ombros e muitos outros exercícios, em pé.',
      dica: null,
      fonte: 'captura 05 (crossover Cimerian)',
    },
    'rack-gaiola': {
      paraQuem:
        'Para agachamento, levantamentos e exercícios com barra, com segurança na estrutura.',
      dica: null,
      fonte: 'captura 04',
    },
    halteres: {
      paraQuem:
        'Halteres cromados em suporte, com espelho: para o treino de qualquer grupo muscular.',
      dica: null,
      fonte: 'captura 02 e filme da inauguração',
    },
    'esteira-tv': {
      paraQuem: 'Para o cardio com a sua série ou playlist na tela.',
      dica: null,
      fonte: F.esteiraTv,
    },
  },
  maisEmBreve: 'A lista completa do maquinário entra quando a academia enviar os modelos.',
} as const;
