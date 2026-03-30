# section_meta.py
# Per-section metadata: title, intro, when_to_use, tips, faq
# Edit this file to update documentation content without touching the generator.

SECTION_META = {
    'u-announcement-bar.liquid': (
        'Announcement Bar',
        'The Announcement Bar displays a thin strip of text at the top of the page, above the header. It is used to communicate promotions, shipping thresholds, or important store notices. It supports both a continuously scrolling marquee and a static carousel of individual messages.',
        'Use it whenever you have a time-sensitive offer or key information you want every visitor to see on arrival.',
        [
            'Keep announcement text short and direct. Visitors glance at it for one or two seconds at most.',
            'If you use the Marquee type, make sure the message reads naturally when it loops back to the start.',
        ],
        [
            ('Can I show different messages at different times?', 'The Announcement Bar does not have built-in scheduling. To rotate messages, use the Carousel type and add multiple Announcement slide blocks.'),
            ('How do I hide the bar on certain pages?', 'The Announcement Bar is a global header group section and cannot be hidden on individual pages without custom code.'),
        ]
    ),
    'u-advanced-hero-slideshow.liquid': (
        'Advanced Hero Slideshow',
        'The Advanced Hero Slideshow is a full-screen or fixed-height hero that combines a large foreground image with scrolling text that moves at a different speed in the background. The result is a parallax-like depth effect as the visitor scrolls. It works best for editorial homepages, campaign landing pages, or brand storytelling.',
        'Use it when you want a strong visual opening with a cinematic feel.',
        [
            'Use a high-quality image with a clear subject that reads well at full width.',
            'Keep the heading short. The background text carries most of the visual weight.',
            'On mobile, enable the Repeat background text on mobile option to fill the screen correctly.',
        ],
        [
            ('Can each slide have a different image?', 'Yes. Each slide block has its own image picker for desktop and mobile.'),
            ('The background text is not visible. Why?', 'Check the Background text opacity setting. If it is 0 the text is invisible. Also verify that the text color contrasts with the section background.'),
        ]
    ),
    'u-advanced-product-carousel.liquid': (
        'Advanced Product Carousel',
        'The Advanced Product Carousel is an interactive product showcase with a wheel-style animation. As the visitor scrolls through products, each card rotates into view. It works best with a small, curated set of hero products rather than a full collection.',
        'Use it on the homepage or a campaign page to spotlight 4 to 8 key products in a memorable way.',
        [
            'Works best with 4 to 6 products. Too many breaks the rhythm of the animation.',
            'Use product images with a consistent background or transparent PNGs for a cleaner result.',
        ],
        [
            ('Can I link the section to a collection?', 'No. Each product is added manually as a block, giving you full control over which products appear and in what order.'),
            ('The animation feels slow. How do I speed it up?', 'Lower the Wheel animation delay value in the section settings.'),
        ]
    ),
    'u-best-choice-offer.liquid': (
        'Best Choice Offer',
        'The Best Choice Offer section displays two or three products side by side in a comparison layout, with one product highlighted as the recommended choice. Each card shows key features as bullet points, a custom image, and a buy button.',
        'Use it on product pages, landing pages, or the homepage to highlight a hero product alongside alternatives.',
        [
            'The highlighted product should always be your best-margin or best-converting option.',
            'Keep feature labels consistent across all cards so the comparison reads cleanly.',
        ],
        [
            ('Can I add more than three products?', 'No. The section supports a maximum of two secondary products plus one highlighted product.'),
            ('The buttons do not add to cart directly. Why?', 'The buttons link to the product page. Direct add-to-cart is not supported in this layout.'),
        ]
    ),
    'u-big-text.liquid': (
        'Big Text',
        'The Big Text section uses large typographic text as its main visual element, with a scrolling marquee running through it. It is a statement section built around typography rather than imagery, used for brand messages, taglines, or campaign names.',
        'Use it as a visual break between content sections, or as a standalone brand statement on campaign pages.',
        [
            'Works best with a short, punchy headline of 2 to 5 words.',
            'Pair it with a contrasting color scheme to make the typography stand out.',
        ],
        [
            ('Can I disable the scrolling text?', 'Yes. Uncheck the Enable scroll setting.'),
            ('How do I change the scrolling direction?', 'Use the Scrolling direction setting.'),
        ]
    ),
    'u-bold-slideshow.liquid': (
        'Bold Slideshow',
        'The Bold Slideshow is built for impact. It spans the full width of the page and supports slides with either an image or a video as the background, with text, buttons, and star ratings overlaid on top. It is the go-to choice for homepages or any page where you want to capture attention in the first few seconds.',
        'Use it for the homepage hero or any page where a strong first impression is the priority.',
        [
            'If your slides contain text worth reading, set autoplay to at least 6 or 7 seconds.',
            'Use a separate mobile image or video. Desktop media rarely crops well to portrait orientation.',
            'Increase Overlay protection if text is hard to read over a bright or complex image.',
        ],
        [
            ('Can I mix image slides and video slides in the same slideshow?', 'Yes. Add both block types to the same section. The order follows the block order in the Theme Editor.'),
            ('The video does not autoplay. Why?', 'Browsers block autoplay for videos that have an audio track. Make sure the video file is muted and in MP4 format.'),
            ('Are the star ratings connected to my store reviews?', 'No. Stars are set manually per slide. For real review data use the Reviews Showcase section instead.'),
        ]
    ),
    'u-collage.liquid': (
        'Collage',
        'The Collage section is a free-form CSS grid where you place text, image, and video blocks at custom column and row positions. You control exactly how large each cell is and where it sits, making it ideal for editorial layouts, mood boards, or brand storytelling.',
        'Use it when you need a layout that feels handcrafted rather than templated.',
        [
            'Plan your grid before building it in the editor.',
            'Mix block types: one large image, one text block, and one smaller image or video is a solid starting combination.',
            'On mobile the grid collapses to a single column. Make sure the reading order of your blocks makes sense when stacked.',
        ],
        [
            ('My blocks are overlapping. What is wrong?', 'Overlapping happens when two blocks share the same grid area. Double-check the column and row values for each block.'),
            ('Can I use a video and an image in the same collage?', 'Yes. Add an image block and a video block and position them independently on the grid.'),
        ]
    ),
    'u-collection-grid-banner.liquid': (
        'Collection Banner',
        'The Collection Banner sits at the top of collection pages and displays the collection title, description, and an optional hero image or scrolling promotional text. It gives each collection page a distinct visual identity without requiring a custom template.',
        'Add it to your collection template in the Theme Editor to give every collection a branded header automatically.',
        [
            'If you upload a custom image it overrides the collection image set in Shopify admin.',
            'The scrolling promotional text is a good place for a short collection tagline or a relevant discount offer.',
        ],
        [
            ('The collection image is not showing. Why?', 'Make sure Show collection image is enabled and the collection has an image in Shopify admin, or a custom image is uploaded here.'),
            ('Can I have a different banner for each collection?', 'Settings apply globally to all collections using that template. For per-collection banners you would need separate templates.'),
        ]
    ),
    'u-collection-grid-product.liquid': (
        'Collection Product Grid',
        'The Collection Product Grid is the main product listing area on collection pages. It displays products in a configurable grid with support for filtering, sorting, color swatches, quick buy, and quick view. This section has the most direct impact on browsing and conversion on collection pages.',
        'This section is part of the collection template and is active by default on all collection pages.',
        [
            'Enable filters and sorting to reduce friction for visitors who know what they are looking for.',
            'Use 2 columns on mobile and 3 or 4 on desktop as a starting point.',
        ],
        [
            ('Filters are not showing even though the setting is enabled. Why?', 'Filters are powered by Shopify Search and Discovery. Configure your filters in Shopify admin under Online Store > Navigation before they appear here.'),
            ('What is the difference between Quick buy and Quick view?', 'Quick buy adds a product to cart directly or opens a mini variant selector. Quick view opens a product detail overlay without leaving the collection page.'),
        ]
    ),
    'u-collection-list.liquid': (
        'Collection List',
        'The Collection List section displays a curated selection of collections in a grid or carousel. You add each collection manually as a block, choosing exactly which ones appear and in what order. Each block lets you override the collection image and title.',
        'Use it on the homepage or a landing page to help visitors navigate to the most important areas of your store.',
        ['Add only your most important collections. A focused selection of 3 to 6 performs better than an exhaustive list.'],
        [('Can I show all collections automatically?', 'No. This section requires manual blocks. For an automatic listing use the Collections List page section instead.')]
    ),
    'u-comparison-table.liquid': (
        'Comparison Table',
        'The Comparison Table displays a structured table comparing up to three products or plans side by side. Each row is a feature block and each column shows availability with a checkmark, an X, or custom text. One column can be highlighted as the recommended option.',
        'Use it on product pages, pricing pages, or landing pages when visitors need to decide between options.',
        [
            'Limit rows to the features that actually matter to buyers. More than 10 rows becomes overwhelming.',
            'The highlighted column should always be your most important or best-converting option.',
        ],
        [
            ('Can I add more than three columns?', 'No. The section supports a maximum of three columns.'),
            ('Can I use images in the rows?', 'No. Row cells support only a checkmark icon, an X icon, or short text.'),
        ]
    ),
    'u-contacts.liquid': (
        'Contact Form',
        'The Contact Form section displays a heading, a paragraph, an optional image, and a Shopify-native contact form. Submissions go directly to your store contact email. No third-party app is required.',
        'Add it to your contact page template or any page where you want visitors to reach you.',
        [
            'The form fields are fixed by Shopify and cannot be changed without custom code.',
            'Adding a phone number or address in the paragraph gives visitors an alternative way to contact you.',
        ],
        [
            ('Where do form submissions go?', 'They are sent to the email set as your store contact email in Shopify admin under Settings > Store details.'),
            ('Can I add custom fields to the form?', 'Not without custom code. The form fields are fixed at the Shopify platform level.'),
        ]
    ),
    'u-diagonal-texts.liquid': (
        'Diagonal Texts',
        'The Diagonal Texts section displays two rows of scrolling marquee text arranged at a diagonal angle, with optional icon or image dividers between them. It is a purely decorative motion section that adds energy and brand character.',
        'Use it as a visual separator between content sections on the homepage or campaign pages.',
        [
            'Set the two rows to scroll in opposite directions for a dynamic effect.',
            'Keep text short and repeatable. One or two words per item work well.',
        ],
        [('Can I stop the text from scrolling?', 'No. The scrolling marquee is the core behavior of this section and cannot be disabled.')]
    ),
    'u-drawer-cart.liquid': (
        'Drawer Cart',
        'The Drawer Cart is a slide-in cart panel that appears when a visitor adds an item or clicks the cart icon. It lets visitors review their cart, apply discount codes, see a free shipping progress bar, and proceed to checkout without leaving the current page. It also supports cross-sell product suggestions.',
        'This section is active globally and appears on every page. Configure it once in the Theme Editor.',
        [
            'Enable the free shipping bar if you have a free shipping threshold. It is one of the highest-impact cart incentives.',
            'The cross-sell product list is manually configured and shows the same products to all visitors.',
        ],
        [
            ('The Drawer Cart is not appearing. Why?', 'Make sure Cart type is set to Drawer in Theme Settings > Cart.'),
            ('The free shipping threshold does not match my settings.', 'The threshold here overrides the global one in Theme Settings > Cart. Make sure both match.'),
        ]
    ),
    'u-faq.liquid': (
        'FAQ',
        'The FAQ section displays questions and answers in an accordion format. Visitors click a question to expand the answer. You can group questions under titled headings and control vertical spacing between items.',
        'Add it to your homepage, product pages, or a dedicated FAQ page.',
        [
            'Use the questions your support team actually receives. Real questions perform better than hypothetical ones.',
            'Keep answers concise. If an answer needs more than three sentences, consider linking to a page instead.',
        ],
        [
            ('How many accordion items can I add?', 'There is no hard limit, but more than 10 to 15 questions is usually too many for one section.'),
            ('Can I add images inside an answer?', 'Not natively. The answer field supports rich text only.'),
        ]
    ),
    'u-featured-blog.liquid': (
        'Featured Blog',
        'The Featured Blog section displays the most recent articles from a selected blog as cards with a featured image, title, date, and excerpt. It updates automatically as you publish new articles.',
        'Use it on the homepage to show that your store has active content.',
        [
            'Connect it to a blog that is actively updated.',
            'Make sure your blog posts have featured images. Cards without images look incomplete.',
        ],
        [('Can I select specific articles to show?', 'No. The section automatically pulls the most recent posts from the selected blog.')]
    ),
    'u-featured-collection.liquid': (
        'Featured Collection',
        'The Featured Collection section displays a grid or carousel of products from a collection you choose. You can add Collection blocks to display products from multiple collections as tabs. It supports quick buy, quick view, and color swatches.',
        'Use it on the homepage to showcase a best-seller collection, new arrivals, or a curated selection.',
        [
            'Limit visible products to 4 to 8. Too many reduces urgency.',
            'Enable the View all button so visitors can see the full collection.',
        ],
        [
            ('Can I manually choose which products to show?', 'Not directly. Products come from the selected collection. Adjust sort order or visibility within the collection in Shopify admin.'),
            ('The tabs for multiple collections are not showing.', 'Add at least two Collection blocks from the block panel. Each block is one tab.'),
        ]
    ),
    'u-featured-data.liquid': (
        'Featured Data',
        'The Featured Data section displays animated number counters alongside a label and description. Each counter can be paired with a built-in illustration or a custom image. Use it to communicate key brand statistics.',
        'Use it on the homepage or About page to build credibility through numbers.',
        [
            'Use numbers that are genuinely impressive for your brand, not inflated.',
            'The symbol field lets you add a unit after the number, for example %, +, or k.',
        ],
        [('Do the numbers animate automatically?', 'Yes. The counters count up from zero when the section scrolls into view, provided Reveal sections on scroll is enabled in Theme Settings.')]
    ),
    'u-featured-product.liquid': (
        'Featured Product',
        'The Featured Product section embeds a full product detail experience anywhere on the page. It uses the same modular block system as the main Product Page section, letting you include title, price, variants, buy buttons, accordions, reviews, and more.',
        'Use it on the homepage to spotlight a hero product, or on landing pages for a single-product campaign.',
        [
            'Select a product with high-quality images.',
            'Keep the block count focused on the homepage: Title, Price, Variants, and Buy buttons are usually enough.',
        ],
        [
            ('Can I show multiple products in this section?', 'No. For multiple products use Featured Collection instead.'),
            ('The variant selector is not showing. Why?', 'Add the Variants block from the block panel. It does not appear by default.'),
        ]
    ),
    'u-footer.liquid': (
        'Footer',
        'The Footer appears at the bottom of every page. It supports multiple layout types and a flexible block system for text columns, navigation menus, a logo, and a newsletter signup. It also shows social icons, policy links, payment icons, and language or currency selectors.',
        'The Footer is a global section active on every page. Configure it once in the Theme Editor.',
        [
            'Include at minimum a menu with links to key pages and a newsletter signup.',
            'The column span setting on each block controls its width in the footer grid.',
        ],
        [
            ('How do I change the footer layout style?', 'Use the Top Footer setting.'),
            ('Social icons are not showing.', 'Social icons only appear if you have entered at least one URL in Theme Settings > Social media.'),
        ]
    ),
    'u-header-nav.liquid': (
        'Header and Navigation',
        'The Header and Navigation section controls the top bar of every page: logo, navigation menu, search, cart icon, and optional language and currency selectors. It supports four mega menu block types for rich dropdown navigation.',
        'The Header is a global section active on every page. Configure it once in the Theme Editor.',
        [
            'Use a sticky header so visitors always have access to navigation and the cart icon.',
            'If you use a transparent header on the homepage, upload a separate logo for the transparent state.',
            'Test your navigation carefully on mobile.',
        ],
        [
            ('How do I enable a mega menu?', 'Add a Mega menu block and set the Menu item to apply to field to exactly match the navigation item label. The match is case sensitive.'),
            ('The transparent header text is hard to read.', 'Adjust the Transparent header text color setting to contrast with your hero image.'),
            ('The search bar is not showing.', 'Make sure the Enable search setting is turned on in the header settings.'),
        ]
    ),
    'u-icon-list.liquid': (
        'Icon List',
        'The Icon List section displays a grid of cards combining an icon, a heading, and a short description. It is widely used for selling points, trust signals, product features, or shipping and returns policies.',
        'Use it below the hero on the homepage to communicate your key benefits.',
        [
            'Limit each card to a single clear point.',
            'Match icon size and stroke width to the overall visual weight of your brand.',
        ],
        [
            ('Can I use my own icons?', 'Yes. Each block has an image picker for a custom icon image.'),
            ('How do I center the icon above the text?', 'Set Icon position to Top and Content alignments to Center.'),
        ]
    ),
    'u-image-with-text.liquid': (
        'Image With Text',
        'The Image With Text section divides the page into two columns: one for an image and one for text content built with blocks. The image and text sides can be swapped. It is one of the most versatile sections in the theme.',
        'Use it whenever you need to pair a visual with explanatory content.',
        [
            'Upload a separate mobile image to ensure correct cropping on smaller screens.',
            'For a storytelling layout, stack multiple Image With Text sections alternating the image side.',
        ],
        [('Can I add a video instead of an image?', 'Not in this section. For video with text, use the Promo Banner section instead.')]
    ),
    'main-404.liquid': (
        '404 Page',
        'The 404 Page section is displayed automatically when a visitor lands on a URL that does not exist. It shows a heading, a descriptive message, and two configurable buttons to help visitors get back on track.',
        'This section is part of the 404 template and is always active on error pages.',
        ['Write a friendly and on-brand error message.'],
        [('Can I add an image to the 404 page?', 'Not natively. The layout is text and buttons only.')]
    ),
    'main-article-banner.liquid': (
        'Article Banner',
        'The Article Banner appears at the top of every blog post and displays the article title, metadata (author, date, tags, comments), and an optional hero image. It is part of the article template and inherits its content from the published blog post automatically.',
        'This section is part of the article template. Configure it once and it applies to all blog articles.',
        ['Upload a hero image directly in Shopify admin when writing the article for the best result.'],
        [('The hero image is not showing. Why?', 'Make sure Show article image is enabled and the article has a featured image assigned in Shopify admin.')]
    ),
    'main-article-overlay.liquid': (
        'Article Content',
        'The Article Content section renders the body of a blog post along with optional sharing buttons, previous and next post navigation, and a comments section.',
        'This section is part of the article template and is always active on blog post pages.',
        [
            'Enable the Share block to let readers share articles on social media.',
            'Enable the Previous and next posts block to keep readers engaged after finishing an article.',
        ],
        [('The comments section is not showing.', 'Add the Comments block from the block panel and make sure comments are enabled for the blog in Shopify admin.')]
    ),
    'main-blog.liquid': (
        'Blog Listing',
        'The Blog Listing section displays all posts from a blog in a grid or collage layout. Visitors can filter posts by tag and paginate through large numbers of articles.',
        'This section is part of the blog template and is active on all blog index pages automatically.',
        [
            'Enable tag filtering if your blog has clearly defined categories.',
            'Make sure all articles have a featured image. The layout looks significantly better with images.',
        ],
        [('Can I show articles from multiple blogs on the same page?', 'No. Each blog page shows articles from one blog only.')]
    ),
    'main-page.liquid': (
        'Page Content',
        'The Page Content section renders the content of a standard Shopify page exactly as written in the page editor. It optionally displays an additional heading and subheading above the page content.',
        'This section is part of the page template and active on all standard pages by default.',
        ['For rich content with images and formatted text, write it in the Shopify page editor.'],
        [('Can I add sections to a standard page?', 'Yes. From the Theme Editor, add sections above or below this section on the page template.')]
    ),
    'main-password-header.liquid': (
        'Password Page Header',
        'The Password Page Header appears at the top of the password-protected coming soon page. It shows your store logo and the selected color scheme.',
        'Active automatically when your store is password protected.',
        ['Make sure your logo is set in Theme Settings before the store goes live.'],
        []
    ),
    'main-password-footer.liquid': (
        'Password Page Footer',
        'The Password Page Footer appears at the bottom of the coming soon page and shows the Powered by Shopify notice.',
        'Active automatically when your store is password protected.',
        [], []
    ),
    'main-search.liquid': (
        'Search Results',
        'The Search Results section displays the output of a search query, showing matching products, articles, and pages with support for filtering and sorting.',
        'This section is part of the search results template and active whenever a visitor performs a search.',
        ['Enable filtering and sorting to make it easier for visitors to narrow down results.'],
        [('Products are not appearing in search results.', 'Shopify indexes products based on title, description, and tags. Make sure products are published and have descriptive content.')]
    ),
    'u-main-cart-items.liquid': (
        'Cart Page',
        'The Cart Page section renders the full cart on the /cart page, including line items, discount code, cart notes, a terms checkbox, payment icons, and the checkout button.',
        'Active on the cart page when Cart type is set to Page in Theme Settings > Cart.',
        ['Enable the free shipping bar here with the same threshold as the Drawer Cart for a consistent experience.'],
        [('The discount code field is not showing.', 'Enable the Show discount code input setting in this section.')]
    ),
    'u-main-collection-list.liquid': (
        'Collections List Page',
        'The Collections List Page section automatically displays all published collections in your store in a grid layout with pagination. Unlike the Collection List section, no manual block configuration is needed.',
        'This section is part of the list-collections template and active on the /collections page.',
        ['Make sure all collections have featured images assigned in Shopify admin.'],
        [('Can I exclude specific collections?', 'Not natively. All published collections appear. To hide one, make it unlisted.')]
    ),
    'u-main-product.liquid': (
        'Product Page',
        'The Product Page section is the core of your product detail page. It is fully modular: build the content column by adding and reordering blocks for title, price, description, variants, buy buttons, reviews, accordions, trust badges, and more. This section has the most direct impact on your store conversion rate.',
        'This section is part of the product template and active on every product detail page.',
        [
            'Order blocks with conversion in mind: Title, Price, Variants, and Buy buttons should always be above the fold.',
            'Add the Inventory block to create urgency by showing low stock counts.',
            'Use the Accordion block for lengthy content like descriptions, size guides, or care instructions.',
        ],
        [
            ('The variant selector is not showing.', 'Add the Variants block from the block panel. It does not appear by default.'),
            ('How do I remove the dynamic checkout button (Shop Pay, PayPal)?', 'Disable Show dynamic checkout buttons in the Buy buttons block settings.'),
            ('Product images are showing in the wrong order.', 'Image order follows the order set in Shopify admin under the product media tab.'),
            ('The sticky add to cart bar is not appearing.', 'Make sure Sticky add to cart is enabled in the section settings and the Buy buttons block is in the block list.'),
        ]
    ),
    'u-multicolumn.liquid': (
        'Multicolumn',
        'The Multicolumn section displays a row of cards in a fixed grid. Each card can contain an image, heading, text, and button. It is used to present categories, team members, process steps, or any content that benefits from a side-by-side layout.',
        'Use it when you need to present multiple items of equal weight in a clean, structured way.',
        ['Match the number of blocks to your column count to avoid orphaned cards on the last row.'],
        [('Can each column have a different background color?', 'No. The background is uniform across all columns, set by the section color scheme.')]
    ),
    'u-newsletter-section.liquid': (
        'Newsletter',
        'The Newsletter section displays a full-width email signup form with a block-based content area for heading, supporting text, and the form. Subscribers are added directly to the Shopify Email customer list.',
        'Use it at the bottom of the homepage or at the end of key landing pages.',
        [
            'Add an incentive in the paragraph block to increase signups, for example a discount code.',
            'Keep the heading short and benefit-focused.',
        ],
        [('Where do subscribers go?', 'They are added as customers in Shopify admin tagged as email subscribers.')]
    ),
    'u-popup-newsletter.liquid': (
        'Newsletter Popup',
        'The Newsletter Popup is a timed overlay that appears after a set delay. Once dismissed, a cookie prevents it from showing again for the number of days you configure.',
        'Configure it once in the Theme Editor. It activates globally on the pages you choose.',
        [
            'Set a delay of at least 5 seconds so the popup does not interrupt visitors immediately.',
            'Set the expiry to at least 14 days so returning visitors are not repeatedly interrupted.',
        ],
        [
            ('The popup is not appearing.', 'After dismissing once, the cookie blocks it. Clear your browser cookies and reload the page to test.'),
            ('Can I show the popup only on mobile?', 'No. It appears on all devices.'),
        ]
    ),
    'u-promo-banner.liquid': (
        'Promo Banner',
        'The Promo Banner section displays a full-width promotional area with a large data value display (a number and symbol like 70%), a heading, a paragraph, and a button. The background can be a static image or a looping video.',
        'Use it on the homepage or campaign pages to communicate a time-sensitive offer or a key brand benefit.',
        [
            'Use the data value and symbol fields to make the core offer as large and readable as possible.',
            'For video backgrounds, keep the file short (under 10 MB) and remove the audio track.',
        ],
        [('Can I use both a video and an image as the background?', 'If you upload a video file, it takes priority over the image. Upload a separate mobile video or image for the mobile experience.')]
    ),
    'u-quotes.liquid': (
        'Quotes Carousel',
        'The Quotes Carousel displays customer testimonials or editorial quotes in a rotating carousel. Each block contains the quote text and the author name.',
        'Use it on the homepage, About page, or product pages to build trust through social proof.',
        [
            'Use real, specific quotes rather than generic praise.',
            'Three to five quotes is enough. More than that and visitors rarely see the later ones.',
        ],
        [('Can I add a customer photo next to the quote?', 'Not in this section. For photo-based reviews use the Reviews Showcase section instead.')]
    ),
    'u-related-products.liquid': (
        'Related Products',
        'The Related Products section displays a carousel or grid of products related to the one currently being viewed. Shopify selects related products automatically based on tags, collections, and purchase history.',
        'Typically placed at the bottom of the product page template to encourage further browsing.',
        ['Keep the number of visible products between 4 and 6.'],
        [('Can I manually choose which related products to show?', 'No. Related products are determined automatically by Shopify. To influence recommendations, ensure products are correctly tagged.')]
    ),
    'u-reviews-showcase.liquid': (
        'Reviews Showcase',
        'The Reviews Showcase section displays customer review cards in a carousel with an overall star rating at the top. Each review block contains the reviewer photo, name, role, a star rating, and the review text. Reviews are added manually as blocks.',
        'Use it on the homepage or product pages as a dedicated social proof section.',
        [
            'Use specific, detailed reviews. Generic short reviews add little credibility.',
            'Include reviewer photos where possible. Cards with photos perform better than text-only ones.',
        ],
        [('Do these reviews sync with a review app?', 'No. Reviews are added manually. For live sync use the review app own embed blocks.')]
    ),
    'u-rich-text.liquid': (
        'Rich Text',
        'The Rich Text section is a minimal text layout with a heading, body text, and optional button. It is typically used as an introductory block, a transitional statement between sections, or a brand mission statement.',
        'Use it when you need to communicate something in words without a visual element.',
        ['Keep the content short and focused on one idea.'],
        [('Can I add an image inside a Rich Text section?', 'Not in this section. Use Image With Text instead.')]
    ),
    'u-scrolling-pills.liquid': (
        'Scrolling Pills',
        'The Scrolling Pills section displays a horizontal row of interactive pill-shaped tags that scroll across the screen. Each pill shows a front label and can reveal a back label or image on hover. Clicking a pill navigates to a linked URL.',
        'Use it as a visual navigation aid on the homepage or to add interactive motion between sections.',
        [
            'The flip effect works best when front and back labels are short and complementary.',
            'Add a URL to each pill to make them functional navigation elements, not just decorative.',
        ],
        []
    ),
    'u-scrolling-text.liquid': (
        'Scrolling Text',
        'The Scrolling Text section is a continuous horizontal marquee of text and optional icon or image dividers. It is a purely decorative motion section that adds energy and brand personality between content sections.',
        'Use it as a visual separator between sections on the homepage.',
        [
            'Keep text items short: one to three words each.',
            'Use opposite scroll directions on stacked Scrolling Text sections for a more dynamic effect.',
        ],
        [('Can I pause the scrolling on hover?', 'No. The marquee runs continuously and does not pause on hover.')]
    ),
    'u-spotlighted-product.liquid': (
        'Spotlighted Product',
        'The Spotlighted Product section frames a single product as a full-width hero with a large scrolling text marquee running behind the product image. Feature Slide blocks let you add additional gallery images alongside the main product.',
        'Use it on the homepage to give a hero product or new launch the highest possible visual prominence.',
        [
            'Use a PNG product image with a transparent background for the cleanest result.',
            'Enable the Glass Effect for a frosted-glass background that separates the product from the scrolling text.',
        ],
        [('Can I spotlight multiple products in the same section?', 'No. For multi-product carousels use Featured Collection or Advanced Product Carousel instead.')]
    ),
    'u-sticky-section.liquid': (
        'Sticky Section',
        'The Sticky Section is a two-column layout where one side (an image) stays fixed on screen as the visitor scrolls, while the other side (built from Content blocks) scrolls through headings and text. It creates a storytelling format ideal for explaining features step by step.',
        'Use it on the homepage or product landing pages to walk visitors through key benefits.',
        [
            'Plan the number of content blocks around how much vertical scroll you want. Three to five blocks is a good range.',
            'Each content block should communicate a single complete idea.',
        ],
        [('The sticky image is not sticking. Why?', 'The sticky behavior depends on the total height of the content blocks. Add more blocks or increase padding if the content is too short to trigger the effect.')]
    ),
    'u-store-locator.liquid': (
        'Store Locator',
        'The Store Locator section displays an interactive Google Maps map with pinned markers for each physical store location. Each location is added as a block with name, address, coordinates, and optional custom marker. A search input can filter visible markers.',
        'Use it on a dedicated store locator page or on the Contact page for brands with physical retail.',
        [
            'You need a Google Maps API key with the Maps JavaScript API enabled.',
            'Find exact coordinates by right-clicking a location in Google Maps.',
        ],
        [
            ('The map is not loading.', 'Check that your Google Maps API key is valid and has the Maps JavaScript API enabled in Google Cloud Console.'),
            ('Can I add a phone number to the location block?', 'Yes. Use the Store info field to add any contact details including phone numbers or emails.'),
        ]
    ),
    'u-then-vs-now.liquid': (
        'Then vs Now',
        'The Then vs Now section displays two images in a before-and-after slider controlled by dragging a handle. It is used for product transformations, before-and-after results, or comparing old and new versions.',
        'Use it when showing both states simultaneously is more powerful than showing them separately.',
        [
            'The two images should be the same dimensions and aspect ratio to align correctly.',
            'Label each side clearly using the Heading field in each block.',
        ],
        [
            ('Can I add more than two images?', 'No. The section is designed for exactly two images.'),
            ('Does the slider work on touch screens?', 'Yes. The slider handle responds to touch and drag on mobile and tablet.'),
        ]
    ),
    'u-touch-and-take.liquid': (
        'Touch and Take',
        'The Touch and Take section overlays a lifestyle image with interactive product hotspots. Visitors tap or click a hotspot to reveal a product card with name, price, and a quick-add button.',
        'Use it on the homepage or campaign pages to make lifestyle photography directly shoppable.',
        [
            'Lifestyle images with multiple products in the scene work best.',
            'Keep the number of hotspots to 3 or 4 maximum.',
        ],
        [('The hotspot position looks different on mobile.', 'Use the separate horizontal and vertical mobile position fields to fine-tune placement on smaller screens.')]
    ),
    'u-ugc-carousel.liquid': (
        'UGC Carousel',
        'The UGC Carousel displays a horizontal carousel of video or image cards styled to look like social media content. Each card supports a video file or URL, an image fallback, a label badge, a title, and body text.',
        'Use it on the homepage or product pages to display customer videos, unboxing content, or testimonial clips.',
        [
            'Short vertical videos (9:16 ratio) look best in this carousel.',
            'Enable autoplay on each card for the most engaging experience.',
        ],
        [
            ('Can I embed videos from YouTube or Vimeo?', 'Yes. Use the Or embed video from Youtube or Vimeo url field and paste the URL.'),
            ('The video will not play.', 'Make sure the video URL is a valid public link. For uploaded files, check the format is MP4.'),
        ]
    ),
    'custom-liquid.liquid': (
        'Custom Liquid',
        'The Custom Liquid section lets you inject raw Liquid code directly into a page. It is intended for developers who need to add custom functionality, embed third-party scripts, or render dynamic content that standard sections do not support.',
        'Use it only when you need something that cannot be achieved with the built-in sections. It requires knowledge of Shopify Liquid templating.',
        ['Always test custom code in a development store or theme preview before publishing.'],
        [('Is Custom Liquid safe?', 'Liquid runs server-side. Be careful with any JavaScript you inject, as it runs in the visitor browser.')]
    ),
}
