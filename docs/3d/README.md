# A Casa em 3D: como entregar a planta e a captura

Hoje o tour usa uma **maquete esquemática** gerada pelo `pnpm model:prepare`, com o selo "Representação esquemática — em breve, o tour real". Ela **não tem medidas reais**: as posições e os tamanhos das zonas são ilustrativos. Em produção, ela só aparece com a aprovação do João (`src/config/tour3d.ts`). Sem aprovação, `/a-casa` mostra a lista de zonas, as fotos e os vídeos.

Relatório atual dos modelos: [`RELATORIO.md`](RELATORIO.md) (gerado, não editar).

## 1. As três camadas

| Camada | O que é | Arquivo publicado | Quando carrega |
|---|---|---|---|
| A · Maquete | argila clara sobre Breu, molduras de LED como linhas, zonas clicáveis | `public/modelos/maquete.glb` (≤ 3 MB) | ao aparecer na tela, com o navegador ocioso (nunca em Save-Data, 2g ou movimento reduzido sem clique) |
| B · Realismo | captura por zona (Gaussian Splatting) | `public/modelos/splats/<zona>.sog` (≤ 40 MB) | só no botão "Ver de verdade", com barra de progresso e "Cancelar" |
| C · Fallback | foto e vídeo da zona + lista em HTML | `public/media/…` | sempre presente (sem JS, sem WebGL, erro) |

## 2. O que a WAXLO ou o marketing entrega

### 2.1 Planta baixa (para a maquete)

- **Formato:** PDF ou DWG da obra, com cotas; e, se possível, uma foto de cima da obra pronta.
- **Conteúdo:** perímetro interno, pilares, portas, janelas, posição de cada máquina (com o modelo Cimerian) e o desenho das luminárias de LED do teto (retângulos e hexágonos).
- Quem modela (Blender ou equivalente) exporta **`modelos-originais/maquete.glb`** seguindo o contrato abaixo.

### 2.2 Contrato do GLB da maquete

| Regra | Valor |
|---|---|
| Unidade | **metro** (1 unidade = 1 m) |
| Eixos | **Y para cima**; frente da academia (entrada pela Av. Duque de Caxias) no **+Z** |
| Origem | centro do piso do salão principal, no nível do piso |
| Materiais | sem texturas pesadas: o site aplica "argila" (Névoa) aos volumes e "piso" a um nó chamado `piso` |
| Molduras de LED | **linhas** (glTF `LINES`), não tubos; uma por luminária, na altura real do teto |
| Polígonos | alvo ≤ 150 mil triângulos antes da otimização |

Cada objeto relevante leva **`extras`** (Custom Properties no Blender, com "Export → Custom Properties" ligado):

| Objeto | extras | Exemplo |
|---|---|---|
| Volume da zona (pode haver vários) | `{ "tipo": "zona", "zona": "<id>" }` | bancada da recepção |
| Grupo de uma zona com subzonas | `{ "tipo": "grupo", "zona": "musculacao" }` | contém os volumes de `costas-puxadas`, `pernas`… |
| Moldura de LED da zona | `{ "tipo": "luz", "zona": "<id>" }` | as luminárias acima do cardio |
| Pose de câmera (Empty) | `{ "tipo": "pose", "zona": "<id>" }` | onde a câmera fica |
| Alvo da câmera (Empty) | `{ "tipo": "alvo", "zona": "<id>" }` | para onde a câmera olha |
| Visão geral | `pose`/`alvo` com `"zona": "geral"` | |

Ids das zonas (iguais aos de `src/content/dados/zonas.ts`): `recepcao`, `musculacao` (subzonas `costas-puxadas`, `pernas`, `peito-ombro`, `peso-livre`), `cardio`, `vestiarios`, `avaliacao-fisio`, `conveniencia`, `espaco-kids`.

> Os nomes dos objetos não bastam: o carregador do three.js remove os caracteres `: . / [ ]` dos nomes. Por isso a identificação usa `extras`.

