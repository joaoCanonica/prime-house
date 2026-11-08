// /planos: três planos sem preço; benefícios fixos confirmados (08/11/2026); convênio Estar Bem.
import { F } from './fontes.ts';
import { fraseReal, provisorio } from './tipos.ts';

export const planos = {
  rota: '/planos',
  meta: {
    title: 'Planos Prime, Select e Duo · academia em Lages',
    description:
      'Planos da Prime House, academia em Lages no Frei Rogério: Prime, Select com professor dedicado e Duo para treinar em dupla. Condições com a equipe.',
  },
  resposta:
    'A Prime House Academia, na Av. Duque de Caxias, 1253, no Frei Rogério, em Lages/SC, tem três planos: Prime, Select e Duo. Os valores não ficam no site; você conhece as condições falando com a equipe pelo WhatsApp.',
  titulo: 'Escolha como você quer *treinar*.',
  itens: {
    prime: {
      nome: 'Plano Prime',
      resumo: provisorio(
        'Musculação em trânsito livre, no horário da academia.',
        'confirmar com a academia o que o Plano Prime inclui',
      ),
      botao: 'Quero o Plano Prime',
      fonte: F.beneficiosLucas,
    },
    select: {
      nome: 'Plano Select',
      gancho: fraseReal(
        'Já pensou em ter um professor como personal dentro da academia?',
        F.select,
      ),
      resumo: fraseReal(
        'Um professor dedicado exclusivamente a você durante o treino, com acompanhamento e orientação individualizados.',
        F.select,
        'Com o Plano Select da Prime House você tem um professor dedicado exclusivamente a você durante o treino, com acompanhamento e orientação individualizados.',
      ),
      botao: 'Quero o Plano Select',
      fonte: F.select,
    },
    duo: {
      nome: 'Plano Duo',
      resumo: 'Para treinar em dupla, com quem caminha junto com você.',
      botao: 'Quero o Plano Duo',
      fonte: `${F.duo} · a condição da segunda pessoa é preço e fica fora do site`,
    },
  },
  beneficios: {
    titulo: 'Benefícios',
    itens: [
      {
        id: 'garantia-14-dias',
        titulo: 'Garantia de 14 dias',
        texto: 'Se você vier e não gostar de qualquer coisa, a academia devolve 100% do valor.',
        fonte: `${F.beneficiosLucas} ("Se você vir e não gostar de qualquer coisa, a gente devolve 100% do teu dinheiro")`,
      },
      {
        id: 'trancamento-30-dias',
        titulo: 'Trancamento',
        texto: 'No plano anual, você pode trancar por 30 dias e usar depois.',
        fonte: `${F.beneficiosLucas} ("no plano anual você ainda pode trancar ele por trinta dias e usar depois")`,
      },
      {
        id: 'sexta-prime',
        titulo: 'Sexta Prime',
        texto: 'Toda sexta-feira, traga um amigo ou familiar para treinar com você.',
        fonte: `${F.beneficiosLucas} ("toda sexta-feira algum amigo ou algum familiar pra treinar junto contigo")`,
      },
    ],
  },
  convenio: {
    titulo: 'Convênio Estar Bem',
    texto: 'A Prime House faz parte da rede Estar Bem. Pergunte à equipe como funciona para você.',
    fonte: F.estarBem,
  },
  perguntas: [
    {
      p: 'Por que os planos não têm preço no site?',
      r: 'Porque as condições mudam. A equipe explica tudo pelo WhatsApp, sem compromisso.',
    },
    {
      p: 'Qual plano é para mim?',
      r: 'Se você quer liberdade de horário, o Prime. Se quer um professor só seu durante o treino, o Select. Se vai treinar com alguém, o Duo.',
    },
    { p: 'Tem convênio?', r: 'Sim, a Prime House faz parte da rede Estar Bem.' },
  ],
  chamada: 'Fale com a equipe e conheça as condições.',
  /** escolha de plano: monta a mensagem do WhatsApp; nada é guardado */
  escolha: {
    titulo: 'Monte sua *mensagem*.',
    instrucao: 'Escolha o plano e, se quiser, o período. A mensagem vai pronta; nada é guardado.',
    planoLegenda: 'Plano',
    naoSei: 'Ainda não sei',
    periodoLegenda: 'Quando você prefere treinar',
    periodos: { manha: 'De manhã', tarde: 'À tarde', noite: 'À noite' },
    previa: 'Mensagem',
    botao: 'Enviar no WhatsApp',
  },
} as const;
