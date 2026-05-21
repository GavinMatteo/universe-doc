#!/usr/bin/env python3
"""
Developpy Theme Documentation Generator
Usage: python3 generate_final.py <theme_zip_path> <output_dir>
Reads descriptions.py and section_meta.py from the same directory.
"""

import json, re, os, sys, zipfile, shutil, tempfile

# ── helpers ──────────────────────────────────────────────────────────────────

def load_labels(theme_dir):
    """Load English labels from en.default.schema.json"""
    schema_path = os.path.join(theme_dir, 'locales', 'en.default.schema.json')
    if not os.path.exists(schema_path):
        return {}
    with open(schema_path, 'r', encoding='utf-8') as f:
        raw = f.read()
    raw = re.sub(r'/\*.*?\*/', '', raw, flags=re.DOTALL)
    raw = re.sub(r',\s*([\]\}])', r'\1', raw)
    try:
        data = json.loads(raw)
    except:
        return {}
    def flatten(obj, prefix=''):
        result = {}
        if isinstance(obj, dict):
            for k, v in obj.items():
                new_prefix = f'{prefix}.{k}' if prefix else k
                if isinstance(v, str):
                    result[new_prefix] = v
                else:
                    result.update(flatten(v, new_prefix))
        return result
    return flatten(data)

ITALIAN_OVERRIDES = {
    'messages_type': 'Message type',
    'marquee_message': 'Marquee message',
    'bottom-text-block': 'Bottom text',
}

def get_label(t_key, sid, all_labels):
    if sid in ITALIAN_OVERRIDES:
        return ITALIAN_OVERRIDES[sid]
    if not t_key or not t_key.startswith('t:'):
        return t_key or sid
    return all_labels.get(t_key[2:], '') or sid.replace('_', ' ').title()

