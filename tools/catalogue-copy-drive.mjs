// Living (sofas) and Executive chair ranges, built from the image set shared on Google Drive
// (downloaded to reference/mgr-casa-drive/scraped). Names and copy are original MGR CASA text;
// photographs are placeholders from third-party stores until MGR CASA's own shoot is ready.
//
// Variant fields: dir = folder under scraped/, pick = 1-based image order to use (skips
// annotated diagrams), detail = 1-based images used for the "up close" story section.

const FU = 'furlenco/sofas/';
const CB = 'cellbell/chairs/';

// ------------------------------------------------------------------ Living
const SOFA_FAQ = [
  { q: 'How is the sofa delivered?', a: 'Our own crew delivers, carries it to the room of your choice, attaches the legs and removes all packaging. Please check door and lift widths against the dimensions before ordering.' },
  { q: 'What is the frame made of?', a: 'Seasoned hardwood and engineered-wood frames with no-sag webbing and high-resilience foam, wrapped in a soft fibre layer for a relaxed sit.' },
  { q: 'What does the warranty cover?', a: 'Five years on the frame against manufacturing defects, and one year on upholstery, foam and legs.' },
  { q: 'Can I see the fabric before I buy?', a: 'Yes. Visit a studio, or ask us to post free swatches of up to four colours to your home.' },
];
const VELVET = { title: 'Velvet with depth', text: 'A dense, low-pile performance velvet that catches the light, resists crushing and wipes clean with a damp cloth.' };
const FABRIC = { title: 'A soft, durable weave', text: 'A textured, tightly woven upholstery fabric tested for everyday family use, with a soft hand that only gets better with time.' };
const COMFORT = { title: 'Sink in, sit up', text: 'High-resilience foam cores wrapped in fibre give the first-touch softness of a lounge sofa with the support to sit upright for a long conversation.' };
const FRAME = { title: 'Built on a solid frame', text: 'Seasoned wood frames, no-sag webbing and tapered solid legs keep the sofa level and quiet for years.' };

const LIVING_BASE = {
  category: 'living',
  warranty: '5-year frame warranty',
  leadTime: 'Delivers in 7–10 working days',
  faqs: SOFA_FAQ,
  mechanism: null,
  backType: null,
  features: [],
};
const dims = (w, d, h, seat = '43 cm') => ({ 'Indicative dimensions': [['Width', w], ['Depth', d], ['Height', h], ['Seat height', seat]] });

const LINO_COLOURS = {
  denim: { label: 'Denim', swatch: '#4b5f86' },
  teal: { label: 'Lagoon', swatch: '#2f8c92' },
  shell: { label: 'Shell', swatch: '#6f6c69' },
  walnut: { label: 'Walnut', swatch: '#6b4a32' },
  mustard: { label: 'Turmeric', swatch: '#b98a3a' },
};
const lino = (key, dir, price, pick, detail) => ({ key, label: LINO_COLOURS[key].label, options: { Colour: LINO_COLOURS[key].label }, swatch: LINO_COLOURS[key].swatch, dir: FU + dir, price, pick, detail });

