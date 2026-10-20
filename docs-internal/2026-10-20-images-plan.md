# Images in the docs, Phase 0 (test on Featured Collection): Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove the full image pipeline end to end on one section page (Featured Collection) and one infographic (Color scheme), with the generator emitting the image lines and the result visible on the live GitBook page.

**Architecture:** Three capture scripts in `pipeline/` (storefront render, annotated editor captures, HTML infographic render) write optimized PNGs into `theme-docs/.gitbook/assets/`. `generator/generate.py` emits a Markdown image line under the intro and under any heading for which a matching file exists. A small Python helper exports the page slug and heading anchors as JSON so the Node scripts name files exactly as the generator expects.

**Tech Stack:** Node 25, Playwright 1.58 (Chromium), `sharp` for PNG optimization, Python 3.9 stdlib for the generator and its tests.

**Spec:** `docs-internal/2026-10-20-images-design.md`

## Global Constraints

- No em dashes or en dashes anywhere (code comments, alt text, Markdown, commit messages).
- Generated pages are never edited by hand; only `generate.py` and its inputs change.
- Never click Save in the Shopify theme editor. Close the page at the end of a batch.
- Store password is `universe`; pass it as `STORE_PASSWORD`. Theme editor session comes from `pipeline/.auth/shopify.json` (gitignored), created by `node pipeline/login.js`.
- Demo theme id for the editor: verify with `shopify theme list --store=universe-theme-woofy.myshopify.com` before use (expected `206989590871`).
- Asset layout, verbatim from the spec:
  - `theme-docs/.gitbook/assets/sections/<page-slug>.png`
  - `theme-docs/.gitbook/assets/editor/<page-slug>/section-settings.png`
  - `theme-docs/.gitbook/assets/editor/<page-slug>/<block-anchor>.png`
  - `theme-docs/.gitbook/assets/infographics/<page-slug>/<anchor>.png`
- Image width 1600 px. Budget: under 300 KB per capture, under 150 KB per infographic.
- Annotation color `#7852fc` (Purple), 3 px stroke, rounded corners. Lime `#e0f568` only for one accent word in infographics.
- Editor captures: viewport 1600x1100 css px at 2x, top bar cropped out, panel scrolled to top.
- Every visual uses `pipeline/brand/tokens.css` and the rules in `pipeline/brand/BRAND.md`.
- Shape Divider and App Block headings get no editor capture.
- Branch and PR, never push to `main`. Merge with `gh pr merge <n> --rebase --delete-branch`.

## Review Focus

1. A page in `theme-docs/` root versus `theme-docs/sections/` must get a different relative prefix (`.gitbook/assets/` versus `../.gitbook/assets/`); a wrong prefix renders a broken image on GitBook. Pinned in Task 4.
2. A block whose label contains characters outside `[a-z0-9-]` (for example "Vendor/SKU") must produce the same anchor in Python and in the capture script; pinned by Task 3 exporting anchors from `make_anchor` rather than recomputing them in JS.
3. An image file that exists for a heading the schema no longer has must not be emitted (no orphan image lines); pinned in Task 4 by the lookup being heading-driven, and in Task 6 by the validator's orphan check.
4. A capture run that fails halfway must not leave a stale image for that page; pinned in Tasks 5 and 6 by deleting the page's editor folder before capture.
5. The editor's Save button must never be clicked even if a selector drifts; pinned in Task 6 by a route guard that aborts any request to the theme save endpoint.

---

### Task 1: Branch and commit the existing pipeline

**Files:**
- Modify: `.gitignore` (already edited on disk, see `git diff`)
- Add: `pipeline/**` except gitignored paths, `docs-internal/2026-10-19-screenshots-videos-proof.md`, `docs-internal/2026-10-20-images-design.md`, `docs-internal/2026-10-20-images-plan.md`

- [ ] **Step 1: Create the branch**

Run: `git checkout -b images-phase-0`

- [ ] **Step 2: Check nothing heavy is about to be committed**

Run: `git add -n pipeline docs-internal .gitignore | grep -v node_modules | awk '{print $2}' | xargs du -ch | tail -1`
Expected: total under 30 MB. If a `pipeline/video/node_modules` or `pipeline/video/out` path appears, add it to `.gitignore` first.

- [ ] **Step 3: Commit**

```bash
git add .gitignore pipeline docs-internal
git commit -m "chore: add screenshot and video pipeline with brand kit and design docs"
```

---

### Task 2: PNG optimizer

