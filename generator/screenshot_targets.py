"""Section -> (URL path, CSS selector for the section root) mapping.

Each entry tells capture_screenshots.py:
- where to find a representative instance of the section on the storefront
- which CSS selector wraps the section root, used for the screenshot bounding box
- what to name the output file (lives in theme-docs/assets/screenshots/)

Universe convention so far: u-{name}.liquid -> wrapper class .{name}__section.
If a section appears on multiple pages, pick the page where it is configured
most representatively.
"""

CAPTURE_TARGETS = {
    'u-bold-slideshow.liquid': {
        'path': '/',
        'selector': '.bold-slideshow__section',
        'output': 'bold-slideshow.png',
    },
}
