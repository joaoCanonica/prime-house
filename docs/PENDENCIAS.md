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

## Do cliente (herdado do pacote de prompts, seção C)

- [trava] Confirmação por escrito dos benefícios fixos: garantia de 14 dias, trancamento de 30 dias no anual, Sexta Prime.
- [trava] Autorizações de imagem de alunos, professores e fisioterapeuta.
- [aviso] Laranja oficial da marca (provisório #EC8A2A) e manual de marca.
- [aviso] CREF do responsável técnico, CNPJ, m², nº de máquinas.
- [aviso] Planta baixa com medidas, lista do maquinário e captura 3D por zona.
- [aviso] Fotos em alta do interior e arquivos originais dos vídeos.