**Files:**
- Create: `pipeline/lib/optimize.js`
- Modify: `pipeline/package.json` (add `sharp`)
- Test: manual run on `pipeline/out/sections/featured-collection.png`

**Interfaces:**
- Produces: `export async function optimize(inputPath, outputPath, { width = 1600 } = {}) -> { bytes: number, width: number, height: number }`. Resizes to `width` (never upscales), writes PNG with `palette: true, quality: 80, compressionLevel: 9`.

- [ ] **Step 1: Install sharp**

Run: `cd pipeline && npm i sharp`
Expected: `package.json` lists `sharp`, no build errors.

- [ ] **Step 2: Implement `optimize()` in `pipeline/lib/optimize.js`**

Use `sharp(input).resize({ width, withoutEnlargement: true }).png({ palette: true, quality: 80, compressionLevel: 9 })`. Return the metadata of the written file.

- [ ] **Step 3: Verify on an existing render**

Run: `cd pipeline && node -e "import('./lib/optimize.js').then(m => m.optimize('out/sections/featured-collection.png', 'out/preview/fc-opt.png').then(r => console.log(r)))"`
Expected: `width: 1600`, `bytes` under 300000. Open the output and confirm text is still crisp. If the palette version shows banding on gradients, raise `quality` to 90 and re-check the size.

- [ ] **Step 4: Commit**

```bash
git add pipeline/package.json pipeline/package-lock.json pipeline/lib/optimize.js
git commit -m "feat(pipeline): add PNG optimizer with sharp"
```

---

### Task 3: Anchor export from the generator

**Files:**
- Create: `generator/anchors.py`
- Test: `generator/tests/test_anchors.py`

**Interfaces:**
- Produces: `python3 generator/anchors.py <theme-dir> <liquid-name>` prints JSON `{"page": "featured-collection", "subdir": "sections", "section_label": "Featured Collection", "blocks": [{"type": "collection-block", "label": "Collection", "anchor": "collection", "capture": true}, {"type": "shape_divider", "label": "Shape Divider", "anchor": "shape-divider", "capture": false}]}`. `capture` is false for `shape_divider` and `@app`. Labels resolved with `get_label` and the theme locale, exactly as `write_section_doc` does. `page` comes from `output_filename` without `.md`, `subdir` from `ROOT_SECTIONS`.

- [ ] **Step 1: Write the failing test**

```python
# generator/tests/test_anchors.py
import json, subprocess, sys, os, unittest
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
THEME = os.path.join(ROOT, '.themes', 'universe-empty-3rd')

class AnchorsTest(unittest.TestCase):
    def run_it(self, name):
        out = subprocess.check_output([sys.executable, os.path.join(ROOT, 'generator', 'anchors.py'), THEME, name])
        return json.loads(out)

    def test_featured_collection(self):
        d = self.run_it('u-featured-collection.liquid')
        self.assertEqual(d['page'], 'featured-collection')
        self.assertEqual(d['subdir'], 'sections')
        blocks = {b['type']: b for b in d['blocks']}
        self.assertEqual(blocks['collection-block']['anchor'], 'collection')
        self.assertTrue(blocks['collection-block']['capture'])
        self.assertFalse(blocks['shape_divider']['capture'])

    def test_root_section(self):
        d = self.run_it('u-drawer-cart.liquid')
        self.assertEqual(d['subdir'], '')
        self.assertEqual(d['page'], 'drawer-cart')
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 -m unittest generator.tests.test_anchors -v` (add an empty `generator/tests/__init__.py`)
Expected: FAIL, `anchors.py` not found.

- [ ] **Step 3: Implement `generator/anchors.py`**

Import `load_labels`, `load_schema`, `get_label`, `make_anchor`, `output_filename`, `ROOT_SECTIONS` from `generate.py` (add `sys.path` for the generator directory). Build the dict per the Interfaces block and `print(json.dumps(...))`.

- [ ] **Step 4: Run test to verify it passes**

