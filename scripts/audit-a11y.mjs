// axe-core (WCAG 2.0/2.1/2.2 A e AA + boas práticas) em todas as rotas do dist/, em 390 e 1440 px,
// depois de rolar a página (ilha 3D carregada quando houver) e com o banner de consentimento aberto.
// Uso: node scripts/audit-a11y.mjs [--rotas=/,/planos/] [--porta=4342] [--saida=docs/qa/a11y.json]
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
import { RAIZ, rotasDoDist, subirPreview } from './lib/servidor.mjs';

const require = createRequire(import.meta.url);
const AXE = require.resolve('axe-core/axe.min.js');
const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3);
const saida = join(RAIZ, arg('saida') ?? 'docs/qa/a11y.json');
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const { base, parar } = await subirPreview(Number(arg('porta') ?? 4342));
const rotas = arg('rotas')?.split(',') ?? (await rotasDoDist());
const navegador = await chromium.launch();
const resultado = [];
let violacoes = 0;
try {
  for (const rota of rotas)
    for (const largura of [390, 1440]) {
      const ctx = await navegador.newContext({
        viewport: { width: largura, height: largura < 800 ? 844 : 900 },
        locale: 'pt-BR',
        // a CSP do site (correta) bloquearia a injeção do axe; só a auditoria a ignora
        bypassCSP: true,
      });
      await ctx.addInitScript(() => sessionStorage.setItem('ph-abertura', '1'));
      const p = await ctx.newPage();
      await p.goto(base + rota, { waitUntil: 'networkidle' });
      await p.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
          scrollTo(0, y);
          await new Promise((ok) => setTimeout(ok, 60));
        }
        scrollTo(0, 0);
      });
      await p
        .waitForFunction(
          () => {
            const e = document.querySelector('[data-casa3d], [data-tour3d]');
            const m = e?.getAttribute('data-modo');
            return !e || m === '3d' || m === 'fallback';
          },
          undefined,
          { timeout: 20_000 },
        )
        .catch(() => undefined);
      await p.addScriptTag({ path: AXE });
      const r = await p.evaluate(
        (tags) => window.axe.run(document, { runOnly: { type: 'tag', values: tags } }),
        TAGS,
      );
      const v = r.violations.map((x) => ({
        id: x.id,
        impacto: x.impact,
        nos: x.nodes.length,
        alvo: x.nodes.slice(0, 3).map((n) => n.target.join(' ')),
      }));
      violacoes += v.length;
      resultado.push({
        rota,
        largura,
        violacoes: v,
        aprovadas: r.passes.length,
        incompletas: r.incomplete.length,
      });
      console.log(
        `${v.length ? '✗' : '✓'} ${rota.padEnd(28)} ${largura}px · ${r.passes.length} regras ok · ${v.length} violação(ões)${v.map((x) => `\n    ${x.impacto} ${x.id} (${x.nos}) ${x.alvo.join(' | ')}`).join('')}`,
      );
      await ctx.close();
    }
} finally {
  await navegador.close();
  parar();
}
mkdirSync(dirname(saida), { recursive: true });
writeFileSync(
  saida,
  JSON.stringify({ data: new Date().toISOString(), tags: TAGS, resultado }, null, 2),
);
console.log(`[audit-a11y] ${resultado.length} verificação(ões) · ${violacoes} violação(ões)`);
process.exit(violacoes ? 1 : 0);
