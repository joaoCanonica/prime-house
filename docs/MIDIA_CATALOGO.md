# Catálogo de mídia

Gerado em 2026-11-06 a partir de `media.manifest.json` (fonte única) e dos índices do `pnpm media:prepare`. Pesos medidos nos arquivos gerados.

- **Originais** em `media-originais/` (intactos, só `git mv`).
- **Publicáveis** em `public/media/<id>/` (fora do git, gerados no `predev`/`prebuild`).
- **Consentimento pendente** em `media-privada/<id>/` (fora do git e do site; só para revisão interna).
- **naoUsar**: nada é gerado.
- Folhas de contato: `docs/capturas/midia/` (`pnpm media:stills` regenera).
- Todos os vídeos são **mudos** (`audioLiberado=false` em tudo: a trilha dos vídeos do Instagram não tem direito confirmado).

## Trechos de vídeo

Tempos em segundos no arquivo original. "Pedido" é o que o Prompt 1 pediu; o ajuste foi conferido quadro a quadro (detecção de corte de cena + quadros a 4 fps).

| Trecho | Origem | Trecho (pedido → aplicado) | Uso | Pesos | Destino | Consentimento | Problemas |
|---|---|---|---|---|---|---|---|
| `letreiro-aceso` (loop) | snapinsta-1793897411209.mp4 | 1–2.6 → **1.5–3.1**<br><small>+0,5 s: até 1,5 s são máquinas Cimerian; em 1,50 s o letreiro está apagado e acende em 1,54 s</small> | abertura, hero | 720×1280: MP4 199 KB · WebM 170 KB<br>540×960: MP4 126 KB · WebM 110 KB | public/media/ | nao-precisa | em 1,71 s troca de plano: ACADEMIA fica esbranquiçado (balanço de branco do vídeo) |
| `interior-noite` (loop) | snapinsta-1793897411209.mp4 | 33–36.5 → **32.9–36.9**<br><small>início −0,1 s (corte em 32,83 s) e fim +0,4 s para incluir o plano das molduras de LED inteiro (corte em 36,96 s)</small> | hero, loop-hero | 720×1280: MP4 606 KB · WebM 464 KB<br>540×960: MP4 420 KB · WebM 338 KB<br>16:9 720×404: MP4 262 KB · WebM 222 KB | public/media/ | nao-precisa | 3 planos: interior com tela · janelas · molduras de LED · pessoas de camiseta laranja atrás das máquinas no 1º plano, sem rosto visível |
| `drone-entardecer` (loop) | snapinsta-1793897411209.mp4 | 37–38.8 → **37–38.5**<br><small>fim −0,3 s: transição com clarão a partir de 38,54 s</small> | abertura, como-chegar | 720×1280: MP4 386 KB · WebM 368 KB<br>540×960: MP4 260 KB · WebM 258 KB | public/media/ | nao-precisa | — |
| `drone-noite` (loop) | snapinsta-1793897411209.mp4 | 39–43.5 → **39–41.65**<br><small>fim −1,85 s (fora da tolerância): em 41,67 s corta para a cidade e o logo antigo aparece sobreposto a partir de ≈ 42,25 s</small> | abertura, como-chegar | 720×1280: MP4 362 KB · WebM 310 KB<br>540×960: MP4 267 KB · WebM 219 KB<br>16:9 720×404: MP4 174 KB · WebM 174 KB | public/media/ | nao-precisa | público na calçada visto do alto, não identificável |
| `equipe` | snapinsta-1793897411209.mp4 | 23–24.8 → **22.5–24.85**<br><small>início −0,5 s: a comemoração começa no corte de 22,46 s</small> | historia | 720×1280: MP4 588 KB · WebM 534 KB<br>540×960: MP4 407 KB · WebM 400 KB | media-privada/ | pendente (Lucas Moro: autorizado; equipe de laranja: pendente) | — |
| `lucas-discurso` | snapinsta-1793897411209.mp4 | 6–19 → **6.25–19.5**<br><small>início +0,25 s (1º quadro P&B) e fim +0,5 s (corte em 19,96 s)</small> | historia | 720×1280: MP4 2.19 MB · WebM 1.42 MB<br>540×960: MP4 1.52 MB · WebM 1.00 MB | media-privada/ | pendente (Lucas Moro: autorizado; convidados em inserções coloridas (8,46–10,0 s; 13,46–15,25 s): pendente) | P&B intercalado com inserções coloridas de convidados identificáveis · legendas queimadas pequenas no centro |
| `lucas-close` | snapinsta-1793897411209.mp4 | extra: **15.3–19.9**<br><small>trecho extra (não pedido): o maior bloco contínuo só com o Lucas, publicável enquanto as inserções do discurso estão pendentes</small> | historia | 720×1280: MP4 771 KB · WebM 562 KB<br>540×960: MP4 537 KB · WebM 404 KB | public/media/ | autorizado (Lucas Moro: autorizado) | legendas queimadas pequenas no centro |
| `fachada-dia` (loop) | snapinsta-1793977583042.mp4 | 0–1.8 → **0–2.2**<br><small>fim +0,4 s: o plano da fachada vai até 2,27 s</small> | como-chegar | 720×1280: MP4 354 KB · WebM 379 KB<br>540×960: MP4 232 KB · WebM 239 KB | public/media/ | nao-precisa | — |
| `acompanhamento` | snapinsta-1793977583042.mp4 | 2–24 → **2.3–24**<br><small>início +0,3 s: corte da fachada em 2,27 s</small> | acompanhamento, b-roll | 720×1280: MP4 6.14 MB · WebM 5.89 MB<br>540×960: MP4 4.21 MB · WebM 4.04 MB | media-privada/ | pendente (alunos e professores: pendente) | — |
| `filme-inauguracao` | snapinsta-1793897411209.mp4 | inteiro (0–47.042 s) | historia | 720×1280: MP4 8.34 MB · WebM 6.41 MB<br>540×960: MP4 5.81 MB · WebM 4.56 MB | media-privada/ | pendente (Lucas Moro: autorizado; equipe, convidados e público: pendente) | termina com o logo antigo (raster) sobreposto |
| `plano-prime` | SaveClip.App_AQMofoIF_D-okmtBHcVLFjVlxGdTGkCywPKrJBYW4X6vn-uM3v5ZBNy-T1A4GMMCwd48wXj1LC5Xyj0CPCqObL8PcRqejgyUSN4WZuM.mp4 | inteiro (0–36.467 s) | pagina-planos | — | não gerado (naoUsar) | autorizado (Lucas Moro: autorizado) | título queimado "BENEFÍCIOS DO PLANO PRIME" · termos vetados na legenda queimada · **NÃO USAR:** fala e legenda queimada com benefícios de campanha vetados ("matrícula é gratuita", "de graça", "o primeiro mês é por nossa conta") e comparação com o mercado; só o texto dos benefícios fixos é aproveitável |
| `avaliacao-funcional` | snapinsta-1793897488769.mp4 | inteiro (0–22.033 s) | como-funciona | 720×1280: MP4 2.80 MB · WebM 2.04 MB<br>540×960: MP4 1.87 MB · WebM 1.46 MB | public/media/ | autorizado (Lucas Moro: autorizado) | fala compara com "outras academias" (seção 8: decidir com o João na sessão 9) · título queimado "SEU TREINO FEITO PARA VOCÊ" |
| `plano-select` | snapinsta-1793898722421.mp4 | inteiro (0–15.633 s) | pagina-planos | 720×1280: MP4 2.14 MB · WebM 1.88 MB<br>540×960: MP4 1.43 MB · WebM 1.32 MB | media-privada/ | pendente (professora (nome pendente): pendente) | título queimado "SEU TREINO COM ACOMPANHAMENTO EXCLUSIVO" |

