# Funil: caminhos, mensagens e medição

A ação principal do site é uma só: **"Falar com a equipe" no WhatsApp (49) 99804-3861**, com a mensagem já escrita pelo contexto. Não há formulário, cadastro nem backend. Nada do que a pessoa marca (quiz, escolha de plano) é guardado: tudo vira texto no link e só sai do navegador se ela tocar no botão e enviar no WhatsApp.

## 1. Regras do link

- **Um só gerador:** todo link do WhatsApp sai de `linkWhatsApp()` (`src/lib/whatsapp.ts`): `https://wa.me/5549998043861?text=<mensagem codificada>`. Um teste falha se outro arquivo de `src/` escrever `wa.me/` (`tests/whatsapp.test.ts`).
- **Sem JS:** todo CTA já é um `<a href>` pronto no HTML. O quiz e a escolha de plano, que dependem de JS para compor o texto, chegam com a mensagem base do contexto (abaixo).
- **Pós-build:** `scripts/audit-compliance.mjs` confere cada `wa.me` do `dist/`: número com DDI, `text=` presente e mensagem começando com "Olá!". Fora do padrão = erro de build.
- **Termos vetados** valem também dentro do link codificado (a auditoria decodifica).

## 2. Mensagens exatas

Fonte: `mensagens` em `src/lib/whatsapp.ts` e `whatsapp` em `src/content/textos/micro.ts`.

| Chave | Mensagem |
|---|---|
| `geral` | Olá! Vim pelo site da Prime House e quero conhecer a academia. |
| `planoPrime` | Olá! Vim pelo site e quero saber sobre o Plano Prime. |
| `planoSelect` | Olá! Vim pelo site e quero saber sobre o Plano Select. |
| `planoDuo` | Olá! Vim pelo site e quero saber sobre o Plano Duo. |
| `escolherPlano` | Olá! Vim pelo site e quero ajuda para escolher um plano. |
| `avaliacao` | Olá! Vim pelo site e quero agendar minha avaliação funcional. |
| `adaptado.mais40` | Olá! Vim pelo site. Quero treinar com acompanhamento para voltar a treinar depois dos 40. |
| `adaptado.idosos` | Olá! Vim pelo site. Quero treinar com acompanhamento para treinar com segurança na terceira idade. |
| `adaptado.artrose` | Olá! Vim pelo site. Quero treinar com acompanhamento para quem tem artrose. |
| `adaptado.posAvc` | Olá! Vim pelo site. Quero treinar com acompanhamento para o pós-AVC. |
| `adaptado.lipedema` | Olá! Vim pelo site. Quero treinar com acompanhamento para quem tem lipedema. |
| `adaptado.gestante` | Olá! Vim pelo site. Quero treinar com acompanhamento para a gestação. |
| `visita` | Olá! Vim pelo site e quero marcar uma visita à Prime House. |
| `convenio` | Olá! Vim pelo site e quero saber como funciona o convênio Estar Bem. |
| `trabalhe` | Olá! Vim pelo site e quero saber sobre vagas na Prime House. |
| `maquinario` | Olá! Vi o maquinário no site e quero conhecer a academia. |
| `equipe` | Olá! Vim pelo site e quero conhecer a equipe da Prime House. |
| `duvida` | Olá! Vim pelo site e tenho uma dúvida sobre a Prime House. |
| `zona(<nome>)` | Olá! Vi a `<nome no tour>` no tour do site e quero conhecer de perto. |

Zonas do tour (`nomeNoTour` em `src/content/dados/zonas.ts`):

| Zona | Mensagem |
|---|---|
| `recepcao` | Olá! Vi a recepção no tour do site e quero conhecer de perto. |
| `musculacao` | Olá! Vi a sala de musculação no tour do site e quero conhecer de perto. |
| `cardio` | Olá! Vi a área de cardio no tour do site e quero conhecer de perto. |
| `vestiarios` | Olá! Vi a área dos vestiários no tour do site e quero conhecer de perto. |
| `avaliacao-fisio` | Olá! Vi a sala de avaliação no tour do site e quero conhecer de perto. |
| `conveniencia` | Olá! Vi a área de conveniência no tour do site e quero conhecer de perto. |
| `espaco-kids` | Olá! Vi a área kids no tour do site e quero conhecer de perto. |

### Mensagens compostas

- **Quiz "5 sinais"** (home, checkboxes nativos), `mensagemQuiz()`: `avaliacao` + ` Me identifiquei com: <sinal 1>; <sinal 2>.` (os sinais entram como estão, sem o ponto final). Sem nada marcado ou sem JS: `avaliacao`.
  - Exemplo com os sinais 1 e 3: "Olá! Vim pelo site e quero agendar minha avaliação funcional. Me identifiquei com: Você aumenta a carga sem ter certeza de que consegue manter a técnica; Você termina a sessão sem entender o que está tentando desenvolver."
