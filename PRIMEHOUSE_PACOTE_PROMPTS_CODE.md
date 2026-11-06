# Prime House Academia: pacote de prompts para o Claude Code (Opus)

Versão 1 · 06/11/2026 · WAXLO

Base:
- `PRIMEHOUSE_INVESTIGACAO_CLIENTE.md`: investigação, oferta, regras, plano do 3D, SEO/GEO.
- `PRIMEHOUSE_MAPA_MIDIA.md`: cada arquivo avaliado, trechos com tempo, falas transcritas.
- `PRIMEHOUSE_AVALIACOES_GOOGLE.json`.
- Logos em `assets/`: `primehouse-logo.svg`, `-preto.svg`, `-mono.svg`, `-linha.svg`.

Repositório: `github.com/joaoCanonica/prime-house`.

---

## Como usar (ordem exata)

1. **Antes da sessão 0**, coloque na raiz do repositório: `PRIMEHOUSE_INVESTIGACAO_CLIENTE.md`, `PRIMEHOUSE_MAPA_MIDIA.md`, `PRIMEHOUSE_PACOTE_PROMPTS_CODE.md` e `PRIMEHOUSE_AVALIACOES_GOOGLE.json`. Em `assets/` vão os 4 SVG do logo. O PNG de comparação é só para você.
2. Abra o Claude Code (Opus) **na pasta do repositório**.
3. **Sessão 0:** cole o bloco da seção B e, logo abaixo, o Prompt 0. **Sem anexos.**
4. **Sessões 1 a 9:** uma sessão nova para cada, colando **só o prompt**. Não junte prompts. Cada sessão termina em commit.
5. Quando chegar material novo:
   - fotos em alta, vídeos originais, autorizações → **Prompt L**;
   - **planta baixa e captura 3D** → **Prompt 3D**;
   - dado novo (laranja oficial, benefícios confirmados, CREF, CNPJ, domínio, WhatsApp) → **Prompt D**.
6. Depois das sessões **1, 3, 4, 6A, 6B e 9**, me traga o relatório e as capturas (390 e 1440 px). Eu audito antes de você seguir.
7. Ordem: 0 Fundação · 1 Mídia · 2 Config · 3 Design system · 4 Abertura e hero · 5 Textos · 6A Home · 6B A Casa (3D) · 6C Páginas · 7 Funil e LGPD · 8 SEO e GEO · 9 QA e deploy.

---

## A. Dados fixos (a sessão 2 transforma em config)

| Campo | Valor | Estado |
|---|---|---|
| Nome | **Prime House Academia** | CONFIRMADO. Nunca usar "LM Prime House" |
| Endereço | **Av. Duque de Caxias, 1253, Frei Rogério, Lages/SC, CEP 88508-001** | CONFIRMADO (João + Google) |
| Coordenadas | -27.8013201, -50.3148959 · plus code 5MXP+F2 | VISTO (Google) |
| Telefone / WhatsApp | (49) 99804-3861 · wa.me/5549998043861 | CONFIRMADO (João). Confirmar se é o mesmo número do link curto da bio |
| Instagram | @primehouse.academia | CONFIRMADO |
| Horário | seg–sex 05:00–00:00 · sáb 08:00–18:00 · dom 09:00–12:00 e 15:00–18:00 · feriados como domingo | CONFIRMADO (João + post fixado) |
| Inauguração | 30/04/2026 | CONFIRMADO |
| Fundador | Lucas Moro (LM Team) | CONFIRMADO (bio dele) |
| Maquinário | 100% Cimerian (marca nacional) | CONFIRMADO (posts) |
| Diferenciais com prova | 5 puxadas altas; agachamento pêndulo; esteiras com TV (YouTube, Netflix, Disney+, Prime Video, Spotify); climatização; banheiro e vestiário completos; geladeira com bebidas; lanches; café; **espaço kids**; treino personalizado em app/tablet; avaliação funcional; fisioterapeuta; treino adaptado (+40, idosos, artrose, pós-AVC, lipedema, gestantes); suplementos; convênio Estar Bem | VISTO (posts, carrossel de diferenciais, vídeos) |
| Planos | **Plano Prime** · **Plano Select** (professor dedicado, como personal) · **Plano Duo** (2ª pessoa com 50%) | VISTO. Preço: não publicar |
| Benefícios fixos (Lucas) | **garantia de 14 dias** com 100% de devolução · **trancar o plano anual por 30 dias** · **Sexta Prime** (trazer amigo ou familiar toda sexta, de graça) | VISTO no vídeo. **Confirmar por escrito antes de publicar** |
| Benefícios de campanha | matrícula grátis; 1º mês grátis; "Fecha Mês" | NÃO publicar (muda todo mês) |
| Google | 4,7 · 11 avaliações · 04/11/2026 | VISTO. **Não exibir nota** até 50+ |
| Laranja da marca | ≈ #EC8A2A (medido no avatar) | PROVISÓRIO: confirmar o oficial |
| CNPJ / CREF responsável técnico / domínio / m² / nº de máquinas | — | PENDENTE |

**Decisões do João:** site minimalista e muito premium, com abertura e hero, interatividade, **3D da academia**, "do minimalismo ao realismo", tudo bem desenhado. O cliente é exigente e não tolera erro nem coisa simples.

---

## B. BLOCO "CONTEXTO DO PROJETO" (colar só na sessão 0)

````text
CONTEXTO DO PROJETO — Prime House Academia (site premium com 3D)
Idioma de tudo (código, comentários curtos, textos, relatórios): português do Brasil.

1. QUEM E O QUÊ
- Cliente: Prime House Academia, academia de musculação premium de trânsito livre, Av. Duque de Caxias, 1253, Frei Rogério, Lages/SC. Inaugurada em 30/04/2026. Fundador: Lucas Moro (treinador, LM Team).
- Tese (deles): "o novo padrão de academia em Lages". Não é academia de rede: "aqui você tem nome e história". Sem superlotação, sem fila de aparelho. Atendimento acima da média. 100% maquinário Cimerian (nacional).
- Prova: 5 puxadas altas, agachamento pêndulo, esteiras com TV, climatização, banheiro completo, café, lanches, geladeira, espaço kids, avaliação funcional + treino individual em app, professores em desenvolvimento contínuo, fisioterapeuta, treino adaptado (+40, idosos, artrose, pós-AVC, lipedema, gestantes), Plano Select (professor dedicado), Plano Duo, garantia de 14 dias, Sexta Prime, horário 5h–0h em dias úteis.
- Voz (frases reais): "Cada detalhe foi pensado para você querer voltar amanhã." · "O treino já é pesado, o ambiente não deve ser." · "Aqui, você não precisa chegar pronto. Só precisa chegar." · "Aqui, a gente não cuida só de corpos. A gente cuida de pessoas." · "Sua rotina não precisa se adaptar à academia. A academia precisa se adaptar à sua rotina." · "O importante não é amar cada treino, é entender o valor de continuar." · "Uma ficha é importante, mas o acompanhamento também." · "O cuidado com você não tem idade."
- OBJETIVO (nesta ordem): (1) o visitante sente que conheceu o espaço e chama no WhatsApp para treinar; (2) Google e IAs descrevem a Prime House como academia premium, independente, 100% Cimerian e sem lotação (hoje: 11 avaliações, sem site); (3) recrutar (eles contratam com frequência).
- Meta do João (CEO da WAXLO): minimalista, muito premium, abertura e hero memoráveis, interatividade e 3D da academia. Zero erro, zero "cara de IA", zero visual "fitness genérico".
- Regra do projeto: o site primeiro. A conferência de normas (CDC/CONAR, LGPD, CREF, direito de imagem) é UMA passada no final (sessão 9), mas as proibições da seção 8 valem desde já. O que o João mandou está autorizado. Não corte conteúdo por falta de papel: sinalize em docs/PENDENCIAS.md.
- Dado do cliente (preço, m², nº de máquinas, nomes, CREF, benefícios) NUNCA é inventado. Faltou: campo pendente.

