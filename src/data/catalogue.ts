// Catalogue access layer. Pages only talk to these functions, so swapping the local JSON
// for an API later means changing this file, not the components.
import raw from './products.generated.json';

export type SpecGroups = Record<string, [string, string][]>;

export interface Variant {
  id: string;
  key: string;
  label: string;
  options: Record<string, string>;
  swatch: string | null;
  sku: string;
  price: number;
  available: boolean;
  images: string[];
  detailImages: string[];
  specs: SpecGroups;
}

export interface StorySection {
  title: string;
  text: string;
}

export interface Product {
  slug: string;
  code: string;
  name: string;
  title: string;
  type: string;
  line: 'Signature' | 'Atelier' | 'Studio';
  category: CategorySlug;
  subcategory?: string;
  tagline: string;
  description: string;
  highlights: string[];
  material: string[];
  mechanism: string | null;
  backType: string | null;
  spaces: string[];
  features: string[];
  story: StorySection[];
  faqs: { q: string; a: string }[];
  badges: string[];
  rating: number;
  reviews: number;
  warranty: string;
  leadTime: string;
  variants: Variant[];
}

export type CategorySlug = 'living' | 'seating' | 'desks' | 'storage' | 'accessories';

export interface Category {
  slug: CategorySlug;
  title: string;
  kicker: string;
  description: string;
  image: string;
  subcategories: { slug: string; title: string }[];
}

export const CATEGORIES: Category[] = [
  {
    slug: 'living',
    title: 'Living',
    kicker: 'Sofas, sectionals & lounge',
    description: 'Deep, generous sofas, sectionals, sofa-cum-beds and accent pieces in velvet, fabric and leatherette, made for Indian living rooms.',
    image: '/images/scenes/living-hero.webp',
    subcategories: [
      { slug: 'sofas', title: 'Sofas' },
      { slug: 'sectionals', title: 'Sectionals & L-shapes' },
      { slug: 'armchairs', title: 'Armchairs' },
      { slug: 'sofa-beds', title: 'Sofa-cum-beds' },
      { slug: 'chaises', title: 'Chaises & diwans' },
      { slug: 'ottomans', title: 'Ottomans & kids' },
    ],
  },
  {
    slug: 'seating',
    title: 'Seating',
    kicker: 'Executive, boss, task & lounge chairs',
    description: 'Executive chairs in leather and mesh, ergonomic task chairs and lounge seating, engineered for long days and Indian climates.',
    image: '/images/scenes/room-slate.webp',
    subcategories: [
      { slug: 'executive', title: 'Executive chairs' },
      { slug: 'boss', title: 'Boss chairs' },
      { slug: 'task', title: 'Task chairs' },
      { slug: 'work', title: 'Work & study chairs' },
      { slug: 'lounge', title: 'Lounge & gaming' },
    ],
  },
  {
    slug: 'desks',
    title: 'Desks & Tables',
    kicker: 'Sit-stand desks & work tables',
    description: 'Height-adjustable desks, compact study tables and work tables that fit real Indian homes and offices.',
    image: '/images/scenes/room-velvet.webp',
    subcategories: [
      { slug: 'height-adjustable', title: 'Height-adjustable' },
      { slug: 'work-tables', title: 'Work & study tables' },
    ],
  },
  {
    slug: 'storage',
    title: 'Storage',
    kicker: 'Open shelving',
    description: 'Slim, modular shelving to keep a workspace calm and clear.',
    image: '/images/scenes/room-shelf.webp',
    subcategories: [],
  },
  {
    slug: 'accessories',
    title: 'Accessories',
    kicker: 'Power & desk tools',
    description: 'Small things that make a desk work harder.',
    image: '/images/scenes/room-rug.webp',
    subcategories: [],
  },
];

export const LINES = [
  {
    slug: 'signature',
    name: 'Signature' as const,
    numeral: 'I',
    summary: 'Our most considered pieces: grand sectionals, sculpted executive chairs and every adjustment, with a five-year promise.',
    image: '/images/scenes/living-sun.webp',
  },
  {
    slug: 'atelier',
    name: 'Atelier' as const,
    numeral: 'II',
    summary: 'Warm, residential designs: velvet sofas, chaises and chairs for the living room and the home study.',
    image: '/images/scenes/living-sapphire.webp',
  },
  {
    slug: 'studio',
    name: 'Studio' as const,
    numeral: 'III',
    summary: 'Hard-working essentials, specified by the dozen for offices and campuses.',
    image: '/images/scenes/room-pillar.webp',
  },
];

function subcategoryOf(p: Omit<Product, 'subcategory'> & { subcategory?: string }): string | undefined {
  if (p.subcategory) return p.subcategory;
  if (p.category !== 'seating') return undefined;
  return p.type === 'Ergonomic chair' ? 'task' : 'work';
}

export const PRODUCTS: Product[] = (raw as unknown as Product[]).map((p) => ({ ...p, subcategory: subcategoryOf(p) }));

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const getCategory = (slug?: string) => CATEGORIES.find((c) => c.slug === slug);
export const fromPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));
export const isAvailable = (p: Product) => p.variants.some((v) => v.available);
export const primaryImage = (p: Product) => p.variants[0].images[0];

export function related(p: Product, n = 4): Product[] {
  const same = PRODUCTS.filter((x) => x.slug !== p.slug && x.category === p.category);
  same.sort((a, b) => Number(b.line === p.line) - Number(a.line === p.line) || Math.abs(fromPrice(a) - fromPrice(p)) - Math.abs(fromPrice(b) - fromPrice(p)));
  return same.slice(0, n);
}

export function search(q: string): Product[] {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return PRODUCTS.map((p) => {
    const hay = [p.name, p.title, p.type, p.line, p.tagline, p.category, ...p.material, ...p.spaces, ...p.highlights, p.mechanism ?? ''].join(' ').toLowerCase();
    const score = terms.reduce((s, t) => s + (hay.includes(t) ? 1 : 0) + (p.name.toLowerCase().startsWith(t) ? 2 : 0), 0);
    return { p, score };
  })
    .filter((x) => x.score >= terms.length)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

export function optionGroups(p: Product): { name: string; values: { value: string; swatch: string | null }[] }[] {
  const names: string[] = [];
  p.variants.forEach((v) => Object.keys(v.options).forEach((k) => !names.includes(k) && names.push(k)));
  return names.map((name) => {
    const seen = new Map<string, string | null>();
    p.variants.forEach((v) => {
      const val = v.options[name];
      if (val && !seen.has(val)) seen.set(val, name === 'Colour' || name === 'Finish' ? v.swatch : null);
    });
    return { name, values: [...seen].map(([value, swatch]) => ({ value, swatch })) };
  });
}

/** Pick the variant that best matches a change to one option, keeping the others where possible. */
export function resolveVariant(p: Product, current: Variant, name: string, value: string): Variant {
  const want = { ...current.options, [name]: value };
  const exact = p.variants.find((v) => Object.entries(want).every(([k, val]) => v.options[k] === val));
  return exact ?? p.variants.find((v) => v.options[name] === value) ?? current;
}
