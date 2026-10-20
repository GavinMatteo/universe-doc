// Annotated theme editor captures: the section's settings and each capturable block's settings.
// Usage: node editor-shots.js <section.liquid> [--theme <id>]
// Needs .auth/shopify.json (run `node login.js` once). Never saves: see the guards in lib/editor.js.
import { openEditor, editorFrame, topBarHeight, findRow, selectRow, expandRow, rowBox, panelBox, revealInPreview, DEFAULT_THEME } from './lib/editor.js';
import { annotate, clearAnnotations } from './lib/annotate.js';
import { optimize } from './lib/optimize.js';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.join(here, '..');
const args = process.argv.slice(2);
const liquid = args.find(a => a.endsWith('.liquid'));
const ti = args.indexOf('--theme');
const themeId = ti >= 0 ? args[ti + 1] : DEFAULT_THEME;
if (!liquid) { console.error('Usage: node editor-shots.js <section.liquid> [--theme <id>]'); process.exit(1); }

const meta = JSON.parse(execFileSync('python3', [path.join(repo, 'generator/anchors.py'), path.join(repo, '.themes/universe-empty-3rd'), liquid], { cwd: repo, encoding: 'utf8' }));
const { pages } = JSON.parse(fs.readFileSync(path.join(here, 'manifest.json'), 'utf8'));
const entry = pages[meta.page];
if (!entry) { console.error(`No manifest.json entry for page "${meta.page}"`); process.exit(1); }
const sectionType = liquid.replace(/\.liquid$/, '');
const rawDir = path.join(here, 'out/editor', meta.page);
const finalDir = path.join(repo, 'theme-docs/.gitbook/assets/editor', meta.page);

let session = null;
let missing = 0;
const miss = (label, err) => { missing++; console.log(`MISSING ${label}${err ? `  (${err.message.split('\n')[0]})` : ''}`); };
try {
  session = await openEditor({ themeId, previewPath: entry.path });
  const { page } = session;
  // Waiting for the tree proves the session is valid; only then touch the output folder.
  const frame = await editorFrame(page);
  fs.rmSync(finalDir, { recursive: true, force: true });
  fs.mkdirSync(rawDir, { recursive: true });
  await page.waitForTimeout(2000);
  const top = await topBarHeight(frame);
  const vp = page.viewportSize();
  const clip = { x: 0, y: top, width: vp.width, height: vp.height - top };

  async function capture(rowId, name, sectionRowId) {
    await page.mouse.move(vp.width / 2, 2);
    await page.waitForTimeout(1200);
    await revealInPreview(page, sectionRowId);
    await page.waitForTimeout(800);
    const tree = await rowBox(frame, rowId);
    const panel = await panelBox(frame);
    if (!tree || !panel) throw new Error(`${!tree ? 'tree item' : 'panel'} has no box`);
    await annotate(page, [tree, panel], { bounds: clip });
    const raw = path.join(rawDir, `${name}.png`);
    await page.screenshot({ path: raw, clip });
    await clearAnnotations(page);
    const out = path.join(finalDir, `${name}.png`);
    const info = await optimize(raw, out);
    console.log(`${path.relative(repo, out)}  ${info.width}x${info.height}  ${info.bytes} bytes`);
  }

  const sectionId = await findRow(frame, meta.section_label, { fallbackType: sectionType });
  if (!sectionId) {
    miss(meta.section_label);
  } else {
    try {
      await selectRow(frame, sectionId);
      await page.waitForTimeout(1500);
      await capture(sectionId, 'section-settings', sectionId);
    } catch (e) { miss(meta.section_label, e); }
    for (const b of meta.blocks.filter(b => b.capture)) {
      try {
        await selectRow(frame, sectionId);
        await page.waitForTimeout(800);
        await expandRow(frame, sectionId);
        await page.waitForTimeout(800);
        const blockId = await findRow(frame, b.label, { scope: sectionId, nested: true, fallbackType: b.type });
        if (!blockId) { miss(b.label); continue; }
        await selectRow(frame, blockId);
        await page.waitForTimeout(1500);
        await capture(blockId, b.anchor, sectionId);
      } catch (e) { miss(b.label, e); }
    }
  }
} catch (e) {
  console.error(`Editor capture failed: ${e.message}`);
  process.exitCode = 1;
} finally {
  if (session) {
    if (session.aborted.length) console.log(`Save guard aborted ${session.aborted.length} request(s)`);
    // Close without saving: the dialog handler dismisses any "leave page" prompt.
    await session.context.close().catch(() => {});
    await session.browser.close().catch(() => {});
  }
  if (missing) process.exitCode = 1;
}