export const LIVING = [
  {
    ...LIVING_BASE,
    slug: 'lino-three-seater-sofa', code: 'LNO3', name: 'Lino', title: 'Lino Three-Seater Sofa', type: 'Three-seater sofa', line: 'Studio', subcategory: 'sofas',
    tagline: 'Button-tufted, compact and endlessly easy to live with.',
    description: 'Lino is our everyday sofa: a compact three-seater with a button-tufted back, slim track arms and tapered legs. It fits a city flat without crowding it, in five soft-wearing fabric colours.',
    highlights: ['Button-tufted back', 'Compact footprint', 'Five fabric colours', 'Solid tapered legs'],
    material: ['Fabric'], spaces: ['Living room'], story: [FABRIC, COMFORT, FRAME], badges: ['Bestseller'], rating: 4.7, reviews: 214,
    specOverrides: dims('190 cm', '84 cm', '84 cm'),
    variants: [
      lino('shell', 'noah-fabric-3-seater-sofa-in-shell-grey-color-4681-buy-new', 18999, [1, 2, 3, 4, 5, 12, 13], [3, 4, 5]),
      lino('denim', 'noah-fabric-3-seater-sofa-in-grace-denim-color-4186-buy-new', 17099, [1, 2, 3, 4, 5, 6, 12, 13], [3, 4, 5]),
      lino('teal', 'noah-3-seater-couch-fabric-turquoise-222-buy-new', 17999, [1, 2, 3, 4, 5, 12, 13, 14], [3, 4, 5]),
      lino('walnut', 'noah-fabric-3-seater-sofa-in-forest-brown-color-4645-buy-new', 16999, [1, 2, 3, 4, 5, 6, 12, 13, 14], [3, 4, 5]),
      lino('mustard', 'noah-3-seater-couch-fabric-smoke-mustard-223-buy-new', 16999, [1, 2, 3, 4, 5, 6, 13, 14], [3, 4, 5]),
    ],
  },
  {
    ...LIVING_BASE,
    slug: 'lino-armchair', code: 'LNO1', name: 'Lino Armchair', title: 'Lino Armchair', type: 'Armchair', line: 'Studio', subcategory: 'armchairs',
    tagline: 'The reading chair to match.',
    description: 'A single-seat companion to the Lino sofa, with the same tufted back and slim arms. Pair it with the sofa or use it alone in a bedroom corner.',
    highlights: ['Button-tufted back', 'Pairs with Lino sofa', 'Four fabric colours', 'Small-room friendly'],
    material: ['Fabric'], spaces: ['Living room', 'Bedroom'], story: [FABRIC, COMFORT], badges: [], rating: 4.6, reviews: 96,
    specOverrides: dims('82 cm', '84 cm', '84 cm'),
    variants: [
      lino('denim', 'noah-fabric-1-seater-sofa-in-grace-denim-color-4189-buy-new', 9799, [1, 2, 3, 4, 5, 9, 10, 13, 14], [2, 3, 4]),
      lino('teal', 'noah-fabric-1-seater-sofa-in-turquoise-color-4893-buy-new', 8999, [1, 2, 3, 4, 5, 6, 13, 14], [2, 3, 4]),
      lino('walnut', 'noah-fabric-1-seater-sofa-in-forest-brown-color-4646-buy-new', 7799, [1, 2, 3, 4, 5, 10, 11, 12, 13], [2, 3, 4]),
      lino('mustard', 'noah-fabric-1-seater-sofa-in-smoke-mustard-color-4901-buy-new', 9799, [1, 2, 3, 8, 9, 10, 11], [2, 3, 9]),
    ],
  },
  {
    ...LIVING_BASE,
    slug: 'lino-ottoman', code: 'LNOO', name: 'Lino Ottoman', title: 'Lino Ottoman', type: 'Ottoman', line: 'Studio', subcategory: 'ottomans',
    tagline: 'Feet up, tray down, extra seat in a pinch.',
    description: 'A generous upholstered ottoman in the Lino fabrics, sturdy enough for a guest and soft enough for tired feet.',
    highlights: ['Doubles as a seat', 'Matches Lino sofa', 'Solid legs', 'Two colours'],
    material: ['Fabric'], spaces: ['Living room'], story: [FABRIC], badges: [], rating: 4.5, reviews: 41,
    specOverrides: dims('60 cm', '45 cm', '42 cm', '42 cm'),
    variants: [
      lino('mustard', 'noah-ottoman-fabric-smoke-mustard-248-buy-new', 4999, [1, 2, 3, 4, 10, 11, 12, 13], [2, 3, 4]),
      lino('teal', 'noah-ottoman-fabric-turquoise-247-buy-new', 4999, [1, 2, 3, 4, 11, 12, 13, 14], [2, 3, 4]),
    ],
  },
  {
    ...LIVING_BASE,
    slug: 'sole-three-seater-sofa', code: 'SOL3', name: 'Sole', title: 'Sole Velvet Sofa', type: 'Three-seater sofa', line: 'Atelier', subcategory: 'sofas',
    tagline: 'Channel-stitched velvet and a low, confident line.',
    description: 'Sole’s deep seat, rounded arms and vertical channel stitching give it the presence of a bespoke piece. Upholstered in a rich performance velvet in sapphire or rose.',
    highlights: ['Channel-stitched back', 'Performance velvet', 'Deep seat', 'Slim metal legs'],
    material: ['Velvet'], spaces: ['Living room'], story: [VELVET, COMFORT, FRAME], badges: ['New'], rating: 4.8, reviews: 63,
    specOverrides: dims('205 cm', '90 cm', '80 cm'),
    variants: [
      { key: 'sapphire', label: 'Sapphire', options: { Colour: 'Sapphire' }, swatch: '#24448c', dir: FU + 'helio-velvet-3-seater-sofa-in-sapphire-blue-color-4775-buy-new', price: 39999, pick: [1, 2, 3, 4, 5, 6, 7, 8, 14], detail: [5, 6, 7] },
      { key: 'rose', label: 'Rose', options: { Colour: 'Rose' }, swatch: '#c98b8b', dir: FU + 'helio-velvet-3-seater-sofa-in-desert-rose-color-4508-buy-new', price: 39999, pick: [1, 2, 3, 4, 5, 12, 13], detail: [3, 4, 5] },
    ],
  },
  {
    ...LIVING_BASE,
    slug: 'sole-armchair', code: 'SOL1', name: 'Sole Armchair', title: 'Sole Armchair', type: 'Armchair', line: 'Atelier', subcategory: 'armchairs',
    tagline: 'A sculpted accent chair with channel stitching.',
    description: 'The Sole armchair brings the sofa’s stitched back and rounded arms to a single seat. A statement in rose velvet or plum fabric.',
    highlights: ['Channel-stitched back', 'Velvet or fabric', 'Rounded arms', 'Slim metal legs'],
    material: ['Velvet', 'Fabric'], spaces: ['Living room', 'Bedroom'], story: [VELVET, COMFORT], badges: [], rating: 4.7, reviews: 38,
    specOverrides: dims('86 cm', '88 cm', '80 cm'),
    variants: [
      { key: 'rose', label: 'Rose velvet', options: { Colour: 'Rose velvet' }, swatch: '#c98b8b', dir: FU + 'new-inv-helio-1-seater-sofa-desert-rose-4796-buy-new', price: 19999, pick: [1, 2, 3, 4, 9, 10, 11, 12, 13], detail: [2, 3, 4] },
      { key: 'plum', label: 'Plum fabric', options: { Colour: 'Plum fabric' }, swatch: '#4a2a4f', dir: FU + 'helio-fabric-1-seater-sofa-in-purple-berry-color-5501-buy-new', price: 19999, pick: [1, 10, 9, 5], detail: [1, 10] },
    ],
  },
  {
    ...LIVING_BASE,
    slug: 'riviera-sectional-sofa', code: 'RIVL', name: 'Riviera', title: 'Riviera Sectional Sofa', type: 'L-shaped sectional', line: 'Signature', subcategory: 'sectionals',
    tagline: 'A grand, channel-backed sectional for the whole family.',
    description: 'Riviera is our signature sectional: a long L-shape with sculpted channel-stitched backs, plump cushions and a lounging chaise. Made for movie nights, long lunches and everyone at once.',
    highlights: ['Generous L-shape', 'Channel-stitched backs', 'Performance velvet', 'Lounging chaise'],
    material: ['Velvet'], spaces: ['Living room'], story: [VELVET, COMFORT, FRAME], badges: ['Signature'], rating: 4.9, reviews: 47,
    specOverrides: dims('290 cm', '190 cm', '85 cm'),
    variants: [
      { key: 'sapphire', label: 'Sapphire', options: { Colour: 'Sapphire' }, swatch: '#24448c', dir: FU + 'linora-l-shape-sofa-3814-buy-new', price: 53999, pick: [1, 2, 3, 4, 5, 6, 13, 14], detail: [3, 4, 5] },
      { key: 'sun', label: 'Sunflower', options: { Colour: 'Sunflower' }, swatch: '#d9a531', dir: FU + 'linora-velvet-l-shape-sofa-in-sunshine-yellow-color-5394-buy-new', price: 55999, pick: [1, 2, 3, 9, 10, 12, 13, 14], detail: [2, 3, 13] },
      { key: 'rose', label: 'Rose', options: { Colour: 'Rose' }, swatch: '#c98b8b', dir: FU + 'linora-velvet-l-shape-sofa-desert-rose-4889-buy-new', price: 53999, pick: [1, 2, 3, 9, 10, 12, 13, 14], detail: [2, 3, 13] },
    ],
  },
  {
    ...LIVING_BASE,
    slug: 'riviera-three-seater-sofa', code: 'RIV3', name: 'Riviera Sofa', title: 'Riviera Three-Seater Sofa', type: 'Three-seater sofa', line: 'Signature', subcategory: 'sofas',
    tagline: 'All the Riviera presence, in three seats.',
    description: 'The Riviera three-seater keeps the sectional’s sculpted channel backs and plush velvet in a size suited to smaller living rooms.',
    highlights: ['Channel-stitched back', 'Performance velvet', 'Plump cushions', 'Pairs with the sectional'],
    material: ['Velvet'], spaces: ['Living room'], story: [VELVET, COMFORT], badges: [], rating: 4.8, reviews: 29,
    specOverrides: dims('210 cm', '92 cm', '85 cm'),
    variants: [
      { key: 'sapphire', label: 'Sapphire', options: { Colour: 'Sapphire' }, swatch: '#24448c', dir: FU + 'linora-velvet-3-seater-sofa-in-sapphire-blue-color-4733-buy-new', price: 24999, pick: [1, 2, 3, 4, 10, 11, 12], detail: [3, 4, 2] },
    ],
  },
  {
    ...LIVING_BASE,
    slug: 'dormi-sofa-cum-bed', code: 'DOR', name: 'Dormi', title: 'Dormi Sofa-cum-Bed', type: 'Sofa-cum-bed', line: 'Atelier', subcategory: 'sofa-beds',
    tagline: 'A sofa by day, a guest bed in seconds.',
    description: 'Dormi’s seat pulls forward and its adjustable headrests fold flat to make a comfortable double bed, with storage hidden underneath for linen. Upholstered in deep teal velvet.',
    highlights: ['Converts to a double bed', 'Adjustable headrests', 'Under-seat storage', 'Deep teal velvet'],
    material: ['Velvet'], spaces: ['Living room', 'Guest room'], story: [{ title: 'Two pieces in one', text: 'A smooth pull-out mechanism turns the sofa into a bed in under a minute, without removing a single cushion.' }, VELVET, COMFORT], badges: [], rating: 4.6, reviews: 34,
    specOverrides: { 'Indicative dimensions': [['Width', '220 cm'], ['Depth (sofa)', '100 cm'], ['Depth (bed)', '190 cm'], ['Height', '85 cm']] },
    variants: [{ key: 'teal', label: 'Deep teal', options: {}, swatch: '#1f5a5a', dir: FU + 'optimus-sofa-cum-bed-3790-buy-new', price: 42199, pick: [1, 2, 3, 4, 5, 6, 12, 13, 14], detail: [2, 3, 4] }],
  },
  {
    ...LIVING_BASE,
    slug: 'sogno-sofa-cum-bed', code: 'SOG', name: 'Sogno', title: 'Sogno Sofa-cum-Bed', type: 'Sofa-cum-bed', line: 'Studio', subcategory: 'sofa-beds',
    tagline: 'A clean-lined sectional that opens into a bed.',
    description: 'Sogno is a soft grey sectional with a pull-out bed and a storage chaise. Ideal for flats where the living room doubles as the guest room.',
    highlights: ['Pull-out bed', 'Storage chaise', 'Soft grey fabric', 'Reversible layout'],
    material: ['Fabric'], spaces: ['Living room', 'Guest room'], story: [{ title: 'Room for guests', text: 'The seat slides out into a full sleeping surface and the chaise lifts to reveal storage for pillows and linen.' }, FABRIC], badges: [], rating: 4.5, reviews: 27,
    specOverrides: { 'Indicative dimensions': [['Width', '250 cm'], ['Depth', '160 cm'], ['Height', '85 cm']] },
    variants: [{ key: 'grey', label: 'Fog grey', options: {}, swatch: '#7a7876', dir: FU + 'lana-fabric-sofa-cum-bed-in-grace-grey-color-4512-buy-new', price: 39999, pick: [1, 2, 3, 4, 5, 6, 7, 8, 14], detail: [4, 5, 6] }],
  },
  {
    ...LIVING_BASE,
    slug: 'lido-chaise-lounge', code: 'LID', name: 'Lido', title: 'Lido Chaise Lounge', type: 'Chaise lounge', line: 'Atelier', subcategory: 'chaises',
    tagline: 'Stretch out by the window.',
    description: 'Lido is a long, low chaise with a single sculpted arm and a loose bolster: the most relaxed seat in the house, with hidden storage beneath.',
    highlights: ['Full-length lounging', 'Hidden storage', 'Loose bolster', 'Two velvet colours'],
    material: ['Velvet'], spaces: ['Living room', 'Bedroom'], story: [VELVET, COMFORT], badges: ['New'], rating: 4.7, reviews: 22,
    specOverrides: dims('170 cm', '80 cm', '78 cm'),
    variants: [
      { key: 'rose', label: 'Rose', options: { Colour: 'Rose' }, swatch: '#c98b8b', dir: FU + 'lexa-chaise-lounger-desert-rose-5038-buy-new', price: 31499, pick: [1, 2, 3, 4, 5, 6, 7, 12, 13], detail: [3, 4, 5] },
      { key: 'turmeric', label: 'Turmeric', options: { Colour: 'Turmeric' }, swatch: '#c9952f', dir: FU + 'lexa-chaise-lounger-in-yellow-mustard-color-5044-buy-new', price: 30499, pick: [1, 2, 3, 4, 5, 6, 10, 11], detail: [2, 3, 4] },
    ],
  },
  {
    ...LIVING_BASE,
    slug: 'baithak-diwan', code: 'BAI', name: 'Baithak', title: 'Baithak Diwan & Floor Cushions', type: 'Diwan', line: 'Atelier', subcategory: 'chaises',
    tagline: 'A modern take on the Indian baithak.',
    description: 'Baithak is a low diwan with a set of matching floor cushions, for relaxed gatherings close to the ground. Rearrange it as a daybed, a lounge or extra seating for a festive evening.',
    highlights: ['Low diwan', 'Matching floor cushions', 'Modular layout', 'Honey-gold fabric'],
    material: ['Fabric'], spaces: ['Living room'], story: [{ title: 'Close to the ground', text: 'Inspired by traditional Indian floor seating, Baithak invites people to sit, sprawl and gather however they like.' }, FABRIC], badges: [], rating: 4.6, reviews: 18,
    specOverrides: dims('190 cm', '80 cm', '60 cm', '32 cm'),
    variants: [{ key: 'honey', label: 'Honey', options: {}, swatch: '#c79a3c', dir: FU + 'rizz-diwan-cum-floor-pads-in-honey-mustard-color-4721-buy-new', price: 22999, pick: [1, 2, 3, 4, 5, 6, 14], detail: [2, 3, 4] }],
  },
  {
    ...LIVING_BASE,
    slug: 'bambino-kids-sofa', code: 'BAM', name: 'Bambino', title: 'Bambino Kids’ Sofa', type: 'Kids’ sofa', line: 'Studio', subcategory: 'ottomans',
    tagline: 'A little armchair for little people.',
    description: 'Bambino is a rounded, child-sized armchair with no hard edges, upholstered in an easy-clean fabric for reading corners and playrooms.',
    highlights: ['Child-sized', 'Rounded, soft edges', 'Easy-clean fabric', 'Lightweight'],
    material: ['Fabric'], spaces: ['Kids’ room'], story: [{ title: 'Made for small hands', text: 'Rounded corners, a low seat and a light frame make Bambino safe to climb into and easy to move.' }], badges: [], rating: 4.8, reviews: 31,
    specOverrides: dims('60 cm', '55 cm', '55 cm', '26 cm'),
    variants: [
      { key: 'amber', label: 'Amber', options: { Colour: 'Amber' }, swatch: '#e2a43a', dir: FU + 'mio-kids-sofa-in-amber-yellow-color-5573-buy-new', price: 8799, pick: [1, 2, 3, 8, 9], detail: [1, 2] },
      { key: 'sage', label: 'Sage', options: { Colour: 'Sage' }, swatch: '#9fae8a', dir: FU + 'mio-kids-sofa-in-sage-green-color-5445-buy-new', price: 8799, pick: [1, 2, 3, 8, 9], detail: [1, 2] },
    ],
  },
];

