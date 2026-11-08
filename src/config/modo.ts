// Modo do build: "preview" (padrão; faixa em revisão, selos PROVISÓRIO, noindex) ou "producao".
// Defina MODO=producao no ambiente para o build final. Só é lido em tempo de build (Node).
export type Modo = 'preview' | 'producao';

export function lerModo(valor: string | undefined): Modo {
  const v = (valor ?? '').trim().toLowerCase();
  return v === 'producao' || v === 'produção' || v === 'production' ? 'producao' : 'preview';
}

export const modoAtual = (): Modo => lerModo(globalThis.process?.env['MODO']);
