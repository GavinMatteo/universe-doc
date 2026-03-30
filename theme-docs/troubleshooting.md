# 🔧 Common issues

Solutions to the most frequently reported problems with Universe.

---

## The mega menu is not appearing

**Cause:** The **Menu item to apply to** field in the mega menu block does not match the navigation item label exactly.

**Fix:** Go to Shopify admin under **Online Store > Navigation**, open your main menu, and copy the exact label of the item you want to trigger the mega menu. Paste it into the **Menu item to apply to** field in the Theme Editor. The match is case-sensitive.

---

## The Drawer Cart is not opening when I add a product

**Cause:** Cart type may be set to Page instead of Drawer.

**Fix:** Go to **Theme settings > Cart** and set **Cart type** to Drawer.

---

## Color swatches are showing as text buttons

**Cause:** The variant option is not named "Color" or "Colour", or the swatch mapping is missing.

**Fix:** Check that the product variant option is named exactly "Color" in Shopify admin. Then verify the swatch mapping in **Theme settings > Color Swatch > Setup**.

---

## The sticky add to cart bar is not showing on the product page

**Cause:** Either **Enable Sticky add to cart** is disabled in section settings, or the **Buy buttons** block is missing from the product page.

**Fix:** In the Theme Editor, open the Product page template. Check that **Enable Sticky add to cart** is enabled in the main product section settings. Also confirm the **Buy buttons** block exists in the block list.

---

## The transparent header text is hard to read

**Cause:** The transparent header text color is not contrasting enough with your hero image.

**Fix:** Go to the **Header and Navigation** section settings and adjust **Transparent header text color** to a color that contrasts with your hero image background.

---

## The Shape Divider has a visible gap or color mismatch

**Cause:** The **Next section's background color** setting does not exactly match the background color of the section below.

**Fix:** In the Shape Divider block settings, open the **Next section's background color** picker and match it exactly to the background color of the section immediately below. If the section below uses a color scheme, open that color scheme in **Theme settings > Colors** and copy the exact background color value.

---

## Product images are showing in the wrong order

**Cause:** Image order is controlled in Shopify admin, not in the Theme Editor.

**Fix:** Go to Shopify admin, open the product, and drag and drop the images in the media tab to the correct order.

---

## The free shipping bar is showing the wrong threshold

**Cause:** The threshold in the Drawer Cart section settings overrides the global setting in Theme settings.

**Fix:** Check both locations. Go to **Theme settings > Cart** and verify the **Free shipping threshold**. Then check the **Drawer Cart** section settings for a separate threshold field and make sure both values match.

---

## A section is showing the wrong colors

**Cause:** The section's color palette setting is assigned to the wrong color scheme.

**Fix:** In the Theme Editor, click the section showing the wrong colors. Open the **Colors** group and check the **Section's color palette** dropdown. Select the correct color scheme.

---

## The video in the Bold Slideshow is not autoplaying

**Cause:** Browsers block autoplay for videos that have an audio track.

**Fix:** Re-export the video file with no audio track and upload it again. Make sure the file is in MP4 format.
