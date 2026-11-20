// Builds the MGR CASA prototype catalogue from the reference scrape.
//
//   node tools/build-catalogue.mjs
//
// Reads  reference/featherlite/data/products.json (placeholder photography + dimensions)
// Writes src/data/products.generated.json and public/images/**.webp
//
// Product names, copy, stories and FAQs come from tools/catalogue-copy.mjs (original
// MGR CASA text). Only photographs and measured dimensions are reused from the reference,
// and only as placeholders until MGR CASA's own photography is ready.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { SERIES as WORK, SCENES as WORK_SCENES } from './catalogue-copy.mjs';
import { LIVING, EXECUTIVE, DRIVE_SCENES } from './catalogue-copy-drive.mjs';

const SERIES = [...LIVING, ...EXECUTIVE, ...WORK];
const SCENES = [...DRIVE_SCENES, ...WORK_SCENES];

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const REF = path.join(ROOT, 'reference/featherlite');
const OUT_IMG = path.join(ROOT, 'public/images');
const OUT_JSON = path.join(ROOT, 'src/data/products.generated.json');
const DRIVE = path.join(ROOT, 'reference/mgr-casa-drive/scraped');
const MAX_IMAGES_PER_VARIANT = 6;
const IMG_EXT = /\.(jpe?g|png|webp|avif)$/i;

// Images for a variant sourced from the shared Drive folder (reference/mgr-casa-drive).
// pick / detail are 1-based positions in the folder's sorted image list.
async function driveImages(v) {
  const dir = path.join(DRIVE, v.dir);
  const all = (await fs.readdir(dir)).filter((f) => IMG_EXT.test(f)).sort();
  const at = (ns) => ns.map((n) => all[n - 1]).filter(Boolean).map((f) => path.join(dir, f));
  return { gallery: v.pick ? at(v.pick) : all.map((f) => path.join(dir, f)), detail: v.detail ? at(v.detail) : [] };
}

// Resolve a reference path whose extension may differ (01.jpg vs 01.png).
async function resolveExt(rel) {
  const abs = path.join(ROOT, rel);
  try {
    await fs.access(abs);
    return rel;
  } catch {}
  const base = abs.replace(/\.[a-z]+$/i, '');
  for (const e of ['.jpg', '.png', '.jpeg', '.webp']) {
    try {
      await fs.access(base + e);
      return path.relative(ROOT, base + e);
    } catch {}
  }
  throw new Error('Missing source image ' + rel);
}

const src = JSON.parse(await fs.readFile(path.join(REF, 'data/products.json'), 'utf8'));
const byHandle = Object.fromEntries(src.map((p) => [p.handle, p]));

async function toWebp(from, to, width, quality = 76) {
  const abs = path.join(ROOT, from);
  await fs.mkdir(path.dirname(to), { recursive: true });
  try {
    await fs.access(to);
    return; // already built
  } catch {}
  await sharp(abs).rotate().resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(to);
}

function parseSpecs(p, extra) {
  const groups = {};
  for (const [group, lines] of Object.entries(p.specifications || {})) {
    groups[group] = lines.map((l) => {
      const i = l.indexOf(':');
      if (i === -1) return ['Detail', l.trim()];
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    });
  }
  return { ...groups, ...(extra || {}) };
}

const products = [];
for (const s of SERIES) {
  const variants = [];
  for (const v of s.variants) {
    if (v.dir) {
      const found = await driveImages(v);
      const gallery = found.gallery.slice(0, v.max ?? 8);
      const wide = found.detail.slice(0, 3);
      const imgs = [];
      for (const [n, g] of gallery.entries()) {
        const rel = `products/${s.slug}/${v.key}-${String(n + 1).padStart(2, '0')}.webp`;
        await toWebp(path.relative(ROOT, g), path.join(OUT_IMG, rel), 1200);
        imgs.push('/images/' + rel);
      }
      const feat = [];
      for (const [n, g] of wide.entries()) {
        const rel = `details/${s.slug}/${v.key}-${n + 1}.webp`;
        await toWebp(path.relative(ROOT, g), path.join(OUT_IMG, rel), 1800, 72);
        feat.push('/images/' + rel);
      }
      variants.push({
        id: `${s.slug}-${v.key}`, key: v.key, label: v.label, options: v.options, swatch: v.swatch || null,
        sku: `MGR-${s.code}-${v.key.toUpperCase()}`, price: v.price, available: v.available ?? true,
        images: imgs, detailImages: feat, specs: { ...(s.specOverrides || {}), ...(v.specs || {}) },
      });
      continue;
    }
    const p = byHandle[v.handle];
    if (!p) throw new Error('Missing reference product ' + v.handle);
    const imgs = [];
    const list = p.images.filter((i) => i.local).slice(0, MAX_IMAGES_PER_VARIANT);
    for (let n = 0; n < list.length; n++) {
      const rel = `products/${s.slug}/${v.key}-${String(n + 1).padStart(2, '0')}.webp`;
      await toWebp(list[n].local, path.join(OUT_IMG, rel), 1100);
      imgs.push('/images/' + rel);
    }
    const feat = [];
    for (const [n, b] of (p.feature_banners || []).entries()) {
      if (!b.image || n > 3) continue;
      const rel = `details/${s.slug}/${v.key}-${n + 1}.webp`;
      await toWebp(b.image, path.join(OUT_IMG, rel), 1800, 72);
      feat.push('/images/' + rel);
    }
    const ref = p.variants[0];
    variants.push({
      id: `${s.slug}-${v.key}`,
      key: v.key,
      label: v.label,
      options: v.options,
      swatch: v.swatch || null,
      sku: `MGR-${s.code}-${v.key.toUpperCase()}`,
      price: Math.round(Number(ref.price) * (s.priceFactor || 1)),
      available: ref.available,
      images: imgs,
      detailImages: feat,
      specs: parseSpecs(p, s.specOverrides),
    });
  }
  const { variants: _v, priceFactor: _pf, specOverrides: _so, ...meta } = s;
  products.push({ ...meta, variants });
  console.log('✓', s.slug, variants.length, 'variant(s)');
}

for (const sc of SCENES) {
  await toWebp(await resolveExt(sc.from), path.join(OUT_IMG, 'scenes', sc.name + '.webp'), sc.width || 2000, 74);
}

await fs.mkdir(path.dirname(OUT_JSON), { recursive: true });
await fs.writeFile(OUT_JSON, JSON.stringify(products, null, 1));
console.log(`\nWrote ${products.length} products to ${path.relative(ROOT, OUT_JSON)}`);
