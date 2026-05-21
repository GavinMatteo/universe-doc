"""Section -> screenshot files mapping for the doc generator.

Each key is a section liquid filename (matching SECTION_META in section_meta.py).
Each value is a list of screenshots to embed in the rendered markdown, in order.

The generator inserts the images at the top of the section page, right after the
intro and "When to use it" line, before the in-page TOC. Captions are rendered
as italic text below each image.

File paths in this dict are relative to theme-docs/assets/screenshots/. The
generator computes the correct relative URL for the markdown file's depth
(root section vs sections/ subfolder).

To add screenshots for a new section:
1. Capture the image with generator/capture_screenshots.py (preferred) or by hand
2. Drop the PNG into theme-docs/assets/screenshots/
3. Add an entry below
4. Re-run generate.py
"""

SECTION_SCREENSHOTS = {
    'u-bold-slideshow.liquid': [
        {
            'file': 'bold-slideshow.png',
            'caption': 'Bold Slideshow on the homepage.',
        },
    ],
}
