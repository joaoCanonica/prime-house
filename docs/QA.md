# QA (sessão 9): números e capturas

Data: 08/11/2026.

- **Desempenho, acessibilidade e pesos:** build de **produção** (`MODO=producao`, sem `SITE_URL`).
- **3D, fps e memória:** build de **preview** (a maquete só existe lá enquanto não é aprovada).

**Ambiente:** contêiner sem GPU (WebGL por SwiftShader), Chromium 1243 (Playwright 1.63), WebKit 26.6, Firefox 155, Lighthouse 13.6.0 e axe-core 4.14.0.

**Como reproduzir** (os resultados ficam em `docs/qa/*.json`):

```bash
MODO=producao pnpm build
```

```bash
pnpm audit-lighthouse && pnpm audit-a11y && pnpm audit-pesos
```

```bash
node scripts/qa-desempenho.mjs --parte=lcp
```

```bash
pnpm build && node scripts/qa-desempenho.mjs --parte=fps && node scripts/qa-desempenho.mjs --parte=memoria
```

```bash
pnpm test:e2e
```

```bash
PLAYWRIGHT_BROWSERS_PATH=~/.pw-extra NAVEGADOR=webkit npx vitest run --config vitest.e2e.config.ts tests/e2e/qa.e2e.ts
```

## 1. Desempenho

### 1.1 Lighthouse mobile (todas as rotas, mediana de 3 rodadas)

Perfil padrão do Lighthouse: celular, 4G lento simulado, CPU 4×. Meta: ≥ 95 em Desempenho, Boas práticas e SEO; 100 em Acessibilidade.

| Rota | Desempenho [3 rodadas] | A11y | BP | SEO medido / sem noindex | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | **98** [71/98/100] | 100 | 100 | 66 / **100** | 0,80 s | 0 | 130 ms |
| `/a-casa/` | **99** [97/99/99] | 100 | 100 | 66 / **100** | 1,95 s | 0 | 43 ms |
| `/como-funciona/` | **100** | 100 | 100 | 63 / **100** | 0,78 s | 0 | 8 ms |
| `/equipe/` | **100** | 100 | 100 | 66 / **100** | 0,77 s | 0,001 | 19 ms |
| `/horarios-e-como-chegar/` | **100** | 100 | 100 | 66 / **100** | 0,86 s | 0 | 0 ms |
| `/maquinario/` | **100** | 100 | 100 | 66 / **100** | 0,77 s | 0,001 | 3 ms |
| `/perguntas-frequentes/` | **100** | 100 | 100 | 63 / **100** | 0,77 s | 0 | 42 ms |
| `/planos/` | **100** | 100 | 100 | 63 / **100** | 0,86 s | 0,001 | 0 ms |
| `/privacidade/` | **100** | 100 | 100 | 63 / **100** | 0,77 s | 0 | 0 ms |
| `/trabalhe-conosco/` | **100** | 100 | 100 | 63 / **100** | 0,77 s | 0,011 | 0 ms |
| `/404.html` | **100** | 100 | 100 | 63 / **100** | 0,77 s | 0,001 | 4 ms |

- **SEO:** a nota medida cai para 63–66 só porque toda página tem `noindex` de propósito (`indexar = false`). Sem o item "is-crawlable", todas dão 100. Essa é a nota que vale quando a indexação for ligada.
- **Variação na home:** o Lighthouse varia entre rodadas. A primeira rodada da linha de base (`lighthouse-antes.json`) deu 82 com o Chrome frio. Por isso o script usa a mediana de 3. Na rodada final, a pior das 3 deu 71.

### 1.2 Pesos (`docs/qa/pesos.json`)

| Item | Medido | Orçamento |
|---|---|---|
| JS inicial por página (gzip) | 1,9 KB (internas) · 3,3 (`/planos`) · 4,5 (`/horarios`) · 5,1 (`/a-casa`) · **9,2 KB (home)** | ≤ 40 KB |
| Ilha 3D (tour + three.core + controlador, gzip) | **164,1 KB** | ≤ 180 KB |
| Sob demanda (só em "Ver de verdade" ou se o GLB pedir) | Spark 919,6 KB gzip; KTX2 23,5; Draco 2,9 + wasm | — |
| GLB da maquete esquemática | **0,02 MB** (22,2 KB; 3,2 KB com brotli) | ≤ 3 MB |
| Splats | nenhum ainda | ≤ 40 MB |
| Vídeos | 32 arquivos, 16,75 MB no total; o maior tem 2,67 MB (avaliação funcional 720×1280, sob demanda) | — |
| Imagens | 134 arquivos, 4,0 MB no total (AVIF/WebP com srcset) | — |
| Fontes (woff2, subset latino) | Archivo 34,9 + Inter Tight 25,0 + Source Serif 18,4 = **78,3 KB** | — |
| CSS embutido (gzip) | 4,2–8,4 KB por página | — |

