// @ts-check
import { defineConfig } from 'astro/config';

// Site estático. SITE_URL (domínio definitivo) vem do ambiente; pendente em docs/PENDENCIAS.md.
const site = process.env.SITE_URL?.trim() || undefined;

export default defineConfig({
  ...(site ? { site } : {}),
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
  // CSP por hash (meta em cada página): todo <script> e <style> que o Astro gera entra com o seu SHA-256.
  // Exceções documentadas em docs/DEPLOY.md:
  //  · 'wasm-unsafe-eval' — decodificadores WebAssembly do 3D (Meshopt; Draco/KTX2 e Spark sob demanda);
  //  · worker-src blob: — workers que o Spark (splats) cria a partir de blob;
  //  · img-src data: blob: — LQIP embutido e texturas do three.js;
  //  · style-src-attr 'unsafe-inline' — atributos style="" de posição (régua do horário, molduras);
  //  · connect-src tiles.openfreemap.org — o mapa real em 3D (estilo, blocos, fontes e ícones), só quando a
  //    pessoa pede ("Mapa real") ou já aceitou os serviços de terceiros. Sem cookies.
  // frame-ancestors não vale em <meta>: vai como cabeçalho (vercel.json).
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "img-src 'self' data: blob:",
        "media-src 'self'",
        "font-src 'self'",
        "connect-src 'self' https://tiles.openfreemap.org",
        "worker-src 'self' blob:",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "manifest-src 'self'",
      ],
      scriptDirective: { resources: ["'self'", "'wasm-unsafe-eval'"] },
      styleDirective: {
        resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }],
      },
    },
  },
});
