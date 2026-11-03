# Universe docs site

A self-hosted copy of the Universe theme documentation, built with Astro and Starlight and served by a Cloudflare Worker (assets only) named `universe-docs`. It runs next to GitBook as a backup and is the planned replacement for `docs.developpy.io`.

## Content source

`../theme-docs/` is the only content source. `scripts/sync-content.mjs` reads `theme-docs/SUMMARY.md` and is the only writer of `src/content/docs/` and `public/assets/`; both are gitignored and rebuilt on every `pnpm dev` and `pnpm build`. Never edit them, and never write into `theme-docs/` from this folder. To change a page, change `theme-docs/` (or the generator) as usual.

## How `theme-docs/` maps to the site

- URL is `/<slug of the SUMMARY ## label>/<file stem>/`, and `README.md` is `/`. Renaming a group in `SUMMARY.md` therefore changes every URL in it.
- The page title is the SUMMARY label.
- The H1 and the "On this page" block of each Markdown file are stripped, because Starlight renders both.
- Nested SUMMARY entries are not supported; the sync fails with a message quoting the line.
- A sync error "unresolved link" means: fix the link in `theme-docs/`, or add the target page to SUMMARY.
- A `check-dist` failure means a stale anchor or image: fix it at the source. `ALLOWLIST` in `scripts/check-dist.mjs` is the last resort.

## Look

Light only, styled like GitBook with the light-section tokens of the Developpy website. There is no dark mode and no theme toggle: `src/components/ThemeProvider.astro` forces `data-theme="light"` and `src/components/ThemeSelect.astro` is empty, both wired in through Starlight's `components` overrides. The page also declares `color-scheme: light`, and code blocks use a single light theme. All styling lives in `src/styles/brand.css`; the logo is `src/assets/logo.svg` (Dark Violet).

## Commands

Run all of them from inside `site/`.

- `pnpm dev`: sync the content and start the dev server.
- `pnpm check`: build, scan `dist/` for broken links and anchors, run the tests. Must be green before a PR.
- `pnpm deploy:worker`: build and run `wrangler deploy` to the Developpy Cloudflare account.

Wrangler is a dev dependency and needs `wrangler login` once, or `CLOUDFLARE_API_TOKEN` in the environment; use `pnpm exec wrangler ...` for anything else.

## Indexing switch: `SITE_URL`

Without the `SITE_URL` environment variable the build ships `<meta name="robots" content="noindex">` and a `robots.txt` that disallows everything, so the `workers.dev` copy never competes with GitBook in search. With `SITE_URL` set (for example `https://docs.developpy.io`) the build uses it as the Astro `site`, emits the sitemap and canonical tags, and drops the noindex and the disallow.

## Live URL

The first deploy is at `https://universe-docs.developpy-website.workers.dev`. Paths without a trailing slash answer 307 to the slash form; that is the `auto-trailing-slash` behaviour, not an error.

## Domain cutover to docs.developpy.io

Do this only after the review described in `docs-internal/2026-11-03-self-hosted-docs-design.md`.

1. In the Cloudflare zone for `developpy.io`, remove the Webflow DNS record for `docs`. `docs.developpy.io` serves nothing between this step and the deploy that adds the custom domain, so prepare the PR first and remove the record right before merging. Rollback is re-adding the record.
2. In `wrangler.jsonc`, add `"routes": [{ "pattern": "docs.developpy.io", "custom_domain": true }]`.
3. Set the repository variable `SITE_URL` to `https://docs.developpy.io` so the workflow builds with indexing on.
4. Merge; the workflow deploys and Cloudflare provisions the certificate.
5. After cutover, local deploys need `SITE_URL=https://docs.developpy.io pnpm deploy:worker`, otherwise a noindex build goes live.

## CI secrets

The deploy workflow needs two repository secrets:

- `CLOUDFLARE_API_TOKEN`: a token with the Workers Scripts edit permission.
- `CLOUDFLARE_ACCOUNT_ID`: `6cf5af20f0ddb075dc5eca2bd75a5e0e`.

Until they exist the deploy job skips with a notice instead of failing. `SITE_URL` is a repository variable, set at cutover.
