// Build na Vercel: produção (VERCEL_ENV=production) sai em MODO=producao; previews e branches, em
// MODO=preview (faixa "em revisão", selos PROVISÓRIO, noindex em todas as páginas).
// SITE_URL vem das variáveis do projeto na Vercel (só em Production). Ver docs/DEPLOY.md.
import { spawnSync } from 'node:child_process';

const producao = process.env.VERCEL_ENV === 'production';
const env = { ...process.env, MODO: producao ? 'producao' : 'preview' };
if (!producao) delete env.SITE_URL; // preview nunca declara canonical do domínio de produção
console.log(
  `[build-vercel] VERCEL_ENV=${process.env.VERCEL_ENV ?? '—'} → MODO=${env.MODO}${env.SITE_URL ? ` · SITE_URL=${env.SITE_URL}` : ''}`,
);
const r = spawnSync('pnpm', ['build'], { stdio: 'inherit', env });
process.exit(r.status ?? 1);
