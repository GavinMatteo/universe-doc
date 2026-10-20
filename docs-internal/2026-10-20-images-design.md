# Immagini nella doc: design

**Data:** 20 ottobre 2026
**Stato:** bozza in attesa dell'approvazione di Matteo
**Prerequisito:** la prova del 19 e 20 ottobre (`2026-10-19-screenshots-videos-proof.md`), con la pipeline in `pipeline/` ancora da committare

---

## Intento

La doc Universe batte i concorrenti sul riferimento delle impostazioni (tabelle, una
descrizione per setting) ma è tutta testo. L'obiettivo è renderla visiva come quella
di FoxEcom, con una qualità superiore, e soprattutto **rigenerabile**: a ogni review
round del tema le tabelle si rifanno da script, e le immagini devono rifarsi allo stesso
modo. Nessuna immagine fatta a mano nelle pagine generate.

## Cosa ha deciso Matteo

- Un mix di tre livelli: render dello storefront, catture dell'editor del tema annotate,
  infografiche per i concetti complicati. Reference di densità: FoxEcom; le infografiche
  devono essere migliori delle loro.
- Densità delle catture editor: **una per pannello sezione e una per tipo di blocco**,
  non una per gruppo di impostazioni.
- Prima un test su una pagina, poi il rollout.
- Claude fa da PM: pianifica, delega ai subagent (modelli più economici di Fable vanno
  bene), revisiona tutto prima del merge.
- Ogni visual usa il kit brand Developpy in `pipeline/brand/` (regola fissata il 19 ottobre).

## Obiettivi

1. Ogni pagina sezione (33 in `sections/` più i 18 chrome e template alla root) ha un
   render storefront sotto l'intro.
2. Ogni pagina sezione ha una cattura editor annotata sotto "Section Settings" e una
   sotto ogni blocco.
3. Le pagine concettuali (`general-settings.md`, `theme-settings.md`, le guide) e le
   sezioni con meccaniche non ovvie hanno infografiche brandizzate.
4. Tutto si rigenera con pochi comandi quando esce una nuova versione del tema.
5. Le pagine restano leggibili su GitBook: immagini leggere, nessun link rotto.

## Non obiettivi

- Video: fuori scope qui, hanno il loro filone (serie stile Krown, vedi la prova).
- Catture mobile: solo desktop in questa fase.
- Una cattura per ogni singolo setting (stile FoxEcom denso): scartato.
- Screenshot dell'admin Shopify fuori dall'editor del tema (prodotti, collezioni,
  navigazione): non in questo round.

## Anti obiettivi (cosa renderebbe il lavoro un fallimento)

- Immagini che invecchiano: una cattura fatta a mano che nessuno rifà al prossimo round.
- Immagini pesanti che rallentano GitBook o gonfiano il repo (sopra i 300 KB l'una va
  giustificato).
- Rettangoli rossi "da Paint": le annotazioni devono sembrare parte del brand.
- Salvare per sbaglio qualcosa nell'editor del tema demo.
- Pagine generate ritoccate a mano: al prossimo `generate.py` sparirebbe tutto.

## Vincoli

- GitBook sincronizza solo `theme-docs/`. Le immagini vivono in
  `theme-docs/.gitbook/assets/` (convenzione GitBook) e si referenziano con path relativo.
- Le pagine sezione sono generate da `generator/generate.py`: la riga immagine la emette
  il generatore, non la mano.
- Il demo store è dietro password (`universe`). L'editor del tema richiede il login di
  Matteo: `node pipeline/login.js` una volta, salva `pipeline/.auth/shopify.json`
  (gitignorato). Claude non può fare il login.
- Gli ID tema cambiano a ogni round: leggere `shopify theme list` prima di ogni run.
- Niente trattini lunghi in nessun testo, inclusi alt text e didascalie.

## Cosa c'è sul demo store (rilevato il 20 ottobre)

| Dove | Sezioni modulari renderizzate |
|---|---|
| Home | bold-slideshow, advanced-product-carousel, big-text, promo-banner, advanced-hero-slideshow, featured-collection, spotlighted-product, sticky-section, best-choice-offer, multicolumn, scrolling-pills, image-with-text, reviews-showcase, touch-and-take, featured-data, collection-list, rich-text, ugc-carousel, comparison-table, then-vs-now, diagonal-texts, featured-blog, icon-list, newsletter-section |
| Prodotto (`/products/beef-bites`) | main-product, related-products, scrolling-text, faq |
| About | quotes |
| Contact | contacts, faq |
| Store locator | store-locator |
| Altre | collection-grid-banner e product (`/collections/all`), main-collection-list (`/collections`), blog (`/blogs/news`), article-banner (`/blogs/news/dog-paw-care`), search, cart, 404, footer, header, drawer-cart (da aprire), popup-newsletter (da forzare) |

