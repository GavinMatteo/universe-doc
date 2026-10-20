// Captures storefront renders of theme sections from the demo store.
// Usage: STORE_PASSWORD=... node screenshots.js [page-slug ...]
// Pages come from manifest.json. Raw captures go to out/sections, optimized
// finals to ../theme-docs/.gitbook/assets/sections.
//
// Manifest entry: { path, type, hero?, selector?, maxHeight?, setup?, skip? }
//   maxHeight max height in css px, snapped down to the last full row of the grid (long listings)
//   selector  CSS selector for the section when its id does not follow __u_<type>
//   setup     one of the SETUPS below; such pages run in their own fresh session
//   skip      reason string: the page is reported as SKIP and never counted as MISSING
import { openStore, quiet, STORE } from './lib/store.js';
import { optimize } from './lib/optimize.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const rawDir = path.join(here, 'out/sections');
const finalDir = path.join(here, '../theme-docs/.gitbook/assets/sections');
const { pages } = JSON.parse(fs.readFileSync(path.join(here, 'manifest.json'), 'utf8'));
const BUDGET_KB = 300;
let missing = 0;
let captured = 0;
let skipped = 0;
const overBudget = [];
const wanted = process.argv.slice(2);
const unknown = wanted.filter(w => !pages[w]);
if (unknown.length) { console.error(`Unknown page slug: ${unknown.join(', ')}`); process.exit(1); }
const slugs = wanted.length ? wanted : Object.keys(pages);
fs.mkdirSync(rawDir, { recursive: true });
// Remove stale finals up front so a failed run never leaves an old image behind.
for (const slug of slugs) fs.rmSync(path.join(finalDir, `${slug}.png`), { force: true });

const byPath = {};
const withSetup = [];
for (const slug of slugs) {
  const p = pages[slug];
  if (p.skip) { console.log(`SKIP ${slug}: ${p.skip}`); skipped++; continue; }
  if (p.setup) { withSetup.push(slug); continue; }
  (byPath[p.path] ||= []).push(slug);
}

const sectionSelector = ({ type, selector }) => selector ||
  `.shopify-section[id$="__u_${type.replace(/-/g, '_')}"], .shopify-section[id*="__u_${type.replace(/-/g, '_')}_"]`;

// Suppress the newsletter popup for this session: the theme only shows it without this cookie.
async function noPopup(ctx) {
  await ctx.addCookies([{ name: 'newsletterClosed', value: 'true', url: STORE }]);
}

// Puts one item in this session's cart through the storefront Ajax cart (per session,
// gone with the browser context: nothing is written to the store).
async function addToCart(page) {
  await page.goto(STORE + '/products/beef-bites', { waitUntil: 'load' });
  const status = await page.evaluate(async () => {
    const field = document.querySelector('form.single-product__form [name="id"]') || document.querySelector('form[action*="/cart/add"] [name="id"]');
    const id = field.value;
    const res = await fetch('/cart/add.js', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: Number(id), quantity: 1 }] }),
    });
    return res.status;
  });
  if (status !== 200) throw new Error(`add to cart failed with HTTP ${status}`);
}

