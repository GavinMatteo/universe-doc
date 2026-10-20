// One-off: opens a visible Chrome on the Shopify admin so you can log in yourself.
// When you are in (the Themes page loads), come back to the terminal and press Enter.
// Uses the installed Google Chrome with a dedicated profile in .auth/chrome-profile and
// without the automation flag: Shopify's login page reloads the form when it detects a
// controlled browser. The session is saved to .auth/shopify.json (gitignored) and reused
// by the editor capture scripts.
import { chromium } from 'playwright';
import readline from 'node:readline';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHROME } from './lib/chrome.js';
const here = path.dirname(fileURLToPath(import.meta.url));
const STORE = 'universe-theme-woofy';
const ctx = await chromium.launchPersistentContext(path.join(here, '.auth', 'chrome-profile'), {
  executablePath: CHROME,
  headless: false,
  viewport: { width: 1440, height: 900 },
  ignoreDefaultArgs: ['--enable-automation'],
  args: ['--disable-blink-features=AutomationControlled', '--window-size=1440,900'],
});
const page = ctx.pages()[0] || await ctx.newPage();
await page.goto(`https://admin.shopify.com/store/${STORE}/themes`);
console.log('\nLog in to the Shopify admin in the window that just opened.');
console.log('When you see the Themes page, press Enter here to save the session.\n');
await new Promise(r => readline.createInterface({ input: process.stdin }).once('line', r));
await ctx.storageState({ path: path.join(here, '.auth', 'shopify.json') });
console.log('Session saved to pipeline/.auth/shopify.json');
await ctx.close();
