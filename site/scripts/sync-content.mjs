import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseSummary } from './lib/summary.mjs';
import { transformPage } from './lib/transform.mjs';

const THEME_DOCS = path.resolve('../theme-docs');
const OUT = path.resolve('src/content/docs');
const PUBLIC_ASSETS = path.resolve('public/assets');
const OVERLAY = path.resolve('content-overlay');

function countFiles(dir) {
  let n = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    n += entry.isDirectory() ? countFiles(path.join(dir, entry.name)) : 1;
  }
  return n;
}

function main() {
  const { groups, pages } = parseSummary(readFileSync(path.join(THEME_DOCS, 'SUMMARY.md'), 'utf8'));
  const routes = new Map(pages.map((p) => [p.file, p.route]));
  const slugByLabel = new Map(groups.map((g) => [g.label, g.slug]));

  rmSync(OUT, { recursive: true, force: true });
  rmSync(PUBLIC_ASSETS, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  for (const page of pages) {
    const source = readFileSync(path.join(THEME_DOCS, page.file), 'utf8');
    const content = transformPage({ page, source, routes });
    const target =
      page.route === '/'
        ? path.join(OUT, 'index.md')
        : path.join(OUT, slugByLabel.get(page.group), `${page.stem}.md`);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, content);
  }

  const assetsSrc = path.join(THEME_DOCS, '.gitbook/assets');
  let assets = 0;
  if (existsSync(assetsSrc)) {
    cpSync(assetsSrc, PUBLIC_ASSETS, { recursive: true });
    assets = countFiles(PUBLIC_ASSETS);
  }

  if (existsSync(OVERLAY)) cpSync(OVERLAY, OUT, { recursive: true });

  console.log(`Synced ${pages.length} pages, ${assets} assets`);
}

try {
  main();
} catch (err) {
  // Message only for our own Error; full stack for DEBUG or anything unexpected (e.g. TypeError).
  const ours = err instanceof Error && err.constructor === Error;
  console.error(process.env.DEBUG || !ours ? (err?.stack ?? err) : err.message);
  process.exit(1);
}
