# Screenshot, video e banner: prova di fattibilità

**Data:** 19 e 20 ottobre 2026
**Branch:** nessuno ancora, lavoro in `pipeline/` non committato
**Modalità:** Claude costruisce la pipeline, Matteo decide su scope e stile

---

## Cosa ha chiesto Matteo

Dopo il sync del Third Review (PR #9): capire come Concept, FoxEcom (Sleek) e Krown fanno
doc, screenshot e video; se Claude può registrare e montare i video con effetti e voce;
una prova di 3 immagini e 1 video; una grafica ottimizzata per il banner YouTube, da
caricare; una cartella con tutto il branding Developpy da usare in ogni visual.

## Ricerca sui concorrenti (sintesi, il dettaglio è in memoria)

- FoxEcom Sleek: GitBook, video in cima alle pagine chiave, 6 screenshot editor per
  pagina con rettangolo rosso, pagina "Video tutorials" a griglia. Canale 207 video.
- Krown: Help Scout, categoria "Video Guides" per tema, serie "Setup" di 4 video da 5-8
  minuti. Canale 30 video, stessi iscritti di FoxEcom.
- RoarTheme Concept: blog Shopify, un render storefront per articolo, niente video.
- Anatomia comune dei video: 5-8 min, intro 20s, 8-10 capitoli uguali alle intestazioni
  della doc, timestamp in descrizione.

Decisione: render storefront per ogni pagina sezione (stile Krown), catture editor
annotate solo nelle guide, serie video stile Krown, video in cima alla pagina GitBook.

## Correzione collaterale: SUMMARY da git

GitBook prende titolo di pagina e H1 dall'etichetta in SUMMARY.md. Le due pagine
rinominate nel Third Review erano live col titolo vecchio. PR #10 ha cambiato le etichette
da git: sync riuscito in 20 secondi, nessun commit di ritorno da GitBook. CLAUDE.md
aggiornato in PR #11. Da oggi una rinomina di sezione porta con sé l'etichetta in SUMMARY
nella stessa PR.

## La pipeline (`pipeline/`)

| File | Cosa fa |
|---|---|
| `lib/store.js` | apre lo storefront demo superando il gate password (`STORE_PASSWORD`), nasconde popup e animazioni |
| `discover.js` | elenca le sezioni renderizzate su una pagina con tipo e altezza |
| `screenshots.js` | render storefront delle sezioni: header flottante nascosto (tranne hero), ritaglio esteso ai titoli che sporgono, respiro di 40px sull'elemento che porta lo sfondo quando il titolo è a filo |
| `banner.html` + `banner.js` | banner 2560x1440 con area sicura 1546x423, token brand, Barracuda per la parola accento, forme glass |
| `banner-developpy.html` | variante per il canale Developpy: logo esteso, "Shopify software house", store dei case study intorno |
| `login.js` | apre Chromium visibile sull'admin Shopify, Matteo fa il login, salva `.auth/shopify.json` |
| `record-storefront.js` | registra le scene storefront del video Drawer Cart in webm 1920x1080 con cursore disegnato |
| `video/` | progetto Remotion: `src/script.ts` (timeline e narrazione), `src/DrawerCart.tsx` (intro, scene con capitolo e sottotitoli, outro, audio), voce con `say -v Daniel` e manifest delle durate |
| `brand/` | kit brand Developpy, vedi `brand/BRAND.md` |

Output in `pipeline/out/` (gitignorato): 3 render di sezione, 2 banner, frame di controllo.

## Il kit brand (`pipeline/brand/`)

Manuale di luglio 2024 (Vittoria Lama), palette (Dark Violet, Mirtillo, Purple, Lilac,
Lime), Figtree per il copy e Barracuda per gli accenti, 12 logo SVG più PNG e PDF, 76 render
"glass shapes", mockup, badge partner, grafiche feature Universe da Instagram, screenshot
dei case study dal sito. Fonti: Drive "Asset Developpy", `~/Downloads/Assets Developpy`,
`Developpy Toolkit/Instagram/brand`, `Developpy Website/assets`. I PDF e i mockup sono
gitignorati per peso.

## Stato alla chiusura

- 3 immagini: fatte (Bold Slideshow, Testimonials Carousel, Featured Collection).
- Banner: v2 per la doc Universe e v3 per il canale Developpy (Matteo ha chiesto quello
  generico). Caricamento su YouTube non fatto: serve il suo Chrome con YouTube Studio.
- Video Drawer Cart: renderizzato, 67 secondi, `pipeline/video/out/drawer-cart.mp4`
  (gitignorato). Il recorder passa il gate su una pagina separata così le clip partono
  già sulla pagina prodotto; la regola CSS anti-popup non deve toccare il gruppo overlay
  del tema, che contiene il drawer. Scene nell'editor del tema non registrate: serve il login via
  `node pipeline/login.js`.
- Installati: Playwright 1.58 con Chromium, ffmpeg 9 via brew, Remotion 4.0.432.

## Da fare

- Decidere se mettere i render nelle pagine generate (`theme-docs/.gitbook/assets/`) e
  far emettere al generatore la riga immagine.
- Registrare le scene editor e allungare il video ai 3-4 minuti previsti.
- Voce: passare a ElevenLabs se la prova convince.
- Caricare il banner e il video dal Chrome di Matteo.
- Committare `pipeline/` con PR.
