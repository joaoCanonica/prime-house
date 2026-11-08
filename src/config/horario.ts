import { aviso, confirmado } from './tipos.ts';

/** "HH:MM"; "24:00" = meia-noite do dia seguinte. */
export type Hora = `${number}:${number}`;
export type Intervalo = readonly [Hora, Hora];
/** 0 = domingo … 6 = sábado */
export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Feriado {
  readonly data: `${number}-${number}-${number}`;
  readonly nome: string;
}

export interface ConfigHorario {
  readonly fuso: string;
  readonly semana: Readonly<Record<DiaSemana, readonly Intervalo[]>>;
  /** nos feriados vale o horário de domingo */
  readonly feriado: readonly Intervalo[];
  readonly feriados: readonly Feriado[];
}

const DOMINGO: readonly Intervalo[] = [
  ['09:00', '12:00'],
  ['15:00', '18:00'],
];
const UTIL: readonly Intervalo[] = [['05:00', '24:00']];

// Feriados nacionais (Lei 662/1949, 6.802/1980, 14.759/2023 e Sexta-feira Santa).
const FERIADOS: readonly Feriado[] = [
  { data: '2026-01-01', nome: 'Confraternização Universal' },
  { data: '2026-04-03', nome: 'Sexta-feira Santa' },
  { data: '2026-04-21', nome: 'Tiradentes' },
  { data: '2026-05-01', nome: 'Dia do Trabalho' },
  { data: '2026-09-07', nome: 'Independência' },
  { data: '2026-10-12', nome: 'Nossa Senhora Aparecida' },
  { data: '2026-11-02', nome: 'Finados' },
  { data: '2026-11-15', nome: 'Proclamação da República' },
  { data: '2026-11-20', nome: 'Consciência Negra' },
  { data: '2026-12-25', nome: 'Natal' },
  { data: '2027-01-01', nome: 'Confraternização Universal' },
  { data: '2027-03-26', nome: 'Sexta-feira Santa' },
  { data: '2027-04-21', nome: 'Tiradentes' },
  { data: '2027-05-01', nome: 'Dia do Trabalho' },
  { data: '2027-09-07', nome: 'Independência' },
  { data: '2027-10-12', nome: 'Nossa Senhora Aparecida' },
  { data: '2027-11-02', nome: 'Finados' },
  { data: '2027-11-15', nome: 'Proclamação da República' },
  { data: '2027-11-20', nome: 'Consciência Negra' },
  { data: '2027-12-25', nome: 'Natal' },
];

export const horario = {
  regras: confirmado(
    {
      fuso: 'America/Sao_Paulo',
      semana: { 0: DOMINGO, 1: UTIL, 2: UTIL, 3: UTIL, 4: UTIL, 5: UTIL, 6: [['08:00', '18:00']] },
      feriado: DOMINGO,
    } as const,
    'post fixado de 02/06/2026 + João',
  ),
  feriados: aviso(
    FERIADOS,
    'calendário nacional 2026–2027; confirmar com a academia os feriados municipais de Lages e as datas especiais (post de 14/08/2026)',
  ),
} as const;

export const configHorario: ConfigHorario = {
  ...horario.regras.valor,
  feriados: horario.feriados.valor,
};
