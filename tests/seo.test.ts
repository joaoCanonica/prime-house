import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { gerarRobots, gerarSitemap } from '../src/components/seo/arquivos.ts';
import {
  absoluta,
  academiaLd,
  duracaoIso,
  faqLd,
  nap,
  serializar,
  type No,
} from '../src/components/seo/ld.ts';
import { gerarLlms } from '../src/components/seo/llms.ts';
import { paginas } from '../src/components/seo/paginas.ts';
import { provisorio } from '../src/content/textos/tipos.ts';
import { auditarSeo, TERMOS } from '../scripts/audit-seo.mjs';

const BASE = 'https://prime-house.example';
const gym = academiaLd({ base: BASE, descricao: 'x', imagem: '/og/prime-house.jpg' });
const chaves = (v: unknown): string[] =>
  Array.isArray(v)
    ? v.flatMap(chaves)
    : v && typeof v === 'object'
      ? Object.entries(v).flatMap(([k, x]) => [k, ...chaves(x)])
      : [];
const tiposDe = (v: unknown): string[] =>
  Array.isArray(v)
    ? v.flatMap(tiposDe)
    : v && typeof v === 'object'
      ? [
          ...[(v as No)['@type']].flat().filter((t): t is string => typeof t === 'string'),
          ...Object.values(v).flatMap(tiposDe),
        ]
      : [];

describe('JSON-LD da academia (gerado da config)', () => {
  it('ExerciseGym + HealthClub com NAP, geo e sameAs', () => {
    expect(gym['@type']).toEqual(['ExerciseGym', 'HealthClub']);
    expect(gym['name']).toBe('Prime House Academia');
    expect(gym['telephone']).toBe('+5549998043861');
    expect(gym['address']).toMatchObject({
      streetAddress: 'Av. Duque de Caxias, 1253, Frei Rogério',
      addressLocality: 'Lages',
      addressRegion: 'SC',
      postalCode: '88508-001',
      addressCountry: 'BR',
    });
    expect(gym['geo']).toMatchObject({ latitude: -27.8013201, longitude: -50.3148959 });
    expect(gym['sameAs']).toEqual([
      'https://www.instagram.com/primehouse.academia/',
      'https://www.google.com/maps?cid=9561389130144054445',
    ]);
    expect(gym['url']).toBe(`${BASE}/`);
    expect(gym['founder']).toEqual({ '@type': 'Person', name: 'Lucas Moro' });
  });
  it('sem nota e sem avaliação (autosservida)', () => {
    const k = chaves(gym);
    expect(k).not.toContain('aggregateRating');
    expect(k).not.toContain('review');
    expect(tiposDe(gym)).not.toContain('AggregateRating');
    expect(tiposDe(gym)).not.toContain('Review');
  });
  it('horário: dias úteis até meia-noite; domingo e feriados com dois turnos', () => {
    const h = gym['openingHoursSpecification'] as {
      dayOfWeek: string[];
      opens: string;
      closes: string;
    }[];
    const de = (d: string) =>
      h
        .filter((x) => x.dayOfWeek.includes(`https://schema.org/${d}`))
        .map((x) => [x.opens, x.closes]);
    expect(de('Monday')).toEqual([['05:00', '00:00']]);
    expect(de('Friday')).toEqual([['05:00', '00:00']]);
    expect(de('Saturday')).toEqual([['08:00', '18:00']]);
    const turnos = [
      ['09:00', '12:00'],
      ['15:00', '18:00'],
    ];
    expect(de('Sunday')).toEqual(turnos);
    expect(de('PublicHolidays')).toEqual(turnos);
  });
  it('comodidades: só as confirmadas pedidas', () => {
    const nomes = (gym['amenityFeature'] as { name: string; value: boolean }[]).map((a) => a.name);
    expect(nomes).toEqual([
      'Climatização',
      'Banheiro e vestiário completos',
      'Espaço kids',
      'Café',
      'Esteira com TV',
    ]);
  });
  it('planos sem preço e sem benefício não confirmado', () => {
    const cat = gym['hasOfferCatalog'] as { itemListElement: No[] };
    expect(cat.itemListElement).toHaveLength(3);
    const k = chaves(cat);
    expect(k).not.toContain('price');
    expect(k).not.toContain('priceCurrency');
    expect(JSON.stringify(cat)).not.toMatch(/14 dias|trancamento|Sexta Prime/);
  });
  it('serializa sem fechar a tag <script>', () => {
    expect(serializar({ a: '</script><b>' })).not.toContain('</script>');
  });
});

