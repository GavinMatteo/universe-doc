# Phase 1 brief: storefront renders for every documented page

Spec: `docs-internal/2026-10-20-images-design.md` (section "Render storefront" and the
revision at the end). Phase 0 built `pipeline/screenshots.js`, `pipeline/manifest.json`,
`pipeline/lib/store.js`, `pipeline/lib/optimize.js`. This phase fills the manifest for all
51 documented pages, extends the capture script for the special cases, and produces a
contact sheet for the PM review.

## Deliverables

1. `pipeline/manifest.json` with one entry per documented page (slugs below). Each entry:
   `path` (storefront path), `type` (liquid name without `u-`, used by the default
   selector), optional `hero` (keep the floating header visible), optional `selector`
   (CSS selector override when the section id does not follow the `__u_<type>` pattern),
   optional `setup` (one of the named actions below), optional `skip` with a `reason`
   string for pages that cannot be captured from the demo store.
2. `pipeline/screenshots.js` extended: honor `selector`, `setup`, `skip` (print `SKIP <slug>: <reason>`,
   never count it as MISSING); keep everything else as it is.
3. `pipeline/contact-sheet.js`: builds `pipeline/out/contact-sheet.png` (and `.html`) with
   every final PNG from `theme-docs/.gitbook/assets/sections/` as a thumbnail (4 per row,
   360 px wide, slug and size in KB under each), using `render-html.js` or Playwright
   directly. The PM reviews this one image first and opens single renders only on doubt.
4. A run log in your report: per slug, final width and KB, or MISSING or SKIP.

## Page to storefront mapping (discovered 20 October on the demo store)

Modular sections on `/` (home), default selector works:
advanced-hero-slideshow (hero true), advanced-product-carousel, best-choice-offer, big-text,
bold-slideshow (hero true), collection-list, comparison-table, diagonal-texts, featured-blog,
featured-collection, featured-data, icon-list, image-with-text, multicolumn,
newsletter-section, promo-banner, reviews-showcase, rich-text, scrolling-pills,
spotlighted-product, sticky-section, then-vs-now, touch-and-take, ugc-carousel.

Elsewhere:
- `/products/beef-bites`: main-product (selector `.shopify-section[id$="__main"]`),
  related-products, scrolling-text, faq.
- `/pages/about`: quotes.
- `/pages/contact`: contacts.
- `/pages/store-locator`: store-locator.
- `/collections/all`: collection-grid-banner (`[id$="__banner"]`), collection-grid-product (`[id$="__product-grid"]`).
- `/collections`: main-collection-list (`[id$="__main"]`).
- `/blogs/news`: blog (`[id$="__main"]`).
- `/blogs/news/dog-paw-care`: article-banner (`[id$="__main-article-banner"]`).
- `/search?q=a`: search (`[id$="__main"]`).
- `/cart`: main-cart-items (`[id$="__main"]`), capture AFTER `setup: "add-to-cart"` so the cart is not empty.
- `/nonexistent-404`: 404 (`[id$="__main-404"]`).
- `/`: header-nav (`[id$="__header"]`, capture the header bar with the mega menu open:
  `setup: "open-menu"` hovers or clicks the first top-level menu item that has a submenu,
  clip = header plus the open panel), footer (`[id*="__u_footer"]`).
- `/`: drawer-cart (`[id$="__drawer-cart"]`, `setup: "open-cart"`: add the first product
  to the cart through the storefront form on `/products/beef-bites`, then open `/` and click
  the cart icon; the clip is the open drawer element itself, not the section box, and the
  stale `quiet()` CSS must not hide the overlay group).
- `/`: popup-newsletter (`[id*="__u_popup_newsletter"]`, `setup: "open-popup"`: clear the
  cookie or localStorage key that suppresses the popup, reload, wait for it to appear; clip
  the popup dialog with its overlay). If the demo never shows it, mark MISSING with the reason.
- `/password` with `setup: "no-gate"`: a fresh context that does NOT enter the password,
  captures password-header (`[id$="__main-password-header"]` or the real id you find) and
  password-footer.
- announcement-bar: the demo has it disabled in the header group (eye icon in the editor).
  Try `[id*="__u_announcement_bar"]`; if absent, `skip` with reason "disabled on the demo store".
- Skip with reason: collage and featured-product ("not placed on the demo store, Phase 2 will
  render them from the editor preview"), custom-liquid ("no visual"), page ("main-page has
  no content on the demo"), article-overlay ("no article uses the overlay template on the demo").
  Verify each skip claim with `discover.js` or a DOM check before writing it.

## Rules

- Never modify the demo store: `add-to-cart` only uses the storefront cart, which is per
  session and disappears with the browser context.
- Delete the final file before capturing (already there). Exit code 1 when anything is MISSING.
- Every final PNG 1600 px wide and under 300 KB; log any over budget.
- Hero sections keep the header; every other capture hides it (already there).
- No em dashes or en dashes anywhere. Commit trailer `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` after a blank line.
- Do not touch `generator/`, `theme-docs/*.md` or regenerate: the PM does that after the review.
- Commit `pipeline/manifest.json`, `pipeline/screenshots.js`, `pipeline/contact-sheet.js`
  and every final PNG under `theme-docs/.gitbook/assets/sections/`. Do not commit `out/`.
