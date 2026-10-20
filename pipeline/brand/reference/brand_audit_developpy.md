# Brand audit: Developpy, Matteo Gavin, Alessandro Martini, Universe theme (as of 2026-10-13)

Method note: all pages below were fetched directly (curl/WebFetch) on 2026-10-13. The new Developpy site is still a pre-launch build on a Cloudflare Workers preview URL and contains visible "TODO: Matteo" placeholders; the live public domain developpy.io still serves the older Webflow one-pager. Social platforms (Instagram, LinkedIn, TikTok) block logged-out scraping, so only Open Graph metadata was readable; anything beyond that is marked as a gap.

## 1. What Developpy offers, to whom, in which language

### Takeaway
Developpy positions itself as a "Shopify software house" (not an "agency") with two co-founders who are both Shopify Experts, two offices (Barcelona + Noventa Padovana/Padova), and a dual model: own products (Universe theme, Checkout Upsell Builder app) plus six client services. The new site is English-first with Italian and Spanish versions; the implied client is a product brand (fashion, food & drink, beauty, CPG), mostly Italian so far, with international ambitions.

### Cited Findings
- Site title/meta: "Developpy is a Shopify software house in Barcelona. We build Shopify stores for brands and make the Universe theme and Checkout Upsell Builder." — [Developpy home (preview build)](https://developpy-website.developpy-website.workers.dev/)
- Hero copy: "Shopify Partner since 2021 / Shopify stores built by Shopify Experts. A Shopify software house in Barcelona. We design, build and migrate stores for brands, and make our own Shopify theme and app." — [Developpy home](https://developpy-website.developpy-website.workers.dev/)
- Six services: Store design & build; Migrations to Shopify (WooCommerce, Magento, PrestaShop, Salesforce Commerce Cloud, custom); Integrations & architecture (ERP, PIM, CRM, 3PL, POS, checkout extensions, custom apps); Shopify Plus & B2B; Audit & optimization (performance, CRO, technical SEO); Support & retainers (monthly development hours). — [Developpy services](https://developpy-website.developpy-website.workers.dev/services)
- Target verticals stated explicitly: "working mostly with fashion, food & drink, beauty and CPG brands." — [Developpy services](https://developpy-website.developpy-website.workers.dev/services)
- Languages/markets: "We work with brands worldwide, in English, Spanish and Italian, from offices in Barcelona and Noventa Padovana." Site has /it/ and /es/ versions; blog posts "are in English. Italian and Spanish translations follow after launch." — [Developpy home FAQ](https://developpy-website.developpy-website.workers.dev/) ; [Developpy blog](https://developpy-website.developpy-website.workers.dev/blog)
- Italian version frames the company as "una software house Shopify a Padova e Barcellona" (Padova first), while the English version says "in Barcelona". Italian footer address: Via Pana 56 ter, 35027 Noventa Padovana (PD). — [Developpy IT home](https://developpy-website.developpy-website.workers.dev/it/)
- Pricing stance: "Every project gets its own quote after a short call... We don't publish prices or packages." Timing: "Most new stores take two to three months from kickoff to launch." — [Developpy home FAQ](https://developpy-website.developpy-website.workers.dev/)
- Process/quality claims ("Built like a product, not a one-off"): code review on every change by a second developer; staging before live; Theme Store speed/accessibility checks applied to client themes. — [Developpy services](https://developpy-website.developpy-website.workers.dev/services)
- Agencies page: white-label Shopify development for agencies + Developpy Partners program (20-30% commission on verified Universe installs). — [Developpy agencies](https://developpy-website.developpy-website.workers.dev/agencies)
- The live public domain still shows the old Webflow site: title "Developpy - Next-Gen Shopify Tools", hero "Next-Gen SHOPIFY Tools for E-commerce Brands that Dream Bigger", "Trusted by 147+ Leading Brands", "A new Shopify Theme is about to change the game, Join the waitlist", footer "Copyright 2024 Developpy, Plaza Universidad 9, Barcelona". — [developpy.io (live)](https://www.developpy.io/)
- Third-party data: "Developpy is a Spain-based Shopify developer established in 2024", 1 published app, 0 reviews, profile unclaimed. — [Letsmetrix developer page](https://letsmetrix.com/developer/developpy)
- Legal entity in footer: "© 2026 Developpy. Matteo Gavin, P.IVA 05367990289" (same VAT as matteogavin.it). — [Developpy home](https://developpy-website.developpy-website.workers.dev/) ; [matteogavin.it](https://www.matteogavin.it/)
- Contact routes: hello@developpy.io; Calendly 15-min call (calendly.com/matteogavin/15-min-videocall, i.e. Matteo's personal Calendly). — [Developpy contact](https://developpy-website.developpy-website.workers.dev/contact)

### Inferences
- Implied target merchant: established product brands (not beginners/dropshippers) with budgets in the $2.5k-7k+ range for builds (per Partner Directory price ranges), mostly Italian SMB/DTC brands today, with Spanish/international expansion as the aspiration. The client list on the Work page is almost entirely Italian brands.
- The "software house" / "product company that also builds" framing is the intended differentiator vs. generic Shopify agencies; Instagram content could lean on "we build our own theme and app, so client work gets product-grade standards".
- Site copy tone (English): plain, declarative, concrete, no hype adjectives; short sentences; facts over superlatives (e.g. "Nothing added to your theme", "No tracking links"). Italian copy mirrors this (formal "voi"/plural, no slang). Matteo's personal site is warmer and more playful (emoji, "regno digitale", "non ti manderò 200 email al giorno promesso").
- The new site is unfinished (several "TODO: Matteo" blocks: founding story, founder bios, Universe target merchant, price, launch date, password instructions). This is a gap in the brand narrative that Instagram content will need to fill anyway.

### Gaps
- Founding year of Developpy is not stated on the new site (TODO placeholder); Letsmetrix says "established 2024" (based on App Store presence), the old site footer says 2024, the Partner Directory shows Matteo as partner since Feb 2021 and Alessandro since Nov 2024. Treat "founded 2024" as unconfirmed.
- No public pricing for services; no team size beyond "two Shopify Experts and a small team" (the Oppy skill context mentions developers Gabriele/Olek but this was not verifiable on any public page).

## 2. Visual identity (palette, typography, imagery) to stay consistent with

### Takeaway
Developpy's current identity is a dark-navy/lilac/violet system with a lime CTA accent and Figtree as the single typeface, with heavy (800) tight-tracked display headings. The older Webflow site already used the same navy #110B2F and lilac #DEDCFD, so the palette is stable across generations. Imagery is screenshot-led: full-page captures of client stores, founder portraits, client logos, Shopify badges.

### Cited Findings
- Design tokens from the new site CSS: `--color-ink: #110b2f` (dark navy, page background/text), `--color-lilac: #dedcfd` (text on dark), `--color-brand: #4334b5` (indigo), `--color-violet: #7852fc` (accent mark/glow), `--color-lime: #e0f568` (CTA background; hover `#eaf98f`), `--color-ink-muted: #58546d`, `--color-lilac-muted: #9693b5`, `--color-surface: #1a1340`, `--color-surface-light: #f4f3fe`, glass surfaces `#1e1747`; `<meta name="theme-color" content="#110B2F">`. — [Developpy home CSS](https://developpy-website.developpy-website.workers.dev/)
- Typography: self-hosted `figtree-variable-latin.woff2`; `--display-weight: 800`, `--display-tracking: -.035em`, `--display-leading: 1.02` (very tight, bold display headings). — [Developpy home](https://developpy-website.developpy-website.workers.dev/)
- Logo files: `logo_darkviolet.svg` and `logo_lilac.svg` (two logo colorways). OG image at developpy.io/og/default.png. — [Developpy home](https://developpy-website.developpy-website.workers.dev/)
- Old Webflow site palette: #110B2F, #DEDCFD, #4334B5, #4a3aff; font Open Sans. — [developpy.io (live)](https://www.developpy.io/)
- Partners portal (partners.developpy.io) uses Inter + Instrument Serif (italic serif display) with accent #7852FC, hairline borders, uppercase tracked eyebrows. — [Developpy Partners](https://partners.developpy.io/)
- Imagery on the new site: full home-page captures of client stores (Gastona illustrated hero with mascot; Mimmù boots campaign photo; Oybò outdoor picnic photo; Viandar travel hero with trip search; Starting Finance dark-blue masterclass hero), a Mimmù checkout screenshot for the app, founder portraits (matteo-gavin.webp, alessandro-martini.webp), a 3D "torus-knot" graphic, client logo strip, Shopify Expert / Shopify Partners / Shopify Select Partner badges. — [Developpy home image assets](https://developpy-website.developpy-website.workers.dev/)
- Client logo strip (alt texts): A-Commerce, Gastona, Koalito, Macelleria Callegari, Marketers, PorcoBrado, Qbrico, Really Creative Hub, Redmango, Salimbeni Profumi, Small Giants, Starting Finance, Sticker Print, Tacchettee, Tokio Studio, Viva Agency. — [Developpy home](https://developpy-website.developpy-website.workers.dev/)
- Matteo Gavin personal site (Webflow): fonts Manrope (body), Zodiak and Playfair Display (display/serif), Inter; mostly near-white backgrounds (#fafafa) with accent greens (#38fa88), cream (#f7f1d0) and pink (#ffdede); emoji in copy. — [matteogavin.it](https://www.matteogavin.it/) ; [matteogavin.it CSS](https://cdn.prod.website-files.com/66113bf43b1e7677acfd68f5/css/matteogavin.webflow.shared.90f9e74dc.min.css)
- Universe demo (Woofy) visual system is deliberately different from Developpy's: Inter (headings weight 800), zero border-radius everywhere (`--buttons-border-radius: 0px`, `--card-border-radius: 0px`), palette off-white #f3f2f0, brown #594a46, coral #f7715d, teal #01a58d, light grey #d8dedd, near-black #1d1d1d. — [Universe demo home](https://universe-theme-woofy.myshopify.com/)

### Inferences
- For Instagram: a dark navy (#110B2F) canvas with lilac (#DEDCFD) type, violet (#7852FC) accents and lime (#E0F568) for CTAs/highlights, Figtree ExtraBold tight headings, would be on-brand. A light variant (#F4F3FE surface, navy text) exists in the tokens for alternation.
- The mismatch between Matteo's personal site (light, serif, playful) and Developpy (dark, geometric, plain) suggests the personal brand and company brand are currently not visually aligned; Instagram should decide whether Matteo's personal account adopts Developpy's system or keeps a softer variant.
- There is no illustration or photography style defined yet beyond store screenshots and founder portraits; the "torus-knot" 3D object hints at an abstract 3D motif that could become a recurring visual.

### Gaps
- No public brand guidelines, logo usage rules, or icon set were found. The only logo files seen are SVGs on the preview site (not inspected visually).
- Could not screenshot pages (no browser run), so the actual layout/feel is inferred from tokens and alt text.

## 3. Proof points: Partner Directory, reviews, Shopify Expert status, clients, the app

### Takeaway
The strongest verifiable proof is Matteo Gavin's Shopify Partner Directory profile: 5.0 rating from 27 reviews, Select Partner tier, partner since Feb 2021, Italian reviews from named brands. Alessandro Martini has a separate Select Partner profile (since Nov 2024) with 0 reviews. Checkout Upsell Builder (Plus) is live on the App Store since Nov 26, 2024 but has 0 reviews.

### Cited Findings
- Matteo Gavin, Service partner, rating 5.0 (27), "Partner since February 2021", "Select Partner" tier, primary location Padova, supported Italy/Spain, languages EN/ES/IT, price range $1000-$7000; contact matteogavin.it / info@matteogavin.it. — [Shopify Partner Directory: Matteo Gavin](https://www.shopify.com/partners/directory/partner/matteo-gavin1)
- Rating breakdown: 26 five-star, 1 four-star. Recent reviews (all 5/5 quality): Restylit (Sep 30, 2026, WordPress->Shopify migration), The butcher (Sep 9, 2026, "Lavoro con Matteo dal 2020"), Tacchettee (Aug 5, 2026, "Matteo Gavin e il suo team... CRO, UX, UI"), La biblioteca delle emozioni (Aug 5, 2026), MAZZER (Jan 29, 2026, communication 4/5), Due Vittorie, Salimbeni Profumi BE ("Top professional, skilled and emphatic!"), EffeEmme (B2B setup), SayPaper, VVTB, Mimmù (Jul 24, 2025). — [Shopify Partner Directory: Matteo Gavin](https://www.shopify.com/partners/directory/partner/matteo-gavin1)
- Matteo's featured work on the directory: Gastona, Viandar, Oybò, SayPaper, Restylit, Mazzer. Industries: Clothing and fashion, CPG, Food and drink, Health and beauty. — [Shopify Partner Directory: Matteo Gavin](https://www.shopify.com/partners/directory/partner/matteo-gavin1)
- Alessandro Martini, Service partner, "New to the directory", "Active partner since November 2024", Select Partner, Barcelona, EN/ES/IT, contact hello@alessandromartini.com, bio "Shopify specialist with 6+ years of experience", featured work: Mimmù (Shopify Plus full build), Swimprove, Kefood, Oybò, Tacchettee, Mr Crocca; "This partner doesn't have any reviews yet." — [Shopify Partner Directory: Alessandro Martini](https://www.shopify.com/partners/directory/partner/alessandro-martini)
- Site-level numbers: "Shopify projects 300+", "Brands 147+", "Themes customized 200+", "Custom sections 5,000+", "Shopify Partner since 2021, now a Shopify Select Partner." — [Developpy home](https://developpy-website.developpy-website.workers.dev/)
- Matteo's personal claim: "Ad oggi sono tra i migliori 50 esperti Shopify in Italia secondo Shopify." (top 50 in Italy). His X bio says "Top #10 Shopify Experts in IT". — [matteogavin.it](https://www.matteogavin.it/) ; [X @matteogavinn](https://x.com/matteogavinn)
- App listing: "Checkout Upsell Builder (Plus)", developer Developpy, "From $14.97/month. Free trial available", Rating 0.0 (0 reviews), Launched November 26, 2024, works only on Shopify Plus, plans Standard $14.97/mo and International $29.97/mo (multilanguage), 7-day trial, address Plaza Universidad 9, Barcelona. — [Shopify App Store](https://apps.shopify.com/checkout-upsell-builder-plus)
- Developpy's own app page adds a free "Development stores" plan and shows a Mimmù checkout screenshot ("one switch adds the cleaning kit to the order"). — [Developpy app page](https://developpy-website.developpy-website.workers.dev/checkout-upsell-builder)
- Case-study inventory (35 listed): Gastona, Small Giants, Viandar, Mimmù, Oybò, Starting Finance (full case studies), plus Agricola Maraviglia, Bagni di Vino, Barkyn, La Biblioteca delle Emozioni (Universe redesign), Caffè Moca (Magento 2 migration), Clemi's Market, Connee, DSG Streetwear, Fantic Bikes, Francesco Bottazzi, Italian Watch Spotter, Kefood, Kontakto Natura, Kopermut, Luce Studio, Macelleria Callegari, Maison Clabé, Mazzer, Mr Crocca, Nautilus Sleep, Nuar Gallery, Piano Terra Ceramiche, Profumoir, SayPaper, Sensimilla, Swimprove, Tacchettee, Zadalux, Restylit. — [Developpy work](https://developpy-website.developpy-website.workers.dev/work)
- Full case studies follow a fixed structure (Brief / What we did / Result / client quote / full home-page capture dated Oct 3, 2026). Example: Viandar, travel brand of YouTuber Nova Lectio, custom build with interactive 3D globe and booking-system integration. — [Viandar case study](https://developpy-website.developpy-website.workers.dev/work/viandar)
- Blog: 4 new posts dated Oct 9, 2026 by Matteo Gavin (migration SEO; custom vs Theme Store theme) and Alessandro Martini (Plus checkout upsells; what a retainer covers), plus older May 2025 generic SEO posts by "Developpy". — [Developpy blog](https://developpy-website.developpy-website.workers.dev/blog)

### Inferences
- The 27 reviews live on Matteo's personal profile, not on a "Developpy" profile; Developpy inherits credibility through him. Content should quote these reviews (names are public, Italian brands) rather than invent testimonials.
- Alessandro's profile with 0 reviews and the app with 0 reviews are weak spots; a review-collection push could be a content/CTA objective.
- "Trusted by 147+ brands" and "300+ projects" are self-reported and not externally verifiable; use them but attribute as "team numbers".

### Gaps
- No install counts for the app (not published by Shopify or Letsmetrix).
- No "Developpy" company profile on the Partner Directory was found; only the two individual profiles.
- The review for Mimmù on the directory is attributed to Matteo although Alessandro's profile lists Mimmù as his featured build; ownership of credit between founders is not clear publicly.

## 4. Universe theme: features, target merchant, visual style, status, content material

### Takeaway
Universe is a feature-dense Shopify theme (51 sections, 154 blocks per the demo) positioned as "replaces 10+ apps", with a pet-food demo store ("Woofy") that is password protected and whose theme name indicates it is in Theme Store review ("Third Review"). It is not yet on the Theme Store; price is unpublished (partner portal uses "$320" as an example only).

### Cited Findings
- Status: "Coming to the Shopify Theme Store... It is not on the Theme Store yet. Join the waitlist." Price and date are "TODO" placeholders; waitlist form message says "The waitlist is not open yet". — [Developpy Universe page](https://developpy-website.developpy-website.workers.dev/universe)
- Demo store theme metadata: `Shopify.theme = {"name":"Universe 1.0 - Demo Store - Third Review","schema_name":"Universe","schema_version":"1.0.0","theme_store_id":null}`; store name "Universe Theme Woofy"; currency USD. — [Universe demo home](https://universe-theme-woofy.myshopify.com/)
- Demo brand: "Woofy crafts premium pet food, treats and wellness products for dogs and cats... free shipping over €60"; 24 products (food, treats, supplements, hydration, grooming, 4 bundles), 14 collections (Dogs, Cats, Puppies, Senior, Adult, Food, Treats, Supplements, Hydration, Pet Care, Bundles, Sale, Best Seller, All). — [Universe demo products.json](https://universe-theme-woofy.myshopify.com/products.json) ; [collections.json](https://universe-theme-woofy.myshopify.com/collections.json)
- Home page section stack (in order): bold slideshow, advanced product carousel ("Our Bestsellers"), big text marquee, promo banner ("70%"), advanced hero slideshow (with "YUMMIER / SMOKED / JUICIEST / GRILLED" scrolling words), featured collection, spotlighted product (with scrolling pills), sticky section ("What's actually in it"), best choice offer (3 bundles, "Our pick"), multicolumn, scrolling pills, image with text, reviews showcase ("1,300+ Happy Pets", pet-voiced reviews), touch-and-take interactive lookbook ("Tap a dot"), featured data (metric cards "92%", "-40%", "4+ years"), collection list, rich text, UGC carousel (@handles), comparison table ("Woofy vs. other brands"), then-vs-now before/after slider ("The coat doesn't lie"), diagonal texts, featured blog, icon list, newsletter; plus header, cart drawer, newsletter popup, footer. — [Universe demo home](https://universe-theme-woofy.myshopify.com/)
- Product page stack: main product (5 media, rating "4.9 276", inline review carousel), multicolumn, reviews showcase, comparison table, sticky section, then-vs-now, related products, scrolling text, FAQ. — [Universe demo product](https://universe-theme-woofy.myshopify.com/products/steak-treats)
- Theme Features page claims: "51 sections", "154 Blocks", "97% Desktop speed", "0,6s LCP", "98% SEO score"; "Universe Theme replaces 10+ apps... Save more than 1500$ every year" with a cost comparison table (cart drawer with cross-sell ~$348/yr, review carousel ~$120/yr, delivery date ~$60/yr, etc.). — [Universe theme features](https://universe-theme-woofy.myshopify.com/pages/theme-features)
- Native features listed: cart drawer with cross-sell, free-shipping bar and trust badges; product offer comparison; promo banner; UGC carousel; featured data; comparison table (3 cols, unlimited rows); collections inside collections (via metafields); newsletter popup; sticky add-to-cart; dynamic delivery date estimator; review carousel in buy box; cross-sell carousel; ingredients table; size guide popup; 80+ in-house icons; six shape dividers; native multilanguage + multi-currency (Shopify Markets); color swatches (pills or images); quick add/quick view; six text highlight styles; up to 4-5 header layouts incl. floating pill, transparent and glass; 4 mega menu layouts (visual collections, featured products, categories + promo banner, brand pages). — [Universe theme features](https://universe-theme-woofy.myshopify.com/pages/theme-features) ; [Developpy Universe page](https://developpy-website.developpy-website.workers.dev/universe)
- Visual style of the demo: Inter 800 headings, zero border radius, off-white #f3f2f0 ground, brown #594a46, coral #f7715d and teal #01a58d accents; many product images are AI-generated (file names "Generated_Image_April_18_2026..."); copy tone is dry/witty ("No gimmicks, no countdown timer theatre", "We didn't write any of these", pet-voiced reviews). — [Universe demo home](https://universe-theme-woofy.myshopify.com/)
- First client store on Universe: "La Biblioteca delle Emozioni, Sector Literary subscriptions, Universe redesign". — [Developpy Universe page](https://developpy-website.developpy-website.workers.dev/universe)
- Partner program: 20% (Partner) / 25% (Pro, 5 installs) / 30% (Elite, 15 installs), PayPal payouts in USD, receipt-based attribution; worked example "Universe theme price $320 ... Example only." — [Developpy Partners](https://partners.developpy.io/)
- Demo blog has 4 pet-nutrition articles dated Mar-Apr 2026, used to populate the featured-blog section. — [Universe demo home](https://universe-theme-woofy.myshopify.com/)

### Inferences
- Target merchant (inferred, since the site leaves it as TODO): DTC consumer brands with ingredient/benefit storytelling (food, pet, beauty, wellness, fashion) that want a conversion-oriented theme without stacking apps; the demo's "millennial pet owners" framing and ingredient tables point to CPG. Pricing tier likely premium (~$300+), based on the $320 example.
- "Third Review" in the theme name strongly suggests the theme has gone through at least two rounds of Theme Store review; launch appears imminent but no date is public.
- Highly reusable Instagram material: screen recordings of the touch-and-take lookbook, then-vs-now slider, cart drawer with free-shipping bar, floating/glass header, mega menu layouts, comparison table, delivery date estimator, "replaces 10+ apps / save $1500/yr" chart, the "51 sections / 154 blocks / 0.6s LCP" stats, and the Woofy brand itself as a recurring fictional "client".

### Gaps
- Theme price, launch date, support/update policy and target-merchant copy are unwritten (TODO on site).
- Could not take screenshots; descriptions of look-and-feel are derived from HTML, CSS tokens and copy, not rendered pages.
- The Lighthouse figures are self-reported on the demo; not independently verified.

## 5. Current social presence (Developpy, Matteo Gavin, Alessandro Martini)

### Takeaway
There is effectively no active social presence: Developpy has no company LinkedIn page, no YouTube, and the Instagram handles @developpy / @developpy.io are empty (0 posts); Matteo's personal Instagram @matteogavin has 762 followers and 7 posts; his X bio mentions Developpy. LinkedIn personal profiles exist for both founders but could not be read.

### Cited Findings
- Instagram @developpy: OG metadata "0 Followers, 0 Following, 0 Posts", display name "total" (not evidently Developpy's). — [instagram.com/developpy](https://www.instagram.com/developpy/)
- Instagram @developpy.io: "1 Followers, 2 Following, 0 Posts", empty display name. — [instagram.com/developpy.io](https://www.instagram.com/developpy.io/)
- Instagram @matteogavin: "Matteo Gavin, 762 Followers, 925 Following, 7 Posts". Bio and post content not readable without login. — [instagram.com/matteogavin](https://www.instagram.com/matteogavin/)
- Instagram @matteogavinn: no profile metadata returned (likely does not exist). — [instagram.com/matteogavinn](https://www.instagram.com/matteogavinn/)
- X/Twitter @matteogavinn: "Matteo Gavin (@matteogavinn) on X", bio "Building public Shopify Themes & Apps at [link] 👨🏼‍💻 Top #10 Shopify Experts in 🇮🇹". Follower count not readable. — [x.com/matteogavinn](https://x.com/matteogavinn)
- LinkedIn: Matteo Gavin profile URL linkedin.com/in/matteo-gavin-web-designer/ (linked from matteogavin.it and Developpy About); Alessandro Martini profile URL linkedin.com/in/alessandro-martini-0b9298222/ (linked from Developpy About and his Partner Directory profile). Both return HTTP 999 (blocked) to scrapers. — [Developpy about](https://developpy-website.developpy-website.workers.dev/about) ; [Shopify Partner Directory: Alessandro Martini](https://www.shopify.com/partners/directory/partner/alessandro-martini)
- LinkedIn company page linkedin.com/company/developpy returns 404; YouTube @developpy returns 404; TikTok @developpy returns a generic page with no profile metadata (existence unconfirmed). — probes of [linkedin.com/company/developpy](https://www.linkedin.com/company/developpy), [youtube.com/@developpy](https://www.youtube.com/@developpy), [tiktok.com/@developpy](https://www.tiktok.com/@developpy)
- Neither the Developpy site nor the Partner Directory profiles list any social links (Partner Directory "Social links" sections are empty for both founders). — [Shopify Partner Directory: Matteo Gavin](https://www.shopify.com/partners/directory/partner/matteo-gavin1)
- Web searches for "Developpy" + Instagram/LinkedIn and for Alessandro Martini's social profiles returned no relevant results. — [WebSearch result set](https://letsmetrix.com/developer/developpy)

### Inferences
- Handle availability: @developpy on Instagram appears taken by an unrelated/empty account ("total"); @developpy.io looks like a reserved placeholder (possibly Developpy's own, unverified). Ownership should be confirmed with Matteo before planning.
- Matteo's X bio ("Building public Shopify Themes & Apps", "Top #10 Shopify Experts in IT") is already the personal-brand positioning most aligned with the Developpy product story.

### Gaps
- Follower counts for LinkedIn and X, and the content of Matteo's 7 Instagram posts, could not be retrieved (login walls). Alessandro's Instagram handle is unknown.
- Whether Developpy owns @developpy.io on Instagram and @developpy on TikTok is unverified.

## 6. Matteo Gavin personal-brand angle (matteogavin.it)

### Takeaway
matteogavin.it presents Matteo as an Italian-speaking "Shopify Expert Freelance / Web Designer" for SMBs, with a warm, emoji-friendly, slightly playful tone, a 3-step process (Analisi, Design, Sviluppo), the same 300+/200+/5,000+ stats later reused by Developpy, and a "top 50 Shopify experts in Italy" claim; the site is partly templated and dated.

### Cited Findings
- Title "Matteo Gavin | Shopify Expert"; hero "Ciao sono Matteo Gavin 👋 Shopify Expert Freelance. Sono un Web Designer e aiuto piccole e grandi aziende a trovare la loro dimensione digitale." — [matteogavin.it](https://www.matteogavin.it/)
- Four services: Sviluppo E-Commerce (temi custom), Migrazione a Shopify (WooCommerce, PrestaShop, Magento), Conversion Rate Optimization, Formazione e Supporto Shopify. — [matteogavin.it](https://www.matteogavin.it/)
- Stats: "Negli ultimi 5 anni: 300+ Progetti Shopify & Shopify Plus, 200+ Temi Shopify personalizzati, 5.000+ Sezioni Shopify custom". — [matteogavin.it](https://www.matteogavin.it/)
- Bio: "aiuto piccole e medie imprese... Ad oggi sono tra i migliori 50 esperti Shopify in Italia secondo Shopify"; "Web developer certificato Shopify Expert con 5+ anni di esperienza". — [matteogavin.it](https://www.matteogavin.it/)
- Portfolio tiles: Gastona, Magenta, Beetle UI Kit, Streak Web3, Italian Watch Spotter, Hugo Agency; several tiles carry template filler text ("The future doesn't exist, engineer the now"); testimonial block contains template filler ("Partnering with Mangopay...") attributed to "Pietro Romor, Founder Gastona"; blog section has placeholder authors ("Olivia Rhye", June 2023); a "Resources" shop sells mockups/abstractions (Twidddls, iPhone/MacBook mockups). — [matteogavin.it](https://www.matteogavin.it/)
- Process: "step 1 Analisi, step 2 Design, step 3 Sviluppo", with tone like "Non solo ti do le chiavi del regno digitale, ma ti insegno a regnare." — [matteogavin.it](https://www.matteogavin.it/)
- Social links on the site: Twitter @matteogavinn, LinkedIn /in/matteo-gavin-web-designer/; footer "© All rights reserved by Matteo Gavin | P.iva : 05367990289". — [matteogavin.it](https://www.matteogavin.it/)
- Partner Directory business description (more recent, aimed higher): "aiuto medie e grandi imprese a sviluppare, ottimizzare e gestire i loro E-Commerce". — [Shopify Partner Directory: Matteo Gavin](https://www.shopify.com/partners/directory/partner/matteo-gavin1)
- Gastona story on the directory is written first-person and narrative: "Sono entusiasta di portarvi dietro le quinte del progetto... lo sviluppo di Gastona.it". — [Shopify Partner Directory: Matteo Gavin](https://www.shopify.com/partners/directory/partner/matteo-gavin1)

### Inferences
- Matteo's personal brand is the natural "face" for Italian-language Instagram content: freelance-to-founder story, Padova base, 5+ years, 300+ projects, top-50/top-10 Italy claims, behind-the-scenes narratives (he already wrote one for Gastona).
- The personal site is out of date relative to Developpy (SMB freelance framing, template filler, Webflow); either refresh it or route the personal brand through Developpy's identity.
- Alessandro's public persona is thin (Barcelona, 6+ years, English-language, no reviews, no socials found); content could position him as the Plus/checkout/B2B technical voice (he authored the checkout and retainer blog posts).

### Gaps
- No personal photos, founding story, or biography text exists publicly beyond one-liners; the About page bios are TODO.
- The "top 50 / top 10 Shopify Experts in Italy" claims are self-reported with no public Shopify source found.

## 7. Reusable raw material and gaps for Instagram content

### Takeaway
Plenty of concrete, already-written material exists (6 structured case studies, 35 project one-liners, 27 public reviews, Universe feature copy and demo store, app screenshots, blog posts), but there are no founder stories, no video, no photography beyond portraits, and the Universe price/launch messaging is unwritten.

### Cited Findings
- Reusable: six full case studies with Brief/What we did/Result and dated full-page captures (Gastona, Small Giants, Viandar, Mimmù, Oybò, Starting Finance). — [Developpy work](https://developpy-website.developpy-website.workers.dev/work)
- Reusable: 11+ named client reviews in Italian/English with dates. — [Shopify Partner Directory: Matteo Gavin](https://www.shopify.com/partners/directory/partner/matteo-gavin1)
- Reusable: Universe feature list, stats and app-cost comparison; Woofy demo pages (home, collection, product, theme-features, about). — [Universe theme features](https://universe-theme-woofy.myshopify.com/pages/theme-features)
- Reusable: app explainer ("Set the offer / Choose the trigger / Run several campaigns / Read the conversions / Nothing added to your theme") and Mimmù checkout screenshot. — [Developpy app page](https://developpy-website.developpy-website.workers.dev/checkout-upsell-builder)
- Reusable: 4 recent blog posts (migration SEO, custom vs Theme Store theme, Plus checkout upsells, retainers) that can be sliced into carousels. — [Developpy blog](https://developpy-website.developpy-website.workers.dev/blog)
- Reusable: Partners program mechanics (20/25/30%, receipt-based) for agency-facing content. — [Developpy Partners](https://partners.developpy.io/)

### Inferences
- Biggest content gaps: founder story and bios, "why products first", team/behind-the-scenes, Universe launch date and price, any video/Reels footage, Alessandro's visibility, and a decision on which Instagram handle(s) to use.

### Gaps
- No existing social content to benchmark engagement against; no analytics available.
