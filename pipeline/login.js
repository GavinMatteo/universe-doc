// One-off: opens a visible Chromium on the Shopify admin so you can log in yourself.
// When you are in (the theme editor loads), come back to the terminal and press Enter.
// The session is saved to .auth/shopify.json (gitignored) and reused by the recorder.
import { chromium } from 'playwright';
import readline from 'node:readline';
const STORE = 'universe-theme-woofy';
const browser = await chromium.launch({ headless: false, args: ['--window-size=1440,900'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(`https://admin.shopify.com/store/${STORE}/themes`);
console.log('\nLog in to the Shopify admin in the window that just opened.');
console.log('When you see the Themes page, press Enter here to save the session.\n');
await new Promise(r => readline.createInterface({ input: process.stdin }).once('line', r));
await ctx.storageState({ path: '.auth/shopify.json' });
console.log('Session saved to pipeline/.auth/shopify.json');
await browser.close();
