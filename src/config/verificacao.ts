// Travas da produção (CLAUDE.md, seção 9) e avisos do preview. Função pura: recebe os dados e o modo.
// Em preview nada trava: as travas aparecem como "travaria a produção". Erro de schema sempre falha.
import type { Modo } from './modo.ts';
import type { Valor } from './tipos.ts';
import * as s from '../content/schemas.ts';

export interface ItemMidia {
  id: string;
  consentimento: 'pendente' | 'autorizado' | 'nao-precisa';
  pessoas: { quem: string; consentimento: string }[];
  naoUsar: boolean;
}
export interface ManifestoMidia {
  originais: ItemMidia[];
  trechos: ItemMidia[];
  stills: ItemMidia[];
  recortes: ItemMidia[];
}

export interface Entrada {
  config: Record<string, unknown>;
  whatsapp: Valor<string>;
  colecoes: {
    zonas: unknown[];
    equipamentos: unknown[];
    planos: unknown[];
    diferenciais: unknown[];
  };
  manifesto: ManifestoMidia;
  siteUrl: string | null;
}

export type Gravidade = 'erro' | 'trava' | 'aviso';
export interface Achado {
  gravidade: Gravidade;
  regra: string;
  onde: string;
  mensagem: string;
}
export interface Resultado {
  modo: Modo;
  achados: Achado[];
  /** true = este modo pode publicar */
  ok: boolean;
}

export const NUMERO_WHATSAPP = /^55\d{10,11}$/;

const ehValor = (x: unknown): x is Valor<unknown> =>
  typeof x === 'object' &&
  x !== null &&
  'estado' in x &&
  ['confirmado', 'opcional', 'bloqueante', 'aviso'].includes(
    String((x as { estado: unknown }).estado),
  );

/** Percorre a config e devolve cada Valor com o caminho. */
function* valores(obj: unknown, caminho: string): Generator<[string, Valor<unknown>]> {
  if (ehValor(obj)) {
    yield [caminho, obj];
    return;
  }
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) yield* valores(v, caminho ? `${caminho}.${k}` : k);
  }
}

export function midiaPendente(m: ItemMidia): boolean {
  return m.consentimento === 'pendente' || m.pessoas.some((p) => p.consentimento === 'pendente');
}