def load_schema(fpath):
    with open(fpath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    m = re.search(r'\{%[-\s]*schema[-\s]*%\}(.*?)\{%[-\s]*endschema[-\s]*%\}', content, re.DOTALL)
    if not m:
        return None
    raw = re.sub(r',\s*([\]\}])', r'\1', m.group(1).strip())
    try:
        return json.loads(raw)
    except:
        return None

def group_settings(settings):
    content, colors, spacing = [], [], []
    for s in settings:
        if s.get('type') in ('header', 'paragraph'):
            continue
        sid = s.get('id', '')
        if sid in ('color_scheme', 'enable_custom_background'):
            colors.append(s)
        elif any(x in sid for x in ('padding', 'margin')):
            spacing.append(s)
        else:
            content.append(s)
    return content, colors, spacing

def render_table(settings, all_labels, descriptions, context_descriptions=None):
    rows = [s for s in settings if s.get('type') not in ('header', 'paragraph')]
    if not rows:
        return ''
    lines = ['| Setting | What it does |', '|---|---|']
    for s in rows:
        sid = s.get('id', '')
        label = get_label(s.get('label', ''), sid, all_labels)
        # Use context-specific description if available, else fall back to generic
        desc = ''
        if context_descriptions and sid in context_descriptions:
            desc = context_descriptions[sid]
        else:
            desc = descriptions.get(sid, '')
        lines.append(f'| **{label}** | {desc} |')
    return '\n'.join(lines) + '\n\n'

def make_anchor(text):
    """Convert heading text to GitBook-compatible anchor.
    Replaces invalid characters with '-' (not strip), collapses runs, trims edges.
    Example: 'Vendor/SKU' -> 'vendor-sku'; '⚙️ Section Settings' -> 'section-settings'.
    """
    s = re.sub(r'[^a-z0-9-]', '-', text.lower().replace(' ', '-'))
    return re.sub(r'-+', '-', s).strip('-')

def build_toc(schema, meta_blocks, has_tips=True, has_faq=True):
    """Build in-page table of contents.
    has_tips and has_faq control whether to include those anchors — only include
    them when the corresponding meta is actually present, otherwise the anchor
    has no matching heading.
    """
    items = []
    items.append('- [Section Settings](#section-settings)')
    settings = schema.get('settings', [])
    content_s, color_s, spacing_s = group_settings(settings)
    sub = []
    if content_s:
        sub.append('  - [Content and Layout](#content-and-layout)')
    if color_s:
        sub.append('  - [Colors](#colors)')
    if spacing_s:
        sub.append('  - [Spacing](#spacing)')
    items.extend(sub)

    blocks = schema.get('blocks', [])
    if blocks:
        items.append('- [Blocks](#blocks)')
        for b in blocks:
            btype = b.get('type', '')
            if btype == 'shape_divider':
                items.append('  - [Shape Divider](#shape-divider)')
            elif btype == '@app':
                items.append('  - [App Block](#app-block)')
            else:
                bname = meta_blocks.get(btype, btype.replace('-', ' ').replace('_', ' ').title())
                anchor = make_anchor(bname)
                items.append(f'  - [{bname}](#{anchor})')

    if has_tips:
        items.append('- [Tips](#tips)')
    if has_faq:
        items.append('- [FAQ](#faq)')
    return '\n'.join(items)

def write_section_doc(fname, schema, meta, all_labels, descriptions, context_overrides):
    title, intro, when, tips, faq = meta
    settings = schema.get('settings', [])
    blocks = schema.get('blocks', [])

    content_s, color_s, spacing_s = group_settings(settings)

    # Build block name map for TOC
    block_name_map = {}
    for b in blocks:
        btype = b.get('type', '')
        bname_raw = b.get('name', '')
        bname = get_label(bname_raw, btype, all_labels)
        block_name_map[btype] = bname

    lines = []
    lines.append(f'# {title}\n')
    lines.append(f'{intro}\n')
    if when:
        lines.append(f'📌 **When to use it:** {when}\n')
    lines.append('\n')

    # In-page TOC
    toc = build_toc(schema, block_name_map, has_tips=bool(tips), has_faq=bool(faq))
    lines.append('**On this page**\n')
    lines.append(toc + '\n')
    lines.append('\n---\n')

    # Section settings
    if content_s or color_s or spacing_s:
        lines.append('## ⚙️ Section Settings\n')
        ctx = context_overrides.get(fname, {})
        if content_s:
            lines.append('### Content and Layout\n')
            lines.append(render_table(content_s, all_labels, descriptions, ctx))
        if color_s:
            lines.append('### Colors\n')
            lines.append(render_table(color_s, all_labels, descriptions))
        if spacing_s:
            lines.append('### Spacing\n')
            lines.append(render_table(spacing_s, all_labels, descriptions))

    # Blocks
    has_real_blocks = any(b.get('type') != 'shape_divider' for b in blocks)
    if blocks:
        lines.append('---\n\n## 🧩 Blocks\n')
        for block in blocks:
            btype = block.get('type', '')
            if btype == '@app':
                lines.append('### App Block\n')
                lines.append('Supports third-party app blocks from the Shopify App Store, for example review apps or loyalty programs.\n\n')
                continue
            if btype == 'shape_divider':
                lines.append('### Shape Divider\n')
                lines.append('Adds a decorative SVG shape at the top or bottom of the section to create a smooth visual transition into the next section.\n\n')
                bs = block.get('settings', [])
                if bs:
                    lines.append(render_table(bs, all_labels, descriptions))
                continue
            bname = get_label(block.get('name', ''), btype, all_labels)
            lines.append(f'### {bname}\n')
            bs = block.get('settings', [])
            real_bs = [s for s in bs if s.get('type') not in ('header', 'paragraph')]
            if real_bs:
                bc, bco, bsp = group_settings(bs)
                block_ctx = context_overrides.get(f'{fname}::{btype}', {})
                if bc:
                    lines.append(render_table(bc, all_labels, descriptions, block_ctx))
                if bco:
                    lines.append('**Colors**\n\n')
                    lines.append(render_table(bco, all_labels, descriptions))
                if bsp:
                    lines.append('**Spacing**\n\n')
                    lines.append(render_table(bsp, all_labels, descriptions))
            else:
                lines.append('_No configurable settings._\n\n')

    # Tips
    if tips:
        lines.append('---\n\n## 💡 Tips\n\n')
        for tip in tips:
            lines.append(f'- {tip}\n')
        lines.append('\n')

    # FAQ
    if faq:
        lines.append('---\n\n## ❓ FAQ\n\n')
        for q, a in faq:
            lines.append(f'**{q}**\\\n{a}\n\n')

    return '\n'.join(lines)


def write_theme_settings(theme_dir, all_labels, descriptions, schema_labels, out_path):
    settings_path = os.path.join(theme_dir, 'config', 'settings_schema.json')
    with open(settings_path, 'r') as f:
        raw = re.sub(r',\s*([\]\}])', r'\1', f.read())
    global_schema = json.loads(raw)

    def get_sl(key, fallback=''):
        return schema_labels.get(f'settings_schema.{key}', fallback)

    GROUP_DESC = {
        'Colors': 'Defines the base color palettes for your store. Each palette sets the background, text, button, and link colors. Sections reference these palettes by name.',
        'Logo': 'Configure your store logo and favicon.',
        'Typography': 'Controls fonts, sizes, and letter spacing for headings, body text, and buttons across the entire store.',
        'Layout': 'Sets the maximum page width, side gutters, and global border radius options that apply to all sections.',
        'Buttons': 'Configures border thickness for outlined buttons across the store.',
        'Color swatch': 'Configures how product variant color swatches are displayed on product and collection cards.',
        'Labels': 'Configures the appearance of Sold Out, Sale, and Custom product labels on product cards, including their typography.',
        'Animations': 'Controls scroll-triggered reveal animations that apply across the entire store.',
        'Cart': 'Configures global cart behavior including cart type, the free shipping progress bar, and cart note visibility.',
        'Floating header': 'Enables and styles the floating header, a rounded header panel that detaches from the page edge and follows the visitor as they scroll.',
        'Quick add': 'Sets the color scheme for the quick add overlay that appears on product cards.',
        'Breadcrumbs': 'Configures where breadcrumb navigation is shown across the store.',
        'Favicon': 'Sets the small icon shown in browser tabs.',
        'Currency codes': 'Controls whether currency codes (for example USD or EUR) are displayed alongside prices.',
        'Gift card': 'Configures the brand mark and visual style of gift card pages.',
        'Social media': 'Stores your social media profile URLs and configures sharing options.',
    }

    # Typography sub-group labels for disambiguation
    TYPO_GROUPS = [
        ('Headings', ['type_header_font', 'heading_scale', 'heading_line_height', 'heading_letter_spacing']),
        ('Header navigation', ['header_font', 'font_header_weight', 'header_scale', 'header_letter_spacing', 'header_uppercase']),
        ('Body text', ['type_body_font', 'body_scale', 'body_line_height', 'body_letter_spacing']),
        ('Buttons', ['type_button_font', 'buttons_scale', 'buttons_letter_spacing', 'buttons_uppercase']),
    ]

    # Layout sub-groups for disambiguation
    LAYOUT_GROUPS = [
        ('Border Radius', ['blocks_border_radius', 'card_border_radius', 'buttons_border_radius', 'global_border_radius', 'buttons_radius']),
        ('Page dimensions', ['max_width', 'page_gutter', 'global_border_thickness']),
    ]

    lines = []
    lines.append('# Theme Settings\n\n')
    lines.append('Theme Settings are global options that affect the entire store, independent of any individual section. ')
    lines.append('Access them in the Theme Editor by clicking **Theme settings** at the bottom of the left panel.\n\n')

    # Build in-page TOC
    lines.append('**On this page**\n\n')
    for group in global_schema:
        gname_raw = group.get('name', '')
        if gname_raw == 'theme_info':
            continue
        if gname_raw.startswith('t:'):
            key = gname_raw[2:]
            if not key.endswith('.name'):
                key = key + '.name'
            gname = schema_labels.get(key, gname_raw)
        else:
            gname = gname_raw
        anchor = make_anchor(gname)
        lines.append(f'- [{gname}](#{anchor})\n')
    lines.append('\n---\n\n')

    for group in global_schema:
        gname_raw = group.get('name', '')
        if gname_raw == 'theme_info':
            continue
        if gname_raw.startswith('t:'):
            key = gname_raw[2:]
            if not key.endswith('.name'):
                key = key + '.name'
            gname = schema_labels.get(key, gname_raw)
        else:
            gname = gname_raw

        desc = GROUP_DESC.get(gname, '')
        lines.append(f'## {gname}\n\n')
        if desc:
            lines.append(f'{desc}\n\n')

        settings = [s for s in group.get('settings', []) if s.get('type') not in ('header', 'paragraph')]
        if not settings:
            lines.append('_No configurable settings._\n\n')
            continue

        # Special handling for Typography: split into sub-groups
        if gname == 'Typography':
            settings_by_id = {s.get('id',''): s for s in settings}
            for subgroup_name, ids in TYPO_GROUPS:
                lines.append(f'### {subgroup_name}\n\n')
                lines.append('| Setting | What it does |\n|---|---|\n')
                for sid in ids:
                    s = settings_by_id.get(sid)
                    if not s:
                        continue
                    label_raw = s.get('label','')
                    label = schema_labels.get(label_raw[2:], sid) if label_raw.startswith('t:') else (label_raw or sid)
                    desc_val = descriptions.get(sid, '')
                    lines.append(f'| **{label}** | {desc_val} |\n')
                lines.append('\n')
            continue

        # Special handling for Layout: split into sub-groups
        if gname == 'Layout':
            settings_by_id = {s.get('id',''): s for s in settings}
            for subgroup_name, ids in LAYOUT_GROUPS:
                lines.append(f'### {subgroup_name}\n\n')
                lines.append('| Setting | What it does |\n|---|---|\n')
                for sid in ids:
                    s = settings_by_id.get(sid)
                    if not s:
                        continue
                    label_raw = s.get('label','')
                    label = schema_labels.get(label_raw[2:], sid) if label_raw.startswith('t:') else (label_raw or sid)
                    desc_val = descriptions.get(sid, '')
                    lines.append(f'| **{label}** | {desc_val} |\n')
                lines.append('\n')
            continue

        # Special handling for Colors: skip color_schemes raw ID row
        if gname == 'Colors':
            lines.append('| Setting | What it does |\n|---|---|\n')
            for s in settings:
                sid = s.get('id','')
                if sid == 'color_schemes':
                    lines.append('| **Color Schemes** | The set of color palettes available in the theme. Each palette defines background, text, button, and link colors. Sections select which palette to use. |\n')
                    continue
                label_raw = s.get('label','')
                label = schema_labels.get(label_raw[2:], sid) if label_raw.startswith('t:') else (label_raw or sid)
                desc_val = descriptions.get(sid, '')
                lines.append(f'| **{label}** | {desc_val} |\n')
            lines.append('\n')
            continue

        # Default rendering
        lines.append('| Setting | What it does |\n|---|---|\n')
        for s in settings:
            sid = s.get('id','')
            label_raw = s.get('label','')
            label = schema_labels.get(label_raw[2:], sid) if label_raw.startswith('t:') else (label_raw or sid)
            desc_val = descriptions.get(sid, '')
            lines.append(f'| **{label}** | {desc_val} |\n')
        lines.append('\n')

    with open(out_path, 'w') as f:
        f.write(''.join(lines))


def write_index(categories, out_path, existing_files):
    lines = []
    lines.append('# Documentation Index\n\n')
    lines.append('Complete reference for all sections, blocks, settings, and theme configuration.\n\n')
    lines.append('> All setting names match exactly what you see in the Shopify Theme Editor.\n\n')
    lines.append('---\n\n')
    for cat, files in categories:
        lines.append(f'## {cat}\n\n')
        for f in files:
            if f not in existing_files:
                continue
            # Derive human name from filename
            name = f.replace('.md','').replace('-',' ').replace('_',' ').title()
            lines.append(f'- [{name}]({f})\n')
        lines.append('\n')
    with open(out_path, 'w') as f:
        f.write(''.join(lines))


# Section files that live in the root of out_dir (theme-docs/) rather than out_dir/sections/.
# These are global chrome (header, footer, drawer, popup, announcement bar) and
# main-* page templates (product, blog, search, page, password, 404, article, collection grid, cart).
ROOT_SECTIONS = {
    'u-announcement-bar.liquid',
    'u-drawer-cart.liquid',
    'u-footer.liquid',
    'u-header-nav.liquid',
    'u-popup-newsletter.liquid',
    'main-404.liquid',
    'main-article-banner.liquid',
    'main-article-overlay.liquid',
    'main-blog.liquid',
    'main-page.liquid',
    'main-password-footer.liquid',
    'main-password-header.liquid',
    'main-search.liquid',
    'u-collection-grid-banner.liquid',
    'u-collection-grid-product.liquid',
    'u-main-cart-items.liquid',
    'u-main-collection-list.liquid',
    'u-main-product.liquid',
}


def output_filename(liquid_name):
    """Map a section liquid filename to its markdown output filename.
    u-main-cart-items.liquid -> main-cart-items.md  (strip leading 'u-')
    main-blog.liquid         -> blog.md             (strip leading 'main-')
    u-bold-slideshow.liquid  -> bold-slideshow.md   (strip leading 'u-')
    custom-liquid.liquid     -> custom-liquid.md    (no prefix)
    """
    name = liquid_name
    if name.startswith('u-main-'):
        name = name[2:]
    elif name.startswith('main-'):
        name = name[5:]
    elif name.startswith('u-'):
        name = name[2:]
    return name.replace('.liquid', '.md')


def load_schema_labels(theme_dir):
    """Load nested schema_labels from en.default.schema.json (same file as load_labels)."""
    schema_path = os.path.join(theme_dir, 'locales', 'en.default.schema.json')
    if not os.path.exists(schema_path):
        return {}
    with open(schema_path, 'r', encoding='utf-8') as f:
        raw = f.read()
    raw = re.sub(r'/\*.*?\*/', '', raw, flags=re.DOTALL)
    raw = re.sub(r',\s*([\]\}])', r'\1', raw)
    try:
        data = json.loads(raw)
    except Exception:
        return {}

    def flatten(obj, prefix=''):
        result = {}
        if isinstance(obj, dict):
            for k, v in obj.items():
                new_prefix = f'{prefix}.{k}' if prefix else k
                if isinstance(v, str):
                    result[new_prefix] = v
                else:
                    result.update(flatten(v, new_prefix))
        return result

    return flatten(data)


def main(theme_path, out_dir):
    # Lazy import to avoid hard dependency at module-load time.
    from descriptions import SETTING_DESCRIPTIONS
    from section_meta import SECTION_META
    from context_overrides import CONTEXT_OVERRIDES

    # Accept either a zip or an already-extracted theme directory.
    cleanup_tmp = None
    if os.path.isdir(theme_path):
        theme_dir = theme_path
    elif os.path.isfile(theme_path) and theme_path.endswith('.zip'):
        tmp = tempfile.mkdtemp(prefix='universe-theme-')
        with zipfile.ZipFile(theme_path, 'r') as z:
            z.extractall(tmp)
        theme_dir = tmp
        cleanup_tmp = tmp
    else:
        sys.stderr.write(f'Error: theme_path must be a directory or .zip file: {theme_path}\n')
        sys.exit(1)

    sections_dir = os.path.join(theme_dir, 'sections')
    if not os.path.isdir(sections_dir):
        sys.stderr.write(f'Error: no sections/ folder in theme: {sections_dir}\n')
        sys.exit(1)

    all_labels = load_labels(theme_dir)
    schema_labels = load_schema_labels(theme_dir)

    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(os.path.join(out_dir, 'sections'), exist_ok=True)

    rendered = []
    skipped_no_meta = []
    skipped_no_schema = []
    errors = []

    for liquid_name in sorted(os.listdir(sections_dir)):
        if not liquid_name.endswith('.liquid'):
            continue
        liquid_path = os.path.join(sections_dir, liquid_name)

        try:
            schema = load_schema(liquid_path)
        except Exception as exc:
            errors.append(f'{liquid_name}: schema parse error: {exc}')
            continue

        if schema is None:
            skipped_no_schema.append(liquid_name)
            continue

        meta = SECTION_META.get(liquid_name)
        if meta is None:
            skipped_no_meta.append(liquid_name)
            continue

        try:
            content = write_section_doc(
                liquid_name, schema, meta, all_labels,
                SETTING_DESCRIPTIONS, CONTEXT_OVERRIDES
            )
        except Exception as exc:
            errors.append(f'{liquid_name}: render error: {exc}')
            continue

        subdir = '' if liquid_name in ROOT_SECTIONS else 'sections'
        out_path = os.path.join(out_dir, subdir, output_filename(liquid_name))
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(content)
        rendered.append(out_path)

    # Theme-level settings page
    settings_schema_path = os.path.join(theme_dir, 'config', 'settings_schema.json')
    if os.path.isfile(settings_schema_path):
        try:
            write_theme_settings(
                theme_dir, all_labels, SETTING_DESCRIPTIONS,
                schema_labels, os.path.join(out_dir, 'theme-settings.md')
            )
            rendered.append(os.path.join(out_dir, 'theme-settings.md'))
        except Exception as exc:
            errors.append(f'theme-settings.md: render error: {exc}')

    # Report
    print(f'Rendered {len(rendered)} files into {out_dir}')
    if skipped_no_meta:
        print(f'\nSkipped (no SECTION_META entry): {len(skipped_no_meta)}')
        for name in skipped_no_meta:
            print(f'  - {name}')
    if skipped_no_schema:
        print(f'\nSkipped (no {{% schema %}} block or empty): {len(skipped_no_schema)}')
        for name in skipped_no_schema:
            print(f'  - {name}')
    if errors:
        print(f'\nErrors: {len(errors)}')
        for err in errors:
            print(f'  - {err}')
        sys.exit(2)

    if cleanup_tmp:
        shutil.rmtree(cleanup_tmp, ignore_errors=True)


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.stderr.write(
            'Usage: python3 generate.py <theme_zip_or_dir> <out_dir>\n'
            '  theme_zip_or_dir: path to a Shopify theme .zip export OR an already-extracted theme directory\n'
            '  out_dir:          output root, typically theme-docs/\n'
        )
        sys.exit(1)
    # Allow imports of sibling modules (descriptions, section_meta, context_overrides)
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    main(sys.argv[1], sys.argv[2])
