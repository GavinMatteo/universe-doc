import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Exact `file: href` strings for anchors that are stale in theme-docs/ and
// that GitBook breaks too. See docs-internal/2026-11-03-self-hosted-docs-plan.md.
const ALLOWLIST = [];

const dist = new URL('../dist', import.meta.url).pathname;

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (name.endsWith('.html')) yield p;
  }
}

function resolves(path) {
  const clean = decodeURI(path.split('#')[0].split('?')[0]);
  if (clean === '/' || clean === '') return true;
  const target = join(dist, clean);
  if (clean.startsWith('/assets/') || clean.startsWith('/fonts/')) return existsSync(target) && statSync(target).isFile();
  return existsSync(join(target, 'index.html')) || (existsSync(target) && statSync(target).isFile());
}

const problems = [];
for (const file of htmlFiles(dist)) {
  const html = readFileSync(file, 'utf8');
  const rel = relative(dist, file);
  const ids = new Set([...html.matchAll(/\sid="([^"]*)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/<a\s[^>]*?href="([^"]*)"/g)) {
    const href = m[1].replaceAll('&amp;', '&');
    let ok = true;
    if (href.startsWith('#')) ok = href === '#' || ids.has(decodeURI(href.slice(1)));
    else if (href.startsWith('/') && !href.startsWith('//')) {
      if (href.startsWith('/pagefind/')) continue;
      ok = resolves(href);
    } else continue;
    const entry = `${rel}: ${href}`;
    if (!ok && !ALLOWLIST.includes(entry)) problems.push(entry);
  }
}

for (const p of problems) console.log(p);
console.log(`Problems: ${problems.length}`);
process.exit(problems.length > 0 ? 1 : 0);
