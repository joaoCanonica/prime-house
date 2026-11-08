// Links do WhatsApp com mensagem pronta por contexto (ação principal do site).
// Todo CTA do site passa por linkWhatsApp(); o quiz e a escolha de plano montam o texto com as funções abaixo.
// Roda no build e no navegador (quiz, escolha de plano): sem dependências além do número confirmado.
import { contato } from '../config/contato.ts';

/** Sem ponto final: as mensagens compostas juntam frases. */
const semPonto = (s: string) => s.trim().replace(/[.;:!?…]+$/, '');

export const periodos = {
  manha: 'de manhã',
  tarde: 'à tarde',
  noite: 'à noite',
} as const;
export type Periodo = keyof typeof periodos;

export const mensagens = {
  geral: 'Olá! Vim pelo site da Prime House e quero conhecer a academia.',
  plano: (plano: string) => `Olá! Vim pelo site e quero saber sobre o ${plano}.`,
  escolherPlano: 'Olá! Vim pelo site e quero ajuda para escolher um plano.',
  avaliacao: 'Olá! Vim pelo site e quero agendar minha avaliação funcional.',
  adaptado: (motivo: string) =>
    `Olá! Vim pelo site. Quero treinar com acompanhamento para ${motivo}.`,
  zona: (zona: string) => `Olá! Vi a ${zona} no tour do site e quero conhecer de perto.`,
  trabalhe: 'Olá! Vim pelo site e quero saber sobre vagas na Prime House.',
  maquinario: 'Olá! Vi o maquinário no site e quero conhecer a academia.',
  equipe: 'Olá! Vim pelo site e quero conhecer a equipe da Prime House.',
  duvida: 'Olá! Vim pelo site e tenho uma dúvida sobre a Prime House.',
} as const;

/** Quiz "5 sinais": a avaliação funcional + os sinais marcados (nada é guardado). */
export function mensagemQuiz(sinais: readonly string[]): string {
  const s = sinais.map(semPonto).filter(Boolean);
  return s.length
    ? `${mensagens.avaliacao} Me identifiquei com: ${s.join('; ')}.`
    : mensagens.avaliacao;
}

/** Escolha de plano: plano (ou "ainda não sei") + período preferido, se marcado. */
export function mensagemEscolhaPlano(plano: string | null, periodo: Periodo | null): string {
  const base = plano ? mensagens.plano(plano) : mensagens.escolherPlano;
  return periodo ? `${base} Prefiro treinar ${periodos[periodo]}.` : base;
}

const NUMERO_VALIDO = /^55\d{10,11}$/;

export function linkWhatsApp(
  texto: string,
  numero: string | null = contato.whatsapp.valor,
): string {
  if (!numero || !NUMERO_VALIDO.test(numero)) {
    throw new Error(`WhatsApp ausente ou inválido: "${numero ?? ''}"`);
  }
  const t = texto.trim();
  return t ? `https://wa.me/${numero}?text=${encodeURIComponent(t)}` : `https://wa.me/${numero}`;
}
