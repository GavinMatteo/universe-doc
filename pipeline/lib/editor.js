// Opens the Shopify theme editor with the saved admin session and drives its section tree.
//
// Selectors found with probe-editor.js (October 2026 editor, en-US):
// - The editor UI is not in the top document: it is an embedded app iframe at
//   online-store-web.shopifyapps.com/themes/<id>/editor, positioned at 0,0 and filling the
//   viewport. The storefront preview is nested one level deeper. See editorFrame().
// - Top bar: header[class*="PowerFrame__Header"] (56 px tall). Its Save control is an
//   s-internal-button web component whose text lives in a shadow root, so a plain
//   button:has-text("Save") query finds nothing (we never click it anyway).
// - Tree row: li[class*="Online-Store-UI-NavItem_"]. The section type is on the li as
//   data-component-extra-section_type (e.g. "u-featured-collection"); block rows are nested
//   li with an id ending in __<block_type_with_underscores>_<hash>. The visible label is
//   [class*="NavItem__Title_"]; block rows add the instance title after a dash, e.g.
//   "Collection - New in supplements", hence the startsWith fallback.
// - Row click target: the li's own button[class*="NavItem__PrimaryAction"] (it overlays the
//   label, so clicking the label text is intercepted). getByText(label).click() fails for that
//   reason; getByRole('button', { name: label }) works for sections only.
// - Row box for the annotation: the li's own div[data-interior="true"] (the li itself grows to
//   include its children once expanded).
// - Chevron: button[aria-controls^="Collapsible-"] (aria-label "Open sub items menu", with
//   aria-expanded). Selecting a section expands it on its own.
// - Settings panel: #PowerFrame-PortalArea-SecondaryPanel. Not found: [role=treeitem] (the tree
//   has no ARIA tree roles) and a right-hand panel at 1600 px, see VIEWPORT.
// - Saving: the editor sends a GraphQL mutation TemplateUpdate (POST admin.shopify.com/api/
//   app_proxy/<store>?operation=TemplateUpdate), whose URL carries no theme id, so neither the
//   path guard nor the theme-url guard sees it. Guard 3 aborts every app proxy mutation except
//   the two the editor needs to open. Verified with `node probe-editor.js --save-test`.
// - Headless Chrome advertises "HeadlessChrome" in its user agent and then hangs on the Cloudflare
//   check in front of the editor, so the context uses the regular agent string.
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const STORE_HANDLE = 'universe-theme-woofy';
export const DEFAULT_THEME = '206989590871';
// Same Chrome as login.js: accounts.shopify.com rejects the bundled Chromium.
export const CHROME = process.env.CHROME_BIN || '/Users/Shared/Previously Relocated Items/Google Chrome.app/Contents/MacOS/Google Chrome';
// Below about 1800 css px the editor stacks the settings panel under the section tree in the
// left column instead of opening it on the right, which hides the tree item. 1800 keeps the
// three columns; optimize() scales the capture down to 1600.
export const VIEWPORT = { width: 1800, height: 1100 };

// GraphQL mutations the editor needs just to open (preview session, auth token). Every other
// mutation sent through the admin app proxy is aborted: that is where the editor saves.
const SAFE_MUTATIONS = new Set(['CreateThemeSessionId', 'GenerateArgusToken']);
// Admin persisted operations whose name hints at a theme write are aborted as well.
const RISKY_OPERATION = /theme|asset|file|publish|save|upsert|setting/i;

export async function openEditor({ themeId = DEFAULT_THEME, previewPath = '/', log = console.log } = {}) {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const probe = await browser.newPage();
  const userAgent = (await probe.evaluate(() => navigator.userAgent)).replace('HeadlessChrome', 'Chrome');
  await probe.context().close();
  const context = await browser.newContext({
    userAgent,
    storageState: path.join(here, '..', '.auth', 'shopify.json'),
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
  });
  const aborted = [];
  const block = (route, why) => {
    const req = route.request();
    aborted.push(`${req.method()} ${req.url()}`);
    log(`GUARD aborted (${why}) ${req.method()} ${req.url()}`);
    return route.abort();
  };
  // Save guard 1, from the brief: anything that looks like a theme write, whatever the method.
  await context.route(/\/themes\/\d+\/(asset|settings|editor\/save|publish)/i, r => block(r, 'theme path'));
  // Save guard 2: write methods on admin URLs that name this theme.
  const ids = [...new Set([String(themeId), DEFAULT_THEME])];
  await context.route(/admin\.shopify\.com/, (route) => {
    const req = route.request();
    const u = req.url();
    if (['PUT', 'POST', 'PATCH'].includes(req.method()) && ids.some(id => u.includes(`/themes/${id}/`) || u.endsWith(`/themes/${id}`))) return block(route, 'write on theme url');
    return route.fallback();
  });
  // Save guard 3: the editor talks GraphQL through the admin app proxy, so a save is a mutation
  // there and its URL never contains the theme id.
  await context.route(/admin\.shopify\.com\/api\/(app_proxy|operations)\//, (route) => {
    const req = route.request();
    if (req.method() !== 'POST') return route.fallback();
    const u = req.url();
    const body = req.postData() || '';
    if (u.includes('/api/app_proxy/')) {
      const m = body.match(/"query"\s*:\s*"\s*mutation\s+(\w+)/) || body.match(/^\s*mutation\s+(\w+)/);
      const isMutation = m || /"query"\s*:\s*"\s*mutation\b/.test(body) || /^\s*mutation\b/.test(body);
      if (isMutation && !(m && SAFE_MUTATIONS.has(m[1]))) return block(route, `mutation ${m ? m[1] : '?'}`);
    } else {
      const name = (u.match(/\/api\/operations\/[0-9a-f]+\/(\w+)/) || [])[1] || '';
      if (RISKY_OPERATION.test(name)) return block(route, `operation ${name}`);
    }
    return route.fallback();
  });
  const page = await context.newPage();
  page.on('dialog', d => d.dismiss().catch(() => {}));
  const url = `https://admin.shopify.com/store/${STORE_HANDLE}/themes/${themeId}/editor?previewPath=${encodeURIComponent(previewPath)}`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('load').catch(() => {});
  if (/accounts\.shopify\.com|\/login/i.test(page.url())) {
    await browser.close();
    throw new Error('Session expired: rerun `node login.js` in pipeline/');
  }
  return { browser, context, page, aborted };
}

