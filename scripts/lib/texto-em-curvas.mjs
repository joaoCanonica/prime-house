// Texto → contorno SVG (path) a partir das fontes self-hosted (WOFF2 variável), para a imagem social.
// O fontkit 2.0.4 não aplica eixos variáveis em glifos WOFF2 (o WOFF2Glyph pula a variação);
// aqui a variação é aplicada no _decode do glifo, como o TTFGlyph faz.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const fontkit = require('fontkit');

export function abrirFonte(arquivo, eixos = {}) {
  // 1) descompacta os glifos numa cópia sem variação (o WOFF2 decodifica tudo de uma vez);
  // 2) a fonte final reaproveita esses glifos e só então recebe os eixos.
  const crua = fontkit.openSync(arquivo);
  crua.getGlyph(0);
  const fonte = fontkit.openSync(arquivo);
  if (crua._transformedGlyphs) {
    fonte._decompress();
    fonte._transformedGlyphs = crua._transformedGlyphs;
  }
  if (fonte.fvar)
    fonte.variationCoords = fonte.fvar.axis.map((a) => eixos[a.axisTag.trim()] ?? a.defaultValue);
  const glifo = fonte.getGlyph(fonte.glyphForCodePoint(65).id);
  const proto = Object.getPrototypeOf(glifo);
  if (!proto.__variavel) {
    const original = proto._decode;
    proto._decode = function decode() {
      const g = original.call(this);
      const vp = this._font._variationProcessor;
      if (!g || !vp || g.numberOfContours <= 0) return g;
      const Ponto = g.points[0].constructor;
      const copia = {
        ...g,
        points: g.points.map((p) => new Ponto(p.onCurve, p.endContour, p.x, p.y)),
      };
      const hm = this._font.hmtx.metrics;
      const m = hm.get(Math.min(this.id, hm.length - 1));
      const lsb =
        this.id < hm.length ? m.bearing : this._font.hmtx.bearings.get(this.id - hm.length);
      const fantasma = [
        new Ponto(false, true, g.xMin - lsb, 0),
        new Ponto(false, true, g.xMin - lsb + m.advance, 0),
        new Ponto(false, true, 0, 0),
        new Ponto(false, true, 0, 0),
      ];
      const pts = [...copia.points, ...fantasma];
      vp.transformPoints(this.id, pts);
      copia.phantomPoints = pts.slice(-4);
      return copia;
    };
    proto._getCBox = function cbox() {
      return this.path.bbox;
    };
    proto.__variavel = true;
  }
  return fonte;
}

/** Devolve { d, largura } do texto em px, com a linha de base em y = 0. */
export function textoEmCurvas(fonte, texto, tamanho, { espacamento = 0 } = {}) {
  const run = fonte.layout(texto);
  const escala = tamanho / fonte.unitsPerEm;
  let x = 0;
  const partes = [];
  run.glyphs.forEach((g, i) => {
    const d = g.path
      .scale(escala, -escala)
      .translate(x + (run.positions[i]?.xOffset ?? 0) * escala, 0)
      .toSVG();
    if (d) partes.push(d);
    x += (run.positions[i]?.xAdvance ?? g.advanceWidth) * escala + espacamento;
  });
  return { d: partes.join(' '), largura: x - espacamento };
}
