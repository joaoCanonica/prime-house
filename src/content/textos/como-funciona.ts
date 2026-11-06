// /como-funciona: do primeiro contato ao acompanhamento. Saúde: sempre "orientado e adaptado", nunca "trata".
import { F } from './fontes.ts';
import { fraseReal } from './tipos.ts';

export const comoFunciona = {
  rota: '/como-funciona',
  meta: {
    title: 'Como funciona · avaliação e treino · academia em Lages',
    description:
      'Na Prime House, academia em Lages no Frei Rogério, você começa com avaliação funcional, recebe treino individual no app e conta com fisioterapeuta.',
  },
  resposta:
    'Na Prime House Academia, em Lages/SC, todo aluno começa com uma avaliação funcional com o professor e recebe um treino individual no app. A academia fica na Av. Duque de Caxias, 1253, no Frei Rogério, e oferece treino orientado e adaptado, com acompanhamento de fisioterapeuta.',
  titulo: 'Seu treino, feito para *você*.',
  tituloFonte: fraseReal(
    'Seu treino feito para você',
    F.avaliacaoFuncional,
    'SEU TREINO FEITO PARA VOCÊ',
  ),
  passos: [
    { titulo: 'Contato', texto: 'Você fala com a equipe pelo WhatsApp e tira as dúvidas.' },
    { titulo: 'Visita', texto: 'Você conhece a casa: a sala, as máquinas, o cardio, o conforto.' },
    {
      titulo: 'Avaliação funcional',
      texto: fraseReal(
        'Você passa por uma avaliação funcional junto com o professor para entender toda a sua situação e todos os seus objetivos.',
        F.avaliacaoFuncional,
        'Você passa por uma avaliação funcional junto com o professor pra entender toda tua situação, todos os teus objetivos, e montar um treino específico pra você.',
      ),
    },
    {
      titulo: 'Treino no app',
      texto: fraseReal(
        'Com a avaliação, o professor monta um treino específico para você, que fica no app.',
        `${F.avaliacaoFuncional} · ${F.diferenciais}`,
      ),
    },
    {
      titulo: 'Acompanhamento',
      texto: fraseReal('Uma ficha é importante, mas o acompanhamento também.', F.vozJoao),
      complemento: 'Os professores estão na sala para corrigir, ajustar e explicar.',
    },
    {
      titulo: 'Reavaliação',
      texto: 'Quando seus objetivos e sua capacidade mudam, o treino muda junto.',
    },
  ],
  porQue: fraseReal(
    'Cada aluno é diferente, e o seu treino tem que respeitar isso.',
    F.avaliacaoFuncional,
    '[cada] aluno é diferente e teu treino tem que respeitar isso',
  ),
  fisioterapeuta: {
    titulo: 'Fisioterapeuta na equipe',
    texto:
      'A Prime House tem acompanhamento de fisioterapeuta, que ajuda a adaptar o treino quando você precisa de mais atenção.',
    fonte: F.fisioterapeuta,
  },
  adaptado: {
    titulo: 'Treino orientado e *adaptado*',
    texto:
      'Treino orientado e adaptado, com acompanhamento de fisioterapeuta. A Prime House recebe quem está começando depois dos 40, idosos, pessoas com artrose, no pós-AVC, com lipedema e gestantes.',
    aviso:
      'O treino é orientado e adaptado à sua condição; ele não substitui o acompanhamento médico. Conte sua história para a equipe antes de começar.',
    grupos: ['+40', 'Idosos', 'Artrose', 'Pós-AVC', 'Lipedema', 'Gestantes'],
    fonte: `${F.adaptado} · ${F.fisioterapeuta}`,
    frase: fraseReal('O cuidado com você não tem idade.', `${F.nuncaETarde} · arte 27`),
  },
  botao: 'Agendar avaliação funcional',
} as const;
