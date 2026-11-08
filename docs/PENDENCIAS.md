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
- **[resolvido na sessão 9] Scripts de auditoria:** todos implementados (`audit-pesos`, `audit-seo`, `audit-a11y`, `audit-lighthouse`). `scripts/pendente.mjs` fica para scripts futuros.

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
- **[aviso] Privacidade:** razão social, CNPJ e encarregado (DPO). A medição foi decidida na sessão 7 (ver abaixo).

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

## Da sessão 6C (páginas internas)

- **[aviso] Foto do Lucas:** `/equipe` usa um quadro do vídeo `lucas-close`, que tem a legenda "coragem" queimada (não pode ser apagada, §7). Pedir uma foto real do fundador e, com autorização, dos professores e da fisioterapeuta.
- **[aviso] Equipe:** nomes, CREF e especialidades dos professores e da fisioterapeuta ainda não informados. Em preview, a página mostra lugares marcados PROVISÓRIO; em produção, só o texto sobre a equipe e o fundador.
- **[aviso] Vídeos dos planos:** `plano-prime` está `naoUsar` e `plano-select` aguarda consentimento; `/planos` sai sem vídeo até lá.
- **[aviso] Vídeos de execução:** nenhum aparelho tem vídeo curto de execução; o botão "Ver execução" só aparece quando houver (`video` no equipamento).
- **[aviso] Fotos de máquinas:** puxada alta, agachamento pêndulo e remada não têm foto própria; usam um objeto tipográfico até chegar foto.
- **[aviso] Contato e local:** e-mail para candidaturas, estacionamento e acessibilidade pendentes (só aparecem em preview).
- **[aviso] Layout `src/layouts/Interna.astro`:** criado fora do escopo listado para não repetir cabeçalho e rodapé em nove páginas.

## Da sessão 7 (funil e LGPD)

- **[aviso] Medição desligada até haver domínio:** proposta Plausible (sem cookie, pelo próprio domínio; ver `docs/FUNIL.md` §4). Falta o João confirmar (ou escolher Umami próprio), criar a conta e preencher `medicao.dominio` em `src/config/medicao.ts`.
- **[aviso] Proxy `/m/evento`:** depende de onde o site será hospedado (Netlify, Vercel, Cloudflare…); exemplos em `docs/FUNIL.md`.
- **[aviso] Texto de medição em /privacidade:** segue PROVISÓRIO até a medição ligar.
- **[aviso] Mensagens novas do WhatsApp:** `escolherPlano`, `maquinario`, `equipe` e `duvida` (texto nosso, no padrão das existentes). Revisar com a equipe que atende.
- **[aviso] Escolha de plano:** pergunta o período preferido (manhã/tarde/noite) só para a mensagem; nada é guardado. Confirmar se a equipe quer essa informação.

## Da sessão 8 (SEO e GEO)

- **[aviso] Domínio (`SITE_URL`):** sem ele, sem canonical e com `og:image` relativa (o `audit-seo` avisa). Com `indexar = true` em produção, a falta de `SITE_URL` vira erro.
- **[aviso] Rich Results Test e validator.schema.org:** recusam acesso automatizado a partir do ambiente de desenvolvimento (captcha e 403). O JSON-LD passou na validação local contra o vocabulário oficial (`docs/seo/validacao-local.md`, 0 erros). Rodar os dois com a URL publicada e guardar as capturas (`docs/SEO_GEO.md` §3.1).
- **[aviso] FAQ:** o Google retirou o rich result de FAQ em 07/05/2026. O FAQPage segue no site para Bing e IAs, mas não gera destaque no Google.
- **[aviso] Imagem social:** usa a captura 01 (≈ 900 px) a 470 px. Trocar por foto em alta da sala com as luzes acesas quando chegar.
- **[aviso] Checklist fora do site** (ficha, avaliações sem incentivo, NAP no Instagram/WhatsApp Business/Apple/Bing, post com "2553", teste mensal): `docs/SEO_GEO.md` §3.

## Da sessão 9 (QA, conferência e deploy)

Detalhes em `docs/QA.md`, `docs/CONFERENCIA_FINAL.md` e `docs/DEPLOY.md`.

- **[aviso] Abertura × LCP:** com a abertura (1ª visita da sessão), o H1 do hero só entra em ≈ 2,35 s e o LCP medido no celular fica em ≈ 3,8 s. Sem abertura, ≈ 0,32 s. Antecipar o H1 exige mudar o voo do logo (testado: colide com o logo grande). Decisão do João: manter, encurtar ou redesenhar o fim da abertura.
- **[aviso] CREF do responsável técnico:** recomendo não indexar sem ele no rodapé (exigência do conselho para academias).
- **[aviso] Marcas de terceiros na foto da esteira com TV** (logos de streaming e redes sociais na tela) e no texto do card: trocar a foto ou aprovar o uso.
- **[aviso] Deploy:** o build precisa de ffmpeg; na Vercel, usar `vercel build` + `vercel deploy --prebuilt` (ou instalar ffmpeg no build). Definir `SITE_URL` em Production. Conferir com `pnpm conferir-deploy <url>` (compressão do GLB não confirmada na documentação da Vercel).
- **[aviso] CSP:** sem splat nem GLB com Draco/KTX2 hoje, o "Ver de verdade" real não foi testado sob a CSP. Conferir no primeiro splat.
- **[aviso] HSTS sem `preload`:** incluir na lista de preload é decisão do João (difícil de desfazer).
- **[aviso] WebKit:** 1 erro de JS intermitente em 1 de 8 rodadas do teste de teclado (não reproduzido em 5 tentativas). Conferir num iPhone real.
- **[aviso] fps e memória medidos por software** (sem GPU). Conferir num Android intermediário real.

