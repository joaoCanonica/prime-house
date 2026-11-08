// /privacidade: LGPD simples. Medição e consentimento definidos na sessão 7 (docs/FUNIL.md); controlador pendente.
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
        'Quando você toca em “Falar com a equipe”, o WhatsApp abre com uma mensagem pronta. Você decide se envia. A conversa segue as regras do WhatsApp e é atendida pela equipe da academia.',
    },
    {
      titulo: 'Mapas e vídeos de terceiros',
      texto:
        'O mapa 3D desenhado é feito pelo próprio site. O mapa real em 3D usa os mapas do OpenFreeMap (dados do OpenStreetMap), sem cookies: ele só carrega quando você toca em “Mapa real”, ou sozinho se você aceitou os serviços de terceiros. Nessa hora, o OpenFreeMap recebe o endereço IP do seu aparelho, como acontece com qualquer site. Os botões Google Maps, Waze e Apple Mapas abrem os aplicativos deles. Você muda sua escolha a qualquer momento em “Preferências de cookies”, no rodapé.',
    },
    {
      titulo: 'Medição de visitas',
      texto: provisorio(
        'O site conta visitas e cliques (por exemplo, em “Falar com a equipe” ou no tour 3D) de forma agregada, sem cookies e sem identificar você, com o Plausible, pelo próprio endereço do site. Se o seu navegador pede para não ser rastreado (Global Privacy Control ou Do Not Track), nada é contado.',
        'medição só liga quando o domínio do site e a conta do Plausible forem definidos',
      ),
    },
    {
      titulo: 'Seus direitos',
      texto:
        'Você pode pedir informações, correção ou exclusão dos seus dados tratados pela academia, conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).',
    },
    {
      titulo: 'Quem é o responsável',
      texto:
        'Prime House Academia, CNPJ 64.525.617/0001-03, Av. Duque de Caxias, 1253, Frei Rogério, Lages/SC. Para pedidos sobre os seus dados, fale com a academia pelo WhatsApp (49) 99804-3861.',
    },
  ],
  atualizado: '2026-11-08',
} as const;
