import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { getProduct, type Product } from '../data/catalogue';
import { useSeo } from '../lib/hooks';
import { useStore } from '../lib/store';

export default function Wishlist() {
  useSeo('Wishlist');
  const { wishlist } = useStore();
  const items = wishlist.map(getProduct).filter(Boolean) as Product[];
  return (
    <div className="wrap" style={{ paddingBottom: 96 }}>
      <header className="page-head">
        <p className="eyebrow">Wishlist</p>
        <h1 className="h1">Saved for later</h1>
        <p className="lede">Pieces you have saved on this device.</p>
      </header>
      {items.length ? (
        <div className="grid-products">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2 className="h3">Nothing saved yet.</h2>
          <p className="muted">Tap the heart on any piece to keep it here.</p>
          <Link to="/shop" className="btn">
            Browse the collection
          </Link>
        </div>
      )}
    </div>
  );
}
