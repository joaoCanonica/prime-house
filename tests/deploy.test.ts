import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface Regra {
  source: string;
  headers: { key: string; value: string }[];
}
const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')) as {
  headers: Regra[];
  buildCommand: string;
  outputDirectory: string;
};
// as fontes usam grupos e lookahead; para estes padrões simples, a regex equivalente é ^fonte$
const casa = (r: Regra, caminho: string) => new RegExp(`^${r.source}$`).test(caminho);
const valores = (caminho: string, chave: string) =>
  config.headers
    .filter((r) => casa(r, caminho))
    .flatMap((r) => r.headers.filter((h) => h.key === chave).map((h) => h.value));

describe('vercel.json', () => {
  it('build e saída', () => {
    expect(config.buildCommand).toBe('pnpm run build:vercel');
    expect(config.outputDirectory).toBe('dist');
  });
  it('cabeçalhos de segurança em toda rota', () => {
    for (const c of ['/', '/planos/', '/media/x/y.1234abcd.mp4', '/llms.txt']) {
      expect(valores(c, 'Strict-Transport-Security')[0]).toMatch(/max-age=\d{8}/);
      expect(valores(c, 'Referrer-Policy')).toEqual(['strict-origin-when-cross-origin']);
      expect(valores(c, 'Permissions-Policy')[0]).toMatch(/camera=\(\).*geolocation=\(\)/);
      expect(valores(c, 'Content-Security-Policy')[0]).toMatch(/frame-ancestors 'none'/);
      expect(valores(c, 'X-Content-Type-Options')).toEqual(['nosniff']);
    }
  });
  it('cache: exatamente uma regra por caminho', () => {
    const esperado: [string, RegExp | null][] = [
      ['/_astro/tour.C7z65nh_.js', /immutable/],
      ['/media/interior-noite/interior-noite-720x1280.372f1dd4.mp4', /immutable/],
      ['/modelos/maquete.26fcdc08.glb', /immutable/],
      ['/modelos/splats/cardio.0a1b2c3d.sog', /immutable/],
      ['/modelos/indice.json', /max-age=0, must-revalidate/],
      ['/media/indice.json', /max-age=0, must-revalidate/],
      ['/modelos/libs/draco/draco_decoder.wasm', /max-age=604800$/],
      ['/og/prime-house.jpg', /max-age=86400/],
      ['/llms.txt', /max-age=3600/],
      ['/planos/', null],
    ];
    for (const [c, re] of esperado) {
      const v = valores(c, 'Cache-Control');
      if (re === null) expect(v, c).toEqual([]);
      else {
        expect(v, c).toHaveLength(1);
        expect(v[0], c).toMatch(re);
      }
    }
  });
  it('GLB com o tipo certo (comprimível pela CDN)', () => {
    expect(valores('/modelos/maquete.26fcdc08.glb', 'Content-Type')).toEqual(['model/gltf-binary']);
  });
});