- **Escolha de plano** (`/planos`, rádios nativos), `mensagemEscolhaPlano()`: `plano(<nome>)` ou `escolherPlano` ("Ainda não sei"), mais ` Prefiro treinar de manhã.` / `à tarde.` / `à noite.` se houver período. A prévia da mensagem aparece acima do botão. Sem escolha ou sem JS: `geral`.
  - Exemplo: "Olá! Vim pelo site e quero saber sobre o Plano Duo. Prefiro treinar à noite."

## 3. Caminhos (página → CTA → mensagem)

`origem` é o valor medido (`data-cta-origem`; sem ele, o id da seção, ou `rodape`/`pagina`).

| Página | CTA | origem | Mensagem |
|---|---|---|---|
| todas as internas | "Falar com a equipe" no cabeçalho | `cabecalho` | a da página (abaixo) |
| todas | WhatsApp no rodapé | `rodape` | `geral` |
| `/` | hero "Falar com a equipe" | `hero` | `geral` |
| `/` | quiz "Agendar avaliação funcional" | `quiz` | quiz (composta) |
| `/` | "Quero o Plano Prime/Select/Duo" | `planos` + `plano` | `planoPrime`/`planoSelect`/`planoDuo` |
| `/` (celular) | botão flutuante | `flutuante` | `geral` |
| `/a-casa` | "Quero conhecer esta área", por zona | `tour-3d` + `zona` | `zona(<nome>)` |
| `/planos` | cabeçalho | `cabecalho` | `geral` |
| `/planos` | "Quero o Plano …" por coluna | `pagina-planos` + `plano` | `planoPrime`/`planoSelect`/`planoDuo` |
| `/planos` | "Enviar no WhatsApp" (escolha de plano) | `escolha-plano` + `plano` | escolha (composta) |
| `/planos` | "Perguntar sobre o convênio" | `pagina` | `convenio` |
| `/como-funciona` | cabeçalho e "Agendar avaliação funcional" | `cabecalho` / `pagina` | `avaliacao` |
| `/como-funciona` | "Conversar sobre treino adaptado" | `pagina` | `adaptado.mais40` |
| `/maquinario` | cabeçalho | `cabecalho` | `maquinario` |
| `/equipe` | cabeçalho | `cabecalho` | `equipe` |
| `/trabalhe-conosco` | cabeçalho e "Quero trabalhar na Prime House" | `cabecalho` / `pagina` | `trabalhe` |
| `/horarios-e-como-chegar` | cabeçalho | `cabecalho` | `visita` |
| `/perguntas-frequentes` | cabeçalho e fecho | `cabecalho` / `pagina` | `duvida` |
| `/privacidade` | cabeçalho | `cabecalho` | `geral` |
| 404 | "Falar com a equipe" | `pagina` | `geral` |

Secundários (medidos): Instagram (`clique_instagram`), Google Maps / Waze / Apple Mapas (`clique_como_chegar`), "Fazer o tour" (abre `/a-casa` ou o teaser; mede `tour_3d_aberto` quando a maquete monta).

## 4. Medição

### Proposta: Plausible, sem cookie, pelo próprio domínio

| | Plausible (escolhido) | Umami | GA4 |
|---|---|---|---|
| Cookie / identificador | nenhum | nenhum | cookies `_ga` (precisa de consentimento) |
| Banner exigido para medir | não | não | sim: só mede quem aceita (amostra enviesada) |
| Peso no navegador | nosso envio (≈ 1 KB, sem script de terceiro) | script próprio (≈ 2 KB) | gtag ≈ 50 KB+ |
| Dados vão para | Plausible (UE), agregados | servidor próprio ou Umami Cloud | Google (EUA), com transferência internacional |
| Eventos com propriedades | sim (`props`) | sim | sim |
| Custo / operação | assinatura (ou Community Edition própria) | grátis se hospedado por nós (exige servidor e banco) | grátis |

**Por quê:** o objetivo é saber de onde vêm os cliques no WhatsApp, e não seguir pessoas. O Plausible mede sem cookie e sem dado pessoal, então mede 100% das visitas sem depender do banner. Sem script de terceiro, o JS inicial fica dentro do orçamento e a regra "nenhum request de terceiro antes do consentimento" se mantém. O Umami é equivalente se a WAXLO preferir hospedar (o envio em `src/lib/medicao.ts` troca só o corpo e o endereço). O GA4 só entraria **depois do Aceitar** e perderia quem recusa. Não recomendo.

### Como funciona (`src/lib/medicao.ts`, `src/config/medicao.ts`)

