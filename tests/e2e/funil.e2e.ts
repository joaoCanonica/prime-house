// Funil e LGPD em 390 px: o link exato do WhatsApp em cada contexto, a medição dos cliques e
// nenhum request de terceiro antes do consentimento. Usa o build em dist/ (pnpm build antes).
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const raiz = fileURLToPath(new URL('../../', import.meta.url));
const dist = join(raiz, 'dist');
const porta = 4331;
const base = `http://127.0.0.1:${porta}`;
const WA = 'https://wa.me/5549998043861?text=';
const link = (texto: string) => WA + encodeURIComponent(texto);

let preview: ChildProcess;
let navegador: Browser;

beforeAll(async () => {
  if (!existsSync(join(dist, 'index.html'))) throw new Error('sem dist/: rode pnpm build antes');
  preview = spawn(
    join(raiz, 'node_modules', '.bin', 'astro'),
    ['preview', '--ignore-lock', '--host', '127.0.0.1', '--port', String(porta)],
    { cwd: raiz, stdio: 'ignore' },
  );
  const inicio = Date.now();
  for (;;) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {
      /* subindo */
    }
    if (Date.now() - inicio > 30_000) throw new Error('preview não subiu');
    await new Promise((ok) => setTimeout(ok, 250));
  }
  navegador = await chromium.launch(
    process.env['PW_CHROMIUM_PATH'] ? { executablePath: process.env['PW_CHROMIUM_PATH'] } : {},
  );
});

afterAll(async () => {
  await navegador?.close();
  preview?.kill('SIGTERM');
});

interface Contexto {
  ctx: BrowserContext;
  page: Page;
  terceiros: string[];
  eventos: () => Promise<{ evento: Record<string, string>; enviado: boolean }[]>;
}

/** Celular 390 px; WhatsApp, Google e afins respondem localmente (nada sai do contêiner). */
async function abrir(opcoes: { js?: boolean; abertura?: boolean } = {}): Promise<Contexto> {
  const ctx = await navegador.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    locale: 'pt-BR',
    javaScriptEnabled: opcoes.js ?? true,
  });
  const terceiros: string[] = [];
  ctx.on('request', (r) => {
    const u = r.url();
    if (!u.startsWith(base) && !u.startsWith('data:') && !u.startsWith('blob:')) terceiros.push(u);
  });
  await ctx.route(
    (u) => !u.href.startsWith(base),
    (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<p>externo</p>' }),
  );
  await ctx.addInitScript(
    (pularAbertura: boolean) => {
      if (pularAbertura) sessionStorage.setItem('ph-abertura', '1');
      const w = window as unknown as { __eventos: unknown[] };
      w.__eventos = [];
      addEventListener('prime:evento', (e) => w.__eventos.push((e as CustomEvent).detail));
    },
    !(opcoes.abertura ?? false),
  );
  const page = await ctx.newPage();
  return {
    ctx,
    page,
    terceiros,
    eventos: () =>
      page.evaluate(() => (window as unknown as { __eventos: never[] }).__eventos) as ReturnType<
        Contexto['eventos']
      >,
  };
}

/** Clica num CTA do WhatsApp e devolve a URL que abriu (aba nova). */
async function clicarEAbrir(c: Contexto, seletor: string): Promise<string> {
  const alvo = c.page.locator(seletor).first();
  await alvo.scrollIntoViewIfNeeded();
  const [aba] = await Promise.all([c.ctx.waitForEvent('page'), alvo.click()]);
  await aba.waitForLoadState('domcontentloaded').catch(() => undefined);
  const url = aba.url();
  await aba.close();
  return url;
}

async function recusar(page: Page) {
  await page.getByRole('button', { name: 'Recusar', exact: true }).click();
}

