import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { afterEach, describe, expect, it } from 'vitest';
import PreviewBanner from '../src/components/PreviewBanner.astro';
import Provisorio from '../src/components/Provisorio.astro';

const original = process.env['MODO'];
afterEach(() => {
  if (original === undefined) delete process.env['MODO'];
  else process.env['MODO'] = original;
});

async function render(
  modo: 'preview' | 'producao',
  comp: typeof Provisorio,
  props = {},
  slot?: string,
) {
  process.env['MODO'] = modo;
  const c = await AstroContainer.create();
  return c.renderToString(comp, { props, ...(slot ? { slots: { default: slot } } : {}) });
}

describe('Provisorio', () => {
  it('preview: mostra com selo e data-provisorio', async () => {
    const html = await render(
      'preview',
      Provisorio,
      { motivo: 'confirmar por escrito' },
      'Garantia de 14 dias',
    );
    expect(html).toContain('data-provisorio');
    expect(html).toContain('Garantia de 14 dias');
    expect(html).toContain('Provisório');
  });
  it('produção: não renderiza nada', async () => {
    const html = await render('producao', Provisorio, { motivo: 'x' }, 'Garantia de 14 dias');
    expect(html).not.toContain('Garantia');
    expect(html).not.toContain('data-provisorio');
  });
});

describe('PreviewBanner', () => {
  it('preview: faixa "Em revisão" com contagem de pendências', async () => {
    const html = await render('preview', PreviewBanner);
    expect(html).toContain('data-preview-banner');
    expect(html).toMatch(/Em revisão/);
    expect(html).toMatch(/\d+ pendências/);
  });
  it('produção: nada', async () => {
    expect(await render('producao', PreviewBanner)).not.toContain('data-preview-banner');
  });
});
