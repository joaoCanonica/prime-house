// QA da sessão 9 (acessibilidade e navegadores), contra o build em dist/.
// Motor: NAVEGADOR=chromium (padrão) | webkit | firefox. WebKit e Firefox: PLAYWRIGHT_BROWSERS_PATH apontando
// para onde foram instalados (docs/QA.md). O 3D só existe no build de preview (maquete sem aprovação).
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  chromium,
  firefox,
  webkit,
  type Browser,
  type BrowserContextOptions,
  type Page,
} from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const raiz = fileURLToPath(new URL('../../', import.meta.url));
const motor = (process.env['NAVEGADOR'] ?? 'chromium') as 'chromium' | 'webkit' | 'firefox';
const porta = 4350 + ['chromium', 'webkit', 'firefox'].indexOf(motor);
const base = `http://127.0.0.1:${porta}`;
const saida = join(raiz, 'docs', 'qa');
const ROTAS = [
  '/',
  '/a-casa/',
  '/maquinario/',
  '/planos/',
  '/como-funciona/',
  '/equipe/',
  '/horarios-e-como-chegar/',
  '/perguntas-frequentes/',
  '/trabalhe-conosco/',
  '/privacidade/',
];

let preview: ChildProcess;
let nav: Browser;
beforeAll(async () => {
  preview = spawn(
    join(raiz, 'node_modules', '.bin', 'astro'),
    ['preview', '--ignore-lock', '--host', '127.0.0.1', '--port', String(porta)],
    { cwd: raiz, stdio: 'ignore' },
  );
  for (let i = 0; ; i++) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {
      /* subindo */
    }
    if (i > 120) throw new Error('preview não subiu');
    await new Promise((ok) => setTimeout(ok, 250));
  }
  nav = await { chromium, webkit, firefox }[motor].launch(
    motor === 'chromium'
      ? { args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] }
      : {},
  );
  mkdirSync(saida, { recursive: true });
});
afterAll(async () => {
  await nav?.close();
  preview?.kill('SIGTERM');
});

const celular: BrowserContextOptions = {
  viewport: { width: 390, height: 844 },
  ...(motor === 'firefox' ? {} : { isMobile: true, hasTouch: true }),
  deviceScaleFactor: 2,
};
async function abrir(opcoes: BrowserContextOptions = {}, pularAbertura = true) {
  const ctx = await nav.newContext({ locale: 'pt-BR', ...opcoes });
  await ctx.route(
    (u) => !u.href.startsWith(base),
    (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<p>externo</p>' }),
  );
  if (pularAbertura) await ctx.addInitScript(() => sessionStorage.setItem('ph-abertura', '1'));
  const page = await ctx.newPage();
  const erros: string[] = [];
  page.on('pageerror', (e) => erros.push(e.message));
  return { ctx, page, erros };
}
/** O elemento com foco tem indicação visível (outline ou sombra de LED)? */
const focoVisivel = (p: Page) =>
  p.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return { ok: false, el: 'body' };
    const alvo = el.matches('input') ? (el.closest('label') ?? el) : el;
    const s = getComputedStyle(el);
    const sl = getComputedStyle(alvo);
    const ok =
      (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) ||
      s.boxShadow !== 'none' ||
      (sl.outlineStyle !== 'none' && parseFloat(sl.outlineWidth) > 0) ||
      sl.boxShadow !== 'none';
    return { ok, el: `${el.tagName.toLowerCase()} ${(el.textContent ?? '').trim().slice(0, 40)}` };
  });

describe(`navegação básica (${motor})`, () => {
  it('todas as rotas carregam sem erro de JS, em 390 px e sem rolagem horizontal', async () => {
    const { ctx, page, erros } = await abrir(celular);
    const largas: string[] = [];
    for (const r of ROTAS) {
      const resp = await page.goto(base + r, { waitUntil: 'load' });
      expect(resp?.ok(), r).toBe(true);
      const sobra = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (sobra > 1) largas.push(`${r} (+${sobra}px)`);
    }
    if (motor === 'webkit' || motor === 'chromium') {
      await page.goto(base + '/');
      await page.screenshot({ path: join(saida, `home-390-${motor}.png`) });
    }
    expect(largas).toEqual([]);
    expect(erros.join(' | ')).toBe('');
    await ctx.close();
  });
});

