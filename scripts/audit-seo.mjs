// Auditoria de SEO/GEO do dist/: lang, título, descrição, robots, canonical, Open Graph, JSON-LD
// (sem nota nem avaliação), NAP idêntico em todas as páginas e no llms.txt, robots.txt, sitemap e
// os termos que o site precisa responder. Erro → exit 1 (em qualquer modo). Aviso só informa.
// Uso: node scripts/audit-seo.mjs [--dir=dist]
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { contato } from '../src/config/contato.ts';
import { marca } from '../src/config/marca.ts';
import { lerModo } from '../src/config/modo.ts';
import { indexar as indexarConfig } from '../src/config/seo.ts';

const RAIZ = fileURLToPath(new URL('../', import.meta.url));
const END = contato.endereco.valor;
export const NAP = {
  nome: marca.nome.valor,
  telefone: contato.telefone.valor,
  telefoneE164: contato.telefoneE164.valor,
  rua: `${END.logradouro}, ${END.numero}`,
  endereco: END.completo,
};

/** Termos que o conteúdo precisa ter (seção 12 da investigação + Prompt 8). */
export const TERMOS = [
  ['academia em Lages', /academia em lages/],
  ['academia no Frei Rogério', /academia no frei rogerio/],
  ['academia aberta até meia-noite', /academia aberta ate (a )?meia-noite/],
  ['academia aberta domingo', /academia aberta (no |aos |de )?domingos?/],
  ['trânsito livre', /transito livre/],
  ['sem lotação', /sem lotacao/],
  ['Cimerian', /cimerian/],
  ['avaliação funcional', /avaliacao funcional/],
  ['treino com acompanhamento', /treino com acompanhamento/],
];

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decod = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
const norm = (s) =>
  decod(s)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
