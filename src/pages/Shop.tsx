import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Icon } from '../components/Icon';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES, fromPrice, getCategory, isAvailable, LINES, PRODUCTS, type Product } from '../data/catalogue';
import { ASSURANCES } from '../data/site';
import { useSeo } from '../lib/hooks';
import '../styles/shop.css';
import NotFound from './NotFound';

const PRICE_BANDS = [
  { key: 'u10', label: 'Under ₹10,000', test: (n: number) => n < 10000 },
  { key: '10-20', label: '₹10,000 – ₹20,000', test: (n: number) => n >= 10000 && n < 20000 },
  { key: '20-40', label: '₹20,000 – ₹40,000', test: (n: number) => n >= 20000 && n < 40000 },
  { key: 'o40', label: 'Over ₹40,000', test: (n: number) => n >= 40000 },
];

const SORTS = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
  { key: 'rating', label: 'Top rated' },
  { key: 'name', label: 'Name A–Z' },
];

type FacetKey = 'type' | 'material' | 'mechanism' | 'back' | 'space' | 'price' | 'line';

const facetValue: Record<Exclude<FacetKey, 'price'>, (p: Product) => string[]> = {
  type: (p) => (p.subcategory ? [p.subcategory] : []),
  material: (p) => p.material,
  mechanism: (p) => (p.mechanism ? [p.mechanism] : []),
  back: (p) => (p.backType ? [p.backType] : []),
  space: (p) => p.spaces,
  line: (p) => [p.line.toLowerCase()],
};

const featuredScore = (p: Product) =>
  (p.badges.includes('Bestseller') ? 30 : 0) + (p.badges.includes('Signature') ? 20 : 0) + (p.badges.includes('New') ? 10 : 0) + p.rating * 2 + Math.min(p.reviews, 200) / 40;

