// Lists the sections rendered on a storefront page, with their liquid type and size.
import { openStore } from './lib/store.js';
const path = process.argv[2] || '/';
const { browser, page } = await openStore();
await page.goto(process.env.STORE_URL || 'https://universe-theme-woofy.myshopify.com' + path, { waitUntil: 'networkidle' });
console.log('URL:', page.url(), '| title:', await page.title());
const rows = await page.$$eval('.shopify-section', els => els.map(e => ({
  id: e.id, type: (e.id.match(/__([a-z0-9_-]+)$/) || [,'?'])[1], h: Math.round(e.getBoundingClientRect().height), w: Math.round(e.getBoundingClientRect().width)
})));
for (const r of rows) console.log(`${r.type.padEnd(32)} ${String(r.h).padStart(5)}px  ${r.id}`);
await browser.close();
