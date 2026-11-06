// Tipos dos textos do site. Regra: toda frase real da marca leva a fonte (post, vídeo ou arte).
// Texto que depende de confirmação do cliente é "provisorio": em preview aparece com selo; em produção, não.

/** Frase dita/escrita pela própria academia. Editada só no ritmo; "original" guarda a forma publicada. */
export interface FraseReal {
  readonly real: true;
  readonly texto: string;
  readonly fonte: string;
  readonly original?: string;
}

/** Texto que só pode ir para produção depois de confirmado por escrito. */
export interface TextoProvisorio {
  readonly provisorio: true;
  readonly texto: string;
  readonly motivo: string;
}

export type Texto = string | FraseReal | TextoProvisorio;

export interface Meta {
  /** ≤ 60 caracteres, com "academia em Lages" */
  readonly title: string;
  /** ≤ 155 caracteres, com "academia em Lages" e o bairro (Frei Rogério) */
  readonly description: string;
}

export interface Pagina {
  readonly rota: string;
  readonly meta: Meta;
  /** parágrafo-resposta no topo: o quê + onde + como (2–3 frases) */
  readonly resposta: string;
}

export const fraseReal = (texto: string, fonte: string, original?: string): FraseReal =>
  original === undefined ? { real: true, texto, fonte } : { real: true, texto, fonte, original };

export const provisorio = (texto: string, motivo: string): TextoProvisorio => ({
  provisorio: true,
  texto,
  motivo,
});

/** Texto corrido de qualquer Texto. */
export const txt = (t: Texto): string => (typeof t === 'string' ? t : t.texto);
