// Status ao vivo e "hoje" na tabela de horário (no fuso de Lages). Atualiza a cada minuto.
import { hojeEm, statusEm } from '../lib/horario.ts';

function atualizar() {
  const agora = new Date();
  const status = statusEm(agora);
  for (const el of document.querySelectorAll<HTMLElement>('[data-status-horario]')) {
    el.dataset['estado'] = status.estado;
    const texto = el.querySelector('[data-status-texto]');
    if (texto && texto.textContent !== status.texto) texto.textContent = status.texto;
  }
  const { dia, feriado } = hojeEm(agora);
  const chave = feriado ? 'feriado' : String(dia);
  for (const linha of document.querySelectorAll<HTMLElement>('[data-dia]')) {
    linha.toggleAttribute('data-hoje', linha.dataset['dia'] === chave);
  }
}

atualizar();
// alinha ao início do próximo minuto e segue de minuto em minuto
setTimeout(
  () => {
    atualizar();
    setInterval(atualizar, 60_000);
  },
  60_000 - (Date.now() % 60_000),
);
