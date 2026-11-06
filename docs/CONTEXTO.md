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
