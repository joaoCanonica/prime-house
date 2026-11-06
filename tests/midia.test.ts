import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import { describe, expect, it } from 'vitest';

const raiz = fileURLToPath(new URL('../', import.meta.url));
const ler = <T>(c: string): T => JSON.parse(readFileSync(join(raiz, c), 'utf8')) as T;

type Consentimento = 'pendente' | 'autorizado' | 'nao-precisa';
interface Item {
  id: string;
  uso: string[];
  consentimento: Consentimento;
  pessoas: { quem: string; consentimento: Consentimento }[];
  naoUsar: boolean;
  resolucaoMax: { largura: number; altura: number } | null;
  audioLiberado: boolean;
}
interface Original extends Item {
  arquivo: string;
  tipo: string;
  numero?: number;
  duracao?: number;
  resolucaoOriginal: { largura: number; altura: number } | null;
}
interface Trecho extends Item {
  origem: string;
  in: number;
  out: number;
  pedido: { in: number; out: number } | null;
  posterEm: number;
  orcamentoBytes?: number;
}
interface Still extends Item {
  origem: string;
  t: number;
}
interface Recorte extends Item {
  origem: string;
  caixa: { x: number; y: number; largura: number; altura: number };
}
interface Manifesto {
  originais: Original[];
  trechos: Trecho[];
  stills: Still[];
  recortes: Recorte[];
}

const manifesto = ler<Manifesto>('media.manifest.json');
const originais = new Map(manifesto.originais.map((o) => [o.id, o]));
const todos: Item[] = [
  ...manifesto.originais,
  ...manifesto.trechos,
  ...manifesto.stills,
  ...manifesto.recortes,
];

describe('media.manifest.json', () => {
  it('é válido pelo JSON Schema', () => {
    const ajv = new Ajv2020({ allErrors: true, strict: true });
    const validar = ajv.compile(ler<object>('media.manifest.schema.json'));
    const ok = validar(manifesto);
    expect(validar.errors ?? []).toEqual([]);
    expect(ok).toBe(true);
  });

  it('ids únicos e origens existentes', () => {
    const ids = todos.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const d of [...manifesto.trechos, ...manifesto.stills, ...manifesto.recortes]) {
      expect(originais.has(d.origem), d.id).toBe(true);
    }
  });

  it('cada original existe em media-originais/ e todo arquivo está no manifesto', () => {
    const noDisco: string[] = [];
    const andar = (d: string) => {
      for (const n of readdirSync(join(raiz, d))) {
        const c = `${d}/${n}`;
        if (statSync(join(raiz, c)).isDirectory()) andar(c);
        else noDisco.push(c);
      }
    };
    andar('media-originais');
    expect(noDisco.sort()).toEqual(manifesto.originais.map((o) => o.arquivo).sort());
  });

  it('consentimento coerente com as pessoas', () => {
    for (const i of todos) {
      if (i.pessoas.some((p) => p.consentimento === 'pendente'))
        expect(i.consentimento, i.id).toBe('pendente');
    }
  });

  it('trechos dentro da duração e ajuste de até ±0,5 s (exceções documentadas)', () => {
    const excecoes = new Set(['drone-noite']);
    for (const t of manifesto.trechos) {
      const o = originais.get(t.origem)!;
      expect(t.in, t.id).toBeGreaterThanOrEqual(0);
      expect(t.out, t.id).toBeLessThanOrEqual(o.duracao! + 1e-6);
      expect(t.in).toBeLessThan(t.out);
      expect(t.posterEm).toBeGreaterThanOrEqual(t.in);
      expect(t.posterEm).toBeLessThanOrEqual(t.out);
      if (t.pedido && !excecoes.has(t.id)) {
        expect(Math.abs(t.in - t.pedido.in), t.id).toBeLessThanOrEqual(0.5 + 1e-9);
        expect(Math.abs(t.out - t.pedido.out), t.id).toBeLessThanOrEqual(0.5 + 1e-9);
      }
    }
  });

  it('regras da sessão 1', () => {
    const porNumero = (n: number) => manifesto.originais.find((o) => o.numero === n)!;
    expect(manifesto.originais.find((o) => o.arquivo.endsWith('primelogo.png'))!.naoUsar).toBe(
      true,
    );
    expect(porNumero(0).naoUsar).toBe(true);
    for (let n = 1; n <= 13; n++) {
      const c = porNumero(n);
      expect(c.uso).toEqual(expect.arrayContaining(['referencia-3d', 'galeria-pequena']));
      expect(c.resolucaoMax!.largura).toBeLessThanOrEqual(480);
    }
    for (let n = 22; n <= 34; n++) expect(porNumero(n).consentimento).toBe('pendente');
    expect(manifesto.recortes).toHaveLength(8);
    for (const r of manifesto.recortes) {
      const o = originais.get(r.origem)!;
      expect(r.uso).toContain('conforto');
      expect(r.caixa.y + r.caixa.altura).toBeLessThanOrEqual(o.resolucaoOriginal!.altura);
    }
    for (const id of ['equipe', 'acompanhamento']) {
      expect(manifesto.trechos.find((t) => t.id === id)!.consentimento).toBe('pendente');
    }
    expect(todos.every((i) => i.audioLiberado === false)).toBe(true);
    expect(manifesto.trechos.find((t) => t.id === 'interior-noite')!.orcamentoBytes).toBe(
      1_200_000,
    );
  });

  it('stills nunca acima da resolução do vídeo (sem upscale)', () => {
    for (const s of manifesto.stills) {
      const o = originais.get(s.origem)!;
      expect(s.resolucaoMax!.largura).toBeLessThanOrEqual(o.resolucaoOriginal!.largura);
      expect(s.t).toBeLessThanOrEqual(o.duracao!);
    }
  });
});

// Só roda depois de `pnpm media:prepare` (public/media existe).
const indicePublico = join(raiz, 'public/media/indice.json');
describe.skipIf(!existsSync(indicePublico))('derivados em public/media', () => {
  const publicaveis = new Set(
    todos
      .filter(
        (i) =>
          !i.naoUsar &&
          i.consentimento !== 'pendente' &&
          i.pessoas.every((p) => p.consentimento !== 'pendente'),
      )
      .map((i) => i.id),
  );

  it('nada com consentimento pendente ou naoUsar é publicável', () => {
    const pastas = readdirSync(join(raiz, 'public/media')).filter((n) => n !== 'indice.json');
    for (const p of pastas) expect(publicaveis.has(p), p).toBe(true);
    const indice = JSON.parse(readFileSync(indicePublico, 'utf8')) as {
      itens: Record<string, unknown>;
    };
    for (const id of Object.keys(indice.itens)) expect(publicaveis.has(id), id).toBe(true);
  });

  it('loop interior-noite ≤ 1,2 MB em todas as variantes', () => {
    const dir = join(raiz, 'public/media/interior-noite');
    const videos = readdirSync(dir).filter((f) => /\.(mp4|webm)$/.test(f));
    expect(videos.length).toBeGreaterThanOrEqual(4);
    for (const f of videos) expect(statSync(join(dir, f)).size, f).toBeLessThanOrEqual(1_200_000);
  });
});
