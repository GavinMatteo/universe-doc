// Builds a contact sheet of every final storefront render, for a one-glance review.
// Usage: node contact-sheet.js
// Reads ../theme-docs/.gitbook/assets/sections/*.png, writes out/contact-sheet.html and
// out/contact-sheet.png: 4 thumbnails per row, 360 px wide, slug and size under each.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(here, '../theme-docs/.gitbook/assets/sections');
const outDir = path.join(here, 'out');
const htmlPath = path.join(outDir, 'contact-sheet.html');
const pngPath = path.join(outDir, 'contact-sheet.png');
const BUDGET_KB = 300;

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.png')).sort();
if (!files.length) { console.error(`No PNG in ${srcDir}`); process.exit(1); }
const cards = [];
for (const f of files) {
  const file = path.join(srcDir, f);
  const kb = Math.round(fs.statSync(file).size / 1024);
  const { width, height } = await sharp(file).metadata();
  const flag = kb > BUDGET_KB ? ' over' : '';
  cards.push(`<figure class="card${flag}">
    <img src="${pathToFileURL(file).href}" alt="">
    <figcaption><b>${path.basename(f, '.png')}</b><span>${width}x${height}, ${kb} KB</span></figcaption>
  </figure>`);
}

const html = `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="${pathToFileURL(path.join(here, 'brand/tokens.css')).href}">
<style>
  body { margin: 0; background: var(--surface-light, #f4f3fe); color: var(--ink, #110b2f); font-family: var(--font-copy, sans-serif); }
  #frame { padding: 32px; width: max-content; }
  h1 { font-size: 22px; margin: 0 0 24px; }
  h1 span { color: var(--ink-muted, #58546d); font-weight: 400; }
  .grid { display: grid; grid-template-columns: repeat(4, 360px); gap: 28px 24px; align-items: start; }
  .card { margin: 0; }
  .card img { display: block; width: 360px; border-radius: 6px; outline: 1px solid rgba(17, 11, 47, .12); background: #fff; }
  .card figcaption { display: flex; justify-content: space-between; gap: 8px; font-size: 13px; padding-top: 6px; }
  .card figcaption span { color: var(--ink-muted, #58546d); }
  .card.over figcaption span { color: #c62828; font-weight: 700; }
</style></head>
<body><div id="frame">
  <h1>Storefront renders <span>${files.length} images, ${new Date().toISOString().slice(0, 10)}</span></h1>
  <div class="grid">${cards.join('\n')}</div>
</div></body></html>`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(htmlPath, html);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
  await page.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
  await page.locator('#frame').screenshot({ path: pngPath });
} finally {
  await browser.close();
}
console.log(`${path.relative(here, pngPath)} and ${path.relative(here, htmlPath)}: ${files.length} renders`);
