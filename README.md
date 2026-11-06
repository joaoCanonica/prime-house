# Prime House Academia · site

Site estático (Astro + TypeScript strict) da Prime House Academia, Lages/SC. O contexto completo do projeto está em [`CLAUDE.md`](CLAUDE.md) (cópia em `docs/CONTEXTO.md`); pendências em [`docs/PENDENCIAS.md`](docs/PENDENCIAS.md).

## Requisitos

- Node 24 LTS (`.nvmrc`) · pnpm 10.28.0 (`corepack enable`)
- ffmpeg/ffprobe (preparo de mídia)
- Chromium do Playwright 1.63: `pnpm exec playwright install chromium` (ou `PW_CHROMIUM_PATH=/caminho/do/chrome`)

## Comandos

```bash
pnpm install
pnpm dev          # desenvolvimento
pnpm build        # gera dist/
pnpm preview      # serve dist/
pnpm check        # astro check + ESLint + Prettier
pnpm test         # Vitest
pnpm capturar     # build + capturas 390/1440 px, com e sem reduced-motion, em docs/capturas/<data>/
```

`pnpm capturar --rotas=/,/a-casa/ --sem-build` limita rotas e reaproveita o `dist/`. A ilha 3D, quando existir, marca `[data-ilha-3d]` com `data-estado="pronto" | "erro" | "fallback"`; o script espera esse sinal (até 20 s).

### Mídia

- `media.manifest.json` (validado por `media.manifest.schema.json`) é a fonte única: originais, trechos de vídeo, stills e recortes, com uso, consentimento e problemas.
- `pnpm media:prepare` (roda sozinho em `predev`/`prebuild`; precisa de ffmpeg) gera AVIF/WebP 480–1600 px (nunca acima do original), LQIP, MP4 H.264 + WebM VP9 mudos em 720×1280 e 540×960 e pôsteres. É idempotente (cache por hash em `.cache/media/`); `--forcar` refaz tudo.
- Publicável → `public/media/<id>/`; consentimento pendente → `media-privada/<id>/` (fora do git e do site); `naoUsar` → nada. Cada pasta tem um `indice.json`.
- `pnpm media:stills` extrai os stills e refaz as folhas de contato em `docs/capturas/midia/`. Catálogo: `docs/MIDIA_CATALOGO.md`.

Os scripts `validate-config`, `audit-*` e `model:prepare` são marcadores e saem com erro até a sessão que os implementa (ver `docs/PENDENCIAS.md`).

## Estrutura

```
src/{config,components,layouts,pages,styles,scripts,content,lib,tres}
scripts/              automações (capturar, preparo de mídia e modelo, auditorias)
docs/                 investigação, mapa de mídia, prompts, dados/, 3d/, capturas/
media-originais/      originais intactos: fotos/, fotos/capturas/, videos/, marca/
media-privada/        derivados com consentimento pendente (fora do git e do site)
modelos-originais/    GLB/splat fonte (derivados em public/modelos/, fora do git)
```
