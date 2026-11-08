# SEO e GEO: o que o site faz e o que fazer fora dele

Objetivo (CLAUDE.md §1, item 2): Google e IAs descreverem a Prime House como **academia premium, independente, 100% Cimerian e sem lotação**, com o endereço, o horário e o contato corretos.

## 1. Fontes consultadas (07/11/2026)

| Fonte | O que diz | Como entrou no site |
|---|---|---|
| [schema.org/ExerciseGym](https://schema.org/ExerciseGym) | "A gym." Hierarquia: Thing > Organization/Place > LocalBusiness > SportsActivityLocation > ExerciseGym | Tipo principal |
| [schema.org/HealthClub](https://schema.org/HealthClub) | subclasse de HealthAndBeautyBusiness **e** de SportsActivityLocation | Segundo tipo, no mesmo nó |
| [Google: LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business) (atualizada em 08/09/2026) | "Use the most specific LocalBusiness sub-type possible"; "If you have multiple types, specify them as an array"; obrigatórios: `address` e `name`; `geo` com "at least 5 decimal places"; horário que passa da meia-noite numa única especificação | `"@type": ["ExerciseGym", "HealthClub"]`, NAP, geo com 7 casas |
| [schema.org/OpeningHoursSpecification](https://schema.org/OpeningHoursSpecification) | "If the value for the closes property is less than the value for the opens property then the hour range is assumed to span over the next day." | Seg–sex `05:00`–`00:00`, ou seja, até a meia-noite |
| [schema.org/PublicHolidays](https://schema.org/PublicHolidays) | "can be used with OpeningHoursSpecification … to indicate opening hours on public holidays" | Domingo e feriados com **dois turnos** (09–12 e 15–18), uma especificação por turno |
| [schema.org/amenityFeature](https://schema.org/amenityFeature) e [LocationFeatureSpecification](https://schema.org/LocationFeatureSpecification) | usada em Place (e Accommodation, LodgingBusiness…) | Climatização, banheiro e vestiário, espaço kids, café e esteira com TV, só se `confirmado` |
| [schema.org/hasOfferCatalog](https://schema.org/hasOfferCatalog) e [Offer](https://schema.org/Offer) | OfferCatalog "for this Organization, Person, or Service"; `price` é propriedade opcional | Planos como `Offer` → `Service`, **sem preço**; descrição só se confirmada |
| [schema.org/founder](https://schema.org/founder) | domínio Organization; valor Person ou Organization | `founder: Person "Lucas Moro"` |
| [Google: review snippet](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) (08/09/2026) | "If the entity that's being reviewed controls the reviews about itself, their pages that use LocalBusiness or any other type of Organization structured data are ineligible for star review feature." | **Sem AggregateRating e sem Review** (o audit-seo trava) |
| [Google: vídeo](https://developers.google.com/search/docs/appearance/structured-data/video) (24/09/2026) | obrigatórios: `name`, `thumbnailUrl`, `uploadDate` (com fuso recomendado); recomendado: `contentUrl` | VideoObject do vídeo da avaliação funcional, com `transcript` (a fala em HTML da página) |
| [schema.org/VideoObject](https://schema.org/VideoObject) | `transcript`: "If this MediaObject is an AudioObject or VideoObject, the transcript of that object." | idem |
| [Google: trilha](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) | `itemListElement` com `ListItem` (`position`, `name`, `item`) | Início > página, em todas as internas |
| [Google: novidades](https://developers.google.com/search/updates) | 08/05/2026: o rich result de FAQ "will no longer appear in Google Search starting May 7, 2026"; em junho, a documentação foi removida | **FAQPage fica**, por ser vocabulário válido e servir a outros leitores (Bing, IAs), mas **não gera rich result no Google** |
| idem, 15/06/2026 | llms.txt "aren't needed for Google Search (and won't negatively or positively impact your visibility or rankings), it's fine if you want to maintain these files for other services" | llms.txt é para assistentes e IAs, não para o Google |
| [llmstxt.org](https://llmstxt.org/) | em `/llms.txt`: um H1 (o único obrigatório), um resumo em citação, detalhes sem títulos e listas de links em seções H2; seção "Optional" para o secundário; `rel="describedby"` aponta para o llms.txt | `/llms.txt` gerado e `<link rel="describedby">` em todas as páginas |
| [Google: bloquear indexação](https://developers.google.com/search/docs/crawling-indexing/block-indexing) | o noindex "must not be blocked by a robots.txt file", senão o rastreador nunca o vê | robots.txt sempre libera o rastreio; o noindex vem nas páginas |
| [Google: sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) | URLs absolutas e canônicas | sitemap só com as páginas públicas, com o domínio |
| [Google Maps: engajamento falso](https://support.google.com/contributionpolicy/answer/7400114) | proibido "Offer incentives – such as payment, discounts, free goods and/or services - in exchange for posting any review" | campanha de avaliação **sem incentivo** (§4) |

## 2. O que o site já faz (gerado da config)

- **JSON-LD** (`src/components/seo/`), em todas as páginas:
  - ExerciseGym + HealthClub com nome, endereço, geo, telefone, URL, imagem, logo e `sameAs` (Instagram e ficha do Google);
  - horários (com os dois turnos de domingo e feriados), comodidades confirmadas, catálogo de planos sem preço, fundador e data de inauguração;
  - BreadcrumbList nas internas, FAQPage em `/perguntas-frequentes` (só respostas confirmadas) e VideoObject com transcrição em `/como-funciona`.
- **Head** (`Seo.astro`):
  - título, descrição, robots e canonical (com `SITE_URL`);
  - Open Graph com imagem 1200×630 gerada no prebuild (`scripts/gerar-og.mjs`): a sala com as molduras de LED, o logo e "Lages/SC";
  - `lang="pt-BR"`.
- **NAP único:** "Prime House Academia · Av. Duque de Caxias, 1253, Frei Rogério, Lages/SC, CEP 88508-001 · (49) 99804-3861", vindo de `src/config/contato.ts` e `marca.ts`. O `audit-seo` falha se o rodapé, o JSON-LD ou o llms.txt divergirem, se outro número aparecer junto da "Duque de Caxias" (ex.: "2553") ou se o telefone vier noutro formato.
- **Parágrafo-resposta** no topo de cada página (`data-resposta`), com o quê, onde e quando. Na home, logo abaixo do hero.
- **Termos que o conteúdo responde** (o audit falha se algum sumir):
  - academia em Lages;
  - academia no Frei Rogério;
  - academia aberta até meia-noite;
  - academia aberta no domingo;
  - trânsito livre;
  - sem lotação;
  - Cimerian;
  - avaliação funcional;
  - treino com acompanhamento.
- **FAQ com as perguntas reais** do destaque "Dúvidas" como títulos (`h3` dentro do `<summary>`).
- **Indexação:**
  - enquanto `indexar = false` (`src/config/seo.ts`): todas as páginas saem com `noindex`, o robots.txt libera o rastreio sem anunciar sitemap e o sitemap sai vazio;
  - com `indexar = true` + `MODO=producao` + `SITE_URL`: `index, follow`, canonical absoluto, robots.txt com `Sitemap:` e sitemap com as 10 páginas públicas.

### Verificações

| Comando | O que confere |
|---|---|
| `pnpm build` (postbuild) | `audit-compliance` + **`audit-seo`** |
| `node scripts/validar-schema.mjs` | JSON-LD contra o vocabulário oficial do schema.org (tipos, propriedades, domínio, faixa, enumerações) e os obrigatórios do Google. Relatório: [`docs/seo/validacao-local.md`](seo/validacao-local.md) |
| `pnpm test` | `tests/seo.test.ts`: JSON-LD, robots/sitemap nos dois estados, llms.txt e audit-seo com NAP divergente |

> **Rich Results Test e validator.schema.org:** os dois recusam acesso automatizado a partir do ambiente de desenvolvimento (captcha "unusual traffic" e 403 no app). Rode-os à mão quando o site estiver no ar (§3.1).

## 3. Checklist do João (fora do site)

### 3.1 Antes de publicar

- [ ] Definir o domínio e configurar `SITE_URL` no build.
- [ ] Rodar o [Rich Results Test](https://search.google.com/test/rich-results) com a URL da home, de `/como-funciona` e de `/horarios-e-como-chegar`. Esperado: "Local business" e "Breadcrumbs" válidos, e "Video" em `/como-funciona`. O FAQ não aparece mais no teste (o Google retirou o recurso em 2026).
- [ ] Rodar o [validator.schema.org](https://validator.schema.org/) com as mesmas URLs. Esperado: 0 erros.
- [ ] Guardar as capturas em `docs/capturas/`.
- [ ] Autorizar a indexação (sessão 9: `indexar = true`) e enviar o sitemap no Search Console e no Bing Webmaster Tools.

### 3.2 Ficha do Google (Perfil da Empresa)

- [ ] **Site:** colocar o endereço do site (hoje a ficha não tem site).
- [ ] **Descrição:** usar o parágrafo-resposta da home, sem superlativo nem preço.
- [ ] **Serviços:** musculação, cardio, avaliação funcional, treino com acompanhamento (Plano Select) e fisioterapia, esta só se a fisioterapeuta atender pela academia.
- [ ] **Comodidades:** vestiário, banheiro, climatização, espaço kids e café. Estacionamento e acessibilidade, só se forem verdade (estão pendentes no site).
- [ ] **Horário:** conferir com o site, incluindo os dois turnos de domingo, e cadastrar o horário especial de cada feriado.
- [ ] **Fotos e vídeos:** 30 ou mais, de todos os ambientes, com as luzes do teto acesas, a fachada de dia e à noite, as máquinas Cimerian e a equipe (com autorização).
- [ ] **Avaliações:** responder **todas**, inclusive as antigas e a de 2★, com o nome da pessoa, sem copiar e colar.
- [ ] **Categoria:** principal "Academia"; avaliar as secundárias (ex.: "Academia de musculação"), se existirem para a região.

### 3.3 Campanha de avaliações (sem incentivo)

- [ ] **QR code na recepção** apontando para o link "Escrever uma avaliação" da ficha. Texto: "Treina aqui? Conte como é." Sem brinde, sem desconto, sem sorteio: a política do Google proíbe incentivo e remove essas avaliações.
- [ ] **Mensagem no WhatsApp 30 dias após a matrícula**, para todos (não só para quem parece satisfeito): "Oi, {nome}! Já faz um mês que você treina com a gente. Se puder, conte no Google como está sendo: {link}. Obrigado!"
- [ ] Meta da investigação: 100 avaliações em 6 meses. Não pedir para editar ou apagar avaliação negativa: responder e resolver.

### 3.4 NAP igual em todo lugar

O texto exato é "Prime House Academia · Av. Duque de Caxias, 1253, Frei Rogério, Lages/SC, CEP 88508-001 · (49) 99804-3861".

- [ ] **Instagram:** bio com o mesmo endereço e telefone e o link do site.
- [ ] **WhatsApp Business:** perfil com o mesmo nome, endereço, horário, site e catálogo de serviços sem preço.
- [ ] **Apple Business Connect:** reivindicar o local para o Apple Mapas e a Siri.
- [ ] **Bing Places:** importar do Google ou cadastrar.
- [ ] **Parceiros e diretórios:** pedir ao parceiro que publicou "**2553**" que corrija o post para "**1253**". Conferir também o Facebook, se houver, e os diretórios locais.
- [ ] **Nome antigo:** onde aparecer "LM Prime House" (hashtags e perfis antigos), trocar por "Prime House Academia".

### 3.5 Teste mensal sem login

Fazer numa janela anônima, no celular e no computador, de Lages se possível:

1. "melhor academia de Lages" (busca de usuário; o site não usa essa frase)
2. "academia aberta até meia-noite Lages"
3. "academia sem lotação Lages"
4. "academia Frei Rogério Lages"

Para cada uma, anotar a posição da Prime House no mapa e nos resultados, e o que o Modo IA e os assistentes (ChatGPT, Gemini, Perplexity) dizem dela: se citam "independente", "Cimerian", "sem lotação" e o horário correto. Registrar em `docs/SEO_GEO.md` (tabela abaixo) para ver a evolução.

| Mês | Busca | Mapa | Orgânico | O que a IA diz |
|---|---|---|---|---|
| | | | | |

## 4. O que ainda depende de dado do cliente

- **Domínio** (`SITE_URL`): sem ele não há canonical nem `og:image` absoluta. O build avisa.
- **Fotos em alta** para a imagem social. Hoje ela usa a captura 01 a 470 px, dentro da regra das capturas.
- **Estacionamento, acessibilidade, CNPJ e CREF:** entram no JSON-LD e na ficha quando forem confirmados.