// ------------------------------------------------------------------ Executive chairs
const EXEC_FAQ = [
  { q: 'Is the upholstery real leather?', a: 'Our executive chairs use premium composite leather or technical mesh: durable, easy to clean and consistent in colour across a boardroom. Genuine leather is available to order for trade projects.' },
  { q: 'Does the chair recline?', a: 'Yes. Each executive chair has a synchronised tilt that locks in several positions, with tension adjustable to your weight.' },
  { q: 'What does the warranty cover?', a: 'Five years on the frame, base and mechanism; three years on the gas lift and castors; one year on upholstery.' },
];
const LEATHER = { title: 'Soft, tailored upholstery', text: 'Premium composite leather is stretched over multi-layer moulded foam and finished with precise stitching, for a chair that looks as good in year five as on day one.' };
const SYNC = { title: 'Recline with control', text: 'A synchronised tilt reclines the back and seat together and locks at the angle you choose, from upright focus to a relaxed lean.' };
const BASE = { title: 'Polished foundations', text: 'A polished aluminium base on smooth-rolling PU castors that are kind to wooden and stone floors alike.' };
const EXMESH = { title: 'Breathable support', text: 'A taut technical mesh back keeps air moving while a sculpted frame supports the spine through the day.' };

const EXEC_BASE = {
  category: 'seating', subcategory: 'executive', type: 'Executive chair',
  warranty: '5-year frame & mechanism warranty', leadTime: 'Ships in 3–5 working days', faqs: EXEC_FAQ,
  mechanism: 'Synchro tilt', backType: 'High back', spaces: ['Executive', 'Home office', 'Corporate'], features: ['Headrest'],
};
const cb = (key, label, dir, price, pick, detail, swatch, options) => ({ key, label, options: options ?? {}, swatch: swatch ?? null, dir: CB + dir, price, pick, detail, max: 7 });