2. FONTES DE VERDADE NO REPOSITÓRIO
PRIMEHOUSE_INVESTIGACAO_CLIENTE.md (oferta, regras, plano do 3D, SEO/GEO), PRIMEHOUSE_MAPA_MIDIA.md (cada arquivo, trechos de vídeo com tempo, falas transcritas), PRIMEHOUSE_AVALIACOES_GOOGLE.json, assets/primehouse-logo*.svg.

3. FUNIL
- Ação principal única: "Falar com a equipe" no WhatsApp 5549998043861, com mensagem pronta por contexto (quero conhecer, plano, Select, Duo, avaliação funcional, treino adaptado, trabalhe conosco). Sem formulário com backend.
- Sem preço e sem promoção no site: "Fale com a equipe e conheça as condições".
- Secundários: Instagram, Como chegar, Fazer o tour (3D).

4. STACK
- Astro (estável atual; conferir e fixar), TypeScript strict, estático, pnpm, Node LTS, engines e packageManager fixados.
- Movimento: CSS + IntersectionObserver + Web Animations API; View Transitions e scroll-driven só como melhoria progressiva. Sem GSAP, Lenis, Motion, Swiper, jQuery. Nunca sequestrar o scroll.
- 3D: Three.js numa ilha isolada, carregada SÓ depois do LCP e só quando a seção do 3D entra na tela (client:visible + requestIdleCallback). Sem React Three Fiber (peso). Splat 3D (Gaussian Splatting) só sob demanda (botão "Ver de verdade"), com a biblioteca de splats mais estável no momento (pesquisar e justificar). Sempre com fallback em vídeo/imagem e controles acessíveis em HTML.
- Orçamento (medir): JS inicial ≤ 40 KB gzip por página (sem contar a ilha 3D); ilha 3D ≤ 180 KB gzip + modelo GLB ≤ 3 MB (Draco/Meshopt + KTX2); splat ≤ 40 MB e só sob demanda; LCP < 2,0 s em 4G mobile; CLS ≈ 0; INP < 200 ms; Lighthouse mobile ≥ 95 (Performance/BP/SEO) e 100 (Acessibilidade) na home medida com o 3D ainda não carregado.
- Fontes self-hosted (subset latino).

5. IDENTIDADE
- Marca: assets/primehouse-logo.svg (empilhado), -linha.svg (horizontal, cabeçalho), -mono.svg, -preto.svg. "PRIME HOUSE" em branco/preto (currentColor) e "ACADEMIA" no laranja da marca (variável --prime-laranja).
- Assinatura: "LUZ DE TREINO". O teto da academia tem molduras de LED em retângulos e hexágonos sobre a sala escura; é a imagem mais característica do lugar. No site:
  (a) ABERTURA: as luzes do teto acendem, uma moldura por vez (Prompt 4);
  (b) MOLDURAS: linhas finas de luz (1 px, branco-quente com brilho suave) que emolduram vídeos e imagens e acendem uma vez ao entrar na tela;
  (c) 3D: as molduras de luz no teto da maquete marcam as zonas; a zona ativa acende;
  (d) FOCO/HOVER: a borda acende como LED (sem degradê, sem neon colorido).
  É evento, não progresso do scroll.
- PROIBIDO repetir (usado em outros sites nossos): vinho + coluna de pontos, linha da vida, curva dourada, oval verde, arco como assinatura, navy + areia, "A Contraforma", "A Fresta", "O Degradê", "O Florescer"; fontes Cormorant, Bodoni Moda (e família Bodoni), Marcellus, Instrument Serif, Hanken Grotesk, Fraunces, Lato, Figtree, Jost, Gloock, Urbanist, Spectral, Newsreader, Albert Sans, Libre Caslon, Schibsted Grotesk, Bellefair, Gilda Display, Mulish, Red Hat Text, EB Garamond, Josefin Sans (no texto).
- Paleta (tokens; validar AA por script):
  Breu ≈ #0A0A0B (fundo principal);
  Grafite ≈ #161719 (superfícies);
  Concreto ≈ #8C8D90 (texto secundário, linhas);
  Névoa ≈ #E9E8E5 (o claro raro: páginas de texto longo e a maquete 3D, em "argila clara");
  Laranja Prime ≈ #EC8A2A (PROVISÓRIO até o oficial): acento só em pontos (ACADEMIA, número, foco, botão principal); nunca em blocos grandes;
  Luz ≈ #FFF4E0 (a cor das molduras de LED, só em linhas e brilho).
- Tipografia (testar e decidir na sessão 3; OFL; self-host): títulos em Archivo (eixo de largura: condensado em caixa alta, conversa com o logo) × Barlow Condensed; texto em Inter Tight × Geist; acento em itálico serifado só em uma palavra por título (o marketing já usa "SEU TREINO / feito para você"): Source Serif 4 Italic × Literata Italic. Números grandes em tabular.
- Fotografia real escura com luz quente; pessoas reais treinando (com autorização); máquinas Cimerian como objetos.

6. ANTI "CARA DE IA" E ANTI "FITNESS GENÉRICO"
Proibido: gradiente neon, raios, fonte esticada "agressiva", foto de banco de supino ou de modelo sarado, ícones de haltere, cards arredondados iguais, contador "+1000 alunos" inventado, hero centralizado com degradê, texto "transforme seu corpo", "sem dor sem ganho".
Usar: muito preto e respiro; tipografia grande e precisa; a luz do teto como desenho; vídeo real; números verificáveis grandes (5 · 100% · 5h–0h · 14 dias); seções com gestos diferentes.

