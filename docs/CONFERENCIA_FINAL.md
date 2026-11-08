# Conferência final de normas (sessão 9, a única passada)

Data: 08/11/2026. Base: build de **produção** (`MODO=producao`), sem `SITE_URL`, com `indexar = false`.

Esta conferência é técnica e de conteúdo. **Não substitui parecer jurídico.** Os pontos marcados "depende do João" precisam de decisão ou documento do cliente.

## 0. Travas

**Nenhuma trava foi afrouxada.** `git diff` desta sessão não toca em:

- `src/config/` (termos, verificação, tipos);
- `scripts/audit-compliance.mjs`, `scripts/validate-config.mjs`, `scripts/audit-seo.mjs`;
- `src/content/dados/`.

Foram **acrescentadas** duas garantias:

- **CSP por hash:** `scripts/csp-completar.mjs` falha se houver script inline antes da política.
- **Auditoria de pesos** (`scripts/audit-pesos.mjs`).

| Verificação | Resultado |
|---|---|
| `audit-compliance` (produção, 11 páginas) | 0 achados |
| `validate-config` (produção) | 0 erros, 0 travas, 22 avisos (todos em `docs/PENDENCIAS.md`) |
| `audit-seo` (produção) | 0 erros, 1 aviso (domínio não definido) |
| testes (`pnpm test`) | 125/125 (termos, travas simuladas, funil, SEO, deploy) |

## 1. CDC e CONAR (publicidade)

| Item | Situação | Como foi conferido |
|---|---|---|
| Superlativo comparativo na voz da academia ("melhor", "maior", "nº 1"…) | **ok:** nenhum | termos vetados no HTML, JS, XML e TXT (`audit-compliance`), mais uma varredura extra de "único", "líder", "garantia", "gratuito", "promoção", "cura", "emagreça", "resultado garantido" no texto renderizado |
| "Melhor academia de Lages" | **ok, com ressalva:** só como **citação literal** da avaliação de Ronielle S. no Google (`data-avaliacao-literal="g-004"`); a trava confere o texto palavra por palavra | `audit-compliance` |
| Preço, promoção, "matrícula grátis", contagem regressiva | **ok:** nenhum. Planos sem preço ("Fale com a equipe e conheça as condições"); vídeo `plano-prime` (fala "matrícula gratuita") segue `naoUsar` | trava + manifesto |
| Benefícios fixos (14 dias, trancamento, Sexta Prime) | **ok:** fora da produção até confirmação por escrito | trava `beneficio-nao-confirmado` |
| Concorrentes citados ou atacados | **ok:** nenhum | leitura das 11 páginas |
| Saúde ("tratar", "curar", "emagrecer X kg") | **ok:** "treino orientado e adaptado, com acompanhamento de fisioterapeuta" e o aviso "não substitui o acompanhamento médico" | leitura de `/como-funciona` e da home |
| **Depende do João** | **"atendimento de verdade"** (hero) e o H1 **"O novo padrão de treino em Lages"** (provisório, da bio) são afirmações subjetivas da própria marca, sem comparação explícita. Risco baixo, mas é decisão de marca | |

## 2. LGPD

| Item | Situação |
|---|---|
| Consentimento real | banner com **Aceitar e Recusar de mesmo peso**; preferência alterável no rodapé; nada de terceiro carrega antes do aceite (e2e: 0 requests de terceiros e 0 cookies em todas as rotas; o mapa do Google só depois do clique **e** do Aceitar) |
| Banner × abertura | **corrigido nesta sessão:** o banner aparecia durante a abertura, por cima do "Pular abertura". Agora espera a abertura terminar |
| Medição | desligada até haver domínio; quando ligar, Plausible sem cookie pelo próprio domínio, respeitando GPC e DNT (`docs/FUNIL.md`) |
| Dados de saúde | o quiz "5 sinais" e a escolha de plano **não guardam nada**: tudo vira texto do link do WhatsApp, enviado só se a pessoa quiser. Não há formulário nem backend |
| Alunos com condição de saúde | nenhum aluno aparece no site |
| Página `/privacidade` | ok. **Depende do João:** razão social, CNPJ e contato do encarregado (DPO); o texto de medição segue PROVISÓRIO |

