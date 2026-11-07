import { describe, expect, it } from 'vitest';
import { medicao } from '../src/config/medicao.ts';
import { classificarLink } from '../src/lib/medicao.ts';
import { auditarFunil } from '../scripts/audit-compliance.mjs';

const ctx = { origem: 'hero' };

describe('medição: classificação dos cliques', () => {
  it('WhatsApp com origem, plano e zona', () => {
    expect(classificarLink('https://wa.me/5549998043861?text=Ol%C3%A1', ctx)).toEqual({
      nome: 'clique_whatsapp',
      origem: 'hero',
    });
    expect(
      classificarLink('https://wa.me/5549998043861', { origem: 'tour-3d', zona: 'cardio' }),
    ).toEqual({ nome: 'clique_whatsapp', origem: 'tour-3d', zona: 'cardio' });
    expect(
      classificarLink('https://wa.me/5549998043861', { origem: 'planos', plano: 'select' }),
    ).toEqual({ nome: 'clique_whatsapp', origem: 'planos', plano: 'select' });
  });
  it('como chegar: Google, Waze e Apple', () => {
    expect(classificarLink('https://www.google.com/maps?cid=1', ctx)).toMatchObject({
      nome: 'clique_como_chegar',
      destino: 'google',
    });
    expect(classificarLink('https://waze.com/ul?ll=1,2', ctx)).toMatchObject({ destino: 'waze' });
    expect(classificarLink('https://maps.apple.com/?ll=1,2', ctx)).toMatchObject({
      destino: 'apple',
    });
  });
  it('Instagram', () => {
    expect(classificarLink('https://www.instagram.com/primehouse.academia/', ctx)).toEqual({
      nome: 'clique_instagram',
      origem: 'hero',
    });
  });
  it('links internos e outros não contam', () => {
    expect(classificarLink('http://127.0.0.1/planos', ctx)).toBeNull();
    expect(classificarLink('https://www.google.com/search?q=x', ctx)).toBeNull();
    expect(classificarLink('tel:+5549998043861', ctx)).toBeNull();
  });
});

describe('medição: configuração', () => {
  it('sem cookie e pelo próprio domínio (caminho relativo, nunca um host de terceiro)', () => {
    expect(medicao.ferramenta).toBe('plausible');
    expect(medicao.endpoint.startsWith('/')).toBe(true);
    expect(medicao.endpoint.startsWith('//')).toBe(false);
  });
});

describe('auditoria do funil (pós-build)', () => {
  const rodar = (html: string) => {
    const achados: string[] = [];
    auditarFunil(html, 'x.html', (_g: string, regra: string) => achados.push(regra));
    return achados;
  };
  it('aceita o link do linkWhatsApp()', () => {
    expect(rodar('<a href="https://wa.me/5549998043861?text=Ol%C3%A1!%20oi">x</a>')).toEqual([]);
  });
  it('recusa link sem mensagem ou com outro número', () => {
    expect(rodar('<a href="https://wa.me/5549998043861">x</a>')).toEqual(['whatsapp-link']);
    expect(rodar('<a href="https://wa.me/49998043861?text=Ol%C3%A1!">x</a>')).toEqual([
      'whatsapp-link',
    ]);
  });
  it('acusa recurso de terceiro na carga, mas não o data-src do mapa', () => {
    expect(rodar('<script src="https://plausible.io/js/script.js"></script>')).toEqual([
      'terceiro-sem-consentimento',
    ]);
    expect(rodar('<iframe src="https://www.google.com/maps?output=embed"></iframe>')).toEqual([
      'terceiro-sem-consentimento',
    ]);
    expect(rodar('<link rel="preconnect" href="https://fonts.gstatic.com">')).toEqual([
      'terceiro-sem-consentimento',
    ]);
    expect(rodar('<button data-src="https://www.google.com/maps?output=embed">')).toEqual([]);
    expect(rodar('<img src="/media/x.avif">')).toEqual([]);
  });
});
