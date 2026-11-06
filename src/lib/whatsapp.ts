// Links do WhatsApp com mensagem pronta por contexto (ação principal do site).
import { contato } from '../config/contato.ts';

export const mensagens = {
  geral: 'Olá! Vim pelo site da Prime House e quero conhecer a academia.',
  plano: (plano: string) => `Olá! Vim pelo site e quero saber sobre o ${plano}.`,
  avaliacao: 'Olá! Vim pelo site e quero agendar minha avaliação funcional.',
  adaptado: (motivo: string) =>
    `Olá! Vim pelo site. Quero treinar com acompanhamento para ${motivo}.`,
  zona: (zona: string) => `Olá! Vi a ${zona} no tour do site e quero conhecer de perto.`,
  trabalhe: 'Olá! Vim pelo site e quero saber sobre vagas na Prime House.',
} as const;

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
