// Páginas públicas (canônicas) do site: sitemap, llms.txt e trilha. 404 e /_* ficam fora.
import {
  aCasa,
  comoFunciona,
  equipe,
  faq,
  home,
  horarios,
  maquinario,
  planos,
  privacidade,
  trabalheConosco,
} from '../../content/textos/index.ts';

export interface PaginaPublica {
  rota: string;
  nome: string;
  titulo: string;
  resposta: string;
  /** vai para a seção "Optional" do llms.txt */
  secundaria?: boolean;
}

export const paginas: readonly PaginaPublica[] = [
  { rota: '/', nome: 'Início', titulo: home.meta.title, resposta: home.resposta },
  { rota: '/a-casa/', nome: 'A Casa (tour)', titulo: aCasa.meta.title, resposta: aCasa.resposta },
  {
    rota: '/maquinario/',
    nome: 'Maquinário',
    titulo: maquinario.meta.title,
    resposta: maquinario.resposta,
  },
  { rota: '/planos/', nome: 'Planos', titulo: planos.meta.title, resposta: planos.resposta },
  {
    rota: '/como-funciona/',
    nome: 'Como funciona',
    titulo: comoFunciona.meta.title,
    resposta: comoFunciona.resposta,
  },
  {
    rota: '/horarios-e-como-chegar/',
    nome: 'Horários e como chegar',
    titulo: horarios.meta.title,
    resposta: horarios.resposta,
  },
  {
    rota: '/perguntas-frequentes/',
    nome: 'Perguntas frequentes',
    titulo: faq.meta.title,
    resposta: faq.resposta,
  },
  { rota: '/equipe/', nome: 'Equipe', titulo: equipe.meta.title, resposta: equipe.resposta },
  {
    rota: '/trabalhe-conosco/',
    nome: 'Trabalhe conosco',
    titulo: trabalheConosco.meta.title,
    resposta: trabalheConosco.resposta,
    secundaria: true,
  },
  {
    rota: '/privacidade/',
    nome: 'Privacidade',
    titulo: privacidade.meta.title,
    resposta: privacidade.resposta,
    secundaria: true,
  },
];
