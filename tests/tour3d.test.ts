import { existsSync, readFileSync } from 'node:fs';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { describe, expect, it } from 'vitest';
import { verificarAtual } from '../src/config/index.ts';
import { zonas } from '../src/content/dados/zonas.ts';

const INDICE = 'public/modelos/indice.json';

describe('tour 3D: regras', () => {
  it('as poses da esquemática NÃO entram na coleção (camera null, layout pendente)', () => {
    for (const z of zonas) {
      expect(z.fonteLayout).toBe('pendente');
      expect(z.camera).toBeNull();
    }
  });
  it('maquete esquemática: aviso no validate-config e não aparece em produção sem aprovação', () => {
    const r = verificarAtual('producao');
    const a = r.achados.find((x) => x.onde === 'tour3d.maqueteEsquematicaAprovada');
    expect(a?.gravidade).toBe('aviso');
    expect(r.ok).toBe(true);
  });
});

describe.skipIf(!existsSync(INDICE))('tour 3D: modelo gerado (model:prepare)', () => {
  const indice = JSON.parse(readFileSync(INDICE, 'utf8')) as {
    maquete: { esquematica: boolean; bytes: number; zonas: string[]; poses: string[] };
  };

  it('maquete ≤ 3 MB e marcada como esquemática enquanto não há planta', () => {
    expect(indice.maquete.bytes).toBeLessThanOrEqual(3 * 1024 * 1024);
    if (!existsSync('modelos-originais/maquete.glb')) expect(indice.maquete.esquematica).toBe(true);
  });

  it('o GLB tem, para cada zona da coleção, volume, moldura de LED e pose (via extras)', async () => {
    await MeshoptDecoder.ready;
    const doc = await new NodeIO()
      .registerExtensions(ALL_EXTENSIONS)
      .registerDependencies({ 'meshopt.decoder': MeshoptDecoder })
      .read('public/modelos/maquete.glb');
    const extras = doc
      .getRoot()
      .listNodes()
      .map((n) => n.getExtras() as { tipo?: string; zona?: string });
    const tem = (tipo: string, zona: string) =>
      extras.some((e) => e.tipo === tipo && e.zona === zona);
    for (const z of zonas) {
      expect(tem('zona', z.id) || tem('grupo', z.id), `volume de ${z.id}`).toBe(true);
      expect(tem('pose', z.id) && tem('alvo', z.id), `pose de ${z.id}`).toBe(true);
      const luz =
        tem('luz', z.id) ||
        extras.some((e) => e.tipo === 'luz' && (z.subzonas ?? []).some((s) => s.id === e.zona));
      expect(luz, `moldura de LED de ${z.id}`).toBe(true);
    }
    expect(doc.getRoot().getExtras()).toMatchObject({ esquematica: indice.maquete.esquematica });
  });
});
