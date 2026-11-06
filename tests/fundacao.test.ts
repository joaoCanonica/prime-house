import { readFileSync, existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const raiz = new URL('../', import.meta.url);
const ler = (caminho: string) => readFileSync(new URL(caminho, raiz), 'utf8');

describe('fundação', () => {
  it('CLAUDE.md e docs/CONTEXTO.md são idênticos', () => {
    expect(ler('CLAUDE.md')).toBe(ler('docs/CONTEXTO.md'));
    expect(ler('CLAUDE.md').startsWith('CONTEXTO DO PROJETO — Prime House Academia')).toBe(true);
  });

  it('package.json fixa nome, engines e packageManager', () => {
    const pkg = JSON.parse(ler('package.json')) as {
      name: string;
      engines?: Record<string, string>;
      packageManager?: string;
      dependencies: Record<string, string>;
    };
    expect(pkg.name).toBe('primehouse-site');
    expect(pkg.engines?.['node']).toBeTruthy();
    expect(pkg.packageManager).toMatch(/^pnpm@\d+\.\d+\.\d+$/);
    // versões exatas, sem ^ ou ~
    for (const versao of Object.values(pkg.dependencies)) expect(versao).toMatch(/^\d/);
  });

  it('mídia original preservada', () => {
    expect(existsSync(new URL('assets/primehouse-logo.svg', raiz))).toBe(true);
    expect(existsSync(new URL('videos/snapinsta-1793897411209.mp4', raiz))).toBe(true);
  });
});
