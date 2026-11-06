// Motor de horário: status ao vivo no fuso da academia (America/Sao_Paulo).
import {
  configHorario,
  type ConfigHorario,
  type DiaSemana,
  type Intervalo,
} from '../config/horario.ts';

export type EstadoHorario = 'aberto' | 'fechando' | 'pausa' | 'fechado';
export interface StatusHorario {
  readonly estado: EstadoHorario;
  readonly aberto: boolean;
  readonly texto: string;
}

/** Abaixo disso (minutos), "Fecha em N min". */
export const AVISO_FECHAMENTO_MIN = 30;

const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'] as const;

interface DataCivil {
  ano: number;
  mes: number;
  dia: number;
}

function partesLocais(data: Date, fuso: string) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: fuso,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const p = Object.fromEntries(fmt.formatToParts(data).map((x) => [x.type, x.value]));
  const n = (k: string) => Number(p[k]);
  return {
    civil: { ano: n('year'), mes: n('month'), dia: n('day') },
    minutos: n('hour') * 60 + n('minute'),
  };
}

const iso = (d: DataCivil) =>
  `${d.ano}-${String(d.mes).padStart(2, '0')}-${String(d.dia).padStart(2, '0')}`;

function somarDias(d: DataCivil, n: number): DataCivil {
  const t = new Date(Date.UTC(d.ano, d.mes - 1, d.dia + n));
  return { ano: t.getUTCFullYear(), mes: t.getUTCMonth() + 1, dia: t.getUTCDate() };
}

const diaDaSemana = (d: DataCivil) =>
  new Date(Date.UTC(d.ano, d.mes - 1, d.dia)).getUTCDay() as DiaSemana;

const paraMinutos = (h: string) => {
  const [hh = '0', mm = '0'] = h.split(':');
  return Number(hh) * 60 + Number(mm);
};

/** 300 → "5h"; 930 → "15h30"; 1440 → "0h" */
export function formatarHora(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`;
}

export function intervalosDoDia(
  d: DataCivil,
  cfg: ConfigHorario = configHorario,
): readonly Intervalo[] {
  if (cfg.feriados.some((f) => f.data === iso(d))) return cfg.feriado;
  return cfg.semana[diaDaSemana(d)];
}

export function statusEm(data: Date, cfg: ConfigHorario = configHorario): StatusHorario {
  const { civil, minutos } = partesLocais(data, cfg.fuso);
  const hoje = intervalosDoDia(civil, cfg).map(
    ([a, b]) => [paraMinutos(a), paraMinutos(b)] as const,
  );

  const atual = hoje.find(([a, b]) => minutos >= a && minutos < b);
  if (atual) {
    const restam = atual[1] - minutos;
    if (restam <= AVISO_FECHAMENTO_MIN) {
      return { estado: 'fechando', aberto: true, texto: `Fecha em ${restam} min` };
    }
    return {
      estado: 'aberto',
      aberto: true,
      texto: `Aberto agora · até ${formatarHora(atual[1])}`,
    };
  }

  const proximoHoje = hoje.find(([a]) => a > minutos);
  if (proximoHoje) {
    const jaAbriuHoje = hoje.some(([, b]) => b <= minutos);
    return jaAbriuHoje
      ? {
          estado: 'pausa',
          aberto: false,
          texto: `Pausa · reabre às ${formatarHora(proximoHoje[0])}`,
        }
      : {
          estado: 'fechado',
          aberto: false,
          texto: `Fechado · abre às ${formatarHora(proximoHoje[0])}`,
        };
  }

  for (let n = 1; n <= 14; n++) {
    const dia = somarDias(civil, n);
    const primeiro = intervalosDoDia(dia, cfg)[0];
    if (!primeiro) continue;
    const quando = n === 1 ? 'amanhã' : DIAS[diaDaSemana(dia)];
    return {
      estado: 'fechado',
      aberto: false,
      texto: `Fechado · abre ${quando} às ${formatarHora(paraMinutos(primeiro[0]))}`,
    };
  }
  return { estado: 'fechado', aberto: false, texto: 'Fechado' };
}
