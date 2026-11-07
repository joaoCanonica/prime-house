// JSON-LD gerado da config (nunca escrito à mão). Fontes e decisões em docs/SEO_GEO.md.
// Sem AggregateRating e sem Review: avaliação da própria empresa no próprio site é "self-serving"
// e não vale estrela (Google Search Central, review-snippet), além da regra do projeto (CLAUDE.md §8).
import { contato } from '../../config/contato.ts';
import { horario, type DiaSemana, type Intervalo } from '../../config/horario.ts';
import { marca } from '../../config/marca.ts';
import { diferenciais } from '../../content/dados/diferenciais.ts';
import { planos } from '../../content/dados/planos.ts';
import { txt, type Texto } from '../../content/textos/tipos.ts';

export type No = Record<string, unknown>;

/** URL absoluta quando há SITE_URL; senão, relativa à raiz (o JSON-LD resolve pela base do documento). */
export function absoluta(base: string | null, caminho: string): string {
  if (/^https?:\/\//.test(caminho)) return caminho;
  const c = caminho.startsWith('/') ? caminho : `/${caminho}`;
  return base ? `${base.replace(/\/+$/, '')}${c}` : c;
}

/** NAP: a forma única do nome, endereço e telefone em todo o site (e no llms.txt). */
export const nap = {
  nome: marca.nome.valor,
  endereco: contato.endereco.valor.completo,
  telefone: contato.telefone.valor,
  telefoneE164: contato.telefoneE164.valor,
} as const;

const DIAS: Record<DiaSemana, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

/** "24:00" vira "00:00": closes < opens = vira o dia (schema.org/OpeningHoursSpecification). */
const hora = (h: string) => (h === '24:00' ? '00:00' : h);

/**
 * Agrupa dias com os mesmos intervalos; um OpeningHoursSpecification por intervalo
 * (domingo e feriado têm dois turnos → duas entradas cada). Feriados: schema.org/PublicHolidays.
 */
export function horariosLd(): No[] {
  const r = horario.regras.valor;
  const grupos = new Map<string, { dias: string[]; intervalos: readonly Intervalo[] }>();
  const add = (dia: string, intervalos: readonly Intervalo[]) => {
    const k = JSON.stringify(intervalos);
    const g = grupos.get(k) ?? { dias: [], intervalos };
    g.dias.push(dia);
    grupos.set(k, g);
  };
  for (const d of [1, 2, 3, 4, 5, 6, 0] as const) add(DIAS[d], r.semana[d]);
  add('PublicHolidays', r.feriado);
  const saida: No[] = [];
  for (const g of grupos.values())
    for (const [abre, fecha] of g.intervalos)
      saida.push({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: g.dias.map((d) => `https://schema.org/${d}`),
        opens: hora(abre),
        closes: hora(fecha),
      });
  return saida;
}

/** Comodidades pedidas para a ficha (só as confirmadas na coleção de diferenciais). */
const COMODIDADES = ['climatizacao', 'banheiro-completo', 'espaco-kids', 'cafe', 'esteira-tv'];

export function comodidadesLd(): No[] {
  return COMODIDADES.map((id) => diferenciais.find((d) => d.id === id))
    .filter((d): d is NonNullable<typeof d> => Boolean(d?.confirmado))
    .map((d) => ({ '@type': 'LocationFeatureSpecification', name: d.nome, value: true }));
}

/** Planos sem preço: Offer sem price (schema.org não exige; o site não publica valores). */
export function planosLd(base: string | null): No {
  return {
    '@type': 'OfferCatalog',
    name: 'Planos da Prime House Academia',
    url: absoluta(base, '/planos'),
    itemListElement: [...planos]
      .sort((a, b) => a.ordem - b.ordem)
      .map((p) => ({
        '@type': 'Offer',
        url: absoluta(base, '/planos'),
        itemOffered: {
          '@type': 'Service',
          name: p.nome,
          ...(p.inclui.estado === 'confirmado' ? { description: p.inclui.texto } : {}),
        },
      })),
  };
}

export interface OpcoesAcademia {
  base: string | null;
  descricao: string;
  imagem: string;
}

export function academiaLd({ base, descricao, imagem }: OpcoesAcademia): No {
  const end = contato.endereco.valor;
  const geo = contato.geo.valor;
  return {
    '@context': 'https://schema.org',
    '@type': ['ExerciseGym', 'HealthClub'],
    '@id': absoluta(base, '/#academia'),
    name: nap.nome,
    description: descricao,
    url: absoluta(base, '/'),
    image: [absoluta(base, imagem)],
    logo: absoluta(base, '/icone-512.png'),
    telephone: nap.telefoneE164,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${end.logradouro}, ${end.numero}, ${end.bairro}`,
      addressLocality: end.cidade,
      addressRegion: end.uf,
      postalCode: end.cep,
      addressCountry: end.pais,
    },
    geo: { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng },
    hasMap: contato.mapas.valor.google,
    sameAs: [contato.instagram.valor.url, contato.mapas.valor.google],
    openingHoursSpecification: horariosLd(),
    amenityFeature: comodidadesLd(),
    hasOfferCatalog: planosLd(base),
    founder: { '@type': 'Person', name: marca.fundador.valor },
    foundingDate: marca.inauguracao.valor,
    knowsLanguage: 'pt-BR',
  };
}

export interface Pergunta {
  p: Texto;
  r: Texto;
}
const ehProv = (t: Texto) => typeof t === 'object' && 'provisorio' in t;

/** FAQPage só com respostas confirmadas (o provisório nunca entra no JSON-LD, nem no preview). */
export function faqLd(perguntas: readonly Pergunta[]): No | null {
  const ok = perguntas.filter((q) => !ehProv(q.p) && !ehProv(q.r));
  if (!ok.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'pt-BR',
    mainEntity: ok.map((q) => ({
      '@type': 'Question',
      name: txt(q.p),
      acceptedAnswer: { '@type': 'Answer', text: txt(q.r) },
    })),
  };
}

export function trilhaLd(
  base: string | null,
  itens: readonly { nome: string; rota: string }[],
): No {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itens.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.nome,
      item: absoluta(base, it.rota),
    })),
  };
}

export interface OpcoesVideo {
  base: string | null;
  nome: string;
  descricao: string;
  transcricao: string;
  miniatura: string;
  arquivo: string;
  duracaoS: number;
  /** data da primeira publicação (post), ISO 8601 com fuso */
  publicadoEm: string;
  pagina: string;
}

/** ISO 8601: 22,03 s → "PT22S"; 75 s → "PT1M15S". */
export function duracaoIso(s: number): string {
  const t = Math.round(s);
  const m = Math.floor(t / 60);
  return `PT${m ? `${m}M` : ''}${t % 60}S`;
}

export function videoLd(o: OpcoesVideo): No {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: o.nome,
    description: o.descricao,
    thumbnailUrl: [absoluta(o.base, o.miniatura)],
    uploadDate: o.publicadoEm,
    contentUrl: absoluta(o.base, o.arquivo),
    duration: duracaoIso(o.duracaoS),
    transcript: o.transcricao,
    inLanguage: 'pt-BR',
    url: absoluta(o.base, o.pagina),
    publisher: { '@id': absoluta(o.base, '/#academia') },
  };
}

/** Serializa para <script type="application/ld+json"> sem permitir fechar a tag. */
export const serializar = (n: No) => JSON.stringify(n).replace(/</g, '\\u003c');