**Mancano sul demo:** `collage`, `featured-product`, `custom-liquid`, `article-overlay`,
`page` (main-page), `password-header` e `password-footer` (la pagina password esiste ma
va catturata prima di inserire la password). Per `collage` e `featured-product` la
cattura si prende dall'anteprima dell'editor dopo averli aggiunti senza salvare, oppure
Matteo li aggiunge al demo. `custom-liquid` non ha bisogno di immagine.

## Le tre famiglie di immagini

### 1. Render storefront (uno per pagina)

Già funzionante in `pipeline/screenshots.js` sui tre esempi approvati. Da estendere:
la mappa pagina → URL e selettore esce dal codice e va in un manifest
(`pipeline/manifest.json`), un'entrata per pagina doc. Casi speciali: drawer cart
(click sull'icona carrello, cattura con il drawer aperto), popup newsletter (rimuovere
il cookie che lo nasconde), header (cattura con il menu aperto), password pages.

Viewport 1440 css px a 2x, poi ridimensionato a 1600 px di larghezza e compresso.

### 2. Catture editor annotate (una per pannello, una per blocco)

Playwright apre l'editor del tema demo con la sessione salvata da `login.js`, naviga
alla pagina giusta con `previewPath`, seleziona la sezione nell'albero di sinistra, e
cattura l'intero editor a 1600x1000 css px a 2x. Per ogni blocco: click sul blocco
nell'albero, cattura. Nessun click su Save, mai; alla fine si chiude la pagina e
l'editor scarta le modifiche non salvate.

Annotazioni disegnate nel DOM prima dello screenshot (non a mano, non dopo): un
rettangolo Purple `#7852fc` da 3 px con angoli arrotondati attorno alla voce
nell'albero di sinistra e uno attorno al pannello di destra, collegati da una freccia
sottile dello stesso colore. Il colore Lime resta per una sola parola accento nelle
infografiche, non per le annotazioni. Il rettangolo si calcola dal bounding box
dell'elemento trovato per testo (nome sezione o blocco nel locale del tema), quindi
segue il layout anche se Shopify sposta qualcosa.

### 3. Infografiche brandizzate

Pagine HTML in `pipeline/infographics/<nome>.html` che caricano `brand/tokens.css`
(Figtree per il testo, Barracuda per la parola accento, gradiente purple → dark violet,
forme glass dove ha senso), renderizzate in PNG a 1600 px da un `render-html.js` che
generalizza l'attuale `banner.js`. Sono SVG e CSS, quindi leggere e modificabili.

Lista candidata, da confermare con Matteo (8 a 12):

| Infografica | Pagina |
|---|---|
| Color scheme: come i 5 schemi mappano su sfondo, testo, bottoni | `general-settings.md`, `theme-settings.md` |
| Padding e spacing: top, bottom, section spacing a confronto | `general-settings.md` |
| Highlighted text: la sintassi e il risultato | `general-settings.md` |
| Shape divider: posizioni e forme | `general-settings.md` |
| Anatomia dell'header: announcement bar, floating header, mega menu | `header-nav.md`, `guide-mega-menu.md` |
| Drawer cart: soglia spedizione gratuita e upsell | `drawer-cart.md` |
| Pagina prodotto: zone (galleria, info, blocchi, sticky bar) | `main-product.md` |
| Griglia collezione: filtri, banner, card prodotto | `collection-grid-product.md` |
| Scala tipografica: heading, body, labels, bottoni | `theme-settings.md` |
| Color swatch: da opzione prodotto a pallino colorato | `guide-color-swatches.md` |
| Breadcrumbs: da dove arrivano | `theme-settings.md` |

## Dove vanno le immagini e come le emette il generatore

```
theme-docs/.gitbook/assets/
  sections/<page-slug>.png                render storefront
  editor/<page-slug>/section-settings.png cattura pannello
  editor/<page-slug>/<block-anchor>.png   cattura blocco
  infographics/<page-slug>/<anchor>.png   infografica sotto quel titolo
```

