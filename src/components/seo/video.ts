// VideoObject dos vídeos que têm fala transcrita no site (legendas em src/content/textos/micro.ts).
// Data de publicação: a do post original no manifesto ("<código> (DD/MM/AAAA)"), no fuso de Lages.
import manifesto from '../../../media.manifest.json' with { type: 'json' };
import { legendas, videos } from '../../content/textos/index.ts';
import { video } from '../base/midia.ts';
import { videoLd, type No } from './ld.ts';

interface Item {
  id: string;
  origem?: string | null;
  post?: string | null;
}

function dataDoPost(id: string): string {
  const t = (manifesto.trechos as Item[]).find((x) => x.id === id);
  const o = (manifesto.originais as Item[]).find((x) => x.id === (t?.origem ?? id));
  const m = /\((\d{2})\/(\d{2})\/(\d{4})\)/.exec(o?.post ?? '');
  if (!m) throw new Error(`[seo] vídeo "${id}" sem data de post no manifesto`);
  return `${m[3]}-${m[2]}-${m[1]}T00:00:00-03:00`;
}

export function videoComTranscricao(
  id: keyof typeof legendas,
  nome: string,
  pagina: string,
  base: string | null,
): No {
  const v = video(id);
  const mp4 = [...v.variantes]
    .filter((x) => x.formato === 'mp4')
    .sort((a, b) => b.largura - a.largura)[0];
  const poster = v.posters[0];
  if (!mp4 || !poster) throw new Error(`[seo] vídeo "${id}" sem mp4 ou pôster`);
  return videoLd({
    base,
    nome,
    descricao: videos[id] ?? nome,
    transcricao: legendas[id],
    miniatura: poster.webp,
    arquivo: mp4.arquivo,
    duracaoS: v.duracao,
    publicadoEm: dataDoPost(id),
    pagina,
  });
}
