# Developpy brand kit

Everything in this folder is the Developpy visual identity, gathered on 19 October 2026
from the brand manual, Google Drive and the other Developpy repos on this Mac. Use it for
anything the docs pipeline produces: YouTube banner, video intro and outro, lower thirds,
captions, thumbnails, annotated screenshots.

The authority is `manual/BrandManual-Developpy.pdf` (Visual Identity & Brand Guidelines,
July 2024, by Vittoria Lama, @vittorialamagraphics). `tokens.css` is the machine-readable
summary of it. When the two disagree, the PDF wins.

## Palette

| Name | Hex | RGB | CMYK | Role |
|---|---|---|---|---|
| Dark Violet | `#110B2F` | 17 11 47 | 100 100 47 64 | ink, dark backgrounds, logo on light |
| Mirtillo | `#4334B5` | 67 52 181 | 87 81 0 0 | primary brand, gradients |
| Purple | `#7852FC` | 120 82 252 | 76 72 0 0 | accent, highlighted words, gradients |
| Lilac | `#DEDCFD` | 222 220 253 | 15 15 0 0 | light surfaces, secondary text on dark |
| Lime | `#E0F568` | 224 245 104 | 24 0 82 0 | single accent word, never the logo |

Cold, modern, web-first tones with violet as the signature. Contrast is the point: lime is
used sparingly, on one word, to pull the eye ("a un livello **superiore**").

## Typography

- **Figtree** is the copy font: all body text, UI, subtitles, long titles. Weights from
  Light to Black, variable file in `fonts/figtree/`. Licence: SIL OFL (`OFL.txt`).
- **Barracuda** is the accent font: short titles and single accent words inside a Figtree
  title, never for running text. Light, Regular, Bold and italics in `fonts/barracuda/`.
- Hierarchy from the manual: title Figtree Regular 63pt with the accent word in Barracuda
  Regular 65pt; subtitle Figtree SemiBold 23pt; paragraph Figtree Light 16pt, leading 17,
  tracking 0.

## Logo

- `logo/logo_<color>.svg`: extended logo (icon + wordmark + ©). Colors: white, black,
  darkviolet, mirtillo, purple, lilac. `logo/icona-<color>.svg`: icon only, for vertical
  or small formats. `logo/png/` has the same at 2x, plus favicon and web clip.
- `logo/universe-logo.svg`: the Universe theme wordmark (from the theme assets, uses
  `currentColor`).
- Clear space: a square with the side equal to the height of the "D" in the icon, on all
  sides. Minimum size: icon 1 cm, extended logo 7 cm wide.
- Five allowed positions on any layout: centered, top left, bottom left, bottom right,
  bottom centered.
- Never: wordmark before the icon, rotated, recolored outside the palette (lime included),
  stacked icon over wordmark.

## Graphic style

- Gradients from Purple to Dark Violet, soft rounded corners (cards at about 28px).
- "Simple glass shapes": frosted-glass 3D torus, spring and tube renders, on violet or
  gradient backgrounds. 76 frames in `elements/glass-shapes/` (four rotation frames per
  shape, `0000` to `0003`), transparent PNG.
- Accent color on single words, gradient inside lettering on social.
- Dark compositions: black or Dark Violet card with white Figtree title and a Purple or
  Lilac accent word ("Rendi il tuo **Shopify** indimenticabile").

## Tone of voice (from `reference/brand_audit_developpy.md`)

Plain, declarative, concrete, no hype adjectives. Short sentences. Facts over
superlatives. "Software house", not "agency". English first, Italian and Spanish follow.
No em dashes anywhere.

## What is where

| Folder | Content | Source |
|---|---|---|
| `manual/` | BrandManual (guidelines), BrandAsset (one-page cheat sheet), branding proposal (June 2024), logo project (October 2024) | Drive "Asset Developpy", `~/Downloads/Assets Developpy`, WeTransfer folders in Downloads |
| `fonts/` | Barracuda family (6 TTF), Figtree variable + 18 static TTF, woff2 subsets used by the website | Drive "Asset Developpy/Font", `~/Downloads/Assets Developpy` |
| `logo/` | 12 SVG, PDFs, PNG 2x, favicon, web clip, Universe wordmark | Drive "Asset Developpy/Loghi", Developpy Website repo |
| `elements/glass-shapes/` | 76 frosted-glass renders | Drive "Asset Developpy/Forme Glass" |
| `mockups/` | manual cover, business cards, lanyard, tote, billboard, phone, bubble wrap, light cube, 3D icon | Instagram toolkit `brand/mockups` |
| `profile/` | Instagram profile pictures (ink, gradient, lilac) and their HTML source | Instagram toolkit `brand/profile` |
| `partners/` | Shopify Partners, Shopify Expert, Select Partner, Klaviyo partner badges | Instagram toolkit and website repo |
| `reference/instagram-feature-graphics/` | 28 Universe feature mockups (Theme Store style, 1254x1254, annotated) | Instagram toolkit `brand/universe` |
| `reference/demo-screens/` | Woofy demo screenshots, desktop and mobile | Instagram toolkit `brand/demos` |
| `reference/instagram-slides.css` | the slide design system built on these tokens | Instagram toolkit `templates/` |

Drive folders: "Developpy / Asset Developpy" holds manual, fonts, logos and glass shapes;
"Developpy / Instagram" mirrors the toolkit. The Drive folder named "Branding" belongs to
the Cross Guild client, not to Developpy.

Not found anywhere: a motion or video style guide, and a Universe-specific brand book.
The Universe theme has only the wordmark SVG; its colors on the demo store (teal, coral)
are the Woofy demo brand, not Universe's.