const textoVisivel = (html) =>
  decod(
    html
      .replace(/<(script|style|template|noscript)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
const meta = (html, attr, nome) =>
  new RegExp(`<meta[^>]*\\b${attr}="${nome}"[^>]*\\bcontent="([^"]*)"`, 'i').exec(html)?.[1] ??
  new RegExp(`<meta[^>]*\\bcontent="([^"]*)"[^>]*\\b${attr}="${nome}"`, 'i').exec(html)?.[1] ??
  null;

function paginasHtml(dir) {
  const out = [];
  const andar = (d) => {
    for (const n of readdirSync(d)) {
      const c = join(d, n);
      if (statSync(c).isDirectory()) andar(c);
      else if (n.endsWith('.html')) out.push(c);
    }
  };
  andar(dir);
  return out
    .map((arq) => {
      const rel = relative(dir, arq).split(sep).join('/');
      const rota =
        rel === 'index.html'
          ? '/'
          : rel.endsWith('/index.html')
            ? `/${rel.slice(0, -10)}`
            : `/${rel}`;
      return { arq, rota };
    })
    .filter((p) => !p.rota.startsWith('/_'))
    .sort((a, b) => a.rota.localeCompare(b.rota));
}

/** Percorre o JSON-LD (objetos aninhados) */
function* nos(v) {
  if (Array.isArray(v)) for (const x of v) yield* nos(x);
  else if (v && typeof v === 'object') {
    yield v;
    for (const x of Object.values(v)) yield* nos(x);
  }
}
const tipos = (n) => [n?.['@type']].flat().filter(Boolean);

export async function auditarSeo({
  dir = join(RAIZ, 'dist'),
  modo = 'preview',
  siteUrl = process.env.SITE_URL?.trim().replace(/\/+$/, '') || null,
  indexar = indexarConfig,
} = {}) {
  const erros = [];
  const avisos = [];
  const erro = (onde, msg) => erros.push(`${onde}: ${msg}`);
  const aviso = (onde, msg) => avisos.push(`${onde}: ${msg}`);
  if (!existsSync(join(dir, 'index.html'))) {
    erro(dir, 'sem build (index.html ausente)');
    return { erros, avisos, ok: false };
  }
  const indexavel = indexar && modo === 'producao' && Boolean(siteUrl);
  if (!siteUrl) aviso('SITE_URL', 'domínio não definido: sem canonical e com og:image relativa');
  if (indexar && modo === 'producao' && !siteUrl)
    erro('SITE_URL', 'indexar=true em produção exige SITE_URL');

  const paginas = paginasHtml(dir);
  const publicas = paginas.filter((p) => p.rota !== '/404.html');
  const napLd = new Map();
  const rodapes = new Map();
  let textoTodo = '';

  for (const { arq, rota } of paginas) {
    const html = readFileSync(arq, 'utf8');
    const e404 = rota === '/404.html';
    if (!/<html[^>]*\blang="pt-BR"/.test(html)) erro(rota, 'sem <html lang="pt-BR">');
    const titulos = html.match(/<title>[^<]*<\/title>/g) ?? [];
    if (titulos.length !== 1) erro(rota, `${titulos.length} <title>`);
    const titulo = decod(titulos[0]?.replace(/<\/?title>/g, '') ?? '');
    if (titulo.length > 65) aviso(rota, `título com ${titulo.length} caracteres (> 65)`);
    const desc = meta(html, 'name', 'description');
    if (!desc) erro(rota, 'sem meta description');
    else if (decod(desc).length > 165)
      aviso(rota, `descrição com ${decod(desc).length} caracteres (> 165)`);

    // robots e canonical
    const robots = meta(html, 'name', 'robots') ?? '';
    if (!indexavel && !/noindex/.test(robots)) erro(rota, 'sem noindex com indexação desligada');
    if (indexavel && !e404 && /noindex/.test(robots)) erro(rota, 'noindex com indexação ligada');
    const canonical = /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/.exec(html)?.[1] ?? null;
    if (siteUrl && !e404) {
      const esperado = `${siteUrl}${rota}`;
      if (canonical !== esperado) erro(rota, `canonical "${canonical}" ≠ "${esperado}"`);
    }
    if (e404 && canonical) erro(rota, '404 com canonical');

    // Open Graph
    for (const p of ['og:title', 'og:description', 'og:image', 'og:locale', 'og:type'])
      if (!meta(html, 'property', p)) erro(rota, `sem ${p}`);
    if (meta(html, 'property', 'og:locale') !== 'pt_BR') erro(rota, 'og:locale ≠ pt_BR');
    const img = meta(html, 'property', 'og:image');
    if (img) {
      if (siteUrl && !img.startsWith(`${siteUrl}/`)) erro(rota, `og:image não absoluta: ${img}`);
      const local = join(dir, img.replace(/^https?:\/\/[^/]+/, ''));
      if (!existsSync(local)) erro(rota, `og:image não existe no dist: ${img}`);
      else {
        const m = await sharp(local).metadata();
        if (m.width !== 1200 || m.height !== 630)
          erro(rota, `og:image ${m.width}×${m.height} (esperado 1200×630)`);
      }
    }

    // JSON-LD
    const blocos = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    const lds = [];
    for (const [, b] of blocos) {
      try {
        lds.push(JSON.parse(b));
      } catch (e) {
        erro(rota, `JSON-LD inválido: ${e.message}`);
      }
    }
    for (const n of nos(lds)) {
      if (tipos(n).some((t) => ['AggregateRating', 'Review', 'Rating'].includes(t)))
        erro(rota, `JSON-LD com ${tipos(n).join('/')} (proibido: avaliação autosservida)`);
      for (const k of ['aggregateRating', 'review', 'reviews'])
        if (k in n) erro(rota, `JSON-LD com "${k}" (proibido)`);
      if (tipos(n).includes('Offer') && ('price' in n || 'priceSpecification' in n))
        erro(rota, 'Offer com preço (o site não publica valores)');
    }
    const academia = lds.find((n) => tipos(n).includes('ExerciseGym'));
    if (!academia) erro(rota, 'sem ExerciseGym');
    else {
      const a = academia.address ?? {};
      napLd.set(
        rota,
        JSON.stringify([
          academia.name,
          academia.telephone,
          a.streetAddress,
          a.addressLocality,
          a.addressRegion,
          a.postalCode,
        ]),
      );
      if (academia.name !== NAP.nome) erro(rota, `JSON-LD name "${academia.name}" ≠ "${NAP.nome}"`);
      if (academia.telephone !== NAP.telefoneE164) erro(rota, 'JSON-LD telephone diverge do NAP');
      if (!String(a.streetAddress ?? '').startsWith(NAP.rua) || a.postalCode !== END.cep)
        erro(rota, 'JSON-LD address diverge do NAP');
      if (academia.founder?.name !== marca.fundador.valor) erro(rota, 'founder ausente');
      const turnosDomingo = (academia.openingHoursSpecification ?? []).filter((h) =>
        [h.dayOfWeek].flat().some((d) => String(d).endsWith('Sunday')),
      );
      if (turnosDomingo.length !== 2) erro(rota, 'domingo sem os dois turnos');
    }
    if (!e404 && rota !== '/' && !lds.some((n) => tipos(n).includes('BreadcrumbList')))
      erro(rota, 'sem BreadcrumbList');
    for (const v of lds.filter((n) => tipos(n).includes('VideoObject')))
      for (const k of ['name', 'thumbnailUrl', 'uploadDate', 'transcript'])
        if (!v[k]) erro(rota, `VideoObject sem ${k}`);
    const faq = lds.find((n) => tipos(n).includes('FAQPage'));
    if (rota === '/perguntas-frequentes/' && !faq) erro(rota, 'sem FAQPage');
    if (faq) {
      const visiveis = new Set(
        [...html.matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>/g)].map((m) =>
          norm(textoVisivel(m[1])),
        ),
      );
      for (const q of faq.mainEntity ?? [])
        if (![...visiveis].some((v) => v.includes(norm(q.name))))
          erro(rota, `pergunta do FAQPage não está visível: "${q.name}"`);
    }

    // NAP visível: rodapé idêntico em todas as páginas; nenhuma variação do endereço/telefone no texto
    const rodape = /<footer[\s\S]*?<address[^>]*>([\s\S]*?)<\/address>/.exec(html)?.[1];
    if (!rodape) erro(rota, 'rodapé sem <address>');
    else rodapes.set(rota, norm(textoVisivel(rodape)));
    const texto = textoVisivel(html);
    textoTodo += ` ${texto}`;
    if (!texto.includes(NAP.telefone)) erro(rota, `telefone "${NAP.telefone}" ausente`);
    for (const m of texto.matchAll(/Duque de Caxias,?\s*(?:n[º°.]?\s*)?(\d+)/gi))
      if (m[1] !== END.numero) erro(rota, `endereço divergente: "${m[0]}"`);
    for (const m of texto.matchAll(/\(?49\)?\s*9?\s*\d{4}-?\d{4}/g))
      if (m[0].trim() !== NAP.telefone && /9980/.test(m[0]))
        erro(rota, `telefone divergente: "${m[0]}"`);

    // parágrafo-resposta no topo
    if (!e404) {
      const resposta = /<p[^>]*\bdata-resposta\b[^>]*>([\s\S]*?)<\/p>/.exec(html)?.[1];
      if (!resposta || !/Lages/.test(resposta))
        erro(rota, 'sem parágrafo-resposta (com "Lages") no topo');
    }
  }

  if (new Set(napLd.values()).size > 1) erro('NAP', 'JSON-LD com NAP diferente entre páginas');
  if (new Set(rodapes.values()).size > 1) erro('NAP', 'endereço do rodapé diferente entre páginas');
  for (const [rota, r] of rodapes)
    for (const parte of [END.logradouro, END.numero, END.bairro, END.cidade, END.cep])
      if (!r.includes(norm(parte))) erro(rota, `rodapé sem "${parte}"`);

  // termos
  const tn = norm(textoTodo);
  for (const [nome, re] of TERMOS) if (!re.test(tn)) erro('conteúdo', `termo ausente: "${nome}"`);

  // llms.txt
  const llmsArq = join(dir, 'llms.txt');
  if (!existsSync(llmsArq)) erro('llms.txt', 'ausente');
  else {
    const l = readFileSync(llmsArq, 'utf8');
    if (!/^# \S/.test(l)) erro('llms.txt', 'não começa com H1');
    if (!/^> \S/m.test(l)) erro('llms.txt', 'sem resumo em citação (>)');
    if (!l.includes(NAP.endereco)) erro('llms.txt', 'endereço diverge do NAP');
    if (!l.includes(NAP.telefone)) erro('llms.txt', 'telefone diverge do NAP');
    if (/R\$\s*\d/.test(l)) erro('llms.txt', 'tem preço');
    if (siteUrl && /\]\(\//.test(l)) erro('llms.txt', 'links relativos com SITE_URL definido');
  }

  // robots.txt e sitemap
  const robotsTxt = existsSync(join(dir, 'robots.txt'))
    ? readFileSync(join(dir, 'robots.txt'), 'utf8')
    : null;
  if (!robotsTxt) erro('robots.txt', 'ausente');
  else {
    if (/^Disallow:\s*\/\s*$/m.test(robotsTxt))
      erro('robots.txt', 'bloqueia o site inteiro (o noindex deixaria de ser lido)');
    const sm = /^Sitemap:\s*(\S+)/m.exec(robotsTxt)?.[1] ?? null;
    if (indexavel && sm !== `${siteUrl}/sitemap.xml`) erro('robots.txt', 'sem Sitemap absoluto');
    if (!indexavel && sm) erro('robots.txt', 'anuncia sitemap com indexação desligada');
  }
  const smArq = join(dir, 'sitemap.xml');
  const locs = existsSync(smArq)
    ? [...readFileSync(smArq, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    : null;
  if (!locs) erro('sitemap.xml', 'ausente');
  else if (indexavel) {
    const esperadas = publicas.map((p) => `${siteUrl}${p.rota}`).sort();
    if (JSON.stringify([...locs].sort()) !== JSON.stringify(esperadas))
      erro('sitemap.xml', `URLs ≠ páginas canônicas (${locs.length} × ${esperadas.length})`);
  } else if (locs.length) erro('sitemap.xml', 'lista URLs com indexação desligada');

  return { erros, avisos, ok: erros.length === 0, paginas: paginas.length, indexavel };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const modo = process.argv.includes('--producao') ? 'producao' : lerModo(process.env.MODO);
  const arg = process.argv.find((a) => a.startsWith('--dir='));
  const r = await auditarSeo({ modo, ...(arg ? { dir: join(process.cwd(), arg.slice(6)) } : {}) });
  for (const a of r.avisos) console.log(`  AVISO ${a}`);
  for (const e of r.erros) console.log(`  ERRO  ${e}`);
  console.log(
    `[audit-seo] modo ${modo} · ${r.paginas ?? 0} página(s) · indexável: ${r.indexavel ? 'sim' : 'não'} · ${r.erros.length} erro(s), ${r.avisos.length} aviso(s) → ${r.ok ? 'OK' : 'FALHOU'}`,
  );
  process.exit(r.ok ? 0 : 1);
}
