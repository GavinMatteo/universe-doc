// Offline check of the editor save guard (lib/editor.js guardVerdict), no browser needed.
// Usage: node guard-cases.js   (exit code 1 if any case is decided the wrong way)
import { guardVerdict } from './lib/editor.js';

const P = 'https://admin.shopify.com/api/app_proxy/universe-theme-woofy?operation=';
const q = (operationName, query) => JSON.stringify({ operationName, query });
const cases = [
  // [expect abort?, name, method, url, body]
  [true, 'editor save', 'POST', P + 'TemplateUpdate&version=unstable', q('TemplateUpdate', 'mutation TemplateUpdate { x }')],
  [true, 'newline before mutation', 'POST', P + 'X', JSON.stringify({ query: '\nmutation TemplateUpdate { x }' })],
  [true, 'fragment first', 'POST', P + 'X', JSON.stringify({ query: 'fragment F on T { a }\nmutation M { ...F }' })],
  [true, 'comment first', 'POST', P + 'X', JSON.stringify({ query: '# note\nmutation M { a }' })],
  [true, 'persisted, unknown name', 'POST', P + 'Foo', JSON.stringify({ operationName: 'Foo', extensions: { persistedQuery: { sha256Hash: 'ab' } } })],
  [true, 'batch, safe first', 'POST', P + 'CreateThemeSessionId', JSON.stringify([JSON.parse(q('CreateThemeSessionId', 'mutation CreateThemeSessionId { a }')), JSON.parse(q('TemplateUpdate', 'mutation TemplateUpdate { a }'))])],
  [true, 'safe URL, other mutation in body', 'POST', P + 'CreateThemeSessionId', JSON.stringify({ query: 'mutation TemplateUpdate { a }' })],
  [true, 'safe name, second mutation in document', 'POST', P + 'CreateThemeSessionId', q('CreateThemeSessionId', 'mutation CreateThemeSessionId { a } mutation TemplateUpdate { b }')],
  [true, 'anonymous mutation', 'POST', P + 'CreateThemeSessionId', q('CreateThemeSessionId', 'mutation { a }')],
  [true, 'unparseable body', 'POST', P + 'X', 'mutation TemplateUpdate { a }'],
  [true, 'store admin API write', 'PUT', 'https://universe-theme-woofy.myshopify.com/admin/api/2026-01/themes/1/assets.json', '{}'],
  [true, 'write on the editor app host', 'POST', 'https://online-store-web.shopifyapps.com/themes/1/editor/save', '{}'],
  [true, 'DELETE on admin', 'DELETE', 'https://admin.shopify.com/store/x/themes/1', ''],
  [false, 'safe mutation the editor needs', 'POST', P + 'CreateThemeSessionId&version=unstable', q('CreateThemeSessionId', 'mutation CreateThemeSessionId($a: ID!) { a }')],
  [false, 'plain query', 'POST', P + 'ThemeById&version=unstable', q('ThemeById', 'query ThemeById { a }')],
  [false, 'telemetry', 'POST', 'https://admin.shopify.com/.well-known/dux', 'xx'],
  [false, 'GET', 'GET', P + 'TemplateUpdate', ''],
  [false, 'storefront preview render', 'POST', 'https://universe-theme-woofy.myshopify.com/?oseid=1', 'a=b'],
];
let bad = 0;
for (const [expectAbort, name, method, url, body] of cases) {
  const why = guardVerdict(method, url, body);
  const ok = Boolean(why) === expectAbort;
  if (!ok) bad++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${expectAbort ? 'abort' : 'pass '} ${name}${why ? `  (${why})` : ''}`);
}
console.log(bad ? `${bad} case(s) wrong` : `All ${cases.length} cases right`);
process.exitCode = bad ? 1 : 0;