Run: `python3 -m unittest generator.tests.test_anchors -v`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add generator/anchors.py generator/tests
git commit -m "feat(generator): export page slug and block anchors as JSON"
```

---

### Task 4: Generator emits image lines

**Files:**
- Modify: `generator/generate.py` (`write_section_doc` at lines 140 to 230, `main` at line 471)
- Test: `generator/tests/test_images.py`

**Interfaces:**
- Produces: `def image_line(assets_dir, subdir, rel_path, alt) -> str` returning `'![alt](<prefix>.gitbook/assets/<rel_path>)\n\n'` when `os.path.isfile(os.path.join(assets_dir, rel_path))`, else `''`. `prefix` is `''` when `subdir == ''` and `'../'` when `subdir == 'sections'`.
- `write_section_doc(fname, schema, meta, all_labels, descriptions, context_overrides, assets_dir=None)` gains the keyword argument; when `None`, no image lines (keeps existing callers working). `main` passes `os.path.join(out_dir, '.gitbook', 'assets')`.
- Emission points, in this order: after the `📌 When to use it` line (or after intro when no `when`), `sections/<page>.png` with alt = title; after `## ⚙️ Section Settings`, `editor/<page>/section-settings.png` with alt `"<title> section settings in the theme editor"`; after each block `### <bname>` (not shape divider, not app), `editor/<page>/<anchor>.png` with alt `"<bname> block settings in the theme editor"`; after every H2 and H3 the generator writes (including Section Settings and blocks), `infographics/<page>/<anchor>.png` with alt = heading text without emoji.

- [ ] **Step 1: Write the failing tests**

```python
# generator/tests/test_images.py
import os, sys, tempfile, unittest
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, 'generator'))
import generate as g
from descriptions import SETTING_DESCRIPTIONS
from section_meta import SECTION_META
from context_overrides import CONTEXT_OVERRIDES
THEME = os.path.join(ROOT, '.themes', 'universe-empty-3rd')

def touch(p):
    os.makedirs(os.path.dirname(p), exist_ok=True); open(p, 'wb').write(b'\x89PNG')

class ImageLineTest(unittest.TestCase):
    def test_prefix_for_sections_subdir(self):
        with tempfile.TemporaryDirectory() as d:
            touch(os.path.join(d, 'sections', 'x.png'))
            self.assertEqual(g.image_line(d, 'sections', 'sections/x.png', 'X'), '![X](../.gitbook/assets/sections/x.png)\n\n')
            self.assertEqual(g.image_line(d, '', 'sections/x.png', 'X'), '![X](.gitbook/assets/sections/x.png)\n\n')

    def test_missing_file_emits_nothing(self):
        with tempfile.TemporaryDirectory() as d:
            self.assertEqual(g.image_line(d, 'sections', 'sections/nope.png', 'X'), '')

class SectionDocTest(unittest.TestCase):
    def render(self, assets):
        labels = g.load_labels(THEME)
        schema = g.load_schema(os.path.join(THEME, 'sections', 'u-featured-collection.liquid'))
        return g.write_section_doc('u-featured-collection.liquid', schema, SECTION_META['u-featured-collection.liquid'], labels, SETTING_DESCRIPTIONS, CONTEXT_OVERRIDES, assets_dir=assets)

    def test_all_three_families(self):
        with tempfile.TemporaryDirectory() as d:
            touch(os.path.join(d, 'sections', 'featured-collection.png'))
            touch(os.path.join(d, 'editor', 'featured-collection', 'section-settings.png'))
            touch(os.path.join(d, 'editor', 'featured-collection', 'collection.png'))
            touch(os.path.join(d, 'infographics', 'featured-collection', 'shape-divider.png'))
            md = self.render(d)
            self.assertIn('![Featured Collection](../.gitbook/assets/sections/featured-collection.png)', md)
            self.assertIn('(../.gitbook/assets/editor/featured-collection/section-settings.png)', md)
            self.assertIn('(../.gitbook/assets/editor/featured-collection/collection.png)', md)
            self.assertIn('(../.gitbook/assets/infographics/featured-collection/shape-divider.png)', md)
            self.assertLess(md.index('sections/featured-collection.png'), md.index('**On this page**'))
            self.assertLess(md.index('## ⚙️ Section Settings'), md.index('section-settings.png'))
            self.assertLess(md.index('### Collection'), md.index('collection.png'))

    def test_no_assets_dir_is_unchanged(self):
        self.assertNotIn('.gitbook/assets', self.render(None))

    def test_shape_divider_never_gets_editor_capture(self):
        with tempfile.TemporaryDirectory() as d:
            touch(os.path.join(d, 'editor', 'featured-collection', 'shape-divider.png'))
            self.assertNotIn('editor/featured-collection/shape-divider.png', self.render(d))
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python3 -m unittest generator.tests.test_images -v`
Expected: FAIL with `AttributeError: module 'generate' has no attribute 'image_line'`.

- [ ] **Step 3: Implement `image_line` and the emission points in `generate.py`**

