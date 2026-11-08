// Varre o dist/ (HTML, JS, XML, TXT, JSON) atrás do que a seção 8/9 proíbe publicar.
// Uso: node scripts/audit-compliance.mjs [--producao] [--dir=dist]
// Preview: relata e passa (exceto página sem noindex). Produção: qualquer trava → exit 1.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import manifestoPadrao from '../media.manifest.json' with { type: 'json' };
import { avaliacoes } from '../src/config/avaliacoes.ts';
import { lerModo } from '../src/config/modo.ts';
import { encontrarTermos, normalizar } from '../src/config/termos.ts';
import { midiaPendente } from '../src/config/verificacao.ts';
import { planos } from '../src/content/dados/planos.ts';

const RAIZ = fileURLToPath(new URL('../', import.meta.url));
const EXTENSOES = /\.(html?|js|mjs|css|xml|txt|json|webmanifest)$/i;

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
export function decodificar(texto) {
  let t = texto
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTIDADES[n.toLowerCase()] ?? m);
  // percent-encoding (ex.: mensagens prontas do WhatsApp)
  t = t.replace(/(?:%[0-9a-f]{2})+/gi, (m) => {
    try {
      return decodeURIComponent(m);
    } catch {
      return m;
    }
  });
  return t;
}

const textoPuro = (html) =>
  decodificar(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
const semAspas = (t) => t.replace(/^[\s"“”'‘’«»]+|[\s"“”'‘’«»]+$/g, '');

function listarArquivos(dir) {
  const out = [];
  const andar = (d) => {
    for (const n of readdirSync(d)) {
      const c = join(d, n);
      if (statSync(c).isDirectory()) andar(c);
      else out.push(c);
    }
  };
  andar(dir);
  return out;
}

/** Remove avaliações literais verificadas (elogio literal de cliente é permitido). */
function extrairAvaliacoes(html, onde, add) {
  const porId = new Map(avaliacoes.selecionadas.map((a) => [a.id, a]));
  const re = /<([a-z][a-z0-9]*)\b([^>]*\sdata-avaliacao-literal="([^"]*)"[^>]*)>([\s\S]*?)<\/\1>/gi;
  return html.replace(re, (bloco, _tag, _attrs, id, interno) => {
    const a = porId.get(id);
    if (!a) {
      add(
        'trava',
        'avaliacao-desconhecida',
        onde,
        `avaliação "${id}" não está entre as selecionadas`,
      );
      return bloco;
    }
    if (normalizar(semAspas(textoPuro(interno))) !== normalizar(a.texto)) {
      add('trava', 'avaliacao-alterada', onde, `texto da avaliação "${id}" não é literal`);
      return bloco;
    }
    return ' ';
  });
}

/**
 * Funil e LGPD (sessão 7): todo link do WhatsApp é o do linkWhatsApp() (wa.me, número com DDI, mensagem
 * que começa com "Olá!"); nada de terceiro carrega com a página (script, iframe, imagem, CSS, preconnect).
 */
export function auditarFunil(html, onde, add) {
  for (const m of html.matchAll(/href="(https:\/\/(?:wa\.me|api\.whatsapp\.com)[^"]*)"/g)) {
    const href = m[1].replaceAll('&amp;', '&');
    const ok = /^https:\/\/wa\.me\/55\d{10,11}\?text=[^&]+$/.test(href);
    const texto = ok ? decodeURIComponent(new URL(href).searchParams.get('text') ?? '') : '';
    if (!ok || !texto.startsWith('Olá!'))
      add('erro', 'whatsapp-link', onde, `link do WhatsApp fora do padrão: ${href.slice(0, 90)}`);
  }
  const terceiro =
    /<(?:script|iframe|img|source|video|audio|embed)\b[^>]*\s(?:src|srcset|poster)="(?:https?:)?\/\/|<link\b[^>]*rel="(?:stylesheet|preconnect|dns-prefetch|preload|modulepreload|prefetch)"[^>]*href="(?:https?:)?\/\/|<link\b[^>]*href="(?:https?:)?\/\/[^"]*"[^>]*rel="(?:stylesheet|preconnect|dns-prefetch|preload|modulepreload|prefetch)"/gi;
  for (const m of html.matchAll(terceiro))
    add(
      'trava',
      'terceiro-sem-consentimento',
      onde,
      `recurso de terceiro na carga: ${m[0].slice(0, 90)}`,
    );
}

