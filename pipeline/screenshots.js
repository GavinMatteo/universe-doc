// Captures storefront renders of theme sections from the demo store.
// Usage: STORE_PASSWORD=... node screenshots.js [page-slug ...]
// Pages come from manifest.json. Raw captures go to out/sections, optimized
// finals to ../theme-docs/.gitbook/assets/sections.
import { openStore, quiet, STORE } from './lib/store.js';
import { optimize } from './lib/optimize.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const rawDir = path.join(here, 'out/sections');
const finalDir = path.join(here, '../theme-docs/.gitbook/assets/sections');
const { pages } = JSON.parse(fs.readFileSync(path.join(here, 'manifest.json'), 'utf8'));
const wanted = process.argv.slice(2);
const unknown = wanted.filter(w => !pages[w]);
if (unknown.length) { console.error(`Unknown page slug: ${unknown.join(', ')}`); process.exit(1); }
const slugs = wanted.length ? wanted : Object.keys(pages);
const byPath = {};
for (const slug of slugs) (byPath[pages[slug].path] ||= []).push(slug);
fs.mkdirSync(rawDir, { recursive: true });
// Remove stale finals up front so a failed run never leaves an old image behind.
for (const slug of slugs) fs.rmSync(path.join(finalDir, `${slug}.png`), { force: true });

const { browser, page } = await openStore();
await quiet(page);
for (const [urlPath, list] of Object.entries(byPath)) {
  await page.goto(STORE + urlPath, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await quiet(page);
  // Walk the page so lazy images and reveal animations settle.
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += 700) { await page.mouse.wheel(0, 700); await page.waitForTimeout(120); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  for (const slug of list) {
    const { type, hero } = pages[slug];
    const sel = `.shopify-section[id$="__u_${type.replace(/-/g, '_')}"], .shopify-section[id*="__u_${type.replace(/-/g, '_')}_"]`;
    const el = page.locator(sel).first();
    if (!(await el.count())) { console.log(`MISSING ${slug} on ${urlPath}`); continue; }
    // The floating header overlays whatever is scrolled under it: hide it unless this is the hero.
    await page.evaluate(h => { const hd = document.querySelector('.shopify-section[id$="__header"]'); if (hd) hd.style.visibility = h ? '' : 'hidden'; }, hero);
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
    }, hero);
    const raw = path.join(rawDir, `${slug}.png`);
    const final = path.join(finalDir, `${slug}.png`);
    await page.screenshot({ path: raw, clip, fullPage: true, animations: 'disabled' });
    const rawKB = Math.round(fs.statSync(raw).size / 1024);
    const out = await optimize(raw, final);
    console.log(`${slug.padEnd(22)} ${Math.round(clip.width)}x${Math.round(clip.height)} css px -> ${out.width}x${out.height} ${path.relative(here, final)} (raw ${rawKB} KB, final ${Math.round(out.bytes / 1024)} KB)`);
  }
}
await browser.close();