Compute `page = output_filename(fname)[:-3]` and `subdir = '' if fname in ROOT_SECTIONS else 'sections'` inside `write_section_doc`. Add a local helper `fig(rel, alt)` that appends `image_line(...)` to `lines` when `assets_dir` is set. Call it at the four emission points from the Interfaces block. Update the call in `main` to pass `assets_dir`.

- [ ] **Step 4: Run all generator tests**

Run: `python3 -m unittest discover -s generator/tests -t . -v`
Expected: PASS, 6 tests.

- [ ] **Step 5: Regenerate and confirm no diff without images**

Run: `python3 generator/generate.py .themes/universe-empty-3rd theme-docs && git status --short theme-docs`
Expected: `Rendered 52 files`, no changes under `theme-docs/` (no assets exist yet).

- [ ] **Step 6: Commit**

```bash
git add generator/generate.py generator/tests/test_images.py
git commit -m "feat(generator): emit image lines when matching assets exist"
```

---

### Task 5: Storefront render into the assets folder

**Files:**
- Create: `pipeline/manifest.json`
- Modify: `pipeline/screenshots.js` (replace the hardcoded `PAGES` map)

**Interfaces:**
- `manifest.json`: `{ "pages": { "<page-slug>": { "path": "/", "type": "featured-collection", "hero": false } } }`. `type` is the liquid name without `u-`; `hero` keeps the floating header visible. Only `featured-collection`, `bold-slideshow` and `reviews-showcase` for Phase 0.
- `STORE_PASSWORD=universe node screenshots.js [page-slug ...]` writes `../theme-docs/.gitbook/assets/sections/<page-slug>.png` through `optimize()` (Task 2). Raw capture stays in `out/sections/<page-slug>.png` for inspection. With no arguments, all manifest pages.

- [ ] **Step 1: Write `manifest.json` with the three Phase 0 pages**

- [ ] **Step 2: Refactor `screenshots.js`**

Read the manifest, group by `path`, keep the existing capture logic (hero rule, clip, 40 px breathing room), then call `optimize(raw, final)` and log both sizes. Delete the final file before capturing so a failed run leaves no stale image.

- [ ] **Step 3: Run for the test page**

Run: `cd pipeline && STORE_PASSWORD=universe node screenshots.js featured-collection`
Expected: a line like `featured-collection  1440x1447 css px -> ... (raw N KB, final M KB)` with M under 300, file at `theme-docs/.gitbook/assets/sections/featured-collection.png`, 1600 px wide. Open it and compare with `out/sections/featured-collection.png` from the proof.

- [ ] **Step 4: Commit**

```bash
git add pipeline/manifest.json pipeline/screenshots.js theme-docs/.gitbook/assets/sections/featured-collection.png
git commit -m "feat(pipeline): storefront renders from a manifest into GitBook assets"
```

---

### Task 6: Annotated editor captures (the spike)

**Files:**
- Create: `pipeline/lib/editor.js`, `pipeline/lib/annotate.js`, `pipeline/editor-shots.js`
- Uses: `pipeline/.auth/shopify.json` (from `node login.js`, Matteo logs in), `generator/anchors.py` (Task 3), `optimize()` (Task 2)

**Interfaces:**
- `openEditor({ themeId, previewPath }) -> { browser, page }` in `lib/editor.js`: launches Chromium with `storageState: '.auth/shopify.json'`, viewport 1600x1100 at 2x, navigates to `https://admin.shopify.com/store/universe-theme-woofy/themes/<themeId>/editor?previewPath=<previewPath>`. Installs a route guard: `page.route(/\/themes\/\d+\/(asset|settings|editor\/save|publish)/i, r => r.abort())` plus `page.on('dialog', d => d.dismiss())`. Throws if the page lands on a login URL (session expired: rerun `login.js`).
- `annotate(page, boxes: {x,y,width,height}[]) -> Promise<void>` in `lib/annotate.js`: injects a fixed-position SVG overlay with one `rect` per box, stroke `#7852fc`, stroke-width 3, rx 8, 6 px of padding around the box, and a 2 px `#7852fc` line from the first box's right edge to the second box's left edge when two boxes are given. `clearAnnotations(page)` removes it.
- `node editor-shots.js <liquid-name> [--theme <id>]` in `editor-shots.js`: runs `anchors.py`, resolves `previewPath` from `manifest.json` (Task 5), deletes `theme-docs/.gitbook/assets/editor/<page>/`, selects the section in the left tree by its `section_label`, annotates tree item plus right panel, screenshots with a clip that starts below the top bar, optimizes to `editor/<page>/section-settings.png`; then for each block with `capture: true`, expands the section in the tree, clicks the block by its label, same capture to `editor/<page>/<anchor>.png`. Logs `MISSING <label>` and continues when an element is not found. Closes the browser without saving.