// The editor UI is an embedded app iframe; the storefront preview is nested inside it.
export async function editorFrame(page, timeout = 90000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const f = page.frames().find(fr => /online-store-web\.shopifyapps\.com\/themes\/\d+\/editor/.test(fr.url()));
    if (f) {
      await f.locator('li[class*="Online-Store-UI-NavItem_"]').first().waitFor({ timeout: Math.max(1000, deadline - Date.now()) });
      return f;
    }
    if (/accounts\.shopify\.com|\/login/i.test(page.url())) throw new Error('Session expired: rerun `node login.js` in pipeline/');
    await page.waitForTimeout(500);
  }
  throw new Error(`Editor iframe not found. Frames: ${page.frames().map(f => f.url().slice(0, 80)).join(' , ')}`);
}

// Offset of the editor iframe inside the page, to turn frame coordinates into page coordinates.
async function frameOffset(frame) {
  const box = await (await frame.frameElement()).boundingBox();
  return { x: box ? box.x : 0, y: box ? box.y : 0 };
}

export async function topBarHeight(frame) {
  const box = await frame.locator('header[class*="PowerFrame__Header"]').first().boundingBox();
  const off = await frameOffset(frame);
  return Math.round((box ? box.y + box.height : 56) + off.y);
}

// Finds a tree row by its visible label: exact (case-insensitive, trimmed) first, then startsWith.
// `scope` limits the search to the children of a section row; `fallbackId` is a substring of the
// li id or the section type, used when the label does not match.
export async function findRow(frame, label, { scope = null, fallbackType = null, nested = false } = {}) {
  const idx = await frame.evaluate(({ label, scopeId, fallbackType, nested }) => {
    const root = scopeId ? document.getElementById(scopeId) : document;
    if (!root) return -1;
    const rows = [...root.querySelectorAll('li[class*="Online-Store-UI-NavItem_"]')].filter(li => li.id && (nested ? li !== root : !li.className.includes('NavItem--nested')));
    const title = li => (li.querySelector(':scope > [data-interior] [class*="NavItem__Title_"]')?.textContent || '').trim().toLowerCase();
    const want = label.trim().toLowerCase();
    let hit = rows.find(li => title(li) === want) || rows.find(li => title(li).startsWith(want));
    if (!hit && fallbackType) hit = rows.find(li => li.dataset.componentExtraSection_type === fallbackType || li.id.includes(`__${fallbackType.replace(/-/g, '_')}_`));
    return hit ? hit.id : -1;
  }, { label, scopeId: scope, fallbackType, nested });
  return idx === -1 ? null : idx;
}

const rowLocator = (frame, id) => frame.locator(`li[id="${id}"]`);

export async function selectRow(frame, id) {
  const li = rowLocator(frame, id);
  const btn = li.locator(':scope > [data-interior] > button[class*="NavItem__PrimaryAction"]');
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
}

export async function expandRow(frame, id) {
  const chevron = rowLocator(frame, id).locator(':scope > [data-interior] button[aria-controls^="Collapsible-"]');
  if (!(await chevron.count())) return false;
  if ((await chevron.getAttribute('aria-expanded')) !== 'true') await chevron.click();
  return true;
}

// Page-coordinate box of a tree row (its own line, not its expanded children).
export async function rowBox(frame, id) {
  const interior = rowLocator(frame, id).locator(':scope > [data-interior]');
  await interior.scrollIntoViewIfNeeded();
  const b = await interior.boundingBox();
  const off = await frameOffset(frame);
  return b && { x: b.x + off.x, y: b.y + off.y, width: b.width, height: b.height };
}

// Waits for the settings panel to show `heading` (or anything) and scrolls it back to the top.
export async function panelBox(frame) {
  const panel = frame.locator('#PowerFrame-PortalArea-SecondaryPanel');
  await panel.waitFor({ timeout: 15000 });
  await panel.evaluate(p => { for (const el of [p, ...p.querySelectorAll('*')]) if (el.scrollHeight > el.clientHeight + 4 && el.scrollTop) el.scrollTop = 0; });
  const b = await panel.boundingBox();
  const off = await frameOffset(frame);
  return b && { x: b.x + off.x, y: b.y + off.y, width: b.width, height: b.height };
}

// Scrolls the storefront preview so the section starts below the floating store header.
export async function revealInPreview(page, sectionRowId, offset = 160) {
  for (const f of page.frames()) {
    if (!/myshopify\.com/.test(f.url())) continue;
    await f.evaluate(({ id, offset }) => {
      const el = document.getElementById(`shopify-section-${id}`);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'instant' });
    }, { id: sectionRowId, offset }).catch(() => {});
  }
}
