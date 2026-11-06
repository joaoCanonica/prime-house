// Fonte única da config. Tudo que é dado do cliente sai daqui (ou das coleções em src/content/dados).
import manifesto from '../../media.manifest.json' with { type: 'json' };
import { diferenciais } from '../content/dados/diferenciais.ts';
import { equipamentos } from '../content/dados/equipamentos.ts';
import { planos } from '../content/dados/planos.ts';
import { zonas } from '../content/dados/zonas.ts';
import { avaliacoes } from './avaliacoes.ts';
import { contato } from './contato.ts';
import { horario } from './horario.ts';
import { marca } from './marca.ts';
import { modoAtual, type Modo } from './modo.ts';
import { SITE_URL } from './seo.ts';
import { verificar, type Entrada, type ManifestoMidia } from './verificacao.ts';

export { avaliacoes, contato, horario, marca };

export function entradaAtual(): Entrada {
  return {
    config: { marca, contato, horario },
    whatsapp: contato.whatsapp,
    colecoes: { zonas, equipamentos, planos, diferenciais },
    manifesto: manifesto as ManifestoMidia,
    siteUrl: SITE_URL,
  };
}

export const verificarAtual = (modo: Modo = modoAtual()) => verificar(entradaAtual(), modo);
