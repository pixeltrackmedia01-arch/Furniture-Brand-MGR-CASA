import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Rating } from '../components/Stars';
import { fromPrice, getProduct, PRODUCTS, type Product } from '../data/catalogue';
import { formatPrice } from '../lib/format';
import { useSeo } from '../lib/hooks';
import { useStore } from '../lib/store';

const spec = (p: Product, key: string) => {
  for (const rows of Object.values(p.variants[0].specs)) {
    const r = rows.find(([k]) => k.toLowerCase().includes(key));
    if (r) return r[1];
  }
  return '—';
};

export default function Compare() {
  useSeo('Compare pieces');
  const { compare, toggleCompare, openEnquiry } = useStore();
  const items = compare.map(getProduct).filter(Boolean) as Product[];
  const suggestions = PRODUCTS.filter((p) => p.category === (items[0]?.category ?? 'seating') && !compare.includes(p.slug)).slice(0, 6);

  const rows: [string, (p: Product) => React.ReactNode][] = [
    ['Price from', (p) => <span className="num">{formatPrice(fromPrice(p))}</span>],
    ['Rating', (p) => <Rating value={p.rating} count={p.reviews} compact />],
    ['Collection', (p) => p.line],
    ['Type', (p) => p.type],
    ['Mechanism', (p) => p.mechanism ?? '—'],
    ['Materials', (p) => p.material.join(', ')],
    ['Back height', (p) => p.backType ?? '—'],
    ['Seat height', (p) => `${spec(p, 'minimum seat')} – ${spec(p, 'maximum seat')}`.replace('— – —', '—')],
    ['Overall width', (p) => spec(p, 'width')],
    ['Highlights', (p) => p.highlights.join(' · ')],
    ['Warranty', (p) => p.warranty],
    ['Delivery', (p) => p.leadTime],
  ];

  return (
    <div className="wrap" style={{ paddingBottom: 96 }}>
      <header className="page-head">
        <p className="eyebrow">Compare</p>
        <h1 className="h1">Side by side</h1>
        <p className="lede">Compare up to three pieces. Add from any product page using the compare button.</p>
      </header>
      {items.length === 0 ? (
        <div className="empty" style={{ paddingTop: 24 }}>
          <h2 className="h3">Pick a few to start</h2>
          <div className="chips" style={{ justifyContent: 'center' }}>
            {suggestions.map((p) => (
              <button key={p.slug} className="chip" onClick={() => toggleCompare(p.slug)}>
                + {p.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="compare-scroll">
          <table className="compare">
            <thead>
              <tr>
                <td />
                {items.map((p) => (
                  <th key={p.slug} scope="col">
                    <Link to={`/product/${p.slug}`}>
                      <img src={p.variants[0].images[0]} alt="" />
                      <span className="h3">{p.name}</span>
                    </Link>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-sm"
                        onClick={() => {
                          const v = p.variants[0];
                          openEnquiry([{ productSlug: p.slug, variantId: v.id, title: p.title, variantLabel: v.label, qty: 1, price: v.price, image: v.images[0] }]);
                        }}
                      >
                        Enquire
                      </button>
                      <button className="icon-btn" onClick={() => toggleCompare(p.slug)} aria-label={`Remove ${p.name}`}>
                        <Icon name="close" size={16} />
                      </button>
                    </div>
                  </th>
                ))}
                {items.length < 3 && (
                  <th scope="col" className="compare-add">
                    <p className="small muted">Add another</p>
                    <div className="chips">
                      {suggestions.slice(0, 4).map((p) => (
                        <button key={p.slug} className="chip" onClick={() => toggleCompare(p.slug)}>
                          + {p.name}
                        </button>
                      ))}
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, fn]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {items.map((p) => (
                    <td key={p.slug}>{fn(p)}</td>
                  ))}
                  {items.length < 3 && <td />}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