## Stills (quadros de vídeo, sem upscale, 720×1280)

| Still | Origem | Tempo (pedido → aplicado) | Uso | Pesos | Destino | Problemas |
|---|---|---|---|---|---|---|
| `still-letreiro-aceso` | snapinsta-1793897411209.mp4 | 1.5 → **1.6**<br><small>+0,1 s: em 1,50 s o letreiro ainda está apagado</small> | abertura, poster | 480: AVIF 15 KB · WebP 24 KB<br>720: AVIF 27 KB · WebP 36 KB | public/media/ | quadro de vídeo recomprimido (720×1280) |
| `still-maquina-cimerian` | snapinsta-1793897411209.mp4 | 0.3 → **1.2**<br><small>+0,9 s (fora da tolerância): em 0,3 s é o drone da cidade; o logo CIMERIAN aparece de 1,0 a 1,37 s</small> | maquinario | 480: AVIF 26 KB · WebP 36 KB<br>720: AVIF 44 KB · WebP 59 KB | public/media/ | quadro de vídeo recomprimido (720×1280) · logo da máquina cortado ("CIME…") |
| `still-anilha` | snapinsta-1793897411209.mp4 | 10 → **10.1** | maquinario | 480: AVIF 7 KB · WebP 9 KB<br>720: AVIF 11 KB · WebP 15 KB | public/media/ | quadro de vídeo recomprimido (720×1280) |
| `still-halteres` | snapinsta-1793897411209.mp4 | 32 → **32.4**<br><small>+0,4 s: em 32,0 s ainda é o drone (corte em 32,13 s)</small> | maquinario | 480: AVIF 19 KB · WebP 30 KB<br>720: AVIF 30 KB · WebP 48 KB | public/media/ | quadro de vídeo recomprimido (720×1280) |
| `still-interior` | snapinsta-1793897411209.mp4 | 34 → **34** | hero, poster | 480: AVIF 18 KB · WebP 24 KB<br>720: AVIF 28 KB · WebP 36 KB | public/media/ | quadro de vídeo recomprimido (720×1280) · pessoas atrás das máquinas, sem rosto visível |
| `still-drone-noite` | snapinsta-1793897411209.mp4 | 40 → **40** | abertura, como-chegar | 480: AVIF 25 KB · WebP 32 KB<br>720: AVIF 42 KB · WebP 52 KB | public/media/ | quadro de vídeo recomprimido (720×1280) |
| `still-fachada-dia` | snapinsta-1793977583042.mp4 | 0.5 → **0.5** | como-chegar | 480: AVIF 18 KB · WebP 27 KB<br>720: AVIF 32 KB · WebP 50 KB | public/media/ | quadro de vídeo recomprimido (720×1280) |
| `still-logo-final` | snapinsta-1793897411209.mp4 | 45 → **45** | referencia-marca | — | não gerado (naoUsar) | quadro de vídeo recomprimido (720×1280) · logo antigo em raster sobre preto: só referência · **NÃO USAR:** logo raster do vídeo: o site usa os SVG |

