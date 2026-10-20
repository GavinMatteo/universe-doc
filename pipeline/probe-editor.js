// Probe for the theme editor DOM, kept for the next round.
// Usage:
//   node probe-editor.js [label]           dump tree row, panel and top bar structure for a section
//   node probe-editor.js --save-test       type into a setting, press the save shortcut, and check
//                                          that the guard aborted the write and nothing persisted
// The editor UI lives in an iframe (online-store-web.shopifyapps.com), not the top document.
import { openEditor, editorFrame, findRow, selectRow, topBarHeight } from './lib/editor.js';

const saveTest = process.argv.includes('--save-test');
const label = process.argv.slice(2).find(a => !a.startsWith('--')) || 'Featured Collection';

async function open() {
  const s = await openEditor({});
  s.frame = await editorFrame(s.page);
  await s.page.waitForTimeout(2000);
  return s;
}
// The first numeric setting of the section (a range slider's text box, labelled via aria-labelledby).
async function numberSetting(frame) {
  const id = await findRow(frame, label, { fallbackType: 'u-featured-collection' });
  await selectRow(frame, id);
  const input = frame.locator('#PowerFrame-PortalArea-SecondaryPanel input[aria-labelledby$="Label"]:not([id^="UrlSetting"])').first();
  await input.waitFor({ timeout: 15000 });
  const name = await input.evaluate(i => {
    const byId = document.getElementById(i.getAttribute('aria-labelledby').split(' ')[0]);
    if (byId && byId.textContent.trim()) return byId.textContent.trim();
    for (let n = i.parentElement; n; n = n.parentElement) { const l = n.querySelector('label'); if (l && l.textContent.trim()) return l.textContent.trim(); }
    return '?';
  });
  return { input, name };
}

if (!saveTest) {
  const { browser, page, frame } = await open();
  console.log('top bar bottom', await topBarHeight(frame));
  const id = await findRow(frame, label);
  console.log('row id', id);
  const dump = await frame.evaluate((id) => {
    const desc = n => `${n.tagName.toLowerCase()}${n.id ? '#' + n.id : ''}${n.getAttribute('role') ? '[role=' + n.getAttribute('role') + ']' : ''}${n.getAttribute('aria-label') ? '[aria-label="' + n.getAttribute('aria-label') + '"]' : ''}${typeof n.className === 'string' && n.className ? '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.') : ''}`;
    const li = document.getElementById(id);
    return { row: li && li.outerHTML.slice(0, 1500), rows: [...document.querySelectorAll('li[class*="Online-Store-UI-NavItem_"]')].map(l => `${l.id} :: ${(l.querySelector('[class*="NavItem__Title_"]') || {}).textContent}`), header: desc(document.querySelector('header[class*="PowerFrame__Header"]') || document.body) };
  }, id);
  console.log(JSON.stringify(dump, null, 1));
  if (id) {
    await selectRow(frame, id);
    await page.waitForTimeout(2000);
    const panel = frame.locator('#PowerFrame-PortalArea-SecondaryPanel');
    console.log('panel box', await panel.boundingBox(), 'heading', await panel.locator('h1').first().textContent());
    console.log('row children', await frame.evaluate(id => [...document.getElementById(id).querySelectorAll('li')].map(l => l.id + ' :: ' + l.textContent.trim().slice(0, 60)), id));
  }
  await page.screenshot({ path: 'out/preview/probe-selected.png' });
  await browser.close();
} else {
  // Pass 1: change a value, then try to save with the keyboard shortcut (never a click on Save).
  let s = await open();
  const failed = [];
  s.page.on('requestfailed', r => failed.push(`${r.method()} ${r.url()} (${r.failure()?.errorText})`));
  let { input, name } = await numberSetting(s.frame);
  const before = await input.inputValue();
  const changed = String(Number(before) > 1 ? Number(before) - 1 : Number(before) + 1);
  console.log(`Setting "${name}" before: ${before}, typing ${changed}`);
  await input.fill(changed);
  await input.press('Tab');
  await s.page.waitForTimeout(1500);
  console.log('Value in the panel after typing:', await input.inputValue());
  await s.page.waitForTimeout(3000);
  await s.page.keyboard.press('Meta+S');
  await s.page.waitForTimeout(6000);
  await s.page.keyboard.press('Control+S');
  await s.page.waitForTimeout(6000);
  console.log('Aborted by guard:', JSON.stringify(s.aborted, null, 1));
  console.log('requestfailed (save related):', JSON.stringify(failed.filter(f => /app_proxy|themes/.test(f)), null, 1));
  await s.page.screenshot({ path: 'out/preview/save-test-after-shortcut.png' });
  await s.context.close();
  await s.browser.close();
  // Pass 2: fresh session, the value must be the original one.
  s = await open();
  ({ input, name } = await numberSetting(s.frame));
  const after = await input.inputValue();
  console.log(`Setting "${name}" after reopen:`, JSON.stringify(after), after === before ? 'UNCHANGED (guard held)' : 'CHANGED (guard failed)');
  await s.browser.close();
}
