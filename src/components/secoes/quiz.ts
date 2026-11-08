// Quiz "5 sinais": monta a mensagem do WhatsApp com o que foi marcado (linkWhatsApp + mensagemQuiz).
// Nada é salvo nem enviado sem o clique. Sem JS, o link já vem pronto com a mensagem da avaliação.
import { linkWhatsApp, mensagemQuiz } from '../../lib/whatsapp.ts';

for (const quiz of document.querySelectorAll<HTMLFormElement>('[data-quiz]')) {
  const link = quiz.querySelector<HTMLAnchorElement>('[data-quiz-link]');
  const nenhum = quiz.querySelector<HTMLElement>('[data-quiz-nenhum]');
  const algum = quiz.querySelector<HTMLElement>('[data-quiz-algum]');
  const atualizar = () => {
    const marcados = [...quiz.querySelectorAll<HTMLInputElement>('[data-quiz-sinal]:checked')].map(
      (i) => i.value,
    );
    nenhum?.toggleAttribute('hidden', marcados.length > 0);
    algum?.toggleAttribute('hidden', marcados.length === 0);
    if (link) link.href = linkWhatsApp(mensagemQuiz(marcados));
  };
  quiz.addEventListener('change', atualizar);
  quiz.addEventListener('submit', (e) => e.preventDefault());
}
