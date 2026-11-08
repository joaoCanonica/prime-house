// Mapa real em 3D: MapLibre GL (servido pelo próprio site) com os mapas vetoriais do OpenFreeMap (sem chave,
// sem cookies). O estilo "positron" é repintado na paleta da Prime House (breu, grafite, luz quente), com os
// prédios em relevo e um marcador próprio. Baseado no mapa do site do Dr. Agenor (Marco Oliver).
import cssUrl from 'maplibre-gl/dist/maplibre-gl.css?url';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import {
  Map as MapaML,
  Marker,
  NavigationControl,
  setWorkerUrl,
  type StyleSpecification,
} from 'maplibre-gl';

export const ESTILO = 'https://tiles.openfreemap.org/styles/positron';

// ----- repintura do estilo (cada cor vira um tom da paleta, mantendo a luminosidade relativa) -----
const ctx = document.createElement('canvas').getContext('2d');
function rgba(c: string): [number, number, number, number] {
  if (!ctx) return [0, 0, 0, 1];
  ctx.fillStyle = '#000';
  ctx.fillStyle = c;
  const v = String(ctx.fillStyle);
  if (v.startsWith('#'))
    return [
      parseInt(v.slice(1, 3), 16),
      parseInt(v.slice(3, 5), 16),
      parseInt(v.slice(5, 7), 16),
      1,
    ];
  const m = v.match(/rgba?\(([^)]+)\)/);
  if (!m?.[1]) return [0, 0, 0, 1];
  const p = m[1].split(',').map(parseFloat);
  return [p[0] ?? 0, p[1] ?? 0, p[2] ?? 0, p[3] ?? 1];
}
const luminosidade = (c: string) => {
  const [r, g, b] = rgba(c);
  return (Math.max(r, g, b) + Math.min(r, g, b)) / 510;
};
const alfa = (c: string) => rgba(c)[3];
const hsla = (h: number, s: number, l: number, a: number) =>
  `hsla(${h},${(s * 100).toFixed(1)}%,${(l * 100).toFixed(1)}%,${a})`;
