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

## Design system

- **Type:** Libre Caslon Display for headlines, Libre Caslon Text italic for accent words, Hanken Grotesk for UI and body text. All fonts are self-hosted through Fontsource.
- **Colour:** bone `#f2ede4`, ink `#1c1a17`, terracotta `#a8492a`, moss `#4d5843`, night `#161411`. Tokens are on `:root` in `src/styles/global.css`.

## ⚠️ Placeholder content to replace before launch

- **Photography.** Every image currently comes from the Featherlite reference scrape in `reference/featherlite/` and is a placeholder only (see `PROJECT.md` for the rights note). To use MGR CASA photography:
  1. Product shots: point each variant's `handle`, or a new image list, in `tools/catalogue-copy.mjs` at your files, then run `npm run catalogue` (delete `public/images/products/<slug>` first so it rebuilds).
  2. Lifestyle and detail shots: replace the files in `public/images/scenes/` with the same names, or update the paths in `src/data/site.ts` and `src/data/catalogue.ts`.
- **Prices and dimensions** come from the reference catalogue.
- **Business details** in `src/data/site.ts` are invented samples: phone, WhatsApp, emails, studio addresses, stats, testimonials and warranty terms.
- **Reviews and ratings** are sample data.
