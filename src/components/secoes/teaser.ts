export {};
// Teaser do tour 3D: decide se pode carregar sozinho (nunca em Save-Data/2g) e chama a ilha da sessão 6B.
interface Tour3d {
  carregar: (alvo: HTMLElement, zona?: string) => Promise<void>;
}
interface Conexao {
  saveData?: boolean;
  effectiveType?: string;
}
declare global {
  interface Window {
    __phTour3d?: Tour3d;
  }
}

/** Economia de dados: em Save-Data ou 2g o 3D nunca carrega sozinho. */
export function podeCarregarSozinho(): boolean {
  const c = (navigator as Navigator & { connection?: Conexao }).connection;
  if (!c) return true;
  if (c.saveData) return false;
  return !/(^|-)2g$/.test(c.effectiveType ?? '');
}

for (const palco of document.querySelectorAll<HTMLElement>('[data-tour3d]')) {
  const botao = palco.querySelector<HTMLButtonElement>('[data-tour3d-carregar]');
  const alvo = palco.querySelector<HTMLElement>('[data-tour3d-alvo]');
  const aviso = palco.querySelector<HTMLElement>('[data-tour3d-aviso]');
  palco.dataset['economia'] = podeCarregarSozinho() ? 'nao' : 'sim';
  botao?.addEventListener('click', async () => {
    if (!alvo) return;
    const tour = window.__phTour3d;
    if (!tour) {
      if (aviso) {
        aviso.textContent =
          'O tour 3D entra na próxima etapa. Enquanto isso, abra o tour completo.';
        aviso.hidden = false;
      }
      return;
    }
    botao.disabled = true;
    await tour.carregar(alvo);
  });
}
