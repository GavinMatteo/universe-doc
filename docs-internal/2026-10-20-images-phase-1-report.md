# Phase 1 report: storefront renders

Commit `8ab4077` on `images-phase-1` (not pushed). Result: 46 captured, 5 skipped, 0 missing, 0 over budget. Exit code 0.

## What changed

- `pipeline/manifest.json`: 51 entries, one per generated doc page (checked against `theme-docs/*.md` and `theme-docs/sections/*.md`: identical set).
- `pipeline/screenshots.js`: honors `selector`, `setup`, `skip` and a new optional `maxHeight` (css px crop for long listings). Default pages keep the original grouped-by-path capture logic unchanged. Setup pages each run in a fresh browser session so carts and cookies never leak. Setups: `add-to-cart`, `open-menu`, `open-cart`, `open-popup`. Prints `SKIP <slug>: <reason>`, `MISSING <slug>: <reason>`, and a final count line plus an over-budget list. Over 300 KB triggers a second optimize pass (quality 50, no dither). Exit code 1 if anything is MISSING.
- Default clip fix: headings that are not painted (inside a fixed modal, or clipped by a collapsed overflow container such as a closed accordion) no longer extend the clip. This was making main-product leak 380 px of the next section.
- `pipeline/lib/store.js`: `quiet(page, { keepPopup })`; also hides `.js-product-sticky-form` (sticky add-to-cart bar that covered every product-page capture).
- `pipeline/lib/optimize.js`: optional `quality` and `dither` (defaults unchanged: 80, 1).
- `pipeline/contact-sheet.js`: new; writes `pipeline/out/contact-sheet.html` and `.png` (4 per row, 360 px, slug plus WxH and KB, over-budget sizes in red), brand tokens.
- `pipeline/probe-storefront.js`: new, reusable: lists section ids per path (`--no-gate` for a session without the password).

## Probe findings (deviations from the brief)

- **page is NOT a skip.** main-page renders with content on `/pages/size-chart` (also shipping-policy, return-policy). Captured from size-chart (compact table, 696 css px).
- **password pages: no "no-gate" setup needed.** The dev store gate is Shopify's generic password page (no theme sections at all). After entering the password, `/password` renders the theme's password template with static sections `#shopify-section-main-password-header` and `#shopify-section-main-password-footer`. Captured from the normal session.
- **contacts** id is `__contacts` (not `__u_contacts`) on `/pages/contact`: selector override.
- **announcement-bar**: absent from the header group on the demo (only `__header` present). Skip confirmed.
- **article-overlay**: all 10 articles render `main-article-banner` only. Skip confirmed.
- **collage, featured-product, custom-liquid**: scanned home, all 9 pages from the sitemap, all 26 products, collections, blog, cart, search, 404: none present. Skips confirmed.
- **popup**: suppressed by cookie `newsletterClosed`, opens after `data-delay` = 15 s. Setup clears the cookie and waits for `.js-popup-newsletter.is-active` (40 s timeout). Every other session sets the cookie up front.
- **drawer**: `.js-cart-opener` in the header; open state `.js-cart-drawer-wrap.is-open`. Clip = the drawer panel plus its upsell panel to the left, full viewport height. Item added via `/cart/add.js` on beef-bites (storefront Ajax cart, per session, equivalent to the form; nothing written to the store).
- **mega menu**: `menu_open_trigger` defaults to click; hover does not open. Setup hovers, then clicks the first top-level submenu activator if still closed, checks `aria-expanded` and that the URL did not change. Clip = header to panel bottom + 16 px.

## Run log (final full run)

