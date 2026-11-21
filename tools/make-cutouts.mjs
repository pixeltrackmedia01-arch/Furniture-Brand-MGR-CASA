// Creates transparent product cut-outs and circular material swatches for the homepage hero
// and category grid.
//
//   node tools/make-cutouts.mjs            (or: npm run cutouts)
//
// Background removal: flood-fill from the image border through pixels close to the border
// colour, then continue through light, neutral pixels (the soft floor shadow) and turn those
// into black at partial opacity, so shadows stay believable on any backdrop colour. Finally only
// the largest connected shape is kept, which drops stray annotation text and dimension lines.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DRIVE = 'reference/mgr-casa-drive/scraped/';
const CB = DRIVE + 'cellbell/chairs/';
const FU = DRIVE + 'furlenco/sofas/';
const OUT = path.join(ROOT, 'public/images/cutouts');

// name, source, options: tol (bg distance), crop [l,t,w,h] fractions applied before processing
export const CUTOUTS = [
  { name: 'riviera-sapphire', src: FU + 'linora-l-shape-sofa-3814-buy-new/13.jpg', tol: 26 },
  { name: 'sole-sapphire', src: FU + 'helio-velvet-3-seater-sofa-in-sapphire-blue-color-4775-buy-new/10.jpg' },
  { name: 'sole-rose-armchair', src: FU + 'new-inv-helio-1-seater-sofa-desert-rose-4796-buy-new/06.jpg' },
  { name: 'lino-denim-armchair', src: FU + 'noah-fabric-1-seater-sofa-in-grace-denim-color-4189-buy-new/09.jpg', tol: 26 },
  { name: 'lino-turmeric-ottoman', src: FU + 'noah-ottoman-fabric-smoke-mustard-248-buy-new/06.jpg' },
  { name: 'luna-tan', src: CB + 'moon-luxury-high-back-chair/02.png' },
  { name: 'marea-cream', src: CB + 'cruise-luxury-high-back-chair/02.png', tol: 44 },
  { name: 'filo-black', src: CB + 'edge-series-e6-luxury-high-back-chair/02.png' },
  { name: 'bruna-brown', src: CB + 'bella-luxury-chair/02.png' },
  { name: 'bruna-black', src: CB + 'bella-luxury-chair/10.png' },
  { name: 'conte-brown', src: CB + 'royce-luxury-high-back-chair/03.png' },
  { name: 'conte-beige', src: CB + 'royce-luxury-high-back-chair/07.png' },
  { name: 'aurelio-grey', src: CB + 'aura-ultra/03.png', tol: 24 },
  { name: 'ispira-ice', src: CB + 'inspire-mesh-luxury-high-back-chair/08.png' },
  { name: 'bastion-green', src: CB + 'c102-boss-chair/08.jpg' },
  { name: 'bastion-red', src: CB + 'c102-boss-chair/10.jpg' },
  { name: 'regent-brown', src: CB + 'c51-boss-chair/07.jpg' },
  { name: 'regent-tan', src: CB + 'c51-boss-chair/10.jpg' },
  { name: 'altezza-desk', src: 'reference/featherlite/images/products/elevate-height-adjustable-table/01.jpg' },
  { name: 'quaderno-table', src: 'reference/featherlite/images/products/nexus-walnut-table/01.jpg', tol: 48 },
  { name: 'mensola-shelf', src: 'reference/featherlite/images/products/storage-90-open-shelf/01.jpg' },
  { name: 'vetta-task', src: 'reference/featherlite/images/products/featherlite-pinnacle-high-back-mesh-chair-with-multilock-seat-sliding-mechanism-three-way-adjustable-arms-black/01.png' },
  { name: 'dormi-teal', src: FU + 'optimus-sofa-cum-bed-3790-buy-new/13.jpg', tol: 26 },
];

