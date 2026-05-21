# Theme Settings

Theme Settings are global options that affect the entire store, independent of any individual section. Access them in the Theme Editor by clicking **Theme settings** at the bottom of the left panel.

**On this page**

- [Colors](#colors)
- [Typography](#typography)
- [Layout](#layout)
- [t:settings_schema.color_swatch.name](#t-settings-schema-color-swatch-name)
- [t:settings_schema.labels.name](#t-settings-schema-labels-name)
- [t:settings_schema.animations.name](#t-settings-schema-animations-name)
- [Cart](#cart)
- [t:settings_schema.floating_header.name](#t-settings-schema-floating-header-name)
- [t:settings_schema.quick_add.name](#t-settings-schema-quick-add-name)
- [t:settings_schema.breadcrumbs.name](#t-settings-schema-breadcrumbs-name)
- [Favicon](#favicon)
- [t:settings_schema.currency_codes.name](#t-settings-schema-currency-codes-name)
- [t:settings_schema.gift_card.name](#t-settings-schema-gift-card-name)
- [t:settings_schema.social-media.name](#t-settings-schema-social-media-name)

---

## Colors

Defines the base color palettes for your store. Each palette sets the background, text, button, and link colors. Sections reference these palettes by name.

| Setting | What it does |
|---|---|
| **Color Schemes** | The set of color palettes available in the theme. Each palette defines background, text, button, and link colors. Sections select which palette to use. |
| **Background** | The base background color applied across the store. |
| **Success** | The color used for success messages and notifications. |
| **Error** | The color used for error messages. |
| **Warning** | The color used for warning messages. |
| **Sale price** | A highlight color applied to product prices across the store, used to draw attention to the price. |

## Typography

Controls fonts, sizes, and letter spacing for headings, body text, and buttons across the entire store.

### Headings

| Setting | What it does |
|---|---|
| **Font** | The font used for headings across the store. |
| **Base size** | The base size scale for headings. Increase to make all headings larger proportionally. |
| **Line height** | The line height of heading text. Higher values add more space between lines. |
| **Letter spacing** | The letter spacing of heading text. Higher values spread characters further apart. |

### Header navigation

| Setting | What it does |
|---|---|
| **Font** | The font style used for the navigation header text. |
| **Font weight** | The font weight of the navigation header text. |
| **Base size** | The base size scale for header navigation text. |
| **Letter spacing** | The letter spacing of header navigation text. |
| **Capitalize** | When enabled, navigation header text is displayed in all uppercase. |

### Body text

| Setting | What it does |
|---|---|
| **Font** | The font used for body text and paragraphs across the store. |
| **Base size** | The base size of body text. Increase to make all body text larger. |
| **Line height** | The line height of body text. |
| **Letter spacing** | The letter spacing of body text. |

### Buttons

| Setting | What it does |
|---|---|
| **Font** | The font used for button labels. |
| **Base size** | The base size of button text. |
| **Letter spacing** | The letter spacing of button text. |
| **Capitalize** | When enabled, button text is displayed in all uppercase. |

## Layout

Sets the maximum page width, side gutters, and global border radius options that apply to all sections.

### Border Radius

| Setting | What it does |
|---|---|
| **Global roundness** | A global border radius setting that controls the roundness of section blocks. |
| **Card roundness** | The border radius applied to product and content cards. |
| **Buttons roundness** | The border radius applied to buttons. |

### Page dimensions

| Setting | What it does |
|---|---|
| **Page width** | The maximum width of the page content area in pixels. Content wider than this value is centered with side margins. |
| **Card border thickness** | The thickness of borders applied globally to cards and elements. |

## t:settings_schema.color_swatch.name

| Setting | What it does |
|---|---|
| **Setup** | A configuration block for mapping swatch color names to hex values or image URLs. Each line should contain the color name and its value. |
| **Image swatches** | When enabled, swatches use product images instead of solid color fills. |

## t:settings_schema.labels.name

| Setting | What it does |
|---|---|
| **Font size** |  |
| **Letter spacing** |  |
| **Show label** | Shows a Sold Out label on product cards when inventory reaches zero. |
| **Background color** | The background color of the Sold Out label. |
| **Text color** | The text color of the Sold Out label. |
| **Show label** | Shows a Sale label on product cards that have a compare-at price set. |
| **Background color** | The background color of the Sale label. |
| **Text color** | The text color of the Sale label. |
| **Show label** | Enables a custom label that can be applied to products using a metafield. |
| **Background color** | The background color of the custom label. |
| **Text color** | The text color of the custom label. |

## t:settings_schema.animations.name

| Setting | What it does |
|---|---|
| **Reveal sections on scroll** | When enabled, sections fade and slide into view as the visitor scrolls down the page. |

## Cart

Configures global cart behavior including cart type, the free shipping progress bar, and cart note visibility.

| Setting | What it does |
|---|---|
| **Cart type** | Controls how the cart is displayed: Drawer (slide-in panel), Page (full /cart page), or Popup notification. |
| **Free shipping threshold** | The order value at which free shipping is triggered. Enter numbers only. For multiple currencies use the format USD:100,EUR:95. |
| **Show truck icon** | Shows a truck icon inside the free shipping progress bar. |
| **Shipping message** | The message shown before the threshold is reached. Use [amount] as a placeholder for the remaining amount. |
| **Success message** | The message shown when the visitor has reached the free shipping threshold. |
| **Progress bar background** | The background color of the free shipping progress bar track. |
| **Progress bar color** | The fill color of the free shipping progress bar. |
| **Text color** | The text color of the free shipping bar messages. |

## t:settings_schema.floating_header.name

| Setting | What it does |
|---|---|
| **Enable floating header** |  |
| **Border color** |  |
| **Border thickness** |  |
| **Border radius** |  |
| **Enable top offset** |  |

## t:settings_schema.quick_add.name

| Setting | What it does |
|---|---|
| **Quick add color scheme** | The color palette applied to the quick add overlay that appears on product cards. |

## t:settings_schema.breadcrumbs.name

| Setting | What it does |
|---|---|
| **Enable in collections** | Shows breadcrumb navigation on collection pages. |
| **Enable in product** | Shows breadcrumb navigation on product pages. |
| **Enable in blog** |  |

## Favicon

Sets the small icon shown in browser tabs.

| Setting | What it does |
|---|---|
| **Favicon image** | The small icon shown in browser tabs and bookmarks. Recommended size is 32x32 pixels. |

## t:settings_schema.currency_codes.name

| Setting | What it does |
|---|---|
| **Show codes** | When enabled, the currency code (for example USD or EUR) is shown alongside prices across the store. |

## t:settings_schema.gift_card.name

| Setting | What it does |
|---|---|
| **Logo** | The logo image displayed in the header. |
| **Width** | The display width of the logo on desktop, in pixels. |

## t:settings_schema.social-media.name

| Setting | What it does |
|---|---|
| **Facebook** |  |
| **X / Twitter** |  |
| **Instagram** |  |
| **YouTube** |  |
| **TikTok** |  |
| **Snapchat** |  |
| **Pinterest** |  |
| **Tumblr** |  |
| **LinkedIn** |  |
| **Vimeo** |  |
| **Threads** |  |
| **WhatsApp** |  |
| **Discord** |  |
| **Twitch** |  |
| **Messenger** |  |
| **Telegram** |  |
| **Show email sharing** |  |

