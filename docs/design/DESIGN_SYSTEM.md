# Design system · Prime House Academia

Sessão 3 · 06/11/2026. Página viva: `/_estilo` (só no preview, noindex). Capturas das provas: `docs/design/provas-tipograficas-1440.jpg` e `-390.jpg`.

## Pesquisa (MDN)

`developer.mozilla.org` está bloqueado na rede desta sessão. Li as páginas na fonte do próprio MDN (repositório `mdn/content`) e o suporte em `@mdn/browser-compat-data` 8.1.8.

| Recurso | Suporte (sem prefixo) | Decisão |
|---|---|---|
| `mask-image` | Chrome 120 · Safari 15.4 · Firefox 53 | Não usado nesta sessão. As molduras são SVG; o hexágono do conteúdo usa `clip-path`. |
| `@property` | Chrome 85 · Safari 16.4 · Firefox 128 | Reservado para a abertura (sessão 4). Nada depende dele agora. |
| `filter: drop-shadow()` | universal | Segue o alfa do traço SVG (o brilho acompanha a linha). Animar `filter` repinta a cada quadro: o filtro fica **parado** e só a `opacity` anima (compositor). |
| `@view-transition` (entre documentos) | Chrome 126 · Safari 18.2 · Firefox não | Melhoria progressiva em `base.css`, dentro de `prefers-reduced-motion: no-preference`. Exige mesma origem. |
| `prefers-reduced-motion` | universal | Estados finais: luz já acesa, vídeos sem autoplay (botão "Tocar"), transições de 1 ms. |
| `@media (scripting)` | Chrome 120 · Safari 17 · Firefox 113 | A luz só começa apagada quando há JS; sem suporte ou sem JS, já aparece acesa. |

## Cor (calibrada com os quadros do filme da inauguração)

| Token | Valor | Medição |
|---|---|---|
| Breu | `#0C0B0A` | pretos do vídeo `#0E0B0A` (matiz 18°): o Breu foi aquecido para não "emendar" na borda dos vídeos |
| Grafite | `#171615` | idem, um degrau acima |
| Concreto | `#8E8C89` | cinza quente; 5,86:1 sobre Breu |
| Concreto escuro | `#5C5A57` | texto secundário em páginas Névoa (5,61:1) |
| Névoa | `#E9E8E5` | mantida |
| Laranja Prime | `#EC8A2A` | logo no vídeo `#EF8B04` (34°), avatar `#E09132` (34°), camiseta `#E68141` (23°, tecido sob luz quente). 30° está dentro do ruído: **mantido e PROVISÓRIO** |
| Luz | `#FFF4E0` | mediana do LED do teto na captura 10: `#FEF4E0` |

`pnpm audit-contraste`: 12 pares em uso, todos AA (pior: Concreto/Grafite 5,39:1). Proibidos: Laranja/Névoa (2,08:1) e Concreto/Névoa (2,74:1).

## Tipografia

Provas: hero "O novo *padrão* de treino em Lages.", número "5 puxadas altas" e parágrafo longo, em 390 e 1440 px.

| Papel | Escolha | Por quê | Descartada |
|---|---|---|---|
| Títulos | **Archivo**, largura 62 (display e números) e 75 (H2/H3) | Grotesca precisa; a 62 conversa com o "PRIME HOUSE" condensado do logo e cabe grande no celular; a 75 lê melhor em tamanhos médios. Um arquivo só (eixos wdth e wght). | Barlow Condensed: terminais arredondados com cara de "esporte genérico" |
| Acento (1 palavra por título) | **Source Serif 4 Italic**, opsz 60 | Fina e contrastada: é acento, não segundo título | Literata Italic: larga e pesada, compete com a caixa alta |
| Texto | **Inter Tight** | Densa, mesmo ritmo das condensadas; 17–18 px a 1,6 | Geist: ≈ 10% mais linhas no celular e "cara de interface" |

Escala fluida (`tokens.css`): número até 320 px, display 56→152 px (-0,02em), H1 46→100 px, H2 34→64 px, texto 17→18 px. Os números usam `tabular-nums`. As fontes não têm `smcp`: o "versalete" é caixa alta pequena com espaçamento (nunca sintetizado).

### Fontes self-hosted (OFL 1.1, licenças em `src/assets/fontes/`)

Recorte de eixos e subset latino + pontuação, com fonttools 4.68 (instalado via `pip` no container; não é dependência do projeto). De 265 KB para 80 KB:

| Arquivo | Eixos | Peso |
|---|---|---|
| `archivo-62-75.woff2` | wdth 62–75 · wght 600–800 | 35,8 KB |
| `inter-tight-400-650.woff2` | wght 400–650 | 25,6 KB |
| `source-serif-4-italic-display.woff2` | estática (opsz 60, wght 400) | 18,8 KB |

