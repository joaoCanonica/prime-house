// Estados de um dado do cliente. Nada é inventado: o que falta fica explícito.
//  confirmado → pode ir para produção (com a fonte registrada)
//  opcional   → pode faltar sem travar; some do site quando null
//  bloqueante → falta confirmação: em preview aparece com selo PROVISÓRIO, em produção não aparece
//  aviso      → usável, mas provisório (ex.: laranja medido no avatar); não trava

export interface Confirmado<T> {
  readonly estado: 'confirmado';
  readonly valor: T;
  readonly fonte: string;
}
export interface Opcional<T> {
  readonly estado: 'opcional';
  readonly valor: T | null;
}
export interface Bloqueante<T> {
  readonly estado: 'bloqueante';
  /** valor provisório para o preview (nunca vai para produção) */
  readonly valor: T | null;
  readonly rotulo: string;
}
export interface Aviso<T> {
  readonly estado: 'aviso';
  readonly valor: T;
  readonly motivo: string;
}
export type Valor<T> = Confirmado<T> | Opcional<T> | Bloqueante<T> | Aviso<T>;
export type Estado = Valor<unknown>['estado'];

export const confirmado = <T>(valor: T, fonte: string): Confirmado<T> => ({
  estado: 'confirmado',
  valor,
  fonte,
});
export const opcional = <T = never>(valor: T | null = null): Opcional<T> => ({
  estado: 'opcional',
  valor,
});
export const bloqueante = <T = never>(
  rotulo: string,
  provisorio: T | null = null,
): Bloqueante<T> => ({
  estado: 'bloqueante',
  valor: provisorio,
  rotulo,
});
export const aviso = <T>(valor: T, motivo: string): Aviso<T> => ({
  estado: 'aviso',
  valor,
  motivo,
});

/** Provisório = precisa de selo no preview. */
export const ehProvisorio = (v: Valor<unknown>): boolean =>
  v.estado === 'bloqueante' || v.estado === 'aviso';

/**
 * Valor que pode ser exibido no modo atual.
 * Em produção, bloqueante nunca aparece (null). Em preview, aparece o provisório.
 */
export function exibir<T>(v: Valor<T>, modo: 'preview' | 'producao'): T | null {
  if (v.estado === 'bloqueante') return modo === 'producao' ? null : v.valor;
  return v.valor;
}