const exec = (o) => ({ ...EXEC_BASE, material: ['Leather'], story: [LEATHER, SYNC, BASE], badges: [], ...o });

export const EXECUTIVE = [
  exec({ slug: 'marea-executive-chair', code: 'MAR', name: 'Marea', title: 'Marea Executive Chair', line: 'Signature', tagline: 'Cream leather, sculpted like a lounge chair.', description: 'Marea is our most indulgent executive chair: a deeply padded, wing-like back in cream composite leather on a polished base. For the corner office or the home study that deserves it.', highlights: ['Sculpted wing back', 'Cream composite leather', 'Synchro tilt', 'Polished aluminium base'], badges: ['Signature'], rating: 4.9, reviews: 12, variants: [cb('cream', 'Cream', 'cruise-luxury-high-back-chair', 78000, [2, 3, 1], [1])] }),
  exec({ slug: 'luna-executive-chair', code: 'LUN', name: 'Luna', title: 'Luna Executive Chair', line: 'Signature', tagline: 'A tan leather classic with a modern frame.', description: 'Luna pairs a softly curved, channel-padded back in tan leather with a slender frame and armrests. Warm, generous and quietly authoritative.', highlights: ['Channel-padded back', 'Tan composite leather', 'Synchro tilt', 'Padded armrests'], badges: ['Signature'], rating: 4.9, reviews: 16, variants: [cb('tan', 'Tan', 'moon-luxury-high-back-chair', 69000, [2, 3, 4, 1, 5], [1, 5, 6])] }),
  exec({ slug: 'aurelio-ergonomic-chair', code: 'AUR', name: 'Aurelio', title: 'Aurelio Ergonomic Chair', line: 'Signature', material: ['Mesh'], story: [EXMESH, SYNC, BASE], features: ['Headrest', 'Adjustable arms', 'Lumbar support', 'Seat depth'], tagline: 'Every adjustment, engineered in mesh.', description: 'Aurelio is a fully adjustable ergonomic chair with a dynamic lumbar, 4D arms, sliding seat and a contoured headrest, all in breathable technical mesh on a polished frame.', highlights: ['Dynamic lumbar support', '4D armrests', 'Sliding seat', 'Adjustable headrest'], badges: ['Signature'], rating: 4.8, reviews: 41, variants: [cb('grey', 'Grey', 'aura-ultra', 64000, [2, 3, 4, 5, 8, 9], [5, 8])] }),
  exec({ slug: 'astra-executive-chair', code: 'AST', name: 'Astra', title: 'Astra Executive Chair', line: 'Signature', material: ['Mesh'], story: [EXMESH, SYNC], features: ['Headrest', 'Adjustable arms', 'Lumbar support'], tagline: 'Pale, precise and quietly futuristic.', description: 'Astra’s white frame and pale grey mesh read as light as air, while an adjustable headrest and lumbar keep you supported for hours.', highlights: ['White frame, grey mesh', 'Adjustable lumbar', 'Adjustable headrest', 'Synchro tilt'], rating: 4.7, reviews: 19, variants: [cb('white', 'White & grey', 'avatar-premium-luxury-high-back-chair-white-grey', 46999, [2, 3, 4, 5, 1], [1])] }),
  exec({ slug: 'ambra-executive-chair', code: 'AMB', name: 'Ambra', title: 'Ambra Executive Chair', line: 'Signature', tagline: 'Cognac leather on a slim, modern frame.', description: 'Ambra’s tall cognac-leather back sits on a minimal frame with floating armrests, a contemporary take on the executive chair.', highlights: ['Cognac composite leather', 'Floating armrests', 'Synchro tilt', 'Polished base'], rating: 4.8, reviews: 14, variants: [cb('cognac', 'Cognac', 'zest', 39000, [5, 6, 1, 2, 3, 4], [1, 2, 3])] }),
  exec({ slug: 'conte-executive-chair', code: 'CON', name: 'Conte', title: 'Conte Executive Chair', line: 'Signature', tagline: 'Bent-ply comfort, tailored in leather.', description: 'Conte’s curved bent-plywood back carries a three-layer cushion for firm lumbar support, finished in brown or beige leather with chrome arms.', highlights: ['Bent-ply curved back', 'Three-layer cushion', 'Chrome armrests', 'Two colours'], badges: ['Bestseller'], rating: 4.8, reviews: 52, variants: [cb('brown', 'Brown', 'royce-luxury-high-back-chair', 37000, [3, 4, 1, 2], [1, 2], '#6b4330', { Colour: 'Brown' }), cb('beige', 'Beige', 'royce-luxury-high-back-chair', 37000, [7, 8, 6, 5], [5, 6], '#d8c7ad', { Colour: 'Beige' })] }),
  exec({ slug: 'perla-executive-chair', code: 'PER', name: 'Perla', title: 'Perla Executive Chair', line: 'Signature', tagline: 'Ivory and chrome for the bright office.', description: 'Perla’s ivory leather shell and chrome frame bring a light, gallery-like elegance to the boardroom or a sunlit study.', highlights: ['Ivory composite leather', 'Chrome frame', 'Synchro tilt', 'Integrated headrest'], rating: 4.7, reviews: 11, variants: [cb('ivory', 'Ivory', 'pearl', 35000, [2, 3, 4, 5, 6, 1], [1])] }),
  exec({ slug: 'corona-executive-chair', code: 'COR', name: 'Corona', title: 'Corona Executive Chair', line: 'Signature', tagline: 'Boardroom presence in two back heights.', description: 'Corona is a tall, generously padded executive chair in ivory leather, also available with a medium back for meeting rooms.', highlights: ['Generous padding', 'Two back heights', 'Synchro tilt', 'Polished base'], rating: 4.7, reviews: 23, variants: [cb('high', 'High back', 'crown-luxury-high-back-boss-chair', 35000, [7, 1], [1], null, { 'Back height': 'High back' }), cb('mid', 'Medium back', 'crown-luxury-medium-back-chair', 34000, [2, 3, 1, 4], [1], null, { 'Back height': 'Medium back' })] }),
  exec({ slug: 'filo-executive-chair', code: 'FIL', name: 'Filo', title: 'Filo Executive Chair', line: 'Signature', tagline: 'Graphic black leather, slim as a pencil line.', description: 'Filo’s narrow, tall black back and slender arms give it a strikingly graphic profile, comfortable enough for long days at the desk.', highlights: ['Slim tall back', 'Black composite leather', 'Synchro tilt', 'Aluminium base'], rating: 4.7, reviews: 17, variants: [cb('black', 'Black', 'edge-series-e6-luxury-high-back-chair', 34000, [2, 3, 4, 5, 6, 1, 7], [1, 7])] }),
  exec({ slug: 'vino-executive-chair', code: 'VIN', name: 'Vino', title: 'Vino Executive Chair', line: 'Signature', tagline: 'Oxblood leather with a sculpted, cushioned back.', description: 'Vino is wrapped in a deep oxblood leather with a sculpted, pillowed back, a chair with real character for a study or private office.', highlights: ['Oxblood composite leather', 'Pillowed back', 'Synchro tilt', 'Padded arms'], rating: 4.8, reviews: 9, variants: [cb('oxblood', 'Oxblood', 'edge-series-e9-luxury-high-back-chair', 34000, [2, 3, 1, 4, 5], [1, 4, 5])] }),
  exec({ slug: 'felice-executive-chair', code: 'FEL', name: 'Felice', title: 'Felice Executive Chair', line: 'Signature', tagline: 'White and tan, high or mid back.', description: 'Felice combines a white frame with a tan leather back in a soft, contemporary silhouette. Choose a high back for the desk or a mid back for the meeting table.', highlights: ['White frame, tan back', 'Two back heights', 'Synchro tilt', 'Polished base'], rating: 4.7, reviews: 21, variants: [cb('high', 'High back', 'felix-luxury-high-back-chair-white-beige-1', 30000, [2, 3, 4, 5, 1, 6], [1, 6], null, { 'Back height': 'High back' }), cb('mid', 'Mid back', 'felix-luxury-mid-back-chair-white-beige', 29000, [3, 4, 5, 6, 1], [1, 2], null, { 'Back height': 'Mid back' })] }),
  exec({ slug: 'magno-executive-chair', code: 'MAG', name: 'Magno', title: 'Magno Executive Chair', line: 'Atelier', tagline: 'Cream leather with a contoured headrest.', description: 'Magno’s contoured cream leather back flows into an integrated headrest, supported by a robust synchro mechanism.', highlights: ['Contoured back', 'Integrated headrest', 'Cream composite leather', 'Synchro tilt'], rating: 4.6, reviews: 15, variants: [cb('cream', 'Cream', 'magna-luxury-high-back-chair', 30000, [2, 3, 4, 1], [1])] }),
  exec({ slug: 'cotto-executive-chair', code: 'COT', name: 'Cotto', title: 'Cotto Executive Chair', line: 'Atelier', tagline: 'Terracotta leather, made for warm interiors.', description: 'Cotto’s terracotta-brown leather and tall rounded back bring warmth to wood-panelled offices and earthy home studies.', highlights: ['Terracotta composite leather', 'Tall rounded back', 'Synchro tilt', 'Chrome arms'], rating: 4.7, reviews: 13, variants: [cb('terracotta', 'Terracotta', 'russet-high-back-1', 30000, [3, 4, 5, 6, 1], [1, 2])] }),
  exec({ slug: 'gravita-ergonomic-chair', code: 'GRA2', name: 'Gravità', title: 'Gravità Ergonomic Chair', line: 'Atelier', material: ['Mesh'], story: [EXMESH, SYNC], features: ['Headrest', 'Adjustable arms', 'Lumbar support'], tagline: 'A flexing mesh back that follows every move.', description: 'Gravità’s flexible mesh back and adaptive lumbar move with you as you reach and recline, with adjustable arms and headrest.', highlights: ['Flexing mesh back', 'Adaptive lumbar', 'Adjustable arms', 'Adjustable headrest'], rating: 4.7, reviews: 36, variants: [cb('black', 'Black & grey', 'gravity-luxury-high-back-chair', 26500, [3, 4, 5, 6, 1, 11], [1, 11])] }),
  exec({ slug: 'brezza-ergonomic-chair', code: 'BRE', name: 'Brezza', title: 'Brezza Ergonomic Chair', line: 'Atelier', material: ['Mesh'], story: [EXMESH, SYNC], features: ['Headrest', 'Adjustable arms', 'Lumbar support'], tagline: 'Light grey mesh on a white frame.', description: 'Brezza is a bright, airy ergonomic chair with a white frame, grey mesh and a full set of adjustments.', highlights: ['White frame', 'Grey mesh', 'Adjustable lumbar', 'Adjustable headrest'], rating: 4.6, reviews: 28, variants: [cb('grey', 'Grey', 'aero-luxury-high-back-chair', 26999, [2, 3, 4, 5, 6, 1], [1])] }),
  exec({ slug: 'ispira-ergonomic-chair', code: 'ISP', name: 'Ispira', title: 'Ispira Ergonomic Chair', line: 'Atelier', material: ['Mesh'], story: [EXMESH, SYNC], features: ['Headrest', 'Adjustable arms', 'Lumbar support'], tagline: 'Sport-inspired mesh in black or ice blue.', description: 'Ispira’s sculpted mesh back and winged headrest borrow from performance seating, tuned for long working days.', highlights: ['Sculpted mesh back', 'Winged headrest', 'Adjustable arms', 'Two colourways'], rating: 4.6, reviews: 24, variants: [cb('black', 'Black', 'inspire-mesh-luxury-high-back-chair', 26000, [2, 3, 4, 5, 1], [1, 6], '#1f1e1c', { Colour: 'Black' }), cb('ice', 'Ice', 'inspire-mesh-luxury-high-back-chair', 26000, [8, 9, 10, 11, 12], [7], '#b9cddd', { Colour: 'Ice' })] }),
  exec({ slug: 'trama-mesh-chair', code: 'TRA', name: 'Trama', title: 'Trama Mesh Chair', line: 'Atelier', material: ['Mesh'], story: [EXMESH, SYNC], features: ['Adjustable arms'], tagline: 'A woven-look mesh back in two heights.', description: 'Trama’s distinctive patterned mesh back is as supportive as it is striking, available with a high or medium back.', highlights: ['Patterned mesh back', 'Two back heights', 'Synchro tilt', 'Aluminium base'], rating: 4.6, reviews: 19, variants: [cb('high', 'High back', 'spider-luxury-mesh-high-back-chair', 24500, [2, 3, 4, 5, 1], [1], null, { 'Back height': 'High back' }), cb('mid', 'Medium back', 'spider-luxury-mesh-medium-back-chair', 22500, [2, 3, 4, 1], [1], null, { 'Back height': 'Medium back' })] }),
  exec({ slug: 'seta-ergonomic-chair', code: 'SET', name: 'Seta', title: 'Seta Ergonomic Chair', line: 'Atelier', material: ['Mesh'], story: [EXMESH, SYNC], features: ['Headrest', 'Adjustable arms'], tagline: 'Silky grey mesh, softly sculpted.', description: 'Seta wraps a softly sculpted frame in fine grey mesh, with a supportive headrest and adjustable arms.', highlights: ['Fine grey mesh', 'Sculpted frame', 'Adjustable headrest', 'Adjustable arms'], rating: 4.5, reviews: 22, variants: [cb('grey', 'Grey', 'silky-luxury-chair', 24000, [2, 3, 4, 1, 10, 11], [1, 5])] }),
  exec({ slug: 'ettore-executive-chair', code: 'ETT', name: 'Ettore', title: 'Ettore Executive Chair', line: 'Atelier', tagline: 'Classic proportions in warm leather.', description: 'Ettore is a well-proportioned executive chair in tan or ivory leather, a dependable centrepiece for a cabin or study.', highlights: ['Composite leather', 'Synchro tilt', 'Padded arms', 'Polished base'], rating: 4.5, reviews: 18, variants: [cb('std', 'Ivory & tan', 'hector-high-back', 22000, [5, 6, 4, 1, 2], [1, 2])] }),
  exec({ slug: 'bruna-executive-chair', code: 'BRU', name: 'Bruna', title: 'Bruna Executive Chair', line: 'Studio', tagline: 'A rich executive chair at a sensible price.', description: 'Bruna offers the comfort of a padded leather executive chair in brown or black, at a price that suits whole teams.', highlights: ['Padded composite leather', 'Synchro tilt', 'Two colours', 'Chrome base'], rating: 4.5, reviews: 47, variants: [cb('brown', 'Brown', 'bella-luxury-chair', 17500, [2, 3, 4, 1], [1], '#7a4a2e', { Colour: 'Brown' }), cb('black', 'Black', 'bella-luxury-chair', 17500, [9, 10, 11, 8], [8], '#1f1e1c', { Colour: 'Black' })] }),
  exec({ slug: 'velluto-executive-chair', code: 'VEL', name: 'Velluto', title: 'Velluto Upholstered Chair', line: 'Studio', material: ['Fabric'], story: [SYNC, BASE], tagline: 'Soft fabric executive seating in grey or sage.', description: 'Velluto swaps leather for a soft, textured fabric in grey or sage, a gentler executive chair for creative studios and homes.', highlights: ['Textured fabric', 'Tall padded back', 'Synchro tilt', 'Two colours'], rating: 4.5, reviews: 20, variants: [cb('grey', 'Grey', 'elegance', 17000, [3, 4, 5, 1, 2], [1, 2], '#7d7c7a', { Colour: 'Grey' }), cb('sage', 'Sage', 'elegance', 17000, [7, 6, 8], [8], '#7f9a86', { Colour: 'Sage' })] }),
];

