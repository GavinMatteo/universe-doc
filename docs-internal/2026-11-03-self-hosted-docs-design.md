# Self-hosted Universe docs on Cloudflare: design

Date: 3 November 2026. Status: approved by Matteo in chat; builder check done, its two
questions settled below (first deploy, indexing).

## Intent

GitBook went down on 2 November 2026 (HTTP 500 on `developpy.gitbook.io/universe-doc-git`
and on every page under it). The whole documentation already lives in this repository, in
`theme-docs/`, so Developpy wants a second rendering of the same Markdown served from its
own Cloudflare account. Today it is a backup. If it holds up, it becomes the primary docs
site and GitBook is dropped. That second step is a separate decision, taken after the site
is live and reviewed.

## Goals

1. A public docs site, built from `theme-docs/` with no hand copy of the content, deployed
   as its own Cloudflare Worker with static assets (same pattern as the Developpy website).
2. Same information architecture as GitBook: the sidebar is `SUMMARY.md`, page titles are
   the SUMMARY labels, page URLs are `/<group-slug>/<file-stem>` exactly as GitBook forms
   them (`/collection-sections/featured-collection`, `/global-sections/header-nav`).
3. Developpy branding throughout: palette, Figtree, logo, rounded cards, purple to dark
   violet gradient used sparingly. Light and dark mode both on brand.
4. Full-text search, mobile layout, in-page table of contents, previous and next links.
5. Rebuild and redeploy on every merge to `main`, like GitBook does today, so the two
   renderings never drift.

## Non-goals

- No change to `theme-docs/` content or to the generator. GitBook stays connected and
  keeps syncing the same folder. If a page needs a tweak to render well on the new site,
  the fix goes in the build script, not in the Markdown.
- No change to the Developpy website project. The docs site is a separate project and a
  separate Worker. The website's `/theme-documentation` redirect is left as is.
- No DNS change in this round. The site goes live on its `workers.dev` URL for review.
  Pointing `docs.developpy.io` (today a Webflow page that iframes GitBook) is a follow-up
  decided by Matteo after review; it is a route change in `wrangler.jsonc` plus removing
  the Webflow DNS record, and the site must not assume either hostname in its code.
- No new content, no redesign of page structure, no analytics, no comments, no i18n.

## Anti-goals

- A site that looks like a stock docs template with a purple accent. The brand must be
  recognisable at a glance (logo, Figtree, Dark Violet ink, Lilac surfaces).
- A second copy of the Markdown that someone has to keep in sync by hand.
- Broken links. Every relative `.md` link and every in-page anchor that works on GitBook
  must work here. The build fails on a link it cannot resolve.
- Em dashes or en dashes anywhere in the site chrome (labels, footer, 404 copy). The
  maintainer's rule applies to all text, see `CLAUDE.md`.

## Constraints and facts

- Content: 66 pages listed in `SUMMARY.md` (15 groups), one README, 47 images under
  `theme-docs/.gitbook/assets/` (6 MB). The Markdown is plain CommonMark with tables, emoji
  in H2 headings, a hand-written "On this page" list of anchor links, and relative links
  between `.md` files. No GitBook hint blocks, no raw HTML, no front matter.
- Anchors: in-page links use the slug algorithm documented in `CLAUDE.md` (lowercase,
  spaces to `-`, any other non `[a-z0-9-]` character to `-`, collapse, trim). The site's
  heading ids must produce the same slug for the same heading text, including headings
  that start with an emoji (`## ⚙️ Section Settings` is `#section-settings`).
- Page titles: `SUMMARY.md` labels win over the Markdown H1 (GitBook convention; the two
  can differ, for example the file `header-nav.md` has H1 "Header and Navigation" and that
  is also its label, but after a rename only the label is guaranteed current).
- Brand kit: `pipeline/brand/` in this repo (`BRAND.md` is the rulebook, `tokens.css` the
  values, `logo/` the SVGs, `fonts/` the woff2 subsets used by the website). Figtree is the
  only webfont; Barracuda appears only inside the logo SVG, never as a text font on the
  site (same rule as the Developpy website).
- Cloudflare: zone `developpy.io` is on Cloudflare, account `6cf5af20f0ddb075dc5eca2bd75a5e0e`,
  wrangler 4.x logged in on this Mac as hello@developpy.io. The website deploys with
  `wrangler deploy` from GitHub Actions using `CLOUDFLARE_API_TOKEN` and
  `CLOUDFLARE_ACCOUNT_ID` secrets; this repo has neither secret yet.