7. MÍDIA
- Originais em media-originais/ (git mv de assets/ e videos/). Derivados no build em public/media/ (fora do git): AVIF/WebP com srcset, LQIP, pôster por vídeo, MP4 H.264 + WebM, loops mudos.
- Manifesto media.manifest.json: id, arquivo, tipo, post, texto/fala transcrita, uso, trechos (in/out em s), resolucaoMax, consentimento (pendente | autorizado | nao-precisa), audioLiberado, problemas, edicoes, naoUsar.
- As capturas de tela (≈ 500 px) NÃO viram imagem grande: são referência do 3D ou aparecem no máximo a 480 px de largura.
- Edição permitida: cor/exposição GLOBAIS, recorte, corte de trechos. Proibido: IA generativa, apagar texto queimado por IA, upscaling por IA, retoque em pessoas.
- Vídeos mudos; som só em audioLiberado.

8. REGRAS DE TEXTO (CDC, CONAR, LGPD, CREF)
- Sem superlativo comparativo na voz da academia: "melhor academia", "melhor maquinário da cidade", "número 1", "a maior", "garantia de melhor". Usar só o verificável (100% Cimerian, 5 puxadas altas, 5h–0h, trânsito livre). Elogio forte só em avaliação literal de cliente.
- Sem citar nem atacar concorrentes ("academia de rede" vira a tese positiva: "aqui você tem nome e história").
- Sem preço, promoção, "matrícula grátis", "1º mês grátis", "preço congelado", contagem regressiva.
- Saúde: "treino orientado e adaptado, com acompanhamento de fisioterapeuta". NUNCA prometer tratar, curar ou emagrecer X kg. Alunos com condição de saúde só com consentimento=autorizado.
- CREF do responsável técnico no rodapé quando informado.
- Termos vetados (src/config/termos.ts): "melhor academia", "a melhor", "o melhor", "número 1", "nº 1", "a maior", "garantia de melhor", "matrícula grátis", "primeiro mês grátis", "1º mês grátis", "grátis", "preço congelado", "vitalício", "desconto", "promoção", "cura", "emagreça", "perca", "academia de rede", "LM Prime House". O Code NUNCA afrouxa listas nem travas sem ordem expressa.

9. CONFIG E TRAVAS
- Fonte única em src/config/ tipada com confirmado(), opcional(), bloqueante(), aviso(). Preview sempre funciona (faixa "em revisão", selo PROVISÓRIO, noindex).
- Produção trava só em: WhatsApp ausente; termo vetado no HTML; mídia com consentimento pendente publicada; mídia naoUsar referenciada; zona do 3D com dado inventado (layout sem fonte); benefício fixo publicado sem confirmação.

10. CONDUTA DO CODE
- Um prompt = uma sessão = um commit, mensagem curta em português.
- Plano curto antes de tarefa grande. Capturas e métricas no lugar de "ficou ótimo". Se não conseguir, diga.
- Capturas em 390 e 1440 px e com prefers-reduced-motion.
- Relatório no fim: o que mudou · o que falhou · o que depende do João · números medidos.
````

---

## PROMPT 0 — Fundação

````text
[COLE AQUI O BLOCO "CONTEXTO DO PROJETO" INTEIRO, ANTES DESTE TEXTO]

Tarefa: criar a fundação do projeto Astro no repositório prime-house e gravar o contexto como CLAUDE.md.
Escopo: estrutura e configuração. NÃO escreva páginas, textos ou componentes visuais. NÃO apague mídia.
Leia primeiro: git ls-files; PRIMEHOUSE_MAPA_MIDIA.md.

Passos:
1. Salve o bloco de contexto, sem alterar, como CLAUDE.md na raiz e como docs/CONTEXTO.md.
2. Crie docs/ e mova para lá (git mv): PRIMEHOUSE_INVESTIGACAO_CLIENTE.md, PRIMEHOUSE_MAPA_MIDIA.md, PRIMEHOUSE_PACOTE_PROMPTS_CODE.md; PRIMEHOUSE_AVALIACOES_GOOGLE.json → docs/dados/avaliacoes-google.json. Se faltar algum, anote em docs/PENDENCIAS.md e siga.
3. Verifique: node, pnpm, git, ffmpeg, ffprobe, sharp, Chromium do Playwright. Instale o seguro via pnpm. Nada global sem me dizer.
4. Astro (estável atual, TS strict, estático) na raiz, preservando assets/ e videos/. Adicione three (versão estável fixada) como dependência, ainda sem uso. package.json: name "primehouse-site", engines, packageManager, scripts: dev, build, preview, check, test, validate-config, audit-compliance, audit-a11y, audit-lighthouse, audit-seo, audit-contraste, audit-pesos, media:prepare, model:prepare, capturar.
5. Estrutura: src/{config,components,layouts,pages,styles,scripts,content,lib,tres}, scripts/, docs/{capturas,dados,3d}, media-originais/, modelos-originais/ (GLB/splat fonte, Git LFS se o João autorizar), public/. .gitignore: node_modules, dist, .astro, public/media, public/modelos, docs/capturas/**/*.png, .env*.
6. tsconfig strict, ESLint + Prettier, .editorconfig, .nvmrc, Vitest.
7. scripts/capturar.mjs: sobe o preview e captura rotas em 390 e 1440 px e com prefers-reduced-motion em docs/capturas/<data>/; espera a ilha 3D estabilizar quando presente.
8. Página temporária "/" com <h1>Prime House Academia</h1> e noindex. README.md curto.

Critério de aceite: install, build, check e test verdes; capturar funciona; CLAUDE.md idêntico; commit "fundação".
````

---

## PROMPT 1 — Mídia

````text
Leia CLAUDE.md e docs/PRIMEHOUSE_MAPA_MIDIA.md. Esta sessão só trata mídia. NADA vai para páginas.

Tarefa: mover originais, gerar manifesto, cortar trechos e loops, recortar o aproveitável, gerar derivados.
Escopo: media-originais/, media.manifest.json (+ JSON Schema), scripts/prepare-media.mjs, scripts/extract-stills.mjs, docs/MIDIA_CATALOGO.md. Originais intactos (só git mv).

