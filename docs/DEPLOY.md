# Deploy (Vercel, hospedagem estática)

O site é 100% estático (`dist/`): não há função nem servidor. A configuração está em `vercel.json`, `scripts/build-vercel.mjs`, `astro.config.mjs` (CSP) e nos passos de pós-build.

## 1. Ambientes

| Ambiente | Como sai | Indexação |
|---|---|---|
| **Production** (branch principal) | `VERCEL_ENV=production` → `MODO=producao` + `SITE_URL` | `noindex` enquanto `indexar = false` (`src/config/seo.ts`); `index, follow` só com `indexar = true` **e** `SITE_URL` |
| **Preview** (qualquer outra branch/PR) | `MODO=preview`, sem `SITE_URL` (o `build-vercel` remove) | sempre `noindex, nofollow`, faixa "em revisão" e selos PROVISÓRIO |

Variáveis do projeto na Vercel:

- **`SITE_URL`** (só em Production): o domínio definitivo, sem barra no fim (ex.: `https://www.<domínio>`).

**Node:** 24 (`engines` no `package.json`). **pnpm:** 10.28 (`packageManager`).

## 2. Build

`pnpm run build:vercel` executa `pnpm build`, que roda em sequência:

1. **`prebuild`:** `prepare-media` (ffmpeg), `model-prepare`, `gerar-og` e `validate-config`.
2. **`astro build`**, com a CSP por hash gerada pelo Astro.
3. **`postbuild`:**
   - `ligar-tour`: URL do chunk 3D no teaser;
   - `hash-ativos`: hash no nome de `/media` e `/modelos`;
   - `csp-completar`: hash dos scripts `is:inline`;
   - `audit-compliance`: as travas;
   - `audit-seo`.

**Qualquer trava ou erro derruba o deploy.** Nenhuma trava foi afrouxada para o deploy.

**ffmpeg:** o `prepare-media` usa o ffmpeg do sistema quando existe. Senão, usa o binário estático do pacote `ffmpeg-static` (devDependency). O script de instalação dele está liberado em `package.json` → `pnpm.onlyBuiltDependencies`, porque o pnpm 10 bloqueia scripts de instalação por padrão.

A imagem de build da Vercel não tem ffmpeg: o 1º deploy (08/11/2026) falhou exatamente aí, com "pnpm run build:vercel retornou 1" aos 19 s. Agora o build roda direto no Git da Vercel, sem passo manual. No build de deploy (`VERCEL=1`, ou `--so-publico` no `prepare-media`), só a mídia pública é gerada: vídeos com consentimento pendente e itens `naoUsar` não são processados (economiza minutos de build e não muda nada no site).

## 3. Cabeçalhos

**Em toda rota (`vercel.json`):**

| Cabeçalho | Valor |
|---|---|
| Strict-Transport-Security | `max-age=63072000; includeSubDomains`, sem `preload` (exige inscrição e é difícil de desfazer: decisão do João) |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), browsing-topics=(), fullscreen=(self)` |
| X-Content-Type-Options | `nosniff` |
| X-Frame-Options | `DENY` |
| Content-Security-Policy | `frame-ancestors 'none'; upgrade-insecure-requests` (estas duas não valem em `<meta>`) |
| Cross-Origin-Opener-Policy | `same-origin` |

### CSP por hash (`<meta>` em cada página)

Política gerada pelo Astro (`security.csp` em `astro.config.mjs`). Todo `<script>` e `<style>` gerado entra com o seu SHA-256, e o `scripts/csp-completar.mjs` acrescenta os scripts `is:inline`, como o que decide a abertura antes da primeira pintura. **Não há `'unsafe-inline'` em `script-src` nem em `style-src`.**

| Diretiva | Valor | Por quê |
|---|---|---|
| `default-src` | `'self'` | |
| `script-src` | `'self' 'wasm-unsafe-eval'` + hashes | **exceção do 3D:** os decodificadores WebAssembly (Meshopt sempre; Draco, KTX2 e Spark sob demanda) |
| `style-src` | `'self'` + hashes | |
| `style-src-attr` | `'unsafe-inline'` | **exceção:** atributos `style=""` de posição (régua do horário, molduras); não executa código |
| `worker-src` | `'self' blob:` | **exceção do 3D:** o Spark (splats) e o DRACOLoader criam workers a partir de `blob:` |
| `img-src` | `'self' data: blob:` | LQIP embutido (`data:`) e texturas do three.js (`blob:`) |
| `connect-src` | `'self' https://tiles.openfreemap.org` | modelos, splats e a medição pelo próprio domínio (`/m/evento`); **mapa real em 3D** (estilo, blocos, fontes e ícones do OpenFreeMap), só depois do clique em "Mapa real" ou do "Aceitar" |
| `frame-src` | `'none'` | nenhum iframe: o mapa do Google saiu (ficaram só os links de rota) |
| `media-src`, `font-src`, `manifest-src` | `'self'` | |
| `object-src` | `'none'` | |
| `base-uri`, `form-action` | `'self'` | |

