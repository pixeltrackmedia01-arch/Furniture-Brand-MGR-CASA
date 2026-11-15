# Featherlite Store: scraped reference data

Scraped on 2026-11-15 from https://featherlitestore.com with `tools/scrape_featherlite.py`. The store runs on Shopify.

> **Usage note:** every image and every piece of copy here belongs to Featherlite. This folder is for research, layout prototyping and data-model reference. Before the store goes live, replace it with your own photography and copy, unless you have written permission from Featherlite.

## What's here

| Path | Contents |
|---|---|
| `data/products.json` | All **44** published products: title, type, SKU, price (INR), stock status, tags and facets, description, feature chips, model and colour options, grouped specifications, story sections, feature banners, FAQs, assurances, alternatives, assembly videos, full page text, and image list with local paths |
| `data/products.csv` | The same catalogue flattened to one row per product, with every specification as a column |
| `data/collections.json` | All **24** collections, with SEO title and description, image, and product handles |
| `data/homepage.json` | SEO meta, header and footer navigation, homepage sections and their copy, social links, theme fonts and CSS colour tokens |
| `data/pages/*.md` | All **20** content pages: About, Contact, Corporate orders, Warranty, Shipping, Returns, buying guides, and the technology pages (Multilock, Dynaflex, Synchro-tilt, Materials) |
| `data/policies/*.md` | Shopify legal policies: privacy, refund, terms, shipping, contact |
| `data/store.json` | Shop metadata: Bengaluru, India, INR, ships to India only |
| `data/image_manifest.csv` | Every downloaded image with its local path, size, context and source URL |
| `images/products/<handle>/NN.*` | Product gallery images in gallery order (**246**) |
| `images/product-features/<handle>/` | Feature and lifestyle banners from product pages (**97**) |
| `images/pages/<page>/` | Diagrams and photos used on content pages, such as mechanisms, materials and factory (**34**) |
| `images/collections/`, `images/homepage/`, `images/brand/` | Collection covers, homepage tiles, logo (`logo.webp`) and social share image (**19**) |

There are **396 unique images** in total, about 80 MB, and all of them downloaded successfully. The image links in `data/pages/*.md` point at these local copies.

## Re-running

```bash
python3 tools/scrape_featherlite.py reference/featherlite
```

The scraper skips images that are already on disk. Delete `reference/featherlite` to start a full refresh.