describe('link exato do WhatsApp em 6 contextos (390 px)', () => {
  it('1 · home, hero: mensagem geral', async () => {
    const c = await abrir();
    await c.page.goto(base + '/');
    await recusar(c.page);
    const url = await clicarEAbrir(c, '.hero a[href^="https://wa.me/"]');
    expect(url).toBe(
      'https://wa.me/5549998043861?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Prime%20House%20e%20quero%20conhecer%20a%20academia.',
    );
    const [e] = await c.eventos();
    expect(e?.evento).toEqual({ nome: 'clique_whatsapp', origem: 'hero' });
    expect(e?.enviado).toBe(false); // sem domínio de medição configurado, nada sai
    await c.ctx.close();
  });

  it('2 · /planos, coluna do Select: mensagem do plano', async () => {
    const c = await abrir();
    await c.page.goto(base + '/planos/');
    await recusar(c.page);
    const url = await clicarEAbrir(c, 'a[data-cta-plano="select"]');
    expect(url).toBe(link('Olá! Vim pelo site e quero saber sobre o Plano Select.'));
    expect((await c.eventos()).map((e) => e.evento)).toContainEqual({
      nome: 'clique_whatsapp',
      origem: 'pagina-planos',
      plano: 'select',
    });
    await c.ctx.close();
  });

  it('3 · /planos, escolha de plano (rádios): Duo à noite', async () => {
    const c = await abrir();
    await c.page.goto(base + '/planos/');
    await recusar(c.page);
    await c.page.getByRole('radio', { name: 'Plano Duo' }).check();
    await c.page.getByRole('radio', { name: 'À noite' }).check();
    const esperado = 'Olá! Vim pelo site e quero saber sobre o Plano Duo. Prefiro treinar à noite.';
    await expect(c.page.locator('[data-escolha-texto]').textContent()).resolves.toBe(esperado);
    const url = await clicarEAbrir(c, '[data-escolha-link]');
    expect(url).toBe(link(esperado));
    expect((await c.eventos()).map((e) => e.evento)).toContainEqual({
      nome: 'clique_whatsapp',
      origem: 'escolha-plano',
      plano: 'duo',
    });
    await c.ctx.close();
  });

  it('4 · home, quiz "5 sinais" (checkboxes): dois sinais marcados', async () => {
    const c = await abrir();
    await c.page.goto(base + '/');
    await recusar(c.page);
    const sinais = c.page.locator('[data-quiz] label');
    await sinais.nth(0).click();
    await sinais.nth(2).click();
    const url = await clicarEAbrir(c, '[data-quiz-link]');
    expect(url).toBe(
      link(
        'Olá! Vim pelo site e quero agendar minha avaliação funcional. Me identifiquei com: ' +
          'Você aumenta a carga sem ter certeza de que consegue manter a técnica; ' +
          'Você termina a sessão sem entender o que está tentando desenvolver.',
      ),
    );
    expect((await c.eventos()).map((e) => e.evento)).toContainEqual({
      nome: 'clique_whatsapp',
      origem: 'quiz',
    });
    await c.ctx.close();
  });

  it('5 · /a-casa, zona do 3D (cardio): mensagem da zona', async () => {
    const c = await abrir();
    await c.page.goto(base + '/a-casa/?zona=cardio');
    await recusar(c.page);
    await c.page.locator('[role="tab"][data-zona="cardio"]').click();
    const url = await clicarEAbrir(c, 'a[data-cta-zona="cardio"]');
    expect(url).toBe(link('Olá! Vi a área de cardio no tour do site e quero conhecer de perto.'));
    expect((await c.eventos()).map((e) => e.evento)).toContainEqual({
      nome: 'clique_whatsapp',
      origem: 'tour-3d',
      zona: 'cardio',
    });
    await c.ctx.close();
  });

  it('6 · /trabalhe-conosco: mensagem de vagas', async () => {
    const c = await abrir();
    await c.page.goto(base + '/trabalhe-conosco/');
    await recusar(c.page);
    const url = await clicarEAbrir(c, 'main a[href^="https://wa.me/"]');
    expect(url).toBe(link('Olá! Vim pelo site e quero saber sobre vagas na Prime House.'));
    await c.ctx.close();
  });

  it('sem JS: link direto (escolha de plano → geral; quiz → avaliação) e nenhum banner', async () => {
    const c = await abrir({ js: false });
    await c.page.goto(base + '/planos/');
    expect(await c.page.locator('[data-escolha-link]').getAttribute('href')).toBe(
      link('Olá! Vim pelo site da Prime House e quero conhecer a academia.'),
    );
    expect(await c.page.locator('[data-consentimento]').isVisible()).toBe(false);
    await c.page.goto(base + '/');
    expect(await c.page.locator('[data-quiz-link]').getAttribute('href')).toBe(
      link('Olá! Vim pelo site e quero agendar minha avaliação funcional.'),
    );
    await c.ctx.close();
  });
});

