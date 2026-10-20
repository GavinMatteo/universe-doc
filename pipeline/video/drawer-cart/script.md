# Drawer Cart: video script (proof of concept)

Target: 3 to 4 minutes, 1920x1080, English voice-over, chapters mirror the doc page
`theme-docs/drawer-cart.md`. Scenes marked [S] are storefront recordings (no login needed),
scenes marked [E] are theme editor recordings (need `.auth/shopify.json`).

| # | Chapter (YouTube timestamp label) | Scene | Narration |
|---|---|---|---|
| 0 | Introduction | [S] cold open: product added, drawer slides in, free shipping bar fills | "This is the Drawer Cart in Universe. It opens the moment a visitor adds a product, shows how close they are to free shipping, suggests one more item, and gets them to checkout without leaving the page. Here is how to set it up." |
| 1 | What the visitor sees | [S] home, product page, add to cart, drawer: items, quantity, note, discount, checkout | "On the storefront the drawer appears from the right. The visitor can change quantities, leave a note, enter a discount code, and go straight to checkout. Everything you see here is a setting in the theme editor." |
| 2 | Cross-sell and free shipping bar | [S] add a suggested product from the drawer, bar reaches the threshold | "The left column is the cross-sell list. You pick the products yourself, so every visitor sees the same suggestions. Above the items, the free shipping bar reads the threshold from your shipping settings and updates as the cart grows." |
| 3 | Content and layout settings | [E] theme editor, Drawer cart section, scroll the settings panel, toggle free shipping bar, notes, discount, payment icons | "In the editor, open the Drawer cart section from the overlay group. The first block of settings controls the content: the free shipping bar, the cross-sell row and its products, the conversion copy above the checkout button, cart notes, discount codes, and which buttons appear. Each toggle maps to one element in the drawer." |
| 4 | Empty cart and colors | [E] scroll to empty cart message and buttons, then the color scheme and custom colors | "Further down you write the empty cart message and up to three buttons that send visitors back to shopping. The last group sets the color scheme of the summary footer, with optional custom colors for the cross-sell column." |
| 5 | Outro | [S] final drawer state, logo card | "That is the Drawer Cart. The full list of settings, with one line for each, is in the documentation linked below." |

Description for YouTube:

```
Set up the Drawer Cart in the Universe Shopify theme: free shipping bar, cross-sell products, cart notes, discount codes and the empty cart screen.

Chapters:
0:00 Introduction
0:20 What the visitor sees
0:55 Cross-sell and free shipping bar
1:30 Content and layout settings
2:30 Empty cart and colors
3:10 Outro

Documentation: https://developpy.gitbook.io/universe-doc-git/drawer-cart
Universe theme by Developpy
```
