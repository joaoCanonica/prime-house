// /privacidade: LGPD simples. Provisório até a sessão 7 (funil e LGPD) e os dados do controlador.
import { provisorio } from './tipos.ts';

export const privacidade = {
  rota: '/privacidade',
  meta: {
    title: 'Privacidade · Prime House, academia em Lages',
    description:
      'Como o site da Prime House, academia em Lages no Frei Rogério, trata seus dados: sem formulários, contato pelo WhatsApp e mapas só se você pedir.',
  },
  resposta:
    'O site da Prime House Academia, academia em Lages/SC na Av. Duque de Caxias, 1253, no Frei Rogério, não tem formulário e não pede seus dados. O contato acontece pelo WhatsApp, por sua iniciativa.',
  titulo: 'Privacidade',
  secoes: [
    {
      titulo: 'O que o site coleta',
      texto: 'Nada que identifique você. O site não tem formulário, cadastro nem login.',
    },
    {
      titulo: 'WhatsApp',
      texto:
        'Quando você toca em "Falar com a equipe", o WhatsApp abre com uma mensagem pronta. Você decide se envia. A conversa segue as regras do WhatsApp e é atendida pela equipe da academia.',
    },
    {
      titulo: 'Mapas e vídeos de terceiros',
      texto:
        'O mapa interativo do Google só carrega se você clicar. Antes disso, nenhum dado vai para o Google.',
    },
    {
      titulo: 'Medição de visitas',
      texto: provisorio(
        'Se o site passar a medir visitas, será de forma agregada, sem identificar você, e esta página será atualizada.',
        'decisão de analytics e cookies: sessão 7',
      ),
    },
    {
      titulo: 'Seus direitos',
      texto:
        'Você pode pedir informações, correção ou exclusão dos seus dados tratados pela academia, conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).',
    },
    {
      titulo: 'Quem é o responsável',
      texto: provisorio(
        'Prime House Academia · razão social, CNPJ e contato do encarregado em breve.',
        'razão social, CNPJ e encarregado (DPO): pendentes',
      ),
    },
  ],
  atualizado: '2026-11-06',
} as const;
