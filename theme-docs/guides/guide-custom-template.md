# Custom templates

How to create alternate page templates in Universe for products, collections, and pages.

Shopify's template system lets you create multiple versions of the same page type. For example, you can have a standard product template and a separate landing-page-style product template for hero products. This guide explains how to create and assign custom templates using Universe.

---

## What is a custom template?

Every page in Shopify is rendered using a template file. By default, all products use `product.json`, all collections use `collection.json`, and all pages use `page.json`.

A custom template is a copy of one of these files with a different name, for example `product.landing.json`. You can configure it differently in the Theme Editor and then assign it to specific products, collections, or pages in Shopify admin.

---

## When to use a custom template

- A hero product that needs a different layout than standard products
- A collection page for a campaign that should not show filters or sorting
- A brand story or about page that needs a different structure than the default page template
- A seasonal landing page with its own section arrangement

---

## Step 1: Duplicate the template file in the code editor

1. In Shopify admin, go to **Online Store > Themes**.
2. Click the three-dot menu next to Universe and select **Edit code**.
3. In the left panel, find the **Templates** folder.
4. Locate the template you want to duplicate, for example `product.json`.
5. Click the template file to open it.
6. Click **Add a new template** at the top of the Templates folder.
7. Select the template type (product, collection, or page), choose **JSON** as the format, and give it a name, for example `landing`.
8. The new file `product.landing.json` is created. It starts as a copy of the default template.

---

## Step 2: Customize the new template in the Theme Editor

1. In Shopify admin, go to **Online Store > Themes** and click **Customize**.
2. Use the template picker at the top of the editor to switch to the new template. For example, select **Products > landing**.
3. Add, remove, and reorder sections as needed for this specific layout.
4. Click **Save**.

Changes to the custom template do not affect the default template and vice versa.

---

## Step 3: Assign the custom template to a product, collection, or page

**For products:**
1. In Shopify admin, go to **Products** and open the product.
2. In the right panel, find the **Theme template** dropdown under the **Online store** section.
3. Select the custom template from the dropdown, for example `landing`.
4. Click **Save**.

**For collections:**
1. In Shopify admin, go to **Products > Collections** and open the collection.
2. Find the **Theme template** dropdown and select the custom template.
3. Click **Save**.

**For pages:**
1. In Shopify admin, go to **Online Store > Pages** and open the page.
2. Find the **Theme template** dropdown and select the custom template.
3. Click **Save**.

---

## 💡 Tips

- Give templates descriptive names that reflect their purpose, for example `product.bundle`, `collection.campaign`, or `page.about`.
- Always duplicate the default template as the starting point. Do not start from an empty file.
- Custom templates are saved in the theme code. When you update the theme, check whether the update affects your custom templates and review them in the Theme Editor after updating.

---

## ❓ Troubleshooting

**The custom template does not appear in the dropdown in Shopify admin.**\
Make sure the template file was saved correctly in the code editor and that the filename follows the format `type.name.json`, for example `product.landing.json`.

**Changes to the custom template are also affecting the default template.**\
This means you edited the default template instead of the custom one. Use the template picker in the Theme Editor to confirm which template you are editing before making changes.
