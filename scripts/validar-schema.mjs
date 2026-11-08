// Valida o JSON-LD do dist/ contra o vocabulário oficial do schema.org (o mesmo do validator.schema.org)
// e contra as propriedades obrigatórias do Google Search Central (negócio local, vídeo, trilha, FAQ).
// Use quando os validadores on-line não estiverem acessíveis. Precisa de rede só na 1ª vez (cache em .cache/).
// Uso: node scripts/validar-schema.mjs [--dir=dist] [--relatorio=docs/seo/validacao-local.md]
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('../', import.meta.url));
const VOCAB_URL = 'https://schema.org/version/latest/schemaorg-current-https.jsonld';
const CACHE = join(RAIZ, '.cache', 'schemaorg-current-https.jsonld');
const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3);
const DIR = join(RAIZ, arg('dir') ?? 'dist');

async function vocabulario() {
  if (!existsSync(CACHE)) {
    const r = await fetch(VOCAB_URL);
    if (!r.ok) throw new Error(`não baixou o vocabulário (${r.status})`);
    mkdirSync(dirname(CACHE), { recursive: true });
    writeFileSync(CACHE, await r.text());
  }
  const grafo = JSON.parse(readFileSync(CACHE, 'utf8'))['@graph'];
  const id = (x) => String(x['@id'] ?? x).replace(/^schema:/, '');
  const lista = (v) => (v == null ? [] : [v].flat().map(id));
  const classes = new Map();
  const props = new Map();
  const membros = new Map(); // membro de enumeração → tipos
  for (const n of grafo) {
    const t = [n['@type']].flat();
    if (t.includes('rdfs:Class')) classes.set(id(n), lista(n['rdfs:subClassOf']));
    else if (t.includes('rdf:Property'))
      props.set(id(n), {
        dominio: lista(n['schema:domainIncludes']),
        faixa: lista(n['schema:rangeIncludes']),
      });
    else if (String(n['@id']).startsWith('schema:')) membros.set(id(n), t.map(id));
  }
  const ancestrais = (c, vistos = new Set()) => {
    if (vistos.has(c)) return vistos;
    vistos.add(c);
    for (const p of classes.get(c) ?? []) ancestrais(p, vistos);
    return vistos;
  };
  return { classes, props, membros, ancestrais };
}

const DADOS = new Set([
  'Text',
  'URL',
  'Date',
  'DateTime',
  'Time',
  'Number',
  'Integer',
  'Float',
  'Boolean',
  'DataType',
  'CssSelectorType',
  'XPathType',
  'PronounceableText',
]);

function validarNo(v, no, caminho, erros) {
  const tipos = [no['@type']].flat().filter(Boolean);
  if (!tipos.length && !no['@id']) erros.push(`${caminho}: nó sem @type`);
  const anc = new Set();
  for (const t of tipos) {
    if (!v.classes.has(t)) erros.push(`${caminho}: tipo desconhecido "${t}"`);
    else for (const a of v.ancestrais(t)) anc.add(a);
  }
  for (const [k, val] of Object.entries(no)) {
    if (k.startsWith('@')) continue;
    const p = v.props.get(k);
    if (!p) {
      erros.push(`${caminho}.${k}: propriedade desconhecida`);
      continue;
    }
    if (tipos.length && !p.dominio.some((d) => anc.has(d)))
      erros.push(
        `${caminho}.${k}: não se aplica a ${tipos.join('/')} (domínio: ${p.dominio.join(', ')})`,
      );
    for (const [i, x] of [val].flat().entries()) {
      const onde = `${caminho}.${k}${Array.isArray(val) ? `[${i}]` : ''}`;
      if (x && typeof x === 'object') {
        if (x['@type']) {
          const ok = [x['@type']]
            .flat()
            .some((t) => [...v.ancestrais(t)].some((a) => p.faixa.includes(a)));
          if (!ok) erros.push(`${onde}: ${x['@type']} fora da faixa (${p.faixa.join(', ')})`);
          validarNo(v, x, onde, erros);
        } else if (!x['@id']) erros.push(`${onde}: objeto sem @type nem @id`);
      } else if (typeof x === 'string') {
        const m = /^https?:\/\/schema\.org\/(\w+)$/.exec(x);
        if (m && v.membros.has(m[1])) {
          const ok = v.membros.get(m[1]).some((t) => p.faixa.some((f) => v.ancestrais(t).has(f)));
          if (!ok) erros.push(`${onde}: ${m[1]} não é valor de ${p.faixa.join(', ')}`);
        } else if (/^(https?:\/\/|\/)/.test(x)) {
          // URL como referência a um Thing (absoluta, ou relativa à raiz quando ainda não há SITE_URL)
        } else if (
          p.faixa.includes('Duration') &&
          /^P(?!$)(\d+Y)?(\d+M)?(\d+D)?(T(\d+H)?(\d+M)?(\d+(\.\d+)?S)?)?$/.test(x)
        ) {
          // Duration em ISO 8601 (schema.org/Duration)
        } else if (!p.faixa.some((f) => DADOS.has(f) || v.ancestrais(f).has('DataType')))
          erros.push(`${onde}: texto onde se espera ${p.faixa.join(', ')}`);
      } else if (typeof x === 'number') {
        if (!p.faixa.some((f) => ['Number', 'Integer', 'Float', 'Text'].includes(f)))
          erros.push(`${onde}: número onde se espera ${p.faixa.join(', ')}`);
      } else if (typeof x === 'boolean') {
        if (!p.faixa.some((f) => ['Boolean', 'Text', 'URL'].includes(f) || f === 'StructuredValue'))
          erros.push(`${onde}: booleano onde se espera ${p.faixa.join(', ')}`);
      }
    }
  }
}

