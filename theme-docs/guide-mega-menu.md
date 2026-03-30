# Mega menu

How to set up the mega menu in the Header and Navigation section.

The mega menu replaces a standard dropdown with a richer panel that can include navigation links, collection cards, product cards, or a promotional image. It activates when a visitor hovers over a specific menu item in the header.

---

## How the mega menu works

The mega menu is configured using blocks inside the **Header and Navigation** section. Each block type creates a different kind of mega menu panel. You assign each block to a specific navigation item using the **Menu item to apply to** setting.

**Important:** The value in **Menu item to apply to** must match the navigation item label exactly, including capitalization and spacing. If it does not match, the mega menu will not appear.

---

## 🧩 Block types

### Mega menu: Explore

Displays a list of navigation links from a secondary menu, with an optional promotional image alongside.

Use it for: general navigation categories, brand story links, editorial content.

**Key settings:**
- **Menu item to apply to** — the exact label of the nav item that triggers this dropdown.
- **Submenu** — the Shopify navigation menu displayed as links inside the dropdown.
- **Shop layout image** — an optional promotional image shown alongside the links.
- **Image URL** — where the promotional image links to when clicked.

### Mega menu: Collections

Displays a grid of collection cards with images.

Use it for: main product category navigation, highlighting featured collections.

**Key settings:**
- **Menu item to apply to** — the exact label of the nav item that triggers this dropdown.
- **Collections** — the collections displayed as visual cards.
- **CTA text** — a text link shown below the collection cards, for example "View all collections".

### Mega menu: Products

Displays a grid of product cards with images and prices.

Use it for: featuring best-sellers or new arrivals directly in the navigation.

**Key settings:**
- **Menu item to apply to** — the exact label of the nav item that triggers this dropdown.
- **Products** — the products displayed as cards.
- **CTA text** — a text link shown below the product cards.

### Mega menu: Shop

Combines a submenu of links with a promotional image. Similar to Explore but designed for the main shop category.

---

## Step-by-step setup

1. In the Theme Editor, open the **Header and Navigation** section.
2. Click **Add block** and select the mega menu block type you want.
3. In the **Menu item to apply to** field, type the exact label of the navigation menu item that should trigger the dropdown. For example, if your menu item is labeled "Collections", type "Collections".
4. Configure the rest of the block settings.
5. Click **Save**.
6. Preview the header on your store. Hover over the navigation item to see the mega menu.

---

## ❓ Troubleshooting

**The mega menu is not appearing.**
The most common cause is a mismatch in the **Menu item to apply to** field. Open your navigation menu in Shopify admin under **Online Store > Navigation** and copy the menu item label exactly. Paste it into the **Menu item to apply to** field.

**The mega menu appears for the wrong navigation item.**
Check that you have not accidentally added the same label to two different mega menu blocks.

**The mega menu appears but the links are wrong.**
Check the **Submenu** or **Collections** setting inside the block. Make sure the correct menu or collections are selected.
