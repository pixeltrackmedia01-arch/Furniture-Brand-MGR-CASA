import { Link } from 'react-router-dom';
import { fromPrice, isAvailable, type Product } from '../data/catalogue';
import { formatPrice } from '../lib/format';
import { useStore } from '../lib/store';
import { Icon } from './Icon';
import { Rating } from './Stars';

export function ProductCard({ product: p, priority = false }: { product: Product; priority?: boolean }) {
  const { wishlist, toggleWish, openEnquiry } = useStore();
  const v = p.variants[0];
  const second = p.category === 'living' ? v.images[1] : v.images[2] ?? v.images[1];
  const swatches = p.variants.filter((x, i, a) => x.swatch && a.findIndex((y) => y.swatch === x.swatch) === i);
  const multiPrice = p.variants.some((x) => x.price !== v.price);
  const wished = wishlist.includes(p.slug);
  const available = isAvailable(p);

  return (
    <article className="card">
      <div className={`card-media ${p.category === 'living' ? 'cover' : ''}`}>
        <div className="card-badges">
          {p.badges.slice(0, 1).map((b) => (
            <span key={b} className={`badge ${b === 'Signature' ? 'badge-dark' : ''}`}>
              {b}
            </span>
          ))}
        </div>
        <img src={v.images[0]} alt={`${p.title}, ${v.label}`} loading={priority ? 'eager' : 'lazy'} width={1100} height={1100} />
        {second && <img src={second} alt="" loading="lazy" aria-hidden="true" width={1100} height={1100} />}
        <button
          className={`icon-btn card-wish ${wished ? 'on' : ''}`}
          onClick={() => toggleWish(p.slug)}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${p.title} from wishlist` : `Save ${p.title} to wishlist`}
        >
          <Icon name="heart" />
        </button>
        <div className="card-quick">
          <button
            className="btn btn-light btn-sm btn-block"
            onClick={() =>
              openEnquiry([{ productSlug: p.slug, variantId: v.id, title: p.title, variantLabel: v.label, qty: 1, price: v.price, image: v.images[0] }])
            }
          >
            Quick enquiry
          </button>
        </div>
      </div>
      <div className="card-meta">
        <h3 className="card-title">
          <Link to={`/product/${p.slug}`}>{p.name}</Link>
        </h3>
        <span className="card-price num">
          {multiPrice && <span className="muted small">from </span>}
          {formatPrice(fromPrice(p))}
        </span>
      </div>
      <p className="card-type">
        {p.type} · {p.line}
      </p>
      <div className="card-meta" style={{ alignItems: 'center' }}>
        <Rating value={p.rating} count={p.reviews} compact />
        {swatches.length > 1 ? (
          <span className="swatches" aria-label={`${swatches.length} finishes`}>
            {swatches.map((s) => (
              <span key={s.id} className="swatch-dot" style={{ background: s.swatch! }} title={s.label} />
            ))}
          </span>
        ) : (
          !available && <span className="oos">Made to order</span>
        )}
      </div>
    </article>
  );
}
