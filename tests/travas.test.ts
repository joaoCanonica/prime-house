// Travas simuladas: cada uma tem de derrubar a produção e deixar o preview passar.
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { auditar } from '../scripts/audit-compliance.mjs';
import { entradaAtual } from '../src/config/index.ts';
import { bloqueante, confirmado } from '../src/config/tipos.ts';
import { verificar, type Entrada } from '../src/config/verificacao.ts';

const clonar = (): Entrada => structuredClone(entradaAtual());
const regras = (e: Entrada, modo: 'preview' | 'producao') => {
  const r = verificar(e, modo);
  return { ok: r.ok, travas: r.achados.filter((a) => a.gravidade === 'trava').map((a) => a.regra) };
};
function esperaTrava(e: Entrada, regra: string) {
  const prod = regras(e, 'producao');
  expect(prod.travas).toContain(regra);
  expect(prod.ok).toBe(false);
  expect(regras(e, 'preview').ok).toBe(true);
}

describe('validate-config: travas simuladas', () => {
  it('WhatsApp ausente', () => {
    const e = clonar();
    e.whatsapp = bloqueante<string>('sem número');
    esperaTrava(e, 'whatsapp-ausente');
  });
  it('WhatsApp inválido', () => {
    const e = clonar();
    e.whatsapp = confirmado('49998043861', 'teste');
    esperaTrava(e, 'whatsapp-ausente');
  });
  it('zona do 3D com câmera sem planta/captura', () => {
    const e = clonar();
    (e.colecoes.zonas[1] as { camera: unknown }).camera = { posicao: [0, 2, 5], alvo: [0, 0, 0] };
    esperaTrava(e, 'zona-sem-fonte');
  });
  it('equipamento inventado ou não confirmado na zona', () => {
    const e = clonar();
    (e.colecoes.zonas[1] as { equipamentos: string[] }).equipamentos.push('leg-press-inventado');
    esperaTrava(e, 'equipamento-inventado');
    const e2 = clonar();
    (e2.colecoes.equipamentos[0] as { confirmado: boolean }).confirmado = false;
    esperaTrava(e2, 'equipamento-nao-confirmado');
  });
  it('mídia com consentimento pendente referenciada', () => {
    const e = clonar();
    (e.colecoes.zonas[1] as { midia: string[] }).midia.push('acompanhamento');
    esperaTrava(e, 'midia-consentimento-pendente');
  });
  it('mídia naoUsar referenciada', () => {
    const e = clonar();
    (e.colecoes.diferenciais[0] as { midia: string }).midia = 'plano-prime';
    esperaTrava(e, 'midia-nao-usar');
  });
  it('mídia fora do manifesto é erro em qualquer modo', () => {
    const e = clonar();
    (e.colecoes.diferenciais[0] as { midia: string }).midia = 'nao-existe';
    expect(verificar(e, 'preview').ok).toBe(false);
  });
  it('schema inválido é erro em qualquer modo', () => {
    const e = clonar();
    (e.colecoes.planos[0] as { id: string }).id = 'gold';
    expect(verificar(e, 'preview').ok).toBe(false);
  });
});

// ---- audit-compliance sobre um dist/ de mentira
const BASE = (corpo: string, robots = 'noindex, nofollow') =>
  `<!doctype html><html lang="pt-BR"><head><meta name="robots" content="${robots}"><title>t</title></head><body>${corpo}</body></html>`;

function distCom(arquivos: Record<string, string>, pastasMidia: string[] = []) {
  const dir = mkdtempSync(join(tmpdir(), 'ph-dist-'));
  for (const [nome, conteudo] of Object.entries(arquivos)) {
    mkdirSync(join(dir, nome, '..'), { recursive: true });
    writeFileSync(join(dir, nome), conteudo);
  }
  for (const p of pastasMidia) mkdirSync(join(dir, 'media', p), { recursive: true });
  return dir;
}
const auditarAmbos = (dir: string) => ({
  prod: auditar({ dir, modo: 'producao' }),
  prev: auditar({ dir, modo: 'preview' }),
});
const regrasDe = (r: { achados: { regra: string }[] }) => r.achados.map((a) => a.regra);

