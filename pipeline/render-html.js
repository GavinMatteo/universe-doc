// Renders a local HTML file to an optimized PNG with Playwright.
// Usage: node render-html.js <html> <out.png> [--width 1600] [--height auto]
//
// The page is copied to out/.render-<name>.html before loading, so asset URLs in the
// source resolve from a folder one level below pipeline/: write them as "../brand/...".
// Placeholders: __UNIVERSE_SVG__ inlines brand/logo/universe-logo.svg (as banner.js does),
// __LOGO_SVG__ inlines brand/logo/developpy-logo-white.svg.
// Screenshots the #frame element at deviceScaleFactor 2 (full page when there is no
// #frame), then optimize() resizes it to the requested width.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { optimize } from './lib/optimize.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const positional = [];
const opts = { width: '1600', height: 'auto' };
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--width' || args[i] === '--height') opts[args[i].slice(2)] = args[++i];
  else positional.push(args[i]);
}
const [src, out] = positional;
if (!src || !out) {
  console.error('Usage: node render-html.js <html> <out.png> [--width 1600] [--height auto]');
  process.exit(1);
}
const width = Number(opts.width);
const autoHeight = opts.height === 'auto';
const height = autoHeight ? 1000 : Number(opts.height);

let html = fs.readFileSync(src, 'utf8');
html = html
  .replaceAll('__UNIVERSE_SVG__', fs.readFileSync(path.join(here, 'brand/logo/universe-logo.svg'), 'utf8'))
  .replaceAll('__LOGO_SVG__', fs.readFileSync(path.join(here, 'brand/logo/developpy-logo-white.svg'), 'utf8'));
const outDir = path.join(here, 'out');
fs.mkdirSync(outDir, { recursive: true });
const name = path.basename(src, path.extname(src));
const tmpHtml = path.join(outDir, `.render-${name}.html`);
const rawPng = path.join(outDir, `.render-${name}.raw.png`);
fs.writeFileSync(tmpHtml, html);

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  await page.goto(pathToFileURL(tmpHtml).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const frame = await page.$('#frame');
  if (frame) await frame.screenshot({ path: rawPng, type: 'png' });
  else await page.screenshot({ path: rawPng, type: 'png', fullPage: autoHeight });
} finally {
  await browser.close();
}

const info = await optimize(rawPng, out, { width });
fs.rmSync(tmpHtml, { force: true });
fs.rmSync(rawPng, { force: true });
console.log(out, `${info.width}x${info.height}`, info.bytes, 'bytes', `(${Math.round(info.bytes / 1024)} KB)`);
