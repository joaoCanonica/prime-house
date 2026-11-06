// Tokens de cor (CLAUDE.md, seção 5). Valores "≈": a sessão 3 fecha e valida AA por script.
import { marca } from './marca.ts';

export const cores = {
  breu: '#0A0A0B',
  grafite: '#161719',
  concreto: '#8C8D90',
  nevoa: '#E9E8E5',
  laranja: marca.laranja.valor,
  luz: '#FFF4E0',
} as const;

export type Cor = keyof typeof cores;

/** Pares texto/fundo que precisam passar AA (audit-contraste, sessão 3). */
export const paresContraste: readonly (readonly [Cor, Cor])[] = [
  ['nevoa', 'breu'],
  ['concreto', 'breu'],
  ['nevoa', 'grafite'],
  ['concreto', 'grafite'],
  ['laranja', 'breu'],
  ['breu', 'nevoa'],
];

export const cssVariaveis = (): string =>
  Object.entries(cores)
    .map(([nome, valor]) => `--prime-${nome}: ${valor};`)
    .join(' ');
