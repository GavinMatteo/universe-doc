# Self-hosted Universe docs on Cloudflare: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A Starlight site in `site/`, built from `theme-docs/` at build time, branded Developpy, deployed as the `universe-docs` Cloudflare Worker (assets only) with a `workers.dev` URL, rebuilt by GitHub Actions on every merge to `main`.

**Architecture:** A sync script turns `SUMMARY.md` into Starlight's content folder (one `.md` per page with front matter, links rewritten to routes, images under `/assets/`). A rehype plugin ports the generator's `make_anchor()` so GitBook-era anchors keep working. A post-build script scans `dist/` for broken hrefs and anchors. Branding is a single CSS file over Starlight's variables plus logo, fonts and a footer override. Deploy is `wrangler deploy` of `dist/`.

**Tech Stack:** Node 24+, pnpm 10, Astro 7.4, `@astrojs/starlight` 0.42.8, wrangler 4, `node:test` for unit tests, Playwright (already in `pipeline/node_modules`) for screenshots.

**Spec:** `docs-internal/2026-11-03-self-hosted-docs-design.md`

## Global constraints

- Never write into `theme-docs/`. The sync script reads it and nothing else touches it.
- No em dashes or en dashes in any text the site shows or any file this plan creates (code comments included). Use a colon, a comma or two sentences.
- Page URL is `/<group-slug>/<stem>/` where group-slug is `slugify(SUMMARY ## label)` and stem is the file basename without `.md`. `README.md` is `/`.
- Page title is the SUMMARY label, except `README.md` whose title is its own H1 text.
- Heading ids use exactly `make_anchor()` from `generator/generate.py:93-99`: lowercase, spaces to `-`, any other character outside `[a-z0-9-]` to `-`, collapse runs of `-`, trim leading and trailing `-`. No dedupe suffixes (the generator has none).
- Palette (from `pipeline/brand/tokens.css`): Dark Violet `#110B2F`, Mirtillo `#4334B5`, Purple `#7852FC`, Lilac `#DEDCFD`, surface dark `#1a1340`, glass `#1e1747`, surface light `#f4f3fe`, lilac muted `#9693b5`, ink muted `#58546d`. Lime `#E0F568` is never used on the site.
- Figtree is the only webfont, self-hosted from `pipeline/brand/fonts/figtree-variable-latin.woff2`. Barracuda appears only inside the logo SVG.
- All `site/` commands run with pnpm from inside `site/`. The repo root has no package.json; do not add one.
- Branch `feat/self-hosted-docs`, one commit per task, PR at the end, never push to `main`.
- Starlight site code must not reference `docs.developpy.io`, `doc.developpy.io` or any `workers.dev` hostname. The only hostname source is the `SITE_URL` env var.

## Review focus

1. A relative link to a `.md` file that is not in SUMMARY (or a typo) must fail the sync with the source page and the bad link named, not produce a 404. Pinned in Task 3.
2. Headings with emoji, slashes or apostrophes (`⚙️ Section Settings`, `Vendor/SKU`, `What's new`) must get the same id the generator wrote into the "On this page" links, otherwise every section page has dead anchors. Pinned in Task 2 (slugify golden values) and Task 5 (check-dist on the real build).
3. Hand-written pages without an "On this page" block (the guides, changelog, troubleshooting, README) must pass through with only the H1 removed. Pinned in Task 3.
4. SUMMARY labels containing a colon (`Build for success: Fashion`) must survive YAML front matter. Pinned in Task 3 (title is JSON-stringified).
5. Fragment-only links (`#faq`), external `https:` links and links to `README.md` must be left alone, left alone, and mapped to `/` respectively. Pinned in Task 3.

---

## File structure

```
site/
  package.json            scripts: dev, build, preview, check, test, sync, deploy
  pnpm-lock.yaml
  astro.config.mjs        Starlight config, rehype plugin, head (noindex), site from SITE_URL
  tsconfig.json
  .gitignore              node_modules, dist, .astro, src/content/docs (generated)
  README.md               how it works, how to run, how to change the domain
  wrangler.jsonc          assets-only Worker "universe-docs"
  content-overlay/
    404.md                custom 404 page, copied into the generated content last
  scripts/
    lib/slugify.mjs       slugify(text) port of make_anchor
    lib/summary.mjs       parseSummary(text) -> { pages, groups }
    lib/transform.mjs     transformPage(...) -> { route, body } with link rewriting
    sync-content.mjs      the build-time sync (wipe, write pages, copy assets, overlay)
    rehype-anchors.mjs    rehype plugin setting heading ids with slugify
    check-dist.mjs        post-build href and anchor scan over dist/
  src/
    content.config.ts     Starlight docs collection (default loader)
    styles/brand.css      Developpy tokens mapped onto Starlight variables
    components/Footer.astro
    assets/logo-light.svg, logo-dark.svg
    pages/robots.txt.ts   disallow all unless SITE_URL is set
  public/
    fonts/figtree-variable-latin.woff2
    favicon.svg, apple-touch-icon.png
  tests/
    slugify.test.mjs, summary.test.mjs, transform.test.mjs
.github/workflows/deploy-site.yml
CLAUDE.md                 new section "Self-hosted site" pointing to site/README.md
docs-internal/2026-11-03-self-hosted-docs.md   session log (written at the end)
```