- O envio vai para **`/m/evento` no próprio domínio**. O host reescreve esse caminho para `https://plausible.io/api/event` (proxy de primeira parte; o navegador nunca fala com terceiros). Exemplos:
  - Netlify (`public/_redirects`): `/m/evento  https://plausible.io/api/event  200`
  - Vercel (`vercel.json`): `{ "rewrites": [{ "source": "/m/evento", "destination": "https://plausible.io/api/event" }] }`
  - Conferir na documentação de proxy do Plausible se o host repassa o IP (`X-Forwarded-For`) para a contagem de visitantes únicos.
- **Desligado até haver domínio:** com `medicao.dominio` nulo, nada sai do navegador; o evento só é emitido no DOM (`prime:evento`), o que os testes observam.
- **Global Privacy Control ou Do Not Track ligados:** nada é enviado.
- Um ouvinte de clique (fase de captura, sem mexer na navegação) classifica o link pelo destino. Por isso nenhum CTA novo fica sem medição.
- As ilhas 3D pedem a medição por evento do DOM (`prime:medir`), sem import, para não pesar o caminho do LCP.

### Eventos

| Evento | Quando | Propriedades |
|---|---|---|
| `pageview` | ao carregar a página | — |
| `clique_whatsapp` | clique em qualquer link `wa.me` | `origem`, `plano` (prime/select/duo), `zona` (id da zona) |
| `tour_3d_aberto` | a maquete 3D montou | `zona` (a ativa; no teaser da home, `musculacao`) |
| `tour_3d_realismo` | clique em "Ver de verdade" | `zona` |
| `clique_como_chegar` | Google Maps, Waze ou Apple Mapas | `origem`, `destino` (google/waze/apple) |
| `clique_instagram` | link do Instagram | `origem` |

No Plausible, cadastrar os eventos acima como metas (Goals → Custom event) e as propriedades em "Custom properties".

## 5. Consentimento (LGPD)

- **O que depende do Aceitar:** só o que usa cookie de terceiros. Hoje é o **mapa interativo do Google** em `/horarios-e-como-chegar`. Se um dia houver GA4, ele entra pelo mesmo `aoAceitar()` (`src/components/consentimento/consentimento.ts`).
- **Banner** (`Consentimento.astro`, dentro do rodapé de todas as páginas): aparece na primeira visita, com **Aceitar e Recusar de mesmo peso** (mesma forma, cor e tamanho, lado a lado). Não bloqueia a página nem rouba o foco. Sem JS não aparece, porque sem JS nada de terceiro carrega.
- **Mapa:** clicar em "Abrir mapa interativo" sem ter aceitado abre o banner com o motivo. O mapa só carrega depois do Aceitar.
- **Preferência:** "Preferências de cookies: aceitos/recusados/sem escolha" no rodapé reabre o banner. A escolha fica no `localStorage` (`prime-consentimento`, versão 1, vale 12 meses). Não é cookie e não sai do navegador.
- **Garantias automáticas:**
  - a auditoria pós-build trava se o HTML carregar script, iframe, imagem, CSS ou preconnect de outro domínio;
  - o e2e percorre todas as rotas e confirma zero requests de terceiros e zero cookies antes do consentimento.

## 6. Testes

```bash
pnpm build
```

```bash
pnpm test:e2e
```

`tests/e2e/funil.e2e.ts` (Playwright, 390 px) cobre:

- **Link exato aberto pelo clique, em 6 cenários:**
  - home, hero;
  - `/planos`, coluna do Select;
  - escolha de plano (Duo à noite);
  - quiz (2 sinais);
  - zona do 3D (cardio);
  - `/trabalhe-conosco`.
- **Sem JS:** escolha de plano → `geral`; quiz → `avaliacao`; banner ausente.
- **Terceiros:** todas as rotas sem request de terceiro e sem cookie antes do consentimento.
- **Mapa:** sem aceite, só o banner; com aceite, o Google carrega.
- **Rodapé:** a preferência muda no rodapé e é lembrada entre páginas.
- **Eventos:** `clique_whatsapp` com `origem`, `plano` e `zona`; `clique_como_chegar`; `clique_instagram`; `tour_3d_aberto`; `tour_3d_realismo`. No build de produção sem maquete aprovada, o teste do 3D é pulado.

## 7. Depende do João

- **Medição:** confirmar o Plausible (ou escolher Umami próprio), criar a conta com o domínio do site e preencher `medicao.dominio` em `src/config/medicao.ts`.
- **Hospedagem:** dizer onde o site fica, para configurar o proxy `/m/evento`.
- **Página `/privacidade`:** o texto sobre medição fica com o selo PROVISÓRIO até a medição ser ligada. Razão social, CNPJ e encarregado (DPO) continuam pendentes.