async function load(page, urlPath, opts) {
  await page.goto(STORE + urlPath, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await quiet(page, opts);
}

// Walk the page so lazy images and reveal animations settle.
async function walk(page) {
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += 700) { await page.mouse.wheel(0, 700); await page.waitForTimeout(120); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
}

// Each setup prepares the page and returns a viewport clip, or null to use the
// default section clip after it ran.
const SETUPS = {
  'add-to-cart': async (page, entry) => {
    await addToCart(page);
    await load(page, entry.path);
    if (!(await page.locator('.js-cart-item').count())) return 'cart is empty';
    await walk(page);
    return null;
  },
  // Header bar with the first top-level submenu open (mega menu or dropdown).
  'open-menu': async (page, entry) => {
    await load(page, entry.path);
    const header = page.locator(sectionSelector(entry)).first();
    const trigger = header.locator('.header-nav__menu > .header-nav__menu-item > .js-header-nav-submenu-activate, .header-nav__menu > .header-nav__menu-item > .header-nav__menu-details > summary')
      .filter({ visible: true }).first();
    if (!(await trigger.count())) return 'no top-level menu item with a submenu';
    await trigger.hover();
    await page.waitForTimeout(600);
    const isOpen = () => trigger.evaluate(t => t.getAttribute('aria-expanded') === 'true' || !!t.closest('details[open]'));
    if (!(await isOpen())) { await trigger.click(); await page.waitForTimeout(1200); }
    if (!(await isOpen())) return 'the first submenu did not open on hover or click';
    if (new URL(page.url()).pathname !== new URL(STORE + entry.path).pathname) return `the menu click navigated to ${page.url()}`;
    return trigger.evaluate((t, sel) => {
      const panel = (t.getAttribute('aria-controls') && document.getElementById(t.getAttribute('aria-controls'))) ||
        t.closest('details').querySelector(':scope > :not(summary)');
      const bottom = Math.max(document.querySelector(sel).getBoundingClientRect().bottom, panel.getBoundingClientRect().bottom);
      return { x: 0, y: 0, width: innerWidth, height: Math.min(innerHeight, Math.ceil(bottom) + 16) };
    }, sectionSelector(entry));
  },
  // The open cart drawer with one item, clipped to the drawer panels.
  'open-cart': async (page, entry) => {
    await addToCart(page);
    await load(page, entry.path);
    await page.locator('.shopify-section[id$="__header"] .js-cart-opener').filter({ visible: true }).first().click();
    await page.waitForSelector('.js-cart-drawer-wrap.is-open', { timeout: 10000 });
    await page.waitForTimeout(1500);
    return page.evaluate(() => {
      const wrap = document.querySelector('.js-cart-drawer-wrap.is-open');
      let left = innerWidth;
      for (const n of wrap.querySelectorAll('*')) {
        if (n.closest('.js-cart-drawer-overlay')) continue;
        const r = n.getBoundingClientRect(); const cs = getComputedStyle(n);
        if (r.width < 150 || r.height < 300 || cs.visibility === 'hidden' || r.left < 0) continue;
        left = Math.min(left, r.left);
      }
      return { x: left, y: 0, width: innerWidth - left, height: innerHeight };
    });
  },
  // The newsletter popup over the page, with its overlay. Fresh session: no newsletterClosed cookie.
  'open-popup': async (page, entry) => {
    await page.context().clearCookies({ name: 'newsletterClosed' });
    await load(page, entry.path, { keepPopup: true });
    try {
      await page.waitForSelector('.js-popup-newsletter.is-active', { timeout: 40000 });
    } catch { return 'the popup never opened within 40 s'; }
    await page.waitForTimeout(2000);
    return { x: 0, y: 0, width: 1440, height: 900 };
  },
};

async function shoot(page, slug, clip, fullPage) {
  const raw = path.join(rawDir, `${slug}.png`);
  const final = path.join(finalDir, `${slug}.png`);
  await page.screenshot({ path: raw, clip, fullPage, animations: 'disabled' });
  const rawKB = Math.round(fs.statSync(raw).size / 1024);
  let out = await optimize(raw, final);
  let note = '';
  if (out.bytes / 1024 > BUDGET_KB) { out = await optimize(raw, final, { quality: 50, dither: 0 }); note = ' (second pass q50)'; }
  const kb = Math.round(out.bytes / 1024);
  if (kb > BUDGET_KB) overBudget.push(`${slug} ${kb} KB`);
  captured++;
  console.log(`${slug.padEnd(24)} ${Math.round(clip.width)}x${Math.round(clip.height)} css px -> ${out.width}x${out.height} ${path.relative(here, final)} (raw ${rawKB} KB, final ${kb} KB${note})${kb > BUDGET_KB ? ' OVER BUDGET' : ''}`);
}

// The default capture: the section box, extended to headings that overflow it.
async function captureSection(page, slug, urlPath) {
  const { hero } = pages[slug];
  const el = page.locator(sectionSelector(pages[slug])).first();
  if (!(await el.count())) { console.log(`MISSING ${slug}: section not found on ${urlPath}`); missing++; return; }
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
    // Skip headings that are not painted: inside fixed modals, or clipped by a collapsed
    // overflow container (closed accordions keep their layout box below the section).
    const painted = (n, b) => {
      for (let a = n.parentElement; a && a !== sec.parentElement; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.position === 'fixed' || cs.visibility === 'hidden' || cs.display === 'none') return false;
        if (cs.overflowY !== 'visible' || cs.overflowX !== 'visible') {
          const ar = a.getBoundingClientRect();
          if (b.top >= ar.bottom || b.bottom <= ar.top) return false;
        }
      }
      return true;
    };
    for (const n of sec.querySelectorAll('h1, h2, h3')) {
      const b = n.getBoundingClientRect(); if (!b.height || !painted(n, b)) continue;
      top = Math.min(top, b.top - 24); bottom = Math.max(bottom, b.bottom + 24);
    }
    return { x: 0, y: Math.max(0, top + scrollY), width: innerWidth, height: bottom - top };
  }, hero);
  // Long listings (product grids, search, blog) only need their first rows to show the layout.
  const { maxHeight } = pages[slug];
  if (maxHeight && clip.height > maxHeight) {
    const snapped = await el.evaluate((sec, { top, max }) => {
      // Cards are the card-sized children of every grid-like container (3 or more such
      // children): a blog mixes a featured row and a 3-column grid, so one grid is not enough.
      const isCard = n => { const r = n.getBoundingClientRect(); return r.width >= 100 && r.height >= 100; };
      const cards = [];
      for (const n of sec.querySelectorAll('*')) {
        const kids = [...n.children].filter(isCard);
        if (kids.length < 3) continue;
        for (const c of kids) { const r = c.getBoundingClientRect(); cards.push({ top: r.top + scrollY - top, bottom: r.bottom + scrollY - top }); }
      }
      if (!cards.length) return null;
      // Last card bottom inside the limit that no other card straddles: a full row.
      const ends = cards.map(c => c.bottom).filter(b => b <= max)
        .filter(b => !cards.some(c => c.top < b - 1 && c.bottom > b + 1)).sort((a, b) => b - a);
      if (!ends.length) return null;
      const pad = parseFloat(getComputedStyle(sec.firstElementChild || sec).paddingBottom) || 0;
      // Breathing room below the row, but never into the next row: stop 1 px above its top.
      const next = Math.min(...cards.map(c => c.top).filter(t => t > ends[0]), Infinity);
      return Math.min(ends[0] + Math.max(pad, 40), next - 1);
    }, { top: clip.y, max: maxHeight });
    if (snapped) clip.height = snapped;
    else { clip.height = maxHeight; console.log(`WARN ${slug}: maxHeight not snapped`); }
  }
  if (clip.height < 20) { console.log(`MISSING ${slug}: section on ${urlPath} has no height`); missing++; return; }
  await shoot(page, slug, clip, true);
}