Unit tests run with `node --test tests/` from `site/`. Each test imports from `../scripts/lib/`.

---

### Task 1: Starlight scaffold that builds

**Files:**
- Create: `site/package.json`, `site/astro.config.mjs`, `site/tsconfig.json`, `site/.gitignore`, `site/src/content.config.ts`
- Create (temporary, removed in Task 4): `site/src/content/docs/index.md`

**Interfaces:**
- Produces: `pnpm build` in `site/` writes `site/dist/`. `pnpm dev` serves on 4321. `pnpm test` runs `node --test tests/`. Content lives in `site/src/content/docs/`.

- [ ] **Step 1: Create the branch**

```bash
git checkout -b feat/self-hosted-docs
```

- [ ] **Step 2: Scaffold**

Run in the repo root: `pnpm create astro@latest site -- --template starlight --no-install --no-git --skip-houston --typescript strict` (if the installer prompts, choose the minimal Starlight template). Then in `site/`: `pnpm add astro@^7.4.5 @astrojs/starlight@^0.42.8` and `pnpm add -D wrangler@^4`. Delete the template's sample pages and guides; keep only `src/content/docs/index.md` with front matter `title: Universe docs` and one paragraph. Set `"engines": { "node": ">=24" }` and `"packageManager": "pnpm@10.33.2"`. Scripts: `"dev": "astro dev"`, `"build": "astro build"`, `"preview": "astro preview --port 4321"`, `"test": "node --test tests/"`.

`astro.config.mjs` minimal: `starlight({ title: 'Universe docs', editLink: undefined, lastUpdated: false, pagination: true })`. `site/.gitignore`: `node_modules/`, `dist/`, `.astro/`.

- [ ] **Step 3: Build**

Run: `cd site && pnpm build`
Expected: ends with `Complete!` and `site/dist/index.html` exists; `site/dist/404.html` exists (Starlight ships a default 404).

- [ ] **Step 4: Commit**

```bash
git add site
git commit -m "feat(site): Starlight scaffold for the self-hosted docs"
```

---

### Task 2: slugify and SUMMARY parser

**Files:**
- Create: `site/scripts/lib/slugify.mjs`, `site/scripts/lib/summary.mjs`
- Test: `site/tests/slugify.test.mjs`, `site/tests/summary.test.mjs`

**Interfaces:**
- Produces: `slugify(text: string): string`.
- Produces: `parseSummary(text: string): { groups: Array<{ label: string, slug: string, pages: Page[] }>, pages: Page[] }` where `Page = { label: string, file: string, group: string | null, route: string, stem: string }`. `file` is the path exactly as written in SUMMARY (`sections/bold-slideshow.md`). `route` is `/` for `README.md`, else `/${groupSlug}/${stem}/`. `pages` is every page in SUMMARY order including the README (its `group` is `null`). Throws `Error` naming both pages when two pages resolve to the same route.

- [ ] **Step 1: Write the failing slugify tests**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../scripts/lib/slugify.mjs';

test('matches make_anchor golden values', () => {
  assert.equal(slugify('⚙️ Section Settings'), 'section-settings');
  assert.equal(slugify('Vendor/SKU'), 'vendor-sku');
  assert.equal(slugify("What's new"), 'what-s-new');
  assert.equal(slugify('Content and Layout'), 'content-and-layout');
  assert.equal(slugify('Testimonials and social proof'), 'testimonials-and-social-proof');
  assert.equal(slugify('  Hero --- and  slideshows '), 'hero-and-slideshows');
});
```

- [ ] **Step 2: Run, expect failure**

Run: `cd site && pnpm test`
Expected: FAIL, cannot find module slugify.mjs.

- [ ] **Step 3: Implement `slugify` in `site/scripts/lib/slugify.mjs`**

Port `make_anchor()` literally. JavaScript's `toLowerCase()` and Python's `lower()` agree on the characters in these docs; the regex is `[^a-z0-9-]` with the `g` flag, no `u` flag, so each UTF-16 code unit of an emoji becomes a `-` and then collapses, which is what Python does per code point and gives the same result after collapsing.

- [ ] **Step 4: Write the failing summary tests**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseSummary } from '../scripts/lib/summary.mjs';

const sample = `# Table of contents

