// 404: curta, com uma moldura "apagada" que acende no hover e três caminhos.
export const erro404 = {
  rota: '/404',
  meta: {
    title: 'Página não encontrada · Prime House, academia em Lages',
    description:
      'Esta página não existe. Volte para a Prime House, academia em Lages no Frei Rogério, faça o tour pela casa ou fale com a equipe pelo WhatsApp.',
  },
  resposta:
    'Esta página não existe ou mudou de lugar. A Prime House Academia fica na Av. Duque de Caxias, 1253, no Frei Rogério, em Lages/SC.',
  titulo: 'Esta luz está *apagada*.',
  texto: 'A página que você procurou não existe ou mudou de lugar.',
  caminhos: [
    { rotulo: 'Ir para o início', href: '/' },
    { rotulo: 'Fazer o tour', href: '/a-casa' },
    { rotulo: 'Falar com a equipe', href: 'whatsapp' },
  ],
} as const;
