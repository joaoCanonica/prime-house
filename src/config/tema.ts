// Tokens de cor (CLAUDE.md, seção 5), calibrados na sessão 3 com os quadros do filme da inauguração:
//  · Luz      = mediana do LED do teto na captura 10 (#FEF4E0) → #FFF4E0
//  · Laranja  = logo no vídeo (#EF8B04, matiz 34°) e avatar (#E09132, 34°); camiseta da equipe a 23°.
//               #EC8A2A (30°) fica dentro do ruído de medição → mantido, PROVISÓRIO até o oficial.
//  · Breu/Grafite/Concreto levemente quentes para casar com os pretos do vídeo (#0E0B0A, matiz 18°).
// src/styles/tokens.css repete estes valores; o audit-contraste confere os dois.
import { marca } from './marca.ts';

export const cores = {
  breu: '#0C0B0A',
  grafite: '#171615',
  concreto: '#8E8C89',
  /** texto secundário sobre Névoa (páginas claras) */
  concretoEscuro: '#5C5A57',
  nevoa: '#E9E8E5',
  laranja: marca.laranja.valor,
  luz: '#FFF4E0',
} as const;

export type Cor = keyof typeof cores;

export interface ParContraste {
  readonly texto: Cor;
  readonly fundo: Cor;
  /** 4.5 = texto normal (AA) · 3 = texto grande ou elemento de interface (AA) */
  readonly minimo: 4.5 | 3;
  readonly uso: string;
}

/** Pares em uso. O audit-contraste derruba se algum ficar abaixo do mínimo. */
export const paresContraste: readonly ParContraste[] = [
  { texto: 'nevoa', fundo: 'breu', minimo: 4.5, uso: 'texto principal' },
  { texto: 'concreto', fundo: 'breu', minimo: 4.5, uso: 'texto secundário, legendas' },
  { texto: 'nevoa', fundo: 'grafite', minimo: 4.5, uso: 'texto em superfícies' },
  { texto: 'concreto', fundo: 'grafite', minimo: 4.5, uso: 'texto secundário em superfícies' },
  { texto: 'luz', fundo: 'breu', minimo: 4.5, uso: 'molduras, foco e número grande' },
  {
    texto: 'luz',
    fundo: 'grafite',
    minimo: 3,
    uso: 'borda do botão secundário e foco em superfícies',
  },
  {
    texto: 'laranja',
    fundo: 'breu',
    minimo: 4.5,
    uso: 'acento: ACADEMIA, número, ponto de status',
  },
  { texto: 'laranja', fundo: 'grafite', minimo: 4.5, uso: 'acento em superfícies' },
  { texto: 'breu', fundo: 'laranja', minimo: 4.5, uso: 'texto do botão principal' },
  { texto: 'breu', fundo: 'nevoa', minimo: 4.5, uso: 'texto em páginas claras' },
  { texto: 'grafite', fundo: 'nevoa', minimo: 4.5, uso: 'títulos em páginas claras' },
  {
    texto: 'concretoEscuro',
    fundo: 'nevoa',
    minimo: 4.5,
    uso: 'texto secundário em páginas claras',
  },
];

/** Combinações proibidas (não passam nem 3:1). */
export const paresProibidos: readonly (readonly [Cor, Cor])[] = [
  ['laranja', 'nevoa'],
  ['concreto', 'nevoa'],
];

export const cssVariaveis = (): string =>
  Object.entries(cores)
    .map(
      ([nome, valor]) =>
        `--prime-${nome.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${valor};`,
    )
    .join(' ');
