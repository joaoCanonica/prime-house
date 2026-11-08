// /sitemap.xml, gerado no build (src/components/seo/arquivos.ts).
import type { APIRoute } from 'astro';
import { gerarSitemap } from '../components/seo/arquivos.ts';
import { SITE_URL, indexavel } from '../config/seo.ts';

export const GET: APIRoute = () =>
  new Response(gerarSitemap(indexavel(), SITE_URL), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
