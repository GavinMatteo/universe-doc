# Universe Docs — context for Claude

This file is auto-loaded by Claude Code at the start of every session. Read it before touching anything.

## What this repo is

Documentation for the **Universe** Shopify theme by Developpy. The repo has two layers:

1. **`generator/`** — Python (stdlib only) that reads a Shopify theme export and produces Markdown.
2. **`theme-docs/`** — the Markdown that GitBook publishes, synced via the GitHub integration.

Maintainer: **Matteo Gavin** (info@matteogavin.it). Prefers Italian in conversation, English in committed content.

GitHub: https://github.com/GavinMatteo/universe-doc
GitBook: docs live, syncs `theme-docs/` from `main` on every push.

## The single source of truth

The rendered Markdown for **sections** is generated, not hand-edited. The hand-edited inputs that feed the generator live in `generator/`:

- `descriptions.py` → `SETTING_DESCRIPTIONS` dict, keyed by Shopify setting `id` (e.g. `color_scheme`, `floating_header`). One value per setting, single sentence or two, neutral indicative present.
- `section_meta.py` → `SECTION_META` dict, keyed by section liquid filename (e.g. `'u-bold-slideshow.liquid'`). Value is a 5-tuple `(title, intro, when_to_use, tips, faq)`. This is the editorial content.
- `context_overrides.py` → `CONTEXT_OVERRIDES` dict, for settings whose meaning depends on where they appear. Key is `'file.liquid'` or `'file.liquid::block_type'`.

Hand-edited Markdown pages that the generator does **not** touch (and never should):

- `theme-docs/README.md` (curated landing page)
- `theme-docs/SUMMARY.md` (owned by GitBook — see caveat below)
- `theme-docs/getting-started.md`, `support.md`, `faq-general.md`, `troubleshooting.md`, `changelog.md`
- `theme-docs/general-settings.md` (cross-section concept reference)
- `theme-docs/guide-*.md` and `theme-docs/guides/**`

## Workflow when the theme changes

1. **Pull the latest theme** from the connected Shopify dev store:
   ```bash
   shopify theme pull --store=universe-theme-woofy.myshopify.com \
     --theme=202897129815 --path=.themes/universe-empty-2nd --nodelete
   ```
   Theme **202897129815** is *Universe - 1.0 (Empty) NO TOUCH - Second review* — the reference empty version with the latest schema. Note the `--path` must already exist: `mkdir -p` it first, or the CLI errors out. The store has a `/password` gate; the password is currently `universe` (will become public soon).

2. **Diff the schema** against curated sources. Use the `schema-differ` subagent (see `.claude/agents/schema-differ.md`). It reports new sections, new settings, missing descriptions, stale entries.

3. **Write the missing copy**. Use the `description-writer` agent for `descriptions.py` / `context_overrides.py` entries; use the `section-meta-curator` agent for `section_meta.py` intro/tips/FAQ for new sections.

4. **Regenerate**:
   ```bash
   python3 generator/generate.py .themes/universe-empty-2nd theme-docs
   ```
   Expect output like `Rendered 52 files`. System sections without schema (`u-predictive-search.liquid`, `u-main-quick-add.liquid`) are intentionally skipped.

5. **Validate** with the `render-validator` agent (or the inline check pattern below). Must produce 0 broken anchors and resolvable SUMMARY links before push.

6. **Branch + PR + merge** — never push straight to `main`. Every merge to `main` triggers GitBook sync (live within a few minutes), so the PR is the safety net. Use `gh pr create` then `gh pr merge <n> --rebase --delete-branch`.

## Custom subagents

Four agents live in `.claude/agents/` and are versioned with the repo. Future sessions can invoke them by `subagent_type` directly. They are:

