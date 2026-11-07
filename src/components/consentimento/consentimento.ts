// Consentimento (LGPD): só o que usa cookie de terceiros depende dele (hoje: o mapa interativo do Google;
// se um dia houver GA4, ele também). A escolha fica neste navegador (localStorage, 12 meses) e muda no rodapé.
export type Escolha = 'aceito' | 'recusado';

const CHAVE = 'prime-consentimento';
const VERSAO = 1;
const VALIDADE_MS = 365 * 24 * 60 * 60 * 1000;
/** detail = Escolha */
export const MUDOU = 'prime:consentimento';
/** detail = { motivo?: string } */
export const ABRIR = 'prime:preferencias';

let naMemoria: Escolha | null = null; // se o armazenamento estiver bloqueado, vale só nesta página

export function lerConsentimento(): Escolha | null {
  try {
    const v = JSON.parse(localStorage.getItem(CHAVE) ?? 'null') as {
      versao?: number;
      escolha?: string;
      em?: string;
    } | null;
    if (
      v?.versao === VERSAO &&
      (v.escolha === 'aceito' || v.escolha === 'recusado') &&
      Date.now() - Date.parse(v.em ?? '') < VALIDADE_MS
    )
      return v.escolha;
  } catch {
    /* armazenamento bloqueado */
  }
  return naMemoria;
}

export function definirConsentimento(escolha: Escolha): void {
  naMemoria = escolha;
  try {
    localStorage.setItem(
      CHAVE,
      JSON.stringify({ versao: VERSAO, escolha, em: new Date().toISOString() }),
    );
  } catch {
    /* fica só na memória */
  }
  dispatchEvent(new CustomEvent<Escolha>(MUDOU, { detail: escolha }));
}

/** Roda fn agora, se já aceito, ou quando a pessoa aceitar. */
export function aoAceitar(fn: () => void): void {
  if (lerConsentimento() === 'aceito') return fn();
  const ouvir = (e: Event) => {
    if ((e as CustomEvent<Escolha>).detail !== 'aceito') return;
    removeEventListener(MUDOU, ouvir);
    fn();
  };
  addEventListener(MUDOU, ouvir);
}

export function abrirPreferencias(motivo?: string): void {
  dispatchEvent(new CustomEvent(ABRIR, { detail: { motivo } }));
}
