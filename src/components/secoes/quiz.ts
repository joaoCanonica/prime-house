export {};
// Quiz dos sinais: monta a mensagem do WhatsApp com o que foi marcado. Nada é salvo nem enviado sem o clique.
for (const quiz of document.querySelectorAll<HTMLFormElement>('[data-quiz]')) {
  const link = quiz.querySelector<HTMLAnchorElement>('[data-quiz-link]');
  const nenhum = quiz.querySelector<HTMLElement>('[data-quiz-nenhum]');
  const algum = quiz.querySelector<HTMLElement>('[data-quiz-algum]');
  const base = link?.dataset['base'] ?? '';
  const numero = link ? new URL(link.href).pathname.slice(1) : '';
  const atualizar = () => {
    const marcados = [...quiz.querySelectorAll<HTMLInputElement>('[data-quiz-sinal]:checked')].map(
      (i) => i.value.replace(/\.$/, ''),
    );
    nenhum?.toggleAttribute('hidden', marcados.length > 0);
    algum?.toggleAttribute('hidden', marcados.length === 0);
    if (link) {
      const texto = marcados.length ? `${base} Me identifiquei com: ${marcados.join('; ')}.` : base;
      link.href = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
    }
  };
  quiz.addEventListener('change', atualizar);
}
