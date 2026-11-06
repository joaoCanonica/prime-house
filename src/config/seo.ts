// SEO base. SITE_URL vem do ambiente (domínio definitivo pendente). Indexação desligada até a sessão 8/9.
import { modoAtual, type Modo } from './modo.ts';

export const SITE_URL: string | null = globalThis.process?.env['SITE_URL']?.trim() || null;

/** Só liga quando o João autorizar a publicação (sessão 9). */
export const indexar = false;

export function robots(modo: Modo = modoAtual()): string {
  return indexar && modo === 'producao' && SITE_URL ? 'index, follow' : 'noindex, nofollow';
}

export const seo = {
  idioma: 'pt-BR',
  localidade: 'pt_BR',
  tituloPadrao: 'Prime House Academia · Lages/SC',
  separador: ' · ',
} as const;
