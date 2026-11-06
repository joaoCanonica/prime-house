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
- **[aviso] Mídia em `assets/` e `videos/`.** Preservada no lugar. A passagem para `media-originais/` (git mv) fica para a sessão 1 (Mídia).
- **[aviso] Domínio definitivo.** `site` no `astro.config.mjs` não foi definido (necessário para sitemap e URLs canônicas na sessão 8).
- **[aviso] Scripts ainda não implementados** (saem com erro de propósito, para nunca darem falso "verde"): `validate-config` e `audit-compliance` (sessão 2), `audit-contraste` (3), `audit-pesos` e `model:prepare` (6B), `audit-seo` (8), `audit-a11y` e `audit-lighthouse` (9), `media:prepare` (1).

## Do cliente (herdado do pacote de prompts, seção C)

- [trava] Confirmação por escrito dos benefícios fixos: garantia de 14 dias, trancamento de 30 dias no anual, Sexta Prime.
- [trava] Autorizações de imagem de alunos, professores e fisioterapeuta.
- [aviso] Laranja oficial da marca (provisório #EC8A2A) e manual de marca.
- [aviso] CREF do responsável técnico, CNPJ, m², nº de máquinas.
- [aviso] Planta baixa com medidas, lista do maquinário e captura 3D por zona.
- [aviso] Fotos em alta do interior e arquivos originais dos vídeos.
