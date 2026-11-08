// Texto do /llms.txt (formato llmstxt.org): H1, resumo em citação, detalhes em lista e listas de links por H2.
// Gerado da config e dos textos: só dado confirmado, sem preço, com o NAP idêntico ao do site.
import { nap, absoluta } from './ld.ts';
import { paginas } from './paginas.ts';
import { contato } from '../../config/contato.ts';
import { marca } from '../../config/marca.ts';
import { diferenciais } from '../../content/dados/diferenciais.ts';
import { equipamentos } from '../../content/dados/equipamentos.ts';
import { planos } from '../../content/dados/planos.ts';
import { home, horarios, whatsapp } from '../../content/textos/index.ts';
import { linkWhatsApp } from '../../lib/whatsapp.ts';

const dataBr = (iso: string) => iso.split('-').reverse().join('/');

export function gerarLlms(base: string | null): string {
  const url = (r: string) => absoluta(base, r);
  const equip = equipamentos
    .filter((e) => e.confirmado)
    .map((e) => `${e.nome}${e.quantidade ? ` (${e.quantidade} unidades)` : ''}`);
  const difs = [...diferenciais]
    .filter((d) => d.confirmado)
    .sort((a, b) => a.ordem - b.ordem)
    .map((d) => d.nome);
  const pls = [...planos]
    .sort((a, b) => a.ordem - b.ordem)
    .map((p) =>
      p.inclui.estado === 'confirmado'
        ? `${p.nome} (${p.inclui.texto.replace(/\.$/, '')})`
        : p.nome,
    );
  const beneficios = planos
    .flatMap((p) => p.beneficios)
    .filter((b) => b.estado === 'confirmado')
    .map((b) => b.texto.replace(/\.$/, ''));
  const link = (p: (typeof paginas)[number]) => `- [${p.nome}](${url(p.rota)}): ${p.resposta}`;

  return `# ${nap.nome}

> ${home.resposta}

- O que é: academia de musculação independente, de trânsito livre, em Lages/SC. Inaugurada em ${dataBr(marca.inauguracao.valor)}. Fundador e responsável técnico: ${marca.fundador.valor}. CNPJ ${marca.cnpj.valor}.
- Endereço: ${nap.endereco}. Plus code ${contato.plusCode.valor}. Coordenadas ${contato.geo.valor.lat}, ${contato.geo.valor.lng}.
- Horário: ${horarios.tabela.linhas.map((l) => `${l.dias.toLowerCase()}, ${l.horario}`).join('; ')}. (feriados nacionais; nos municipais, confirme com a equipe).
- Maquinário: 100% ${marca.maquinario.valor} (marca nacional). Confirmados: ${equip.join('; ')}.
- Planos (os valores não são divulgados no site; as condições são passadas pela equipe): ${pls.join('; ')}.
- Benefícios: ${beneficios.join('; ')}.
- Diferenciais: ${difs.join('; ')}.
- Treino: avaliação funcional com o professor, treino individual no app, treino orientado e adaptado, com acompanhamento de fisioterapeuta.
- Como falar: WhatsApp ${nap.telefone} (${linkWhatsApp(whatsapp.geral)}); Instagram @${contato.instagram.valor.usuario} (${contato.instagram.valor.url}); Google Maps: ${contato.mapas.valor.google}.

## Páginas

${paginas
  .filter((p) => !p.secundaria)
  .map(link)
  .join('\n')}

## Optional

${paginas
  .filter((p) => p.secundaria)
  .map(link)
  .join('\n')}
`;
}
