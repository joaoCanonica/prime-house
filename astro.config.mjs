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
});
