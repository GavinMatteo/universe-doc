# Color swatches

How to configure color swatches for product variants in Universe.

Color swatches display a small color circle or image next to each color variant, replacing plain text buttons. This guide explains how to set them up.

---

## How swatches work in Universe

Universe reads swatch data in two ways:

1. **Automatic color matching** — if the variant option value matches a standard color name (for example, "Red", "Black", "Navy"), the theme applies a color automatically.
2. **Manual hex or image mapping** — you define a mapping in **Theme settings > Color Swatch > Setup** that tells the theme what color or image to use for each option value.

---

## Step 1: Set up the mapping in Theme settings

Go to **Theme settings > Color Swatch > Setup**. In the text area, add one mapping per line in this format:

```
OptionValue: #hexcode
OptionValue: image_filename.jpg
```

For example:

```
Cream: #F5F0E8
Forest green: #2D5016
Midnight blue: #1B2A4A
Leopard print: leopard-swatch.jpg
```

Option values are case-sensitive and must match the variant option value in your Shopify product exactly, including spaces and capitalization.

---

## Step 2: Enable swatches on product cards

Go to **Theme settings > Color Swatch** and enable **Show color swatches**. This makes swatches appear on product cards in collection grids and featured collection sections.

---

## Step 3: Enable swatches on the product page

In the Theme Editor, open the **Product page** template. Find the **Variants** block inside the main product section. Set **Variant type** to **Color swatches** for the color option.

---

## Using image swatches

If your color variants use patterns, textures, or prints that cannot be represented by a hex code, enable **Image swatches** in **Theme settings > Color Swatch**. Upload a swatch image for each variant to your Shopify Files library and reference the filename in the Setup mapping.

Recommended swatch image size: 64x64 pixels, square crop.

---

## ❓ Troubleshooting

**Swatches are showing as plain text buttons.**
Check that the option name on your product is exactly "Color" or "Colour" (case-sensitive). The theme only activates swatch rendering for options named Color or Colour by default.

**A swatch is showing the wrong color.**
Check the mapping in **Theme settings > Color Swatch > Setup**. The option value in the mapping must match the variant option value in Shopify exactly.

**Swatches are not appearing on collection pages.**
Make sure **Show color swatches** is enabled in **Theme settings > Color Swatch**, and that the collection section also has its own swatch setting enabled.
