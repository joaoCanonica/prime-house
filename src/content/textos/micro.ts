// Microtextos: botões, mensagens do WhatsApp por contexto, alt das imagens, descrição dos vídeos e rodapé.
import { mensagemEscolhaPlano, mensagemQuiz, mensagens } from '../../lib/whatsapp.ts';

export const botoes = {
  falarComEquipe: 'Falar com a equipe',
  fazerTour: 'Fazer o tour',
  abrirTour: 'Abrir o tour completo',
  carregarTour3d: 'Carregar o tour 3D',
  verDeVerdade: 'Ver de verdade',
  agendarAvaliacao: 'Agendar avaliação funcional',
  comoChegar: 'Como chegar',
  instagram: 'Instagram',
  avaliarGoogle: 'Avaliar no Google',
  pular: 'Pular abertura',
  pausarVideo: 'Pausar vídeo',
  tocarVideo: 'Tocar vídeo',
  copiarEndereco: 'Copiar endereço',
  voltarInicio: 'Ir para o início',
  menu: 'Menu',
  fechar: 'Fechar',
} as const;

/** Banner de consentimento (LGPD) e preferência no rodapé. */
export const consentimento = {
  rotulo: 'Privacidade',
  texto:
    'Medimos as visitas sem cookies e sem identificar você. Se você aceitar, o mapa real em 3D (OpenFreeMap, sem cookies) já abre carregado; se recusar, ele só carrega quando você pedir.',
  motivoMapa:
    'O mapa real em 3D vem do OpenFreeMap, sem cookies. Aceite para que ele abra sozinho.',
  aceitar: 'Aceitar',
  recusar: 'Recusar',
  saibaMais: 'Saiba mais',
  preferencias: 'Preferências de cookies',
  estado: { aceito: 'aceitos', recusado: 'recusados', nenhum: 'sem escolha' },
} as const;

/** Mensagens prontas do WhatsApp por contexto (as funções vêm de src/lib/whatsapp.ts). */
export const whatsapp = {
  geral: mensagens.geral,
  planoPrime: mensagens.plano('Plano Prime'),
  planoSelect: mensagens.plano('Plano Select'),
  planoDuo: mensagens.plano('Plano Duo'),
  avaliacao: mensagens.avaliacao,
  /** quiz da home: lista os sinais marcados */
  avaliacaoComSinais: mensagemQuiz,
  /** escolha de plano (/planos): plano e período */
  escolhaPlano: mensagemEscolhaPlano,
  escolherPlano: mensagens.escolherPlano,
  adaptado: {
    mais40: mensagens.adaptado('voltar a treinar depois dos 40'),
    idosos: mensagens.adaptado('treinar com segurança na terceira idade'),
    artrose: mensagens.adaptado('quem tem artrose'),
    posAvc: mensagens.adaptado('o pós-AVC'),
    lipedema: mensagens.adaptado('quem tem lipedema'),
    gestante: mensagens.adaptado('a gestação'),
  },
  zona: (nomeNoTour: string) => mensagens.zona(nomeNoTour),
  trabalhe: mensagens.trabalhe,
  maquinario: mensagens.maquinario,
  equipe: mensagens.equipe,
  duvida: mensagens.duvida,
  visita: 'Olá! Vim pelo site e quero marcar uma visita à Prime House.',
  convenio: 'Olá! Vim pelo site e quero saber como funciona o convênio Estar Bem.',
} as const;

/** Texto alternativo de cada imagem publicável (id do media.manifest.json). */
export const alt = {
  'captura-01': 'Sala de musculação ampla, com máquinas plate-loaded e molduras de LED no teto',
  'captura-02': 'Suporte de halteres cromados diante do espelho, sobre piso emborrachado',
  'captura-03':
    'Letreiro da fachada: PRIME HOUSE em branco e ACADEMIA em laranja, sobre chapa metálica escura',
  'captura-04': 'Rack de agachamento com a estrutura preta Cimerian',
  'captura-05': 'Crossover Cimerian sob uma moldura de LED do teto',
  'captura-06': 'Sala à noite, com molduras de LED hexagonais no teto e telas nas colunas',
  'captura-07': 'Fileiras de molduras de LED retangulares no teto, sobre as máquinas pretas',
  'captura-08': 'Anilhas e máquinas diante das janelas altas da sala',
  'captura-09': 'Máquina Cimerian em primeiro plano e as janelas da sala à noite',
  'captura-10': 'Vista da sala de musculação com máquinas Cimerian e molduras de luz no teto',
  'captura-11': 'Máquinas Cimerian alinhadas sob as luzes do teto',
  'captura-12': 'Sala ampla com bancos, máquinas e as molduras de LED acesas',
  'captura-13': 'Bancos de treino e máquinas sob as molduras de luz do teto',
  'conforto-banheiro': 'Bancada do banheiro com pia, secador e cesta de produtos de higiene',
  'conforto-geladeira': 'Geladeira aberta com bebidas e garrafas de água',
  'conforto-lanches': 'Bandeja de pães de queijo e salgados assados',
  'conforto-treino-app': 'Mão segurando um tablet com a lista de exercícios do treino no app',
  'conforto-cafe': 'Máquina de café da academia',
  'conforto-esteira-tv': 'Tela da esteira com os aplicativos de vídeo e música',
  'conforto-parede-logo':
    'Parede ripada com o logo PRIME HOUSE ACADEMIA em letras cromadas e laranja',
  'conforto-espaco-kids': 'Espaço kids com brinquedos, lápis de cor e jogos sobre a mesa',
  'still-letreiro-aceso': 'Letreiro PRIME HOUSE ACADEMIA aceso à noite, visto de baixo',
  'still-maquina-cimerian': 'Detalhe do logo Cimerian na estrutura de uma máquina',
  'still-anilha': 'Anilha preta encaixada na barra, em close',
  'still-halteres': 'Fileira de halteres cromados no suporte',
  'still-interior': 'Sala de musculação à noite, com máquinas Cimerian sob as luzes do teto',
  'still-drone-noite': 'Fachada da Prime House vista do alto, à noite, com o letreiro aceso',
  'still-fachada-dia': 'Fachada preta da Prime House de dia, com o nome em letras grandes',
  'cardio-esteiras': 'Dois alunos caminhando nas esteiras com tela, sob as linhas de LED do teto',
  'fisioterapeuta-aluna':
    'A fisioterapeuta orienta, sorrindo, uma aluna sentada numa máquina Cimerian',
  'treino-aluna-maquina': 'Aluna apoiada no banco de uma máquina Cimerian durante a série',
  'treino-aluna-professor':
    'Professor de camiseta laranja acompanha uma aluna diante das janelas, à noite',
  'treino-legpress-professora':
    'Aluna no leg press enquanto a professora de laranja acompanha ao lado',
  'treino-professor-alongamento':
    'Professor ajusta a máquina para uma aluna deitada, com as janelas ao fundo',
  'treino-professor-orientando':
    'Professor de laranja anota o treino ao lado de um aluno na máquina',
  'treino-puxada-professora': 'Aluna na puxada Cimerian, com a professora corrigindo a postura',
} as const;

