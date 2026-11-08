// Marcador de script ainda não implementado. Sai com erro para nunca dar falso "verde".
const [, , nome = '?', sessao = '?'] = process.argv;
console.error(`[pendente] "${nome}" ainda não foi implementado (previsto na sessão ${sessao}).`);
process.exit(1);