## Respostas do João (08/11/2026)

- **[resolvido] CNPJ 64.525.617/0001-03** (dígitos verificadores conferidos): no rodapé, em `/privacidade` e no JSON-LD (`taxID`).
- **[resolvido] Responsável técnico: Lucas Moro** no rodapé. **[aviso] CREF:** não encontrado em busca pública em 08/11/2026. Entra em `src/config/marca.ts` (`responsavelTecnico.cref`) quando o João enviar.
- **[resolvido] Benefícios fixos** (garantia de 14 dias com devolução integral, trancamento de 30 dias no anual, Sexta Prime): confirmados pela fala do Lucas no vídeo do Plano Prime e pelo João. Publicados em `/planos`, na home (número "14 dias") e na FAQ. As ofertas de campanha do mesmo vídeo ("matrícula gratuita", "primeiro mês por nossa conta") seguem fora (seção 8), e o vídeo segue `naoUsar`.
- **[resolvido] Maquete esquemática aprovada** para produção, com o selo "Representação esquemática". A recepção ganhou foto (parede com o logo). **[aviso]** O layout real e o "Ver de verdade" esperam os vídeos da academia completa que o João vai conseguir.
- **[resolvido] Decisões de marca:** H1, "atendimento de verdade" e a foto da esteira ficam como estão.
- **[aviso] Foto do Lucas:** a enviada tem 150×150 px (fica borrada no site). Pedir o arquivo original.
- **[aviso] Abertura × LCP:** o João vai avaliar e retornar.
- **[aviso] O que o Plano Prime inclui:** segue sem fonte (fora da produção).
- **[aviso] Publicação:** a conta da Vercel conectada nesta sessão é de outra pessoa (plano Hobby, que é para uso não comercial). O deploy espera a decisão do João sobre a conta.

## Redesenho da home (08/11/2026, pedido do João)

- **[resolvido] Abertura mais longa (5,6 s):** as luzes acendem com calma, o letreiro aparece sozinho e só então se dissolve sobre a sala. O vídeo não aparece mais por trás do letreiro.
- **[aviso] Abertura × LCP:** o H1 já fica pintado por baixo da abertura desde o 1º quadro, mas o LCP medido na 1ª visita da sessão cresce com a abertura mais longa. Sem a abertura (2ª página em diante e Lighthouse), o LCP da home é ≈ 1,1 s.
- **[resolvido] Acento dos títulos:** a palavra em itálico serifado virou palavra vazada com contorno de luz (a assinatura LED). O itálico ficou só nas citações reais.
- **[resolvido] Números:** "5 máquinas de puxada alta" saiu. Entraram 7 dias por semana e 19 h por dia de segunda a sexta, tirados de `src/config/horario.ts`.
- **[resolvido] Experiência:** a grade de recortes ("Conforto") virou 5 capítulos (professor, máquinas, cardio, pausa, detalhes), com vídeos reais e fotos.
- **[resolvido] Mais mídia:** o vídeo do acompanhamento ficou ao lado de "Uma ficha é importante…"; os outros vídeos e fotos novos entraram nas seções da home:
  - fotos de aula em "Para todo corpo";
  - o filme da inauguração em "A história";
  - a fileira "O dia a dia" com link para o Instagram.
- **[resolvido] Mapa (replicado do site do Dr. Agenor, do Marco Oliver):**
  - **mapa 3D desenhado** em Three.js, do próprio site: quarteirões em grafite, a avenida, a Prime House acesa com o alfinete laranja e o nome da rua. Gira sozinho e com o arraste ou as setas;
  - **mapa real em 3D:** MapLibre GL + OpenFreeMap, sem chave e sem cookies, repintado na paleta, com prédios em relevo e o marcador PRIME HOUSE ACADEMIA na Av. Duque de Caxias;
  - o mapa real só carrega no clique em "Mapa real" (ou sozinho, se a pessoa aceitou); o iframe do Google saiu;
  - **[aviso]** o OpenFreeMap é um serviço gratuito mantido por doações. Se sair do ar, o site volta para o mapa desenhado sozinho.
- **[resolvido] Tour:** botão "Voltar ao site" fixo no topo de `/a-casa`.
- **[aviso] 3D:** o João vai mandar vídeos de todos os ambientes; com eles, o layout real da maquete e o "Ver de verdade".
- **[aviso] Lighthouse de `/a-casa`:** 82–84 de desempenho (TBT ≈ 650 ms) nesta medição. A medida é a mesma com a página anterior a esta sessão, então não é desta mudança; a causa fica para investigar. A home segue com 100.

## Do cliente (herdado do pacote de prompts, seção C)

- [resolvido em 08/11/2026] Benefícios fixos confirmados (fala do Lucas no vídeo + João).
- [resolvido em 08/11/2026] Autorizações de imagem de alunos, professores, fisioterapeuta e equipe (João: "Sim, todos autorizados").
- [aviso] Laranja oficial da marca (provisório #EC8A2A) e manual de marca.
- [aviso] CREF do responsável técnico (Lucas Moro), m², nº de máquinas. CNPJ recebido em 08/11/2026.
- [aviso] Planta baixa com medidas, lista do maquinário e captura 3D por zona.
- [aviso] Fotos em alta do interior e arquivos originais dos vídeos.