## Recortes "Conforto" (carrossel Diferenciais, sem o texto queimado)

| Recorte | Arquivo | Legenda original | Caixa (x,y,l×a) | Pesos | Consentimento | Problemas |
|---|---|---|---|---|---|---|
| `conforto-banheiro` | SaveClip.App_845977344_17911199055492781_3994501073168340219_n.jpg | BANHEIRO COMPLETO | 0,0,932×840 | 480: AVIF 12 KB · WebP 18 KB<br>800: AVIF 25 KB · WebP 35 KB<br>932: AVIF 30 KB · WebP 42 KB | nao-precisa | — |
| `conforto-geladeira` | SaveClip.App_846504646_17911198986492781_6260922188815430029_n.jpg | GELADEIRA RECHEADA | 0,0,1080×972 | 480: AVIF 16 KB · WebP 23 KB<br>800: AVIF 33 KB · WebP 48 KB<br>1080: AVIF 51 KB · WebP 73 KB | nao-precisa | marcas de terceiros visíveis (latas Monster, sucos) |
| `conforto-lanches` | SaveClip.App_846564071_17911199094492781_8240580773448899568_n.jpg | LANCHES | 0,0,1080×972 | 480: AVIF 12 KB · WebP 16 KB<br>800: AVIF 22 KB · WebP 28 KB<br>1080: AVIF 30 KB · WebP 40 KB | nao-precisa | — |
| `conforto-treino-app` | SaveClip.App_847550139_17911199022492781_2178908052362222795_n.jpg | TREINO PERSONALIZADO | 0,0,1080×972 | 480: AVIF 7 KB · WebP 9 KB<br>800: AVIF 14 KB · WebP 17 KB<br>1080: AVIF 20 KB · WebP 23 KB | nao-precisa | mão de pessoa sem identificação (sem rosto) |
| `conforto-cafe` | SaveClip.App_847884739_17911198995492781_6593192510458779125_n.jpg | CAFÉZINHO | 0,0,1014×913 | 480: AVIF 12 KB · WebP 16 KB<br>800: AVIF 25 KB · WebP 31 KB<br>1014: AVIF 34 KB · WebP 43 KB | nao-precisa | marca de terceiro visível (Philips Walita) |
| `conforto-esteira-tv` | SaveClip.App_848072561_17911198983492781_6163979058481924784_n.jpg | ESTEIRA COM TV | 0,0,1080×972 | 480: AVIF 14 KB · WebP 22 KB<br>800: AVIF 32 KB · WebP 51 KB<br>1080: AVIF 57 KB · WebP 95 KB | nao-precisa | logos de terceiros na tela (YouTube, Netflix, Disney+, Prime Video, Spotify, X, Instagram, Facebook) |
| `conforto-parede-logo` | SaveClip.App_848412619_17911199010492781_1819738097922439789_n.jpg | SÓ TEM AQUI | 0,0,1080×1026 | 480: AVIF 11 KB · WebP 21 KB<br>800: AVIF 23 KB · WebP 42 KB<br>1080: AVIF 39 KB · WebP 66 KB | nao-precisa | — |
| `conforto-espaco-kids` | SaveClip.App_849332230_17911199019492781_5364042096927999151_n.jpg | ESPAÇO KIDS | 0,0,1004×904 | 480: AVIF 22 KB · WebP 32 KB<br>800: AVIF 42 KB · WebP 59 KB<br>1004: AVIF 55 KB · WebP 78 KB | nao-precisa | embalagens com personagens licenciados (Disney) visíveis · conferido: sem crianças na imagem, só brinquedos e material de desenho |