- [ ] **Step 1: Matteo logs in**

Run: `cd pipeline && node login.js`. Expected: `.auth/shopify.json` exists. (Checkpoint: the PM asks Matteo to do this.)

- [ ] **Step 2: Confirm the theme id and the editor language**

Run: `shopify theme list --store=universe-theme-woofy.myshopify.com`. Expected: the demo theme id (`206989590871` as of 19 October 2026). Then, in a throwaway script using `openEditor`, log `page.url()` and the text of the left panel header. If the UI is Italian, try appending `&locale=en` and, if that does not switch it, report to the PM (Matteo sets the account language to English).

- [ ] **Step 3: Discover selectors with a throwaway probe**

Write `pipeline/probe-editor.js` (keep it, it is useful next round) that opens the editor for `/`, dumps the left tree items (text and bounding boxes) and, after clicking "Featured collection", the right panel bounding box and its first heading. Use `page.getByText(label, { exact: true })` first; fall back to `[aria-label]` or `role=treeitem`. Record what worked as comments at the top of `lib/editor.js`.

- [ ] **Step 4: Implement `lib/editor.js`, `lib/annotate.js`, `editor-shots.js`**

- [ ] **Step 5: Run for the test page**

Run: `cd pipeline && node editor-shots.js u-featured-collection.liquid`
Expected: two files, `theme-docs/.gitbook/assets/editor/featured-collection/section-settings.png` and `.../collection.png`, each 1600 px wide and under 300 KB, no `MISSING` lines. Open both: the top bar is gone, the Purple rectangles sit on the tree item and on the panel, the panel shows the section's settings from the top.

- [ ] **Step 6: Verify the Save guard**

With the editor open in the probe, change a setting value and attempt a programmatic click on the Save button: the guard must abort the request (check `page.on('requestfailed')` logs the save URL). Then close the browser and reopen the editor: the value is back to the original.

- [ ] **Step 7: Commit**

```bash
git add pipeline/lib/editor.js pipeline/lib/annotate.js pipeline/editor-shots.js pipeline/probe-editor.js theme-docs/.gitbook/assets/editor/featured-collection
git commit -m "feat(pipeline): annotated theme editor captures per section and block"
```

---

### Task 7: Infographic renderer and the Color scheme infographic

**Files:**
- Create: `pipeline/render-html.js` (generalizes `banner.js`), `pipeline/infographics/color-scheme.html`
- Modify: `theme-docs/general-settings.md` (hand-written page: add the image line under `## Color scheme`)
- Output: `theme-docs/.gitbook/assets/infographics/general-settings/color-scheme.png`

**Interfaces:**
- `node render-html.js <html> <out.png> [--width 1600] [--height auto]` renders a local HTML file with `deviceScaleFactor: 2`, waits for `document.fonts.ready`, screenshots the `#frame` element (full page when absent), then `optimize()` to 1600 px. Inlines `__LOGO_SVG__` like `banner.js` does. Fonts are referenced relative to `pipeline/brand/tokens.css`.
- `color-scheme.html`: a 1600x900 frame. Left: the five schemes of the theme as cards (read names and default colors from `.themes/universe-empty-3rd/config/settings_data.json` and `settings_schema.json`, `color_schemes`), each showing background, text, button and link swatches. Right: one section mock with the "Section's color palette" dropdown highlighted and arrows showing which swatch drives which element. Title in Figtree, one accent word in Barracuda Lime. Dark violet background, glass shape from `brand/elements/glass-shapes` at low opacity. No em dashes in any text.

- [ ] **Step 1: Implement `render-html.js`**

- [ ] **Step 2: Re-render the banner through it to prove parity**

Run: `cd pipeline && node render-html.js banner-developpy.html out/preview/banner-check.png --width 2560 --height 1440`
Expected: file identical in content to `out/youtube-banner-developpy.png` (visually, size may differ because of optimize).

- [ ] **Step 3: Build `color-scheme.html`** (infographic-designer agent, with the `frontend-design` and `ui-ux-pro-max:brand` skills loaded and `pipeline/brand/BRAND.md` read first)