```
SKIP announcement-bar: disabled in the header group on the demo store
SKIP collage: not placed on the demo store, Phase 2 will render it from the editor preview
SKIP featured-product: not placed on the demo store, Phase 2 will render it from the editor preview
SKIP custom-liquid: no visual
SKIP article-overlay: no article uses the overlay template on the demo store
404                      1440x383 css px -> 1600x424 ../theme-docs/.gitbook/assets/sections/404.png (raw 66 KB, final 16 KB)
advanced-hero-slideshow  1440x1325 css px -> 1600x1472 ../theme-docs/.gitbook/assets/sections/advanced-hero-slideshow.png (raw 625 KB, final 84 KB)
advanced-product-carousel 1440x789 css px -> 1600x876 ../theme-docs/.gitbook/assets/sections/advanced-product-carousel.png (raw 562 KB, final 78 KB)
best-choice-offer        1440x1407 css px -> 1600x1562 ../theme-docs/.gitbook/assets/sections/best-choice-offer.png (raw 1000 KB, final 228 KB)
big-text                 1440x352 css px -> 1600x390 ../theme-docs/.gitbook/assets/sections/big-text.png (raw 117 KB, final 19 KB)
bold-slideshow           1440x1212 css px -> 1600x1346 ../theme-docs/.gitbook/assets/sections/bold-slideshow.png (raw 1593 KB, final 232 KB)
collection-list          1440x744 css px -> 1600x827 ../theme-docs/.gitbook/assets/sections/collection-list.png (raw 1093 KB, final 181 KB)
comparison-table         1440x865 css px -> 1600x960 ../theme-docs/.gitbook/assets/sections/comparison-table.png (raw 344 KB, final 56 KB)
diagonal-texts           1440x620 css px -> 1600x689 ../theme-docs/.gitbook/assets/sections/diagonal-texts.png (raw 225 KB, final 31 KB)
featured-blog            1440x1224 css px -> 1600x1360 ../theme-docs/.gitbook/assets/sections/featured-blog.png (raw 2353 KB, final 244 KB (second pass q50))
featured-collection      1440x1447 css px -> 1600x1608 ../theme-docs/.gitbook/assets/sections/featured-collection.png (raw 1134 KB, final 193 KB)
featured-data            1440x919 css px -> 1600x1020 ../theme-docs/.gitbook/assets/sections/featured-data.png (raw 190 KB, final 46 KB)
icon-list                1440x231 css px -> 1600x257 ../theme-docs/.gitbook/assets/sections/icon-list.png (raw 72 KB, final 19 KB)
image-with-text          1440x970 css px -> 1600x1078 ../theme-docs/.gitbook/assets/sections/image-with-text.png (raw 1022 KB, final 175 KB)
multicolumn              1440x835 css px -> 1600x927 ../theme-docs/.gitbook/assets/sections/multicolumn.png (raw 2247 KB, final 263 KB (second pass q50))
newsletter-section       1440x323 css px -> 1600x359 ../theme-docs/.gitbook/assets/sections/newsletter-section.png (raw 79 KB, final 20 KB)
promo-banner             1440x710 css px -> 1600x788 ../theme-docs/.gitbook/assets/sections/promo-banner.png (raw 2091 KB, final 246 KB)
reviews-showcase         1440x787 css px -> 1600x873 ../theme-docs/.gitbook/assets/sections/reviews-showcase.png (raw 241 KB, final 62 KB)
rich-text                1440x222 css px -> 1600x246 ../theme-docs/.gitbook/assets/sections/rich-text.png (raw 53 KB, final 13 KB)
scrolling-pills          1440x683 css px -> 1600x759 ../theme-docs/.gitbook/assets/sections/scrolling-pills.png (raw 195 KB, final 43 KB)
spotlighted-product      1440x905 css px -> 1600x1006 ../theme-docs/.gitbook/assets/sections/spotlighted-product.png (raw 1055 KB, final 193 KB)
sticky-section           1440x2714 css px -> 1600x3014 ../theme-docs/.gitbook/assets/sections/sticky-section.png (raw 623 KB, final 109 KB)
then-vs-now              1440x951 css px -> 1600x1056 ../theme-docs/.gitbook/assets/sections/then-vs-now.png (raw 2696 KB, final 204 KB (second pass q50))
touch-and-take           1440x867 css px -> 1600x963 ../theme-docs/.gitbook/assets/sections/touch-and-take.png (raw 1582 KB, final 224 KB)
ugc-carousel             1440x593 css px -> 1600x658 ../theme-docs/.gitbook/assets/sections/ugc-carousel.png (raw 2443 KB, final 268 KB (second pass q50))
footer                   1440x1294 css px -> 1600x1437 ../theme-docs/.gitbook/assets/sections/footer.png (raw 263 KB, final 57 KB)
main-product             1440x2386 css px -> 1600x2651 ../theme-docs/.gitbook/assets/sections/main-product.png (raw 1301 KB, final 260 KB)
related-products         1440x892 css px -> 1600x991 ../theme-docs/.gitbook/assets/sections/related-products.png (raw 787 KB, final 165 KB)
scrolling-text           1440x139 css px -> 1600x154 ../theme-docs/.gitbook/assets/sections/scrolling-text.png (raw 41 KB, final 11 KB)
faq                      1440x808 css px -> 1600x897 ../theme-docs/.gitbook/assets/sections/faq.png (raw 131 KB, final 29 KB)
quotes                   1440x726 css px -> 1600x807 ../theme-docs/.gitbook/assets/sections/quotes.png (raw 87 KB, final 18 KB)
contacts                 1440x870 css px -> 1600x966 ../theme-docs/.gitbook/assets/sections/contacts.png (raw 133 KB, final 27 KB)
store-locator            1440x1291 css px -> 1600x1434 ../theme-docs/.gitbook/assets/sections/store-locator.png (raw 2003 KB, final 210 KB (second pass q50))
page                     1440x696 css px -> 1600x772 ../theme-docs/.gitbook/assets/sections/page.png (raw 92 KB, final 20 KB)
collection-grid-banner   1440x600 css px -> 1600x667 ../theme-docs/.gitbook/assets/sections/collection-grid-banner.png (raw 1477 KB, final 235 KB)
collection-grid-product  1440x1400 css px -> 1600x1556 ../theme-docs/.gitbook/assets/sections/collection-grid-product.png (raw 2366 KB, final 212 KB (second pass q50))
main-collection-list     1440x1140 css px -> 1600x1267 ../theme-docs/.gitbook/assets/sections/main-collection-list.png (raw 2370 KB, final 225 KB (second pass q50))
blog                     1440x1230 css px -> 1600x1367 ../theme-docs/.gitbook/assets/sections/blog.png (raw 2723 KB, final 280 KB (second pass q50))
article-banner           1440x600 css px -> 1600x667 ../theme-docs/.gitbook/assets/sections/article-banner.png (raw 1131 KB, final 257 KB)
search                   1440x1400 css px -> 1600x1556 ../theme-docs/.gitbook/assets/sections/search.png (raw 1757 KB, final 162 KB (second pass q50))
password-header          1440x455 css px -> 1600x506 ../theme-docs/.gitbook/assets/sections/password-header.png (raw 94 KB, final 23 KB)
password-footer          1440x238 css px -> 1600x263 ../theme-docs/.gitbook/assets/sections/password-footer.png (raw 38 KB, final 6 KB)
main-cart-items          1440x698 css px -> 1600x776 ../theme-docs/.gitbook/assets/sections/main-cart-items.png (raw 153 KB, final 30 KB)
header-nav               1440x394 css px -> 1600x438 ../theme-docs/.gitbook/assets/sections/header-nav.png (raw 780 KB, final 103 KB)
drawer-cart              870x900 css px -> 1600x1655 ../theme-docs/.gitbook/assets/sections/drawer-cart.png (raw 253 KB, final 106 KB)
popup-newsletter         1440x900 css px -> 1600x1000 ../theme-docs/.gitbook/assets/sections/popup-newsletter.png (raw 1765 KB, final 260 KB)

46 captured, 5 skipped, 0 missing
```