Passos:
1. git mv: assets/*.png|jpg → media-originais/fotos/ (capturas em media-originais/fotos/capturas/); videos/*.mp4 → media-originais/videos/; assets/primehouse-logo*.svg → media-originais/marca/.
2. Manifesto com os campos do CLAUDE.md, seção 7. Marque:
   - naoUsar: primelogo.png (substituído pelos SVG), Captura 2026-08-08 (arte de horário: só dado).
   - capturas 01–13: uso "referencia-3d" e "galeria-pequena" (resolucaoMax 480).
   - carrossel de diferenciais (14–21): recortes sem o texto, uso "conforto". O espaço kids NÃO mostra crianças identificáveis.
   - carrosséis 22–34: consentimento "pendente" (alunos reais). Não publicar fotos; o texto vai para a sessão 5.
3. VÍDEOS — trechos (confira quadro a quadro, ajuste ±0,5 s), todos mudos, MP4 + WebM, 720×1280 e 540×960, pôster AVIF:
   - letreiro-aceso: inauguração 1,0–2,6 s
   - interior-noite: inauguração 33,0–36,5 s (loop do hero)
   - drone-noite: inauguração 39,0–43,5 s (abertura e "Como chegar")
   - drone-entardecer: inauguração 37,0–38,8 s
   - equipe: inauguração 23,0–24,8 s (consentimento: pendente)
   - lucas-discurso: inauguração 6,0–19,0 s (P&B; seção história; consentimento: Lucas = autorizado pelo João)
   - fachada-dia: rotina 0,0–1,8 s
   - acompanhamento: rotina 2,0–24,0 s (alunos e professores: pendente)
   - filme-inauguracao: inteiro (seção história; versão com som só se audioLiberado)
   - plano-prime, avaliacao-funcional, plano-select: inteiros (páginas internas; falas transcritas no manifesto)
   Gere também versões 16:9 do interior-noite e do drone-noite se o recorte da imagem vertical permitir (relate se não permitir; nada de preencher com IA).
4. STILLS sem upscale (scripts/extract-stills.mjs): letreiro aceso (1,5 s), máquina Cimerian (0,3 s), anilha (10 s), halteres (32 s), interior (34 s), drone noturno (40 s), fachada de dia (0,5 s da rotina), logo final (45 s). Natureza "quadro de vídeo"; resolucaoMax registrada.
5. scripts/prepare-media.mjs (predev/prebuild, idempotente, cache por hash): AVIF/WebP 480/800/1200/1600 (nunca acima do original), LQIP, vídeos acima.
6. docs/MIDIA_CATALOGO.md: tabela (arquivo, uso, trecho, pesos, consentimento, problemas), folhas de contato em docs/capturas/midia/ e a lista do que pedir (fotos em alta, vídeos originais, planta, captura 3D).

Critério de aceite: media:prepare idempotente; manifesto válido; loop interior-noite ≤ 1,2 MB; nada com consentimento pendente publicável; build verde; commit "midia".
````

---

## PROMPT 2 — Config, horário, conteúdo e travas

````text
Leia CLAUDE.md, docs/MIDIA_CATALOGO.md e docs/dados/avaliacoes-google.json.

Tarefa: config tipada, coleções, motor de horário, WhatsApp e travas.
Escopo: src/config/**, src/content/** (schemas), src/lib/{horario,whatsapp}.ts, scripts/{validate-config,audit-compliance}.mjs, docs/PENDENCIAS.md, componentes PreviewBanner e Provisorio.

Passos:
1. tipos.ts: confirmado(v, fonte), opcional(v), bloqueante(rotulo), aviso(rotulo, motivo).
2. marca.ts: nome "Prime House Academia", logos, laranja = aviso("#EC8A2A", "provisório até o oficial"), fundador "Lucas Moro", inauguracao "2026-04-30".
3. contato.ts: whatsapp 5549998043861; telefone (49) 99804-3861; instagram; endereço completo; geo; plusCode; links Google Maps (cid 9561389130144054445), Waze, Apple Mapas; estacionamento = opcional(); acessibilidade = opcional().
4. horario.ts: seg–sex 05:00–24:00; sáb 08:00–18:00; dom e feriados 09:00–12:00 e 15:00–18:00; feriados[] (datas); fuso America/Sao_Paulo. src/lib/horario.ts: statusEm(data) → "Aberto agora · até 0h", "Fecha em 30 min", "Pausa · reabre às 15h" (domingo), "Fechado · abre às 5h". Testes: segunda 4h50, sexta 23h40, sábado 18h05, domingo 12h30, domingo 18h01, feriado, virada de ano.
5. Coleção "zonas" (Zod) para o 3D e a página A Casa: id, nome, descricao, equipamentos[] (só confirmados), midia[], camera {posicao, alvo}, fonteLayout (planta | captura | pendente). Registros iniciais: recepcao, musculacao (subzonas costas-puxadas, pernas, peito-ombro, peso-livre), cardio, vestiarios, avaliacao-fisio, conveniencia (café, lanches, geladeira, suplementos), espaco-kids. Todos fonteLayout "pendente" até a planta chegar.
6. Coleção "equipamentos": nome, tipo, musculos[], zona, foto, video, fabricante "Cimerian", confirmado (bool). Iniciais confirmados por post: puxada alta (5 unidades), agachamento pêndulo, remada (curvada na máquina), crossover, rack/gaiola, halteres, esteira com TV. Os demais: só quando a lista chegar.
7. Coleção "planos": prime, select, duo, com o que inclui (texto), sem preço; beneficios fixos (garantia de 14 dias, trancamento de 30 dias no anual, Sexta Prime) = bloqueante("confirmar por escrito") → em preview aparecem com selo PROVISÓRIO; em produção não aparecem até confirmados.
8. Coleção "diferenciais" (do carrossel e dos posts): climatização, esteira com TV, banheiro completo, café, lanches, geladeira, espaço kids, treino no app, avaliação funcional, fisioterapeuta, suplementos, convênio Estar Bem.
9. avaliacoes.ts: do JSON; exibirNota=false; só as com texto ≥ 8 caracteres e nota ≥ 4 (Juliano M., Alfredo K., Ronielle S.).
10. src/lib/whatsapp.ts: linkWhatsApp(texto) e mensagens: geral "Olá! Vim pelo site da Prime House e quero conhecer a academia."; plano "Olá! Vim pelo site e quero saber sobre o {plano}."; avaliação "Olá! Vim pelo site e quero agendar minha avaliação funcional."; adaptado "Olá! Vim pelo site. Quero treinar com acompanhamento para {motivo}."; zona "Olá! Vi a {zona} no tour do site e quero conhecer de perto."; trabalhe "Olá! Vim pelo site e quero saber sobre vagas na Prime House." Testes de todas.
11. termos.ts (lista do CLAUDE.md, seção 8), seo.ts (SITE_URL por env; indexar=false), tema.ts.
12. validate-config e audit-compliance com as travas da seção 9 + varredura de termos vetados no dist/.

Critério de aceite: testes verdes; preview passa com pendências; travas simuladas derrubam a produção; commit "config".
````

---

## PROMPT 3 — Design system e "Luz de Treino"

````text
Leia CLAUDE.md, docs/MIDIA_CATALOGO.md e src/config/tema.ts. Pesquise antes (MDN): mask-image, @property, filter: drop-shadow, View Transitions, prefers-reduced-motion; e as fontes candidatas (eixos, licença).

Tarefa: tokens, tipografia, logo, componentes base e a assinatura. Página /_estilo (noindex).
Escopo: src/styles/**, src/components/base/**, src/components/marca/**, src/pages/_estilo.astro, scripts/audit-contraste.mjs.

Passos:
1. Tokens (o site é escuro; Névoa só em páginas de texto longo e na maquete): calibre Breu, Grafite, Concreto, Luz e Laranja com os stills (a luz do LED do teto, o laranja da camiseta da equipe e do logo). audit-contraste valida AA de cada par.
2. Tipografia: teste Archivo (larguras 62–100) × Barlow Condensed (títulos em caixa alta), Inter Tight × Geist (texto), Source Serif 4 Italic × Literata Italic (uma palavra de acento), em 3 provas: hero ("O novo padrão de treino em Lages."), número grande ("5 puxadas altas"), parágrafo longo. Escolha com capturas e justifique. Escala fluida com display muito grande e espaçamento de letra negativo controlado; texto 17–18 px.
3. Logo: <Logo variante="empilhado|linha|mono"> a partir dos SVG; nitidez em 24/32/48/96 px; favicon e apple-touch a partir do logo empilhado sobre Breu; o laranja vem de --prime-laranja.
4. Assinatura "Luz de Treino":
   (a) <MolduraLuz forma="retangulo|hexagono">: uma linha de 1 px na cor Luz com um brilho suave (drop-shadow), que "liga" ao entrar na tela com 2–3 cintilações rápidas de lâmpada tubular (≤ 300 ms) e fica estável. Uma vez. Em reduced-motion, liga sem cintilar;
   (b) <TetoDeLuz>: composição de molduras (retângulos e hexágonos como no teto real das capturas 01 e 06–13) usada na abertura e como fundo de seções escuras, em SVG leve;
   (c) foco e hover: a borda acende como LED (sem neon colorido); foco sempre visível;
   (d) <NumeroGrande>: número em tabular gigante com a legenda em versalete (5 · 100% · 5h–0h · 14 dias).
5. Componentes base: Botão primário "Falar com a equipe" (laranja, ícone oficial do WhatsApp monocromático, sem círculo), botão secundário (contorno de luz), Link, Rótulo, Citação, StatusHorario (ao vivo), Moldura de vídeo (com MolduraLuz), Pôster com LQIP, MapaEstatico, Tabela de horário (peça gráfica, hoje destacado).
6. Movimento: durações 150–700 ms; curva precisa e rápida na saída; nada de bounce; reduced-motion: estados finais.
7. /_estilo com tudo.

Critério de aceite: AA verde; capturas de /_estilo em 390/1440 e reduced-motion; JS desta sessão ≤ 6 KB; commit "design system".
````

---

## PROMPT 4 — Abertura e hero

````text
Leia CLAUDE.md e os componentes da sessão 3. Use letreiro-aceso, interior-noite, drone-noite e os stills.

Tarefa: a abertura e o hero da home. Só isso.
Escopo: src/components/abertura/**, src/components/hero/**, src/pages/index.astro (só o hero).

A ABERTURA, "AS LUZES ACENDEM" (≤ 3,0 s, uma vez por sessão):
- 0–0,4 s: tela Breu, silêncio. Um pequeno texto em versalete no canto: "05:00".
- 0,4–1,6 s: as molduras de LED do teto (<TetoDeLuz>, desenho fiel às capturas) acendem uma a uma, em perspectiva, como alguém ligando a academia de manhã, com uma cintilação curta em 2 ou 3 delas.
- 1,6–2,3 s: com a luz acesa, o interior real aparece por baixo (pôster do interior-noite subindo de 0 a 100% de opacidade e de 1,04 a 1,0 de escala); "PRIME HOUSE" aparece em caixa alta grande e "ACADEMIA" em laranja.
- 2,3–3,0 s: o logo encolhe e vai para o cabeçalho (FLIP com WAAPI; View Transition se suportado); o vídeo interior-noite começa no lugar do pôster; entram o H1 e os botões.
- Botão "Pular" acessível desde o primeiro quadro; toque, clique, tecla ou rolagem pulam. Uma vez por sessão (sessionStorage com try/catch). Reduced-motion e sem JS: estado final direto.
- O pôster do interior é o LCP, está no HTML desde o início com fetchpriority="high". Meça Lighthouse com e sem a abertura; se piorar, a camada da abertura vira transparente sobre o pôster já pintado.

O HERO:
- Tela cheia escura com o vídeo interior-noite (mudo, loop, botão pausar visível). Uma moldura de luz fina enquadra o vídeo com margem generosa (não sangra até a borda no desktop; no mobile sangra).
- Texto à esquerda, embaixo: rótulo "MUSCULAÇÃO · TRÂNSITO LIVRE · LAGES"; H1 (provisório; a sessão 5 refina) "O novo padrão de treino em Lages."; linha de apoio "100% maquinário Cimerian, atendimento de verdade e um espaço pensado para você querer voltar amanhã."; botões "Falar com a equipe" (WhatsApp) e "Fazer o tour" (rola até o 3D).
- À direita, embaixo, o StatusHorario ao vivo ("Aberto agora · até 0h") e o endereço curto.
- Alternativa B (para eu comparar): hero com o drone-noite em vez do interior. Entregue /_hero-a e /_hero-b (noindex) com capturas.

Critério de aceite: sequência de capturas da abertura (0; 0,8; 1,4; 2,0; 3,0 s) em 390 e 1440; LCP < 2,0 s mobile com e sem abertura; Pular no teclado; reduced-motion; commit "abertura e hero".
````

---

## PROMPT 5 — Textos

````text
Leia CLAUDE.md, docs/PRIMEHOUSE_INVESTIGACAO_CLIENTE.md (seções 3, 4, 11), docs/PRIMEHOUSE_MAPA_MIDIA.md (falas transcritas e textos das artes) e src/config.

Tarefa: escrever TODOS os textos do site em src/content, com fonte de cada frase real.
Escopo: só texto.

Regras de voz:
- Direto, confiante, caloroso, frases curtas, segunda pessoa ("você"). Nada de "monstro", "sangue no olho", "transforme seu corpo". Nada de emoji.
- Use as frases reais (CLAUDE.md, seção 1) como espinha, editadas só no ritmo; cite a fonte (post) no arquivo de conteúdo.
- Parágrafo-resposta no topo de cada página (2–3 frases com o quê + onde + como): "A Prime House Academia é uma academia de musculação de trânsito livre na Av. Duque de Caxias, 1253, bairro Frei Rogério, em Lages/SC. Abre de segunda a sexta das 5h à meia-noite, é 100% equipada com máquinas Cimerian e oferece avaliação funcional, treino individual e acompanhamento de fisioterapeuta."
- Seção 8 do CLAUDE.md inteira (sem superlativo, sem promoção, sem promessa de saúde).

Textos a entregar:
1. Home (ordem do Prompt 6A): manifesto; "Por que é diferente" (sem atacar ninguém); números; "Acompanhamento de verdade" (as 5 perguntas do carrossel "5 sinais" como um mini quiz); "Para todo corpo" (o carrossel "Nunca é tarde"); "Conforto" (diferenciais); planos (Prime, Select, Duo, sem preço); prova (avaliações literais); "A história" (da obra em 2025 à inauguração, com Lucas); "Visite".
2. /a-casa: introdução ao tour e um texto curto por zona (só o que é confirmado).
3. /maquinario: introdução (Cimerian, nacional) e um texto por equipamento confirmado (músculos, para quem, dica de execução do próprio marketing quando houver vídeo).
4. /planos: os três planos + benefícios fixos (como PROVISÓRIO até confirmação) + convênio Estar Bem + "fale com a equipe".
5. /como-funciona: avaliação funcional, treino no app, acompanhamento, fisioterapeuta, treino adaptado (+40, idosos, artrose, pós-AVC, lipedema, gestantes): sempre "orientado e adaptado", nunca "trata".
6. /equipe (estrutura pronta; nomes pendentes), /trabalhe-conosco (vagas: comercial, instrutores, limpeza; como se candidatar pelo WhatsApp ou e-mail pendente), /horarios-e-como-chegar, /perguntas-frequentes (perguntas reais do destaque "Dúvidas": é pra treinar com personal? · academia lotada? · é para iniciante? · onde fica? · os aparelhos são da China? · tem espaço kids? · a academia tem janela? · tem nutricionista? · tem novidade no cardio? · mais: horário de domingo, feriado, estacionamento (pendente), Sexta Prime, garantia, trancamento), /privacidade, 404.
7. Microtextos: botões, mensagens do WhatsApp por contexto, alt de cada imagem, descrição dos vídeos, rodapé.
8. Metas: title (≤ 60) e description (≤ 155) por página, com "academia em Lages" e o bairro.

Critério de aceite: audit-compliance sem termo vetado; toda frase real com fonte; pendências listadas; commit "textos".
````

---

## PROMPT 6A — Home

````text
Leia CLAUDE.md, src/content e os componentes das sessões 3 e 4.

Tarefa: montar a home inteira abaixo do hero. Cada seção com um gesto próprio.
Escopo: src/pages/index.astro, src/components/secoes/**.

Seções (nesta ordem):
1. MANIFESTO: uma frase gigante em duas linhas ("O treino já é pesado. / O ambiente não deve ser.") com a palavra-chave em itálico; uma MolduraLuz retangular acende em volta.
2. NÚMEROS: 4 NumeroGrande em linha (5 puxadas altas · 100% Cimerian · 5h–0h de segunda a sexta · 14 dias de garantia [só se confirmado; senão "Trânsito livre"]), separados por fios de luz.
3. A CASA EM 3D (teaser): a ilha 3D da sessão 6B em versão compacta (maquete + 3 zonas) com o botão "Abrir o tour completo" → /a-casa. Antes de carregar: pôster com as molduras de luz e um botão "Carregar o tour 3D" (economia de dados: não carrega sozinho em Save-Data ou 2g).
4. ACOMPANHAMENTO DE VERDADE: mini quiz "5 sinais de que seu treino precisa de mais atenção" (marcar os que se aplicam; o resultado sugere a avaliação funcional e monta a mensagem do WhatsApp; nada é guardado) + vídeo "acompanhamento" (se autorizado; senão, still sem rostos).
5. PARA TODO CORPO: "O cuidado com você não tem idade." Três colunas editoriais (Começando agora · +40 e idosos · Treino adaptado), texto curto e o fisioterapeuta mencionado. Fotos só autorizadas.
6. CONFORTO: grade assimétrica e escura com os diferenciais (café, lanches, geladeira, banheiro completo, climatização, esteira com TV, espaço kids, treino no app), cada um com recorte real e legenda de uma linha. Hover acende a moldura.
7. PLANOS: três colunas sem preço (Prime · Select · Duo), o que inclui, um botão de WhatsApp por plano; benefícios fixos abaixo (se confirmados).
8. O QUE DIZEM: avaliações literais (Juliano M., Alfredo K., Ronielle S.) em citação grande, com selo e link do Google; "Avaliar no Google". Sem nota agregada.
9. A HISTÓRIA: da obra (2025) à inauguração (30/04/2026): linha horizontal com 5 marcos e o trecho lucas-discurso em P&B + equipe (autorizados).
10. VISITE: drone-noite em moldura, endereço completo, tabela de horário com hoje destacado e status ao vivo, mapa estático, botões Google Maps / Waze / Apple Mapas, Instagram.
11. RODAPÉ: logo, endereço, WhatsApp e telefone escritos, horário, Instagram, CREF (pendente), CNPJ (pendente), trabalhe conosco, privacidade.
- Botão flutuante discreto "Falar com a equipe" no mobile, que some quando a seção 10 está na tela.

Critério de aceite: capturas 390/1440 e reduced-motion da home inteira; Lighthouse mobile ≥ 95/100 (com o 3D ainda não carregado); JS inicial ≤ 40 KB gzip; sem rolagem horizontal; commit "home".
````

---

## PROMPT 6B — A Casa em 3D

````text
Leia CLAUDE.md, a seção 9 de docs/PRIMEHOUSE_INVESTIGACAO_CLIENTE.md e src/content/zonas. Pesquise e cite antes: Three.js (versão atual: GLTFLoader, DRACOLoader, KTX2Loader, MeshoptDecoder, renderer.setAnimationLoop, disposal), boas práticas de performance web 3D em celular, e as bibliotecas atuais de Gaussian Splatting para Three.js (estabilidade, licença, peso).

Tarefa: construir o sistema de tour 3D completo, pronto para receber a planta e a captura real, sem inventar o layout.
Escopo: src/tres/**, src/components/casa3d/**, src/pages/a-casa.astro, scripts/model-prepare.mjs, docs/3d/README.md.

Arquitetura (três camadas):
A) MAQUETE (minimalismo): cena Three.js com material "argila clara" (Névoa) sobre fundo Breu, luz suave, e as molduras de LED do teto como linhas emissivas (a assinatura). Carrega um GLB de public/modelos/maquete.glb.
   - ENQUANTO NÃO HOUVER PLANTA: gere uma MAQUETE ESQUEMÁTICA honesta: o galpão como volume simples (caixa com telhado curvo estilizado, sem medidas reais) e as zonas como blocos rotulados, com o selo visível "Representação esquemática — em breve, o tour real". Em produção, essa versão só aparece se o João aprovar (aviso no validate-config).
   - COM PLANTA (Prompt 3D): substitui pelo GLB feito a partir dela.
B) REALISMO: botão "Ver de verdade" carrega o splat da zona ativa (public/modelos/splats/<zona>.ksplat ou o formato escolhido) sob demanda, com barra de progresso, cancelável; até existir, o botão abre o vídeo da zona.
C) FALLBACK: sem WebGL, com Save-Data/2g, com reduced-motion ou com erro: vídeo/imagem da zona + a lista de zonas em HTML.

Interação:
- As zonas (coleção) viram botões em HTML (role=tablist) E hotspots na cena; os dois sincronizados. Teclado: setas trocam de zona, Enter abre o painel.
- Ao escolher uma zona: a câmera voa até a pose da zona (camera.posicao/alvo da coleção) em 900–1200 ms com easing suave; a moldura de luz daquela zona acende; um painel lateral (mobile: gaveta inferior) mostra nome, texto, equipamentos confirmados, mídia e o botão "Quero conhecer esta área" (WhatsApp com a mensagem da zona).
- Controle de câmera limitado (órbita pequena, sem zoom livre infinito, sem atravessar paredes). Arrastar no mobile não pode travar a rolagem da página fora da área do 3D.
- A cena pausa (setAnimationLoop(null)) quando sai da tela ou a aba fica oculta; libera memória ao sair de /a-casa.
- URL compartilhável: /a-casa?zona=cardio.

Pipeline:
- scripts/model-prepare.mjs: recebe o GLB/splat bruto de modelos-originais/ e gera o otimizado (gltf-transform: dedupe, weld, simplify controlado, Draco ou Meshopt, texturas KTX2; splat comprimido), com relatório de peso e polígonos em docs/3d/.
- docs/3d/README.md: como a WAXLO ou o marketing entrega a planta e a captura (formato, escala, eixo, nomes das zonas), e como rodar o Prompt 3D.

Critério de aceite: /a-casa funciona com a maquete esquemática (com o selo), o fallback em vídeo e a lista HTML; ilha 3D ≤ 180 KB gzip; 60 fps em desktop médio e ≥ 30 fps num Android intermediário (medir com o painel de performance, capturas); home sem regressão de LCP; teclado e leitor de tela percorrem todas as zonas; commit "a casa 3d".
````

---

## PROMPT 6C — Páginas internas

````text
Leia CLAUDE.md e src/content.

Tarefa: páginas internas, com templates próprios.
Escopo: src/pages/{maquinario,planos,como-funciona,equipe,trabalhe-conosco,horarios-e-como-chegar,perguntas-frequentes,privacidade,404}.astro.

- /maquinario: grade preta minimalista; cada equipamento confirmado como objeto (still recortado ou quadro de vídeo), nome, músculos, zona (link para /a-casa?zona=), vídeo curto de execução sob demanda. Filtro por grupo muscular sem JS pesado. Equipamentos não confirmados não aparecem.
- /planos: os três planos lado a lado (sem preço), benefícios fixos (se confirmados), convênio, perguntas sobre planos, CTA por plano. Vídeos plano-prime e plano-select opcionais (mudos, com legenda HTML da fala transcrita).
- /como-funciona: do primeiro contato ao treino (contato → visita → avaliação funcional → treino no app → acompanhamento → reavaliação), com o vídeo avaliacao-funcional e o fisioterapeuta; seção de treino adaptado com a frase "orientado e adaptado".
- /equipe: estrutura pronta (fotos, nomes, CREF, especialidade); aparece em produção só com dados confirmados; enquanto isso, a página fala do time em geral e do desenvolvimento contínuo dos professores (post de 11/04/2026).
- /trabalhe-conosco: vagas (comercial, instrutores, limpeza), o que valorizam ("pessoas que cuidam de pessoas"), como se candidatar (WhatsApp; e-mail pendente).
- /horarios-e-como-chegar: endereço grande com botão copiar; fachada de dia (still) e drone-noite; tabela de horário com status ao vivo e feriados; mapa estático e, após clique e consentimento, interativo; Google Maps / Waze / Apple Mapas; estacionamento (pendente).
- /perguntas-frequentes: <details> nativos, agrupados.
- /privacidade (LGPD simples), 404 (curta, com uma moldura de luz "apagada" que acende no hover e três caminhos).

Critério de aceite: capturas 390/1440 de todas; nenhuma página vazia em produção; commit "paginas".
````

---

## PROMPT 7 — Funil e LGPD

````text
Leia CLAUDE.md e src/lib/whatsapp.ts.

Tarefa: endurecer o funil e medir sem invadir.
Escopo: componentes de CTA, src/components/consentimento/**, src/lib/medicao.ts, docs/FUNIL.md.

1. Todo CTA passa por linkWhatsApp() com a mensagem do contexto (página, plano, zona do 3D, quiz). Sem JS: link direto com a mensagem geral.
2. Quiz "5 sinais" e escolha de plano montam o texto e abrem o WhatsApp; nada é guardado; rádios e checkboxes nativos.
3. Medição: clique_whatsapp (origem, plano, zona), tour_3d_aberto (zona), tour_3d_realismo, clique_como_chegar, clique_instagram. Ferramenta sem cookie (Plausible/Umami) OU GA4 só após consentimento; proponha e justifique.
4. Banner de consentimento com Aceitar e Recusar do mesmo peso; mapa interativo e medição com cookie só após aceitar; preferência alterável no rodapé.
5. docs/FUNIL.md: caminhos e mensagens exatas.

Critério de aceite: e2e (Playwright, 390 px) gerando o link exato em 6 cenários (incluindo uma zona do 3D e o quiz); nenhum request de terceiro antes do consentimento; commit "funil e lgpd".
````

---

## PROMPT 8 — SEO local e GEO

````text
Leia CLAUDE.md e a seção 12 de docs/PRIMEHOUSE_INVESTIGACAO_CLIENTE.md. Pesquise e cite antes: schema.org (ExerciseGym, HealthClub, SportsActivityLocation, OpeningHoursSpecification, LocationFeatureSpecification, Offer sem preço, Person, FAQPage, VideoObject), Google Search Central (negócio local, avaliações autosservidas, vídeo), llms.txt.

Tarefa: deixar o site legível e citável.
Escopo: src/components/seo/**, robots, sitemap, public/llms.txt (gerado), scripts/audit-seo.mjs, docs/SEO_GEO.md.

1. JSON-LD gerado da config: ExerciseGym com name, address, geo, telephone, url, sameAs (Instagram, ficha), openingHoursSpecification (os dois turnos de domingo e feriados), amenityFeature (climatização, vestiário, espaço kids, café, esteira com TV — só confirmados), hasOfferCatalog (planos, sem preço), founder Person "Lucas Moro"; FAQPage; BreadcrumbList; VideoObject nos vídeos com transcrição. SEM AggregateRating e sem Review.
2. Metas, canonical, Open Graph (imagem 1200×630 gerada no build: interior com as molduras de luz + logo + "Lages/SC"), lang pt-BR.
3. NAP idêntico em todas as páginas; audit-seo falha se divergir.
4. llms.txt: o que é, endereço, horário, maquinário, planos (sem preço), diferenciais, como falar.
5. Conteúdo citável: parágrafo-resposta no topo de cada página; perguntas reais como títulos na FAQ; termos: academia em Lages, academia no Frei Rogério, academia aberta até meia-noite, academia aberta domingo, trânsito livre, sem lotação, Cimerian, avaliação funcional, treino com acompanhamento.
6. noindex enquanto indexar=false; sitemap e robots corretos quando virar true.
7. docs/SEO_GEO.md (checklist fora do site para o João): ficha do Google (site, descrição, serviços, comodidades, 30+ fotos e vídeos, responder todas as avaliações), campanha de avaliação sem incentivo (QR na recepção, mensagem após 30 dias), NAP igual no Instagram, WhatsApp Business, Apple Business Connect e Bing; pedir ao parceiro que corrigiu "2553" para corrigir o post; teste mensal sem login: "melhor academia de Lages", "academia aberta até meia-noite Lages", "academia sem lotação Lages", "academia Frei Rogério".

Critério de aceite: Rich Results Test e validator.schema.org sem erro (capturas); audit-seo verde; commit "seo e geo".
````

---

## PROMPT 9 — QA, conferência final e deploy

````text
Leia CLAUDE.md e docs/PENDENCIAS.md.

Tarefa: auditoria completa, conferência de normas (a única passada) e deploy.
Escopo: correções pontuais, docs/QA.md, docs/CONFERENCIA_FINAL.md, configuração de deploy.

1. Desempenho: Lighthouse mobile em todas as rotas (≥ 95/100); pesos (JS inicial, ilha 3D, GLB, splats, vídeos, fontes); LCP com e sem abertura; fps do 3D em desktop e Android intermediário; memória após abrir e fechar o tour 3 vezes (sem vazamento).
2. Acessibilidade: axe; teclado do início ao fim (abertura → pular → hero → tour 3D pelas zonas → quiz → WhatsApp); leitor de tela no tour (lista de zonas); contraste; reduced-motion; zoom 200%; pausar vídeo.
3. Navegadores: Chrome, Safari iOS (WebKit), Firefox; Android 390 px; WebGL desligado (fallback).
4. ACABAMENTO "CLIENTE EXIGENTE": revise cada página como diretor de arte: viúvas e órfãs (text-wrap: balance/pretty, &nbsp;), alinhamentos ópticos, ritmo vertical, cortes de imagem, estados de foco, textos cortados em 390 px, aspas tipográficas, travessões, acentos, consistência de caixa alta. Capturas antes e depois.
5. Conferência de normas: CDC/CONAR (sem superlativo comparativo, sem promoção, benefícios fixos só confirmados); LGPD (consentimento real; dados de saúde de alunos só com autorização); direito de imagem (alunos, professores, influenciadores, equipe); CREF no rodapé; Google (sem AggregateRating); termos vetados. NÃO afrouxe nenhuma trava.
6. Deploy: hospedagem estática (Vercel por padrão), SITE_URL por env, cabeçalhos (CSP por hash com as exceções do WebGL/worker documentadas, HSTS, Referrer-Policy, Permissions-Policy), cache longo para /media e /modelos com hash, compressão (brotli) para GLB/splat, preview com noindex.
7. docs/QA.md com números e capturas; docs/CONFERENCIA_FINAL.md com o que foi conferido e o que depende do João.

Critério de aceite: números no relatório; nenhuma trava afrouxada; commit "qa e deploy".
````

---

## PROMPT 3D — Planta e captura reais (usar quando chegarem)

````text
Leia CLAUDE.md, docs/3d/README.md e src/content/zonas.

Tarefa: substituir a maquete esquemática pela real e ligar o realismo.
[Material: planta (arquivo, escala, unidade) · GLB modelado (se houver) · capturas por zona (arquivos, app usado) · lista do maquinário com posição]

1. Se vier só a planta: modele a maquete com Three.js procedural OU gere o GLB no Blender por script (paredes, pilares, aberturas, janelas, telhado curvo, molduras de LED do teto conforme as fotos, e cada máquina como volume simples na posição real). Escala real em metros. Registre a fonte (fonteLayout "planta") em cada zona.
2. Se vier GLB pronto: rode model:prepare e confira escala, eixos e nomes.
3. Splats: rode model:prepare por zona; alinhe cada splat com a maquete (matriz salva em zonas); confira peso e qualidade.
4. Atualize as poses de câmera de cada zona, equipamentos por zona (só confirmados) e remova o selo "esquemática".
5. Meça fps, peso e memória de novo; capturas antes e depois.

Critério de aceite: nenhuma zona com fonteLayout "pendente"; pesos dentro do orçamento; commit "3d: maquete real".
````

---

## PROMPT L — Nova mídia (reutilizável)

````text
Leia CLAUDE.md e docs/MIDIA_CATALOGO.md.

Tarefa: incorporar a mídia nova de media-novas/ sem quebrar nada.
[Lista: arquivo · o que é · onde entra · consentimento · pode ter som? · crédito]

1. Inventário, folha de contato, avaliação (nitidez, luz, texto queimado, música).
2. git mv para media-originais/; registros no manifesto (consentimento e audioLiberado só se eu disser).
3. Trechos, recortes, pôsteres e derivados (mesma régua da sessão 1).
4. Encaixe por tipo: fotos em alta do interior → substituem as capturas (hero alternativo, conforto, A Casa, maquinário); vídeos originais da inauguração → abertura, hero e história (versões sem legenda queimada); fotos de máquinas → /maquinario; equipe e CREF → /equipe e rodapé; espaço kids, vestiário, café → conforto.
5. Remova selos PROVISÓRIO que deixaram de valer; atualize PENDENCIAS.
6. Capturas antes e depois das páginas afetadas.

Critério de aceite: build verde; LCP não piora; nada sem consentimento publicado; commit "midia: <resumo>".
````

---

## PROMPT D — Novo dado (reutilizável)

````text
Leia CLAUDE.md e src/config.

Tarefa: atualizar dados confirmados pelo João, só na config e no conteúdo, e propagar.
[Dados: ex.: laranja oficial #…; garantia de 14 dias confirmada; trancamento de 30 dias confirmado; Sexta Prime confirmada; CREF do responsável técnico; CNPJ; domínio; WhatsApp da bio = 99804-3861; m² e nº de máquinas; estacionamento; nomes e CREF da equipe; consentimento autorizado para os vídeos X, Y; aprovação da maquete esquemática em produção (sim/não)]

Passos: trocar opcional()/bloqueante()/aviso() por confirmado(valor, "João, <data>"); rodar validate-config, testes, audit-seo (NAP) e build; capturas das páginas afetadas; atualizar PENDENCIAS e docs/SEO_GEO.md se for NAP.
Critério de aceite: testes verdes; nenhum texto com o valor antigo (busca no dist/); commit "dados: <resumo>".
````

---

## C. O que falta (não trava o início; trava a produção onde indicado)

**Trava a produção**
1. Confirmação **por escrito** dos benefícios fixos (garantia de 14 dias, trancamento de 30 dias, Sexta Prime). Sem ela, eles não aparecem.
2. Autorização de imagem para os vídeos com alunos, professores e equipe.
3. Aprovação (ou não) da maquete esquemática enquanto não houver planta.

**Importante**
4. Laranja oficial e manual de marca (logo original).
5. **Planta baixa com medidas** e lista do maquinário (modelos Cimerian por zona).
6. **Fotos em alta do interior**, com as luzes do teto acesas (as capturas atuais têm cerca de 500 px).
7. **Vídeos originais** da inauguração e do drone, sem legenda e sem música.
8. Captura 3D por zona (roteiro na investigação, §9).
9. CREF do responsável técnico, CNPJ, nomes da equipe.
10. Confirmar se o WhatsApp da bio é o (49) 99804-3861.
11. Domínio.

**Fora do site (já pode começar)**
12. Completar a ficha do Google com site, fotos e respostas às avaliações, e começar a pedir avaliações.
