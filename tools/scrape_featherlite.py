#!/usr/bin/env python3
"""Scrape featherlitestore.com (Shopify) for reference data and images.

Collects every published product (JSON + rendered product page details),
every collection, site pages, policies, navigation, homepage content and
all images used by them.

Usage:  python3 tools/scrape_featherlite.py [output_dir]
Default output: reference/featherlite
"""
import csv
import hashlib
import json
import os
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md

BASE = "https://featherlitestore.com"
OUT = sys.argv[1] if len(sys.argv) > 1 else "reference/featherlite"
DATA = os.path.join(OUT, "data")
IMG = os.path.join(OUT, "images")
S = requests.Session()
S.headers["User-Agent"] = "Mozilla/5.0 (research scraper)"

image_jobs = {}  # url -> (path, context)


def get(url, as_json=False, tries=4):
    for i in range(tries):
        try:
            r = S.get(url, timeout=60)
            r.raise_for_status()
            return r.json() if as_json else r.text
        except Exception as e:  # noqa: BLE001
            if i == tries - 1:
                print("FAILED", url, e)
                return None
            time.sleep(2 ** i)


def norm_img(src):
    if not src:
        return None
    src = src.strip().split(" ")[0]
    if src.startswith("//"):
        src = "https:" + src
    elif src.startswith("/"):
        src = BASE + src
    if src.startswith("http://"):
        src = "https://" + src[7:]
    if not src.startswith("http"):
        return None
    # strip Shopify resize params so we get the original file
    u = urlparse(src.replace("&amp;", "&"))
    q = [kv for kv in u.query.split("&") if kv and kv.split("=")[0] not in ("width", "height", "crop")]
    return u._replace(query="&".join(q)).geturl()


def ext_of(url):
    e = os.path.splitext(urlparse(url).path)[1].lower()
    return e if e in (".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif") else ".jpg"


def queue(url, folder, name, context):
    url = norm_img(url)
    if not url:
        return None
    # same file is served from cdn.shopify.com and /cdn/shop/ -> key on filename
    key = os.path.basename(urlparse(url).path)
    if key in image_jobs:
        return image_jobs[key][0]
    path = os.path.join(folder, name + ext_of(url))
    image_jobs[key] = (path, context, url)
    return path


def slug(s, n=60):
    return re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")[:n] or "img"


def text(el):
    return el.get_text(" ", strip=True) if el else None


def write_json(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)


def html_to_md(h):
    return re.sub(r"\n{3,}", "\n\n", md(h or "", heading_style="ATX")).strip()


# ---------------------------------------------------------------- products
def parse_product_page(handle):
    h = get(f"{BASE}/products/{handle}")
    if not h:
        return {}
    s = BeautifulSoup(h, "lxml")
    d = {}
    m = s.find("meta", attrs={"name": "description"})
    d["seo_title"] = text(s.title)
    d["seo_description"] = m["content"] if m else None
    d["price_note"] = text(s.select_one(".price-disclosure"))
    d["feature_chips"] = [text(c) for c in s.select(".pdp-chip")]
    d["model_options"] = []
    for row in s.select(".pdp-models__row"):
        opts = []
        for o in row.select(".pdp-models__opt"):
            dot = o.select_one(".pdp-models__dot")
            hexc = re.search(r"#[0-9a-fA-F]{3,6}", dot.get("style", "")) if dot else None
            opts.append({
                "label": text(o),
                "current": "is-current" in o.get("class", []),
                "product_handle": o["href"].split("/products/")[-1] if o.get("href") else handle,
                "swatch": hexc.group(0) if hexc else None,
            })
        d["model_options"].append({"name": text(row.select_one(".pdp-models__label")), "options": opts})

    stories = []
    for sec in s.select("section[class^='pdp-'], div[class^='pdp-section']"):
        cls = sec.get("class", [""])[0]
        if cls in ("pdp-section-specs", "pdp-section-video"):
            continue
        title = sec.find(["h2", "h3"])
        paras = [text(p) for p in sec.find_all("p") if text(p)]
        points = [text(li) for li in sec.find_all("li")]
        if title or paras:
            stories.append({"section": cls, "title": text(title), "text": paras, "points": points})
    d["story_sections"] = stories

    banners = []
    for i, b in enumerate(s.select(".pdp-banner"), 1):
        img = b.find("img")
        t = b.select_one(".pdp-banner__text")
        entry = {"title": text(t.find(["h3", "h2"])) if t else None,
                 "text": text(t.find("p")) if t else None}
        if img:
            entry["image"] = queue(img.get("src") or img.get("data-src"),
                                   os.path.join(IMG, "product-features", handle),
                                   f"{i:02d}-{slug(entry['title'], 40)}", f"feature banner: {handle}")
        banners.append(entry)
    d["feature_banners"] = banners

    specs = {}
    for grp in s.select(".pdp-specs > div"):
        specs[text(grp.find("h4")) or "General"] = [text(li) for li in grp.find_all("li")]
    d["specifications"] = specs
    d["specifications_flat"] = {}
    for items in specs.values():
        for it in items:
            if ":" in it:
                k, v = it.split(":", 1)
                d["specifications_flat"][k.strip()] = v.strip()

    vids = [a["data-pdp-video"] for a in s.select("[data-pdp-video]")]
    d["videos"] = [f"https://www.youtube.com/watch?v={v}" for v in dict.fromkeys(vids)]
    d["faqs"] = [{"q": text(it.select_one("summary")), "a": text(it.select_one(".fl-product-faqs__answer"))}
                 for it in s.select(".fl-product-faqs__item")]
    d["assurances"] = [text(li) for li in s.select(".fl-assure__list li")]
    d["alternatives"] = [a["href"].split("/products/")[-1] for a in s.select(".fl-alts__item[href]")]

    # any other content images on the page (not in header/footer)
    main = s.find("main") or s
    for img in main.find_all("img"):
        src = img.get("src") or img.get("data-src")
        if src and "/cdn/shop/files/" in src or (src and "/cdn/shop/collections/" in src):
            queue(src, os.path.join(IMG, "product-page-misc", handle),
                  slug(os.path.splitext(os.path.basename(urlparse(norm_img(src) or '').path))[0]),
                  f"product page image: {handle}")
    # fallback: full readable text of the main product area
    for t in main(["script", "style", "noscript", "svg"]):
        t.decompose()
    d["page_text"] = [l for l in (x.strip() for x in main.get_text("\n").split("\n")) if l]
    return d


