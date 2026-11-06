// Valida a config e as coleções (travas da seção 9). Uso: node scripts/validate-config.mjs [--producao] [--json]
// Preview: lista pendências e passa (só erro de schema/referência falha). Produção: trava derruba (exit 1).
import { pathToFileURL } from 'node:url';
import { entradaAtual } from '../src/config/index.ts';
import { lerModo } from '../src/config/modo.ts';
import { verificar } from '../src/config/verificacao.ts';

const ROTULO = { erro: 'ERRO ', trava: 'TRAVA', aviso: 'aviso' };

export function relatorio(resultado) {
  const linhas = [];
  const ordem = { erro: 0, trava: 1, aviso: 2 };
  const achados = [...resultado.achados].sort((a, b) => ordem[a.gravidade] - ordem[b.gravidade]);
  for (const a of achados) {
    const sufixo =
      a.gravidade === 'trava' && resultado.modo === 'preview' ? ' (travaria a produção)' : '';
    linhas.push(`  ${ROTULO[a.gravidade]} ${a.onde}: ${a.mensagem}${sufixo}`);
  }
  const n = (g) => achados.filter((a) => a.gravidade === g).length;
  linhas.push(
    `[validate-config] modo ${resultado.modo} · ${n('erro')} erro(s), ${n('trava')} trava(s), ${n('aviso')} aviso(s) → ${resultado.ok ? 'OK' : 'BLOQUEADO'}`,
  );
  return linhas.join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const modo = process.argv.includes('--producao') ? 'producao' : lerModo(process.env.MODO);
  const resultado = verificar(entradaAtual(), modo);
  if (process.argv.includes('--json')) console.log(JSON.stringify(resultado, null, 2));
  else console.log(relatorio(resultado));
  process.exit(resultado.ok ? 0 : 1);
}