// name, source, crop box as fractions [left, top, size] of the shorter side
export const SWATCHES = [
  { name: 'swatch-velvet-sapphire', src: FU + 'helio-velvet-3-seater-sofa-in-sapphire-blue-color-4775-buy-new/06.jpg', box: [0.2, 0.15, 0.7] },
  { name: 'swatch-velvet-rose', src: FU + 'helio-velvet-3-seater-sofa-in-desert-rose-color-4508-buy-new/05.jpg', box: [0.15, 0.1, 0.8] },
  { name: 'swatch-tuft-denim', src: FU + 'noah-fabric-3-seater-sofa-in-grace-denim-color-4186-buy-new/05.jpg', box: [0.15, 0.1, 0.8] },
  { name: 'swatch-fabric-turmeric', src: FU + 'noah-3-seater-couch-fabric-smoke-mustard-223-buy-new/04.jpg', box: [0.15, 0.1, 0.8] },
  { name: 'swatch-mesh', src: 'public/images/scenes/detail-mesh.webp', box: [0.45, 0.05, 0.9] },
  { name: 'swatch-leather-tan', src: 'public/images/cutouts/bruna-brown.webp', box: [0.3, 0.06, 0.4] },
  { name: 'swatch-leather-brown', src: 'public/images/cutouts/conte-brown.webp', box: [0.33, 0.04, 0.4] },
];

const MAX = 1400;

// "folder/07.png" means the 7th image in the folder's sorted listing, whatever its extension.
async function resolve(src) {
  if (!src.startsWith(DRIVE)) return path.join(ROOT, src);
  const dir = path.join(ROOT, path.dirname(src));
  const n = parseInt(path.basename(src), 10);
  const files = (await fs.readdir(dir)).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)).sort();
  if (!files[n - 1]) throw new Error('No image #' + n + ' in ' + dir);
  return path.join(dir, files[n - 1]);
}