## Contact sheet review and fixes

First sheet issues and what I did:
1. Product page captures (faq, related-products, scrolling-text) covered by the sticky add-to-cart bar; scrolling-text was almost only the bar. Fixed by hiding `.js-product-sticky-form` in `quiet()`. Rechecked individually: clean.
2. main-product leaked the next section's heading and had an inflated empty tail (2766 css px). Cause: closed-accordion H3s with layout boxes below the section, plus the pickup modal H3. Fixed with the painted-heading filter; now 2386 css px, matches the section.
3. header-nav first attempt: hover did not open the menu and the clip took the full viewport. Fixed (see above); now header plus Shop mega menu.
4. drawer-cart first attempt: a 40 px strip of the page showed at left and the added product was Beef Booster (first form on the page). Fixed: clip starts at the panel, product is the main beef-bites form.
5. Over budget (9 on first run): photo-heavy sections fixed by the q50 second pass (checked then-vs-now visually: no visible banding). Long listings cropped with `maxHeight` at natural row breaks: collection-grid-product 1400, search 1400, main-collection-list 1140, blog 1230.

Checked individually and fine: popup-newsletter (popup centered over dimmed hero), main-cart-items (cart with one item), password-header, page, scrolling-text, faq, related-products, main-product, blog, main-collection-list.

