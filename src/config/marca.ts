import { aviso, confirmado, opcional } from './tipos.ts';

const FONTE_JOAO = 'João (WAXLO) + perfil oficial';

export const marca = {
  nome: confirmado('Prime House Academia', FONTE_JOAO),
  /** nome curto para títulos e WhatsApp */
  nomeCurto: confirmado('Prime House', FONTE_JOAO),
  logos: {
    empilhado: 'media-originais/marca/primehouse-logo.svg',
    linha: 'media-originais/marca/primehouse-logo-linha.svg',
    mono: 'media-originais/marca/primehouse-logo-mono.svg',
    preto: 'media-originais/marca/primehouse-logo-preto.svg',
  },
  laranja: aviso('#EC8A2A', 'provisório até o oficial (medido no avatar ≈ #DD943D)'),
  fundador: confirmado('Lucas Moro', 'bio do Lucas ("Founder @primehouse.academia")'),
  inauguracao: confirmado('2026-04-30', 'post da inauguração (30/04/2026)'),
  maquinario: confirmado('Cimerian', 'post de 25/08/2026 ("100% equipada")'),
  // Rodapé (seção 8): entram quando informados.
  razaoSocial: opcional<string>(),
  cnpj: confirmado(
    '64.525.617/0001-03',
    'João (WAXLO), 08/11/2026 · dígitos verificadores conferidos',
  ),
  /** responsável técnico: o CREF entra quando o João enviar (busca pública em 08/11/2026 não achou) */
  responsavelTecnico: confirmado<{ nome: string; cref: string | null }>(
    { nome: 'Lucas Moro', cref: null },
    'João (WAXLO), 08/11/2026',
  ),
} as const;