export function auditar({
  dir = join(RAIZ, 'dist'),
  modo = 'preview',
  manifesto = manifestoPadrao,
  planosDados = planos,
} = {}) {
  const achados = [];
  const add = (gravidade, regra, onde, mensagem) =>
    achados.push({ gravidade, regra, onde, mensagem });
  if (!existsSync(dir)) {
    add('erro', 'sem-dist', dir, 'diretório não existe: rode o build antes');
    return { modo, achados, ok: false };
  }

  const midias = new Map();
  for (const g of ['originais', 'trechos', 'stills', 'recortes'])
    for (const m of manifesto[g]) midias.set(m.id, m);
  const naoUsarArquivos = manifesto.originais
    .filter((o) => o.naoUsar)
    .map((o) => basename(o.arquivo));
  const beneficiosPendentes = planosDados
    .flatMap((p) => [p.inclui, ...p.beneficios])
    .filter((b) => b.estado === 'bloqueante')
    .map((b) => ({ id: b.id, texto: normalizar(b.texto) }));

  // pastas de mídia publicadas
  const dirMidia = join(dir, 'media');
  if (existsSync(dirMidia)) {
    for (const n of readdirSync(dirMidia)) {
      if (!statSync(join(dirMidia, n)).isDirectory()) continue;
      const m = midias.get(n);
      if (!m) add('trava', 'midia-desconhecida', `media/${n}`, 'pasta de mídia fora do manifesto');
      else if (m.naoUsar) add('trava', 'midia-nao-usar', `media/${n}`, 'mídia naoUsar publicada');
      else if (midiaPendente(m))
        add(
          'trava',
          'midia-consentimento-pendente',
          `media/${n}`,
          'mídia com consentimento pendente publicada',
        );
    }
  }

  let paginas = 0;
  for (const arq of listarArquivos(dir)) {
    const rel = relative(dir, arq);
    if (!EXTENSOES.test(arq) || rel.startsWith('media/') || rel.startsWith(`media${'\\'}`))
      continue;
    let texto = readFileSync(arq, 'utf8');
    const ehHtml = /\.html?$/i.test(arq);
    if (ehHtml) {
      paginas++;
      const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(texto);
      if (modo === 'preview' && !noindex)
        add('erro', 'preview-sem-noindex', rel, 'página de preview sem noindex');
      if (modo === 'producao' && /\sdata-provisorio\b/.test(texto))
        add('trava', 'provisorio-em-producao', rel, 'conteúdo PROVISÓRIO no HTML de produção');
      if (modo === 'producao' && /\sdata-preview-banner\b/.test(texto))
        add('trava', 'banner-em-producao', rel, 'faixa "em revisão" no HTML de produção');
      texto = extrairAvaliacoes(texto, rel, add);
      auditarFunil(texto, rel, add);
    }
    const decodificado = decodificar(texto);
    const norm = normalizar(decodificado);

    for (const o of encontrarTermos(decodificado))
      add('trava', 'termo-vetado', rel, `"${o.termo}" em "…${o.trecho}…"`);

    if (modo === 'producao')
      for (const b of beneficiosPendentes)
        if (norm.includes(b.texto))
          add(
            'trava',
            'beneficio-nao-confirmado',
            rel,
            `benefício "${b.id}" publicado sem confirmação`,
          );

    for (const m of decodificado.matchAll(/\/media\/([a-z0-9-]+)\//g)) {
      const id = m[1];
      const item = midias.get(id);
      if (!item)
        add('trava', 'midia-desconhecida', rel, `referência a /media/${id}/ fora do manifesto`);
      else if (item.naoUsar)
        add('trava', 'midia-nao-usar', rel, `referência a mídia naoUsar "${id}"`);
      else if (midiaPendente(item))
        add('trava', 'midia-consentimento-pendente', rel, `referência a mídia pendente "${id}"`);
    }
    if (/media-privada/.test(decodificado))
      add('trava', 'midia-privada', rel, 'referência a media-privada/');
    for (const n of naoUsarArquivos)
      if (decodificado.includes(n))
        add('trava', 'midia-nao-usar', rel, `referência ao arquivo naoUsar "${n}"`);
  }
  if (paginas === 0) add('erro', 'sem-paginas', dir, 'nenhuma página HTML encontrada');

  // deduplica
  const vistos = new Set();
  const unicos = achados.filter((a) => {
    const k = `${a.gravidade}|${a.regra}|${a.onde}|${a.mensagem}`;
    return vistos.has(k) ? false : (vistos.add(k), true);
  });
  const ok = !unicos.some(
    (a) => a.gravidade === 'erro' || (modo === 'producao' && a.gravidade === 'trava'),
  );
  return { modo, achados: unicos, ok, paginas };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const modo = process.argv.includes('--producao') ? 'producao' : lerModo(process.env.MODO);
  const arg = process.argv.find((a) => a.startsWith('--dir='));
  const r = auditar({ modo, ...(arg ? { dir: join(process.cwd(), arg.slice(6)) } : {}) });
  for (const a of r.achados) {
    const suf = a.gravidade === 'trava' && modo === 'preview' ? ' (travaria a produção)' : '';
    console.log(`  ${a.gravidade.toUpperCase().padEnd(5)} ${a.onde}: ${a.mensagem}${suf}`);
  }
  console.log(
    `[audit-compliance] modo ${modo} · ${r.paginas ?? 0} página(s) · ${r.achados.length} achado(s) → ${r.ok ? 'OK' : 'BLOQUEADO'}`,
  );
  process.exit(r.ok ? 0 : 1);
}