- **`schema-differ`** (read-only): compares a theme export against `generator/*.py` and reports the deltas. Use when a new theme is pulled.
- **`description-writer`**: writes / rewrites entries in `descriptions.py` and `context_overrides.py`. Tone is calibrated to existing entries — read the agent file before invoking for the exact rules.
- **`section-meta-curator`**: writes / updates the 5-tuple in `section_meta.py` for a section.
- **`render-validator`** (read-only): the pre-push gate. Checks SUMMARY links, internal anchors, H2 emoji convention, orphan files.

Custom agents are picked up at Claude Code session start. If you created an agent in the same session, it won't be selectable by name until restart — fall back to `general-purpose` with the agent file's instructions inlined into the prompt.

## Section file routing

The generator routes section liquid files to two output locations:

- **`theme-docs/`** (root): global chrome (announcement bar, drawer cart, footer, header, popup newsletter) and page templates (`main-*.liquid` like main-product, main-blog, main-cart-items, plus collection-grid, password pages, search, 404).
- **`theme-docs/sections/`**: every other modular section (the 33 things merchants add to pages).

The router is `ROOT_SECTIONS` (set) + `output_filename()` (string transform) in `generate.py`. If you add a new section to the theme that should live at root, add its filename to `ROOT_SECTIONS`.

## Slug / anchor algorithm

`make_anchor()` in `generate.py` produces in-page anchors from heading text:

1. lowercase
2. replace spaces with `-`
3. replace non-`[a-z0-9-]` with `-` (not strip — this is the May 2026 fix)
4. collapse runs of `-`
5. trim leading/trailing `-`

This handles `"Vendor/SKU"` → `vendor-sku` and `"⚙️ Section Settings"` → `section-settings`. GitBook's runtime slug logic may differ slightly for apostrophes (`'`) and slashes (`/`); spot-check on live after first sync.

## Important caveats

### SUMMARY.md is owned by GitBook
The first sync after going live, GitBook reformats `SUMMARY.md` (title becomes `# Table of contents`, hierarchy flattens, blank lines added). If you push a hand-edited or generator-produced SUMMARY, GitBook will overwrite it on the next sync. **Add new menu entries from the GitBook editor**, not from this repo. The generator does not currently produce SUMMARY.md.

### Dev store password gate
`universe-theme-woofy.myshopify.com` is behind a Shopify password gate. The password is currently `universe`. The maintainer plans to make the store public; until then, any script that fetches storefront pages needs to dismiss the gate. The pattern is documented in commit `976f3e5` (now reverted but in history) for future reference.

### Theme IDs on this dev store
Theme IDs change between review rounds — always run `shopify theme list --store=universe-theme-woofy.myshopify.com` before pulling, do not trust the IDs below blindly.

As of 27 August 2026 (Second Review round):

- **202944479575** *Universe 1.0 - Demo Store - Second Review* (role: live) — demo content, use for visual references and screenshots
- **202897129815** *Universe - 1.0 (Empty) NO TOUCH - Second review* (role: unpublished) — empty version, **this is the reference for schema and docs**
- **200863809879** *Work In Progress - v1.0.1* (role: unpublished) — active development, schema may be unstable
- **201548300631** / **201549480279** — First Review round, superseded

The live demo and the empty NO TOUCH of the same round have **identical** `sections/*.liquid`, `snippets/` and `locales/`; they differ only in the content JSON (`header-group.json`, `footer-group.json`, `overlay-group.json`). Either can be used for schema; the empty one is the convention.

The pre-Second-Review IDs (199004782935, 198939607383, 198520176983) no longer exist on the store.

### `.themes/` and `.venv/`
Both are gitignored. `.themes/` holds theme exports from `shopify theme pull`. `.venv/` is reserved for the Python virtualenv if needed (Playwright experiment used it but the pipeline was reverted; current generator has zero external deps).

### Theme labels with typos
The theme's own locale file occasionally has typos (e.g. `"Bottom bext"` for the bottom-text block name). Fix these from our side via the `ITALIAN_OVERRIDES` dict at the top of `generate.py`. The dict name is historical — it now serves any theme-side label override. Don't rename it casually; existing entries (`messages_type`, `marquee_message`, `bottom-text-block`) are key-stable.

