# Sync doc: tema "Second Review"

**Data:** 27 agosto 2026
**Branch:** `docs/sync-second-review`
**Tema di riferimento:** `Universe - 1.0 (Empty) NO TOUCH - Second review` (#202897129815)
**Confronto contro:** export precedente in `.themes/universe-latest` (First Review)

---

## Come è stato fatto il confronto

Sono stati scaricati due temi: il live `Universe 1.0 - Demo Store - Second Review`
(#202944479575) e l'empty `... NO TOUCH - Second review` (#202897129815). I due export
hanno `sections/*.liquid`, `snippets/` e `locales/` **identici**, differiscono solo nei
JSON di contenuto (`header-group.json`, `footer-group.json`, `overlay-group.json`).
È stato quindi usato l'empty come reference, coerente con la convenzione del repo.

Il diff è stato ristretto ai soli tre input che alimentano il generatore:

1. i blocchi `{% schema %}` di `sections/*.liquid`
2. `locales/en.default.schema.json` (le label)
3. `config/settings_schema.json` (Theme Settings)

Il tema differisce in 97 righe di schema, ma **95 sono cambi di valore `default`**
(rinumerazione dei color scheme: `scheme-1` → `scheme-4`, ecc., più due default numerici
in `u-bold-slideshow`). Il generatore non stampa i default, quindi sono irrilevanti per
la doc. Nessuna sezione aggiunta o rimossa: 53 file `.liquid` prima e dopo.

---

## Delta reale rilevante per la doc

### 1. Settings nuove (2)

| Setting | Dove | Tipo |
|---|---|---|
| `menu_open_trigger` | `u-header-nav.liquid` | select, *On click* (default) / *On hover* |
| `gift_card_color_scheme` | Theme Settings → Gift card | color_scheme |

### 2. Sezioni rinominate (9)

I nomi cambiano **solo nell'etichetta**: i file `.liquid` e quindi i nomi delle pagine
`.md` sono rimasti identici. Struttura e gerarchia della doc invariate, nessun link rotto.

| File liquid | Nome vecchio | Nome nuovo |
|---|---|---|
| `u-advanced-hero-slideshow` | Advanced Hero Slideshow | **Product Hero Slideshow** |
| `u-advanced-product-carousel` | Advanced Product Carousel | **Product Carousel** |
| `u-best-choice-offer` | Best Choice Offer | **Product Offer Comparison** |
| `u-quotes` | Quotes Carousel | **Testimonials** |
| `u-reviews-showcase` | Reviews Showcase | **Reviews Carousel** |
| `u-scrolling-pills` | Scrolling Pills | **Pills** |
| `u-then-vs-now` | Then vs Now | **Before and After Slider** |
| `u-touch-and-take` | Touch and Take | **Shop the Look** |
| `u-ugc-carousel` | UGC Carousel | **Media Carousel** |

### 3. Comportamento cambiato (1)

`free_shipping.threshold`: la gestione multivaluta è cambiata. Prima si inserivano i
valori per valuta (`USD:100,EUR:95`), ora si inserisce solo l'importo nella valuta base
del negozio e la conversione è automatica.

---

## Modifiche applicate

### `generator/descriptions.py`
- **+** `menu_open_trigger`: descrizione nuova.
- **+** `gift_card_color_scheme`: descrizione nuova (senza, la cella "What it does" restava vuota).
- **~** `free_shipping_threshold`: riscritta per il nuovo comportamento multivaluta.

### `generator/section_meta.py`
- **~** 9 titoli rinominati (tabella sopra), in Title Case per coerenza col resto della doc.
- **~** gli intro che citavano il vecchio nome sono stati riscritti.
- **~** 3 riferimenti incrociati nelle FAQ di altre sezioni (`bold-slideshow`, `quotes`,
  `spotlighted-product`) che rimandavano ai vecchi nomi.
- **~** l'intro di Testimonials è stato riformulato: "The Testimonials displays customer
  testimonials" era ripetitivo, ora "customer quotes or editorial pull quotes".

### `generator/context_overrides.py`
- **~** due commenti allineati ai nuovi nomi (solo cosmetico, nessun effetto sul render).

### `theme-docs/`: rigenerato
`python3 generator/generate.py .themes/universe-empty-2nd theme-docs` → **Rendered 52 files**.
13 file modificati: `header-nav.md`, `theme-settings.md` e le 9 pagine rinominate, più
`bold-slideshow.md` e `spotlighted-product.md` per i riferimenti incrociati.

### `theme-docs/guide-mega-menu.md`: scritto a mano
Era **factualmente sbagliato** dopo la modifica al tema: diceva che il mega menu si apre
all'hover, ma il default della nuova setting è *On click*.
- **~** intro e step 6 corretti.
- **+** nuova sottosezione "How the menu opens" con le due modalità e quando usarle.
- **+** nuova voce di troubleshooting sul trigger.

### `theme-docs/guide-beauty.md`, `guide-fashion.md`, `guide-food.md`: scritti a mano
- **~** nomi delle sezioni aggiornati.
- **~** due sottotitoli diventati ridondanti col nuovo nome, riscritti:
  "Before and After Slider: before and after" è diventato ": visible results";
  "Product Offer Comparison: product comparison" è diventato ": tiered options".

### `theme-docs/changelog.md`: scritto a mano
- **~** nomi delle sezioni nella lista di lancio v1.0.0.
- **~** lista dei gruppi Theme Settings riallineata ai 14 gruppi reali.
  ⚠️ **Questa parte era già sbagliata prima di questa sessione**, non è una conseguenza
  del cambio tema: elencava `Dynamic Island` (gruppo inesistente), `Buttons` e
  `Logo and favicon` (non sono gruppi), e ometteva `Floating header`, `Favicon` e
  `Gift card`. Corretto ora perché era comunque un errore pubblicato. Se preferisci
  che il changelog resti un documento storico immutato, questa è la modifica da revertare.

### `.gitignore`
Portata dentro la modifica che era già in working tree non committata
(`.claude/sessions/`, `.claude/settings.local.json`, `.venv/`). Non c'entra con il sync
della doc, ma era in sospeso e lasciarla fuori avrebbe sporcato il tree.

---

## Da fare a mano su GitBook ⚠️

`theme-docs/SUMMARY.md` è di proprietà di GitBook e **non è stato toccato**, secondo la
regola del repo. Contiene ancora i 9 vecchi nomi nelle voci di menu. I link **non sono
rotti** (i nomi dei file non sono cambiati), ma le etichette del menu laterale restano
vecchie finché non le aggiorni dall'editor GitBook:

| Riga | Voce attuale nel menu | Va rinominata in |
|---|---|---|
| 27 | Advanced Hero Slideshow | Product Hero Slideshow |
| 34 | Advanced Product Carousel | Product Carousel |
| 35 | Best Choice Offer | Product Offer Comparison |
| 39 | Touch and Take | Shop the Look |
| 55 | Then vs Now | Before and After Slider |
| 59 | Quotes Carousel | Testimonials |
| 60 | Reviews Showcase | Reviews Carousel |
| 61 | UGC Carousel | Media Carousel |
| 68 | Scrolling Pills | Pills |

---

## Validazione pre-push

| Controllo | Esito |
|---|---|
| Anchor interni rotti | 0 |
| Link a file `.md` rotti | 0 |
| Celle "What it does" vuote | 0 |
| File orfani (non in SUMMARY) | 0 |
| `generate.py` exit code | 0, Rendered 52 files |

Skip attesi e invariati: `u-main-quick-add.liquid` (nessuna voce in `SECTION_META`),
`u-predictive-search.liquid` (nessun blocco `{% schema %}`).

---

## Note per la prossima sessione

- L'export di riferimento aggiornato è ora `.themes/universe-empty-2nd`. La cartella
  `.themes/universe-latest` è il vecchio First Review: tenerla finché serve come base di
  confronto, poi si può eliminare.
- Gli ID dei temi sono cambiati rispetto a quelli in `CLAUDE.md`: i vecchi
  198939607383 / 199004782935 non esistono più sullo store. Aggiornati in `CLAUDE.md`.
- I duplicati noti in `descriptions.py` (`enable_breadcrumbs_collection`,
  `enable_breadcrumbs_product`) sono ancora lì, non toccati in questa sessione.
- `generate.py` contiene ancora in `GROUP_DESC` le voci `Logo` e `Buttons`, che non
  corrispondono a gruppi reali del tema. Sono innocue (chiavi mai raggiunte) ma sono
  residui: da ripulire se si mette mano al file.
