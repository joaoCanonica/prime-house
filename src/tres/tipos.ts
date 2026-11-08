// Contratos da ilha 3D (sem dependência de three: usável na página e no teaser).
export type Vetor3 = readonly [number, number, number];

export interface ZonaTour {
  readonly id: string;
  readonly nome: string;
  /** pose vinda da coleção (só quando fonteLayout ≠ "pendente"); senão, a pose do GLB */
  readonly camera: { readonly posicao: Vetor3; readonly alvo: Vetor3 } | null;
}

export interface IndiceModelos {
  readonly versao: string;
  readonly maquete: {
    readonly arquivo: string;
    readonly esquematica: boolean;
    readonly bytes: number;
    readonly zonas: readonly string[];
    readonly poses: readonly string[];
  } | null;
  readonly splats: Readonly<Record<string, { arquivo: string; bytes: number }>>;
}

export interface OpcoesTour {
  readonly alvo: HTMLElement;
  readonly indice: IndiceModelos;
  readonly zonas: readonly ZonaTour[];
  readonly zonaInicial?: string | undefined;
  readonly reduzido: boolean;
  readonly aoSelecionar?: ((id: string) => void) | undefined;
  /** mede fps e mantém o render contínuo (?fps=1) */
  readonly medirFps?: boolean | undefined;
}

export interface Tour {
  irPara(id: string, animar?: boolean): void;
  verDeVerdade(id: string, progresso: (fracao: number) => void, sinal: AbortSignal): Promise<void>;
  sairDoReal(): void;
  destruir(): void;
}

/** Economia de dados e capacidade: decide se o 3D pode carregar sozinho. */
export function podeCarregarSozinho(): boolean {
  const c = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  if (c?.saveData) return false;
  return !/(^|-)2g$/.test(c?.effectiveType ?? '');
}

export function temWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    return false;
  }
}
