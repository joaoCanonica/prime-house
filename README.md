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

Os scripts `validate-config`, `audit-*`, `media:prepare` e `model:prepare` são marcadores e saem com erro até a sessão que os implementa (ver `docs/PENDENCIAS.md`).

## Estrutura

```
src/{config,components,layouts,pages,styles,scripts,content,lib,tres}
scripts/              automações (capturar, preparo de mídia e modelo, auditorias)
docs/                 investigação, mapa de mídia, prompts, dados/, 3d/, capturas/
assets/, videos/      mídia recebida (vai para media-originais/ na sessão 1)
media-originais/      originais de mídia (derivados vão para public/media/, fora do git)
modelos-originais/    GLB/splat fonte (derivados em public/modelos/, fora do git)
```