### Duplicates in `descriptions.py`
Two keys appear twice in the dict with slightly different descriptions: `enable_breadcrumbs_collection` and `enable_breadcrumbs_product`. Python keeps the last write so this is not a runtime bug, but worth cleaning up if you're already in the file. Not in scope of the May 2026 refresh.

## Common commands cheat sheet

```bash
# Pull latest theme (empty reference)
shopify theme pull --store=universe-theme-woofy.myshopify.com \
  --theme=202897129815 --path=.themes/universe-empty-2nd --nodelete

# Regenerate docs from the pulled theme
python3 generator/generate.py .themes/universe-empty-2nd theme-docs

# Quick local broken-anchor check (inline, no agent)
python3 -c "
import re, os
problems = []
for root, _, files in os.walk('theme-docs'):
    for f in files:
        if not f.endswith('.md'): continue
        path = os.path.join(root, f); content = open(path).read()
        headings = {}
        for m in re.finditer(r'^(#{1,6})\s+(.+?)\$', content, re.MULTILINE):
            slug = re.sub(r'-+','-', re.sub(r'[^a-z0-9-]','-', m.group(2).strip().lower().replace(' ','-'))).strip('-')
            headings[slug] = m.group(2)
        for m in re.finditer(r'\]\(#([a-z0-9-]+)\)', content):
            if m.group(1) not in headings: problems.append(f'{path}: #{m.group(1)}')
print('OK' if not problems else '\n'.join(problems))
print(f'Total broken anchors: {len(problems)}')
"

# Create feature branch, commit, push, open PR, merge
git checkout -b <branch-name>
# ... edit, regenerate ...
git add <files> && git commit -m "..."
git push -u origin <branch-name>
gh pr create --base main --head <branch-name> --title "..." --body "..."
gh pr merge <pr-number> --rebase --delete-branch
```

## What history this AI should care about

The **May 2026 refresh** (commits `f7ecb9c` through `1e0028b`) brought the generator from a scaffold-only state (just printed `"Generator script structure ready"`) to a usable end-to-end pipeline, plus 41 new setting descriptions covering Floating Header, Labels typography, Breadcrumbs (blog), Gift Card, Social Media (16 networks + share_email), and assorted cart/product additions. PR #2 fixed a theme-side typo (`"Bottom bext"`). PR #3 experimented with screenshot embedding via Playwright and was reverted (PR #4) as a test.

Detailed session log: `.claude/sessions/2026-05-21.md` (local, not committed).

The **August 2026 Second Review sync** aligned the docs with the reworked theme: 2 new settings (`menu_open_trigger`, `gift_card_color_scheme`), 9 section renames (label-only — liquid filenames and therefore all `.md` page names are unchanged), and a changed multi-currency behaviour for the free shipping threshold. Full record in `docs-internal/2026-08-27-sync-second-review.md`. Most of the theme's schema churn that round was `default` color-scheme renumbering, which the generator does not render — when diffing, filter `default` changes out or the signal drowns.

## Internal session log

`docs-internal/` holds one Markdown file per documentation-update session (what changed, why, what is left to do by hand). **GitBook syncs only `theme-docs/`**, so nothing in `docs-internal/` is ever published — it lives on GitHub and locally only. Add a new dated file there at the end of each update round.

## When in doubt

- Hand-written guides go in `theme-docs/` root or `theme-docs/guides/` — never overwrite from the generator.
- Internal notes and session logs go in `docs-internal/` — never in `theme-docs/`.
- New custom agents go in `.claude/agents/` (versioned).
- New theme exports go in `.themes/` (gitignored).
- Markdown table cells must never be empty in the "What it does" column — that means a setting has no description, which is a bug. The render check above does not catch this; grep `'\|\s*\*\*[^|]+\*\*\s*\|\s*\|$'` if you want to verify.
