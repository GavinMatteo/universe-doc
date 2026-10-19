# Sync doc: tema "Third Review"

**Data:** 19 ottobre 2026
**Branch:** `docs/sync-third-review`
**Tema di riferimento:** `Universe - 1.0 (Empty) NO TOUCH - Third review` (#204523602263)
**Confronto contro:** export precedente in `.themes/universe-empty-2nd` (Second Review)
**Modalità:** Claude come PM, lavoro delegato ai quattro agenti di `.claude/agents/` e revisionato prima del commit.

---

## Come è stato fatto il confronto

Sul dev store è comparso un nuovo round, il Third Review. Il live è ora
`Universe 1.0 - Demo Store - Third Review` (#206989590871), l'empty di riferimento è
#204523602263. È stato scaricato solo l'empty in `.themes/universe-empty-3rd`, secondo la
convenzione del repo. L'ipotesi "live ed empty hanno gli stessi liquid" non è stata
riverificata questo round.

Il diff grezzo è enorme: 48 sezioni e 38 snippet cambiati, migliaia di righe liquid. È
quasi tutto refactor di codice e cambio di tipo `inline_richtext` → `text`, che il
generatore non stampa. L'agente `schema-differ` ha isolato il delta reale sui soli tre input
del generatore (schema delle sezioni, `en.default.schema.json`, `settings_schema.json`).
`settings_schema.json` è identico: zero cambi nei Theme Settings.

Nessuna sezione aggiunta o rimossa: 52 sezioni con schema prima e dopo, `Rendered 52 files`.

---

## Delta reale rilevante per la doc

### 1. Blocchi recensioni della pagina prodotto riprogettati

In `u-main-product.liquid` e `u-featured-product.liquid` (schema identico):

| Blocco | Nome vecchio | Nome nuovo | Cosa è cambiato |
|---|---|---|---|
| `reviews_carousel` | Reviews carousel | **Testimonials** | via `total_score` e `reviews_amount` (campi numerici), dentro 4 setting: `badge_icon`, `badge_text`, `label_icon`, `label_text` |
| `reviews_score` | Reviews score | **Trust badges** | stesse 4 setting al posto dei due numeri; il blocco ora è solo i due badge |

I due badge sono testo libero con icona opzionale (select con `none`; fallback stella a
sinistra e fumetto a destra). I default del tema sono "5" e "500 testimonials". Il badge
sparisce se il testo è vuoto. Verificato leggendo `snippets/u-product-block-reviews-score.liquid`
e `u-product-block-reviews-carousel.liquid`.

`review_1_score` … `review_5_score` da `number` a `range` 0-5 step 0.5, label "Stars".
Via anche `desktop_layout` a livello sezione in `u-main-product` (solo lì).

### 2. Sezioni rinominate (2)

Solo etichetta, i file `.liquid` non cambiano, nessun link rotto.

| File liquid | Nome vecchio | Nome nuovo (Title Case in doc) |
|---|---|---|
| `u-reviews-showcase` | Reviews Carousel | **Testimonials Carousel** |
| `u-quotes` | Testimonials | **Featured Testimonials** |

Dentro `u-reviews-showcase`: `reviews_score` (numero) sostituito da `stars` (range 0-5
step 0.5) che pilota le stelle in testa alla sezione; blocco `review-slide` ora "Testimonial";
`rating_score` da number a range; label "Testimonial heading", "Star color",
"Testimonial card stars color".

### 3. Setting rimosse

| Sezione | Setting rimosse |
|---|---|
| `main-page` | `heading`, `heading_tag`, `paragraph`, `highlighted_text_*` (3) |
| `main-blog` | `heading`, `heading_tag`, `highlighted_text_*` (3) |
| `u-collage::text_block` | `link` |
| `u-ugc-carousel::ugc-slide` | `title`, `text`, `text_hover`, `content_layout` |
| `u-header-nav` | opzione `layout-5` ("Logo center, drawer navigation on the left") del select `menu_layout`. Il generatore non stampa le opzioni e nessuna pagina la citava: nessun effetto. |

### 4. Label cambiate (solo rendering, nessuna azione)

`u-bold-slideshow`: "Content alignments (desktop/mobile)" → "Desktop/Mobile content position",
"Show review stars" → "Show stars" (anche in `u-spotlighted-product`). `main-page`:
"Content alignments" → "Heading alignments". Gestite dalla rigenerazione.

---

## Modifiche applicate

### `generator/descriptions.py` (agente `description-writer`)
- **+** `badge_icon`, `badge_text`, `label_icon`: descrizioni nuove.
- **~** `rating_score`, `review_1_score` … `review_5_score`: "from 0 to 5 in half-star steps"
  (prima dicevano "1 to 5" o nulla).
- **−** entrate morte, id non più presenti in nessuna sezione del tema: `total_score`,
  `reviews_amount`, `reviews_score` (×2), `desktop_layout` (×2), `text_hover`.
- **Revisione PM:** `reviews_title` diceva "next to the aggregate score", ma il numero non
  esiste più: ora "next to the aggregate star rating". Era anche duplicata (righe 144 e 607),
  tolta la copia morta. Restano i duplicati storici `enable_breadcrumbs_*`, fuori scope.

### `generator/context_overrides.py` (agente `description-writer`)
- **+** `label_text` nei 4 contesti `u-main-product.liquid::reviews_carousel`,
  `::reviews_score` e gli stessi in `u-featured-product.liquid`. Senza override ereditava la
  frase del Product Offer Comparison ("Best seller" style), sbagliata qui.
- **+** `stars` in `u-reviews-showcase.liquid`: la generica dice "Options are 4, 4.5, and 5"
  (il select di Bold Slideshow), qui è un range.

### `generator/section_meta.py` (agente `section-meta-curator`)
- **~** titoli e intro di `u-reviews-showcase` e `u-quotes`.
- **~** 2 riferimenti incrociati nelle FAQ (`u-bold-slideshow`, `u-quotes`) al vecchio nome.
- **~** intro di `u-main-product` e `u-featured-product`: "reviews" → "testimonials".
- **+** FAQ in `u-main-product`: come mostrare rating e numero recensioni (blocco Trust badges).
- **~** intro di `u-ugc-carousel`: non cita più titolo e testo per card.
- **~** intro di `main-page`: non cita più heading e subheading opzionali. Verificato contro lo
  schema: restano `heading_size`, `content_layout`, `color_scheme`, sfondo e padding.
- **~** FAQ di `u-reviews-showcase`: sistemata la grammatica ("the review app own embed blocks").

### `theme-docs/`: rigenerato
`python3 generator/generate.py .themes/universe-empty-3rd theme-docs` → **Rendered 52 files**.
15 pagine generate modificate. `featured-collection.md` e `related-products.md` cambiano solo
per l'ordine di due righe (ordine schema), nessun contenuto.

### `theme-docs/guide-beauty.md`, `guide-fashion.md`, `guide-food.md`: scritti a mano
- **~** "Reviews Carousel" → "Testimonials Carousel" nei sottotitoli e nel testo.

### `theme-docs/changelog.md`: scritto a mano
- **~** lista di lancio v1.0.0: "Reviews Carousel" → "Testimonials Carousel",
  "Testimonials" → "Featured Testimonials".

### `theme-docs/general-settings.md`: controllato, non toccato
La sezione "Highlighted text" dice "Several sections include" la setting: ancora vero,
31 sezioni la hanno. Page Content e Blog l'hanno persa ma la pagina non le elencava.

### `CLAUDE.md`
- **~** ID tema e path aggiornati al Third Review, paragrafo di storia aggiunto.

---

## Da fare a mano su GitBook ⚠️

`SUMMARY.md` è di GitBook, non toccato. Due etichette di menu restano vecchie finché non le
rinomini dall'editor GitBook (i link funzionano, i file non cambiano nome):

| Riga | Voce attuale nel menu | Va rinominata in |
|---|---|---|
| 59 | Testimonials | Featured Testimonials |
| 60 | Reviews Carousel | Testimonials Carousel |

---

## Validazione pre-push

| Controllo | Esito |
|---|---|
| Celle "What it does" vuote | 0 |
| Anchor interni rotti | 0 |
| Trattini lunghi in `theme-docs/` e `generator/` | 0 |
| Import Python di `descriptions`, `context_overrides`, `section_meta` | ok |
| Agente `render-validator` | PASS, 0 errori, 3 warning attesi |

Warning del validator, tutti attesi: le 2 etichette stantie in `SUMMARY.md` (tabella sopra)
e i 14 H2 senza emoji in `theme-settings.md`, che è una pagina di riferimento root e non
segue la convenzione delle pagine sezione.

---

## Note per il prossimo round

- `u-main-quick-add.liquid` ha uno schema vuoto (`"settings": []`) e nessuna voce in
  `SECTION_META`: il generatore lo salta con "Skipped (no SECTION_META entry)". È voluto.
- Il `schema-differ` non confronta le opzioni dei `select`: la rimozione di `layout-5`
  nell'header è emersa solo dal diff del locale. Se serve, estendere l'agente.
- 10 entrate orfane più vecchie in `descriptions.py` (`article_show_author`, `buttons_radius`,
  `cards_background_color`, `content_layout_desktop`, `conversion_color_scheme`,
  `footer_type`, `global_border_radius`, `page_gutter`, `search_products_color_scheme`,
  `top_image`) non esistono nel tema già dal Second Review. Lasciate, da pulire con calma.
- Override stantio: `u-advanced-hero-slideshow.liquid::advanced_slide` → `overlay_color`,
  il blocco non ha quella setting. Innocuo, da togliere.