* [README](README.md)

## Start here

* [Getting Started](getting-started.md)

## Guides

* [Build for success: Fashion](guide-fashion.md)
* [Custom templates](guides/guide-custom-template.md)
`;

test('parses groups and routes', () => {
  const { groups, pages } = parseSummary(sample);
  assert.equal(pages.length, 4);
  assert.deepEqual(pages[0], { label: 'README', file: 'README.md', group: null, route: '/', stem: 'README' });
  assert.equal(groups.length, 2);
  assert.equal(groups[0].slug, 'start-here');
  assert.deepEqual(groups[1].pages[1], {
    label: 'Custom templates', file: 'guides/guide-custom-template.md',
    group: 'Guides', route: '/guides/guide-custom-template/', stem: 'guide-custom-template',
  });
});

test('throws on a route collision', () => {
  const dup = sample + '\n## Start Here\n\n* [Again](other/getting-started.md)\n';
  assert.throws(() => parseSummary(dup), /getting-started/);
});

test('parses the real SUMMARY', () => {
  const real = readFileSync(new URL('../../theme-docs/SUMMARY.md', import.meta.url), 'utf8');
  const { groups, pages } = parseSummary(real);
  assert.equal(groups.length, 15);
  assert.equal(pages.length, 66);
  assert.equal(pages.find(p => p.file === 'sections/featured-collection.md').route, '/collection-sections/featured-collection/');
  assert.equal(pages.find(p => p.file === 'header-nav.md').route, '/global-sections/header-nav/');
});
```

- [ ] **Step 5: Run, expect failure**

Run: `cd site && pnpm test`
Expected: slugify PASS, summary FAIL (module missing).

- [ ] **Step 6: Implement `parseSummary` in `site/scripts/lib/summary.mjs`**

Lines matching `^## (.+)$` open a group; lines matching `^\* \[(.+?)\]\((.+?)\)$` add a page to the current group (or to the README slot when no group is open). Ignore everything else. Use `slugify` for the group slug.

- [ ] **Step 7: Run, expect pass**

Run: `cd site && pnpm test`
Expected: all PASS.

- [ ] **Step 8: Commit**

```bash
git add site/scripts/lib site/tests
git commit -m "feat(site): slugify port and SUMMARY parser"
```

---

### Task 3: Page transform

**Files:**
- Create: `site/scripts/lib/transform.mjs`
- Test: `site/tests/transform.test.mjs`

**Interfaces:**
- Consumes: `Page` and `parseSummary` from Task 2.
- Produces: `transformPage({ page, source, routes }): string` where `source` is the raw Markdown, `routes` is a `Map<string, string>` from SUMMARY file path (`sections/x.md`) to route, and the return value is the complete file content with front matter. Throws `Error` whose message contains the page file and the unresolved link when a relative `.md` link is not in `routes`.
- Produces: `assetRoute(relPath: string): string` is not needed; image rewriting is internal.

Rules the implementation must follow:

- Front matter is `---\ntitle: ${JSON.stringify(title)}\n---\n` where title is `page.label`, or the H1 text when `page.file === 'README.md'`.
- Remove the first line matching `^# ` (and the blank line after it).
- Remove the "On this page" block when present: from the line `**On this page**` through the next line that is exactly `---`, inclusive, plus trailing blank lines. Pages without the block are unchanged.
- Rewrite every Markdown link `[text](target)` whose target does not start with `http://`, `https://`, `mailto:` or `#`:
  - split off `#fragment`;
  - if the path ends in `.gitbook/assets/...` (any `../` or `./` prefix), replace with `/assets/<rest after .gitbook/assets/>`;
  - else resolve the path against the directory of `page.file` with POSIX `path.posix` semantics, look it up in `routes`, replace with the route plus the fragment; throw if absent.
- Image syntax `![alt](path)` goes through the same rewriting (it is a link with a `!` prefix).

- [ ] **Step 1: Write the failing tests**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transformPage } from '../scripts/lib/transform.mjs';

const routes = new Map([
  ['README.md', '/'], ['faq-general.md', '/start-here/faq-general/'],
  ['sections/featured-collection.md', '/collection-sections/featured-collection/'],
  ['sections/bold-slideshow.md', '/hero-and-slideshows/bold-slideshow/'],
]);
const page = { label: 'Featured Collection', file: 'sections/featured-collection.md', group: 'Collection sections', route: '/collection-sections/featured-collection/', stem: 'featured-collection' };

