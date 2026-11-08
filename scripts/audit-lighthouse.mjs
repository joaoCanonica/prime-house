// Lighthouse mobile (padrão do Lighthouse: Moto G Power, 4G lento simulado, CPU 4×) em todas as rotas do dist/.
// Metas (CLAUDE.md §4): Desempenho, Boas práticas e SEO ≥ 95; Acessibilidade = 100.
// Com indexar=false toda página tem noindex: a auditoria "is-crawlable" falha de propósito. O relatório mostra a
// nota de SEO medida e a nota sem esse item (que é a que vale quando a indexação for ligada).
// Cada rota roda 3 vezes (--execucoes=N) e vale a execução mediana de Desempenho (o Lighthouse varia entre rodadas).
// Uso: node scripts/audit-lighthouse.mjs [--rotas=/,/planos/] [--execucoes=3] [--porta=4340] [--saida=docs/qa/lighthouse.json]
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { CHROMIUM, RAIZ, rotasDoDist, subirPreview } from './lib/servidor.mjs';

const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3);
const porta = Number(arg('porta') ?? 4340);
const saida = join(RAIZ, arg('saida') ?? 'docs/qa/lighthouse.json');
const EXECUCOES = Number(arg('execucoes') ?? 3);
const META = { performance: 95, accessibility: 100, 'best-practices': 95, seo: 95 };

/** Nota de SEO recalculada sem a auditoria "is-crawlable" (noindex de propósito enquanto indexar=false). */
function seoSemNoindex(lhr) {
  const cat = lhr.categories.seo;
  let soma = 0;
  let pesos = 0;
  for (const ref of cat.auditRefs) {
    if (ref.id === 'is-crawlable' || !ref.weight) continue;
    const a = lhr.audits[ref.id];
    if (a.score === null) continue;
    soma += a.score * ref.weight;
    pesos += ref.weight;
  }
  return Math.round((soma / pesos) * 100);
}

const { base, parar } = await subirPreview(porta);
const rotas = arg('rotas')?.split(',') ?? (await rotasDoDist());
const chrome = await chromeLauncher.launch({
  chromePath: CHROMIUM,
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
});
const linhas = [];
let falhas = 0;
try {
  for (const rota of rotas) {
    const rodadas = [];
    for (let i = 0; i < EXECUCOES; i++) {
      const r = await lighthouse(base + rota, {
        port: chrome.port,
        output: 'json',
        logLevel: 'error',
        onlyCategories: Object.keys(META),
        locale: 'pt-BR',
      });
      rodadas.push(r.lhr);
    }
    rodadas.sort(
      (a, b) => (a.categories.performance?.score ?? 0) - (b.categories.performance?.score ?? 0),
    );
    const lhr = rodadas[Math.floor(rodadas.length / 2)];
    const notasDesempenho = rodadas.map((x) =>
      Math.round((x.categories.performance?.score ?? 0) * 100),
    );
    if (lhr.runtimeError) {
      falhas++;
      console.error(`✗ ${rota}: ${lhr.runtimeError.code}`);
      continue;
    }
    const nota = (k) => Math.round((lhr.categories[k]?.score ?? 0) * 100);
    const linha = {
      rota,
      execucoes: notasDesempenho,
      desempenho: nota('performance'),
      acessibilidade: nota('accessibility'),
      boasPraticas: nota('best-practices'),
      seo: nota('seo'),
      seoSemNoindex: seoSemNoindex(lhr),
      lcpMs: Math.round(lhr.audits['largest-contentful-paint'].numericValue),
      fcpMs: Math.round(lhr.audits['first-contentful-paint'].numericValue),
      tbtMs: Math.round(lhr.audits['total-blocking-time'].numericValue),
      cls: Number(lhr.audits['cumulative-layout-shift'].numericValue.toFixed(3)),
      siMs: Math.round(lhr.audits['speed-index'].numericValue),
      bytes: lhr.audits['total-byte-weight'].numericValue,
      falhasA11y: Object.values(lhr.audits)
        .filter(
          (a) => a.score === 0 && lhr.categories.accessibility.auditRefs.some((x) => x.id === a.id),
        )
        .map((a) => a.id),
      falhasBP: lhr.categories['best-practices'].auditRefs
        .filter((x) => x.weight && lhr.audits[x.id].score !== null && lhr.audits[x.id].score < 1)
        .map((x) => x.id),
    };
    const ok =
      linha.desempenho >= META.performance &&
      linha.acessibilidade >= META.accessibility &&
      linha.boasPraticas >= META['best-practices'] &&
      linha.seoSemNoindex >= META.seo;
    if (!ok) falhas++;
    linhas.push(linha);
    console.log(
      `${ok ? '✓' : '✗'} ${rota.padEnd(28)} D ${linha.desempenho} [${notasDesempenho.join('/')}] · A ${linha.acessibilidade} · BP ${linha.boasPraticas} · SEO ${linha.seo} (${linha.seoSemNoindex} sem noindex) · LCP ${linha.lcpMs} ms · CLS ${linha.cls} · TBT ${linha.tbtMs} ms${linha.falhasA11y.length ? ` · a11y: ${linha.falhasA11y.join(', ')}` : ''}${linha.falhasBP.length ? ` · BP: ${linha.falhasBP.join(', ')}` : ''}`,
    );
  }
} finally {
  await chrome.kill();
  parar();
}
mkdirSync(dirname(saida), { recursive: true });
writeFileSync(
  saida,
  JSON.stringify(
    {
      data: new Date().toISOString(),
      lighthouse: (await import('lighthouse/package.json', { with: { type: 'json' } })).default
        .version,
      meta: META,
      rotas: linhas,
    },
    null,
    2,
  ),
);
console.log(
  `[audit-lighthouse] ${linhas.length} rota(s) · ${falhas ? `${falhas} abaixo da meta` : 'todas na meta'}`,
);
process.exit(falhas ? 1 : 0);