/** Obrigatórias segundo o Google Search Central (páginas citadas em docs/SEO_GEO.md). */
function validarGoogle(no, caminho, erros) {
  const t = [no['@type']].flat();
  const falta = (ks) => ks.filter((k) => no[k] == null || no[k] === '');
  if (t.some((x) => ['ExerciseGym', 'HealthClub', 'LocalBusiness'].includes(x)))
    for (const k of falta(['name', 'address'])) erros.push(`${caminho}: LocalBusiness sem ${k}`);
  if (t.includes('VideoObject'))
    for (const k of falta(['name', 'thumbnailUrl', 'uploadDate']))
      erros.push(`${caminho}: VideoObject sem ${k}`);
  if (t.includes('BreadcrumbList'))
    for (const [i, it] of (no.itemListElement ?? []).entries())
      if (it.position !== i + 1 || !it.name) erros.push(`${caminho}: ListItem ${i + 1} incompleto`);
  if (t.includes('FAQPage'))
    for (const q of no.mainEntity ?? [])
      if (!q.name || !q.acceptedAnswer?.text) erros.push(`${caminho}: Question incompleta`);
  if (no.openingHoursSpecification)
    for (const h of no.openingHoursSpecification)
      if (!/^\d{2}:\d{2}(:\d{2})?$/.test(h.opens) || !/^\d{2}:\d{2}(:\d{2})?$/.test(h.closes))
        erros.push(`${caminho}: horário fora de hh:mm`);
}

const paginas = [];
const andar = (d) => {
  for (const n of readdirSync(d)) {
    const c = join(d, n);
    if (statSync(c).isDirectory()) andar(c);
    else if (n.endsWith('.html')) paginas.push(c);
  }
};
andar(DIR);

const v = await vocabulario();
const linhas = [];
let total = 0;
let blocos = 0;
const tiposVistos = new Set();
for (const arq of paginas.sort()) {
  const rota = `/${relative(DIR, arq).split(sep).join('/')}`.replace(/index\.html$/, '');
  if (rota.startsWith('/_')) continue;
  const html = readFileSync(arq, 'utf8');
  const erros = [];
  for (const [i, [, b]] of [
    ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
  ].entries()) {
    blocos++;
    const no = JSON.parse(b);
    [no['@type']].flat().forEach((t) => tiposVistos.add(t));
    validarNo(v, no, `#${i + 1} ${[no['@type']].flat().join('/')}`, erros);
    validarGoogle(no, `#${i + 1}`, erros);
  }
  total += erros.length;
  linhas.push(
    `| \`${rota}\` | ${erros.length ? erros.map((e) => e.replace(/\|/g, '\\|')).join('<br>') : 'sem erro'} |`,
  );
}

const relatorio = `# Validação local do JSON-LD

Gerado por \`node scripts/validar-schema.mjs\` em ${new Date().toISOString().slice(0, 10)}.
Vocabulário: ${VOCAB_URL} (${v.classes.size} tipos, ${v.props.size} propriedades).
Confere tipos, propriedades, domínio e faixa de cada valor, membros de enumeração (ex.: \`PublicHolidays\`)
e as propriedades obrigatórias do Google para negócio local, vídeo, trilha e FAQ.

${blocos} blocos JSON-LD · tipos: ${[...tiposVistos].sort().join(', ')} · **${total} erro(s)**

| Página | Resultado |
|---|---|
${linhas.join('\n')}
`;
const destino = arg('relatorio');
if (destino) {
  mkdirSync(dirname(join(RAIZ, destino)), { recursive: true });
  writeFileSync(join(RAIZ, destino), relatorio);
}
console.log(relatorio);
process.exit(total ? 1 : 0);