describe('outros JSON-LD', () => {
  it('URL absoluta com domínio; relativa sem', () => {
    expect(absoluta(BASE, '/planos/')).toBe(`${BASE}/planos/`);
    expect(absoluta(null, '/planos/')).toBe('/planos/');
  });
  it('FAQPage não publica resposta provisória', () => {
    const f = faqLd([
      { p: 'Abre domingo?', r: 'Sim.' },
      { p: 'Tem nutri?', r: provisorio('Talvez.', 'sem confirmação') },
    ]);
    expect(f?.['mainEntity']).toHaveLength(1);
    expect(faqLd([{ p: 'x', r: provisorio('y', 'z') }])).toBeNull();
  });
  it('duração ISO 8601', () => {
    expect(duracaoIso(22.033)).toBe('PT22S');
    expect(duracaoIso(75)).toBe('PT1M15S');
  });
});

describe('robots.txt e sitemap.xml', () => {
  it('indexação desligada: rastreio liberado, sem Sitemap e sitemap vazio', () => {
    expect(gerarRobots(false, BASE)).toBe('User-agent: *\nAllow: /\n');
    expect(gerarSitemap(false, BASE)).not.toContain('<url>');
  });
  it('indexação ligada: Sitemap absoluto e todas as páginas canônicas', () => {
    expect(gerarRobots(true, BASE)).toContain(`Sitemap: ${BASE}/sitemap.xml`);
    const sm = gerarSitemap(true, BASE);
    for (const p of paginas) expect(sm).toContain(`<loc>${BASE}${p.rota}</loc>`);
    expect(sm).not.toContain('404');
  });
});