export const DRIVE_SCENES = [
  { name: 'living-hero', from: 'reference/mgr-casa-drive/scraped/furlenco/sofas/linora-l-shape-sofa-3814-buy-new/01.jpg' },
  { name: 'living-rose', from: 'reference/mgr-casa-drive/scraped/furlenco/sofas/linora-velvet-l-shape-sofa-desert-rose-4889-buy-new/01.jpg' },
  { name: 'living-sun', from: 'reference/mgr-casa-drive/scraped/furlenco/sofas/linora-velvet-l-shape-sofa-in-sunshine-yellow-color-5394-buy-new/01.jpg' },
  { name: 'living-sapphire', from: 'reference/mgr-casa-drive/scraped/furlenco/sofas/helio-velvet-3-seater-sofa-in-sapphire-blue-color-4775-buy-new/01.jpg' },
  { name: 'living-teal', from: 'reference/mgr-casa-drive/scraped/furlenco/sofas/optimus-sofa-cum-bed-3790-buy-new/01.jpg' },
  { name: 'living-chaise', from: 'reference/mgr-casa-drive/scraped/furlenco/sofas/lexa-chaise-lounger-in-yellow-mustard-color-5044-buy-new/01.jpg' },
  { name: 'living-lino', from: 'reference/mgr-casa-drive/scraped/furlenco/sofas/noah-fabric-3-seater-sofa-in-grace-denim-color-4186-buy-new/01.jpg' },
  { name: 'detail-velvet', from: 'reference/mgr-casa-drive/scraped/furlenco/sofas/helio-velvet-3-seater-sofa-in-sapphire-blue-color-4775-buy-new/06.jpg', width: 1500 },
  { name: 'detail-tuft', from: 'reference/mgr-casa-drive/scraped/furlenco/sofas/noah-fabric-3-seater-sofa-in-grace-denim-color-4186-buy-new/05.jpg', width: 1500 },
  { name: 'exec-luna', from: 'reference/mgr-casa-drive/scraped/cellbell/chairs/moon-luxury-high-back-chair/01.jpg', width: 1600 },
  { name: 'exec-cotto', from: 'reference/mgr-casa-drive/scraped/cellbell/chairs/russet-high-back-1/01.jpg', width: 1600 },
];
