import { describe, expect, it } from 'vitest';
import { avaliacoes } from '../src/config/avaliacoes.ts';
import { contato } from '../src/config/contato.ts';
import { verificarAtual } from '../src/config/index.ts';
import { marca } from '../src/config/marca.ts';
import { lerModo } from '../src/config/modo.ts';
import { robots } from '../src/config/seo.ts';
import { encontrarTermos, TERMOS_VETADOS } from '../src/config/termos.ts';
import { bloqueante, exibir } from '../src/config/tipos.ts';
import { equipamentos } from '../src/content/dados/equipamentos.ts';
import { planos } from '../src/content/dados/planos.ts';
import { zonas } from '../src/content/dados/zonas.ts';

describe('config', () => {
  it('marca e contato', () => {
    expect(marca.nome.valor).toBe('Prime House Academia');
    expect(marca.laranja).toMatchObject({ estado: 'aviso', valor: '#EC8A2A' });
    expect(marca.fundador.valor).toBe('Lucas Moro');
    expect(marca.inauguracao.valor).toBe('2026-04-30');
    expect(contato.whatsapp.valor).toBe('5549998043861');
    expect(contato.mapas.valor.google).toContain('cid=9561389130144054445');
    expect(contato.estacionamento.estado).toBe('opcional');
  });
  it('modo e robots', () => {
    expect(lerModo('producao')).toBe('producao');
    expect(lerModo(undefined)).toBe('preview');
    expect(robots('preview')).toBe('noindex, nofollow');
    expect(robots('producao')).toBe('noindex, nofollow'); // indexar=false até a sessão 9
  });
  it('bloqueante só aparece no preview', () => {
    const b = bloqueante('confirmar por escrito', 'Garantia de 14 dias');
    expect(exibir(b, 'preview')).toBe('Garantia de 14 dias');
    expect(exibir(b, 'producao')).toBeNull();
  });
});

describe('avaliações', () => {
  it('só Juliano M., Alfredo K. e Ronielle S.; sem nota', () => {
    expect(avaliacoes.exibirNota).toBe(false);
    expect(avaliacoes.selecionadas.map((a) => a.autor)).toEqual([
      'Juliano M.',
      'Alfredo K.',
      'Ronielle S.',
    ]);
  });
});

describe('termos vetados', () => {
  it('lista exata do CLAUDE.md (20 termos)', () => {
    expect(TERMOS_VETADOS).toHaveLength(20);
  });
  it('acha sem diferenciar caixa e acento; respeita limite de palavra', () => {
    expect(encontrarTermos('Matrícula GRATIS hoje').map((o) => o.termo)).toContain('grátis');
    expect(encontrarTermos('a Melhor Academia').map((o) => o.termo)).toEqual(
      expect.arrayContaining(['melhor academia', 'a melhor']),
    );
    expect(encontrarTermos('1º mês grátis').map((o) => o.termo)).toContain('1º mês grátis');
    expect(encontrarTermos('curadoria, a maioria, percalço, procura')).toEqual([]);
    expect(encontrarTermos('LM Prime House')).toHaveLength(1);
  });
});

describe('coleções', () => {
  it('7 zonas, todas com layout pendente e sem câmera', () => {
    expect(zonas.map((z) => z.id)).toEqual([
      'recepcao',
      'musculacao',
      'cardio',
      'vestiarios',
      'avaliacao-fisio',
      'conveniencia',
      'espaco-kids',
    ]);
    for (const z of zonas) {
      expect(z.fonteLayout).toBe('pendente');
      expect(z.camera).toBeNull();
    }
    expect(zonas.find((z) => z.id === 'musculacao')?.subzonas?.map((s) => s.id)).toEqual([
      'costas-puxadas',
      'pernas',
      'peito-ombro',
      'peso-livre',
    ]);
  });
  it('equipamentos iniciais confirmados; puxada alta com 5 unidades', () => {
    expect(equipamentos.every((e) => e.confirmado)).toBe(true);
    expect(equipamentos.find((e) => e.id === 'puxada-alta')?.quantidade).toBe(5);
  });
  it('planos sem preço; benefícios fixos confirmados pelo João (08/11/2026), com fonte', () => {
    expect(planos.map((p) => p.id)).toEqual(['prime', 'select', 'duo']);
    expect(JSON.stringify(planos)).not.toMatch(/R\$|\d+\s?%/);
    const prime = planos.find((p) => p.id === 'prime');
    expect(prime?.beneficios.map((b) => [b.id, b.estado])).toEqual([
      ['garantia-14-dias', 'confirmado'],
      ['trancamento-30-dias', 'confirmado'],
      ['sexta-prime', 'confirmado'],
    ]);
    for (const b of prime?.beneficios ?? [])
      expect(b.estado === 'confirmado' && b.fonte).toMatch(/Lucas.*João/);
    // o que o Plano Prime inclui segue sem fonte: bloqueante
    expect(prime?.inclui.estado).toBe('bloqueante');
  });
  it('config atual: sem erro nem trava; preview e produção publicáveis', () => {
    for (const modo of ['preview', 'producao'] as const) {
      const r = verificarAtual(modo);
      expect(r.achados.filter((a) => a.gravidade !== 'aviso')).toEqual([]);
      expect(r.ok).toBe(true);
    }
  });
});
