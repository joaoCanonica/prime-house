// Medições de desempenho que o Lighthouse não cobre, no dist/ atual (Chromium do Playwright):
//  --parte=lcp     LCP da home em perfil de celular (412×823, DPR 1,75, CPU 4×, 4G lento: 150 ms, 1,6 Mbps),
//                  com a abertura (1ª visita) e sem ela (sessionStorage), mediana de 5;
//  --parte=fps     fps do tour 3D (/a-casa/?fps) em desktop 1440 e "Android intermediário" emulado
//                  (412×915, DPR 2,625, CPU 4×), mediana de 8 amostras de 1 s;
//  --parte=memoria abre e fecha a ilha 3D 3 vezes (--ciclos=N) na mesma página e mede heap JS, nós do DOM, ouvintes e
//                  contextos WebGL depois de forçar a coleta de lixo.
// O 3D só existe no build de preview enquanto a maquete esquemática não for aprovada (fps e memória: pnpm build).
// Uso: node scripts/qa-desempenho.mjs --parte=lcp|fps|memoria [--saida=docs/qa/desempenho-<parte>.json]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
import { RAIZ, subirPreview } from './lib/servidor.mjs';

const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3);
const parte = arg('parte') ?? 'lcp';
const saida = join(RAIZ, arg('saida') ?? `docs/qa/desempenho-${parte}.json`);
const mediana = (l) => [...l].sort((a, b) => a - b)[Math.floor(l.length / 2)];

