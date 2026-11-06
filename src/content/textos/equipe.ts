// /equipe: estrutura pronta. Nomes, fotos, CREF e especialidades só com autorização (pendentes).
import { F } from './fontes.ts';
import { fraseReal } from './tipos.ts';

export const equipe = {
  rota: '/equipe',
  meta: {
    title: 'Equipe · Prime House, academia em Lages',
    description:
      'Conheça a equipe da Prime House, academia em Lages no Frei Rogério: fundador Lucas Moro, professores em desenvolvimento contínuo e fisioterapeuta.',
  },
  resposta:
    'A equipe da Prime House Academia, em Lages/SC, reúne professores, fisioterapeuta e o time de atendimento, com o fundador Lucas Moro, treinador da LM Team. A academia fica na Av. Duque de Caxias, 1253, no Frei Rogério.',
  titulo: fraseReal(
    'Aqui, a gente não cuida só de corpos. A gente cuida de *pessoas*.',
    F.frasesMarca,
  ),
  geral: 'Quem está na sala sabe o seu nome, conhece o seu treino e acompanha a sua evolução.',
  desenvolvimento: {
    titulo: 'Professores em desenvolvimento contínuo',
    texto:
      'Os professores da Prime House estão em desenvolvimento contínuo, para o acompanhamento estar sempre em dia.',
    fonte: F.professores,
  },
  fundador: {
    nome: 'Lucas Moro',
    papel: 'Fundador',
    texto: 'Treinador da LM Team e fundador da Prime House.',
    fonte: 'bio de @lucas__moro ("Founder @primehouse.academia")',
  },
  /** cada pessoa entra só com nome, foto e CREF autorizados */
  papeis: [
    { id: 'professores', titulo: 'Professores', campos: ['nome', 'foto', 'CREF', 'especialidade'] },
    {
      id: 'fisioterapeuta',
      titulo: 'Fisioterapeuta',
      campos: ['nome', 'foto', 'CREFITO', 'especialidade'],
    },
    { id: 'atendimento', titulo: 'Atendimento', campos: ['nome', 'foto'] },
  ],
  vazio: 'Os nomes da equipe entram aqui em breve.',
} as const;