## 3. Direito de imagem

Mídias publicadas em produção: 20, conferidas no manifesto e nos quadros. Os vídeos foram amostrados a cada segundo.

| Mídia | Pessoas | Situação |
|---|---|---|
| `lucas-close`, `avaliacao-funcional` | Lucas Moro (fundador) | consentimento **autorizado** no manifesto |
| `interior-noite`, `still-interior`, `still-anilha`, `still-halteres` | pessoas ao fundo, de costas ou atrás das máquinas | **ok:** nenhum rosto identificável nos quadros publicados |
| `drone-noite` | público da inauguração na calçada, visto do drone à noite | **ok:** ninguém identificável |
| `still-fachada-dia`, `captura-*`, `conforto-*` | nenhuma | ok |
| Consentimento pendente (`equipe`, `acompanhamento`, `filme-inauguracao`, `plano-select`, carrosséis 22–34) | — | **fora do site:** a trava `midia-consentimento-pendente` impede |
| Influenciadores e parceiros | nenhum conteúdo de terceiros publicado | ok |
| **Depende do João** | **marcas de terceiros na imagem da esteira com TV** (YouTube, Netflix, Disney+, X, Facebook, Instagram, Spotify) e o texto "YouTube, Netflix, Disney+, Prime Video e Spotify na tela". É uso descritivo e o risco é baixo, mas uma foto com a tela em outro estado evita a associação. Também: Monster, Philips Walita e embalagens Disney nos recortes de "Conforto" | |

## 4. CREF e responsável técnico

- **Depende do João:** o rodapé está pronto para "Responsável técnico · {nome} · CREF {número}" (`src/config/marca.ts` → `crefResponsavel`). Até a informação chegar, a produção **não mostra** nada (o selo PROVISÓRIO só aparece no preview).
- A indicação do responsável técnico é exigência do conselho para academias. **Recomendo não indexar o site sem o CREF no rodapé.**
- Equipe: nomes e CREF/CREFITO dos professores e da fisioterapeuta só entram com dado confirmado e autorização de imagem.

## 5. Google

| Item | Situação |
|---|---|
| AggregateRating / Review no JSON-LD | **ausentes**; o `audit-seo` trava se aparecerem (avaliação "self-serving" é inelegível; ver `docs/SEO_GEO.md`) |
| Avaliações no site | citações literais, sem estrelas e sem nota agregada |
| Campanha de avaliação | sem incentivo (política "Fake engagement" do Google), em `docs/SEO_GEO.md` §3.3 |
| Indexação | `noindex` em tudo até a autorização (sessão 9: `indexar` continua `false`, **decisão do João**) |

## 6. O que depende do João antes de publicar

1. **CREF do responsável técnico** (e CNPJ/razão social) para o rodapé e para `/privacidade`.
2. **Confirmação por escrito dos benefícios fixos**, se quiser publicá-los. Sem ela, ficam fora.
3. **Aprovação da maquete esquemática** do 3D (`src/config/tour3d.ts`). Sem ela, a produção mostra a lista de zonas com fotos e vídeos.
4. **Decisões de marca:** H1 definitivo; "atendimento de verdade"; foto da esteira sem os logos de terceiros.
5. **Domínio** (`SITE_URL`) e **autorização para indexar** (`indexar = true`). Rodar depois o Rich Results Test e o validator.schema.org com a URL pública.
6. **Abertura × LCP:** a abertura de 3 s atrasa o LCP medido na 1ª visita (`docs/QA.md` §1.3). Opções: manter, encurtar ou mudar o voo do logo para o H1 entrar antes.