- Tooling on this Mac: node 25, pnpm 10, no global wrangler (use the project's).
- Repository rules: feature branch, PR, rebase merge; GitBook syncs only `theme-docs/`, so
  a new top-level folder is invisible to it.

## Decisions taken

- **Stack**: Astro with the Starlight docs integration. Chosen because the website is
  already Astro, Starlight ships sidebar, search (Pagefind), light and dark theme, mobile
  navigation, table of contents and prev/next links, all themeable through CSS custom
  properties, and it builds to static files that the Worker assets binding serves directly.
- **Location**: `site/` at the top level of this repository. The build reads
  `../theme-docs/` and never writes to it. One repo, one source, one PR per change.
- **Content ingestion**: a build-time script (`site/scripts/sync-content.mjs`, run as the
  first step of `pnpm build` and `pnpm dev`) that produces Starlight's content folder from
  `theme-docs/`:
  - reads `SUMMARY.md`, builds the sidebar groups and the per-page title and URL;
  - copies each `.md` into `src/content/docs/<group-slug>/<stem>.md` with front matter
    (`title` from the SUMMARY label); strips the Markdown H1 since Starlight renders the
    title itself; `README.md` becomes the landing page at `/`;
  - rewrites relative `.md` links to the target page's route and keeps `#anchor`
    fragments; rewrites image paths to `/assets/...`; fails the build on a link whose
    target file is not in SUMMARY;
  - copies `theme-docs/.gitbook/assets/` to `public/assets/`;
  - removes the hand-written "On this page" block (the bold line and the list that
    follows it, up to the `---` rule) because Starlight renders its own table of contents.
    The generated output folder is gitignored; the script is the only writer.
- **Heading ids**: a small rehype plugin in `astro.config.mjs` that implements the
  `make_anchor()` algorithm from `generator/generate.py`, replacing Starlight's default
  slugger, so GitBook-era anchors keep working.
- **URLs**: `/<group-slug>/<stem>` where group-slug is the SUMMARY `##` label slugged with
  the same algorithm, matching GitBook. Trailing-slash handling: none (Starlight default
  `trailingSlash: 'ignore'`, Worker assets `html_handling: "auto-trailing-slash"`).
- **Branding**: a `site/src/styles/brand.css` that maps `pipeline/brand/tokens.css` onto
  Starlight's `--sl-color-*` and `--sl-font` variables. Light theme: white and Lilac tinted
  surfaces, Dark Violet text, Mirtillo links, Purple for the active sidebar item and
  focus rings. Dark theme: Dark Violet background, Lilac text, Purple accent. Figtree
  self-hosted from the brand kit woff2 (copied into `site/public/fonts/`). Logo: the
  Developpy extended logo SVG (dark violet on light, white on dark) in the header, with
  "Universe docs" as the site title next to it. Favicon and apple touch icon from
  `pipeline/brand/logo/`. Tables get the rounded-card treatment (soft border, 12px radius,
  header row on a Lilac tint). Lime is not used anywhere on the site; it is a social
  accent, not a UI colour.
- **Site chrome text**: header title "Universe docs"; a footer line
  "Universe is a Shopify theme by Developpy" linking to developpy.io; a "Edit this page"
  link is off (the Markdown is generated, editing it on GitHub would be wrong); a 404
  page in the same style with a link to the home.
- **Deploy**: `site/wrangler.jsonc` with `name: "universe-docs"`, assets directory
  `dist`, `not_found_handling: "404-page"`, `workers_dev: true`, no routes. No Worker
  script, assets only. First deploy by hand from this Mac to get the `workers.dev` URL;
  then `.github/workflows/deploy-site.yml` that installs, runs the link checks, builds and
  deploys on push to `main` when `site/**` or `theme-docs/**` changed, and uploads a
  preview version on pull requests. The workflow needs `CLOUDFLARE_API_TOKEN` and
  `CLOUDFLARE_ACCOUNT_ID` as repository secrets; Matteo creates the token (Workers Scripts
  edit, same scope as the website's) when the workflow lands. Until they exist the deploy
  job skips with a notice instead of failing, so the PR can go green on day one. The first
  manual deploy from this Mac is in scope: it creates the `universe-docs` Worker and its
  public `workers.dev` URL in the Developpy account, which is what "backup now" means.
- **Indexing**: while the site lives on `workers.dev` it ships `<meta name="robots"
  content="noindex">` and a `robots.txt` that disallows everything, so the backup never
  competes with the GitBook pages in search. A build-time `SITE_URL` environment variable
  (unset by default) switches that around: when set, the Astro `site` is that URL, the
  sitemap and canonical tags are emitted and the noindex meta and robots disallow are
  dropped. The cutover to `docs.developpy.io` sets it in the workflow; nothing else in
  the code changes.
- **Checks that gate a merge**: the sync script's link check, `astro build` succeeding, and
  a post-build scan of `dist/` that every in-page anchor link resolves to an id on the same
  page and every internal href resolves to a built file. These run in CI and locally with
  `pnpm check`.
- **Documentation of the new piece**: `site/README.md` (how to run, how it maps
  `theme-docs/`, how to change the domain) and a short section in the root `CLAUDE.md`
  pointing to it, plus the usual dated session log in `docs-internal/`.

## Left to the builder

- Exact Starlight version and config shape, as long as it is a current stable release.
- How the sync script handles the README's own relative links (they are the same rule as
  any other page).
- Whether the 15 sidebar groups are collapsed or open by default (default to the
  current group open, others collapsed, as GitBook does).
- Code block, blockquote and list styling, within the brand palette.
- The content of the 404 page beyond "page not found" and the home link.
- Order and wording of the CI steps, as long as the gates above all run.

## Review before any DNS change

When the `workers.dev` site is up, Matteo reviews it against GitBook on: the home page,
one page per group, one page with many anchors (`general-settings`), one guide, search for
"swatch", mobile width, dark mode. Only after that review is the `docs.developpy.io`
cutover planned, as its own small change.