## Originais

| # | Id | Arquivo | Tipo | Resolução | Uso | Derivados | Consentimento | Problemas |
|---|---|---|---|---|---|---|---|---|
| 0 | `captura-00` | fotos/capturas/Captura de tela de 2026-08-08 23-55-01.png | captura | 705×879 | conferencia-de-dado | — | nao-precisa | captura de tela em baixa resolução (≈ 380–900 px); nunca vira imagem grande · **NÃO USAR:** arte de horário: serve só para conferência de dado |
| 1 | `captura-01` | fotos/capturas/Captura de tela de 2026-11-05 13-41-33.png | captura | 898×896 (máx. 480) | referencia-3d, galeria-pequena | 480: AVIF 26 KB · WebP 45 KB<br>public/media/ | nao-precisa | captura de tela em baixa resolução (≈ 380–900 px); nunca vira imagem grande |
| 2 | `captura-02` | fotos/capturas/Captura de tela de 2026-11-05 13-42-19.png | captura | 380×514 (máx. 380) | referencia-3d, galeria-pequena | 380: AVIF 34 KB · WebP 52 KB<br>public/media/ | nao-precisa | captura de tela em baixa resolução (≈ 380–900 px); nunca vira imagem grande |
| 3 | `captura-03` | fotos/capturas/Captura de tela de 2026-11-05 13-42-33.png | captura | 514×503 (máx. 480) | referencia-3d, galeria-pequena, referencia-marca, como-chegar | 480: AVIF 14 KB · WebP 27 KB<br>public/media/ | nao-precisa | captura de tela em baixa resolução (≈ 380–900 px); nunca vira imagem grande |
| 4 | `captura-04` | fotos/capturas/Captura de tela de 2026-11-05 13-43-46.png | captura | 514×510 (máx. 480) | referencia-3d, galeria-pequena | 480: AVIF 27 KB · WebP 44 KB<br>public/media/ | nao-precisa | captura de tela em baixa resolução (≈ 380–900 px); nunca vira imagem grande |
| 5 | `captura-05` | fotos/capturas/Captura de tela de 2026-11-05 13-43-53.png | captura | 385×501 (máx. 385) | referencia-3d, galeria-pequena | 385: AVIF 27 KB · WebP 44 KB<br>public/media/ | nao-precisa | captura de tela em baixa resolução (≈ 380–900 px); nunca vira imagem grande |
| 6 | `captura-06` | fotos/capturas/Captura de tela de 2026-11-05 13-44-00.png | captura | 378×506 (máx. 378) | referencia-3d, galeria-pequena, luz-de-treino | 378: AVIF 28 KB · WebP 44 KB<br>public/media/ | nao-precisa | captura de tela em baixa resolução (≈ 380–900 px); nunca vira imagem grande |
| 7 | `captura-07` | fotos/capturas/Captura de tela de 2026-11-05 13-44-08.png | captura | 510×507 (máx. 480) | referencia-3d, galeria-pequena, luz-de-treino | 480: AVIF 20 KB · WebP 32 KB<br>public/media/ | nao-precisa | captura de tela em baixa resolução (≈ 380–900 px); nunca vira imagem grande |
| 8 | `captura-08` | fotos/capturas/Captura de tela de 2026-11-05 13-44-14.png | captura | 505×509 (máx. 480) | referencia-3d, galeria-pequena, luz-de-treino | 480: AVIF 27 KB · WebP 46 KB<br>public/media/ | nao-precisa | captura de tela em baixa resolução (≈ 380–900 px); nunca vira imagem grande |
| 9 | `captura-09` | fotos/capturas/Captura de tela de 2026-11-05 13-44-24.png | captura | 506×514 (máx. 480) | referencia-3d, galeria-pequena, luz-de-treino | 480: AVIF 28 KB · WebP 46 KB<br>public/media/ | nao-precisa | captura de tela em baixa resolução (≈ 380–900 px); nunca vira imagem grande |
| 10 | `captura-10` | fotos/capturas/Captura de tela de 2026-11-05 13-44-30.png | captura | 508×510 (máx. 480) | referencia-3d, galeria-pequena, luz-de-treino | 480: AVIF 30 KB · WebP 51 KB<br>public/media/ | nao-precisa | captura de tela em baixa resolução (≈ 380–900 px); nunca vira imagem grande |
| 11 | `captura-11` | fotos/capturas/Captura de tela de 2026-11-05 13-44-42.png | captura | 506×507 (máx. 480) | referencia-3d, galeria-pequena, luz-de-treino | 480: AVIF 30 KB · WebP 49 KB<br>public/media/ | nao-precisa | captura de tela em baixa resolução (≈ 380–900 px); nunca vira imagem grande |
| 12 | `captura-12` | fotos/capturas/Captura de tela de 2026-11-05 13-44-49.png | captura | 512×505 (máx. 480) | referencia-3d, galeria-pequena, luz-de-treino | 480: AVIF 26 KB · WebP 41 KB<br>public/media/ | nao-precisa | captura de tela em baixa resolução (≈ 380–900 px); nunca vira imagem grande |
| 13 | `captura-13` | fotos/capturas/Captura de tela de 2026-11-05 13-44-56.png | captura | 511×509 (máx. 480) | referencia-3d, galeria-pequena, luz-de-treino | 480: AVIF 28 KB · WebP 47 KB<br>public/media/ | nao-precisa | captura de tela em baixa resolução (≈ 380–900 px); nunca vira imagem grande |
| 14 | `diferencial-banheiro` | fotos/SaveClip.App_845977344_17911199055492781_3994501073168340219_n.jpg | arte-instagram | 932×1166 | fonte-recorte | — | nao-precisa | texto queimado na arte (não apagar por IA: só recorte) |
| 15 | `diferencial-geladeira` | fotos/SaveClip.App_846504646_17911198986492781_6260922188815430029_n.jpg | arte-instagram | 1080×1350 | fonte-recorte | — | nao-precisa | texto queimado na arte (não apagar por IA: só recorte) · marcas de terceiros visíveis (latas Monster, sucos) |
| 16 | `diferencial-lanches` | fotos/SaveClip.App_846564071_17911199094492781_8240580773448899568_n.jpg | arte-instagram | 1080×1350 | fonte-recorte | — | nao-precisa | texto queimado na arte (não apagar por IA: só recorte) |
| 17 | `diferencial-treino-app` | fotos/SaveClip.App_847550139_17911199022492781_2178908052362222795_n.jpg | arte-instagram | 1080×1350 | fonte-recorte | — | nao-precisa | texto queimado na arte (não apagar por IA: só recorte) · mão de pessoa sem identificação (sem rosto) |
| 18 | `diferencial-cafe` | fotos/SaveClip.App_847884739_17911198995492781_6593192510458779125_n.jpg | arte-instagram | 1014×1268 | fonte-recorte | — | nao-precisa | texto queimado na arte (não apagar por IA: só recorte) · marca de terceiro visível (Philips Walita) |
| 19 | `diferencial-esteira-tv` | fotos/SaveClip.App_848072561_17911198983492781_6163979058481924784_n.jpg | arte-instagram | 1080×1350 | fonte-recorte | — | nao-precisa | texto queimado na arte (não apagar por IA: só recorte) · logos de terceiros na tela (YouTube, Netflix, Disney+, Prime Video, Spotify, X, Instagram, Facebook) |
| 20 | `diferencial-parede-logo` | fotos/SaveClip.App_848412619_17911199010492781_1819738097922439789_n.jpg | arte-instagram | 1080×1350 | fonte-recorte | — | nao-precisa | texto queimado na arte (não apagar por IA: só recorte) |
| 21 | `diferencial-espaco-kids` | fotos/SaveClip.App_849332230_17911199019492781_5364042096927999151_n.jpg | arte-instagram | 1004×1255 | fonte-recorte | — | nao-precisa | texto queimado na arte (não apagar por IA: só recorte) · embalagens com personagens licenciados (Disney) visíveis · conferido: sem crianças na imagem, só brinquedos e material de desenho |
| 22 | `nunca-e-tarde-1` | fotos/SaveClip.App_853932337_17913436257492781_179173914112890193_n.jpg | arte-instagram | 1080×1350 | texto-sessao-5 | — | pendente (alunos e/ou professores reais: pendente) | texto queimado na arte (não apagar por IA: só recorte) · alunos reais identificáveis: não publicar a foto; só o texto (sessão 5) |
| 23 | `nunca-e-tarde-2` | fotos/SaveClip.App_864468457_17913436290492781_1061048777361938273_n.jpg | arte-instagram | 1080×1350 | texto-sessao-5 | — | pendente (alunos e/ou professores reais: pendente) | texto queimado na arte (não apagar por IA: só recorte) · alunos reais identificáveis: não publicar a foto; só o texto (sessão 5) |
| 24 | `nunca-e-tarde-3` | fotos/SaveClip.App_865463905_17913436317492781_19569915211908405_n.jpg | arte-instagram | 1080×1350 | texto-sessao-5 | — | pendente (alunos e/ou professores reais: pendente) | texto queimado na arte (não apagar por IA: só recorte) · alunos reais identificáveis: não publicar a foto; só o texto (sessão 5) |
| 25 | `nunca-e-tarde-4` | fotos/SaveClip.App_868416070_17913436281492781_8390202927999876998_n.jpg | arte-instagram | 1080×1350 | texto-sessao-5 | — | pendente (alunos e/ou professores reais: pendente) | texto queimado na arte (não apagar por IA: só recorte) · alunos reais identificáveis: não publicar a foto; só o texto (sessão 5) |
| 26 | `nunca-e-tarde-5` | fotos/SaveClip.App_868430560_17913436299492781_3877107341145945688_n.jpg | arte-instagram | 1080×1350 | texto-sessao-5 | — | pendente (alunos e/ou professores reais: pendente) | texto queimado na arte (não apagar por IA: só recorte) · alunos reais identificáveis: não publicar a foto; só o texto (sessão 5) |
| 27 | `nunca-e-tarde-6` | fotos/SaveClip.App_869133379_17913436248492781_3806003063243973995_n.jpg | arte-instagram | 1080×1350 | texto-sessao-5 | — | pendente (fisioterapeuta e aluna: pendente) | texto queimado na arte (não apagar por IA: só recorte) · alunos reais identificáveis: não publicar a foto; só o texto (sessão 5) |
| 28 | `nunca-e-tarde-7` | fotos/SaveClip.App_871123010_17913436266492781_2611942064499383461_n.jpg | arte-instagram | 1080×1350 | texto-sessao-5 | — | pendente (alunos e/ou professores reais: pendente) | texto queimado na arte (não apagar por IA: só recorte) · alunos reais identificáveis: não publicar a foto; só o texto (sessão 5) |
| 29 | `cinco-sinais-1` | fotos/SaveClip.App_881518777_17914568712492781_7468329406845269891_n.jpg | arte-instagram | 1080×1350 | texto-sessao-5 | — | pendente (alunos e professores reais: pendente) | texto queimado na arte (não apagar por IA: só recorte) · alunos reais identificáveis: não publicar a foto; só o texto (sessão 5) |
| 30 | `cinco-sinais-2` | fotos/SaveClip.App_881675739_17914568697492781_5192923115881241083_n.jpg | arte-instagram | 1080×1350 | texto-sessao-5 | — | pendente (alunos e professores reais: pendente) | texto queimado na arte (não apagar por IA: só recorte) · alunos reais identificáveis: não publicar a foto; só o texto (sessão 5) |
| 31 | `cinco-sinais-3` | fotos/SaveClip.App_887061865_17914568673492781_5183857489782217507_n.jpg | arte-instagram | 1080×1350 | texto-sessao-5 | — | pendente (alunos e professores reais: pendente) | texto queimado na arte (não apagar por IA: só recorte) · alunos reais identificáveis: não publicar a foto; só o texto (sessão 5) |
| 32 | `cinco-sinais-4` | fotos/SaveClip.App_887849578_17914568700492781_6938366137380403736_n.jpg | arte-instagram | 1080×1350 | texto-sessao-5 | — | pendente (alunos e professores reais: pendente) | texto queimado na arte (não apagar por IA: só recorte) · alunos reais identificáveis: não publicar a foto; só o texto (sessão 5) |
| 33 | `cinco-sinais-5` | fotos/SaveClip.App_888159995_17914568721492781_6331262322135197026_n.jpg | arte-instagram | 1080×1350 | texto-sessao-5 | — | pendente (alunos e professores reais: pendente) | texto queimado na arte (não apagar por IA: só recorte) · alunos reais identificáveis: não publicar a foto; só o texto (sessão 5) |
| 34 | `cinco-sinais-6` | fotos/SaveClip.App_888936613_17914568682492781_4871908470183985471_n.jpg | arte-instagram | 1080×1350 | texto-sessao-5 | — | pendente (alunos e professores reais: pendente) | texto queimado na arte (não apagar por IA: só recorte) · alunos reais identificáveis: não publicar a foto; só o texto (sessão 5) |
|  | `marca-logo` | marca/primehouse-logo.svg | marca | vetor | marca | — | nao-precisa | laranja oficial e manual de marca pendentes |
|  | `marca-logo-linha` | marca/primehouse-logo-linha.svg | marca | vetor | marca | — | nao-precisa | laranja oficial e manual de marca pendentes |
|  | `marca-logo-mono` | marca/primehouse-logo-mono.svg | marca | vetor | marca | — | nao-precisa | laranja oficial e manual de marca pendentes |
|  | `marca-logo-preto` | marca/primehouse-logo-preto.svg | marca | vetor | marca | — | nao-precisa | laranja oficial e manual de marca pendentes |
| 35 | `marca-avatar-png` | marca/primelogo.png | marca | 150×150 | — | — | nao-precisa | **NÃO USAR:** substituído pelos SVG |
|  | `marca-comparacao-png` | marca/primehouse-logo-comparacao.png | marca | 1240×560 | — | — | nao-precisa | **NÃO USAR:** documento interno de comparação |
|  | `video-inauguracao` | videos/snapinsta-1793897411209.mp4 | video | 720×1280 · 47.042 s | fonte-trechos | — | pendente (Lucas Moro: autorizado; equipe, convidados e público: pendente) | vídeo baixado do Instagram (720×1280, recomprimido) · legendas queimadas · áudio com música: direitos não confirmados (audioLiberado=false) |
|  | `video-rotina` | videos/snapinsta-1793977583042.mp4 | video | 720×1280 · 25.267 s | fonte-trechos | — | pendente (alunos e professores: pendente) | vídeo baixado do Instagram (720×1280, recomprimido) · legendas queimadas · áudio com música: direitos não confirmados (audioLiberado=false) |
|  | `video-plano-prime` | videos/SaveClip.App_AQMofoIF_D-okmtBHcVLFjVlxGdTGkCywPKrJBYW4X6vn-uM3v5ZBNy-T1A4GMMCwd48wXj1LC5Xyj0CPCqObL8PcRqejgyUSN4WZuM.mp4 | video | 720×1280 · 36.467 s | fonte-trechos | — | autorizado (Lucas Moro: autorizado) | vídeo baixado do Instagram (720×1280, recomprimido) · legendas queimadas · áudio com música: direitos não confirmados (audioLiberado=false) |
|  | `video-avaliacao-funcional` | videos/snapinsta-1793897488769.mp4 | video | 720×1280 · 22.033 s | fonte-trechos | — | autorizado (Lucas Moro: autorizado) | vídeo baixado do Instagram (720×1280, recomprimido) · legendas queimadas · áudio com música: direitos não confirmados (audioLiberado=false) |
|  | `video-plano-select` | videos/snapinsta-1793898722421.mp4 | video | 720×1280 · 15.633 s | fonte-trechos | — | pendente (professora (nome pendente): pendente) | vídeo baixado do Instagram (720×1280, recomprimido) · legendas queimadas · áudio com música: direitos não confirmados (audioLiberado=false) |

