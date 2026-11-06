// Prepara SVG de marca para inline: arredonda coordenadas (1 casa basta num viewBox de ~900) e aplica atributos.
export function compactarSvg(svg: string): string {
  return svg
    .replace(/<title>.*?<\/title>/s, '')
    .replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10))
    .replace(/\s+/g, ' ')
    .trim();
}

export function comAtributos(svg: string, attrs: Record<string, string | undefined>): string {
  const extra = Object.entries(attrs)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}="${String(v).replace(/"/g, '&quot;')}"`)
    .join(' ');
  return svg.replace(/\s(role|aria-label)="[^"]*"/g, '').replace(/^<svg\b/, `<svg ${extra}`);
}
