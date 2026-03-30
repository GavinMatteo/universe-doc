# ⚡ Performance

How to keep Universe fast and maintain a high Lighthouse score.

Universe is built to meet Shopify's minimum Lighthouse performance score of 60 across home page, product pages, and collection pages. Your choices in the Theme Editor can help or hurt that score. This guide explains what to watch.

---

## Images

Images are the single biggest factor affecting page speed in any Shopify store.

**Upload images at the correct size.** Do not upload a 4000x3000px image for a section that displays at 800px wide. Shopify resizes images on delivery, but the original file is still stored and can slow initial load.

**Use the correct format.** JPG for photographs, PNG only when you need transparency. Avoid BMP or TIFF.

**Avoid too many images above the fold.** The home page hero and the first visible section load immediately. Keep the number of images in the first two sections low, and make sure the hero image is optimized.

---

## Animations

Universe includes scroll-triggered reveal animations configurable in **Theme settings > Animations**. These animations add visual interest but add a small rendering cost.

If your Lighthouse score is below 60 on mobile, try disabling **Animations on scroll** in Theme settings as a first diagnostic step.

---

## Sections and blocks

Each section and block you add to a page adds rendering cost.

**Limit the home page to what is necessary.** A home page with 15 sections will always be slower than one with 7. Prioritize the sections that directly contribute to conversion.

**Avoid stacking multiple video sections.** Video is the heaviest media type. If you use video in the Bold Slideshow, avoid also adding a standalone video section immediately below.

---

## Apps

Third-party apps are the most common cause of slow Shopify stores. Each app that injects JavaScript or CSS into the storefront adds load time.

- Audit your installed apps regularly. Remove apps you are not actively using.
- Prefer apps that load asynchronously and do not block rendering.
- Test your Lighthouse score before and after installing a new app.

---

## How to test your score

1. Publish your theme with real content (not empty sections).
2. Go to [PageSpeed Insights](https://pagespeed.web.dev/) and enter your store URL.
3. Run the test on both mobile and desktop.
4. Focus on the **Largest Contentful Paint (LCP)** and **Total Blocking Time (TBT)** metrics — these are the most actionable.

Alternatively, use the Lighthouse tab in Chrome DevTools for a local test.

---

## Shopify's benchmark requirement

Shopify requires themes on the Theme Store to achieve a minimum average Lighthouse performance score of **60** and accessibility score of **90** across the home page, product page, and collection page, tested on both desktop and mobile.

Universe meets these requirements out of the box. App installations and large unoptimized images are the most common reasons a store falls below these thresholds after launch.