const { base, parar } = await subirPreview(4343);
const nav = await chromium.launch({
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
const out = { data: new Date().toISOString(), parte };

async function contexto(opcoes, { cpu = 1, rede = false, pularAbertura = false } = {}) {
  const ctx = await nav.newContext({ locale: 'pt-BR', ...opcoes });
  if (pularAbertura) await ctx.addInitScript(() => sessionStorage.setItem('ph-abertura', '1'));
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  if (cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
  if (rede)
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
  return { ctx, p, cdp };
}

try {
  if (parte === 'lcp') {
    const celular = {
      viewport: { width: 412, height: 823 },
      deviceScaleFactor: 1.75,
      isMobile: true,
      hasTouch: true,
    };
    for (const [nome, pular] of [
      ['comAbertura', false],
      ['semAbertura', true],
    ]) {
      const lcps = [];
      let elemento = '';
      for (let i = 0; i < 5; i++) {
        const { ctx, p } = await contexto(celular, { cpu: 4, rede: true, pularAbertura: pular });
        await p.addInitScript(() => {
          const w = window;
          w.__lcp = { t: 0, el: '' };
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) {
              w.__lcp.t = e.startTime;
              const el = e.element;
              w.__lcp.el = el
                ? `${el.tagName.toLowerCase()}${el.className ? `.${String(el.className).split(' ')[0]}` : ''}`
                : e.url;
            }
          }).observe({ type: 'largest-contentful-paint', buffered: true });
        });
        await p.goto(base + '/', { waitUntil: 'load' });
        await p.waitForTimeout(4500);
        const r = await p.evaluate(() => window.__lcp);
        lcps.push(Math.round(r.t));
        elemento = r.el;
        await ctx.close();
      }
      out[nome] = { medianaMs: mediana(lcps), execucoes: lcps, elemento };
      console.log(
        `LCP home ${nome}: mediana ${mediana(lcps)} ms [${lcps.join(', ')}] · elemento ${elemento}`,
      );
    }
  }

  if (parte === 'fps') {
    const perfis = {
      desktop1440: [{ viewport: { width: 1440, height: 900 } }, 1],
      androidIntermediario: [
        {
          viewport: { width: 412, height: 915 },
          deviceScaleFactor: 2.625,
          isMobile: true,
          hasTouch: true,
        },
        4,
      ],
    };
    for (const [nome, [opcoes, cpu]] of Object.entries(perfis)) {
      const { ctx, p } = await contexto(opcoes, { cpu, pularAbertura: true });
      await p.goto(base + '/a-casa/?fps', { waitUntil: 'networkidle' });
      await p.locator('[data-casa3d-alvo]').scrollIntoViewIfNeeded();
      const botao = p.locator('[data-casa3d-carregar]');
      if (await botao.isVisible().catch(() => false)) await botao.click();
      await p.waitForSelector('.tour3d__fps[data-fps]', { timeout: 30_000 });
      const amostras = [];
      for (let i = 0; i < 8; i++) {
        await p.waitForTimeout(1050);
        amostras.push(Number(await p.locator('.tour3d__fps').getAttribute('data-fps')));
      }
      const info = await p.locator('.tour3d__fps').textContent();
      const gl = await p.evaluate(() => {
        const c = document.createElement('canvas').getContext('webgl2');
        const ext = c?.getExtension('WEBGL_debug_renderer_info');
        return ext ? c.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'desconhecido';
      });
      out[nome] = { medianaFps: mediana(amostras), amostras, info, renderizador: gl };
      console.log(
        `fps ${nome}: mediana ${mediana(amostras)} [${amostras.join(', ')}] · ${info} · ${gl}`,
      );
      await ctx.close();
    }
  }

  if (parte === 'memoria') {
    const html = readFileSync(join(RAIZ, 'dist', 'index.html'), 'utf8');
    const modulo = /data-modulo="([^"]+)"/.exec(html)?.[1];
    if (!modulo) throw new Error('home sem data-modulo (rode o build de preview com a maquete)');
    const { ctx, p, cdp } = await contexto(
      { viewport: { width: 1440, height: 900 } },
      { pularAbertura: true },
    );
    await p.goto(base + '/a-casa/', { waitUntil: 'networkidle' });
    await cdp.send('Performance.enable');
    const medir = async () => {
      await cdp.send('HeapProfiler.collectGarbage');
      await p.waitForTimeout(300);
      await cdp.send('HeapProfiler.collectGarbage');
      const { metrics } = await cdp.send('Performance.getMetrics');
      const m = Object.fromEntries(metrics.map((x) => [x.name, x.value]));
      const canvas = await p.evaluate(() => document.querySelectorAll('canvas').length);
      return {
        heapMB: Number((m.JSHeapUsedSize / 1024 / 1024).toFixed(2)),
        nos: m.Nodes,
        ouvintes: m.JSEventListeners,
        canvas,
      };
    };
    // a página já monta o tour sozinha; começa a medir com ela estável e o tour dela desmontado
    await p.evaluate(async () => {
      document.querySelector('[data-casa3d]')?.remove();
    });
    const ciclos = [{ momento: 'antes', ...(await medir()) }];
    const CICLOS = Number(arg('ciclos') ?? 3);
    for (let i = 1; i <= CICLOS; i++) {
      await p.evaluate(async (url) => {
        const { montarTour } = await import(url);
        const indice = await (await fetch('/modelos/indice.json')).json();
        const alvo = Object.assign(document.createElement('div'), {
          style: 'width:800px;height:500px;position:relative',
        });
        document.body.append(alvo);
        const tour = await montarTour({
          alvo,
          indice,
          zonas: ['recepcao', 'musculacao', 'cardio'].map((id) => ({ id, nome: id, camera: null })),
          zonaInicial: 'musculacao',
          reduzido: false,
        });
        for (const z of ['cardio', 'recepcao', 'musculacao']) {
          tour.selecionar?.(z);
          await new Promise((ok) => setTimeout(ok, 400));
        }
        tour.destruir();
        alvo.remove();
      }, modulo);
      ciclos.push({ momento: `depois do ${i}º abrir/fechar`, ...(await medir()) });
    }
    out.ciclos = ciclos;
    const d = ciclos.at(-1).heapMB - ciclos[1].heapMB;
    out.crescimentoHeapEntre1e3MB = Number(d.toFixed(2));
    for (const c of ciclos)
      console.log(
        `${c.momento.padEnd(24)} heap ${c.heapMB} MB · nós ${c.nos} · ouvintes ${c.ouvintes} · canvas ${c.canvas}`,
      );
    console.log(`crescimento do heap entre o 1º e o 3º ciclo: ${out.crescimentoHeapEntre1e3MB} MB`);
    await ctx.close();
  }
} finally {
  await nav.close();
  parar();
}
mkdirSync(dirname(saida), { recursive: true });
writeFileSync(saida, JSON.stringify(out, null, 2));
