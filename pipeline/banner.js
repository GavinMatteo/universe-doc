// Renders banner.html at exact YouTube channel-art size (2560x1440) and reports file size.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const out = process.argv[2] || 'out/youtube-banner.png';
const src = process.argv[3] || 'banner.html';
let html = fs.readFileSync(src, 'utf8');
html = html.replace('__UNIVERSE_SVG__', fs.readFileSync('brand/logo/universe-logo.svg', 'utf8'));
fs.writeFileSync('out/.banner-render.html', html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2560, height: 1440 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.resolve('out/.banner-render.html')).href.replace('/out/.banner-render.html', '/out/.banner-render.html'), { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out, type: 'png' });
await browser.close();
console.log(out, Math.round(fs.statSync(out).size / 1024), 'KB');