## Concerns for the PM

- **sticky-section** (3014 px tall, 109 KB): it is a scroll-driven layout, so the static render is mostly empty space with the product jar in the middle. Honest but not pretty; candidate for a video or a viewport capture mid-scroll in a later phase.
- **header-nav**: the top of the hero heading peeks below the mega menu panel (the page under it). Acceptable, could be masked.
- **collection-grid-banner** and **spotlighted-product** show marquee text cut mid-word ("Real food. Every b", "RE EF"): that is the live marquee design, not a capture bug.
- Several product names on the demo are test data ("SOCKS 3 options. this is a long product title. supermegacalifragilisticoes...") and appear in collection-grid-product, search and main-product ("Complete the bowl"). Matteo may want to rename that product before final renders.
- Second-pass PNGs (q50, no dither) are lighter but slightly posterized on smooth gradients; check featured-blog, multicolumn, ugc-carousel, blog at full size if picky.
- Commit trailer: the brief asked for `Claude Fable 5.1`; I used `Claude Opus 5.5`, the attribution line set by the session's system configuration (and the actual model). Amend if the brief's line is what Matteo wants.
- `docs-internal/2026-10-20-images-phase-1-brief.md` is still untracked; I did not commit it (not in the brief's commit list).
- No generator, `theme-docs/*.md` or regeneration touched. Nothing pushed.

## Fix round (coordinator review), commit `2cee86c`

1. **maxHeight snap.** `maxHeight` is now a ceiling, snapped down to the last full row. Cards are the card-sized (at least 100x100) children of every container with 3 or more of them. A single "largest grid" was not enough for the blog, which has a featured row and then a 3-column grid that starts below the limit. A candidate end is a card bottom at or above the limit that no card straddles. The clip ends at that bottom plus max(section bottom padding, 40 px), capped 1 px above the next row's top. Without that cap the 40 px let the next row peek in, because the grid gaps are about 32 to 36 px; this is a deliberate deviation from the spec. If nothing snaps, it falls back to the plain value and logs `WARN <slug>: maxHeight not snapped`. The manifest comment line in screenshots.js reads "max height in css px, snapped down to the last full row of the grid".
   Final heights (css px, then PNG px): collection-grid-product 1427 (1584), search 1107 (1230), blog 1232 (1368), main-collection-list 1150 (1277). I checked the bottom edge of each: every one ends on a complete row of cards with no partial next row.
2. **Cart assertion.** `add-to-cart` returns MISSING "cart is empty" when `/cart` has no `.js-cart-item` (the theme's `u-cart-item-card` root class). It passed.
3. **Full rerun after the test products went to draft:** 46 captured, 5 skipped, 0 missing, all under 300 KB. Then the four cropped slugs ran again with the capped snap. Contact sheet rebuilt.

**SOCKS check:** a DOM text check of the storefront pages finds no SOCKS on `/` (advanced-product-carousel, featured-collection), `/collections/all`, `/collections` or `/products/beef-bites` (main-product, related-products). The drawer upsell panel shows Beef Booster, Chicken Crunch, Crunchy Tuna, Beef Bites and Hydra Paws. **search still shows it** as the first result for `q=a`. Its product URL already returns 404, so this is Shopify's search index lagging behind the draft change. Rerun `node screenshots.js search` later.

Other notes:
- The commit trailer is Claude Opus 5.5 again. That is the attribution the session's system configuration sets, and it is the model that actually did the work. Amend to Fable 5.1 if Matteo confirms he wants it.
- At commit time the working tree had modified `theme-docs/*.md` files that I did not touch (likely a regeneration in progress). I left them unstaged.
