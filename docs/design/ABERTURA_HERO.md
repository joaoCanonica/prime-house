# Abertura e hero · sessão 4

Capturas: `docs/design/abertura-390.jpg` e `abertura-1440.jpg` (0; 0,8; 1,4; 2,0; 3,0 s) e `hero-a-b-390.jpg` e `hero-a-b-1440.jpg` (A interior × B drone). Regerar: `node scripts/capturar-abertura.mjs` (usa o `dist/`). Qualquer instante: `/?abertura=MS` congela a timeline.

## Abertura "As luzes acendem" (3,0 s, uma vez por sessão)

| Tempo | O que acontece |
|---|---|
| 0–0,4 s | Breu; "05:00" em versalete no canto; botão "Pular abertura" desde o 1º quadro |
| 0,4–1,6 s | as 45 luminárias do `TetoDeLuz` acendem de perto para longe (≈ 24 ms entre elas); 3 cintilam (240 ms) |
| 1,6–2,3 s | a camada Breu fica transparente e revela o **pôster real do hero, já pintado** (1,04 → 1,0); "PRIME HOUSE ACADEMIA" aparece |
| 2,3–3,0 s | o logo vai para o cabeçalho (View Transition onde houver; senão FLIP com WAAPI); o vídeo começa (medido em 2,3 s); H1, apoio e botões entram |

- **Arquitetura:** a abertura é uma camada fixa **por cima** do hero. O pôster (LCP) está no HTML desde o início com `fetchpriority="high"` e pinta por baixo; a camada só fica transparente. Não há segunda imagem.
- **Decisão antes da primeira pintura:** script inline de 403 B. Roda só sem `sessionStorage['ph-abertura']` e sem reduced-motion (com try/catch). Sem JS: a camada nem aparece (verificado).
- **Pular:** clique ou toque, qualquer tecla (exceto Tab e modificadoras), roda do mouse, toque arrastado e rolagem. O 1º Tab foca "Pular abertura" e o Enter pula em ≈ 65 ms; o foco vai para o H1 (verificado). A rolagem nunca é bloqueada: ela pula e a página rola.
- **Reduced-motion:** estado final direto (a camada não é criada); o vídeo não toca sozinho e o botão mostra "Tocar vídeo".
- **Fim medido:** 3,0 s após o início do script (3.138 ms desde a navegação), sem erros.

## Hero

- **Desktop:** o vídeo vertical numa moldura de luz alta, com margem; texto à esquerda, embaixo; status e endereço à direita, embaixo. O 16:9 disponível tem só 720×404 e seria ampliado ≈ 1,9× em tela cheia, por isso o vertical em resolução nativa. Trocar quando chegarem originais horizontais.
- **Mobile:** o vídeo sangra; véu uniforme Breu a 52% (sem degradê) para o texto ler.
- **Vídeo:** entra só depois do LCP (load + idle) ou no instante 2,3 s da abertura; aparece quando já está tocando (sem quadro preto); pausa fora da tela; "Pausar vídeo" sempre visível.

## Lighthouse mobile (13.6, 4G simulado, Moto G Power), 3 rodadas cada

| | LCP | FCP | CLS | TBT | Perf. | A11y | BP | SEO |
|---|---|---|---|---|---|---|---|---|
| **com abertura** | 1,80 s | 0,90 s | 0 | 0–16 ms | 99 | 100 | 100 | 54* |
| **sem abertura** (reduced-motion) | 1,80–1,96 s | 0,90 s | 0 | 0–15 ms | 99–100 | 100 | 100 | 54* |

\* SEO 54 = `noindex` do preview + `meta description` ausente (sessão 8). O LCP é o pôster do hero nos dois casos; a abertura não piora.

**CLS:** a 1ª medição sem abertura deu **0,199** (troca de fonte no bloco do H1, alinhado embaixo). Corrigido com fallbacks de **métricas casadas** em `src/styles/fontes.css`: `size-adjust` medido no Chromium com o texto real, mais ascent/descent. Archivo 62 = 67,7% da Arial (73,4% da Roboto); Inter Tight = 95,6% / 92,2% (negrito); Source Serif itálica = 95,3% da Times. Com o preload das 3 fontes o LCP subia para 2,10 s, então o preload saiu: os fallbacks casados bastam.

## JS da home (produção)

Inline 403 B + abertura 3,6 KB + hero 1,2 KB + luz 1,0 KB + horário 3,5 KB ≈ **9,8 KB brutos / ≈ 4,6 KB gzip** (orçamento: 40 KB gzip).
