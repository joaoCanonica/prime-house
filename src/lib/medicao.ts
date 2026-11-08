// Medição sem invadir: eventos agregados, sem cookie, sem identificar ninguém (Plausible pelo próprio domínio).
// Nada vai para terceiros: o envio é para medicao.endpoint (mesmo domínio). Sem domínio configurado,
// nada sai do navegador; o evento só é emitido no DOM ("prime:evento"), o que os testes observam.
// Respeita Global Privacy Control e Do Not Track.
import { medicao } from '../config/medicao.ts';

export type Evento =
  | { nome: 'clique_whatsapp'; origem: string; plano?: string; zona?: string }
  | { nome: 'tour_3d_aberto'; zona: string }
  | { nome: 'tour_3d_realismo'; zona: string }
  | { nome: 'clique_como_chegar'; origem: string; destino: 'google' | 'waze' | 'apple' }
  | { nome: 'clique_instagram'; origem: string };

/** emitido depois de medir (detail = { evento, enviado }) */
export const EVENTO_DOM = 'prime:evento';
/** pedido de medição vindo de outra ilha (detail = Evento), sem import cruzado */
export const PEDIDO_DOM = 'prime:medir';

export interface Contexto {
  origem: string;
  plano?: string | undefined;
  zona?: string | undefined;
}

/** Classifica um link clicado. Puro: testado em tests/medicao.test.ts. */
export function classificarLink(href: string, ctx: Contexto): Evento | null {
  let u: URL;
  try {
    u = new URL(href);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./, '');
  if (host === 'wa.me' || host === 'api.whatsapp.com') {
    return {
      nome: 'clique_whatsapp',
      origem: ctx.origem,
      ...(ctx.plano ? { plano: ctx.plano } : {}),
      ...(ctx.zona ? { zona: ctx.zona } : {}),
    };
  }
  if (host === 'instagram.com') return { nome: 'clique_instagram', origem: ctx.origem };
  const destino =
    (host === 'google.com' && u.pathname.startsWith('/maps')) || host === 'maps.google.com'
      ? 'google'
      : host === 'waze.com'
        ? 'waze'
        : host === 'maps.apple.com'
          ? 'apple'
          : null;
  return destino ? { nome: 'clique_como_chegar', origem: ctx.origem, destino } : null;
}

function privacidadePedida(): boolean {
  const n = navigator as Navigator & { globalPrivacyControl?: boolean };
  return n.globalPrivacyControl === true || n.doNotTrack === '1';
}

function enviar(nome: string, props?: Record<string, string>): boolean {
  const dominio = medicao.dominio.valor;
  if (!dominio || privacidadePedida()) return false;
  const corpo = JSON.stringify({
    name: nome,
    url: location.href,
    domain: dominio,
    referrer: document.referrer || null,
    ...(props ? { props } : {}),
  });
  try {
    const blob = new Blob([corpo], { type: 'text/plain' });
    if (navigator.sendBeacon?.(medicao.endpoint, blob)) return true;
    void fetch(medicao.endpoint, { method: 'POST', body: corpo, keepalive: true }).catch(
      () => undefined,
    );
    return true;
  } catch {
    return false;
  }
}

export function medir(evento: Evento): void {
  const { nome, ...props } = evento;
  const enviado = enviar(nome, props as Record<string, string>);
  dispatchEvent(new CustomEvent(EVENTO_DOM, { detail: { evento, enviado } }));
}

function contextoDe(a: HTMLElement): Contexto {
  const dado = (k: string) =>
    a.closest<HTMLElement>(`[data-cta-${k}]`)?.getAttribute(`data-cta-${k}`) || undefined;
  const origem =
    dado('origem') ?? a.closest('section[id]')?.id ?? (a.closest('footer') ? 'rodape' : 'pagina');
  return { origem, plano: dado('plano'), zona: dado('zona') };
}

let iniciada = false;
export function iniciarMedicao(): void {
  if (iniciada) return;
  iniciada = true;
  enviar('pageview');
  // captura: mede mesmo que outro código pare a propagação; não altera a navegação
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href]');
      if (!a) return;
      const evento = classificarLink(a.href, contextoDe(a));
      if (evento) medir(evento);
    },
    { capture: true },
  );
  addEventListener(PEDIDO_DOM, (e) => {
    const evento = (e as CustomEvent<Evento>).detail;
    if (evento?.nome) medir(evento);
  });
}
