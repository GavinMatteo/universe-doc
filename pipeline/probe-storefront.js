// Lists section ids on storefront pages, for building manifest.json.
// Usage: STORE_PASSWORD=... node probe-storefront.js [--no-gate] /path [/path ...]
import { chromium } from 'playwright';
import { openStore, STORE } from './lib/store.js';
const args = process.argv.slice(2);
const noGate = args.includes('--no-gate');
const paths = args.filter(a => a !== '--no-gate');
let browser, page;
if (noGate) { browser = await chromium.launch(); page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage(); }
else ({ browser, page } = await openStore({ deviceScaleFactor: 1 }));
for (const p of paths.length ? paths : ['/']) {
  const resp = await page.goto(STORE + p, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  console.log(`\n== ${p} -> ${page.url()} (${resp && resp.status()}) title="${await page.title()}"`);
  const rows = await page.$$eval('.shopify-section', els => els.map(e => {
    const r = e.getBoundingClientRect();
    return `${String(Math.round(r.height)).padStart(5)}px ${getComputedStyle(e).display === 'none' ? 'HIDDEN ' : ''}${e.id}`;
  }));
  console.log(rows.join('\n'));
}
await browser.close();