if (Object.keys(byPath).length) {
  const { browser, ctx, page } = await openStore();
  await noPopup(ctx);
  for (const [urlPath, list] of Object.entries(byPath)) {
    await load(page, urlPath);
    await walk(page);
    for (const slug of list) await captureSection(page, slug, urlPath);
  }
  await browser.close();
}

// Pages with a setup each get a fresh session, so carts and cookies never leak between them.
for (const slug of withSetup) {
  const entry = pages[slug];
  const setup = SETUPS[entry.setup];
  if (!setup) { console.log(`MISSING ${slug}: unknown setup "${entry.setup}"`); missing++; continue; }
  const { browser, ctx, page } = await openStore();
  try {
    if (entry.setup !== 'open-popup') await noPopup(ctx);
    const clip = await setup(page, entry);
    if (typeof clip === 'string') { console.log(`MISSING ${slug}: ${clip}`); missing++; }
    else if (clip) await shoot(page, slug, clip, false);
    else await captureSection(page, slug, entry.path);
  } catch (err) {
    console.log(`MISSING ${slug}: setup "${entry.setup}" failed: ${err.message.split('\n')[0]}`);
    missing++;
  } finally {
    await browser.close();
  }
}

console.log(`\n${captured} captured, ${skipped} skipped, ${missing} missing`);
if (overBudget.length) console.log(`Over ${BUDGET_KB} KB: ${overBudget.join(', ')}`);
if (missing) { console.log(`${missing} section(s) MISSING`); process.exitCode = 1; }