## Textos e falas (para a sessão 5)

Transcritos das artes e das legendas queimadas. As **fotos** dos carrosséis 22–34 não são publicadas (alunos reais, consentimento pendente); o **texto** é aproveitável, respeitando a seção 8.

- **22** (carrossel "Nunca é tarde"): "Na Prime House, cada pessoa tem sua história, seu ritmo e seus objetivos."
- **23** (carrossel "Nunca é tarde"): "Treinar equilíbrio e força também contribui para mais segurança nas atividades do dia a dia."
- **24** (carrossel "Nunca é tarde"): "Envelhecer faz parte da vida. Perder sua independência não precisa fazer parte dos seus planos."
- **25** (carrossel "Nunca é tarde"): "Você não precisa acompanhar o ritmo de ninguém. Precisa respeitar o seu e continuar evoluindo."
- **26** (carrossel "Nunca é tarde"): "Mais qualidade de vida hoje. Mais autonomia para o amanhã."
- **27** (carrossel "Nunca é tarde"): "O cuidado com você não tem idade."
- **28** (carrossel "Nunca é tarde"): "A musculação ajuda a preservar a força e a massa muscular."
- **29** (DfS0m0Co4yf (03/11/2026) · carrossel "5 sinais"): "Você aumenta a carga sem ter certeza de que consegue manter a técnica."
- **30** (DfS0m0Co4yf (03/11/2026) · carrossel "5 sinais"): "Seu treino nunca muda, mesmo quando seus objetivos e sua capacidade evoluem."
- **31** (DfS0m0Co4yf (03/11/2026) · carrossel "5 sinais"): "5 sinais de que seu treino precisa de mais atenção."
- **32** (DfS0m0Co4yf (03/11/2026) · carrossel "5 sinais"): "Treinar com orientação faz diferença. Seu treino precisa acompanhar você, e não o contrário."
- **33** (DfS0m0Co4yf (03/11/2026) · carrossel "5 sinais"): "Você termina a sessão sem entender o que está tentando desenvolver."
- **34** (DfS0m0Co4yf (03/11/2026) · carrossel "5 sinais"): "Você faz os exercícios, mas não sabe se está executando corretamente."

