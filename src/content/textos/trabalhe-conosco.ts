// /trabalhe-conosco: vagas do post de 27/02/2026; candidatura pelo WhatsApp (e-mail pendente).
import { F } from './fontes.ts';
import { fraseReal } from './tipos.ts';

export const trabalheConosco = {
  rota: '/trabalhe-conosco',
  meta: {
    title: 'Trabalhe conosco · Prime House, academia em Lages',
    description:
      'Trabalhe na Prime House, academia em Lages no Frei Rogério: áreas comercial, instrutores e limpeza. Mande sua mensagem para a equipe pelo WhatsApp.',
  },
  resposta:
    'A Prime House Academia, na Av. Duque de Caxias, 1253, no Frei Rogério, em Lages/SC, contrata para as áreas comercial, de instrução e de limpeza. Para se candidatar, mande uma mensagem para a equipe pelo WhatsApp.',
  titulo: fraseReal(
    'Aqui, a gente não treina só alunos. A gente treina pessoas que *cuidam* de pessoas.',
    F.frasesMarca,
  ),
  valorizamos: 'Se você gosta de cuidar de gente, sua vaga pode estar aqui.',
  areas: [
    {
      id: 'comercial',
      titulo: 'Comercial',
      texto: 'Atender quem chega, apresentar a casa e os planos.',
    },
    {
      id: 'instrutores',
      titulo: 'Instrutores',
      texto: 'Acompanhar os alunos na sala. Para instrutores, é preciso registro no CREF.',
    },
    {
      id: 'limpeza',
      titulo: 'Limpeza',
      texto: 'Cuidar para a casa estar sempre pronta para receber.',
    },
  ],
  fonte: F.vagas,
  aviso: 'As vagas abertas mudam. Mesmo sem vaga anunciada, você pode mandar sua apresentação.',
  comoCandidatar: {
    titulo: 'Como se candidatar',
    passos: [
      'Mande uma mensagem pelo WhatsApp dizendo a área.',
      'Conte um pouco de você e da sua experiência.',
      'A equipe responde e combina os próximos passos.',
    ],
    botao: 'Quero trabalhar na Prime House',
    email: null,
  },
} as const;
