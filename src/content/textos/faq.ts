// /perguntas-frequentes. Perguntas reais do destaque "Dúvidas" + horário, feriado, estacionamento e benefícios.
import { F } from './fontes.ts';
import { fraseReal, provisorio, type Texto } from './tipos.ts';

const CONFIRMAR = 'benefício fixo: confirmar por escrito com a academia';

interface Pergunta {
  readonly p: Texto;
  readonly r: Texto;
  readonly fonte?: string;
}
interface Grupo {
  readonly titulo: string;
  readonly perguntas: readonly Pergunta[];
}

export const faq = {
  rota: '/perguntas-frequentes',
  meta: {
    title: 'Perguntas frequentes · Prime House, academia em Lages',
    description:
      'Dúvidas sobre a Prime House, academia em Lages no Frei Rogério: personal, iniciantes, lotação, horário de domingo, espaço kids e maquinário.',
  },
  resposta:
    'Estas são as dúvidas que as pessoas mais mandam para a Prime House Academia, na Av. Duque de Caxias, 1253, no Frei Rogério, em Lages/SC. Se a sua não estiver aqui, fale com a equipe pelo WhatsApp.',
  titulo: 'Perguntas *frequentes*',
  grupos: [
    {
      titulo: 'Treino',
      perguntas: [
        {
          p: fraseReal('É pra treinar com personal?', F.duvidas),
          r: 'Você treina com acompanhamento dos professores da sala. Se quiser um professor dedicado só a você durante o treino, existe o Plano Select.',
          fonte: F.select,
        },
        {
          p: fraseReal('Essa academia também é pra iniciante?', F.duvidas),
          r: fraseReal(
            'Sim. Aqui, você não precisa chegar pronto. Só precisa chegar. A avaliação funcional mostra por onde começar.',
            `${F.frasesMarca} · ${F.avaliacaoFuncional}`,
          ),
        },
        {
          p: fraseReal('Não aguento mais minha academia lotada.', F.duvidas),
          r: 'A Prime House é de trânsito livre e foi montada para você não esperar a vez: são cinco máquinas de puxada alta, por exemplo.',
          fonte: `${F.transito} · ${F.puxadas}`,
        },
        {
          p: fraseReal('Vai ter nutri na academia?', F.duvidas),
          r: provisorio(
            'Pergunte à equipe pelo WhatsApp.',
            'nutricionista na equipe: sem informação confirmada',
          ),
        },
      ],
    },
    {
      titulo: 'Estrutura',
      perguntas: [
        {
          p: fraseReal('Os aparelhos são da China?', F.duvidas),
          r: 'Não. Todo o maquinário é Cimerian, marca nacional de máquinas de musculação.',
          fonte: F.cimerian100,
        },
        {
          p: fraseReal('Vocês podiam fazer um espaço kids?', F.duvidas),
          r: 'Tem espaço kids, para as crianças enquanto você treina.',
          fonte: F.diferenciais,
        },
        {
          p: fraseReal(
            'Por favor, não façam uma academia fechada sem janela.',
            F.duvidas,
            'Pfv não façam uma academia fechada sem janela.',
          ),
          r: 'A sala tem janelas altas e é climatizada.',
          fonte: `${F.capturas} · ${F.climatizacao}`,
        },
        {
          p: fraseReal(
            'Vai ter alguma novidade no cardio?',
            F.duvidas,
            'Vai ter alguma novidade no cárdio?',
          ),
          r: 'O cardio tem esteiras com tela, com YouTube, Netflix, Disney+, Prime Video e Spotify.',
          fonte: `${F.esteiraTv} · ${F.cardio}`,
        },
        {
          p: 'Tem estacionamento?',
          r: provisorio(
            'Informação em breve. Pergunte à equipe pelo WhatsApp.',
            'estacionamento: pendente',
          ),
        },
      ],
    },
    {
      titulo: 'Horário e endereço',
      perguntas: [
        {
          p: fraseReal('Onde fica a academia?', F.duvidas),
          r: 'Na Av. Duque de Caxias, 1253, bairro Frei Rogério, em Lages/SC.',
        },
        { p: 'Abre no domingo?', r: 'Sim: das 9h às 12h e das 15h às 18h.', fonte: F.horario },
        {
          p: 'E nos feriados?',
          r: provisorio(
            'Nos feriados, vale o horário de domingo: das 9h às 12h e das 15h às 18h.',
            'feriados municipais e datas especiais a confirmar',
          ),
          fonte: F.horario,
        },
        {
          p: 'Até que horas fica aberta?',
          r: 'De segunda a sexta, até a meia-noite. Abre às 5h.',
          fonte: F.horario,
        },
      ],
    },
    {
      titulo: 'Planos',
      perguntas: [
        {
          p: 'Quanto custa?',
          r: 'Os valores não ficam no site. Fale com a equipe e conheça as condições.',
        },
        {
          p: 'O que é a Sexta Prime?',
          r: provisorio(
            'Toda sexta-feira, você pode trazer um amigo ou familiar para treinar com você.',
            CONFIRMAR,
          ),
          fonte: F.beneficiosLucas,
        },
        {
          p: 'Tem garantia?',
          r: provisorio(
            'Sim: 14 dias. Se você vier e não gostar de qualquer coisa, a academia devolve 100% do valor.',
            CONFIRMAR,
          ),
          fonte: F.beneficiosLucas,
        },
        {
          p: 'Posso trancar o plano?',
          r: provisorio('No plano anual, você pode trancar por 30 dias e usar depois.', CONFIRMAR),
          fonte: F.beneficiosLucas,
        },
        {
          p: 'Tem convênio?',
          r: 'Sim, a Prime House faz parte da rede Estar Bem.',
          fonte: F.estarBem,
        },
      ],
    },
  ] satisfies readonly Grupo[],
} as const;