export default function Shop() {
  const { category: catSlug, line: lineSlug } = useParams();
  const [params, setParams] = useSearchParams();
  const [drawer, setDrawer] = useState(false);
  const category = getCategory(catSlug);
  const line = LINES.find((l) => l.slug === lineSlug);

  const scope = useMemo(
    () => PRODUCTS.filter((p) => (!category || p.category === category.slug) && (!line || p.line === line.name)),
    [category, line],
  );

  const title = category?.title ?? (line ? `The ${line.name} collection` : 'Shop all furniture');
  const intro = category?.description ?? line?.summary ?? 'Every MGR CASA piece, from ergonomic task chairs to sit-stand desks and storage.';
  useSeo(title, intro);

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawer]);

  if ((catSlug && !category) || (lineSlug && !line)) return <NotFound />;

  const selected = (k: FacetKey) => params.getAll(k);
  const inStock = params.get('stock') === '1';
  const sort = params.get('sort') ?? 'featured';

  const toggle = (k: FacetKey | 'stock', v: string) => {
    const next = new URLSearchParams(params);
    const cur = next.getAll(k);
    next.delete(k);
    if (k === 'stock') {
      if (!cur.length) next.set('stock', '1');
    } else {
      (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]).forEach((x) => next.append(k, x));
    }
    setParams(next, { replace: true });
  };
  const clearAll = () => {
    const next = new URLSearchParams();
    if (params.get('sort')) next.set('sort', params.get('sort')!);
    setParams(next, { replace: true });
  };

  const matches = (p: Product, except?: FacetKey) => {
    for (const k of Object.keys(facetValue) as Exclude<FacetKey, 'price'>[]) {
      if (k === except) continue;
      const sel = selected(k);
      if (sel.length && !facetValue[k](p).some((v) => sel.includes(v))) return false;
    }
    if (except !== 'price') {
      const bands = selected('price');
      if (bands.length && !PRICE_BANDS.filter((b) => bands.includes(b.key)).some((b) => b.test(fromPrice(p)))) return false;
    }
    if (inStock && !isAvailable(p)) return false;
    return true;
  };

  const results = scope.filter((p) => matches(p));
  results.sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return fromPrice(a) - fromPrice(b);
      case 'price-desc':
        return fromPrice(b) - fromPrice(a);
      case 'rating':
        return b.rating - a.rating || b.reviews - a.reviews;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return featuredScore(b) - featuredScore(a);
    }
  });

  const subLabels = Object.fromEntries(CATEGORIES.flatMap((c) => c.subcategories.map((s) => [s.slug, s.title])));
  const facetOptions = (k: Exclude<FacetKey, 'price'>, label?: (v: string) => string) => {
    const all = new Map<string, number>();
    scope.forEach((p) => facetValue[k](p).forEach((v) => all.set(v, 0)));
    scope.filter((p) => matches(p, k)).forEach((p) => facetValue[k](p).forEach((v) => all.set(v, (all.get(v) ?? 0) + 1)));
    return [...all].map(([value, count]) => ({ value, count, label: label ? label(value) : value }));
  };

  const groups: { key: FacetKey; title: string; options: { value: string; count: number; label: string }[] }[] = [
    { key: 'type', title: 'Type', options: facetOptions('type', (v) => subLabels[v] ?? v) },
    { key: 'line', title: 'Collection', options: line ? [] : facetOptions('line', (v) => v[0].toUpperCase() + v.slice(1)) },
    { key: 'space', title: 'Room', options: facetOptions('space') },
    { key: 'material', title: 'Material', options: facetOptions('material') },
    { key: 'mechanism', title: 'Mechanism', options: facetOptions('mechanism') },
    { key: 'back', title: 'Back height', options: facetOptions('back') },
    {
      key: 'price',
      title: 'Price',
      options: PRICE_BANDS.map((b) => ({ value: b.key, label: b.label, count: scope.filter((p) => matches(p, 'price') && b.test(fromPrice(p))).length })),
    },
  ].filter((g) => g.options.length > 1) as { key: FacetKey; title: string; options: { value: string; count: number; label: string }[] }[];

  const active = groups.flatMap((g) => selected(g.key).map((v) => ({ k: g.key, v, label: g.options.find((o) => o.value === v)?.label ?? v })));

  const filters = (
    <div className="filters">
      <label className="check filter-stock">
        <input type="checkbox" checked={inStock} onChange={() => toggle('stock', '1')} />
        <span>Ready to ship only</span>
      </label>
      {groups.map((g) => (
        <fieldset key={g.key} className="filter-group">
          <legend>{g.title}</legend>
          {g.options.map((o) => (
            <label key={o.value} className={`filter-opt ${o.count === 0 && !selected(g.key).includes(o.value) ? 'is-empty' : ''}`}>
              <input type="checkbox" checked={selected(g.key).includes(o.value)} onChange={() => toggle(g.key, o.value)} />
              <span>{o.label}</span>
              <span className="filter-count num">{o.count}</span>
            </label>
          ))}
        </fieldset>
      ))}
    </div>
  );

  return (
    <div className="shop">
      <div className="wrap">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Shop', to: '/shop' },
            ...(category ? [{ label: category.title }] : line ? [{ label: line.name }] : []),
          ]}
        />
        <header className="shop-head">
          <div>
            <h1 className="h1">{title}</h1>
            <p className="lede">{intro}</p>
          </div>
          {!line && (
            <nav className="cat-pills" aria-label="Categories">
              <Link to="/shop" className={`chip ${!category ? 'active' : ''}`}>
                All
              </Link>
              {CATEGORIES.map((c) => (
                <Link key={c.slug} to={`/shop/${c.slug}`} className={`chip ${category?.slug === c.slug ? 'active' : ''}`}>
                  {c.title}
                </Link>
              ))}
            </nav>
          )}
          {line && (
            <nav className="cat-pills" aria-label="Collections">
              {LINES.map((l) => (
                <Link key={l.slug} to={`/collections/${l.slug}`} className={`chip ${l.slug === line.slug ? 'active' : ''}`}>
                  {l.name}
                </Link>
              ))}
            </nav>
          )}
        </header>
      </div>

      <div className="toolbar">
        <div className="wrap toolbar-in">
          <button className="btn btn-ghost btn-sm filter-toggle" onClick={() => setDrawer(true)}>
            <Icon name="filter" size={16} /> Filters {active.length > 0 && `(${active.length})`}
          </button>
          <p className="small muted num" aria-live="polite">
            {results.length} {results.length === 1 ? 'piece' : 'pieces'}
          </p>
          <label className="sort">
            <span className="small muted">Sort</span>
            <select
              value={sort}
              onChange={(e) => {
                const next = new URLSearchParams(params);
                next.set('sort', e.target.value);
                setParams(next, { replace: true });
              }}
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="wrap shop-body">
        <aside className="shop-side" aria-label="Filters">
          {filters}
        </aside>
        <div>
          {active.length > 0 && (
            <div className="active-filters">
              {active.map((a) => (
                <button key={a.k + a.v} className="chip active" onClick={() => toggle(a.k, a.v)} aria-label={`Remove filter ${a.label}`}>
                  {a.label} <Icon name="close" size={12} />
                </button>
              ))}
              <button className="text-link small" onClick={clearAll}>
                Clear all
              </button>
            </div>
          )}
          {results.length ? (
            <div className="grid-products">
              {results.map((p, n) => (
                <ProductCard key={p.slug} product={p} priority={n < 4} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h2 className="h3">No pieces match those filters.</h2>
              <p className="muted">Try removing a filter, or ask us: we often have made-to-order options.</p>
              <button className="btn" onClick={clearAll}>
                Clear filters
              </button>
            </div>
          )}

          <div className="shop-help">
            <div>
              <h2 className="h3">Not sure which is right for you?</h2>
              <p className="muted">Our consultants can recommend a chair or desk for your height, posture and room in a short call, or in person at a studio.</p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn">
                Talk to a consultant
              </Link>
              <Link to="/compare" className="btn btn-ghost">
                Compare pieces
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingBottom: 'clamp(48px, 6vw, 96px)' }}>
        <div className="assure-row">
          {ASSURANCES.map((a, n) => (
            <div key={a.title}>
              <Icon name={(['truck', 'shield', 'tool', 'receipt'] as const)[n]} size={22} />
              <div>
                <strong>{a.title}</strong>
                <span>{a.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`scrim ${drawer ? 'open' : ''}`} onClick={() => setDrawer(false)} aria-hidden="true" />
      <aside className={`drawer right ${drawer ? 'open' : ''}`} aria-label="Filters" aria-hidden={!drawer} inert={!drawer ? '' : undefined}>
        <div className="drawer-head">
          <span className="h4">Filters</span>
          <button className="icon-btn" onClick={() => setDrawer(false)} aria-label="Close filters">
            <Icon name="close" />
          </button>
        </div>
        <div className="drawer-body">{filters}</div>
        <div className="drawer-foot">
          <button className="btn btn-ghost" onClick={clearAll} style={{ flex: 1 }}>
            Clear
          </button>
          <button className="btn" onClick={() => setDrawer(false)} style={{ flex: 2 }}>
            Show {results.length} {results.length === 1 ? 'piece' : 'pieces'}
          </button>
        </div>
      </aside>
    </div>
  );
}
