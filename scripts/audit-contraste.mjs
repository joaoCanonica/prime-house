// Valida o contraste WCAG 2.x (AA) de cada par de cor em uso e confere tokens.css × tema.ts.
// Uso: node scripts/audit-contraste.mjs   (exit 1 se algum par falhar ou os tokens divergirem)
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { cores, paresContraste, paresProibidos } from '../src/config/tema.ts';

const RAIZ = fileURLToPath(new URL('../', import.meta.url));

export function luminancia(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`cor inválida: ${hex}`);
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contraste(a, b) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const kebab = (s) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

export function auditarContraste() {
  const linhas = [];
  let falhas = 0;
  for (const p of paresContraste) {
    const r = contraste(cores[p.texto], cores[p.fundo]);
    const ok = r >= p.minimo;
    if (!ok) falhas++;
    linhas.push({ par: `${p.texto} / ${p.fundo}`, razao: r, minimo: p.minimo, ok, uso: p.uso });
  }
  for (const [t, f] of paresProibidos) {
    const r = contraste(cores[t], cores[f]);
    linhas.push({
      par: `${t} / ${f}`,
      razao: r,
      minimo: null,
      ok: true,
      uso: 'PROIBIDO (não usar)',
    });
  }
  // tokens.css precisa repetir tema.ts
  const css = readFileSync(`${RAIZ}src/styles/tokens.css`, 'utf8');
  const divergencias = [];
  for (const [nome, valor] of Object.entries(cores)) {
    const m = new RegExp(`--prime-${kebab(nome)}:\\s*(#[0-9a-fA-F]{6})`).exec(css);
    if (!m || m[1].toLowerCase() !== valor.toLowerCase())
      divergencias.push(`--prime-${kebab(nome)}: css=${m?.[1] ?? 'ausente'} tema=${valor}`);
  }
  return { linhas, falhas, divergencias, ok: falhas === 0 && divergencias.length === 0 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const r = auditarContraste();
  for (const l of r.linhas) {
    const status = l.minimo === null ? '  —  ' : l.ok ? ' OK  ' : 'FALHA';
    console.log(
      `${status} ${l.par.padEnd(26)} ${l.razao.toFixed(2).padStart(6)}:1  ${l.minimo ? `mín. ${l.minimo}` : '       '}  ${l.uso}`,
    );
  }
  for (const d of r.divergencias) console.log(`FALHA tokens.css diverge de tema.ts: ${d}`);
  console.log(
    `[audit-contraste] ${r.linhas.filter((l) => l.minimo).length} pares · ${r.falhas} falha(s) · ${r.divergencias.length} divergência(s) → ${r.ok ? 'OK' : 'BLOQUEADO'}`,
  );
  process.exit(r.ok ? 0 : 1);
}
