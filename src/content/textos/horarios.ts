// /horarios-e-como-chegar. Horário confirmado; feriados municipais, estacionamento e acessibilidade pendentes.
import { F } from './fontes.ts';
import { provisorio } from './tipos.ts';

export const horarios = {
  rota: '/horarios-e-como-chegar',
  meta: {
    title: 'Horários e como chegar · academia em Lages',
    description:
      'Prime House, academia em Lages na Av. Duque de Caxias, 1253, Frei Rogério. Segunda a sexta 5h–0h, sábado 8h–18h, domingo 9h–12h e 15h–18h.',
  },
  resposta:
    'A Prime House Academia é uma academia no Frei Rogério, em Lages/SC, na Av. Duque de Caxias, 1253. É uma academia aberta até meia-noite de segunda a sexta (das 5h às 0h), abre no sábado das 8h às 18h e também é academia aberta no domingo e nos feriados, das 9h às 12h e das 15h às 18h.',
  titulo: 'Quando *você* puder.',
  endereco: {
    rotulo: 'Endereço',
    copiar: 'Copiar endereço',
    copiado: 'Endereço copiado',
  },
  tabela: {
    titulo: 'Horário de funcionamento',
    linhas: [
      { dias: 'Segunda a sexta', horario: '5h às 0h' },
      { dias: 'Sábado', horario: '8h às 18h' },
      { dias: 'Domingo e feriados', horario: '9h às 12h e 15h às 18h' },
    ],
    fonte: F.horario,
  },
  feriados: provisorio(
    'Nos feriados, vale o horário de domingo.',
    'regra confirmada para os nacionais; feriados municipais de Lages e datas especiais a confirmar',
  ),
  comoChegar: {
    titulo: 'Como chegar',
    texto:
      'Na Av. Duque de Caxias, 1253, no bairro Frei Rogério. Abra a rota no seu aplicativo de mapas.',
    mapaInterativo: 'Abrir mapa interativo',
    mapaAviso: 'O mapa interativo é do Google, usa cookies e só carrega se você clicar e aceitar.',
  },
  estacionamento: provisorio(
    'Informação de estacionamento em breve.',
    'estacionamento: pendente (João/academia)',
  ),
  acessibilidade: provisorio(
    'Informação de acessibilidade em breve.',
    'acessibilidade: pendente (João/academia)',
  ),
} as const;