- **video-plano-prime**: "Aqui na Prime House a tua matrícula é gratuita, e você ainda tem quatorze dias de garantia. Se você vir e não gostar de qualquer coisa, a gente devolve 100% do teu dinheiro. Não são sete dias como normalmente o mercado fala, e isso é porque a gente confia muito no nosso trabalho. Além de tudo, no plano anual você ainda pode trancar ele por trinta dias e usar depois, pra você não perder absolutamente nada. Nós também temos a Sexta Prime, que você pode trazer toda sexta-feira algum amigo ou algum familiar pra treinar junto contigo de graça. E o melhor de tudo é que fechando hoje teu plano, o primeiro mês é por nossa conta. Chama a equipe e vem pra Prime House."
- **video-avaliacao-funcional**: "Aqui na Prime House você não recebe um treino padrão [como em] outras academias. Você passa por uma avaliação funcional junto com o professor pra entender toda tua situação, todos os teus objetivos, e montar um treino específico pra você. E isso é lógico: [cada] aluno é diferente e teu treino tem que respeitar isso. Vem treinar com a gente e para de só ir pra academia e não ter resultado nenhum."
- **video-plano-select**: "Já pensou em ter um professor como personal dentro da academia? Com o Plano Select da Prime House você tem um professor dedicado exclusivamente a você durante o treino, com acompanhamento e orientação individualizados. Quer saber mais? Manda uma mensagem pra gente!"

