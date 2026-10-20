// Records the storefront scenes of the Drawer Cart video as webm clips, with a drawn cursor.
// Usage: STORE_PASSWORD=... node record-storefront.js [outDir]
import { openStore, quiet, STORE } from './lib/store.js';
import fs from 'node:fs'; import path from 'node:path';
const outDir = process.argv[2] || 'video/drawer-cart/raw';
fs.mkdirSync(outDir, { recursive: true });
const VP = { width: 1920, height: 1080 };

let scene = async function (name, run) {
  // The gate is passed on a throwaway page; Playwright writes one video per page, so the
  // scene page starts recording already past the gate.
  const { browser, ctx, page: gate } = await openStore({ viewport: VP, deviceScaleFactor: 1, video: outDir });
  const gateVideo = gate.video(); await gate.close();
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    // Fake cursor so the recording shows where the click happens.
    addEventListener('DOMContentLoaded', () => {
      const c = document.createElement('div'); c.id = '__cursor';
      c.style.cssText = 'position:fixed;z-index:2147483647;width:22px;height:22px;pointer-events:none;top:0;left:0;transform:translate(-3px,-2px);transition:transform .05s linear';
      c.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 3l14 9-6 1 4 7-3 2-4-7-5 4z" fill="#111" stroke="#fff" stroke-width="1.5"/></svg>';
      document.body.appendChild(c);
      addEventListener('mousemove', e => { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; });
      addEventListener('mousedown', () => c.style.transform = 'translate(-3px,-2px) scale(.85)');
      addEventListener('mouseup', () => c.style.transform = 'translate(-3px,-2px) scale(1)');
    });
  });
  page.on('load', () => quiet(page).catch(() => {}));
  const t0 = Date.now();
  try { await run(page); } finally {
    const video = page.video();
    await ctx.close(); await browser.close();
    try { fs.unlinkSync(await gateVideo.path()); } catch {}
    const tmp = await video.path();
    const file = path.join(outDir, `${name}.webm`);
    fs.renameSync(tmp, file);
    console.log(`${name}: ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${file} (${Math.round(fs.statSync(file).size / 1024)} KB)`);
  }
}
const glide = async (page, loc, { steps = 28, hold = 400 } = {}) => {
  const b = await loc.boundingBox().catch(() => null); if (!b) { console.log('  (skip: element not visible)'); return false; }
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps }); await page.waitForTimeout(hold); return true;
};
const click = async (page, loc, opts) => { if (!(await glide(page, loc, opts))) return false; await page.mouse.down(); await page.waitForTimeout(90); await page.mouse.up(); return true; };
const ONLY = process.argv.slice(3);
const _scene = scene;
scene = async (name, run) => { if (ONLY.length && !ONLY.some(o => name.startsWith(o))) return; return _scene(name, run); };
const PRODUCT = '/products/steak-treats-1';

// S1: product page, add to cart, drawer opens, look around.
await scene('s1-add-to-cart', async page => {
  await page.goto(STORE + PRODUCT, { waitUntil: 'load' }); await page.waitForTimeout(1800);
  await page.mouse.move(960, 700);
  const atc = page.locator('main form[action*="/cart/add"] button[name="add"], .product-form button[name="add"]').first();
  await click(page, atc, { steps: 40, hold: 600 });
  await page.waitForTimeout(2600);
  const drawer = page.locator('.js-cart-drawer');
  const note = drawer.locator('text=/note/i').first();
  if (await note.count()) await glide(page, note, { steps: 30, hold: 900 });
  const checkout = drawer.locator('button, a').filter({ hasText: /checkout/i }).first();
  if (await checkout.count()) await glide(page, checkout, { steps: 30, hold: 1200 });
  await page.waitForTimeout(3500);
});

// S2: cross-sell add from the drawer, free shipping bar grows.
await scene('s2-cross-sell', async page => {
  await page.goto(STORE + PRODUCT, { waitUntil: 'load' }); await page.waitForTimeout(1200);
  const atc = page.locator('main form[action*="/cart/add"] button[name="add"], .product-form button[name="add"]').first();
  await atc.click(); await page.waitForTimeout(2600);
  const drawer = page.locator('.js-cart-drawer');
  const bar = drawer.locator('[class*="shipping"], [class*="free-ship"]').first();
  if (await bar.count()) await glide(page, bar, { steps: 30, hold: 2000 });
  const add = drawer.locator('.quick-add-product-card__button').first();
  await click(page, add, { steps: 34, hold: 1100 });
  await page.waitForTimeout(2600);
  if (await bar.count()) await glide(page, bar, { steps: 24, hold: 2200 });
  const add2 = drawer.locator('.quick-add-product-card__button').nth(1);
  if (await add2.count()) { await click(page, add2, { steps: 30, hold: 1000 }); await page.waitForTimeout(2600); }
  if (await bar.count()) await glide(page, bar, { steps: 24, hold: 2600 });
});

// S3: note and discount code fields.
await scene('s3-note-discount', async page => {
  await page.goto(STORE + PRODUCT, { waitUntil: 'load' }); await page.waitForTimeout(1200);
  const atc = page.locator('main form[action*="/cart/add"] button[name="add"], .product-form button[name="add"]').first();
  await atc.click(); await page.waitForTimeout(2200);
  const drawer = page.locator('.js-cart-drawer');
  const noteToggle = drawer.locator('summary, button, label').filter({ hasText: /note/i }).first();
  if (await noteToggle.count()) { await click(page, noteToggle, { steps: 30, hold: 600 }); await page.waitForTimeout(800); }
  const noteField = drawer.locator('textarea').first();
  if (await noteField.count() && await noteField.isVisible()) { await glide(page, noteField, { steps: 16, hold: 300 }); await noteField.click(); await noteField.pressSequentially('Please leave the parcel at the door', { delay: 45 }); await page.waitForTimeout(900); }
  const discToggle = drawer.locator('summary, button, label').filter({ hasText: /discount/i }).first();
  if (await discToggle.count()) { await click(page, discToggle, { steps: 30, hold: 600 }); await page.waitForTimeout(800); }
  const disc = drawer.locator('input[name*="discount" i], input[placeholder*="discount" i], input[class*="discount"]').first();
  if (await disc.count() && await disc.isVisible()) { await glide(page, disc, { steps: 16, hold: 300 }); await disc.click(); await disc.pressSequentially('WELCOME10', { delay: 70 }); await page.waitForTimeout(1200); }
  const checkout = drawer.locator('button, a').filter({ hasText: /checkout/i }).first();
  if (await checkout.count()) await glide(page, checkout, { steps: 30, hold: 1500 });
  await page.waitForTimeout(500);
});
