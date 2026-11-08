// Confere um deploy no ar: cabeçalhos de segurança, CSP, cache, compressão (brotli/gzip) do HTML, JS e GLB,
// e o robots (noindex no preview; index só quando indexar=true em produção).
// Uso: node scripts/conferir-deploy.mjs https://<url-do-deploy> [--producao]
const base = process.argv[2]?.replace(/\/+$/, '');
if (!base) {
  console.error('uso: node scripts/conferir-deploy.mjs https://<url-do-deploy> [--producao]');
  process.exit(2);
}
const producao = process.argv.includes('--producao');
let falhas = 0;
const ok = (cond, msg) => {
  if (!cond) falhas++;
  console.log(`${cond ? '✓' : '✗'} ${msg}`);
};
const pegar = (caminho) =>
  fetch(base + caminho, { headers: { 'Accept-Encoding': 'br, gzip' }, redirect: 'manual' });

const home = await pegar('/');
const h = (k) => home.headers.get(k) ?? '';
ok(home.status === 200, `GET / → ${home.status}`);
ok(/max-age=\d+/.test(h('strict-transport-security')), `HSTS: ${h('strict-transport-security')}`);
ok(
  h('referrer-policy') === 'strict-origin-when-cross-origin',
  `Referrer-Policy: ${h('referrer-policy')}`,
);
ok(
  /camera=\(\)/.test(h('permissions-policy')),
  `Permissions-Policy: ${h('permissions-policy').slice(0, 60)}…`,
);
ok(
  /frame-ancestors 'none'/.test(h('content-security-policy')),
  `CSP (cabeçalho): ${h('content-security-policy')}`,
);
ok(/br|gzip/.test(h('content-encoding')), `HTML comprimido: ${h('content-encoding') || 'não'}`);
const html = await home.text();
ok(/http-equiv="content-security-policy"[^>]*sha256-/.test(html), 'CSP por hash no <meta>');
const robots = /<meta name="robots" content="([^"]+)"/.exec(html)?.[1] ?? '';
ok(
  producao ? true : /noindex/.test(robots),
  `robots: ${robots}${producao ? '' : ' (preview: precisa de noindex)'}`,
);

const js = /src="(\/_astro\/[^"]+\.js)"/.exec(html)?.[1];
if (js) {
  const r = await pegar(js);
  ok(
    /immutable/.test(r.headers.get('cache-control') ?? ''),
    `${js}: ${r.headers.get('cache-control')}`,
  );
  ok(
    /br|gzip/.test(r.headers.get('content-encoding') ?? ''),
    `JS comprimido: ${r.headers.get('content-encoding') || 'não'}`,
  );
}
const midia = /(\/media\/[^"' ,]+\.(?:avif|webp|mp4))/.exec(html)?.[1];
if (midia) {
  const r = await pegar(midia);
  ok(
    /immutable/.test(r.headers.get('cache-control') ?? ''),
    `${midia}: ${r.headers.get('cache-control')}`,
  );
}
const indice = await (await pegar('/modelos/indice.json')).json().catch(() => null);
const glb = indice?.maquete?.arquivo;
if (glb) {
  const r = await pegar(glb);
  ok(
    r.headers.get('content-type') === 'model/gltf-binary',
    `GLB Content-Type: ${r.headers.get('content-type')}`,
  );
  ok(
    /immutable/.test(r.headers.get('cache-control') ?? ''),
    `GLB cache: ${r.headers.get('cache-control')}`,
  );
  console.log(
    `  GLB Content-Encoding: ${r.headers.get('content-encoding') || 'nenhum (ver docs/DEPLOY.md §4)'}`,
  );
}
for (const s of Object.values(indice?.splats ?? {})) {
  const r = await pegar(s.arquivo ?? s);
  console.log(
    `  splat ${s.arquivo ?? s}: ${r.headers.get('content-encoding') || 'sem compressão'} · ${r.headers.get('cache-control')}`,
  );
}
console.log(falhas ? `[conferir-deploy] ${falhas} falha(s)` : '[conferir-deploy] tudo certo');
process.exit(falhas ? 1 : 0);