/** Descrição de cada vídeo publicável (os vídeos são mudos). */
export const videos = {
  'letreiro-aceso': 'O letreiro da Prime House acende na noite da inauguração.',
  'interior-noite':
    'A sala de musculação à noite: máquinas Cimerian, janelas altas e as molduras de LED do teto.',
  'drone-entardecer': 'Vista aérea da fachada da Prime House ao entardecer.',
  'drone-noite':
    'Vista aérea noturna da fachada da Prime House, com o letreiro aceso e o público da inauguração na calçada.',
  'fachada-dia': 'A fachada da Prime House de dia, na Av. Duque de Caxias.',
  'lucas-close': 'Lucas Moro, fundador da Prime House, fala na inauguração (em preto e branco).',
  'avaliacao-funcional': 'Lucas Moro explica a avaliação funcional e o treino individual.',
  acompanhamento: 'Um professor ajusta a máquina e acompanha o aluno durante a série.',
  'rotina-professor': 'Um professor acompanha o aluno no leg press, diante das janelas.',
  'rotina-hack': 'Aluno treina na máquina hack Cimerian enquanto o professor observa.',
  'rotina-legpress': 'Aluna faz leg press Cimerian diante das janelas da sala.',
  'rotina-agachamento': 'Aluna faz agachamento búlgaro no smith, diante das janelas.',
  'rotina-ombro': 'Aluno treina ombro numa máquina Cimerian.',
  equipe: 'A equipe da Prime House, de camiseta laranja, comemora na sala de musculação.',
  'plano-select':
    'Uma professora apresenta o Plano Select, com legenda queimada no vídeo; o vídeo é mudo.',
  'filme-inauguracao': 'Trechos da noite de inauguração da Prime House.',
  'lucas-discurso': 'Lucas Moro discursa na inauguração, em preto e branco.',
} as const;

/** Legenda em HTML da fala do vídeo de avaliação funcional (o vídeo é mudo; trecho comparativo omitido, seção 8). */
export const legendas = {
  'avaliacao-funcional':
    'Aqui na Prime House, você passa por uma avaliação funcional junto com o professor pra entender toda a sua situação, todos os seus objetivos, e montar um treino específico pra você. E isso é lógico: cada aluno é diferente, e o seu treino tem que respeitar isso. Vem treinar com a gente.',
} as const;

export const rodape = {
  tagline: 'Aqui você tem nome e história.',
  enderecoTitulo: 'Endereço',
  horarioTitulo: 'Horário',
  contatoTitulo: 'Contato',
  linksTitulo: 'Navegue',
  links: [
    { rotulo: 'A Casa', href: '/a-casa' },
    { rotulo: 'Maquinário', href: '/maquinario' },
    { rotulo: 'Planos', href: '/planos' },
    { rotulo: 'Como funciona', href: '/como-funciona' },
    { rotulo: 'Equipe', href: '/equipe' },
    { rotulo: 'Horários e como chegar', href: '/horarios-e-como-chegar' },
    { rotulo: 'Perguntas frequentes', href: '/perguntas-frequentes' },
    { rotulo: 'Trabalhe conosco', href: '/trabalhe-conosco' },
    { rotulo: 'Privacidade', href: '/privacidade' },
  ],
  horarioResumo: [
    'Seg a sex · 5h às 0h',
    'Sáb · 8h às 18h',
    'Dom e feriados · 9h às 12h e 15h às 18h',
  ],
  /** responsável técnico; o " · CREF {cref}" entra quando o número for informado (marca.ts) */
  responsavelTecnico: 'Responsável técnico: {nome}',
  cref: ' · CREF {cref}',
  cnpj: 'CNPJ {cnpj}',
  direitos: '© 2026 Prime House Academia. Lages/SC.',
} as const;

export const navegacao = {
  pularParaConteudo: 'Pular para o conteúdo',
  principal: 'Navegação principal',
  itens: [
    { rotulo: 'A Casa', href: '/a-casa' },
    { rotulo: 'Maquinário', href: '/maquinario' },
    { rotulo: 'Planos', href: '/planos' },
    { rotulo: 'Como funciona', href: '/como-funciona' },
    { rotulo: 'Horários', href: '/horarios-e-como-chegar' },
  ],
} as const;
