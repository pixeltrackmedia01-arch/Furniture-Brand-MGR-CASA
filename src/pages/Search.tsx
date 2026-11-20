import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { search } from '../data/catalogue';
import { useSeo } from '../lib/hooks';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const results = search(q);
  useSeo(q ? `Search: ${q}` : 'Search');
  return (
    <div className="wrap page-head">
      <p className="eyebrow">Search</p>
      <form
        role="search"
        className="search-bar"
        style={{ marginTop: 12 }}
        onSubmit={(e) => {
          e.preventDefault();
          const v = new FormData(e.currentTarget).get('q') as string;
          setParams({ q: v });
        }}
      >
        <label htmlFor="q" className="sr-only">
          Search
        </label>
        <input id="q" name="q" defaultValue={q} key={q} placeholder="Search chairs, desks, materials…" />
        <button className="btn btn-sm">Search</button>
      </form>
      <p className="muted" style={{ margin: '24px 0 32px' }} aria-live="polite">
        {q ? `${results.length} result${results.length === 1 ? '' : 's'} for “${q}”` : 'Type to search the collection.'}
      </p>
      {results.length > 0 ? (
        <div className="grid-products" style={{ paddingBottom: 96 }}>
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        q && (
          <div className="empty">
            <p>Nothing matched. Try a broader word like “chair” or “desk”, or browse by category.</p>
            <Link to="/shop" className="btn">
              Shop all
            </Link>
          </div>
        )
      )}
    </div>
  );
}