`<page-slug>` è il nome del file `.md` senza estensione; `<anchor>` è lo slug prodotto
da `make_anchor()` per il titolo. Regola del generatore: dopo l'intro cerca
`sections/<slug>.png`; dopo ogni titolo con anchor A cerca `editor/<slug>/A.png` e poi
`infographics/<slug>/A.png`. Se il file esiste emette la riga immagine, altrimenti
niente. Così una pagina senza cattura non si rompe e non serve un manifest lato
generatore. Alt text = titolo della pagina o del blocco. Path relativo:
`.gitbook/assets/...` per le pagine root, `../.gitbook/assets/...` per `sections/`.

Nelle pagine scritte a mano (guide, general-settings) la riga immagine la scrive chi
scrive la pagina, con la stessa cartella `infographics/<slug>/`.

## Pesi e formato

PNG ottimizzato con `sharp` (palette, qualità 80), 1600 px di larghezza, obiettivo
sotto i 300 KB per le catture e sotto i 150 KB per le infografiche. Il test confronta
sharp e pngquant sugli stessi file prima di scegliere. WebP è scartato per non
dipendere dal supporto GitBook.

## Validazione

`render-validator` guadagna un controllo: ogni `![...](...)` in `theme-docs/` deve
puntare a un file esistente. E un avviso: immagini in `.gitbook/assets/` che nessuna
pagina referenzia.

## Fasi

**Fase 0, test (una pagina, Featured Collection):** login di Matteo; render storefront;
catture editor annotate per pannello e per i blocchi; una infografica (color scheme);
modifica al generatore; rigenerazione; PR; verifica sulla pagina live GitBook. Il test
risponde a: i deep link dell'editor funzionano; le annotazioni reggono; il peso è ok;
GitBook mostra le immagini da `.gitbook/assets/` sincronizzate da git.

**Fase 1, render storefront** per tutte le pagine (manifest completo).

**Fase 2, catture editor** per tutte le pagine, a lotti di 10, ciascuno revisionato.

**Fase 3, infografiche**, una alla volta, ognuna approvata da Matteo prima della prossima.

**Fase 4, chiusura:** validatore, PR, log di sessione in `docs-internal/`, aggiornare
`CLAUDE.md` con i comandi della pipeline immagini.

## Ruoli dei subagent (modelli non Fable)

- **capture-runner** (general-purpose, Sonnet): esegue gli script di cattura su un
  lotto, riporta `MISSING` e anomalie, non tocca il generatore.
- **infographic-designer** (general-purpose, Opus, con le skill `frontend-design` e
  `ui-ux-pro-max:brand`): costruisce un HTML per infografica rispettando `BRAND.md`.
- **generator-dev** (general-purpose, Sonnet): modifica `generate.py` e il validatore,
  con test sulla pagina campione.
- **render-validator** (esistente): gate prima di ogni PR.
- Il PM (Claude, Fable) scrive il manifest, revisiona ogni immagine aprendola, revisiona
  i diff, fa le PR.

Gli agenti che scrivono file diversi girano in parallelo; chi tocca lo stesso file va in
sequenza (regola del 21 maggio).

## Strumenti

Ricerca fatta il 20 ottobre: nessuna skill o plugin esterno batte Playwright più
`sharp`. Skill già presenti da usare: `frontend-design`, `ui-ux-pro-max:brand` e
`banner-design` per le infografiche, `artifact-diagramming` per le meccaniche SVG. Il
plugin Playwright MCP serve per esplorare il DOM dell'editor dal vivo durante il test.
Da installare: solo `sharp` in `pipeline/`.

## Scelte fatte dal PM dopo la revisione del documento

Un revisore (Sonnet) ha letto il documento come costruttore e ha posto otto domande.
Queste le risposte che non cambiano cosa si costruisce, quindi decise qui:

