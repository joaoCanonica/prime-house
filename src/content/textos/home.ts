// Textos da home, na ordem do Prompt 6A. Frases reais com fonte; o resto é texto do site (voz da marca).
import { F } from './fontes.ts';
import { fraseReal, provisorio } from './tipos.ts';

export const home = {
  rota: '/',
  meta: {
    title: 'Prime House Academia · academia em Lages, Frei Rogério',
    description:
      'Academia em Lages no Frei Rogério: musculação em trânsito livre, 100% Cimerian, das 5h à meia-noite em dias úteis. Fale com a equipe pelo WhatsApp.',
  },
  resposta:
    'A Prime House Academia é uma academia de musculação de trânsito livre na Av. Duque de Caxias, 1253, bairro Frei Rogério, em Lages/SC. Abre de segunda a sexta das 5h à meia-noite, é 100% equipada com máquinas Cimerian e oferece avaliação funcional, treino individual e acompanhamento de fisioterapeuta.',

  hero: {
    rotulo: 'Musculação · Trânsito livre · Lages',
    /** a palavra entre * vai em itálico serifado */
    titulo: provisorio(
      'O novo *padrão* de treino em Lages.',
      'H1 provisório (sessão 4); baseado em "Um novo padrão de academia em Lages."',
    ),
    tituloFonte: fraseReal(
      'Um novo padrão de academia em Lages.',
      F.bio,
      'Novo padrão de academia em Lages',
    ),
    apoio:
      '100% maquinário Cimerian, atendimento de verdade e um espaço pensado para você querer voltar amanhã.',
  },

  manifesto: {
    /** duas linhas; a palavra entre * vai em itálico */
    frase: fraseReal(
      'O treino já é pesado. / O *ambiente* não deve ser.',
      F.frasesMarca,
      'O treino já é pesado, o ambiente NÃO DEVE ser!',
    ),
    apoio: fraseReal(
      'Cada detalhe foi pensado para você querer voltar amanhã.',
      F.frasesMarca,
      'Cada detalhe foi PENSADO para você querer voltar amanhã.',
    ),
  },

  porQue: {
    rotulo: 'Por que é diferente',
    titulo: fraseReal(
      'Aqui você tem *nome* e história.',
      `${F.frasesMarca} · só a segunda metade da frase: a primeira compara com outras academias (seção 8)`,
    ),
    itens: [
      {
        titulo: 'Sem esperar a vez',
        texto:
          'Trânsito livre e cinco máquinas de puxada alta. A sala foi montada para você treinar no seu tempo, sem fila de aparelho.',
        fonte: `${F.puxadas} · ${F.transito}`,
      },
      {
        titulo: 'Gente que sabe seu nome',
        texto:
          'Avaliação funcional na entrada, treino individual no app e professores na sala, em desenvolvimento contínuo.',
        fonte: `${F.avaliacaoFuncional} · ${F.professores}`,
      },
      {
        titulo: '100% Cimerian',
        texto: 'Todo o maquinário é Cimerian, marca nacional de máquinas de musculação.',
        fonte: F.cimerian100,
      },
      {
        titulo: 'No seu horário',
        texto: fraseReal(
          'Sua rotina não precisa se adaptar à academia. A academia precisa se adaptar à sua rotina.',
          F.frasesMarca,
        ),
        complemento: 'Das 5h à meia-noite, de segunda a sexta.',
        fonte: F.horario,
      },
    ],
  },

  numeros: {
    rotulo: 'Em números',
    itens: [
      { valor: '5', legenda: 'máquinas de puxada alta', fonte: F.puxadas },
      { valor: '100%', legenda: 'maquinário Cimerian', fonte: F.cimerian100 },
      { valor: '5h–0h', legenda: 'de segunda a sexta', fonte: F.horario },
      {
        valor: '14',
        unidade: 'dias',
        legenda: 'de garantia',
        fonte: `${F.beneficiosLucas} · confirmado pelo João (08/11/2026)`,
      },
    ],
  },

  acompanhamento: {
    rotulo: 'Acompanhamento de verdade',
    titulo: fraseReal(
      'Uma ficha é importante. Mas o *acompanhamento* também.',
      F.vozJoao,
      'Uma ficha é importante, mas o acompanhamento também.',
    ),
    quiz: {
      titulo: fraseReal(
        'Sinais de que seu treino precisa de mais atenção',
        `${F.cincoSinais} · o título original é "5 sinais"; o material baixado tem 4 (ver pendências)`,
        '5 sinais de que seu treino precisa de mais atenção',
      ),
      instrucao: 'Marque o que acontece com você. Nada do que você marca é guardado.',
      sinais: [
        fraseReal(
          'Você aumenta a carga sem ter certeza de que consegue manter a técnica.',
          `${F.cincoSinais} · arte 29`,
        ),
        fraseReal(
          'Seu treino nunca muda, mesmo quando seus objetivos e sua capacidade evoluem.',
          `${F.cincoSinais} · arte 30`,
        ),
        fraseReal(
          'Você termina a sessão sem entender o que está tentando desenvolver.',
          `${F.cincoSinais} · arte 33`,
        ),
        fraseReal(
          'Você faz os exercícios, mas não sabe se está executando corretamente.',
          `${F.cincoSinais} · arte 34`,
        ),
      ],
      resultadoNenhum:
        'Bom sinal. Mesmo assim, uma avaliação funcional mostra onde dá para evoluir.',
      resultadoAlgum: fraseReal(
        'Treinar com orientação faz diferença. Seu treino precisa acompanhar você, e não o contrário.',
        `${F.cincoSinais} · arte 32`,
      ),
      botao: 'Agendar avaliação funcional',
    },
  },

  paraTodoCorpo: {
    rotulo: 'Para todo corpo',
    titulo: fraseReal('O cuidado com você não tem *idade*.', `${F.nuncaETarde} · arte 27`),
    intro: fraseReal(
      'Na Prime House, cada pessoa tem sua história, seu ritmo e seus objetivos.',
      `${F.nuncaETarde} · arte 22`,
    ),
    colunas: [
      {
        titulo: 'Começando agora',
        textos: [
          fraseReal('Aqui, você não precisa chegar pronto. Só precisa chegar.', F.frasesMarca),
          fraseReal(
            'Você não precisa acompanhar o ritmo de ninguém. Precisa respeitar o seu e continuar evoluindo.',
            `${F.nuncaETarde} · arte 25`,
          ),
        ],
      },
      {
        titulo: '+40 e idosos',
        textos: [
          fraseReal(
            'Treinar equilíbrio e força também contribui para mais segurança nas atividades do dia a dia.',
            `${F.nuncaETarde} · arte 23`,
          ),
          fraseReal(
            'Envelhecer faz parte da vida. Perder sua independência não precisa fazer parte dos seus planos.',
            `${F.nuncaETarde} · arte 24`,
          ),
        ],
      },
      {
        titulo: 'Treino adaptado',
        textos: [
          'Treino orientado e adaptado, com acompanhamento de fisioterapeuta, para quem convive com artrose, está no pós-AVC, tem lipedema ou está gestante.',
          'Conte sua história para a equipe antes de começar.',
        ],
        fonte: `${F.adaptado} · ${F.fisioterapeuta}`,
      },
    ],
    fecho: fraseReal(
      'Aqui, a gente não cuida só de corpos. A gente cuida de pessoas.',
      F.frasesMarca,
    ),
  },

  conforto: {
    rotulo: 'Conforto',
    titulo: fraseReal(
      'Tem lugar que a gente vai para treinar. E tem lugar que dá *vontade* de voltar no dia seguinte.',
      F.frasesMarca,
      'Tem lugar que a gente vai pra treinar. E tem lugar que dá vontade de voltar no dia seguinte.',
    ),
    itens: [
      {
        id: 'cafe',
        titulo: 'Café',
        legenda: 'Para antes ou depois do treino.',
        midia: 'conforto-cafe',
        fonte: F.diferenciais,
      },
      {
        id: 'lanches',
        titulo: 'Lanches',
        legenda: 'Para quando a fome aparece no meio do dia.',
        midia: 'conforto-lanches',
        fonte: F.diferenciais,
      },
      {
        id: 'geladeira',
        titulo: 'Geladeira',
        legenda: 'Bebidas geladas à mão.',
        midia: 'conforto-geladeira',
        fonte: F.diferenciais,
      },
      {
        id: 'banheiro',
        titulo: 'Banheiro completo',
        legenda: 'Banheiro e vestiário completos.',
        midia: 'conforto-banheiro',
        fonte: `${F.diferenciais} · ${F.googleBanheiro}`,
      },
      {
        id: 'climatizacao',
        titulo: 'Climatização',
        legenda: 'A sala inteira climatizada.',
        midia: null,
        fonte: F.climatizacao,
      },
      {
        id: 'esteira',
        titulo: 'Esteira com TV',
        legenda: 'YouTube, Netflix, Disney+, Prime Video e Spotify na tela.',
        midia: 'conforto-esteira-tv',
        fonte: F.esteiraTv,
      },
      {
        id: 'kids',
        titulo: 'Espaço kids',
        legenda: 'Um canto para as crianças enquanto você treina.',
        midia: 'conforto-espaco-kids',
        fonte: F.diferenciais,
      },
      {
        id: 'app',
        titulo: 'Treino no app',
        legenda: 'Seu treino individual na palma da mão.',
        midia: 'conforto-treino-app',
        fonte: F.diferenciais,
      },
    ],
  },

  planos: {
    rotulo: 'Planos',
    titulo: 'Três jeitos de treinar *aqui*.',
    intro: 'Os planos não têm preço no site: as condições mudam e quem explica é a equipe.',
    chamada: 'Fale com a equipe e conheça as condições.',
  },

  prova: {
    rotulo: 'O que dizem',
    titulo: 'Avaliações no Google, *com* as palavras de quem treina.',
    avaliacoes: ['g-001', 'g-002', 'g-004'],
    selo: 'Avaliação no Google',
    botao: 'Avaliar no Google',
  },

  historia: {
    rotulo: 'A história',
    titulo: fraseReal(
      'Uma nova academia. Uma nova *história* na musculação.',
      F.anuncio,
      'UMA NOVA ACADEMIA. UMA NOVA HISTÓRIA NA MUSCULAÇÃO. LAGES-SC',
    ),
    intro:
      'A Prime House é do Lucas Moro, treinador da LM Team. Da primeira parede à inauguração, foi quase um ano de obra e de montagem.',
    origem: fraseReal(
      'Tudo nasceu a partir de um propósito.',
      `${F.frasesMarca} · só o início da frase (o resto compara com outras academias, seção 8)`,
    ),
    marcos: [
      {
        data: '2025-05-26',
        rotulo: 'mai 2025',
        titulo: 'O anúncio',
        texto: 'Lucas Moro apresenta a nova academia em Lages.',
        fonte: F.anuncio,
      },
      {
        data: '2025-06-09',
        rotulo: 'jun 2025',
        titulo: 'A obra',
        texto: fraseReal('As obras estão começando.', F.obras),
        fonte: F.obras,
      },
      {
        data: '2026-03-14',
        rotulo: 'mar 2026',
        titulo: 'As máquinas',
        texto: 'Chegam as máquinas Cimerian.',
        fonte: F.maquinasChegam,
      },
      {
        data: '2026-03-18',
        rotulo: 'mar 2026',
        titulo: 'A montagem',
        texto: fraseReal('O dia mais esperado chegou.', F.montagem),
        fonte: F.montagem,
      },
      {
        data: '2026-04-30',
        rotulo: '30 abr 2026',
        titulo: 'A inauguração',
        texto: fraseReal(
          'Um espaço pensado nos mínimos detalhes para oferecer elegância, conforto e experiências inesquecíveis.',
          F.inauguracaoLegenda,
        ),
        fonte: F.inauguracao,
      },
    ],
  },

  visite: {
    rotulo: 'Visite',
    titulo: 'Venha *conhecer*.',
    texto: 'Av. Duque de Caxias, 1253, no Frei Rogério. Chame a equipe e combine sua visita.',
    fecho: fraseReal(
      'Chame a equipe e venha para a Prime House.',
      F.beneficiosLucas,
      'Chama a equipe e vem pra Prime House.',
    ),
  },
} as const;