test('strips H1, removes On this page, rewrites links and images', () => {
  const src = `# Featured Collection

Intro with [FAQ](../faq-general.md#shipping) and [Bold](bold-slideshow.md).

![Shot](../.gitbook/assets/sections/featured-collection.png)

**On this page**

- [Section Settings](#section-settings)
  - [Colors](#colors)

---

## ⚙️ Section Settings

Jump to [FAQ](#faq) or [Shopify](https://shopify.com) or [home](../README.md).
`;
  const out = transformPage({ page, source: src, routes });
  assert.ok(out.startsWith('---\ntitle: "Featured Collection"\n---\n'));
  assert.ok(!out.includes('# Featured Collection\n'));
  assert.ok(!out.includes('On this page'));
  assert.ok(out.includes('[FAQ](/start-here/faq-general/#shipping)'));
  assert.ok(out.includes('[Bold](/hero-and-slideshows/bold-slideshow/)'));
  assert.ok(out.includes('![Shot](/assets/sections/featured-collection.png)'));
  assert.ok(out.includes('[FAQ](#faq)'));
  assert.ok(out.includes('(https://shopify.com)'));
  assert.ok(out.includes('[home](/)'));
  assert.ok(out.includes('## ⚙️ Section Settings'));
});

test('page without the block keeps its body', () => {
  const guide = { ...page, label: 'Build for success: Fashion', file: 'guide-fashion.md', route: '/guides/guide-fashion/' };
  const out = transformPage({ page: guide, source: '# Fashion\n\nBody text.\n\n---\n\nMore.\n', routes });
  assert.ok(out.startsWith('---\ntitle: "Build for success: Fashion"\n---\n'));
  assert.ok(out.includes('Body text.\n\n---\n\nMore.'));
});

test('README takes its title from the H1', () => {
  const readme = { label: 'README', file: 'README.md', group: null, route: '/', stem: 'README' };
  const out = transformPage({ page: readme, source: '# Universe theme documentation\n\nHi [FAQ](faq-general.md).\n', routes });
  assert.ok(out.startsWith('---\ntitle: "Universe theme documentation"\n---\n'));
  assert.ok(out.includes('[FAQ](/start-here/faq-general/)'));
});

test('unknown link target throws naming page and link', () => {
  assert.throws(
    () => transformPage({ page, source: '# T\n\n[x](nope.md)\n', routes }),
    (e) => e.message.includes('sections/featured-collection.md') && e.message.includes('nope.md'),
  );
});
```

- [ ] **Step 2: Run, expect failure**

Run: `cd site && pnpm test`
Expected: transform tests FAIL (module missing).

- [ ] **Step 3: Implement `transformPage` in `site/scripts/lib/transform.mjs`**

Link regex: `/(!?)\[([^\]]*)\]\(([^)\s]+)\)/g`. Keep everything else byte-identical.

- [ ] **Step 4: Run, expect pass**

Run: `cd site && pnpm test`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add site/scripts/lib/transform.mjs site/tests/transform.test.mjs
git commit -m "feat(site): page transform with GitBook link rewriting"
```

---

### Task 4: Sync script and full-site build

**Files:**
- Create: `site/scripts/sync-content.mjs`, `site/content-overlay/404.md`
- Modify: `site/package.json` (scripts), `site/.gitignore`
- Delete: `site/src/content/docs/index.md` (now generated)

