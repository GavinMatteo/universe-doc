# FAQ

Answers to the most common questions about the Universe theme.

**On this page**

- [General](#general)
- [Theme Editor and customization](#theme-editor-and-customization)
- [Color schemes](#color-schemes)
- [Navigation and menus](#navigation-and-menus)
- [Product page](#product-page)
- [Performance](#performance)
- [Apps and integrations](#apps-and-integrations)

---

## General

**Where do I find the Theme Editor?**\
In your Shopify admin, go to **Online Store > Themes**, then click **Customize** next to Universe.

**How do I update the theme?**\
When an update is available, you will see an **Update available** notice in your Theme library. Click it to update. Shopify creates a backup of your current theme before applying the update. Always review the [Changelog](changelog.md) before updating.

**Will updating the theme overwrite my customizations?**\
Settings, sections, and content you have configured through the Theme Editor are preserved during a standard update. However, any direct code edits you have made to the theme files will not be preserved. Always duplicate your theme before editing code.

**How do I duplicate the theme?**\
In your Theme library, click the three-dot menu next to Universe and select **Duplicate**. This creates a copy you can edit safely without affecting your live store.

**The theme looks different from the demo store. Why?**\
Demo store images are not included with the theme installation. The theme installs with placeholder content. Add your own products, images, and text to build out your store.

---

## Theme Editor and customization

**I changed a setting but it is not showing on my live store.**\
Make sure you clicked **Save** in the top right corner of the Theme Editor. Changes are not published until saved.

**I cannot find a section in the Theme Editor.**\
Some sections are only available on specific page templates. For example, the Product Page section only appears when you are editing the product page template. Use the template switcher at the top of the editor to navigate to the correct page.

**Can I add the same section to multiple pages?**\
Yes. Sections added to a JSON template are specific to that template. To use a section on multiple pages, add it to each template individually, or consider using a global section in the header or footer group.

**How do I remove a section?**\
Click the section in the left sidebar to select it, then click the trash icon at the bottom of the settings panel.

**Can I reorder sections?**\
Yes. Drag and drop sections in the left sidebar to change their order on the page.

---

## Color schemes

**What is a color scheme?**\
A color scheme is a preset palette of background, text, button, and link colors. You define up to several color schemes in **Theme settings > Colors**, and then assign any scheme to any section individually.

**How do I create a new color scheme?**\
Go to **Theme settings > Colors**, scroll to the Color Schemes section, and click the **+** icon to add a new scheme. Give it a name and configure its colors.

**A section is showing the wrong colors.**\
Check the **Section's color palette** setting inside that section's settings panel. Select the correct color scheme from the dropdown.

**What does "Use gradient as background" do?**\
When enabled, the section uses the gradient defined in the selected color scheme instead of the solid background color. Gradients are configured per color scheme in **Theme settings > Colors**.

---

## Navigation and menus

**How do I set up the main menu?**\
Menus are managed in Shopify admin under **Online Store > Navigation**, not in the Theme Editor. Create your menu there, then assign it in **Header and Navigation > Primary Menu**.

**How do I enable a mega menu?**\
Add a Mega Menu block inside the Header and Navigation section. Set the **Menu item to apply to** field to exactly match the text of the navigation item you want to trigger the dropdown. The match is case-sensitive.

**The mega menu is not appearing.**\
Check that the **Menu item to apply to** field matches the navigation item label exactly, including capitalization and spacing.

**How do I add a secondary menu to the footer?**\
In the Footer section, add a Menu Block and select the menu you want to display. Use the **Column span** setting to control its width in the footer grid.

---

## Product page

**The variant selector is not showing.**\
Add the **Variants** block to the Product Page section. It does not appear by default. In the Theme Editor, open the Product page template and click **Add block** inside the main product section.

**How do I remove the Shop Pay / PayPal dynamic checkout button?**\
In the **Buy buttons** block settings, disable **Show dynamic checkout buttons**.

**Product images are showing in the wrong order.**\
Image order is set in Shopify admin under the product's media tab, not in the Theme Editor. Drag and drop the images in the correct order there.

**The sticky add to cart bar is not appearing.**\
Make sure **Enable Sticky add to cart** is turned on in the Product Page section settings, and that the **Buy buttons** block is present in the block list.

**How does the Pairs well with block work?**\
This block displays products you select manually as a cross-sell suggestion. It does not use Shopify's automatic recommendations. You choose which products to show.

---

## Performance

**How can I improve my store's speed?**\
- Use compressed images. Upload images at the size they will be displayed, not larger.
- Avoid enabling too many animations at once. Animations add visual interest but can affect performance on lower-end devices.
- Limit the number of sections on the home page to what is necessary.
- Minimize the number of third-party apps installed on your store.

**Does the theme pass Shopify's Lighthouse requirements?**\
Yes. Universe is built to meet Shopify's minimum Lighthouse performance score of 60 and accessibility score of 90. Actual scores in your store will vary depending on your images, apps, and content.

---

## Apps and integrations

**Is the theme compatible with product review apps?**\
Yes. The Product Page and Featured Product sections include an App Block that accepts review app blocks. Install your review app and add its block inside those sections via the Theme Editor.

**Can I use a translation app with this theme?**\
Yes. The theme supports Shopify's native multilingual features. Third-party translation apps that use Shopify's standard integration method are also compatible.

**An app is not displaying correctly inside the theme.**\
Contact the app developer. App display issues are usually caused by the app's CSS conflicting with the theme's styles. Theme support does not cover third-party app conflicts.

**Can I use a page builder app with this theme?**\
Page builder apps that use the standard Shopify section and block system are generally compatible. Apps that inject custom HTML outside of the standard template system may conflict with the theme layout.
