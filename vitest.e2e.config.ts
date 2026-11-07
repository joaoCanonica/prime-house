// e2e do funil (Playwright, 390 px) contra o build em dist/. Rode: pnpm build && pnpm test:e2e
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/e2e/**/*.e2e.ts'],
    testTimeout: 90_000,
    hookTimeout: 60_000,
    fileParallelism: false,
  },
});