```bash
U="U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2009,U+200A,U+2013-2014,U+2018-201A,U+201C-201E,U+2022,U+2026,U+202F,U+2032-2033,U+2192,U+2212"
F="kern,liga,calt,ccmp,locl,tnum,pnum,lnum,frac,numr,dnom,mark,mkmk"
fonttools varLib.instancer archivo-latin-wdth-normal.woff2 wdth=62:75 wght=600:800 -o a.ttf
pyftsubset a.ttf --unicodes="$U" --layout-features="$F" --flavor=woff2 --output-file=archivo-62-75.woff2
fonttools varLib.instancer inter-tight-latin-wght-normal.woff2 wght=400:650 -o i.ttf
pyftsubset i.ttf --unicodes="$U" --layout-features="$F" --flavor=woff2 --output-file=inter-tight-400-650.woff2
fonttools varLib.instancer source-serif-4-latin-opsz-italic.woff2 opsz=60 wght=400 -o s.ttf
pyftsubset s.ttf --unicodes="$U" --layout-features="$F" --flavor=woff2 --output-file=source-serif-4-italic-display.woff2
```

Fontes de origem: `@fontsource-variable/archivo` 5.3.0, `@fontsource-variable/inter-tight` 5.3.0, `@fontsource-variable/source-serif-4` 5.3.1 (devDependencies, só para regerar).

## Logo

`<Logo variante="empilhado|linha|mono" altura>`: SVG inline a partir dos originais, coordenadas arredondadas para 1 casa (17 KB → 5,9 KB). "PRIME HOUSE" = `currentColor`; "ACADEMIA" = `var(--prime-laranja)`.

Nitidez (capturas de `/_estilo`): **empilhado ≥ 48 px** de altura (a 24 px, "ACADEMIA" fica com ≈ 3 px e some); **linha ≥ 20 px**; mono como o empilhado.

Ícones (`pnpm icones` → `public/`): `favicon.svg`, `favicon.ico` (32 px), `apple-touch-icon.png` (180 px) e `icone-512.png`, todos com o empilhado sobre Breu. A 16–32 px o logo vira uma mancha; ver a pendência sobre um monograma.

## Assinatura "Luz de Treino"

- **`<MolduraLuz forma="retangulo|hexagono">`**: polígono SVG de 1 px (`vector-effect: non-scaling-stroke`) na cor Luz, com `drop-shadow` duplo parado. O hexágono é **alongado**, com pontas nas laterais, como as luminárias reais.
- **Ligar**: `IntersectionObserver` (20% visível) põe `.acesa` **uma vez**. Keyframes `ph-cintila` em 280 ms. Medido no Chromium (opacidade por tempo): 0 → 0,61 → 0,28 → 0,90 → 0,47 → 1,00, estável a partir de ≈ 180 ms. Sair e voltar não reacende. Com reduced-motion já está acesa (opacidade 1 desde o início).
- **`<TetoDeLuz sequencial? intensidade="plena|fundo">`**: 45 luminárias (retângulos e hexágonos em fileiras) projetadas em perspectiva de um ponto **no build** (SVG estático). Com `sequencial`, acendem de perto para longe, 55 ms entre uma e outra.
- **Foco e hover**: `:focus-visible` = contorno de 1 px Luz + brilho, sempre visível. Botões: a borda acende (Luz) no hover.
- **`<NumeroGrande>`**: Archivo 62, `tabular-nums`, até 320 px, nunca passa do contêiner (`cqi`), legenda em versalete.

## Componentes base (`src/components/base/`)

`Botao` (primário Laranja · secundário com contorno de luz) · `BotaoWhatsApp` ("Falar com a equipe" + glifo oficial monocromático, Simple Icons CC0, sem círculo) · `Link` · `Rotulo` · `Citacao` (literal, `data-avaliacao-literal`) · `StatusHorario` (ao vivo) · `TabelaHorario` (régua de 24 h, hoje aceso) · `MolduraVideo` (mudo, toca só visível, botão Pausar/Tocar) · `Poster` (AVIF/WebP + LQIP, CLS 0) · `MapaEstatico` (localizador tipográfico: coordenadas, plus code, rotas).

## Movimento

150 ms (foco/hover) · 300 ms (estado) · 450 ms (bloco) · 700 ms (abertura). Saída `cubic-bezier(.16, 1, .3, 1)`; nada de bounce (nenhuma curva passa de 1).

## JS desta sessão (medido no build)

`luz.js` 989 B + `horario-vivo.js` 3.544 B + 4 entradas de ≈ 30 B = **4,6 KB brutos (≈ 2,3 KB gzip)**. Limite: 6 KB.
