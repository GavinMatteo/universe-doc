# Immagini nella doc, Fase 1: render storefront per tutte le pagine

**Data:** 20 e 21 ottobre 2026
**Branch:** `images-phase-1`
**Modalità:** Claude PM, implementer Opus, revisore Sonnet, revisione visiva del PM sul foglio di contatto

Brief: `2026-10-20-images-phase-1-brief.md`. Report tecnico dell'implementer con il log
per pagina: `2026-10-20-images-phase-1-report.md`.

## Risultato

| | Pagine |
|---|---|
| Catturate | 46 |
| Saltate con motivo | 5: announcement-bar (disattivata sul demo), collage e featured-product (non piazzate sul demo, si renderizzano dall'anteprima editor in Fase 2), custom-liquid (nessun visual), article-overlay (nessun articolo usa il template overlay) |
| Mancanti | 0 |

Tutte 1600 px, tutte sotto i 300 KB, cartella asset a 6,1 MB. Ogni pagina generata ha ora
il render sotto l'intro; il controllo immagini e quello degli anchor sono a zero.

## Cosa è cambiato nella pipeline

- `manifest.json` completo: 51 voci, campi `selector` (per i template con id diverso da
  `u_<type>`), `setup` (`add-to-cart`, `open-cart`, `open-popup`, `open-menu`), `skip`
  con motivo, `maxHeight` per le liste lunghe (griglia collezione, ricerca, blog, lista
  collezioni), tagliate all'ultima riga intera di card, non a un pixel fisso.
- `screenshots.js`: i setup falliscono in modo esplicito (MISSING con motivo), la
  sticky bar del prodotto viene nascosta, secondo passaggio di compressione per i render
  fotografici, carrello verificato non vuoto prima della cattura.
- `contact-sheet.js`: foglio di contatto in `pipeline/out/contact-sheet.png` per la
  revisione in un colpo.

## Correzioni al brief emerse dal lavoro

- `page` (main-page) ha contenuto su `/pages/size-chart`: catturata, non saltata.
- Le pagine password si catturano dalla sessione normale: senza password il dev store
  mostra la pagina generica di Shopify, non il template del tema.
- Il mega menu si apre solo al click, non al passaggio del mouse.

## Decisioni del PM

- Prodotti di test ("SOCKS 3 options...") messi in bozza da Matteo durante la fase;
  rilanciate tutte le catture, la ricerca rifatta a parte quando l'indice si è aggiornato.
- Sticky Section: il render statico mostra la struttura, non l'effetto; accettato,
  candidato a un video breve.
- Advanced Hero Slideshow: fascia vuota in alto dovuta all'offset dell'header
  flottante; accettata, è come appare sul demo.

## Minori rimandati

- Snap di `maxHeight`: se la prima riga della griglia finisse oltre il limite, il taglio
  cadrebbe sopra la griglia (sulla fila delle categorie). Oggi non succede; si vede subito
  nel foglio di contatto se dovesse capitare.
- Con griglie senza gap i 40 px di respiro possono entrare nella riga successiva.

## Prossimi passi

Fase 2: confronti prima/dopo per uno o due setting per sezione, lista da approvare prima
di renderizzare; nello stesso giro i render di collage e featured-product dall'anteprima
dell'editor senza salvare. Fase 3: infografiche una alla volta.
