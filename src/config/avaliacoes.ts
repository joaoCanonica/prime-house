// Avaliações do Google (docs/dados/avaliacoes-google.json). Citação literal, primeiro nome + inicial.
// Nunca em JSON-LD (AggregateRating autosservido). Nota só com volume (meta 50+).
import dados from '../../docs/dados/avaliacoes-google.json' with { type: 'json' };

export interface Avaliacao {
  readonly id: string;
  readonly autor: string;
  readonly nota: number;
  readonly texto: string;
  readonly mesAprox: string;
  readonly plataforma: 'Google';
  readonly url: string;
}

export const TEXTO_MINIMO = 8;
export const NOTA_MINIMA = 4;

export const avaliacoes = {
  exibirNota: false,
  nota: dados.resumo.nota,
  total: dados.resumo.total,
  coletadoEm: dados.fonte.coletadoEm,
  urlFicha: dados.fonte.urlFicha,
  selecionadas: dados.avaliacoes
    .filter(
      (a): a is typeof a & { texto: string } =>
        typeof a.texto === 'string' &&
        a.texto.trim().length >= TEXTO_MINIMO &&
        a.nota >= NOTA_MINIMA,
    )
    .map((a): Avaliacao => ({
      id: a.id,
      autor: a.autorExibicao,
      nota: a.nota,
      texto: a.texto,
      mesAprox: a.mesAprox,
      plataforma: 'Google',
      url: dados.fonte.urlFicha,
    })),
} as const;