const ehCor = (v: unknown): v is string => typeof v === 'string' && /^(#|rgb|hsl)/i.test(v);
const fundo = (v: unknown, fn: (c: string) => string): unknown =>
  ehCor(v) ? fn(v) : Array.isArray(v) ? v.map((x) => fundo(x, fn)) : v;
// superfícies: quase breu, levemente quente
const preenchimento = (c: string) => hsla(30, 0.06, 0.05 + 0.06 * luminosidade(c), alfa(c));
// vias: grafite-claro quente
const traco = (c: string) => hsla(32, 0.1, 0.16 + 0.2 * luminosidade(c), alfa(c));

// camada vista de forma solta: a repintura mexe em cores de qualquer tipo de camada
interface Camada {
  id: string;
  type: string;
  paint?: Record<string, unknown>;
  layout?: Record<string, unknown>;
}

export function repintar(estilo: StyleSpecification): StyleSpecification {
  // placas de rodovia (escudos dos EUA): não servem aqui e geram avisos de filtro no console
  estilo.layers = estilo.layers.filter((l) => !/shield/.test(l.id));
  for (const camada of estilo.layers as unknown as Camada[]) {
    const p = (camada.paint ??= {});
    const id = camada.id;
    if (camada.type === 'background') p['background-color'] = '#0A0A0B';
    else if (camada.type === 'fill') {
      if (/water/.test(id)) p['fill-color'] = '#0f1418';
      else if (/building/.test(id)) p['fill-color'] = '#1a1a1c';
      else if (p['fill-color'] != null) p['fill-color'] = fundo(p['fill-color'], preenchimento);
      if (p['fill-outline-color'] != null)
        p['fill-outline-color'] = fundo(p['fill-outline-color'], preenchimento);
    } else if (camada.type === 'line') {
      if (/casing/.test(id)) p['line-color'] = '#050505';
      else if (p['line-color'] != null) p['line-color'] = fundo(p['line-color'], traco);
    } else if (camada.type === 'raster') {
      p['raster-opacity'] = 0.15;
      p['raster-saturation'] = -1;
    } else if (camada.type === 'symbol') {
      if (/poi|housenumber|aeroway/.test(id)) {
        (camada.layout ??= {})['visibility'] = 'none';
        continue;
      }
      p['text-color'] = '#E9E8E5';
      p['text-halo-color'] = 'rgba(10,10,11,0.92)';
      p['text-halo-width'] = 1.4;
    }
  }
  return estilo;
}

export interface OpcoesMapaReal {
  caixa: HTMLElement;
  lat: number;
  lng: number;
  estilo: StyleSpecification;
  reduzido: boolean;
  aoMostrar: () => void;
  aoFalhar: () => void;
}

// CSS do MapLibre só quando o mapa real abre (não pesa nas páginas)
export function carregarCss(): Promise<void> {
  if (document.querySelector('link[data-maplibre-css]')) return Promise.resolve();
  return new Promise((ok) => {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = cssUrl;
    l.dataset['maplibreCss'] = '';
    l.onload = () => ok();
    l.onerror = () => ok();
    document.head.append(l);
  });
}

export function montarMapaReal(o: OpcoesMapaReal): MapaML {
  setWorkerUrl(workerUrl);
  const toque = matchMedia('(pointer: coarse)').matches;
  const estilo = repintar(o.estilo);
  const mapa = new MapaML({
    container: o.caixa,
    style: estilo,
    center: [o.lng, o.lat],
    zoom: 16.4,
    pitch: 62,
    bearing: -22,
    maxPitch: 78,
    attributionControl: { compact: true },
    cooperativeGestures: toque,
    locale: {
      'CooperativeGesturesHandler.MobileHelpText': 'Use dois dedos para mover o mapa',
      'CooperativeGesturesHandler.WindowsHelpText': 'Use Ctrl + rolagem para aproximar',
      'CooperativeGesturesHandler.MacHelpText': 'Use ⌘ + rolagem para aproximar',
      'NavigationControl.ZoomIn': 'Aproximar',
      'NavigationControl.ZoomOut': 'Afastar',
      'NavigationControl.ResetBearing': 'Voltar para o norte',
    },
  });
  mapa.addControl(new NavigationControl({ visualizePitch: true }), 'bottom-right');

  let blocos = false;
  let mostrado = false;
  mapa.on('sourcedata', (e) => {
    if ((e as { tile?: { state?: string } }).tile?.state === 'loaded') blocos = true;
  });
  const mostrar = () => {
    if (mostrado) return;
    mostrado = true;
    if (!blocos) {
      // nada chegou (rede bloqueada): volta para o mapa desenhado
      try {
        mapa.remove();
      } catch {
        /* já removido */
      }
      o.aoFalhar();
      return;
    }
    o.aoMostrar();
  };
  const limite = setTimeout(mostrar, 10_000);

  mapa.on('load', () => {
    // prédios em relevo, por baixo dos nomes de rua
    const fonte = Object.keys(estilo.sources).find((k) => estilo.sources[k]?.type === 'vector');
    const antes = (estilo.layers as unknown as Camada[]).find(
      (l) => l.type === 'symbol' && l.layout?.['visibility'] !== 'none',
    )?.id;
    if (fonte) {
      try {
        mapa.addLayer(
          {
            id: 'predios-3d',
            type: 'fill-extrusion',
            source: fonte,
            'source-layer': 'building',
            minzoom: 13,
            paint: {
              'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['coalesce', ['get', 'render_height'], 6],
                0,
                '#1c1c1f',
                40,
                '#2a2826',
                120,
                '#3d3832',
              ],
              'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 6],
              'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
              'fill-extrusion-opacity': 0.94,
            },
          },
          antes,
        );
      } catch {
        /* estilo sem prédios: segue sem relevo */
      }
    }
    // marcador: letreiro com moldura de luz, alfinete laranja e anel que pulsa
    const el = document.createElement('div');
    el.className = 'marcador-ph';
    el.innerHTML =
      '<div class="marcador-ph__in"><span class="marcador-ph__placa"><b>PRIME HOUSE</b><small>ACADEMIA</small></span>' +
      '<span class="marcador-ph__pino"><i></i></span>' +
      `${o.reduzido ? '' : '<i class="marcador-ph__anel"></i>'}</div>`;
    new Marker({ element: el, anchor: 'bottom' }).setLngLat([o.lng, o.lat]).addTo(mapa);
    mapa.once('idle', () => {
      clearTimeout(limite);
      setTimeout(mostrar, 300);
    });
  });
  mapa.on('error', () => undefined);
  return mapa;
}
