# Pendências

Campos que dependem do João ou do cliente. Nada aqui é inventado no site: enquanto estiver aberto, o campo fica pendente.

Legenda: **[trava]** impede a produção · **[aviso]** não impede.

## Da sessão 0 (fundação)

- **[aviso] Caminhos citados no CLAUDE.md.** O bloco de contexto foi gravado sem alteração e cita os arquivos na raiz. Eles agora estão em:
  - `docs/PRIMEHOUSE_INVESTIGACAO_CLIENTE.md`
  - `docs/PRIMEHOUSE_MAPA_MIDIA.md`
  - `docs/PRIMEHOUSE_PACOTE_PROMPTS_CODE.md`
  - `docs/dados/avaliacoes-google.json` (antes `PRIMEHOUSE_AVALIACOES_GOOGLE.json`)
  Se o João quiser, atualizamos o texto do CLAUDE.md (precisa de ordem expressa, pois o bloco é "sem alterar").
- **[aviso] Git LFS para `modelos-originais/`** (GLB e splat fonte): aguardando autorização do João. Até lá a pasta fica vazia e nenhum arquivo pesado entra no git.
- **[aviso] Domínio definitivo.** `site` no `astro.config.mjs` não foi definido (necessário para sitemap e URLs canônicas na sessão 8).
- **[aviso] Scripts ainda não implementados** (saem com erro de propósito, para nunca darem falso "verde"): `audit-pesos` e `model:prepare` (6B), `audit-seo` (8), `audit-a11y` e `audit-lighthouse` (9). (`media:prepare` na sessão 1; `validate-config` e `audit-compliance` na sessão 2.)

## Da sessão 1 (mídia)

Detalhes em `docs/MIDIA_CATALOGO.md`.

- **[trava] Consentimento pendente** (derivados ficam em `media-privada/`, fora do site): `equipe`, `lucas-discurso` (inserções de convidados), `acompanhamento`, `filme-inauguracao`, `plano-select` (professora) e as fotos dos carrosséis 22–34. Publicar só depois de `consentimento: "autorizado"` no manifesto.
- **[aviso] `plano-prime` com `naoUsar`:** fala e legenda queimada com "matrícula é gratuita", "de graça" e "o primeiro mês é por nossa conta" (vetados). Só sai do `naoUsar` com uma versão nova do vídeo.
- **[aviso] `avaliacao-funcional`:** a fala compara com "outras academias". Decisão de uso do João (sessão 9).
- **[aviso] Sem 16:9 real.** Vídeos verticais 720×1280; o recorte 16:9 tem 720×404 e não serve para hero de tela cheia no desktop. Pedir os originais (de preferência horizontais 4K).
- **[aviso] Áudio:** `audioLiberado=false` em tudo (trilha sem direito confirmado).
- **[aviso] Marcas de terceiros** visíveis nos recortes de "Conforto" (Monster, Philips Walita, logos de streaming, embalagens Disney no espaço kids). Conferir na sessão 9.
- **[aviso] ffmpeg é obrigatório no build** (`prebuild` roda `media:prepare`). Confirmar na sessão 9 se o ambiente de deploy tem ffmpeg ou se o build sobe com `public/media/` já gerado.

## Da sessão 2 (config e travas)

`pnpm validate-config` lista tudo o que está pendente na config (hoje: 0 erros, 0 travas, 21 avisos).

