// Captures storefront renders of theme sections from the demo store.
// Usage: STORE_PASSWORD=... node screenshots.js [out-dir] [type ...]
// A "type" is the section liquid name without the u- prefix, e.g. bold-slideshow.
import { openStore, quiet, STORE } from './lib/store.js';
import fs from 'node:fs';

const outDir = process.argv[2] || 'out/sections';
const wanted = process.argv.slice(3);
const PAGES = { '/': ['bold-slideshow', 'reviews-showcase', 'featured-collection'] };
fs.mkdirSync(outDir, { recursive: true });

const { browser, page } = await openStore();
await quiet(page);
for (const [path, types] of Object.entries(PAGES)) {
  const list = wanted.length ? types.filter(t => wanted.includes(t)) : types;
  if (!list.length) continue;
  await page.goto(STORE + path, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await quiet(page);
  // Walk the page so lazy images and reveal animations settle.
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += 700) { await page.mouse.wheel(0, 700); await page.waitForTimeout(120); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  for (const type of list) {
    const sel = `.shopify-section[id$="__u_${type.replace(/-/g, '_')}"], .shopify-section[id*="__u_${type.replace(/-/g, '_')}_"]`;
    const el = page.locator(sel).first();
    if (!(await el.count())) { console.log(`MISSING ${type} on ${path}`); continue; }
    const HERO = ['bold-slideshow', 'advanced-hero-slideshow'];
    // The floating header overlays whatever is scrolled under it: hide it unless this is the hero.
    await page.evaluate(h => { const hd = document.querySelector('.shopify-section[id$="__header"]'); if (hd) hd.style.visibility = h ? '' : 'hidden'; }, HERO.includes(type));
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    // Clip to the real painted extent: headings and shapes often overflow the section box.
    const clip = await el.evaluate((sec, isHero) => {
      let r = sec.getBoundingClientRect();
      // Give flush content some breathing room, on whichever element paints the background.
      const opaque = n => { const c = getComputedStyle(n).backgroundColor; return c && c !== 'transparent' && !/rgba\(.*, 0\)$/.test(c); };
      let host = sec;
      if (!opaque(sec)) host = [...sec.querySelectorAll('*')].find(n => opaque(n) && n.getBoundingClientRect().width >= r.width - 2) || sec;
      const hr = host.getBoundingClientRect();
      const first = host.querySelector('h1, h2, h3');
      if (!isHero && first && first.getBoundingClientRect().top - hr.top < 24) {
        host.style.paddingTop = '40px';
        host.style.paddingBottom = `${Math.max(40, parseFloat(getComputedStyle(host).paddingBottom))}px`;
      }
      r = sec.getBoundingClientRect();
      // Only headings are allowed to extend the box: anything else outside it is an overlay or a drawer.
      let top = r.top, bottom = r.bottom;
      for (const n of sec.querySelectorAll('h1, h2, h3')) {
        const b = n.getBoundingClientRect(); if (!b.height) continue;
        top = Math.min(top, b.top - 24); bottom = Math.max(bottom, b.bottom + 24);
      }
      return { x: 0, y: Math.max(0, top + scrollY), width: innerWidth, height: bottom - top };
    }, HERO.includes(type));
    const file = `${outDir}/${type}.png`;
    await page.screenshot({ path: file, clip, fullPage: true, animations: 'disabled' });
    const box = clip;
    console.log(`${type.padEnd(22)} ${Math.round(box.width)}x${Math.round(box.height)} css px -> ${file} (${Math.round(fs.statSync(file).size/1024)} KB)`);
  }
}
await browser.close();