def scrape_products():
    prods = []
    page = 1
    while True:
        j = get(f"{BASE}/products.json?limit=250&page={page}", True)
        if not j or not j["products"]:
            break
        prods += j["products"]
        page += 1
    print(len(prods), "products")

    # queue catalogue images first so page-level duplicates resolve to them
    for p in prods:
        for i, im in enumerate(p["images"], 1):
            queue(im["src"], os.path.join(IMG, "products", p["handle"]), f"{i:02d}", f"product: {p['handle']}")

    with ThreadPoolExecutor(6) as ex:
        details = list(ex.map(lambda p: parse_product_page(p["handle"]), prods))

    out = []
    for p, det in zip(prods, details):
        imgs = []
        for i, im in enumerate(p["images"], 1):
            path = queue(im["src"], os.path.join(IMG, "products", p["handle"]), f"{i:02d}", f"product: {p['handle']}")
            imgs.append({"position": im["position"], "src": norm_img(im["src"]), "local": path,
                         "width": im.get("width"), "height": im.get("height"),
                         "alt": im.get("alt")})
        tags = p.get("tags", [])
        facets = {}
        for t in tags:
            if ":" in t:
                k, v = t.split(":", 1)
                facets.setdefault(k.strip(), []).append(v.strip())
        out.append({
            "id": p["id"], "handle": p["handle"], "title": p["title"], "vendor": p["vendor"],
            "product_type": p["product_type"], "url": f"{BASE}/products/{p['handle']}",
            "published_at": p.get("published_at"), "updated_at": p.get("updated_at"),
            "tags": tags, "facets": facets,
            "description_html": p.get("body_html"), "description_md": html_to_md(p.get("body_html")),
            "options": p["options"],
            "variants": [{k: v[k] for k in ("id", "title", "sku", "price", "compare_at_price", "available",
                                                "grams", "requires_shipping", "taxable", "option1", "option2", "option3")}
                         for v in p["variants"]],
            "images": imgs, "collections": [], **det,
        })
    return out


# ---------------------------------------------------------------- collections
def scrape_collections(products):
    cols = get(f"{BASE}/collections.json?limit=250", True)["collections"]
    by_handle = {p["handle"]: p for p in products}
    out = []
    for c in cols:
        handles, page = [], 1
        while True:
            j = get(f"{BASE}/collections/{c['handle']}/products.json?limit=250&page={page}", True)
            if not j or not j["products"]:
                break
            handles += [x["handle"] for x in j["products"]]
            page += 1
        for h in handles:
            if h in by_handle:
                by_handle[h]["collections"].append(c["handle"])
        img = None
        if c.get("image"):
            img = queue(c["image"]["src"], os.path.join(IMG, "collections"), c["handle"], f"collection: {c['handle']}")
        ch = get(f"{BASE}/collections/{c['handle']}")
        seo = {}
        if ch:
            cs = BeautifulSoup(ch, "lxml")
            m = cs.find("meta", attrs={"name": "description"})
            seo = {"seo_title": text(cs.title), "seo_description": m["content"] if m else None}
        out.append({"id": c["id"], "handle": c["handle"], "title": c["title"],
                    "url": f"{BASE}/collections/{c['handle']}",
                    "description_md": html_to_md(c.get("body_html")),
                    "products_count_reported": c.get("products_count"),
                    "product_handles": handles, "image": img, **seo})
    return out


