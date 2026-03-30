# 📍 Store Locator
The Store Locator section displays an interactive Google Maps map with pinned markers for each physical store location. Each location is added as a block with name, address, coordinates, and optional custom marker. A search input can filter visible markers.
📌 **When to use it:** Use it on a dedicated store locator page or on the Contact page for brands with physical retail.

**On this page**

- [Section Settings](#section-settings)
  - [Content and Layout](#content-and-layout)
  - [Colors](#colors)
  - [Spacing](#spacing)
- [Blocks](#blocks)
  - [Store](#store)
  - [Shape Divider](#shape-divider)
- [Tips](#tips)
- [FAQ](#faq)

---

## ⚙️ Section Settings

### Content and Layout

| Setting | What it does |
|---|---|
| **Heading** | The main heading displayed at the top of this block or section. |
| **Heading size** | Controls the visual size of the heading. Options are Small, Medium, Large, and Extralarge. |
| **Heading HTML tag** | The HTML tag used for the heading (H1, H2, H3, and so on). Use H1 only once per page, on the most important heading, as it signals the primary content to search engines. |
| **Paragraph** | The body text for this block. Supports rich text formatting. |
| **Content alignments** | Controls the horizontal alignment of the content block within the section: Left, Center, or Right. |
| **Highlighted text** | Enables an animated highlight effect on selected words inside the heading. To apply it to a word, select it in the editor and format it as italic. |
| **Highlighted text style** | The style of the highlight animation. Options include Underline, Scribble underline, Text color, Thick underline, Outline, and Background color. |
| **Highlighted text color** | The color applied to the highlighted words in the heading. |
| **Google Maps API key** | Your Google Maps API key, required to render the interactive map. Generate it in Google Cloud Console with Maps JavaScript API enabled. |
| **Map's marker color** | The default color of map pin markers for locations without a custom marker image. |
| **Map's marker size** | The size of the default map pin icons in pixels. |
| **Map background color** | The background color of the map canvas, visible in areas with no roads or geography. |
| **Map roads color** | The color of roads and paths drawn on the map. |
| **Left column heading** | The heading shown above the location list on the left side of the map. |
| **Enable search** | Shows a search input that filters visible store pins as the visitor types. |
| **Search placeholder** | The placeholder text shown inside the search field. |


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

## 🧩 Blocks

### Store

| Setting | What it does |
|---|---|
| **Choose image** | An image for this store location, displayed in the location info panel. |
| **Store name** | The name of this store location, shown in the info panel and as the map marker label. |
| **Store info** | The address, phone number, opening hours, and other details. Supports rich text formatting. |
| **Store latitude** | The latitude of this store. Find it by right-clicking the location in Google Maps and selecting the coordinates. |
| **Store longitude** | The longitude of this store. Find it the same way as the latitude. |
| **Store marker color** | A custom color for the map pin marker of this location, overriding the global marker color. |
| **Store marker icon** | A custom image used as the map pin for this location instead of the default pin. |


### Shape Divider

Adds a decorative SVG shape at the top or bottom of the section to create a smooth visual transition into the next section.

| Setting | What it does |
|---|---|
| **Choose position** | Whether the Shape Divider appears at the top or bottom of the section. |
| **Section's color palette** | The color palette of the divider shape. Typically matches the section it belongs to. |
| **Next section's background color** | The exact background color of the section immediately below this one. Setting this correctly makes the divider edge blend seamlessly. |
| **Style** | The visual shape of the divider: Waves, Deep waves, Arc, Big curve, Oblique line, Triangle, or one of the shaded pattern options. |


---

## 💡 Tips

- You need a Google Maps API key with the Maps JavaScript API enabled.
- Find exact coordinates by right-clicking a location in Google Maps.


---

## ❓ FAQ

**The map is not loading.**\
Check that your Google Maps API key is valid and has the Maps JavaScript API enabled in Google Cloud Console.

**Can I add a phone number to the location block?**\
Yes. Use the Store info field to add any contact details including phone numbers or emails.

