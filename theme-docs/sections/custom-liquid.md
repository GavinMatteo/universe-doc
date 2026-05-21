# Custom Liquid

The Custom Liquid section lets you inject raw Liquid code directly into a page. It is intended for developers who need to add custom functionality, embed third-party scripts, or render dynamic content that standard sections do not support.

📌 **When to use it:** Use it only when you need something that cannot be achieved with the built-in sections. It requires knowledge of Shopify Liquid templating.



**On this page**

- [Section Settings](#section-settings)
  - [Content and Layout](#content-and-layout)
  - [Colors](#colors)
  - [Spacing](#spacing)
- [Tips](#tips)
- [FAQ](#faq)


---

## ⚙️ Section Settings

### Content and Layout

| Setting | What it does |
|---|---|
| **Liquid code** | Raw Liquid code injected into the page. Requires knowledge of Shopify Liquid templating. |


### Colors

| Setting | What it does |
|---|---|
| **Section's color palette** | Applies a color palette to this section, controlling the background, text, and button colors. Color palettes are defined in Theme Settings. |
| **Use gradient as background** | When enabled, the section uses the gradient defined in the selected color palette instead of a solid background color. |


### Spacing

| Setting | What it does |
|---|---|
| **Padding top** | The amount of empty space above the section content on desktop, in pixels. Increase it to separate this section visually from the one above. |
| **Padding top (mobile)** | The amount of empty space above the section on mobile, in pixels. Can be set independently from desktop. |
| **Padding bottom** | The amount of empty space below the section content on desktop, in pixels. |
| **Padding bottom (mobile)** | The amount of empty space below the section on mobile, in pixels. |


---

## 💡 Tips


- Always test custom code in a development store or theme preview before publishing.



---

## ❓ FAQ


**Is Custom Liquid safe?**\
Liquid runs server-side. Be careful with any JavaScript you inject, as it runs in the visitor browser.