**Mapa (08/11/2026):** o MapLibre GL é servido pelo próprio site (`maplibre-gl` 6.16.0, chunk sob demanda de ≈ 290 KB gzip + worker de ≈ 147 KB, CSS carregado só ao abrir). O worker é um módulo do próprio domínio (`worker-src 'self'`).

**Verificado** (sessão 9, Chromium): nenhuma violação em todas as rotas, com a abertura, o tour 3D montado (maquete esquemática), o consentimento e o mapa.

**Não verificado:** não há splat nem GLB com Draco/KTX2 hoje. Se o decodificador Draco precisar de `'unsafe-eval'` dentro do worker, o "Ver de verdade" vai acusar no console. Conferir no primeiro GLB ou splat real.

**Medição (Plausible) ao ligar:** o envio é para `/m/evento` (mesma origem), então `connect-src 'self'` basta. A regra de reescrita da Vercel vai em `vercel.json` → `rewrites` (ver `docs/FUNIL.md` §4).

## 4. Cache e compressão

| Caminho | Cache-Control | Por quê |
|---|---|---|
| `/_astro/*` | 1 ano, `immutable` | nome com hash (Vite) |
| `/media/*` | 1 ano, `immutable` | nome com hash do conteúdo (`scripts/hash-ativos.mjs`, ex.: `…-720x1280.372f1dd4.mp4`) |
| `/modelos/*` (GLB, splats) | 1 ano, `immutable` | idem |
| `/media/indice.json`, `/modelos/indice.json` | `max-age=0, must-revalidate` | é o índice que aponta para os nomes com hash |
| `/modelos/libs/*` (Draco, Basis) | 7 dias | o three.js pede por nome fixo |
| `/og/*` | 1 dia | redes sociais guardam a imagem por conta própria |
| `llms.txt`, `robots.txt`, `sitemap.xml` | 1 hora | |
| HTML | padrão da Vercel (revalida) | |

As regras não se sobrepõem (lookahead negativo). O `tests/deploy.test.ts` confere que cada caminho cai em exatamente uma regra.

**Compressão:**

- **HTML, JS, CSS, JSON e TXT:** a CDN da Vercel comprime (brotli ou gzip).
- **GLB:** sai com `Content-Type: model/gltf-binary`. A maquete esquemática passa de 22,2 KB para 3,2 KB com brotli (−85%; o Meshopt é feito para ser comprimido de novo).
  - **Não confirmei na documentação** se a Vercel comprime esse tipo. O `pnpm conferir-deploy <url>` mostra o `Content-Encoding` do GLB no primeiro deploy.
  - Se vier sem compressão, o plano B é publicar o GLB já em brotli, com `Content-Encoding: br` no `vercel.json`.
- **Splats SOG:** são imagens WebP por dentro, e o brotli quase não ganha nada. O peso se controla na captura (≤ 40 MB, `docs/3d/README.md`).
- **Vídeo e imagens** (MP4, WebM, AVIF, WebP): já comprimidos, sem nova compressão.

## 5. Conferir depois do deploy

```bash
pnpm conferir-deploy https://<url-do-preview>
```

```bash
pnpm conferir-deploy https://<domínio> --producao
```

O script confere:

- HSTS, Referrer-Policy, Permissions-Policy e CSP;
- `noindex` no preview;
- cache imutável e compressão do JS e da mídia;
- tipo e compressão do GLB.

Depois rode o Rich Results Test e o validator.schema.org (`docs/SEO_GEO.md` §3.1) e o Lighthouse na URL pública.