async function cutout({ name, src, tol = 30, shadow = src.startsWith(FU) }) {
  const img = sharp(await resolve(src)).rotate();
  const meta = await img.metadata();
  const scale = Math.min(1, MAX / Math.max(meta.width, meta.height));
  const { data, info } = await img
    .resize(Math.round(meta.width * scale))
    .flatten({ background: '#ffffff' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const N = W * H;
  const px = (i) => [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];

  // background colour: median of the border
  const border = [];
  for (let x = 0; x < W; x++) border.push(px(x), px((H - 1) * W + x));
  for (let y = 0; y < H; y++) border.push(px(y * W), px(y * W + W - 1));
  const med = [0, 1, 2].map((c) => border.map((p) => p[c]).sort((a, b) => a - b)[border.length >> 1]);
  const bgL = (med[0] + med[1] + med[2]) / 3;
  const dist = (p) => Math.max(Math.abs(p[0] - med[0]), Math.abs(p[1] - med[1]), Math.abs(p[2] - med[2]));
  const chroma = (p) => Math.max(...p) - Math.min(...p);
  const lum = (p) => (p[0] + p[1] + p[2]) / 3;

  // state: 0 = product, 1 = background, 2 = shadow
  const state = new Uint8Array(N);
  const shadowA = new Uint8Array(N);
  const queue = new Int32Array(N);
  let qh = 0;
  let qt = 0;
  const visit = (i) => {
    if (state[i]) return;
    const p = px(i);
    if (dist(p) <= tol) {
      state[i] = 1;
      queue[qt++] = i;
    } else if (shadow && chroma(p) < 12 && lum(p) > bgL - 75) {
      state[i] = 2;
      shadowA[i] = Math.min(255, Math.round(((bgL - lum(p)) / bgL) * 255 * 1.6));
      queue[qt++] = i;
    }
  };
  for (let x = 0; x < W; x++) visit(x), visit((H - 1) * W + x);
  for (let y = 0; y < H; y++) visit(y * W), visit(y * W + W - 1);
  while (qh < qt) {
    const i = queue[qh++];
    const x = i % W;
    if (x > 0) visit(i - 1);
    if (x < W - 1) visit(i + 1);
    if (i >= W) visit(i - W);
    if (i < N - W) visit(i + W);
  }

  // keep only the largest connected product region
  const label = new Int32Array(N).fill(-1);
  let best = -1;
  let bestSize = 0;
  let id = 0;
  for (let s = 0; s < N; s++) {
    if (state[s] !== 0 || label[s] !== -1) continue;
    let h = 0;
    let t = 0;
    queue[t++] = s;
    label[s] = id;
    while (h < t) {
      const i = queue[h++];
      const x = i % W;
      for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i - W, i + W]) {
        if (j < 0 || j >= N || state[j] !== 0 || label[j] !== -1) continue;
        label[j] = id;
        queue[t++] = j;
      }
    }
    if (t > bestSize) {
      bestSize = t;
      best = id;
    }
    id++;
  }

  // product bounding box, so stray shadow specks far from it can be dropped
  let x0 = W, x1 = 0, y0 = H, y1 = 0;
  for (let i = 0; i < N; i++) {
    if (state[i] !== 0 || label[i] !== best) continue;
    const x = i % W, y = (i / W) | 0;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  const padX = (x1 - x0) * 0.04;
  const nearProduct = (i) => {
    const x = i % W, y = (i / W) | 0;
    return x >= x0 - padX && x <= x1 + padX && y >= y0 + (y1 - y0) * 0.5 && y <= y1 + (y1 - y0) * 0.06;
  };

  const out = Buffer.alloc(N * 4);
  for (let i = 0; i < N; i++) {
    const o = i * 4;
    if (state[i] === 0 && label[i] === best) {
      out[o] = data[i * 3];
      out[o + 1] = data[i * 3 + 1];
      out[o + 2] = data[i * 3 + 2];
      // soften the edge: pixels touching background get partial alpha by closeness to bg
      const x = i % W;
      const nearBg = (x > 0 && state[i - 1] === 1) || (x < W - 1 && state[i + 1] === 1) || (i >= W && state[i - W] === 1) || (i < N - W && state[i + W] === 1);
      out[o + 3] = nearBg ? Math.min(255, Math.round((dist(px(i)) / (tol * 2.2)) * 255)) : 255;
    } else if (state[i] === 2 && nearProduct(i)) {
      // shadow: keep only shadow pixels close to the product (a few % of the height)
      out[o] = 30;
      out[o + 1] = 22;
      out[o + 2] = 16;
      out[o + 3] = Math.round(shadowA[i] * 0.85);
    }
  }
  await fs.mkdir(OUT, { recursive: true });
  await sharp(out, { raw: { width: W, height: H, channels: 4 } })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8 })
    .resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 90 })
    .toFile(path.join(OUT, name + '.webp'));
}

async function swatch({ name, src, box }) {
  src = await resolve(src);
  const img = sharp(src);
  const m = await img.metadata();
  const s = Math.min(m.width, m.height);
  const size = Math.round(s * box[2]);
  const left = Math.min(m.width - size, Math.round(m.width * box[0]));
  const top = Math.min(m.height - size, Math.round(m.height * box[1]));
  const D = 600;
  const mask = Buffer.from(`<svg width="${D}" height="${D}"><circle cx="${D / 2}" cy="${D / 2}" r="${D / 2 - 2}" fill="#fff"/></svg>`);
  await sharp(src)
    .extract({ left, top, width: size, height: size })
    .resize(D, D)
    .composite([{ input: mask, blend: 'dest-in' }])
    .webp({ quality: 80 })
    .toFile(path.join(OUT, name + '.webp'));
}

const only = process.argv[2];
for (const c of CUTOUTS) if (!only || c.name.includes(only)) await cutout(c).then(() => console.log('✓', c.name)).catch((e) => console.error('✗', c.name, e.message));
for (const s of SWATCHES) if (!only || s.name.includes(only)) await swatch(s).then(() => console.log('✓', s.name)).catch((e) => console.error('✗', s.name, e.message));
