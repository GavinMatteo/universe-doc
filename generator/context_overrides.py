# context_overrides.py
# Setting descriptions that depend on WHERE the setting appears.
# Key format: 'filename.liquid' for section-level, 'filename.liquid::block_type' for block-level.
# These override the generic description in descriptions.py for that specific context.

CONTEXT_OVERRIDES = {
    # Bold Slideshow section-level: height is the slideshow height, not a spacing block height
    'u-bold-slideshow.liquid': {
        'height': 'Controls how tall the slideshow appears on desktop. Choose from preset options including full screen.',
        'height_mobile': 'Controls how tall the slideshow appears on mobile. Can be set independently from desktop.',
    },
    # Before and After Slider: height is the section height
    'u-then-vs-now.liquid': {
        'height': 'Controls how tall the section appears on desktop. Choose from preset options.',
        'height_mobile': 'Controls how tall the section appears on mobile.',
    },
    # Image With Text: height is the image height
    'u-image-with-text.liquid': {
        'height': 'Controls the height of the image column. Adapt uses the natural height of the uploaded image.',
    },
    # Slideshow blocks: overlay_color is for image overlay, not popup
    'u-bold-slideshow.liquid::image-slide': {
        'overlay_color': 'A color tint applied on top of the background image to improve text readability. Black by default, but you can use any brand color.',
    },
    'u-bold-slideshow.liquid::video-slide': {
        'overlay_color': 'A color tint applied on top of the background video to improve text readability.',
    },
    # Product Hero Slideshow: per-slide overlay
    'u-advanced-hero-slideshow.liquid::advanced_slide': {
        'overlay_color': 'A color tint applied on top of the slide background image.',
    },
    # Drawer cart: color_scheme is the main drawer palette
    'u-drawer-cart.liquid': {
        'color_scheme': 'The color palette applied to the main cart drawer panel.',
    },
    # Store locator: enable_search has a specific meaning
    'u-store-locator.liquid': {
        'enable_search': 'Shows a search input that filters visible store pins as the visitor types.',
    },
    # Header nav: enable_search opens the search overlay
    'u-header-nav.liquid': {
        'enable_search': 'Shows a search icon in the header that opens a full search overlay when clicked.',
        'cart_style': 'Controls the appearance of the cart icon in the header. Choose between a bag or a cart icon style.',
    },
}
