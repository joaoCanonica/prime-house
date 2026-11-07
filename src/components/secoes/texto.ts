// Utilitários de texto das seções: *palavra* → itálico serifado (uma por título), com HTML escapado.
import type { Texto } from '../../content/textos/tipos.ts';

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
export const escapar = (s: string) => s.replace(/[&<>"]/g, (c) => ESC[c] ?? c);

export const bruto = (t: Texto): string => (typeof t === 'string' ? t : t.texto);

/** HTML com o acento: "O novo *padrão*" → O novo <em class="acento">padrão</em> */
export const comAcento = (t: Texto): string =>
  escapar(bruto(t)).replace(/\*(.+?)\*/g, '<em class="acento">$1</em>');

/** Texto sem marcação (para alt, aria-label, mensagens) */
export const plano = (t: Texto): string => bruto(t).replace(/\*/g, '');

export const ehProvisorio = (
  t: unknown,
): t is { provisorio: true; texto: string; motivo: string } =>
  typeof t === 'object' && t !== null && 'provisorio' in t;