describe('LGPD: nada de terceiro antes do consentimento', () => {
  const rotas: string[] = [];
  const andar = (d: string) => {
    for (const n of readdirSync(d)) {
      const caminho = join(d, n);
      if (statSync(caminho).isDirectory()) andar(caminho);
      else if (n === 'index.html') {
        const r = relative(dist, d).split(sep).join('/');
        rotas.push(r ? `/${r}/` : '/');
      }
    }
  };
  andar(dist);

  it(`nenhum request de terceiro e nenhum cookie em ${rotas.length} rotas + 404`, async () => {
    const c = await abrir({ abertura: true });
    for (const rota of [...rotas, '/404.html']) {
      await c.page.goto(base + rota, { waitUntil: 'networkidle' });
      await c.page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
          scrollTo(0, y);
          await new Promise((ok) => setTimeout(ok, 60));
        }
      });
      await c.page.waitForLoadState('networkidle');
      // as páginas internas de estudo (/_estilo, /_hero-*) não têm rodapé nem banner
      if (!rota.startsWith('/_'))
        expect(await c.page.locator('[data-consentimento]').isVisible(), rota).toBe(true);
    }
    expect(c.terceiros).toEqual([]);
    expect(await c.ctx.cookies()).toEqual([]);
    await c.ctx.close();
  });

  it('mapa: o 3D desenhado não chama terceiros; "Mapa real" carrega o OpenFreeMap', async () => {
    const c = await abrir();
    await c.page.goto(base + '/horarios-e-como-chegar/', { waitUntil: 'networkidle' });
    await recusar(c.page);
    await c.page.locator('[data-mapa]').scrollIntoViewIfNeeded();
    await c.page.waitForTimeout(1500);
    await c.page.waitForLoadState('networkidle');
    // o desenhado (ou a foto, sem WebGL) aparece sem nenhum pedido a terceiros
    expect(c.terceiros).toEqual([]);
    expect(await c.page.locator('iframe').count()).toBe(0);

    await c.page.getByRole('button', { name: 'Mapa real' }).click();
    await c.page.waitForFunction(
      () =>
        !!document.querySelector('[data-mapa].mapa--real') ||
        /não carregou/.test(document.querySelector('[data-mapa-etiqueta]')?.textContent ?? ''),
      undefined,
      { timeout: 20_000 },
    );
    expect(c.terceiros.some((u) => u.startsWith('https://tiles.openfreemap.org/'))).toBe(true);
    expect(await c.ctx.cookies()).toEqual([]);
    await c.ctx.close();
  });

  it('preferência alterável no rodapé (e lembrada entre páginas)', async () => {
    const c = await abrir();
    await c.page.goto(base + '/privacidade/');
    await c.page.getByRole('button', { name: 'Aceitar', exact: true }).click();
    await c.page.goto(base + '/planos/');
    expect(await c.page.locator('[data-consentimento]').isVisible()).toBe(false);
    const pref = c.page.locator('[data-preferencias]');
    await expect(pref.textContent()).resolves.toContain('aceitos');
    await pref.click();
    await expect(c.page.locator('[data-consentimento]').isVisible()).resolves.toBe(true);
    await recusar(c.page);
    await expect(pref.textContent()).resolves.toContain('recusados');
    await c.ctx.close();
  });
});

describe('medição dos outros eventos', () => {
  it('clique_como_chegar e clique_instagram', async () => {
    const c = await abrir();
    await c.page.goto(base + '/horarios-e-como-chegar/');
    await recusar(c.page);
    await clicarEAbrir(c, '.mapa-estatico a[href^="https://waze.com"]');
    await clicarEAbrir(c, 'footer a[href*="instagram.com"]');
    const ev = (await c.eventos()).map((e) => e.evento);
    expect(ev).toContainEqual({ nome: 'clique_como_chegar', origem: 'pagina', destino: 'waze' });
    expect(ev).toContainEqual({ nome: 'clique_instagram', origem: 'rodape' });
    await c.ctx.close();
  });

  it('tour_3d_aberto (zona) e tour_3d_realismo', async ({ skip }) => {
    const c = await abrir();
    await c.page.goto(base + '/a-casa/?zona=cardio');
    await recusar(c.page);
    // produção sem a aprovação da maquete esquemática: não há 3D para abrir
    const aprovada = await c.page.locator('[data-casa3d]').getAttribute('data-esquematica-ok');
    if (aprovada !== 'true') {
      await c.ctx.close();
      return skip('maquete esquemática não aprovada neste build');
    }
    await c.page.locator('[data-casa3d-alvo]').scrollIntoViewIfNeeded();
    const modo = await c.page
      .waitForFunction(
        () => {
          const m = document.querySelector('[data-casa3d]')?.getAttribute('data-modo');
          return m === '3d' || m === 'fallback' ? m : null;
        },
        undefined,
        { timeout: 30_000 },
      )
      .then((h) => h.jsonValue());
    if (modo !== '3d') return expect.soft(modo, 'sem WebGL neste navegador').toBe('3d');
    await c.page.locator('[role="tab"][data-zona="cardio"]').click();
    await c.page.locator('[data-painel="cardio"] [data-ver-real]').click();
    const ev = (await c.eventos()).map((e) => e.evento);
    expect(ev).toContainEqual({ nome: 'tour_3d_aberto', zona: 'cardio' });
    expect(ev).toContainEqual({ nome: 'tour_3d_realismo', zona: 'cardio' });
    await c.ctx.close();
  });
});