describe('llms.txt', () => {
  const l = gerarLlms(BASE);
  it('formato llmstxt.org: H1, citação, H2 com listas de links e "Optional"', () => {
    expect(l.startsWith('# Prime House Academia\n')).toBe(true);
    expect(l).toMatch(/^> \S/m);
    expect(l).toMatch(/^## Páginas$/m);
    expect(l).toMatch(/^## Optional$/m);
    expect(l).toMatch(/^- \[Planos\]\(https:\/\/prime-house\.example\/planos\/\): /m);
  });
  it('NAP idêntico, horário, maquinário, planos sem preço, como falar', () => {
    expect(l).toContain(nap.endereco);
    expect(l).toContain(nap.telefone);
    expect(l).toContain('100% Cimerian');
    expect(l).toContain('Plano Select');
    expect(l).toContain('5h às 0h');
    expect(l).not.toMatch(/R\$|grátis|promoção/i);
    expect(l).toContain('https://wa.me/5549998043861?text=');
  });
});

/** dist/ mínimo para a auditoria: duas páginas + 404 + llms/robots/sitemap + og. */
async function distFalso({
  indexavel = false,
  rodape2 = 'Av. Duque de Caxias, 1253<br>Frei Rogério, Lages/SC<br>CEP 88508-001',
} = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'seo-'));
  const termos =
    'A Prime House é academia em Lages, academia no Frei Rogério, academia aberta até meia-noite e academia aberta no domingo, de trânsito livre, sem lotação, 100% Cimerian, com avaliação funcional e treino com acompanhamento.';
  const pagina = (rota: string, rodape: string, extra: No[] = []) => {
    const ld = [
      academiaLd({ base: indexavel ? BASE : null, descricao: 'x', imagem: '/og/p.jpg' }),
      ...extra,
    ];
    const canon = indexavel ? `<link rel="canonical" href="${BASE}${rota}">` : '';
    return `<!doctype html><html lang="pt-BR"><head><title>T</title>
<meta name="description" content="Academia em Lages no Frei Rogério.">
<meta name="robots" content="${indexavel ? 'index, follow' : 'noindex, nofollow'}">${canon}
<meta property="og:title" content="T"><meta property="og:description" content="D"><meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR"><meta property="og:image" content="${indexavel ? BASE : ''}/og/p.jpg">
${ld.map((n) => `<script type="application/ld+json">${serializar(n)}</script>`).join('')}
</head><body><main><p data-resposta>${termos} Fica em Lages.</p></main>
<footer><address>${rodape}</address><a>(49) 99804-3861</a></footer></body></html>`;
  };
  const trilha = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [],
  };
  const rotas = indexavel ? paginas.map((p) => p.rota) : ['/', '/planos/'];
  for (const [i, r] of rotas.entries()) {
    const d = join(dir, r);
    mkdirSync(d, { recursive: true });
    writeFileSync(
      join(d, 'index.html'),
      pagina(
        r,
        i === 1 ? rodape2 : 'Av. Duque de Caxias, 1253<br>Frei Rogério, Lages/SC<br>CEP 88508-001',
        r === '/' ? [] : [trilha],
      ),
    );
  }
  mkdirSync(join(dir, 'og'));
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#000' } })
    .jpeg()
    .toFile(join(dir, 'og', 'p.jpg'));
  if (indexavel) {
    const faq = faqLd([{ p: 'Abre domingo?', r: 'Sim.' }]);
    const f = join(dir, 'perguntas-frequentes', 'index.html');
    writeFileSync(
      f,
      pagina(
        '/perguntas-frequentes/',
        'Av. Duque de Caxias, 1253<br>Frei Rogério, Lages/SC<br>CEP 88508-001',
        [trilha, faq as No],
      ).replace('</main>', '<details><summary><h3>Abre domingo?</h3></summary></details></main>'),
    );
  }
  writeFileSync(join(dir, 'llms.txt'), gerarLlms(indexavel ? BASE : null));
  writeFileSync(join(dir, 'robots.txt'), gerarRobots(indexavel, BASE));
  writeFileSync(join(dir, 'sitemap.xml'), gerarSitemap(indexavel, BASE));
  return dir;
}

describe('audit-seo (dist simulado)', () => {
  it('verde com indexação desligada', async () => {
    const r = await auditarSeo({ dir: await distFalso(), modo: 'preview', siteUrl: null });
    expect(r.erros).toEqual([]);
  });
  it('NAP divergente no rodapé de uma página → falha', async () => {
    const dir = await distFalso({
      rodape2: 'Av. Duque de Caxias, 2553<br>Frei Rogério, Lages/SC<br>CEP 88508-001',
    });
    const r = await auditarSeo({ dir, modo: 'preview', siteUrl: null });
    expect(r.ok).toBe(false);
    expect(r.erros.join('\n')).toMatch(/endereço divergente: "Duque de Caxias, 2553"/);
    expect(r.erros.join('\n')).toMatch(/NAP: endereço do rodapé diferente/);
  });
  it('indexação ligada: canonical, sitemap e robots conferidos', async () => {
    const dir = await distFalso({ indexavel: true });
    const ok = await auditarSeo({ dir, modo: 'producao', siteUrl: BASE, indexar: true });
    expect(ok.erros).toEqual([]);
    writeFileSync(join(dir, 'robots.txt'), gerarRobots(false, BASE));
    const sem = await auditarSeo({ dir, modo: 'producao', siteUrl: BASE, indexar: true });
    expect(sem.erros.join('\n')).toMatch(/robots\.txt: sem Sitemap absoluto/);
  });
  it('termos que o conteúdo precisa responder', () => {
    expect(TERMOS.map(([t]) => t)).toEqual([
      'academia em Lages',
      'academia no Frei Rogério',
      'academia aberta até meia-noite',
      'academia aberta domingo',
      'trânsito livre',
      'sem lotação',
      'Cimerian',
      'avaliação funcional',
      'treino com acompanhamento',
    ]);
  });
});