## O que não deu

- **16:9 de verdade não existe**: os vídeos são verticais 720×1280. O recorte 16:9 do `interior-noite` e do `drone-noite` sai em **720×404** (sem upscale, recorte por plano). Serve a até ≈ 720 px de largura (cartão, "Como chegar"); **não serve** para hero de tela cheia no desktop. Nada foi preenchido nem ampliado por IA.
- **`drone-noite` mais curto** (2,65 s em vez de 4,5 s): depois de 41,67 s o vídeo corta para a cidade e o logo antigo aparece sobreposto a partir de ≈ 42,25 s.
- **`lucas-discurso`** tem inserções coloridas de convidados (8,46–10,0 s e 13,46–15,25 s) → fica pendente. Criei **`lucas-close`** (15,3–19,9 s, só o Lucas), publicável.
- **`plano-prime` não é usado**: a fala e a legenda queimada dizem "matrícula é gratuita", "de graça" e "o primeiro mês é por nossa conta" (vetados, seção 8). Os benefícios fixos (14 dias, trancamento, Sexta Prime) seguem pendentes de confirmação por escrito.
- **`avaliacao-funcional`** diz "você não recebe um treino padrão [como em] outras academias": comparação com concorrentes. Gerado e publicável por consentimento, mas a decisão de uso é do João (sessão 9).
- Legendas e títulos queimados não foram removidos (proibido apagar por IA).

## O que pedir ao marketing

1. **Vídeos originais** (sem legenda, sem música, sem logo sobreposto) do filme da inauguração, com o **drone completo** (noite e entardecer), e dos vídeos de rotina. Idealmente **horizontais 4K** além dos verticais: é o que permite um hero 16:9 de verdade.
2. **Fotos em alta do interior** (15 a 25): sala vazia com as molduras de LED acesas, horizontal e vertical: recepção, cardio (esteira com a tela ligada), vestiários, espaço kids, café, sala de avaliação, fachada de dia e à noite.
3. **Para o 3D**: planta baixa com medidas e posição das máquinas, lista do maquinário (modelos Cimerian) e uma captura 3D por zona (roteiro na investigação, §9).
4. **Autorizações de imagem**: equipe da inauguração, alunos e professores do vídeo de rotina e dos carrosséis, professora do Plano Select, fisioterapeuta, convidados do discurso. Com nome e, para professores, CREF.
5. **Liberação de áudio** (trilha dos vídeos) se quiserem versão com som do filme da inauguração.
6. **Manual de marca e logo original**, com o laranja oficial.
7. Uma versão do **Plano Prime** sem os benefícios de campanha, se quiserem o vídeo no site.
