import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { auditarContraste, contraste } from '../scripts/audit-contraste.mjs';
import { comAtributos, compactarSvg } from '../src/components/marca/svg.ts';
import { cores } from '../src/config/tema.ts';

describe('contraste', () => {
  it('fórmula WCAG: preto × branco = 21', () => {
    expect(contraste('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
  });
  it('todos os pares em uso passam AA e tokens.css = tema.ts', () => {
    const r = auditarContraste();
    expect(r.divergencias).toEqual([]);
    expect(r.linhas.filter((l) => l.minimo && !l.ok)).toEqual([]);
    expect(r.ok).toBe(true);
  });
  it('laranja da marca segue o valor provisório da config', () => {
    expect(cores.laranja).toBe('#EC8A2A');
  });
});

describe('logo', () => {
  const svg = readFileSync('media-originais/marca/primehouse-logo.svg', 'utf8');
  it('compacta sem perder as cores dinâmicas', () => {
    const c = compactarSvg(svg);
    expect(c.length).toBeLessThan(svg.length * 0.45);
    expect(c).toContain('fill="currentColor"');
    expect(c).toContain('var(--prime-laranja');
    expect(c).not.toMatch(/\d+\.\d{2,}/);
  });
  it('aplica atributos e troca o nome acessível', () => {
    const c = comAtributos(compactarSvg(svg), { 'aria-hidden': 'true', width: '50' });
    expect(c.startsWith('<svg aria-hidden="true" width="50"')).toBe(true);
    expect(c).not.toContain('aria-label');
  });
});
