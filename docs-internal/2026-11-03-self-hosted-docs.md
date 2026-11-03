# Self-hosted docs site on Cloudflare (3 November 2026)

## Why

GitBook went down on 2 November 2026 (HTTP 500 on the Universe docs space and every page
under it). The whole documentation already lives in `theme-docs/`, so Developpy now serves
a second rendering of the same Markdown from its own Cloudflare account. Today it is a
backup. If it holds up after review, it can become the primary docs site.

## What was built

An Astro + Starlight site in `site/` renders `theme-docs/` without any hand copy of the
content. The sidebar is `SUMMARY.md`, page titles are the SUMMARY labels, and page URLs
follow the GitBook scheme. It ships Developpy branding, search, a footer and a 404 page.
It is deployed as an assets-only Cloudflare Worker named `universe-docs`.

Pieces:

- Sync script: copies and transforms `theme-docs/` into the Starlight content folder at build time.
- Anchors: heading ids use the same `make_anchor` algorithm as the generator, so in-page links match.
- Link check: a post-build script verifies internal links and anchors in `dist/`.
- Branding: palette, Figtree, logo, light and dark mode.
- Worker: `site/wrangler.jsonc`, first deploy done by hand.
- CI: `.github/workflows/deploy-site.yml` runs `pnpm check` on every PR and push, and deploys.

## Live URL

https://universe-docs.developpy-website.workers.dev

## What is left

1. Add two repository secrets: `CLOUDFLARE_API_TOKEN` (Workers Scripts edit) and
   `CLOUDFLARE_ACCOUNT_ID` (`6cf5af20f0ddb075dc5eca2bd75a5e0e`). Until then the deploy job
   skips with a notice in its summary and only the `check` job gates the PR.
2. Review the site against the checklist in the design doc.
3. Decide the `docs.developpy.io` cutover (a route change in `wrangler.jsonc` plus removing
   the Webflow DNS record).
4. At cutover, set the repository variable `SITE_URL` so canonical URLs and indexing switch on.

## Known small items

- URLs without a trailing slash answer 307 to the slash version. Harmless, but visible in link tools.
- The `/404` route-conflict warning during the build is cosmetic.
- The link check works with an empty allowlist, so any new stale anchor in `theme-docs/` fails the build and must be fixed at the source.
