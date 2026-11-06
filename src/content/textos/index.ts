// Todos os textos do site. Fonte de cada frase real em ./fontes.ts; pendências em `pendenciasTexto`.
import { aCasa } from './a-casa.ts';
import { comoFunciona } from './como-funciona.ts';
import { equipe } from './equipe.ts';
import { erro404 } from './erro404.ts';
import { faq } from './faq.ts';
import { home } from './home.ts';
import { horarios } from './horarios.ts';
import { maquinario } from './maquinario.ts';
import { alt, botoes, legendas, navegacao, rodape, videos, whatsapp } from './micro.ts';
import { planos } from './planos.ts';
import { privacidade } from './privacidade.ts';
import { trabalheConosco } from './trabalhe-conosco.ts';

export {
  aCasa,
  alt,
  botoes,
  comoFunciona,
  equipe,
  erro404,
  faq,
  home,
  horarios,
  legendas,
  maquinario,
  navegacao,
  planos,
  privacidade,
  rodape,
  trabalheConosco,
  videos,
  whatsapp,
};
export * from './tipos.ts';

/** Páginas com meta e parágrafo-resposta. */
export const paginas = [
  home,
  aCasa,
  maquinario,
  planos,
  comoFunciona,
  equipe,
  trabalheConosco,
  horarios,
  faq,
  privacidade,
  erro404,
] as const;

/** O que falta para os textos ficarem completos (também em docs/PENDENCIAS.md). */
export const pendenciasTexto = [
  'Carrossel "5 sinais": o material baixado tem só 4 sinais; o quiz usa os 4 e o título não diz "5". Pedir a arte que falta.',
  'H1 da home: provisório ("O novo padrão de treino em Lages."), baseado na bio. João aprova ou troca.',
  'Plano Prime: o que inclui (sem fonte).',
  'Benefícios fixos (garantia de 14 dias, trancamento de 30 dias no anual, Sexta Prime): texto pronto, provisório até confirmação por escrito.',
  'Nutricionista na equipe: sem informação (resposta da FAQ remete à equipe).',
  'Estacionamento e acessibilidade: sem informação.',
  'Feriados municipais de Lages e datas especiais.',
  'Equipe: nomes, fotos, CREF/CREFITO e especialidades, com autorização.',
  'Trabalhe conosco: e-mail para currículos (hoje só WhatsApp).',
  'Maquinário: dicas de execução só quando houver vídeo de técnica do marketing; lista completa dos modelos.',
  'Privacidade: razão social, CNPJ, encarregado (DPO) e a decisão de analytics/cookies (sessão 7).',
  'Rodapé: CREF do responsável técnico e CNPJ.',
  'Frases cortadas pela seção 8: a comparação com outras academias (duas frases da marca e a fala da avaliação funcional) e as ofertas de campanha da fala do Plano Prime.',
] as const;