- **[trava se publicado] Benefícios fixos do Plano Prime** (garantia de 14 dias, trancamento de 30 dias no anual, Sexta Prime): `bloqueante("confirmar por escrito")`. Aparecem só no preview, com selo PROVISÓRIO; o `audit-compliance` derruba a produção se o texto aparecer no HTML.
- **[aviso] O que o Plano Prime inclui:** não há fonte; texto provisório só no preview.
- **[aviso] Plano Duo:** a condição "2ª pessoa com 50%" fica fora do site (é preço). O texto diz só "um plano para treinar em dupla".
- **[aviso] Feriados:** calendário nacional de 2026–2027 cadastrado. Confirmar os feriados municipais de Lages e as datas especiais (post de 14/08/2026).
- **[aviso] Fabricante** dos halteres e da esteira não confirmado (o "100% Cimerian" fica para o maquinário).
- **[aviso] Zonas do 3D:** todas com `fonteLayout: "pendente"` e `camera: null`. Qualquer câmera sem planta ou captura trava a produção.
- **[aviso] Descrições das zonas** são factuais e curtas, só para estrutura: o texto final é da sessão 5.
- **[aviso] Avaliação da Ronielle S.** começa com "Melhor academia de Lages". Só pode aparecer como citação literal, num elemento com `data-avaliacao-literal="g-004"`: o audit confere se o texto é idêntico ao do Google e só então isenta o trecho.
- **[aviso] Razão social, CNPJ, CREF do responsável técnico, estacionamento e acessibilidade:** `opcional()`, ficam fora do site até chegarem.
- **[aviso] Indexação desligada** (`indexar = false`) até a sessão 9, mesmo em produção.

## Da sessão 3 (design system)

Detalhes em `docs/design/DESIGN_SYSTEM.md`.

- **[aviso] Laranja:** medido no logo do vídeo e no avatar (matiz 34°). O `#EC8A2A` (30°) continua provisório; trocar só pelo código oficial do manual de marca.
- **[aviso] Favicon:** o logo empilhado a 16–32 px fica ilegível. Sugestão para o João: um monograma ("PH" ou o "P" da marca) só para o ícone, se o manual de marca permitir.
- **[aviso] Mapa:** o `MapaEstatico` é um localizador tipográfico (coordenadas, plus code, rotas). Um mapa desenhado precisa de base cartográfica com licença (OpenStreetMap, com atribuição) ou de arte do marketing; o servidor de tiles está bloqueado nesta sessão.
- **[aviso] `/_estilo`:** o Astro não roteia arquivos com `_`, então `src/pages/_estilo.astro` é publicado em `/_estilo/` por `src/pages/[interna].astro`, **só no preview** (em produção a rota não existe).
- **[aviso] MDN:** `developer.mozilla.org` está bloqueado na rede da sessão; a pesquisa usou o repositório `mdn/content` e o `@mdn/browser-compat-data`.

## Da sessão 4 (abertura e hero)

Detalhes em `docs/design/ABERTURA_HERO.md`.

- **[aviso] Escolha do hero:** A (interior) × B (drone) em `/_hero-a` e `/_hero-b`. A home usa o A. No B, no celular, o letreiro aceso fica atrás do H1 e compete com ele.
- **[aviso] "Fazer o tour"** aponta para `#a-casa`, que só passa a existir na sessão 6B (A Casa em 3D).
- **[aviso] Hero no desktop** usa o vídeo vertical numa moldura (resolução nativa). Tela cheia 16:9 de verdade depende dos originais horizontais.
- **[aviso] `letreiro-aceso`** não entrou: a sequência pedida usa o teto e o logo. Fica para o manifesto ou para "Como chegar".
- **[aviso] H1 provisório** ("O novo padrão de treino em Lages."): a sessão 5 refina.
- **[aviso] `astro preview` no Astro 7** roda como serviço em segundo plano; os scripts de captura usam `--ignore-lock` para cada um ter o seu.

## Da sessão 5 (textos)

Textos em `src/content/textos/` (fonte de cada frase real em `fontes.ts`; lista viva em `pendenciasTexto`, `index.ts`).

