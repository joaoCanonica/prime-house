import { describe, expect, it } from 'vitest';
import {
  linkWhatsApp,
  mensagemEscolhaPlano,
  mensagemQuiz,
  mensagens,
} from '../src/lib/whatsapp.ts';

const texto = (link: string) => decodeURIComponent(new URL(link).searchParams.get('text') ?? '');

describe('WhatsApp', () => {
  it('número da academia', () => {
    expect(linkWhatsApp(mensagens.geral).startsWith('https://wa.me/5549998043861?text=')).toBe(
      true,
    );
  });
  it('mensagens prontas', () => {
    expect(texto(linkWhatsApp(mensagens.geral))).toBe(
      'Olá! Vim pelo site da Prime House e quero conhecer a academia.',
    );
    expect(texto(linkWhatsApp(mensagens.plano('Plano Select')))).toBe(
      'Olá! Vim pelo site e quero saber sobre o Plano Select.',
    );
    expect(texto(linkWhatsApp(mensagens.avaliacao))).toBe(
      'Olá! Vim pelo site e quero agendar minha avaliação funcional.',
    );
    expect(texto(linkWhatsApp(mensagens.adaptado('voltar a treinar depois dos 60')))).toBe(
      'Olá! Vim pelo site. Quero treinar com acompanhamento para voltar a treinar depois dos 60.',
    );
    expect(texto(linkWhatsApp(mensagens.zona('sala de musculação')))).toBe(
      'Olá! Vi a sala de musculação no tour do site e quero conhecer de perto.',
    );
    expect(texto(linkWhatsApp(mensagens.trabalhe))).toBe(
      'Olá! Vim pelo site e quero saber sobre vagas na Prime House.',
    );
  });
  it('codifica acentos, espaços e "!"', () => {
    const l = linkWhatsApp('Olá! & ?');
    expect(l).toBe('https://wa.me/5549998043861?text=Ol%C3%A1!%20%26%20%3F');
  });
  it('sem texto vira link simples', () => {
    expect(linkWhatsApp('  ')).toBe('https://wa.me/5549998043861');
  });
  it('número ausente ou inválido derruba', () => {
    expect(() => linkWhatsApp('oi', null)).toThrow(/WhatsApp ausente/);
    expect(() => linkWhatsApp('oi', '49998043861')).toThrow();
  });
  it('quiz: lista os sinais marcados, sem ponto duplo', () => {
    expect(mensagemQuiz([])).toBe(mensagens.avaliacao);
    expect(mensagemQuiz(['Sinal um.', 'Sinal dois'])).toBe(
      'Olá! Vim pelo site e quero agendar minha avaliação funcional. Me identifiquei com: Sinal um; Sinal dois.',
    );
  });
  it('escolha de plano: plano, "ainda não sei" e período', () => {
    expect(mensagemEscolhaPlano('Plano Duo', 'noite')).toBe(
      'Olá! Vim pelo site e quero saber sobre o Plano Duo. Prefiro treinar à noite.',
    );
    expect(mensagemEscolhaPlano(null, null)).toBe(
      'Olá! Vim pelo site e quero ajuda para escolher um plano.',
    );
    expect(mensagemEscolhaPlano('Plano Prime', null)).toBe(mensagens.plano('Plano Prime'));
  });
  it('só src/lib/whatsapp.ts monta link wa.me', async () => {
    const { readdirSync, readFileSync, statSync } = await import('node:fs');
    const { join } = await import('node:path');
    const fora: string[] = [];
    const andar = (d: string) => {
      for (const n of readdirSync(d)) {
        const c = join(d, n);
        if (statSync(c).isDirectory()) andar(c);
        else if (/\.(ts|astro|mjs)$/.test(n) && /wa\.me\//.test(readFileSync(c, 'utf8')))
          fora.push(c);
      }
    };
    andar('src');
    expect(fora.map((f) => f.replaceAll('\\', '/'))).toEqual(['src/lib/whatsapp.ts']);
  });
});
