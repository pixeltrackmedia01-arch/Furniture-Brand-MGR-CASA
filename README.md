# MGR CASA: frontend prototype

A multi-page, frontend-only website for MGR CASA, built with React 18, TypeScript, Vite and React Router. There is no backend: the catalogue, content and enquiries all live in local files and the browser.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check and build to dist/
npm run preview   # serve the production build
```

## What's included

| Area | Route | Notes |
|---|---|---|
| Homepage | `/` | The immersive experience: cinematic hero slideshow, scroll-lit manifesto, expanding collection panels, an interactive chair "anatomy" with hotspots, a pinned horizontal product rail, room tabs, animated stats, a materials explorer, testimonials, a trade band, the journal and a studio CTA |
| Shop | `/shop`, `/shop/:category`, `/collections/:line` | Faceted filters (type, collection, room, material, mechanism, back height, price, stock) with live counts, sorting, a mobile filter drawer and URL-synced state |
| Product | `/product/:slug` | Gallery (swipeable on mobile), variant switcher (colour swatches and options, synced to `?v=`), quantity, enquiry CTA, enquiry list, wishlist, compare, WhatsApp, pincode delivery estimate, specs, design story, FAQs, related and recently viewed, Product JSON-LD |
| Enquiry list | `/enquiry-list` | A quote basket in place of a cart, sent as a single enquiry |
| Wishlist, Compare, Search | `/wishlist`, `/compare`, `/search?q=` | |
| Brand and content | `/about`, `/trade`, `/contact`, `/journal`, `/journal/:slug`, `/info/:slug`, `/faq` | `/trade` includes the B2B quote form (seats, timeline, GSTIN) |

The homepage is deliberately expressive. Category and product pages follow calm, conversion-focused D2C patterns. All motion respects `prefers-reduced-motion`.

## Project structure

```
src/
  data/
    catalogue.ts               types and query helpers: the only file pages use to reach product data
    products.generated.json    built by tools/build-catalogue.mjs
    site.ts                    brand details, studios, testimonials, journal, policies, FAQ
  lib/
    store.tsx                  enquiry list, wishlist, compare, recently viewed (localStorage)
    enquiry.ts                 mock submitEnquiry() and validation: replace with a fetch() to add a backend
    hooks.ts                   reveal-on-scroll, scroll progress, SEO, media queries
  components/                  Header (mega menu, drawer, search), Footer, ProductCard, EnquiryModal, ...
  pages/                       one file per route
  styles/                      global.css (tokens and components), home.css, shop.css, product.css, pages.css
tools/
  catalogue-copy.mjs           MGR CASA product names, copy, variants and image sources
  build-catalogue.mjs          converts source photos to WebP and writes products.generated.json
```

**Connecting a backend later:** replace the body of `submitEnquiry()` in `src/lib/enquiry.ts` with an API call, and back the helpers in `src/data/catalogue.ts` with API data. Components do not need to change.

## Homepage hero

The banner is a full-screen "flavour slider" (`src/components/FlavourHero.tsx`, configured in `src/data/heroSlides.ts`, styled in `src/styles/hero.css`). It has five slides: Lounge, Executive, Ergo, Velvet and Boss. Each slide has a flat colour, a giant white word behind one hero product, and smaller chairs, sofas and material swatches floating at different depths.

- **Motion:** changing slide plays a measured right-to-left panel wipe with parallax.
- **Controls:** autoplay every 2.6 s (paused for 6 s after any interaction), tabs, arrows, the arrow keys and swipe.
- **Accessibility:** reduced motion is respected.
- **Cut-outs:** the transparent product cut-outs and swatch discs come from `npm run cutouts` (`tools/make-cutouts.mjs`). It removes white or grey backgrounds, keeps the soft floor shadow and drops stray annotation text.

Below the hero, `src/components/CategoryGrid.tsx` shows the category tiles.

## Design system

- **Type:** Outfit (geometric sans) for display text and headings, Manrope for UI and body text. Both are self-hosted through Fontsource.
- **Colour:** warm walnut and cream: ivory `#fbf7f0`, oat `#f1e8da`, espresso `#2a1e17`, caramel `#b5651d`, sage `#6f7b5e`. Tokens are on `:root` in `src/styles/global.css`.

## Catalogue and images

The catalogue has 62 products in five categories: **Living** (sofas, sectionals, sofa-cum-beds, chaises, armchairs, ottomans), **Seating** (executive, boss, task, work and lounge chairs), **Desks & Tables**, **Storage** and **Accessories**.

| Range | Copy and variants | Photo source |
|---|---|---|
| Living, Executive chairs | `tools/catalogue-copy-drive.mjs` | The shared Google Drive folder: Furlenco sofas and Cellbell chairs |
| Task chairs, desks, storage | `tools/catalogue-copy.mjs` | `reference/featherlite/` |

The optimised WebP images in `public/images/` are committed, so the site runs without the raw files. To regenerate them, re-download the Drive folder (about 470 MB, git-ignored) and rebuild:

```bash
pip install gdown
python3 tools/fetch-drive-images.py
npm run catalogue
```

## ⚠️ Placeholder content to replace before launch

- **Photography.** All product and lifestyle photos come from third-party stores (Featherlite, Furlenco and Cellbell), via the reference scrape and the shared Drive folder. They are placeholders only: replace them with MGR CASA's own photography, or get written permission, before launch. To swap in new photography:
  1. Product shots: point each variant's `dir` (Drive set) or `handle` (Featherlite set) at your files, then run `npm run catalogue`. Delete `public/images/products/<slug>` first so it rebuilds.
  2. Lifestyle and detail shots: replace the files in `public/images/scenes/` with the same names, or update the paths in `src/data/site.ts` and `src/data/catalogue.ts`.
- **Prices** come from the source stores. Sofa dimensions are indicative estimates; chair and desk dimensions come from the reference catalogue.
- **Business details** in `src/data/site.ts` are invented samples: phone, WhatsApp, emails, studio addresses, stats, testimonials and warranty terms.
- **Reviews and ratings** are sample data.