describe('audit-compliance: travas simuladas', () => {
  it('dist limpo passa nos dois modos', () => {
    const dir = distCom(
      {
        'index.html': BASE(
          '<h1>Prime House Academia</h1><video src="/media/interior-noite/a.mp4"></video>',
        ),
      },
      ['interior-noite'],
    );
    const { prod, prev } = auditarAmbos(dir);
    expect(prod.achados).toEqual([]);
    expect(prod.ok && prev.ok).toBe(true);
  });
  it('termo vetado no HTML (inclusive em link do WhatsApp codificado)', () => {
    const dir = distCom({
      'index.html': BASE(
        '<a href="https://wa.me/5549998043861?text=Ol%C3%A1!%20Quero%20a%20matr%C3%ADcula%20gr%C3%A1tis">x</a>',
      ),
    });
    const { prod, prev } = auditarAmbos(dir);
    expect(regrasDe(prod)).toContain('termo-vetado');
    expect(prod.ok).toBe(false);
    expect(prev.ok).toBe(true);
  });
  it('avaliação literal é permitida; alterada trava', () => {
    const literal = BASE(
      '<blockquote data-avaliacao-literal="g-004">“Melhor academia de Lages. Os aparelhos são de excelente qualidade e a equipe formidável”</blockquote>',
    );
    expect(auditar({ dir: distCom({ 'index.html': literal }), modo: 'producao' }).ok).toBe(true);
    const alterada = BASE(
      '<blockquote data-avaliacao-literal="g-004">Melhor academia de Lages!!!</blockquote>',
    );
    const r = auditar({ dir: distCom({ 'index.html': alterada }), modo: 'producao' });
    expect(regrasDe(r)).toEqual(expect.arrayContaining(['avaliacao-alterada', 'termo-vetado']));
    expect(r.ok).toBe(false);
  });
  it('mídia com consentimento pendente publicada (pasta e referência)', () => {
    const dir = distCom(
      { 'index.html': BASE('<video src="/media/equipe/equipe-720x1280.mp4"></video>') },
      ['equipe'],
    );
    const { prod, prev } = auditarAmbos(dir);
    expect(regrasDe(prod).filter((r) => r === 'midia-consentimento-pendente')).toHaveLength(2);
    expect(prod.ok).toBe(false);
    expect(prev.ok).toBe(true);
  });
  it('mídia naoUsar referenciada', () => {
    const dir = distCom({
      'index.html': BASE(
        '<img src="/media/still-logo-final/x.avif" alt=""><img src="primelogo.png" alt="">',
      ),
    });
    const r = auditar({ dir, modo: 'producao' });
    expect(regrasDe(r).filter((x) => x === 'midia-nao-usar')).toHaveLength(2);
    expect(r.ok).toBe(false);
  });
  it('benefício fixo publicado sem confirmação', () => {
    const dir = distCom({
      'planos/index.html': BASE('<li>Garantia de 14 dias, com devolução integral.</li>'),
    });
    // benefício ainda pendente (bloqueante): a trava vale para qualquer benefício não confirmado
    const planosDados = [
      {
        id: 'prime' as const,
        ordem: 1,
        nome: 'Plano Prime',
        fonte: 'teste',
        inclui: { id: 'x', texto: 'X.', estado: 'confirmado' as const, fonte: 'f' },
        beneficios: [
          {
            id: 'garantia',
            texto: 'Garantia de 14 dias, com devolução integral.',
            estado: 'bloqueante' as const,
            rotulo: 'r',
          },
        ],
      },
    ];
    const r = auditar({ dir, modo: 'producao', planosDados });
    expect(regrasDe(r)).toContain('beneficio-nao-confirmado');
    expect(r.ok).toBe(false);
    expect(auditar({ dir, modo: 'preview', planosDados }).ok).toBe(true);
  });
  it('selo PROVISÓRIO ou faixa de revisão em produção', () => {
    const dir = distCom({
      'index.html': BASE('<div data-preview-banner></div><span data-provisorio>x</span>'),
    });
    expect(regrasDe(auditar({ dir, modo: 'producao' }))).toEqual(
      expect.arrayContaining(['provisorio-em-producao', 'banner-em-producao']),
    );
  });
  it('preview sem noindex é erro', () => {
    const dir = distCom({ 'index.html': BASE('<h1>x</h1>', 'index, follow') });
    expect(auditar({ dir, modo: 'preview' }).ok).toBe(false);
  });
});