# ---------------------------------------------------------------- site
def scrape_site_images(soup, folder, context):
    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src")
        if src and ("/cdn/shop/" in src or "cdn.shopify.com/s/files" in src):
            n = norm_img(src)
            queue(src, folder, slug(os.path.splitext(os.path.basename(urlparse(n).path))[0]), context)
    for el in soup.select("[style*='background-image']"):
        for u in re.findall(r"url\(['\"]?([^'\")]+)", el["style"]):
            queue(u, folder, slug(os.path.basename(urlparse(norm_img(u) or "").path)), context + " (bg)")


def scrape_home():
    h = get(BASE + "/")
    s = BeautifulSoup(h, "lxml")
    home = {"title": text(s.title)}
    m = s.find("meta", attrs={"name": "description"})
    home["description"] = m["content"] if m else None
    og = s.find("meta", property="og:image")
    if og:
        home["og_image"] = queue(og["content"], os.path.join(IMG, "brand"), "og-image", "og:image")
    for ln in s.find_all("link", rel=lambda r: r and "icon" in " ".join(r)):
        home["favicon"] = queue(ln["href"], os.path.join(IMG, "brand"), "favicon", "favicon")
    header = s.find("header")
    if header:
        for img in header.find_all("img"):
            home["logo"] = queue(img.get("src"), os.path.join(IMG, "brand"), "logo", "header logo")
        svg = header.find("svg")
        logo_svg = header.select_one("a[href='/'] svg")
        if logo_svg:
            p = os.path.join(IMG, "brand", "logo.svg")
            os.makedirs(os.path.dirname(p), exist_ok=True)
            open(p, "w").write(str(logo_svg))
            home["logo_svg"] = p
        nav, seen = [], set()
        for a in header.find_all("a", href=True):
            t = text(a)
            if t and (a["href"], t) not in seen and "customer_authentication" not in a["href"]:
                seen.add((a["href"], t))
                nav.append({"label": t, "href": a["href"]})
        home["header_nav"] = nav
    footer = s.find("footer") or s.find(id=re.compile("footer"))
    fnav = []
    if footer:
        for col in footer.find_all(["details", "nav", "div"], recursive=True):
            head = col.find(["h2", "h3", "summary"])
            links = [{"label": text(a), "href": a["href"]} for a in col.find_all("a", href=True, recursive=True)]
            if head and links and len(links) < 20:
                ht = text(head)
                w = ht.split()
                if len(w) % 2 == 0 and w[:len(w)//2] == w[len(w)//2:]:
                    ht = " ".join(w[:len(w)//2])
                fnav.append({"heading": ht, "links": links})
        socials = [a["href"] for a in footer.find_all("a", href=True)
                   if re.search(r"facebook|instagram|twitter|x\.com|linkedin|youtube|pinterest", a["href"])]
        home["social_links"] = sorted(set(socials))
    # dedupe footer groups
    uniq, seen = [], set()
    for g in fnav:
        k = (g["heading"], tuple(l["href"] for l in g["links"]))
        if k not in seen:
            seen.add(k)
            uniq.append(g)
    home["footer_nav"] = uniq
    sections = []
    for sec in s.find_all("div", id=re.compile("^shopify-section")):
        sid = sec["id"].split("__")[-1]
        if "footer" in sid or "header" in sid:
            continue
        for t in sec(["script", "style", "svg"]):
            t.decompose()
        lines = [l for l in (x.strip() for x in sec.get_text("\n").split("\n")) if l]
        links = [{"label": text(a), "href": a["href"]} for a in sec.find_all("a", href=True) if text(a)]
        sections.append({"section": sid, "headings": [text(x) for x in sec.find_all(["h1", "h2", "h3"])],
                         "text": lines, "links": links})
    home["sections"] = sections
    scrape_site_images(BeautifulSoup(h, "lxml"), os.path.join(IMG, "homepage"), "homepage")
    # color / font hints
    css_vars = dict(re.findall(r"(--color-[a-z0-9-]+|--font-[a-z0-9-]+-family)\s*:\s*([^;]+);", h)[:200])
    home["theme_css_variables"] = css_vars
    home["google_or_shop_fonts"] = sorted(set(re.findall(r"font-family:\s*([^;\"]+)", h)))[:30]
    return home


def scrape_pages():
    pages = get(f"{BASE}/pages.json?limit=250", True)["pages"]
    out = []
    for p in pages:
        body = p.get("body_html") or ""
        bs = BeautifulSoup(body, "lxml")
        scrape_site_images(bs, os.path.join(IMG, "pages", p["handle"]), f"page: {p['handle']}")
        mdtext = html_to_md(body)
        path = os.path.join(DATA, "pages", p["handle"] + ".md")
        os.makedirs(os.path.dirname(path), exist_ok=True)
        open(path, "w", encoding="utf-8").write(f"# {p['title']}\n\nSource: {BASE}/pages/{p['handle']}\n\n{mdtext}\n")
        # rendered page may carry theme sections with extra images
        rh = get(f"{BASE}/pages/{p['handle']}")
        if rh:
            rs = BeautifulSoup(rh, "lxml")
            main = rs.find("main") or rs
            scrape_site_images(main, os.path.join(IMG, "pages", p["handle"]), f"page: {p['handle']}")
        out.append({"handle": p["handle"], "title": p["title"], "url": f"{BASE}/pages/{p['handle']}",
                    "file": path, "updated_at": p.get("updated_at")})
    return out


def scrape_policies():
    out = []
    for h in ["privacy-policy", "refund-policy", "terms-of-service", "shipping-policy", "contact-information"]:
        r = get(f"{BASE}/policies/{h}")
        if not r:
            continue
        s = BeautifulSoup(r, "lxml")
        body = s.select_one(".shopify-policy__body") or s.find("main")
        title = text(s.select_one(".shopify-policy__title")) or h
        path = os.path.join(DATA, "policies", h + ".md")
        os.makedirs(os.path.dirname(path), exist_ok=True)
        open(path, "w", encoding="utf-8").write(f"# {title}\n\nSource: {BASE}/policies/{h}\n\n{html_to_md(str(body))}\n")
        out.append({"handle": h, "title": title, "file": path})
    return out


# ---------------------------------------------------------------- download
def download(item):
    key, (path, ctx, url) = item
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return key, path, os.path.getsize(path), ctx, url, "cached"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    for i in range(4):
        try:
            r = S.get(url, timeout=120)
            r.raise_for_status()
            open(path, "wb").write(r.content)
            return key, path, len(r.content), ctx, url, "ok"
        except Exception as e:  # noqa: BLE001
            err = str(e)
            time.sleep(2 ** i)
    return key, path, 0, ctx, url, "failed: " + err


def main():
    os.makedirs(DATA, exist_ok=True)
    store = get(f"{BASE}/meta.json", True)
    write_json(os.path.join(DATA, "store.json"), store)
    products = scrape_products()
    collections = scrape_collections(products)
    home = scrape_home()
    pages = scrape_pages()
    policies = scrape_policies()

    write_json(os.path.join(DATA, "products.json"), products)
    write_json(os.path.join(DATA, "collections.json"), collections)
    write_json(os.path.join(DATA, "homepage.json"), home)
    write_json(os.path.join(DATA, "pages.json"), pages)
    write_json(os.path.join(DATA, "policies.json"), policies)

    # point Markdown image links at the local copies
    for p in pages:
        md_path = p["file"]
        body = open(md_path, encoding="utf-8").read()

        def local(m):
            u = m.group(0)
            job = image_jobs.get(os.path.basename(urlparse(norm_img(u) or "").path))
            return os.path.relpath(job[0], os.path.dirname(md_path)) if job else u
        body = re.sub(r"(?:https?:)?//(?:cdn\.shopify\.com|featherlitestore\.com/cdn)[^\s)\"']+", local, body)
        open(md_path, "w", encoding="utf-8").write(body)

    with open(os.path.join(DATA, "products.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        spec_keys = sorted({k for p in products for k in p.get("specifications_flat", {})})
        w.writerow(["handle", "title", "product_type", "sku", "price_inr", "compare_at_price", "available",
                    "collections", "features", "image_count", "first_image", "url", *spec_keys])
        for p in products:
            v = p["variants"][0]
            w.writerow([p["handle"], p["title"], p["product_type"], v["sku"], v["price"], v["compare_at_price"],
                        v["available"], "|".join(p["collections"]), "|".join(p.get("feature_chips", [])),
                        len(p["images"]), p["images"][0]["local"] if p["images"] else "", p["url"],
                        *[p.get("specifications_flat", {}).get(k, "") for k in spec_keys]])

    print(len(image_jobs), "images queued")
    with ThreadPoolExecutor(8) as ex:
        results = list(ex.map(download, image_jobs.items()))
    with open(os.path.join(DATA, "image_manifest.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["local_path", "bytes", "context", "source_url", "status"])
        for key, path, size, ctx, url, st in sorted(results, key=lambda r: r[1]):
            w.writerow([path, size, ctx, url, st])
    ok = sum(1 for r in results if r[5] in ("ok", "cached"))
    print(f"images: {ok}/{len(results)} downloaded, {sum(r[2] for r in results)/1e6:.1f} MB")


if __name__ == "__main__":
    main()
