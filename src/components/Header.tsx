import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { CATEGORIES, LINES, primaryImage, PRODUCTS, search } from '../data/catalogue';
import { BRAND } from '../data/site';
import { formatPrice } from '../lib/format';
import { useStore } from '../lib/store';
import { Icon } from './Icon';

const SUGGESTIONS = ['Task chair', 'Standing desk', 'Mesh', 'Study table', 'Lounge', 'Walnut'];

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { list, wishlist } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const megaTimer = useRef<number>();
  const isHome = pathname === '/';

  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    setDrawer(false);
    setMega(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const lock = drawer || searchOpen;
    document.body.style.overflow = lock ? 'hidden' : '';
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawer(false);
        setSearchOpen(false);
        setMega(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawer, searchOpen]);

  const openMega = () => {
    window.clearTimeout(megaTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    megaTimer.current = window.setTimeout(() => setMega(false), 160);
  };

  const results = q.trim() ? search(q).slice(0, 8) : [];
  const over = isHome && !scrolled && !mega;
  const itemCount = list.reduce((s, x) => s + x.qty, 0);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="announce">
        Free delivery to 40+ cities · Trade pricing from 10 seats ·{' '}
        <Link to="/contact#studios">Visit a studio</Link>
      </div>
      <header className={`header ${over ? 'is-over' : ''} ${hidden && !mega ? 'is-hidden' : ''}`} onMouseLeave={closeMega}>
        <div className="wrap header-in">
          <nav className="nav" aria-label="Primary">
            <button className="nav-link" aria-expanded={mega} aria-controls="mega" onMouseEnter={openMega} onClick={() => setMega((m) => !m)}>
              Shop
            </button>
            <NavLink to="/collections/signature" className="nav-link" onMouseEnter={closeMega}>
              Collections
            </NavLink>
            <NavLink to="/trade" className="nav-link" onMouseEnter={closeMega}>
              Trade
            </NavLink>
            <NavLink to="/about" className="nav-link" onMouseEnter={closeMega}>
              Story
            </NavLink>
            <NavLink to="/journal" className="nav-link" onMouseEnter={closeMega}>
              Journal
            </NavLink>
          </nav>
          <button className="icon-btn burger" onClick={() => setDrawer(true)} aria-label="Open menu">
            <Icon name="menu" />
          </button>
          <Link to="/" className="logo" aria-label="MGR CASA home">
            <span className="logo-mark">MGR</span>
            <span className="logo-sub">CASA</span>
          </Link>
          <div className="header-tools">
            <NavLink to="/contact" className="nav-link hide-m">
              Studios
            </NavLink>
            <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Icon name="search" />
            </button>
            <Link to="/wishlist" className="icon-btn hide-m" aria-label={`Wishlist, ${wishlist.length} items`}>
              <Icon name="heart" />
              {wishlist.length > 0 && <span className="count-dot">{wishlist.length}</span>}
            </Link>
            <Link to="/enquiry-list" className="icon-btn" aria-label={`Enquiry list, ${itemCount} items`}>
              <Icon name="bag" />
              {itemCount > 0 && <span className="count-dot">{itemCount}</span>}
            </Link>
          </div>
        </div>

        <div id="mega" className={`mega ${mega ? 'open' : ''}`} onMouseEnter={openMega}>
          <div className="wrap mega-in">
            {CATEGORIES.slice(0, 2).map((c) => (
              <div key={c.slug}>
                <h3 className="eyebrow">
                  <Link to={`/shop/${c.slug}`}>{c.title}</Link>
                </h3>
                <ul>
                  <li>
                    <Link to={`/shop/${c.slug}`}>All {c.title.toLowerCase()}</Link>
                  </li>
                  {c.subcategories.map((s) => (
                    <li key={s.slug}>
                      <Link to={`/shop/${c.slug}?type=${s.slug}`}>{s.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="eyebrow">More</h3>
              <ul>
                <li>
                  <Link to="/shop/storage">Storage</Link>
                </li>
                <li>
                  <Link to="/shop/accessories">Accessories</Link>
                </li>
                <li>
                  <Link to="/shop">Shop everything</Link>
                </li>
                <li>
                  <Link to="/compare">Compare pieces</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="eyebrow">Collections</h3>
              <ul>
                {LINES.map((l) => (
                  <li key={l.slug}>
                    <Link to={`/collections/${l.slug}`}>{l.name}</Link>
                  </li>
                ))}
                <li>
                  <Link to="/trade">For business</Link>
                </li>
              </ul>
            </div>
            <Link to="/collections/signature" className="mega-feature">
              <img src="/images/scenes/room-stripe.webp" alt="" loading="lazy" />
              <span>The Signature collection</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`scrim ${drawer ? 'open' : ''}`} onClick={() => setDrawer(false)} aria-hidden="true" />
      <aside className={`drawer ${drawer ? 'open' : ''}`} aria-label="Menu" aria-hidden={!drawer} inert={!drawer ? '' : undefined}>
        <div className="drawer-head">
          <span className="eyebrow">Menu</span>
          <button className="icon-btn" onClick={() => setDrawer(false)} aria-label="Close menu">
            <Icon name="close" />
          </button>
        </div>
        <div className="drawer-body">
          <ul className="m-nav">
            {CATEGORIES.map((c) =>
              c.subcategories.length ? (
                <li key={c.slug}>
                  <details>
                    <summary>
                      {c.title} <Icon name="chevron" className="chev" />
                    </summary>
                    <ul>
                      <li>
                        <Link to={`/shop/${c.slug}`}>All {c.title.toLowerCase()}</Link>
                      </li>
                      {c.subcategories.map((s) => (
                        <li key={s.slug}>
                          <Link to={`/shop/${c.slug}?type=${s.slug}`}>{s.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={c.slug}>
                  <Link to={`/shop/${c.slug}`}>{c.title}</Link>
                </li>
              ),
            )}
            <li>
              <details>
                <summary>
                  Collections <Icon name="chevron" className="chev" />
                </summary>
                <ul>
                  {LINES.map((l) => (
                    <li key={l.slug}>
                      <Link to={`/collections/${l.slug}`}>{l.name}</Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
            <li>
              <Link to="/trade">Trade & business</Link>
            </li>
            <li>
              <Link to="/about">Our story</Link>
            </li>
            <li>
              <Link to="/journal">Journal</Link>
            </li>
            <li>
              <Link to="/contact">Studios & contact</Link>
            </li>
          </ul>
          <div style={{ display: 'grid', gap: 10, marginTop: 28 }} className="small">
            <Link to="/wishlist">Wishlist ({wishlist.length})</Link>
            <Link to="/compare">Compare</Link>
            <a href={BRAND.phoneHref}>{BRAND.phone}</a>
          </div>
        </div>
      </aside>

      {/* Search overlay */}
      <div className={`search-overlay ${searchOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Search" aria-hidden={!searchOpen} inert={!searchOpen ? '' : undefined}>
        <div className="wrap" style={{ paddingTop: 24, paddingBottom: 64 }}>
          <form
            className="search-bar"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            <Icon name="search" size={24} />
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <input id="site-search" ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search chairs, desks, materials…" autoComplete="off" />
            <button type="button" className="icon-btn" onClick={() => setSearchOpen(false)} aria-label="Close search">
              <Icon name="close" />
            </button>
          </form>
          {!q.trim() && (
            <div style={{ marginTop: 32 }}>
              <p className="eyebrow" style={{ marginBottom: 14 }}>
                Popular searches
              </p>
              <div className="chips">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="chip" onClick={() => setQ(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <p className="eyebrow" style={{ margin: '40px 0 0' }}>
                Trending now
              </p>
              <div className="search-results">
                {PRODUCTS.filter((p) => p.badges.includes('Bestseller')).map((p) => (
                  <SearchHit key={p.slug} slug={p.slug} />
                ))}
              </div>
            </div>
          )}
          {q.trim() && (
            <>
              <p className="muted" style={{ marginTop: 20 }} aria-live="polite">
                {results.length ? `${results.length} result${results.length > 1 ? 's' : ''}` : `No pieces match “${q}”. Try “chair” or “desk”.`}
              </p>
              <div className="search-results">
                {results.map((p) => (
                  <SearchHit key={p.slug} slug={p.slug} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function SearchHit({ slug }: { slug: string }) {
  const p = PRODUCTS.find((x) => x.slug === slug)!;
  return (
    <Link to={`/product/${p.slug}`} className="search-hit">
      <img src={primaryImage(p)} alt="" loading="lazy" />
      <div className="h4">{p.title}</div>
      <div className="small muted num">{formatPrice(Math.min(...p.variants.map((v) => v.price)))}</div>
    </Link>
  );
}
