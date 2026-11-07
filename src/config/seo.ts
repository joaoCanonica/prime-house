// SEO base. SITE_URL vem do ambiente (domínio definitivo pendente). Indexação desligada até a sessão 9.
import { modoAtual, type Modo } from './modo.ts';

export const SITE_URL: string | null =
  globalThis.process?.env['SITE_URL']?.trim().replace(/\/+$/, '') || null;

/** Só liga quando o João autorizar a publicação (sessão 9). */
export const indexar = false;

/** Indexável = indexar ligado, build de produção e domínio definido. */
export const indexavel = (modo: Modo = modoAtual(), ligado: boolean = indexar): boolean =>
  ligado && modo === 'producao' && SITE_URL !== null;

export function robots(modo: Modo = modoAtual()): string {
  return indexavel(modo) ? 'index, follow' : 'noindex, nofollow';
}

export const seo = {
  idioma: 'pt-BR',
  localidade: 'pt_BR',
  tituloPadrao: 'Prime House Academia · Lages/SC',
  separador: ' · ',
} as const;
