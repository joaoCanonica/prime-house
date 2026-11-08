// Termos vetados (CLAUDE.md, seção 8). NUNCA afrouxar sem ordem expressa do João.
export const TERMOS_VETADOS = [
  'melhor academia',
  'a melhor',
  'o melhor',
  'número 1',
  'nº 1',
  'a maior',
  'garantia de melhor',
  'matrícula grátis',
  'primeiro mês grátis',
  '1º mês grátis',
  'grátis',
  'preço congelado',
  'vitalício',
  'desconto',
  'promoção',
  'cura',
  'emagreça',
  'perca',
  'academia de rede',
  'LM Prime House',
] as const;

/** minúsculas, sem acento, º→o, espaços colapsados */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[º°]/g, 'o')
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const PADROES = TERMOS_VETADOS.map((termo) => ({
  termo,
  re: new RegExp(`(?<![\\p{L}\\p{N}])${escapar(normalizar(termo))}(?![\\p{L}\\p{N}])`, 'gu'),
}));

export interface Ocorrencia {
  termo: (typeof TERMOS_VETADOS)[number];
  trecho: string;
}

/** Encontra termos vetados (sem diferenciar maiúsculas nem acentos). */
export function encontrarTermos(texto: string): Ocorrencia[] {
  const norm = normalizar(texto);
  const achados: Ocorrencia[] = [];
  for (const { termo, re } of PADROES) {
    for (const m of norm.matchAll(re)) {
      const i = m.index;
      achados.push({ termo, trecho: norm.slice(Math.max(0, i - 30), i + m[0].length + 30).trim() });
    }
  }
  return achados;
}
