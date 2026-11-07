// /llms.txt, gerado no build (src/components/seo/llms.ts).
import type { APIRoute } from 'astro';
import { gerarLlms } from '../components/seo/llms.ts';
import { SITE_URL } from '../config/seo.ts';

export const GET: APIRoute = () =>
  new Response(gerarLlms(SITE_URL), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
