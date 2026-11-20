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
import { SERIES, SCENES } from './catalogue-copy.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const REF = path.join(ROOT, 'reference/featherlite');
const OUT_IMG = path.join(ROOT, 'public/images');
const OUT_JSON = path.join(ROOT, 'src/data/products.generated.json');
const MAX_IMAGES_PER_VARIANT = 6;

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
  await toWebp(sc.from, path.join(OUT_IMG, 'scenes', sc.name + '.webp'), sc.width || 2000, 74);
}

await fs.mkdir(path.dirname(OUT_JSON), { recursive: true });
await fs.writeFile(OUT_JSON, JSON.stringify(products, null, 1));
console.log(`\nWrote ${products.length} products to ${path.relative(ROOT, OUT_JSON)}`);
