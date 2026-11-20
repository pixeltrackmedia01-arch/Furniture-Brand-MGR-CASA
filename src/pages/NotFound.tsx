import { Link } from 'react-router-dom';
import { useSeo } from '../lib/hooks';

export default function NotFound() {
  useSeo('Page not found');
  return (
    <div className="wrap empty" style={{ minHeight: '60vh', alignContent: 'center' }}>
      <p className="eyebrow">404</p>
      <h1 className="h1">
        This room is <em className="italic">empty.</em>
      </h1>
      <p className="lede">The page you were looking for has moved or never existed.</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn">
          Back to home
        </Link>
        <Link to="/shop" className="btn btn-ghost">
          Browse the shop
        </Link>
      </div>
    </div>
  );
}
