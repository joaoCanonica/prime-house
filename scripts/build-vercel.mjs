// Build na Vercel: produção (VERCEL_ENV=production) sai em MODO=producao; previews e branches, em
// MODO=preview (faixa "em revisão", selos PROVISÓRIO, noindex em todas as páginas).
// SITE_URL vem das variáveis do projeto na Vercel (só em Production). Ver docs/DEPLOY.md.
//
// Cache das mídias entre deploys: a Vercel reaproveita node_modules de um build para o outro, mas não
// public/media nem .cache/media. Antes do build, os derivados guardados em node_modules/.cache/ph-midia
// voltam para o lugar (o prepare-media confere cada um pelo hash e só refaz o que mudou); depois de um
// build bem-sucedido, são guardados de novo. Sem isso, cada deploy recodifica todos os vídeos (≈ 25 min).
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('../', import.meta.url));
const GUARDA = join(RAIZ, 'node_modules', '.cache', 'ph-midia');
const PASTAS = [
  ['public/media', 'media'],
  ['.cache/media', 'estado'],
];

const producao = process.env.VERCEL_ENV === 'production';
const env = { ...process.env, MODO: producao ? 'producao' : 'preview' };
if (!producao) delete env.SITE_URL; // preview nunca declara canonical do domínio de produção
console.log(
  `[build-vercel] VERCEL_ENV=${process.env.VERCEL_ENV ?? '—'} → MODO=${env.MODO}${env.SITE_URL ? ` · SITE_URL=${env.SITE_URL}` : ''}`,
);

if (existsSync(GUARDA)) {
  for (const [pasta, nome] of PASTAS) {
    const de = join(GUARDA, nome);
    if (existsSync(de)) cpSync(de, join(RAIZ, pasta), { recursive: true });
  }
  console.log('[build-vercel] mídias do deploy anterior restauradas do cache');
} else console.log('[build-vercel] sem cache de mídias: gerando tudo');

const r = spawnSync('pnpm', ['build'], { stdio: 'inherit', env });
if (r.status === 0) {
  rmSync(GUARDA, { recursive: true, force: true });
  mkdirSync(GUARDA, { recursive: true });
  for (const [pasta, nome] of PASTAS) {
    const de = join(RAIZ, pasta);
    if (existsSync(de)) cpSync(de, join(GUARDA, nome), { recursive: true });
  }
  console.log('[build-vercel] mídias guardadas para o próximo deploy');
}
process.exit(r.status ?? 1);
