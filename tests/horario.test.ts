import { describe, expect, it } from 'vitest';
import { formatarHora, statusEm } from '../src/lib/horario.ts';

// Horários em America/Sao_Paulo (UTC−3, sem horário de verão).
const em = (iso: string) => statusEm(new Date(`${iso}-03:00`));

describe('statusEm', () => {
  it('segunda 4h50: fechado, abre às 5h', () => {
    expect(em('2026-11-09T04:50:00')).toMatchObject({
      estado: 'fechado',
      texto: 'Fechado · abre às 5h',
    });
  });
  it('segunda 10h: aberto até 0h', () => {
    expect(em('2026-11-09T10:00:00')).toMatchObject({
      estado: 'aberto',
      texto: 'Aberto agora · até 0h',
    });
  });
  it('sexta 23h40: fecha em 20 min', () => {
    expect(em('2026-11-13T23:40:00')).toMatchObject({
      estado: 'fechando',
      aberto: true,
      texto: 'Fecha em 20 min',
    });
  });
  it('sexta 23h30: limite de 30 min', () => {
    expect(em('2026-11-13T23:30:00').texto).toBe('Fecha em 30 min');
    expect(em('2026-11-13T23:29:00').texto).toBe('Aberto agora · até 0h');
  });
  it('sábado 18h05: fechado, abre amanhã às 9h', () => {
    expect(em('2026-11-07T18:05:00')).toMatchObject({
      estado: 'fechado',
      texto: 'Fechado · abre amanhã às 9h',
    });
  });
  it('domingo 12h30: pausa, reabre às 15h', () => {
    expect(em('2026-11-08T12:30:00')).toMatchObject({
      estado: 'pausa',
      aberto: false,
      texto: 'Pausa · reabre às 15h',
    });
  });
  it('domingo 10h: aberto até 12h', () => {
    expect(em('2026-11-08T10:00:00').texto).toBe('Aberto agora · até 12h');
  });
  it('domingo 18h01: fechado, abre amanhã às 5h', () => {
    expect(em('2026-11-08T18:01:00').texto).toBe('Fechado · abre amanhã às 5h');
  });
  it('feriado (sexta 20/11, Consciência Negra) segue o domingo', () => {
    expect(em('2026-11-20T06:00:00').texto).toBe('Fechado · abre às 9h');
    expect(em('2026-11-20T10:00:00').texto).toBe('Aberto agora · até 12h');
    expect(em('2026-11-20T13:00:00').texto).toBe('Pausa · reabre às 15h');
    expect(em('2026-11-20T18:30:00').texto).toBe('Fechado · abre amanhã às 8h');
  });
  it('véspera de feriado: quinta 19/11 23h59 fecha em 1 min; depois abre às 9h do feriado', () => {
    expect(em('2026-11-19T23:59:00').texto).toBe('Fecha em 1 min');
  });
  it('virada de ano', () => {
    expect(em('2026-12-31T23:40:00').texto).toBe('Fecha em 20 min');
    expect(em('2027-01-01T00:00:00').texto).toBe('Fechado · abre às 9h');
    expect(em('2027-01-01T00:30:00').texto).toBe('Fechado · abre às 9h');
    expect(em('2027-01-01T18:00:00').texto).toBe('Fechado · abre amanhã às 8h');
  });
  it('independe do fuso da máquina (instante em UTC)', () => {
    expect(statusEm(new Date('2026-11-09T07:50:00Z')).texto).toBe('Fechado · abre às 5h'); // 4h50 em Lages
  });
});

describe('formatarHora', () => {
  it('formata', () => {
    expect(formatarHora(300)).toBe('5h');
    expect(formatarHora(930)).toBe('15h30');
    expect(formatarHora(1440)).toBe('0h');
  });
});