**Interfaces:**
- Consumes: `parseSummary`, `transformPage`.
- Produces: `pnpm sync` (alias `node scripts/sync-content.mjs`) which, run from `site/`:
  1. resolves `THEME_DOCS = path.resolve('../theme-docs')` and `OUT = path.resolve('src/content/docs')`;
  2. empties `OUT` and `public/assets`;
  3. writes each page to `OUT/<route>index.md`-equivalent, concretely `OUT/index.md` for `/` and `OUT/<group-slug>/<stem>.md` otherwise;
  4. copies `theme-docs/.gitbook/assets/**` to `public/assets/**`;
  5. copies `content-overlay/**` into `OUT/` last (so `content-overlay/404.md` becomes the site's 404);
  6. prints `Synced <n> pages, <m> assets` and exits non-zero on any thrown error.
- `package.json` scripts become `"sync": "node scripts/sync-content.mjs"`, `"prebuild": "pnpm sync"`, `"predev": "pnpm sync"`. `.gitignore` adds `src/content/docs/` and `public/assets/`.

`content-overlay/404.md` content:

```md
---
title: Page not found
template: splash
---

This page does not exist. Go back to the [documentation home](/) or use the search.
```

- [ ] **Step 1: Write the script**

Use `node:fs` (`rmSync`, `mkdirSync`, `cpSync`, `readFileSync`, `writeFileSync`) and `node:path`. Build `routes` as `new Map(pages.map(p => [p.file, p.route]))`.

- [ ] **Step 2: Run the sync**

Run: `cd site && pnpm sync`
Expected: `Synced 66 pages, 47 assets`; `ls src/content/docs` shows `index.md`, `404.md` and 15 group folders; `src/content/docs/collection-sections/featured-collection.md` starts with `title: "Featured Collection"`.

- [ ] **Step 3: Build the full site**

Run: `cd site && pnpm build`
Expected: build completes; `dist/collection-sections/featured-collection/index.html`, `dist/global-sections/header-nav/index.html`, `dist/guides/guide-custom-template/index.html`, `dist/index.html` and `dist/404.html` exist; `grep -c 'Page not found' dist/404.html` is at least 1; `grep -o 'src="/assets/sections/featured-collection.png"' dist/collection-sections/featured-collection/index.html` finds one match.

- [ ] **Step 4: Sidebar from SUMMARY**

In `astro.config.mjs`, import `parseSummary` and the SUMMARY file, and set `sidebar` to one entry per group: `{ label: group.label, collapsed: true, items: group.pages.map(p => ({ label: p.label, link: p.route })) }`. Starlight expands the group of the current page on its own. Also set `pagination: true`. Rebuild and check `dist/collection-sections/featured-collection/index.html` contains the sidebar link text `Bold Slideshow` and the label `Collection sections`.

- [ ] **Step 5: Commit**

```bash
git add site
git commit -m "feat(site): build-time sync of theme-docs into Starlight"
```

---

### Task 5: GitBook-compatible anchors and the dist check

**Files:**
- Create: `site/scripts/rehype-anchors.mjs`, `site/scripts/check-dist.mjs`
- Modify: `site/astro.config.mjs` (`markdown.rehypePlugins`), `site/package.json` (`check` script)

**Interfaces:**
- Produces: `rehypeAnchors` (default export), a unified plugin that walks `h1` to `h6` elements and sets `node.properties.id = slugify(textContent)` when no id is set. It is listed in `markdown.rehypePlugins` so it runs before Astro's own `rehypeHeadingIds`, which keeps an existing id and uses it for the table of contents. Text content is the concatenation of all descendant text nodes.
- Produces: `node scripts/check-dist.mjs` which walks `dist/**/*.html` and, for every `<a href>`: an href starting with `#` must match an `id="..."` in the same file; an href starting with `/` (without a scheme) must resolve to `dist/<path>/index.html` or `dist/<path>` (ignore the fragment, ignore `/assets/` and `/fonts/` which are checked as files, ignore `/pagefind/`). Prints each problem as `<file>: <href>` and `Problems: <n>`, exit code 1 when n > 0.
- `package.json`: `"check": "pnpm build && node scripts/check-dist.mjs && pnpm test"`.

- [ ] **Step 1: Write the plugin and wire it**

`markdown: { rehypePlugins: [rehypeAnchors] }` in `astro.config.mjs`. Use `hast-util-to-string` if already in the dependency tree, otherwise a ten-line recursive text collector.

- [ ] **Step 2: Verify ids on the real build**

Run: `cd site && pnpm build && grep -o 'id="[^"]*"' dist/collection-sections/featured-collection/index.html | head -20`
Expected: contains `id="section-settings"`, `id="content-and-layout"`, `id="blocks"`, `id="faq"`. Also `grep -c 'href="#section-settings"' dist/collection-sections/featured-collection/index.html` is at least 1 (Starlight's table of contents uses the same id).

- [ ] **Step 3: Write check-dist and run it**

Run: `cd site && node scripts/check-dist.mjs`
Expected: `Problems: 0`.

If it reports problems, each one is either a transform bug (fix in Task 3's code, keep the test green) or a real stale anchor in `theme-docs/` that GitBook also breaks. The second kind is not fixed here: list those in the final report for the maintainer and add their exact `file: href` strings to an `ALLOWLIST` array at the top of `check-dist.mjs` with a comment pointing at this plan.

- [ ] **Step 4: Run the full check**

Run: `cd site && pnpm check`
Expected: build, `Problems: 0`, tests PASS.

- [ ] **Step 5: Commit**

```bash
git add site
git commit -m "feat(site): make_anchor heading ids and a post-build link check"
```

---

### Task 6: Developpy branding, footer, 404, indexing switch

**Files:**
- Create: `site/src/styles/brand.css`, `site/src/components/Footer.astro`, `site/src/assets/logo-light.svg`, `site/src/assets/logo-dark.svg`, `site/src/pages/robots.txt.ts`
- Copy: `pipeline/brand/fonts/figtree-variable-latin.woff2` to `site/public/fonts/`, `pipeline/brand/logo/favicon.svg` to `site/public/favicon.svg`, `pipeline/brand/logo/apple-touch-icon.png` to `site/public/apple-touch-icon.png`, `pipeline/brand/logo/logo_darkviolet.svg` to `logo-light.svg`, `pipeline/brand/logo/logo_white.svg` to `logo-dark.svg`
- Modify: `site/astro.config.mjs`

**Interfaces:**
- Consumes: nothing new.
- Produces: `SITE_URL` env var behaviour. In `astro.config.mjs`: `const SITE_URL = process.env.SITE_URL;` then `site: SITE_URL` (undefined when unset), and `head` contains `{ tag: 'meta', attrs: { name: 'robots', content: 'noindex' } }` only when `SITE_URL` is unset, plus `{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } }` always. `favicon: '/favicon.svg'`. `customCss: ['./src/styles/brand.css']`. `logo: { light: './src/assets/logo-light.svg', dark: './src/assets/logo-dark.svg', alt: 'Developpy' }` with `title: 'Universe docs'`. `components: { Footer: './src/components/Footer.astro' }`.
- `src/pages/robots.txt.ts`: GET endpoint returning `User-agent: *\nDisallow: /\n` when `import.meta.env.SITE_URL` is unset, else `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap-index.xml\n`. Read the variable through `process.env.SITE_URL` at build time (static endpoint); pass it in via `vite.define` or simply read `process.env` in the endpoint since it runs at build.

`brand.css` decisions (exact values; the builder chooses everything not listed):

```css
@font-face { font-family: "Figtree"; src: url("/fonts/figtree-variable-latin.woff2") format("woff2"); font-weight: 300 900; font-display: swap; }
:root { --sl-font: "Figtree", ui-sans-serif, system-ui, sans-serif; }
/* dark (Starlight default theme) */
:root {
  --sl-color-accent-low: #2a1f6e; --sl-color-accent: #7852fc; --sl-color-accent-high: #dedcfd;
  --sl-color-white: #ffffff; --sl-color-gray-1: #dedcfd; --sl-color-gray-2: #c9c6ea; --sl-color-gray-3: #9693b5;
  --sl-color-gray-4: #58546d; --sl-color-gray-5: #2b2452; --sl-color-gray-6: #1a1340; --sl-color-black: #110b2f;
}
:root[data-theme="light"] {
  --sl-color-accent-low: #dedcfd; --sl-color-accent: #4334b5; --sl-color-accent-high: #110b2f;
  --sl-color-white: #110b2f; --sl-color-gray-1: #2b2452; --sl-color-gray-2: #58546d; --sl-color-gray-3: #9693b5;
  --sl-color-gray-4: #c9c6ea; --sl-color-gray-5: #dedcfd; --sl-color-gray-6: #f4f3fe; --sl-color-gray-7: #faf9ff; --sl-color-black: #ffffff;
}
```

Plus: active sidebar item background Purple with white text (light and dark); tables with a 1px border in `--sl-color-gray-5`, `border-radius: 12px`, header row background `--sl-color-gray-6`, `border-collapse: separate`; the site title in Figtree weight 600; links Mirtillo in light, Lilac in dark; focus rings Purple. The "Edit page" link does not appear (no `editLink` config). Starlight's `markdown` table styles are overridden by scoping to `.sl-markdown-content table`.

`Footer.astro`:

```astro
---
import Default from '@astrojs/starlight/components/Footer.astro';
---
<Default {...Astro.props}><slot /></Default>
<p class="brand-footer">Universe is a Shopify theme by <a href="https://developpy.io">Developpy</a>.</p>
<style>.brand-footer { margin-top: 1.5rem; font-size: var(--sl-text-sm); color: var(--sl-color-gray-3); }</style>
```

- [ ] **Step 1: Copy the assets and write the CSS, footer, robots endpoint and config changes**

- [ ] **Step 2: Build without SITE_URL and verify**

Run: `cd site && pnpm build && grep -c 'name="robots" content="noindex"' dist/index.html && cat dist/robots.txt && grep -o 'fonts/figtree-variable-latin.woff2' dist/index.html | head -1 && grep -c 'Universe is a Shopify theme by' dist/index.html && ls dist/favicon.svg dist/apple-touch-icon.png dist/fonts/figtree-variable-latin.woff2`
Expected: `1`, robots is `Disallow: /`, the font URL appears, `1`, the three files exist. `ls dist/sitemap-index.xml` must fail (no sitemap without a site URL).

- [ ] **Step 3: Build with SITE_URL and verify**

Run: `cd site && SITE_URL=https://example.org pnpm build && grep -c 'noindex' dist/index.html; cat dist/robots.txt; ls dist/sitemap-index.xml; grep -o '<link rel="canonical" href="[^"]*"' dist/collection-sections/featured-collection/index.html`
Expected: `0` (grep exits 1 with count 0, that is fine), robots is `Allow: /` with the sitemap line, the sitemap exists, canonical is `https://example.org/collection-sections/featured-collection/`.

- [ ] **Step 4: Screenshots for review**

Run: `cd site && pnpm build && (pnpm preview &) && sleep 3 && node -e "
const { chromium } = require('../pipeline/node_modules/playwright');
(async () => { const b = await chromium.launch(); for (const [name, url, dark, w] of [
 ['home-light','http://localhost:4321/',false,1280],['page-dark','http://localhost:4321/collection-sections/featured-collection/',true,1280],
 ['page-mobile','http://localhost:4321/theme-settings/general-settings/',false,390]]) {
 const c = await b.newContext({ viewport: { width: w, height: 900 }, colorScheme: dark ? 'dark' : 'light' }); const p = await c.newPage();
 await p.goto(url); await p.screenshot({ path: '/private/tmp/claude-501/-Users-matteogavin-developpy-universe-docs/524b4ac4-f4c2-4c57-810f-9d5d4b2dce21/scratchpad/shot-' + name + '.png', fullPage: false }); }
 await b.close(); })();" && pkill -f "astro preview"`
Expected: three PNGs in the scratchpad. Look at them: Figtree renders (not a fallback serif or Arial), the logo shows in the header, light mode is white with Dark Violet text, dark mode is Dark Violet with Lilac text, tables have rounded corners, nothing lime. Fix and repeat until true.

- [ ] **Step 5: Full check and commit**

Run: `cd site && pnpm check`
Expected: `Problems: 0`, tests PASS.

```bash
git add site
git commit -m "feat(site): Developpy branding, footer, 404 and indexing switch"
```

---

### Task 7: Cloudflare Worker config, first deploy, README

**Files:**
- Create: `site/wrangler.jsonc`, `site/README.md`
- Modify: `site/package.json` (`deploy` script), `CLAUDE.md` (new section)

**Interfaces:**
- Produces: `pnpm deploy` = `pnpm build && wrangler deploy`. The Worker is named `universe-docs`.

`wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "universe-docs",
  "account_id": "6cf5af20f0ddb075dc5eca2bd75a5e0e",
  "compatibility_date": "2026-10-01",
  "workers_dev": true,
  "preview_urls": true,
  "observability": { "enabled": true },
  // Assets only, no Worker script. The custom domain is added here at cutover
  // (docs-internal/2026-11-03-self-hosted-docs-design.md), together with SITE_URL in CI.
  "assets": {
    "directory": "./dist",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page"
  }
}
```

- [ ] **Step 1: Write the config and the deploy script**

- [ ] **Step 2: Dry run**

Run: `cd site && pnpm build && pnpm exec wrangler deploy --dry-run`
Expected: wrangler lists the assets to upload and no error about a missing `main` (assets-only Workers are valid).

- [ ] **Step 3: Deploy**

Run: `cd site && pnpm exec wrangler deploy`
Expected: output ends with a URL of the form `https://universe-docs.<subdomain>.workers.dev`. Record it.

- [ ] **Step 4: Smoke the live site**

Run (replace URL): `for p in / /collection-sections/featured-collection/ /global-sections/header-nav /guides/guide-custom-template/ /assets/sections/footer.png /robots.txt /does-not-exist; do printf '%s ' "$p"; curl -s -o /dev/null -w '%{http_code}\n' "https://universe-docs.<subdomain>.workers.dev$p"; done`
Expected: `200 200 200 200 200 200 404`. `curl -s .../ | grep -c noindex` is `1`.

- [ ] **Step 5: README and CLAUDE.md**

`site/README.md`: what the folder is, that `theme-docs/` is the only content source and the sync is the only writer of `src/content/docs/`, the commands (`pnpm dev`, `pnpm check`, `pnpm deploy`), the `SITE_URL` switch, the domain cutover recipe (add `{ "pattern": "docs.developpy.io", "custom_domain": true }` under `routes` in `wrangler.jsonc`, remove the Webflow DNS record for `docs` in the Cloudflare zone first, set `SITE_URL=https://docs.developpy.io` in the workflow), and the GitHub secrets the workflow needs. In the root `CLAUDE.md`, add a section `## Self-hosted site (site/)` of five to eight lines after "Internal session log" pointing to `site/README.md`, naming the Worker, the sync rule and the no-write-to-theme-docs rule.

- [ ] **Step 6: Commit**

```bash
git add site/wrangler.jsonc site/README.md site/package.json CLAUDE.md
git commit -m "feat(site): Cloudflare Worker config, first deploy and docs"
```

---

### Task 8: GitHub Actions deploy

**Files:**
- Create: `.github/workflows/deploy-site.yml`

**Interfaces:**
- Consumes: `pnpm check`, `pnpm exec wrangler deploy`, `pnpm exec wrangler versions upload`.

Workflow shape:

- Triggers: `push` to `main` and `pull_request`, both with `paths: ['site/**', 'theme-docs/**', '.github/workflows/deploy-site.yml']`.
- Job `check` (ubuntu-latest, `defaults.run.working-directory: site`): checkout, `pnpm/action-setup@v6`, `actions/setup-node@v7` with `node-version: 24` and `cache: pnpm` and `cache-dependency-path: site/pnpm-lock.yaml`, `pnpm install --frozen-lockfile`, `pnpm check`.
- Job `deploy` (needs `check`, same setup, `pnpm build` then):
  - a step `id: secrets` that writes `has=true` to `$GITHUB_OUTPUT` when both `secrets.CLOUDFLARE_API_TOKEN` and `secrets.CLOUDFLARE_ACCOUNT_ID` are non-empty (compare through `env`, secrets cannot be read in `if`);
  - `Deploy main`: `if: steps.secrets.outputs.has == 'true' && github.event_name == 'push'`, runs `pnpm exec wrangler deploy --message "main ${{ github.sha }}"` with `SITE_URL: ${{ vars.SITE_URL }}` in env (empty today, set at cutover);
  - `Upload preview`: `if: steps.secrets.outputs.has == 'true' && github.event_name == 'pull_request' && github.event.pull_request.head.repo.full_name == github.repository`, runs `pnpm exec wrangler versions upload --preview-alias "pr-${{ github.event.pull_request.number }}"` and appends the preview URL line to `$GITHUB_STEP_SUMMARY` (copy the `grep -E "Version Preview (Alias )?URL"` pattern from the website's `deploy.yml`);
  - `Skipped`: `if: steps.secrets.outputs.has != 'true'`, `echo "Cloudflare secrets not set, deploy skipped" >> "$GITHUB_STEP_SUMMARY"`.

- [ ] **Step 1: Write the workflow**

- [ ] **Step 2: Validate**

Run: `actionlint .github/workflows/deploy-site.yml` if `actionlint` is installed, else `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/deploy-site.yml')); print('yaml ok')"` and `grep -c "working-directory: site" .github/workflows/deploy-site.yml`.
Expected: no errors; the grep is at least 1.

- [ ] **Step 3: Commit, push, open the PR**

```bash
git add .github/workflows/deploy-site.yml
git commit -m "ci: build, check and deploy the self-hosted docs site"
git push -u origin feat/self-hosted-docs
gh pr create --base main --head feat/self-hosted-docs --title "Self-hosted docs site on Cloudflare (site/)" --body "..."
```

PR body: the design doc path, the `workers.dev` URL, what runs in CI, the two secrets Matteo must add (`CLOUDFLARE_API_TOKEN` with Workers Scripts edit, `CLOUDFLARE_ACCOUNT_ID` = `6cf5af20f0ddb075dc5eca2bd75a5e0e`) and the fact that until then the deploy job skips. Expected: the `check` job goes green on the PR; the deploy job reports "skipped" in its summary.

- [ ] **Step 4: Session log**

Write `docs-internal/2026-11-03-self-hosted-docs.md`: what was built, the live URL, the allowlisted stale anchors from Task 5 if any, what is left (secrets, review, cutover). Commit on the same branch before merge.

---

## Self-review notes

- Spec coverage: goals 1 to 5 map to Tasks 4, 2 and 4, 6, 1 and 6, 8. Non-goals hold (no writes to `theme-docs/`, no website change, no DNS). Anti-goals: brand in Task 6, single source in Task 4, link gate in Tasks 3 and 5, no dashes in global constraints. Review checklist for Matteo is in the design doc, not a task.
- Names used across tasks: `slugify`, `parseSummary`, `Page`, `transformPage`, `routes`, `rehypeAnchors`, `check-dist.mjs`, `SITE_URL`, `universe-docs`. Consistent.
- Open risk noted for the builder: if `wrangler versions upload` rejects an assets-only Worker, drop the preview step and say so in the PR body; main deploy is the one that matters.
