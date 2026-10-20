// Shared helpers: open the Universe demo storefront behind its password gate.
import { chromium } from 'playwright';

export const STORE = process.env.STORE_URL || 'https://universe-theme-woofy.myshopify.com';

export async function openStore({ viewport = { width: 1440, height: 900 }, deviceScaleFactor = 2, video = null } = {}) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor,
    locale: 'en-US',
    ...(video ? { recordVideo: { dir: video, size: viewport } } : {}),
  });
  const page = await ctx.newPage();
  await page.goto(STORE + '/password', { waitUntil: 'domcontentloaded' });
  const pw = process.env.STORE_PASSWORD;
  const field = page.locator('input[type="password"], input[name="password"]').first();
  if (await field.count()) {
    if (!pw) throw new Error('Store is password protected: set STORE_PASSWORD');
    await field.fill(pw);
    await field.press('Enter');
    await page.waitForLoadState('load');
    await page.waitForTimeout(800);
  }
  return { browser, ctx, page };
}

// Hide things that pollute a screenshot: cookie banners, chat bubbles, the product
// page sticky add-to-cart bar, popups.
// keepPopup leaves the newsletter popup alone, for the capture that shows it.
export async function quiet(page, { keepPopup = false } = {}) {
  const popup = keepPopup ? '' : ', .popup-newsletter, [data-popup], .u-popup, .shopify-section[id*="popup_newsletter"]';
  await page.addStyleTag({ content: `
    .shopify-pc__banner, #shopify-pc__banner, iframe[title*="chat"], .js-product-sticky-form${popup} { display: none !important; }
    *, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }
  `});
}
