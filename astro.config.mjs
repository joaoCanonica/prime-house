// @ts-check
import { defineConfig } from 'astro/config';

// Site estático. O domínio definitivo é pendente (docs/PENDENCIAS.md).
export default defineConfig({
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
