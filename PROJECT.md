# Furniture e-commerce store: project brief

Built from a full scrape of the reference store **featherlitestore.com** (Featherlite Collections, Bengaluru). The raw data and images are in [`reference/featherlite/`](reference/featherlite/README.md).

> **Content rights:** the scraped photos, logos and copy belong to Featherlite. Use them only as placeholders and as a guide to structure. Before launch, replace them with your own brand's photography and copy, unless you have Featherlite's written permission to resell their products with their assets.

---

## 1. What the reference store is

| | |
|---|---|
| Brand | Featherlite: office furniture made in India since 1965 |
| Positioning | Ergonomic office chairs and work-from-home tables, "trusted by India's largest IT employers" |
| Platform | Shopify, with Judge.me reviews and Razorpay checkout |
| Market | India only, priced in INR, prices include GST |
| Catalogue | 44 published products in 24 collections |
| Price range | Rs. 3,230 (open shelf) to Rs. 75,999 (Pinnacle chair). Office chairs run from Rs. 4,199 to Rs. 75,999 |
| Discounts | None. No product has a compare-at (sale) price |

**Brand proof points used across the site:** 60+ years of manufacturing, 100,000+ customers, 70 locations, a 650,000 sq ft solar-powered factory, 75,000 chairs made per month, and 200,000+ chairs shipped to corporate clients.

**Commercial promises:** free shipping across India, delivery in 3 to 5 working days, a 3-year warranty on mechanisms, payment by UPI, card, net banking or wallet (Razorpay), GST invoices on request (GSTIN field in the cart), and optional expert installation booked through a third-party partner (Wify).

**Contact:** customercare@featherlitefurniture.com · 080 4719 1010 (Mon–Fri, 9:30–18:00) · No.16A Millers Road, Vasanthnagar, Bengaluru 560052. Corporate quotes go to reachout@featherlitefurniture.com.

## 2. Catalogue

| Product type | Count | Notes |
|---|---|---|
| High back chairs (with headrest) | 13 | Helix, Optima, Pinnacle, Enzo, Liberate, Amaze, Anatom, Opus, Astro, Versa, Contact |
| Mesh chairs (medium back, no headrest) | 12 | The same series without headrest, plus the Student chair |
| WFH tables | 9 | Height-adjustable (Rise, Elevate, Airlift, Motion 2), computer tables (Flip, Step-Up, Workhub), study tables (Nexus) |
| Open storage | 3 | Open shelves in 60, 90 and 120 cm widths |
| Gaming / lounge chairs | 3 | Liberate Game (blue and orange), Eclipse Game |
| Other chairs | 3 | Smart (low back), Comet (medium back), Victor M (fabric) |
| Accessories | 1 | WFH power outlet |

**Product model:** each Shopify product has a single variant. Colour and headrest versions are separate products, linked by a "model switcher" (for example Headrest: with / without, and Colour: Black / Grey with swatches). The rebuild should treat these as **one product with real variants**: series × back height × colour.

**Data available for each product** (see `data/products.json`):
- Title, SKU, price, stock status, product type and tags
- Filter facets: back type, material, mechanism, feature, use case
- Feature chips such as "Adjustable Lumbar", "Synchro Tilt" and "DynaFlex Back Support"
- Grouped specifications for weight, overall dimensions, seat, and arms and backrest (38 of 44 products). Table and storage products carry their specs in the description instead
- Story sections (lumbar, mechanism, materials), feature banners with images, and 3 to 5 FAQs per product
- Assembly video (YouTube) for 15 products, links to alternative products, and an image gallery of 2 to 10 photos

## 3. Site structure to rebuild

**Header:** Office Chairs · Tables · Office Accessories · About · Contact · Search · Account · Cart

**Homepage sections, in order:**
1. A strip of selling points: 60+ years · Free shipping · 3-year warranty · Trusted by IT employers · Secure checkout
2. "Shop by category" tiles: Chairs with headrest, Chairs without headrest, Height-adjustable desks, Office tables
3. Best-selling office chairs carousel, with rating, price and quick add
4. A feature band explaining a technology (the "DynaFlex" spine-flex back), linking to the products that use it
5. A product row for that technology range
6. Office tables and desks carousel

