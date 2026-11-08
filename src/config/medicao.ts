// Medição de visitas: Plausible, sem cookie e sem dado pessoal, pelo próprio domínio (proxy no host).
// Decisão e alternativas em docs/FUNIL.md. Também é lido no navegador: só valores públicos aqui.
import { opcional } from './tipos.ts';

export const medicao = {
  ferramenta: 'plausible',
  /** domínio cadastrado no Plausible (o do site). Enquanto for null, nada é enviado. */
  dominio: opcional<string>(),
  /** caminho do próprio site que o host reescreve para https://plausible.io/api/event */
  endpoint: '/m/evento',
} as const;