- **[aviso] Carrossel "5 sinais":** o material baixado tem só 4 sinais (capa, 4 artes, fechamento). O quiz usa os 4 reais e o título não diz "5". Pedir a arte que falta.
- **[aviso] H1 da home:** provisório, baseado na bio ("Novo padrão de academia em Lages").
- **[trava se publicado] Benefícios fixos e "o que o Plano Prime inclui":** texto pronto, marcado `provisorio()`.
- **[aviso] Sem informação:** nutricionista na equipe, estacionamento, acessibilidade, feriados municipais, e-mail para currículos, dicas de execução (sem vídeo de técnica), lista completa do maquinário.
- **[aviso] Equipe:** a página está pronta para nome, foto, CREF/CREFITO e especialidade, com autorização. Hoje mostra só o Lucas e o texto geral.
- **[aviso] Frases cortadas pela seção 8:** a comparação com outras academias (duas frases da marca e a fala da avaliação funcional) e as ofertas de campanha da fala do Plano Prime. Ficou só a parte positiva de cada frase.
- **[aviso] Privacidade:** razão social, CNPJ, encarregado (DPO) e a decisão de analytics/cookies (sessão 7).

## Da sessão 6A (home)

- **[aviso] Links para páginas internas** (`/a-casa`, `/maquinario`, `/planos`, rodapé…) dão 404 até a sessão 6C/6B.
- **[aviso] Vídeo "acompanhamento" e trecho da equipe:** consentimento pendente. A home usa o still da anilha (sem rostos) e o `lucas-close` (só o Lucas).
- **[aviso] "Avaliar no Google"** leva à ficha (cid); o link direto de avaliação precisa do Place ID.
- **[aviso] Garantia nos números:** em produção, "14 dias" só aparece confirmado; até lá, "Trânsito livre".
- **[aviso] CSS embutido no HTML** (`inlineStylesheets: 'always'` no `astro.config.mjs`): tira os 2 CSS que bloqueavam a renderização (FCP 1,06 s → 0,80 s; LCP 1,96–2,05 s → 1,89 s).

## Da sessão 6B (A Casa em 3D)

Detalhes em `docs/3d/README.md` (como entregar) e `docs/3d/RELATORIO.md` (pesos medidos).

- **[aviso] Maquete esquemática:** sem planta, o tour usa uma maquete gerada (galpão e zonas como blocos, sem medidas reais) com o selo "Representação esquemática — em breve, o tour real". **Em produção só aparece com a aprovação do João** (`src/config/tour3d.ts` → `confirmado(true, 'João, <data>')`). Sem aprovação: `/a-casa` mostra a lista de zonas com fotos e vídeos, e a home não oferece o botão 3D.
- **[trava se publicado] Layout das zonas:** `fonteLayout` segue `"pendente"` e `camera: null` na coleção; as poses da esquemática ficam só dentro do GLB esquemático. Com a planta, trocar para `"planta"`.
- **[aviso] Para o tour real, pedir:** planta baixa com cotas e posição das máquinas (modelo Cimerian), desenho das luminárias de LED, e uma captura 3D por zona (`modelos-originais/splats/<zona>.ply`). Formato, escala, eixo e nomes em `docs/3d/README.md`.
- **[aviso] KTX2:** o `toktx` (KTX-Software) não está neste ambiente; o pipeline usa WebP para as texturas até ele ser instalado no ambiente de build. A esquemática não tem texturas.
- **[aviso] fps medido por software:** o contêiner não tem GPU (WebGL via SwiftShader). Desktop 1440: 60 fps; Android emulado (412×915, DPR 2,6, CPU 4× mais lenta): 36–60 fps. Confirmar num Android real intermediário.
- **[aviso] Pós-build `ligar-tour`:** escreve no HTML da home a URL do chunk da ilha (import nativo) para o teaser não pôr requisições no caminho do LCP.

## Do cliente (herdado do pacote de prompts, seção C)

- [trava] Confirmação por escrito dos benefícios fixos: garantia de 14 dias, trancamento de 30 dias no anual, Sexta Prime.
- [trava] Autorizações de imagem de alunos, professores e fisioterapeuta.
- [aviso] Laranja oficial da marca (provisório #EC8A2A) e manual de marca.
- [aviso] CREF do responsável técnico, CNPJ, m², nº de máquinas.
- [aviso] Planta baixa com medidas, lista do maquinário e captura 3D por zona.
- [aviso] Fotos em alta do interior e arquivos originais dos vídeos.