describe(`acessibilidade (${motor})`, () => {
  it('teclado do início ao fim: abertura → pular → hero → tour 3D pelas zonas → quiz → WhatsApp', async () => {
    const { ctx, page, erros } = await abrir({ viewport: { width: 1440, height: 900 } }, false);
    const passos: string[] = [];
    await page.goto(base + '/');
    // 1) a abertura roda; o 1º Tab chega a "Pular abertura"
    await page.keyboard.press('Tab');
    let f = await focoVisivel(page);
    passos.push(`Tab → ${f.el}`);
    if (!/pular/i.test(f.el)) {
      await page.keyboard.press('Tab');
      f = await focoVisivel(page);
      passos.push(`Tab → ${f.el}`);
    }
    expect(f.el).toMatch(/pular/i);
    expect(f.ok, 'foco visível em "Pular abertura"').toBe(true);
    await page.keyboard.press('Enter');
    // 2) depois de pular, o foco vai para o H1 do hero
    await page.waitForFunction(() => document.activeElement?.id === 'hero-titulo');
    passos.push('Enter → foco no H1 do hero');
    // 3) Tab até o WhatsApp do hero
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      f = await focoVisivel(page);
      passos.push(`Tab → ${f.el}`);
      expect(f.ok, `foco visível: ${f.el}`).toBe(true);
      if (/falar com a equipe/i.test(f.el)) break;
    }
    expect(f.el).toMatch(/falar com a equipe/i);
    // 4) tour 3D na /a-casa: abas com setas
    await page.goto(base + '/a-casa/');
    const primeira = page.locator('[role="tab"][aria-selected="true"]');
    await primeira.focus();
    const zonas: string[] = [];
    for (let i = 0; i < 7; i++) {
      zonas.push((await page.evaluate(() => document.activeElement?.textContent?.trim())) ?? '');
      await page.keyboard.press('ArrowRight');
    }
    passos.push(`setas nas abas: ${zonas.join(' → ')}`);
    expect(new Set(zonas).size).toBeGreaterThanOrEqual(6);
    const sel = await page
      .locator('[role="tab"][aria-selected="true"]')
      .getAttribute('aria-controls');
    expect(await page.locator(`#${sel}`).isVisible()).toBe(true);
    // 5) quiz na home: espaço marca o checkbox, Tab até o botão, Enter abre o WhatsApp
    await page.goto(base + '/');
    await page.getByRole('button', { name: /recusar/i }).click();
    const caixa = page.locator('[data-quiz-sinal]').first();
    await caixa.focus();
    // chega pelo teclado (o foco por script não liga o :focus-visible)
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    expect((await focoVisivel(page)).ok, 'foco visível no item do quiz').toBe(true);
    await page.keyboard.press('Space');
    expect(await caixa.isChecked()).toBe(true);
    await page.locator('[data-quiz-link]').focus();
    const [aba] = await Promise.all([ctx.waitForEvent('page'), page.keyboard.press('Enter')]);
    passos.push(`quiz → Enter abre ${aba.url().slice(0, 60)}…`);
    expect(aba.url()).toMatch(/^https:\/\/wa\.me\/5549998043861\?text=.*Me%20identifiquei%20com/);
    writeFileSync(join(saida, `teclado-${motor}.txt`), passos.join('\n') + '\n');
    expect(erros.join(' | ')).toBe('');
    await ctx.close();
  });

  it('leitor de tela: o tour é uma lista de zonas (abas + painéis) com nomes e conteúdo', async () => {
    const { ctx, page } = await abrir({ viewport: { width: 1440, height: 900 } });
    await page.goto(base + '/a-casa/?zona=cardio');
    const arvore = await page.locator('[data-casa3d]').ariaSnapshot();
    writeFileSync(join(saida, `leitor-tour-${motor}.yml`), arvore);
    expect(arvore).toMatch(/tablist "Zonas da academia"/);
    expect((arvore.match(/- tab "/g) ?? []).length).toBe(7);
    expect(arvore).toMatch(/tab "[^"]*[Cc]ardio[^"]*" \[selected\]/);
    expect(arvore).toMatch(/tabpanel/);
    await ctx.close();
  });

  it('movimento reduzido: sem abertura, sem vídeo tocando sozinho e 3D só no clique', async () => {
    const { ctx, page } = await abrir(
      { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' },
      false,
    );
    await page.goto(base + '/', { waitUntil: 'load' });
    expect(await page.evaluate(() => document.documentElement.dataset['abertura'] ?? '')).not.toBe(
      'on',
    );
    await page.waitForTimeout(1500);
    const tocando = await page.evaluate(
      () => [...document.querySelectorAll('video')].filter((v) => !v.paused).length,
    );
    expect(tocando).toBe(0);
    await page.goto(base + '/a-casa/');
    await page.locator('[data-casa3d-alvo]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    expect(await page.locator('[data-casa3d]').getAttribute('data-modo')).not.toBe('3d');
    await ctx.close();
  });

  it('zoom 200% (720 px) e reflow a 320 px: nada corta nem rola na horizontal', async () => {
    const problemas: string[] = [];
    for (const largura of [720, 320]) {
      const { ctx, page } = await abrir({ viewport: { width: largura, height: 800 } });
      for (const r of ROTAS) {
        await page.goto(base + r, { waitUntil: 'load' });
        const sobra = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        if (sobra > 1) problemas.push(`${largura}px ${r}: +${sobra}px`);
      }
      await ctx.close();
    }
    expect(problemas).toEqual([]);
  });

  it('pausar vídeo: o botão do hero pausa e retoma, com rótulo que muda', async () => {
    if (motor === 'firefox') return; // H.264/WebM: o Firefox do Playwright não toca o MP4 de teste em headless
    const { ctx, page } = await abrir({ viewport: { width: 1440, height: 900 } });
    await page.goto(base + '/');
    const botao = page.locator('[data-hero-pausa]');
    await botao.waitFor({ state: 'visible', timeout: 15_000 });
    const video = page.locator('[data-hero-midia] video');
    await page.waitForFunction(() => {
      const v = document.querySelector<HTMLVideoElement>('[data-hero-midia] video');
      return v && !v.paused;
    });
    await botao.click();
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    expect(await botao.textContent()).toMatch(/tocar/i);
    await botao.click();
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);
    await ctx.close();
  });
});

describe(`sem WebGL (${motor})`, () => {
  it('a /a-casa cai no fallback: lista de zonas, foto/vídeo e WhatsApp por zona', async () => {
    if (motor !== 'chromium') return;
    const ctx = await (
      await chromium.launch({ args: ['--disable-webgl', '--disable-webgl2'] })
    ).newContext({
      ...celular,
      locale: 'pt-BR',
    });
    await ctx.addInitScript(() => sessionStorage.setItem('ph-abertura', '1'));
    const page = await ctx.newPage();
    const erros: string[] = [];
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(base + '/a-casa/', { waitUntil: 'networkidle' });
    await page.locator('[data-casa3d-alvo]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    expect(await page.locator('[data-casa3d]').getAttribute('data-modo')).toBe('fallback');
    expect(await page.locator('[role="tab"]').count()).toBe(7);
    expect(await page.locator('a[data-cta-zona]').count()).toBe(7);
    await page.screenshot({ path: join(saida, 'a-casa-sem-webgl-390.png') });
    expect(erros.join(' | ')).toBe('');
    await ctx.browser()?.close();
  });
});
