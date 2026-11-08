// robots.txt e sitemap.xml como funções puras (testadas nos dois estados de indexação).
import { paginas } from './paginas.ts';

/**
 * Rastreio sempre liberado: o noindex só é lido se a página puder ser rastreada
 * (Google Search Central, "block-indexing"). O Sitemap só entra quando o site for indexável.
 */
export function gerarRobots(indexavel: boolean, base: string | null): string {
  const linhas = ['User-agent: *', 'Allow: /'];
  if (indexavel && base) linhas.push('', `Sitemap: ${base}/sitemap.xml`);
  return `${linhas.join('\n')}\n`;
}

/** URLs absolutas e canônicas das páginas públicas; vazio (válido) enquanto não for indexável. */
export function gerarSitemap(indexavel: boolean, base: string | null): string {
  const urls =
    indexavel && base ? paginas.map((p) => `  <url><loc>${base}${p.rota}</loc></url>`) : [];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}
