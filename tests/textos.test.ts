import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { encontrarTermos } from '../src/config/termos.ts';
import { equipamentos } from '../src/content/dados/equipamentos.ts';
import { zonas } from '../src/content/dados/zonas.ts';
import * as T from '../src/content/textos/index.ts';

interface ItemMidia {
  id: string;
  uso?: string[];
  consentimento: string;
  pessoas: { consentimento: string }[];
  naoUsar: boolean;
}
const manifesto = JSON.parse(readFileSync('media.manifest.json', 'utf8')) as Record<
  'originais' | 'trechos' | 'stills' | 'recortes',
  ItemMidia[]
>;
const publicavel = (m: ItemMidia) =>
  !m.naoUsar &&
  m.consentimento !== 'pendente' &&
  m.pessoas.every((p) => p.consentimento !== 'pendente');

/** Todas as strings dos textos (funções de mensagem chamadas com exemplos). */
function strings(x: unknown, caminho = '', out: [string, string][] = []): [string, string][] {
  if (typeof x === 'string') out.push([caminho, x]);
  else if (typeof x === 'function')
    out.push([caminho, String((x as (a: unknown) => unknown)(['exemplo']))]);
  else if (Array.isArray(x)) x.forEach((v, i) => strings(v, `${caminho}[${i}]`, out));
  else if (x && typeof x === 'object')
    for (const [k, v] of Object.entries(x)) strings(v, caminho ? `${caminho}.${k}` : k, out);
  return out;
}
const todos = strings(T);
/** campos de fonte/motivo/original citam o material de origem e podem conter o termo cortado */
const ehCitacao = (c: string) =>
  /\.(fonte|motivo|original|tituloFonte\.original)$|pendenciasTexto/.test(c);

function objetos(x: unknown, out: Record<string, unknown>[] = []): Record<string, unknown>[] {
  if (Array.isArray(x)) x.forEach((v) => objetos(v, out));
  else if (x && typeof x === 'object') {
    out.push(x as Record<string, unknown>);
    Object.values(x).forEach((v) => objetos(v, out));
  }
  return out;
}

describe('textos: seção 8', () => {
  it('nenhum termo vetado em texto publicável', () => {
    const achados = todos
      .filter(([c]) => !ehCitacao(c))
      .flatMap(([c, s]) => encontrarTermos(s).map((o) => `${c}: ${o.termo}`));
    expect(achados).toEqual([]);
  });
  it('nem nas citações de fonte (o termo cortado é descrito, não reproduzido)', () => {
    const achados = todos
      .filter(([c]) => ehCitacao(c) || c.startsWith('pendenciasTexto'))
      .flatMap(([c, s]) => encontrarTermos(s).map((o) => `${c}: ${o.termo}`));
    expect(achados).toEqual([]);
  });
  it('sem emoji e sem a voz proibida', () => {
    for (const [c, s] of todos) {
      expect(s.replace(/[©®™]/g, ''), c).not.toMatch(/\p{Extended_Pictographic}/u);
      expect(s.toLowerCase(), c).not.toMatch(/monstro|sangue no olho|transforme seu corpo|sem dor/);
    }
  });
  it('sem preço', () => {
    for (const [c, s] of todos.filter(([c]) => !ehCitacao(c)))
      expect(s, c).not.toMatch(/R\$|\b\d+\s?%\s*(off|de desconto)|50%/i);
  });
});

describe('textos: fontes', () => {
  it('toda frase real tem fonte', () => {
    const reais = objetos(T).filter((o) => o['real'] === true);
    expect(reais.length).toBeGreaterThan(30);
    for (const r of reais)
      expect(String(r['fonte'] ?? '').length, String(r['texto'])).toBeGreaterThan(5);
  });
  it('todo texto provisório tem motivo', () => {
    for (const p of objetos(T).filter((o) => o['provisorio'] === true))
      expect(String(p['motivo'] ?? '').length).toBeGreaterThan(5);
  });
  it('as frases-espinha do CLAUDE.md estão no site', () => {
    const corpo = todos.map(([, s]) => s.replace(/\*/g, '')).join('\n');
    for (const f of [
      'Cada detalhe foi pensado para você querer voltar amanhã.',
      'O ambiente não deve ser.',
      'Aqui, você não precisa chegar pronto. Só precisa chegar.',
      'Aqui, a gente não cuida só de corpos. A gente cuida de pessoas.',
      'Sua rotina não precisa se adaptar à academia. A academia precisa se adaptar à sua rotina.',
      'O cuidado com você não tem idade.',
    ])
      expect(corpo, f).toContain(f);
  });
});

describe('textos: metas e parágrafo-resposta', () => {
  for (const p of T.paginas) {
    it(`${p.rota}`, () => {
      expect(p.meta.title.length, p.meta.title).toBeLessThanOrEqual(60);
      expect(p.meta.title).toContain('academia em Lages');
      expect(p.meta.description.length, p.meta.description).toBeLessThanOrEqual(155);
      expect(p.meta.description).toMatch(/academia em Lages/i);
      expect(p.meta.description).toContain('Frei Rogério');
      const frases = p.resposta.split(/(?<=[.!?])\s+/).filter(Boolean);
      expect(frases.length).toBeGreaterThanOrEqual(2);
      expect(frases.length).toBeLessThanOrEqual(3);
      expect(p.resposta).toMatch(/Lages/);
    });
  }
  it('titles únicos', () => {
    const t = T.paginas.map((p) => p.meta.title);
    expect(new Set(t).size).toBe(t.length);
  });
});

describe('textos: cobertura', () => {
  it('alt para toda imagem publicável e só para elas', () => {
    const imagens = [
      ...manifesto.originais.filter((o) => o.uso?.includes('galeria-pequena') && publicavel(o)),
      ...manifesto.recortes.filter(publicavel),
      ...manifesto.stills.filter(publicavel),
    ].map((m) => m.id);
    expect(Object.keys(T.alt).sort()).toEqual(imagens.sort());
  });
  it('descrição só de vídeo publicável, e de todos os trechos publicáveis', () => {
    const pub = manifesto.trechos.filter(publicavel).map((t) => t.id);
    expect(Object.keys(T.videos).sort()).toEqual(pub.sort());
  });
  it('um texto por equipamento confirmado e por zona/subzona', () => {
    expect(Object.keys(T.maquinario.equipamentos).sort()).toEqual(
      equipamentos
        .filter((e) => e.confirmado)
        .map((e) => e.id)
        .sort(),
    );
    const ids = zonas.flatMap((z) => [z.id, ...(z.subzonas ?? []).map((s) => s.id)]);
    expect(Object.keys(T.aCasa.zonas).sort()).toEqual(ids.sort());
  });
  it('quiz: os sinais são literais do carrossel', () => {
    expect(T.home.acompanhamento.quiz.sinais).toHaveLength(4);
  });
  it('mensagem do quiz lista os sinais marcados', () => {
    expect(T.whatsapp.avaliacaoComSinais(['a', 'b'])).toBe(
      'Olá! Vim pelo site e quero agendar minha avaliação funcional. Me identifiquei com: a; b',
    );
  });
});
