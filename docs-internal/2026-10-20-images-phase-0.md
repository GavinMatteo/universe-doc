# Immagini nella doc, Fase 0: test su Featured Collection

**Data:** 20 ottobre 2026
**Branch:** `images-phase-0`, PR #12, merge rebase su `main` in serata
**Modalità:** Claude PM, un subagent per task (Sonnet o Opus) e un revisore per task, revisione finale dell'intero branch con Opus

Design approvato da Matteo: `2026-10-20-images-design.md`. Piano eseguito: `2026-10-20-images-plan.md`.

## Cosa è andato live

- `theme-docs/sections/featured-collection.md`: render storefront sotto l'intro, cattura editor annotata sotto Section Settings, cattura del blocco Collection.
- `theme-docs/general-settings.md`: infografica Color scheme sotto il titolo omonimo.
- URL verificati in Chrome dopo il merge, immagini servite da `.gitbook/assets/` sincronizzate da git, nessuna icona rotta:
  - https://developpy.gitbook.io/universe-doc-git/collection-sections/featured-collection
  - https://developpy.gitbook.io/universe-doc-git/theme-settings/general-settings
- `docs.developpy.io` è un wrapper che carica lo spazio GitBook in un iframe: gli URL diretti alle pagine danno 404 lì, i link da condividere sono quelli `developpy.gitbook.io/universe-doc-git/...`.

## Cosa ha dimostrato il test

| Domanda | Risposta |
|---|---|
| GitBook mostra le immagini da `.gitbook/assets/` via git sync? | Sì, entro pochi minuti dal merge. L'alt text diventa la didascalia sotto l'immagine. |
| I deep link dell'editor funzionano? | `previewPath` basta per la pagina; la sezione si seleziona dall'albero a sinistra, per testo (case insensitive, startsWith di riserva). |
| Le annotazioni reggono? | Sì, rettangoli calcolati dai bounding box, barra superiore ritagliata. La linea di collegamento disturbava ed è stata tolta. |
| Peso | Render 193 KB, catture 148 e 120 KB, infografica 134 KB. Tutte 1600 px. |
| L'editor si può usare senza rischio? | Sì: guardia "nega per default" su ogni mutation GraphQL non in allowlist, 18 casi offline in `guard-cases.js`, prova dal vivo con una modifica non salvata. |

## Cosa è stato costruito

| Pezzo | File |
|---|---|
| Ottimizzatore PNG (sharp, 1600 px, palette) | `pipeline/lib/optimize.js` |
| Export slug pagina e anchor blocchi in JSON | `generator/anchors.py` |
| Generatore: riga immagine se il file esiste | `generator/generate.py` (`image_line`, `write_section_doc(assets_dir=...)`), test in `generator/tests/` |
| Render storefront da manifest | `pipeline/manifest.json`, `pipeline/screenshots.js` |
| Catture editor annotate | `pipeline/lib/editor.js`, `pipeline/lib/annotate.js`, `pipeline/editor-shots.js`, `pipeline/probe-editor.js`, `pipeline/guard-cases.js` |
| Login con il Chrome vero | `pipeline/login.js`, `pipeline/lib/chrome.js` |
| Renderer HTML e infografica | `pipeline/render-html.js`, `pipeline/infographics/color-scheme.html` |
| Validatore: controlli 7 e 8 | `.claude/agents/render-validator.md`, comando inline in `CLAUDE.md` |

Comandi nel cheat sheet di `CLAUDE.md`.

## Scoperte lungo la strada

- Shopify rifiuta il login dal Chromium di Playwright (il form si ricarica a ogni invio). Serve il Chrome installato, senza flag di automazione, con user agent normale (quello headless blocca anche il check Cloudflare dell'editor). Su questo Mac Chrome sta in `/Users/Shared/Previously Relocated Items/`, `lib/chrome.js` lo trova da solo.
- A 1600 px di viewport l'editor impila il pannello sotto l'albero: si cattura a 1800 e si riduce.
- Il salvataggio dell'editor è una mutation `TemplateUpdate` sull'app proxy, senza id tema nell'URL: una guardia per path non basta.
- Il tema ha 18 schemi colore, non 5. L'infografica mostra l'anatomia di uno schema più 4 esempi.
- Sul demo mancano collage, featured-product, article-overlay, page e le pagine password.

## Decisioni del PM durante l'esecuzione

- Task 1 (solo git) fatto dal PM; commit pipeline da 33 MB accettato per avere il kit brand nel repo; branch invece di worktree.
- `section_label` è l'etichetta del locale del tema, quella che l'editor mostra.
- Due render extra (Bold Slideshow, Testimonials) esclusi dalla Fase 0.
- Linea di collegamento tra albero e pannello eliminata; riquadri rientrati dal bordo.
- Task 8 eseguito prima del Task 6 in attesa del login.
- Revisione finale sull'intervallo dopo il commit di import della pipeline.
- Trailer di un commit corretto da Opus 5.5 a Fable 5.1.

## Minori rimandati

Prima della Fase 1: collisioni di anchor tra blocchi con lo stesso nome o con i titoli di sezione (es. un blocco "Colors"); il controllo 7 segnala come rotte le immagini esterne `https` (oggi non ce ne sono).

Possono aspettare: `render-html.js` non valida `--width`/`--height` e lascia i temporanei se `optimize()` fallisce; token `--lime-dot` inesistente nell'infografica; allowlist della guardia solo per nome (copre il salvataggio accidentale, non una richiesta contraffatta); `<shop>.myshopify.com/admin` senza slash finale non guardato; `--theme-dir` senza valore risolve alla cwd; `CHROME_BIN` non verificato; `chrome.js` lancia all'import; tre righe vuote prima del render nel Markdown; i test del generatore richiedono l'export del tema (gitignorato).

## Osservazione per la Fase 1

Su GitBook l'immagine è larga 768 px: la cattura editor intera (albero, anteprima, pannello) rende il testo del pannello piccolo. Da valutare un ritaglio più stretto (albero e pannello, anteprima ridotta) o la cattura del solo pannello per i blocchi.

## Prossimi passi

1. Fase 1: render storefront per tutte le 48 pagine (manifest completo, casi speciali: drawer, popup, header aperto, pagine password, sezioni assenti dal demo).
2. Fase 2: catture editor a lotti di 10, con la decisione sul ritaglio presa prima del primo lotto.
3. Fase 3: le altre 10 infografiche, una alla volta con ok di Matteo.