**Collection page:** filters for back type, material, mechanism, features, price and availability, sorting, and product cards showing rating, price and "Incl. taxes · Free shipping".

**Product page:**
- Gallery
- Title and rating
- Price with a note that it includes taxes and shipping
- Feature chips
- Model or colour switcher
- Add to cart, plus a link to book installation
- Assurance list: delivery, warranty, payment, GST invoice, phone number
- Alternative products
- Lumbar and mechanism story sections
- Feature banners
- Specification groups
- Assembly video
- FAQs
- Trust row

**Footer:**
- Shop: Chairs, Tables, Gaming
- Guides: Best chairs 2026, Compare chairs, Workspace setup, Multilock, Dynaflex, Materials, Engineering, Blog
- About: About, Contact, Corporate orders, Customers, Office furniture Bangalore
- Customer care: Shipping, Returns, Warranty, Privacy, Terms
- Newsletter sign-up and social links: Facebook, Instagram, X, LinkedIn

**Content pages** (copy is in `data/pages/`): About · Contact · Corporate/Bulk orders · Customers · Warranty · Shipping · Returns · Terms · Privacy choices · Compare chairs · Best office chairs 2026 · Buying guide · Chairs for back pain · Standing vs sitting desk · Workspace setup guide · Multilock mechanism · Dynaflex system · Synchro-tilt · Materials library · Engineering

## 4. Design tokens (from the reference theme)

- **Fonts:** Space Grotesk for headings and accents, Inter for body text.
- **Colours:** near-black text `#0a0a0a`, white surfaces, red accent `#d63031` (assurance dots), swatch black `#1d1d1f` and swatch grey `#9c9ca1`. The full CSS tokens are in `data/homepage.json` under `theme_css_variables`.
- **Imagery:** chairs photographed on white from 0°, 45°, 90° and 180°, plus wide 2000×750 lifestyle and feature banners.

## 5. Recommended build for our store

**Features, in priority order:**
1. **Catalogue:** products with variants (colour and headrest), collections, faceted filters, search.
2. **Product page:** gallery, a variant switcher with swatches, grouped specs, FAQs, assembly video, related products.
3. **Cart and checkout:** Razorpay (UPI, cards, net banking, wallets), a GSTIN field and GST invoice, free shipping, a pincode delivery estimate.
4. **Reviews and ratings** shown on cards and on product pages.
5. **Bulk/corporate enquiry form:** seat count, cities, timeline, preferred models. This leads to a quote, with bulk pricing from 10 units.
6. **Content:** guides, comparison table, technology pages for SEO, and a blog.
7. **Add-ons:** expert installation, chair comparison tool, wishlist, order tracking.
8. **Policies:** cancellation within 24 hours, damage reported within 24 hours, a Rs. 1,500 restocking fee for change-of-mind returns, refunds within 2 weeks.

**Data model** (directly seedable from `data/products.json`):
```
Category(id, handle, title, description, image, seo)
Product(id, handle, series, title, type, description, feature_chips[], story_sections[], faqs[], video_urls[], seo)
Variant(id, product_id, sku, price_inr, compare_at_inr, stock, back_type, colour, colour_hex, has_headrest)
ProductImage(id, product_id, variant_id?, url, alt, position)
Spec(product_id, group, key, value)          # e.g. Seat / Seat Width / 505±10mm
ProductCategory(product_id, category_id)
Review(id, product_id, rating, title, body, author, verified)
Order / OrderItem / Customer / Address(+gstin)
BulkEnquiry(name, company, email, phone, seats, cities, timeline, models)
```

**Suggested stack:** Next.js storefront plus a headless commerce backend (Shopify Storefront API, Medusa, or Supabase with Razorpay). A seed script can map `reference/featherlite/data/products.json` straight onto the model above.

## 6. Next steps
1. Confirm the brand name, logo and colours (this repo is named "CASA").
2. Choose the stack: headless Shopify, Medusa, or custom with Supabase.
3. Scaffold the storefront and import the catalogue as seed data.
4. Swap in your own product photography and copy before launch.