- [ ] **Step 4: Render it**

Run: `cd pipeline && node render-html.js infographics/color-scheme.html ../theme-docs/.gitbook/assets/infographics/general-settings/color-scheme.png`
Expected: PNG 1600 px wide, under 150 KB. PM opens it and checks brand compliance (palette, fonts, one Lime word, no em dashes).

- [ ] **Step 5: Add the image line by hand to `general-settings.md`**

After the paragraph that ends with "does not affect other sections." under `## Color scheme`, insert `![Color scheme](.gitbook/assets/infographics/general-settings/color-scheme.png)` with a blank line on each side.

- [ ] **Step 6: Commit**

```bash
git add pipeline/render-html.js pipeline/infographics theme-docs/.gitbook/assets/infographics theme-docs/general-settings.md
git commit -m "feat: color scheme infographic and HTML renderer"
```

---

### Task 8: Validator learns about images

**Files:**
- Modify: `.claude/agents/render-validator.md` (add checks 7 and 8)
- Modify: `CLAUDE.md` (cheat sheet: inline image check)

**Interfaces:**
- Check 7 (blocking): every `![...](path)` in `theme-docs/**/*.md` resolves to an existing file relative to the page's directory.
- Check 8 (warning): every file under `theme-docs/.gitbook/assets/` is referenced by at least one page.
- Inline command for `CLAUDE.md`:

```bash
python3 -c "
import re, os
docs='theme-docs'; refs=set(); problems=[]
for root,_,files in os.walk(docs):
    for f in files:
        if not f.endswith('.md'): continue
        p=os.path.join(root,f)
        for m in re.finditer(r'!\[[^\]]*\]\(([^)]+)\)', open(p).read()):
            t=os.path.normpath(os.path.join(root,m.group(1)))
            refs.add(t)
            if not os.path.isfile(t): problems.append(f'{p}: {m.group(1)}')
assets=os.path.join(docs,'.gitbook','assets')
orphans=[os.path.join(r,f) for r,_,fs in os.walk(assets) for f in fs if os.path.join(r,f) not in refs]
print('\n'.join(problems) or 'OK'); print(f'Broken images: {len(problems)}; orphan assets: {len(orphans)}')
for o in orphans: print('  orphan:', o)
"
```

- [ ] **Step 1: Add the checks to the agent file and the command to `CLAUDE.md`**

- [ ] **Step 2: Regenerate and run the check**

Run: `python3 generator/generate.py .themes/universe-empty-3rd theme-docs` then the inline command.
Expected: `OK`, `Broken images: 0; orphan assets: 0`. The diff of `theme-docs/sections/featured-collection.md` shows exactly three new image lines.

- [ ] **Step 3: Run the existing anchor check from `CLAUDE.md`**

Expected: `Total broken anchors: 0`.

- [ ] **Step 4: Commit**

```bash
git add .claude/agents/render-validator.md CLAUDE.md theme-docs/sections/featured-collection.md
git commit -m "docs: image checks in validator, regenerate Featured Collection with images"
```

---

### Task 9: PR, merge, verify live

- [ ] **Step 1: Run the `render-validator` agent on `theme-docs/`**

Expected: no blocking errors.

- [ ] **Step 2: Push and open the PR**

```bash
git push -u origin images-phase-0
gh pr create --base main --head images-phase-0 --title "Images phase 0: Featured Collection test" --body "..."
```

Body lists: what the test proves, the three image families, the generator rule, the validator checks, the decisions from the design doc. Ends with the attribution line from the session.

- [ ] **Step 3: PM reviews the PR diff** (every image opened, Markdown read), then merges

Run: `gh pr merge <n> --rebase --delete-branch`

- [ ] **Step 4: Verify on GitBook live**

Open the Featured Collection page and the General settings page in Chrome (claude-in-chrome) two minutes after merge. Expected: the render under the intro, the two editor captures under Section Settings and Collection, the infographic under Color scheme, all at readable size with no broken image icons. Screenshot each for the session log.

- [ ] **Step 5: Session log and memory**

Append a "Fase 0" section to `docs-internal/2026-10-20-images-design.md` (or a new dated log) with what worked, what did not, the measured sizes and the open points for Phase 1. Update the memory file `project-screenshots-videos.md`.

---

## After Phase 0

Phases 1 to 3 (all storefront renders, all editor captures in batches of 10, the remaining infographics one at a time) get their own plan once the test has answered: deep links, selector stability, image weights, GitBook rendering of git-synced assets.