- **Pannelli più lunghi della cattura.** La cattura editor serve a orientare ("dove
  sta questa cosa"), non a sostituire la tabella che la segue. Viewport 1600x1100,
  pannello scrollato in cima, nessuno stitching. Se il test mostra che non basta si
  alza la viewport, non si cuce.
- **Barra superiore dell'editor.** Si ritaglia via: toglie nome tema, nome store e il
  bottone Save dall'immagine, quindi niente da mascherare. Restano albero, anteprima e
  pannello.
- **Blocchi assenti nell'istanza demo.** Se il blocco si può aggiungere dall'editor lo
  si aggiunge senza salvare e si cattura. Shape Divider e App Block non si catturano
  (il primo ha l'infografica, il secondo non mostra nulla di utile). Un blocco che non
  si riesce ad aggiungere resta senza immagine e finisce nel report `MISSING`.
- **Fallimenti di cattura.** Lo script cancella le immagini della pagina prima di
  ricatturarla, così un'immagine vecchia non sopravvive in silenzio a una rinomina.
  Una cattura fallita viene saltata e riportata, il lotto continua.
- **Crescita del repo.** Le immagini stanno in git, niente LFS (GitBook non lo
  supporta) e niente host esterno. Una rigenerazione completa pesa intorno ai 50 MB;
  si rigenera per pagina, solo dove lo `schema-differ` segnala cambi, e tutto insieme
  solo a un cambio di look del tema. Da rivalutare se il repo supera i 500 MB.
- **Pagine root.** Header, footer, announcement bar e popup si catturano dai gruppi di
  sezione dell'editor; main-product per ultimo perché ha molti blocchi. Tutte in Fase 2.
- **Sandbox.** Finché Matteo non decide diversamente, si lavora sul tema demo live con
  una guardia nello script: nessun click su Save e chiusura della pagina a fine lotto
  scartando le modifiche.

## Scelte lasciate a chi costruisce

- Struttura interna di `manifest.json` e degli script, purché un comando per famiglia.
- Come forzare popup e drawer per la cattura.
- Come trovare le voci nell'albero dell'editor (testo, aria, id): quello che regge.
- Se la freccia tra albero e pannello aiuta o disturba: decidere guardando il test.
- Lingua dell'editor durante le catture: inglese, come la doc.

## Decisioni aperte per Matteo

1. Fare il login: `cd pipeline && node login.js` (apre Chromium, lui accede, il file
   di sessione resta locale).
2. Le catture editor si fanno sul tema demo live (206989590871) senza mai salvare, o
   preferisce un duplicato del tema demo da usare come sandbox?
3. `collage` e `featured-product`: li aggiunge lui a una pagina del demo, o li prendiamo
   dall'anteprima dell'editor senza salvare?
4. La lista delle infografiche: quali tenere, quali aggiungere.
5. Lingua dell'account Shopify con cui fa il login: se è in italiano, l'editor esce
   in italiano e le catture pure. Serve inglese, o via parametro URL (da verificare nel
   test) o impostando l'account in inglese per la durata delle catture.

## Revisione della strategia (20 ottobre, sera, dopo il test live)

Matteo ha visto la Fase 0 su GitBook e ha chiesto a cosa serva uno screenshot con tutti
i setting. Risposta: a poco. Rivisto il piano partendo dai tipi di pagina (Diátaxis:
riferimento, spiegazione, procedura, tutorial) e dalle regole sugli screenshot delle doc
migliori (uno screenshot vale solo se dice "dove", "quale" o "che effetto ha"; ritaglio
stretto, una idea per immagine; pochi per pagina perché invecchiano; il render del
prodotto batte lo screenshot dello strumento; i diagrammi concettuali durano di più).

Decisioni confermate da Matteo:

- **Pagine sezione (riferimento):** un render storefront sotto l'intro, come riferimento
  grafico di "come viene". Nessuna cattura del pannello dell'editor: la tabella è già il
  pannello in forma più leggibile. Confronti prima/dopo per uno o due setting che cambiano
  davvero il look, scelti a mano per sezione, prodotti dall'anteprima dell'editor senza
  salvare. Infografica solo dove c'è un concetto da spiegare.
- **Pagine concettuali (spiegazione):** infografiche, senza abusarne.
- **Guide (procedura):** qui i visual contano di più. Catture dell'editor ritagliate
  strette, una per passo, una sola evidenziazione; infografica quando un passo è
  concettuale.
- **Video (tutorial):** lista a parte, `2026-10-20-videos-list.md`.

Fasi aggiornate: Fase 1 render storefront per tutte le pagine (invariata); Fase 2
confronti di setting (lista approvata da Matteo prima di renderizzare); Fase 3
infografiche (una alla volta con ok); Fase 4 guide con catture editor per passo. Le
due catture editor di Featured Collection andate live con la Fase 0 vengono tolte.
`editor-shots.js` resta per la Fase 4, con un ritaglio per passo invece della finestra
intera.