export function verificar(e: Entrada, modo: Modo): Resultado {
  const achados: Achado[] = [];
  const add = (gravidade: Gravidade, regra: string, onde: string, mensagem: string) =>
    achados.push({ gravidade, regra, onde, mensagem });

  // 1) WhatsApp (trava)
  const w = e.whatsapp;
  if (w.estado !== 'confirmado' || !w.valor || !NUMERO_WHATSAPP.test(w.valor)) {
    add(
      'trava',
      'whatsapp-ausente',
      'contato.whatsapp',
      `WhatsApp ausente, não confirmado ou inválido (${String(w.valor)})`,
    );
  }

  // 2) Estados da config (avisos)
  for (const [onde, v] of valores(e.config, '')) {
    if (v.estado === 'bloqueante')
      add('aviso', 'pendente', onde, `pendente: ${v.rotulo} (não aparece em produção)`);
    else if (v.estado === 'aviso') add('aviso', 'provisorio', onde, `provisório: ${v.motivo}`);
    else if (v.estado === 'opcional' && v.valor === null)
      add('aviso', 'opcional-vazio', onde, 'não informado (fica fora do site)');
  }
  if (!e.siteUrl)
    add('aviso', 'site-url', 'SITE_URL', 'domínio definitivo não definido (env SITE_URL)');

  // 3) Schemas das coleções (erro)
  const parse = <T>(
    nome: string,
    schema: {
      safeParse: (
        x: unknown,
      ) =>
        | { success: true; data: T }
        | { success: false; error: { issues: { path: PropertyKey[]; message: string }[] } };
    },
    lista: unknown[],
  ): T[] => {
    const ok: T[] = [];
    lista.forEach((item, i) => {
      const r = schema.safeParse(item);
      if (r.success) ok.push(r.data);
      else
        for (const iss of r.error.issues)
          add('erro', 'schema', `${nome}[${i}].${iss.path.join('.')}`, iss.message);
    });
    const ids = ok.map((x) => (x as { id: string }).id);
    for (const id of ids.filter((x, i) => ids.indexOf(x) !== i))
      add('erro', 'id-duplicado', `${nome}.${id}`, 'id repetido');
    return ok;
  };
  const zonas = parse<s.Zona>('zonas', s.zona, e.colecoes.zonas);
  const equipamentos = parse<s.Equipamento>('equipamentos', s.equipamento, e.colecoes.equipamentos);
  const planos = parse<s.Plano>('planos', s.plano, e.colecoes.planos);
  const diferenciais = parse<s.Diferencial>('diferenciais', s.diferencial, e.colecoes.diferenciais);

  // 4) Referências entre coleções
  const zonaPorId = new Map(zonas.map((z) => [z.id, z]));
  const equipPorId = new Map(equipamentos.map((q) => [q.id, q]));
  for (const q of equipamentos) {
    const z = zonaPorId.get(q.zona);
    if (!z) add('erro', 'referencia', `equipamentos.${q.id}.zona`, `zona "${q.zona}" não existe`);
    else if (q.subzona && !z.subzonas.some((sz) => sz.id === q.subzona))
      add(
        'erro',
        'referencia',
        `equipamentos.${q.id}.subzona`,
        `subzona "${q.subzona}" não existe em ${z.id}`,
      );
    if (q.fabricante === null)
      add('aviso', 'fabricante-pendente', `equipamentos.${q.id}`, 'fabricante não confirmado');
  }
  for (const z of zonas) {
    const listas: [string, string[]][] = [
      [`zonas.${z.id}.equipamentos`, z.equipamentos],
      ...z.subzonas.map((sz): [string, string[]] => [
        `zonas.${z.id}.subzonas.${sz.id}`,
        sz.equipamentos,
      ]),
    ];
    for (const [onde, ids] of listas) {
      for (const id of ids) {
        const q = equipPorId.get(id);
        if (!q)
          add('trava', 'equipamento-inventado', onde, `equipamento "${id}" não existe na coleção`);
        else if (!q.confirmado)
          add('trava', 'equipamento-nao-confirmado', onde, `equipamento "${id}" não confirmado`);
      }
    }
    for (const sz of z.subzonas)
      for (const id of sz.equipamentos)
        if (!z.equipamentos.includes(id))
          add(
            'erro',
            'referencia',
            `zonas.${z.id}.subzonas.${sz.id}`,
            `"${id}" não está nos equipamentos da zona`,
          );

    // 5) Zona do 3D sem fonte de layout
    if (z.fonteLayout === 'pendente') {
      if (z.camera)
        add(
          'trava',
          'zona-sem-fonte',
          `zonas.${z.id}.camera`,
          'câmera/layout definido sem planta nem captura (dado inventado)',
        );
      else add('aviso', 'zona-pendente', `zonas.${z.id}`, 'layout pendente (planta ou captura)');
    } else if (!z.camera) {
      add(
        'aviso',
        'zona-sem-camera',
        `zonas.${z.id}`,
        `fonte "${z.fonteLayout}" sem câmera definida`,
      );
    }
  }

  // 6) Mídia referenciada
  const midias = new Map<string, ItemMidia>();
  for (const g of [
    e.manifesto.originais,
    e.manifesto.trechos,
    e.manifesto.stills,
    e.manifesto.recortes,
  ])
    for (const m of g) midias.set(m.id, m);
  const refs: [string, string | null][] = [
    ...zonas.flatMap((z) => z.midia.map((id): [string, string] => [`zonas.${z.id}.midia`, id])),
    ...equipamentos.flatMap((q): [string, string | null][] => [
      [`equipamentos.${q.id}.foto`, q.foto],
      [`equipamentos.${q.id}.video`, q.video],
    ]),
    ...diferenciais.map((d): [string, string | null] => [`diferenciais.${d.id}.midia`, d.midia]),
  ];
  for (const [onde, id] of refs) {
    if (!id) continue;
    const m = midias.get(id);
    if (!m) add('erro', 'midia-inexistente', onde, `mídia "${id}" não está em media.manifest.json`);
    else if (m.naoUsar) add('trava', 'midia-nao-usar', onde, `mídia "${id}" está marcada naoUsar`);
    else if (midiaPendente(m))
      add(
        'trava',
        'midia-consentimento-pendente',
        onde,
        `mídia "${id}" com consentimento pendente`,
      );
  }

  // 7) Planos e diferenciais
  for (const p of planos)
    for (const b of [p.inclui, ...p.beneficios])
      if (b.estado === 'bloqueante')
        add(
          'aviso',
          'beneficio-provisorio',
          `planos.${p.id}.${b.id}`,
          `${b.rotulo}: em preview com selo PROVISÓRIO; fora da produção`,
        );
  for (const d of diferenciais)
    if (!d.confirmado)
      add(
        'aviso',
        'diferencial-nao-confirmado',
        `diferenciais.${d.id}`,
        'não confirmado: não aparece',
      );

  const bloqueia = achados.some(
    (a) => a.gravidade === 'erro' || (modo === 'producao' && a.gravidade === 'trava'),
  );
  return { modo, achados, ok: !bloqueia };
}
