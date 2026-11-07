// /robots.txt, gerado no build (src/components/seo/arquivos.ts).
import type { APIRoute } from 'astro';
import { gerarRobots } from '../components/seo/arquivos.ts';
import { SITE_URL, indexavel } from '../config/seo.ts';

export const GET: APIRoute = () =>
  new Response(gerarRobots(indexavel(), SITE_URL), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
