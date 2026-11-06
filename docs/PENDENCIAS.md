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
- **[aviso] Scripts ainda não implementados** (saem com erro de propósito, para nunca darem falso "verde"): `validate-config` e `audit-compliance` (sessão 2), `audit-contraste` (3), `audit-pesos` e `model:prepare` (6B), `audit-seo` (8), `audit-a11y` e `audit-lighthouse` (9). (`media:prepare` implementado na sessão 1.)

## Da sessão 1 (mídia)

Detalhes em `docs/MIDIA_CATALOGO.md`.

- **[trava] Consentimento pendente** (derivados ficam em `media-privada/`, fora do site): `equipe`, `lucas-discurso` (inserções de convidados), `acompanhamento`, `filme-inauguracao`, `plano-select` (professora) e as fotos dos carrosséis 22–34. Publicar só depois de `consentimento: "autorizado"` no manifesto.
- **[aviso] `plano-prime` com `naoUsar`:** fala e legenda queimada com "matrícula é gratuita", "de graça" e "o primeiro mês é por nossa conta" (vetados). Só sai do `naoUsar` com uma versão nova do vídeo.
- **[aviso] `avaliacao-funcional`:** a fala compara com "outras academias". Decisão de uso do João (sessão 9).
- **[aviso] Sem 16:9 real.** Vídeos verticais 720×1280; o recorte 16:9 tem 720×404 e não serve para hero de tela cheia no desktop. Pedir os originais (de preferência horizontais 4K).
- **[aviso] Áudio:** `audioLiberado=false` em tudo (trilha sem direito confirmado).
- **[aviso] Marcas de terceiros** visíveis nos recortes de "Conforto" (Monster, Philips Walita, logos de streaming, embalagens Disney no espaço kids). Conferir na sessão 9.
- **[aviso] ffmpeg é obrigatório no build** (`prebuild` roda `media:prepare`). Confirmar na sessão 9 se o ambiente de deploy tem ffmpeg ou se o build sobe com `public/media/` já gerado.

## Do cliente (herdado do pacote de prompts, seção C)

- [trava] Confirmação por escrito dos benefícios fixos: garantia de 14 dias, trancamento de 30 dias no anual, Sexta Prime.
- [trava] Autorizações de imagem de alunos, professores e fisioterapeuta.
- [aviso] Laranja oficial da marca (provisório #EC8A2A) e manual de marca.
- [aviso] CREF do responsável técnico, CNPJ, m², nº de máquinas.
- [aviso] Planta baixa com medidas, lista do maquinário e captura 3D por zona.
- [aviso] Fotos em alta do interior e arquivos originais dos vídeos.