### 1.3 LCP da home com e sem a abertura (`desempenho-lcp.json`)

Perfil: celular 412×823, DPR 1,75, CPU 4×, 4G lento (150 ms, 1,6 Mbps). Mediana de 5.

| | LCP | Elemento |
|---|---|---|
| **Sem abertura** (2ª página em diante na sessão, ou "Pular") | **0,32 s** | H1 do hero |
| **Com abertura** (1ª visita da sessão) | **3,84 s** | H1 do hero |

**Diagnóstico:**

- A abertura (3 s, aprovada na sessão 4) deixa o H1 com opacidade 0 até 2,35 s.
- O pôster do hero, que devia ser o LCP, ocupa a tela inteira e o Chrome o descarta como candidato.
- Pintar o H1 desde o início, por baixo da camada da abertura, levaria o LCP a 0,34 s. **Foi testado e descartado:** aos 2,0 s o H1 aparece por trás do logo grande em voo e os dois se sobrepõem (`antes-depois/abertura-390-*.jpg`).

**Decisão do João:**

- manter (a abertura roda 1 vez por sessão, tem "Pular" e não roda com movimento reduzido);
- encurtar;
- ou redesenhar o fim da abertura.

O Lighthouse mede 0,80 s para a home porque simula o LCP de outro jeito. O número acima é o real em laboratório.

### 1.4 fps do tour 3D (`desempenho-fps.json`)

Renderização **por software** (SwiftShader): é o pior caso. Mediana de 8 amostras de 1 s, com órbita contínua.

| Perfil | fps | Chamadas de desenho | Triângulos |
|---|---|---|---|
| Desktop 1440 | **49** (44–60) | 23 | 156 |
| "Android intermediário" emulado (412×915, DPR 2,625, CPU 4×) | **35** (31–54) | 22 | 144 |

Num aparelho real com GPU, o número deve ser maior (cena com 22 chamadas de desenho e 156 triângulos). **Confirmar num Android intermediário real.**

### 1.5 Memória: abrir e fechar o tour 3 vezes (`desempenho-memoria.json`)

| Momento | Heap JS | Nós do DOM | Ouvintes | Canvas |
|---|---|---|---|---|
| antes | 2,81 MB | 767 | 62 | 0 |
| depois do 1º | 2,89 MB | 767 | 62 | 0 |
| depois do 2º | 2,98 MB | 767 | 62 | 0 |
| depois do 3º | 3,01 MB | 767 | 62 | 0 |

- **Vazamento achado e corrigido nesta sessão:** o `pointercancel` da janela era registrado com uma função anônima e nunca removido. Ele segurava a cena inteira.
  - Antes da correção: +0,2 MB, +9 nós e +5 ouvintes por ciclo.
  - Depois: nós, ouvintes e canvas voltam exatamente ao estado inicial.
- O heap ainda cresce cerca de 0,05 MB por ciclo. A diferença entre dois snapshots (5 ciclos) mostra só código compilado do V8 (InstructionStream, FeedbackVector) e entradas da Performance API. **Nenhum objeto do three.js ou do site fica retido.**

## 2. Acessibilidade

| Verificação | Resultado |
|---|---|
| **axe-core** (WCAG 2.0/2.1/2.2 A e AA + boas práticas), 11 rotas × 390 e 1440 px | **0 violações** (`a11y.json`). Corrigidos nesta sessão: `td-has-header` (régua da tabela de horário, agora com cabeçalho) e `landmark-unique` (duas regiões "Como chegar" em `/horarios`) |
| **Teclado do início ao fim** (`teclado-*.txt`) | Tab → "Pular abertura" (foco visível) → Enter → foco no H1 → Tab até "Falar com a equipe" (foco visível em cada passo) → `/a-casa`: setas pelas 7 zonas → quiz: Espaço marca → Enter abre o WhatsApp com os sinais. Ok em Chromium, WebKit e Firefox |
| **Leitor de tela no tour** (`leitor-tour-*.yml`, árvore de acessibilidade) | `tablist "Zonas da academia"` com 7 `tab` nomeadas, a ativa `[selected]`, e `tabpanel` com título, texto, equipamentos e o botão do WhatsApp |
| **Contraste** (`audit-contraste`) | 12 pares, 0 falhas |
| **Movimento reduzido** | sem abertura, nenhum vídeo toca sozinho, 3D só no clique |
| **Zoom 200%** (720 px) e reflow a 320 px | 0 rolagem horizontal nas 10 rotas |
| **Pausar vídeo** | o botão do hero pausa e retoma, com o rótulo trocando ("Pausar vídeo" ↔ "Tocar vídeo"); Chromium e WebKit |

