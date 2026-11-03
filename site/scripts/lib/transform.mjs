import path from 'node:path';

const LINK_RE = /(!?)\[([^\]]*)\]\(([^)\s]+)\)/g;
const EXTERNAL_RE = /^(https?:\/\/|mailto:|#)/;
const ASSETS_MARKER = '.gitbook/assets/';

function stripH1(lines) {
  const i = lines.findIndex((l) => /^# /.test(l));
  if (i === -1) return { lines, h1: null };
  const h1 = lines[i].slice(2).trim();
  const end = lines[i + 1] === '' ? i + 2 : i + 1;
  return { lines: [...lines.slice(0, i), ...lines.slice(end)], h1 };
}

function stripOnThisPage(lines) {
  const start = lines.findIndex((l) => l === '**On this page**');
  if (start === -1) return lines;
  const rule = lines.indexOf('---', start + 1);
  if (rule === -1) return lines;
  let end = rule + 1;
  while (end < lines.length && lines[end] === '') end++;
  return [...lines.slice(0, start), ...lines.slice(end)];
}

function rewriteTarget(target, page, routes) {
  if (EXTERNAL_RE.test(target)) return target;
  const hashAt = target.indexOf('#');
  const filePart = hashAt === -1 ? target : target.slice(0, hashAt);
  const fragment = hashAt === -1 ? '' : target.slice(hashAt);

  const assetAt = filePart.indexOf(ASSETS_MARKER);
  if (assetAt !== -1) {
    return `/assets/${filePart.slice(assetAt + ASSETS_MARKER.length)}${fragment}`;
  }
  if (!filePart.endsWith('.md')) return target;

  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(page.file), filePart));
  const route = routes.get(resolved);
  if (route === undefined) {
    throw new Error(`${page.file}: unresolved link "${target}" (looked up "${resolved}")`);
  }
  return `${route}${fragment}`;
}

export function transformPage({ page, source, routes }) {
  const { lines, h1 } = stripH1(source.split('\n'));
  const body = stripOnThisPage(lines)
    .join('\n')
    .replace(LINK_RE, (_m, bang, text, target) => `${bang}[${text}](${rewriteTarget(target, page, routes)})`);
  const title = page.file === 'README.md' && h1 ? h1 : page.label;
  return `---\ntitle: ${JSON.stringify(title)}\n---\n${body}`;
}