### 2.3 Captura real (para "Ver de verdade")

- **Como gravar:** sala vazia, luz de funcionamento acesa, iPhone (de preferência Pro, com LiDAR) em Polycam, Luma ou Scaniverse, ou drone por dentro. Caminhe devagar em 3 alturas (joelho, peito, acima da cabeça). **Uma captura por zona.** Ninguém aparece.
- **Exportar:** `.ply` (Gaussian Splatting). Também servem `.spz`, `.splat` e `.ksplat`.
- **Nome do arquivo = id da zona:** `modelos-originais/splats/cardio.ply`, `…/vestiarios.ply` etc.
- **Escala e eixo:** iguais aos da maquete (metro, Y para cima), alinhados à origem da maquete se possível.

## 3. Como rodar (Prompt 3D)

```bash
pnpm model:prepare
```

Esse comando também roda sozinho no `predev` e no `prebuild`, e:

1. **Maquete:** se existir `modelos-originais/maquete.glb`, otimiza-a em `public/modelos/maquete.glb` com `dedup`, `prune`, `weld`, `simplify` controlado (Meshopt, 75%, erro 0,0008) e compressão **Meshopt** (`EXT_meshopt_compression`). Texturas: **KTX2** se o `toktx` (KTX-Software) estiver instalado; senão, **WebP** 2048 px. Sem planta, gera a esquemática.
2. **Splats:** converte cada `modelos-originais/splats/<zona>.*` para **SOG** com o `@playcanvas/splat-transform`.
3. Escreve `public/modelos/indice.json` (o que a página lê) e `docs/3d/RELATORIO.md` (peso, polígonos, zonas e poses encontradas).

Depois:

- Com a planta: em `src/content/dados/zonas.ts`, troque `fonteLayout` para `"planta"` (ou `"captura"`) e, se quiser, copie as poses para `camera`. **Só então** a trava "zona sem fonte" deixa de valer.
- Rode `pnpm validate-config`, `pnpm build` e as capturas.
- Para publicar sem a esquemática, nada mais é preciso: com a planta, o selo some sozinho.

## 4. Escolhas técnicas (e fontes)

- **three.js r187** (`three@0.187.0`): `WebGLRenderer.setAnimationLoop(null)` para pausar fora da tela ou com a aba oculta; `dispose()` de geometrias, materiais e renderer, mais `forceContextLoss()` ao sair (código-fonte do r187 e manual do three.js, "cleanup"). Loaders: `GLTFLoader` + `MeshoptDecoder` sempre; `DRACOLoader` e `KTX2Loader` (`detectSupport(renderer)`) só por import dinâmico, se o GLB exigir.
- **Performance em celular:** render só quando algo muda (voo, arrasto, cintilação); pixel ratio limitado (1,75 no celular, 2 no desktop); sem sombras nem pós-processamento; poucas chamadas de desenho (cerca de 22 na esquemática; manual do three.js, "optimize lots of objects": juntar geometrias); neblina para encerrar a cena; `touch-action: pan-y` no canvas (a rolagem vertical continua da página).
- **Splats: Spark** (`@sparkjsdev/spark` 2.4.0, MIT, World Labs, versão publicada em 20/10/2026), integrado ao pipeline do three.js, com alvo de mais de 98% de suporte WebGL2, lendo PLY/SPZ/SPLAT/KSPLAT/SOG. O `@mkkellogg/gaussian-splats-3d` (0.4.7, MIT) declara na README que **não está mais em desenvolvimento ativo** e recomenda o Spark.
- **Formato dos splats: SOG** (PlayCanvas, "super-compressed, recommended" pelo `splat-transform` 3.10.3, MIT), lido pelo Spark.
- **Peso medido:** ilha 3D (`tour` + `three.core`) ≈ 164 KB gzip (limite: 180 KB). O Spark (≈ 2,7 MB brutos) e o Draco só carregam em "Ver de verdade" ou se o GLB pedir.
