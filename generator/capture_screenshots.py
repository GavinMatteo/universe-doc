#!/usr/bin/env python3
"""Capture section screenshots from the Universe theme preview on Shopify.

Usage:
    .venv/bin/python generator/capture_screenshots.py <store_base_url> <theme_id> <output_dir>

Example:
    SHOPIFY_STORE_PASSWORD=secret .venv/bin/python generator/capture_screenshots.py \\
        https://universe-theme-woofy.myshopify.com 198939607383 theme-docs/assets/screenshots

The store base URL is the public storefront root (no trailing path). The theme
ID identifies the preview to render (the same ID used by `shopify theme pull`).
Authentication: if the dev store has a password gate, set SHOPIFY_STORE_PASSWORD
in the environment. The script fills the /password form once at the start of
the session.
"""

import os
import sys
from urllib.parse import urlparse, urlunparse, urlencode, parse_qsl

from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError

# Load the section -> target map from the sibling module.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from screenshot_targets import CAPTURE_TARGETS  # noqa: E402

VIEWPORT = {'width': 1440, 'height': 900}
NAV_TIMEOUT_MS = 30000
SETTLE_DELAY_MS = 1500  # let lazy media + reveal animations settle

# Hide overlay UI that is not part of the section we are documenting.
# Targets: Shopify's storefront preview bar, cookie consent banners,
# accessibility overlays, marketing chat widgets.
HIDE_CSS = """
[class*="cookie" i], [id*="cookie" i],
[class*="consent" i], [id*="consent" i],
[id*="shopify-preview-bar" i], [class*="preview-bar" i],
[id*="cookie-banner" i],
.shopify-section-header + .shopify-section[id*="preview"],
iframe[src*="preview" i] { display: none !important; }
html { scroll-behavior: auto !important; }
"""


def build_url(base, path, theme_id):
    """Compose a storefront URL with the preview_theme_id query parameter."""
    parsed = urlparse(base)
    new_path = path if path.startswith('/') else '/' + path
    query = dict(parse_qsl(parsed.query))
    query['preview_theme_id'] = str(theme_id)
    return urlunparse((parsed.scheme, parsed.netloc, new_path, '', urlencode(query), ''))


def dismiss_cookie_banner(page):
    """Remove the cookie consent banner from the DOM.

    Shopify's banner often lives in shadow DOM or a portal, so a plain CSS
    rule doesn't catch it. This sweeps the document for top-level elements
    whose text mentions cookie/consent/privacy AND contain at least one
    button — a strong signal that it's the consent banner — and hides them.
    Idempotent: safe to call on pages that don't have a banner.
    """
    page.evaluate("""() => {
        const isBanner = (el) => {
            const txt = (el.textContent || '').toLowerCase();
            if (txt.length === 0 || txt.length > 1200) return false;
            const hasKeyword = txt.includes('cookie') || txt.includes('consent') || txt.includes('privacy');
            const hasButton = el.querySelector('button') !== null;
            return hasKeyword && hasButton;
        };
        // Sweep dialogs first (most likely host), then top-level positioned overlays.
        const candidates = document.querySelectorAll('dialog, [role="dialog"], aside, div, section');
        for (const el of candidates) {
            if (isBanner(el)) {
                // Only hide the closest plausible container, not the whole body.
                if (el.tagName === 'BODY' || el.tagName === 'HTML') continue;
                el.style.setProperty('display', 'none', 'important');
            }
        }
    }""")
    page.wait_for_timeout(200)


def unlock_password_gate(page, base_url, password):
    """If the dev store has a password gate, fill it once and persist the cookie."""
    password_url = build_url(base_url, '/password', '')
    # Strip the theme_id from the password page URL — the gate doesn't need it.
    parsed = urlparse(password_url)
    password_url = urlunparse((parsed.scheme, parsed.netloc, parsed.path, '', '', ''))
    page.goto(password_url, wait_until='domcontentloaded', timeout=NAV_TIMEOUT_MS)
    # If we are not on the password page (no input), assume no gate is active.
    if page.locator('input[name="password"]').count() == 0:
        return False
    page.fill('input[name="password"]', password)
    page.click('form[action="/password"] button[type="submit"], form[action*="/password"] [type="submit"]')
    page.wait_for_load_state('networkidle', timeout=NAV_TIMEOUT_MS)
    return True


def capture_one(page, liquid_name, target, base_url, theme_id, output_dir):
    url = build_url(base_url, target['path'], theme_id)
    page.goto(url, wait_until='networkidle', timeout=NAV_TIMEOUT_MS)
    # Hide overlay UI before settle delay so animations finish on the clean DOM.
    page.add_style_tag(content=HIDE_CSS)
    dismiss_cookie_banner(page)
    page.wait_for_timeout(SETTLE_DELAY_MS)
    locator = page.locator(target['selector']).first
    if locator.count() == 0:
        raise RuntimeError(f'selector {target["selector"]!r} not found at {url}')
    out_path = os.path.join(output_dir, target['output'])
    locator.scroll_into_view_if_needed()
    page.wait_for_timeout(500)
    locator.screenshot(path=out_path)
    return out_path


def main(base_url, theme_id, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    password = os.environ.get('SHOPIFY_STORE_PASSWORD', '').strip()

    captured = []
    skipped = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport=VIEWPORT)
        page = context.new_page()

        if password:
            try:
                gated = unlock_password_gate(page, base_url, password)
                if gated:
                    print('Password gate unlocked.')
            except Exception as exc:
                sys.stderr.write(f'Password gate handling failed: {exc}\n')
                sys.stderr.write('Continuing without auth — captures may fail.\n')
        else:
            sys.stderr.write('Warning: SHOPIFY_STORE_PASSWORD not set. If the store has a password gate, captures will fail.\n')

        for liquid_name, target in CAPTURE_TARGETS.items():
            try:
                out_path = capture_one(page, liquid_name, target, base_url, theme_id, output_dir)
                captured.append((liquid_name, out_path))
                print(f'  captured {liquid_name} -> {out_path}')
            except PlaywrightTimeoutError as exc:
                skipped.append(f'{liquid_name}: timeout — {exc}')
            except Exception as exc:
                skipped.append(f'{liquid_name}: {exc}')

        browser.close()

    print(f'\nCaptured {len(captured)} screenshots in {output_dir}')
    if skipped:
        print(f'\nSkipped {len(skipped)}:')
        for s in skipped:
            print(f'  - {s}')
        sys.exit(2)


if __name__ == '__main__':
    if len(sys.argv) != 4:
        sys.stderr.write(__doc__)
        sys.exit(1)
    main(sys.argv[1], sys.argv[2], sys.argv[3])