## 3. Navegadores

| Motor | Navegação básica (10 rotas, 390 px, sem erro de JS, sem rolagem horizontal) | Teclado, leitor, reduzido, zoom | Observação |
|---|---|---|---|
| Chromium | ok | ok | funil e2e 12/12 (link exato do WhatsApp, 0 terceiros antes do consentimento) |
| WebKit (Safari iOS) | ok **depois da correção** | ok | **bug achado e corrigido:** `/maquinario` transbordava +4.864 px no WebKit (coluna implícita `auto` no card em grid, com a foto em proporção fixa). Agora `minmax(0, 1fr)`. 1 erro de JS intermitente em 1 de 8 rodadas, não reproduzido em 5 tentativas |
| Firefox | ok | ok | — |
| Android 390 px (Chromium, isMobile, toque) | ok | ok | — |
| **WebGL desligado** | `/a-casa` cai no fallback: 7 abas, 7 botões de WhatsApp por zona, foto e vídeo, sem erro (`a-casa-sem-webgl-390.png`) | | |

## 4. Acabamento (antes × depois, em `docs/qa/antes-depois/`)

| Correção | Captura |
|---|---|
| **Home, teaser "A Casa em 3D" em produção:** mostrava "Não foi possível abrir o tour 3D aqui" e a instrução "Arraste para olhar em volta" sem haver 3D. Agora não tenta carregar e não mostra a instrução quando a maquete não está aprovada | `home-teaser-390.jpg` |
| **Perguntas em `<details>`:** o triângulo nativo do navegador em `/planos` (e `/como-funciona`) virou o "+" fino da marca, igual ao da FAQ (regra global) | `planos-perguntas-390.jpg` |
| **Régua da tabela de horário:** cabeçalho acessível sem mudar o desenho | `horarios-tabela-390.jpg` |
| **Banner de consentimento × abertura:** o banner cobria o "Pular abertura" a partir de 2,0 s; agora aparece depois da abertura | `abertura-390-antes.jpg` × `abertura-390-depois.jpg` |
| **Aspas tipográficas:** as aspas retas da `/privacidade` viraram “ ” (varredura automática de aspas, apóstrofos, hífen como travessão, reticências e espaço antes de pontuação: 0 restantes) | — |
| **WebKit:** card do maquinário (ver §3) | `home-390-webkit.png` |

Já estavam certos: `text-wrap: balance` nos títulos e `pretty` no texto (sem viúvas nas capturas de 390 px), focos visíveis (conferidos no teste de teclado), caixa alta dos rótulos só por CSS, intervalos com meia-risca (5h–0h) e acentos.

**Ficou para o João** (conteúdo, não código):

- o card do Plano Prime em produção tem só o título e o botão, porque "o que inclui" está pendente;
- os objetos tipográficos das máquinas sem foto repetem o nome;
- a foto da esteira mostra logos de terceiros.

## 5. Outras correções desta sessão

- `src/tres/tour.ts`: vazamento do `pointercancel` (§1.5).
- `scripts/model-prepare.mjs`: os decodificadores Draco e Basis do three.js agora vão para `/modelos/libs/` (o caminho já era usado pelo carregador, mas a pasta não existia; só faria diferença com um GLB real com Draco ou KTX2).
- `scripts/capturar-abertura.mjs`: esperava imagens "lazy" que nunca carregam sem rolar.

## 6. Deploy

Configuração em `vercel.json` e `docs/DEPLOY.md`:

- CSP por hash (sem violação em todas as rotas, com abertura, 3D, consentimento e mapa);
- HSTS, Referrer-Policy, Permissions-Policy e COOP;
- cache de 1 ano `immutable` para `/_astro`, `/media` e `/modelos` (nomes com hash do conteúdo);
- previews sempre com `noindex`.

**O deploy em si não foi feito nesta sessão.** Precisa do projeto e da conta na Vercel, do domínio e do ffmpeg no build (§2 do DEPLOY).
