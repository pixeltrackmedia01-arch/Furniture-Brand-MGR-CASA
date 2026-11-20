import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Accordion } from '../components/Accordion';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Icon } from '../components/Icon';
import { ProductCard } from '../components/ProductCard';
import { Rating } from '../components/Stars';
import { getCategory, getProduct, optionGroups, related, resolveVariant, type Product as P, type Variant } from '../data/catalogue';
import { BRAND } from '../data/site';
import { formatPrice } from '../lib/format';
import { useSeo } from '../lib/hooks';
import { useStore } from '../lib/store';
import '../styles/product.css';
import NotFound from './NotFound';

export default function Product() {
  const { slug } = useParams();
  const p = getProduct(slug ?? '');
  if (!p) return <NotFound />;
  return <ProductView key={p.slug} p={p} />;
}

function ProductView({ p }: { p: P }) {
  const [params, setParams] = useSearchParams();
  const { addToList, openEnquiry, wishlist, toggleWish, compare, toggleCompare, markViewed, recent } = useStore();
  const [variant, setVariant] = useState<Variant>(() => p.variants.find((v) => v.key === params.get('v')) ?? p.variants[0]);
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [pincode, setPincode] = useState('');
  const [eta, setEta] = useState<string | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const category = getCategory(p.category)!;
  const groups = optionGroups(p);
  const wished = wishlist.includes(p.slug);
  const comparing = compare.includes(p.slug);

  useSeo(`${p.title} · ${variant.label}`, `${p.tagline} ${p.description}`.slice(0, 160));

  useEffect(() => markViewed(p.slug), [p.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (name: string, value: string) => {
    const v = resolveVariant(p, variant, name, value);
    setVariant(v);
    setImg(0);
    galleryRef.current?.scrollTo({ left: 0 });
    const next = new URLSearchParams(params);
    next.set('v', v.key);
    setParams(next, { replace: true });
  };

  const item = () => ({ productSlug: p.slug, variantId: variant.id, title: p.title, variantLabel: variant.label, qty, price: variant.price, image: variant.images[0] });
  const specs = Object.entries(variant.specs);
  const recentProducts = useMemo(() => recent.filter((s) => s !== p.slug).map(getProduct).filter(Boolean).slice(0, 4) as P[], [recent, p.slug]);
  const story = p.story.map((s, n) => ({ ...s, image: variant.detailImages[n] ?? p.variants.find((v) => v.detailImages[n])?.detailImages[n] }));
  const waText = encodeURIComponent(`Hello MGR CASA, I'm interested in the ${p.title} (${variant.label}), quantity ${qty}.`);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    description: p.description,
    sku: variant.sku,
    brand: { '@type': 'Brand', name: 'MGR CASA' },
    image: variant.images,
    aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviews },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: variant.price,
      availability: variant.available ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
    },
  };

  const onGalleryScroll = () => {
    const g = galleryRef.current;
    if (g) setImg(Math.round(g.scrollLeft / g.clientWidth));
  };

  const checkPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) return setEta('Please enter a valid 6-digit pincode.');
    const metro = /^(56|40|11|12|41|50|60|70|38)/.test(pincode);
    const days = p.category === 'seating' ? (metro ? '3–5' : '6–9') : p.category === 'living' ? (metro ? '7–10' : '10–14') : metro ? '5–7' : '8–12';
    setEta(`Delivers to ${pincode} in ${days} working days${metro ? (p.category === 'living' ? ', placed in your room by our crew' : ', with free assembly available') : ''}.`);
  };

  return (
    <div className="pdp">
      <script type="application/ld+json">{JSON.stringify(ld)}</script>
      <div className="wrap">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: category.title, to: `/shop/${category.slug}` },
            { label: p.name },
          ]}
        />
      </div>

      <section className="wrap pdp-top">
        <div className="pdp-gallery">
          <div className={`pdp-main ${p.category === 'living' ? 'cover' : ''}`} ref={galleryRef} onScroll={onGalleryScroll} tabIndex={0} aria-label="Product images, scroll for more">
            {variant.images.map((src, n) => (
              <figure key={src} className={n === img ? 'on' : ''}>
                <img src={src} alt={`${p.title}, ${variant.label}, view ${n + 1} of ${variant.images.length}`} loading={n === 0 ? 'eager' : 'lazy'} width={1100} height={1100} />
              </figure>
            ))}
            <div className="pdp-badges">
              {p.badges.map((b) => (
                <span key={b} className={`badge ${b === 'Signature' ? 'badge-dark' : ''}`}>
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div className="pdp-dots" aria-hidden="true">
            {variant.images.map((s, n) => (
              <span key={s} className={n === img ? 'on' : ''} />
            ))}
          </div>
          <div className="pdp-thumbs" role="tablist" aria-label="Choose image">
            {variant.images.map((src, n) => (
              <button
                key={src}
                role="tab"
                aria-selected={n === img}
                aria-label={`View image ${n + 1}`}
                className={n === img ? 'on' : ''}
                onClick={() => {
                  setImg(n);
                  const g = galleryRef.current;
                  if (g && getComputedStyle(g).overflowX !== 'visible') g.scrollTo({ left: n * g.clientWidth, behavior: 'smooth' });
                }}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div className="pdp-info">
          <p className="eyebrow">
            <Link to={`/collections/${p.line.toLowerCase()}`}>{p.line} collection</Link> · {p.type}
          </p>
          <h1 className="h1 pdp-title">{p.title}</h1>
          <a href="#reviews" className="pdp-rating">
            <Rating value={p.rating} count={p.reviews} />
          </a>
          <p className="pdp-tagline">{p.tagline}</p>

          <div className="pdp-price">
            <span className="num">{formatPrice(variant.price)}</span>
            <span className="small muted">Inclusive of GST · Free delivery</span>
          </div>

          {groups.map((g) => (
            <fieldset className="pdp-opt" key={g.name}>
              <legend>
                {g.name}: <strong>{variant.options[g.name]}</strong>
              </legend>
              <div className="pdp-opt-values">
                {g.values.map((v) => {
                  const on = variant.options[g.name] === v.value;
                  return v.swatch ? (
                    <button key={v.value} className={`swatch ${on ? 'on' : ''}`} onClick={() => pick(g.name, v.value)} aria-pressed={on} aria-label={v.value} title={v.value}>
                      <span style={{ background: v.swatch }} />
                    </button>
                  ) : (
                    <button key={v.value} className={`pill ${on ? 'on' : ''}`} onClick={() => pick(g.name, v.value)} aria-pressed={on}>
                      {v.value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <div className={`pdp-stock ${variant.available ? 'ok' : ''}`}>
            <span className="dot" />
            {variant.available ? p.leadTime : 'Made to order · 3–4 weeks'}
          </div>

          <div className="pdp-buy">
            <div className="qty" role="group" aria-label="Quantity">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                <Icon name="minus" size={16} />
              </button>
              <input value={qty} inputMode="numeric" aria-label="Quantity" onChange={(e) => setQty(Math.max(1, Math.min(999, Number(e.target.value.replace(/\D/g, '')) || 1)))} />
              <button onClick={() => setQty((q) => Math.min(999, q + 1))} aria-label="Increase quantity">
                <Icon name="plus" size={16} />
              </button>
            </div>
            <button className="btn btn-clay pdp-cta" onClick={() => openEnquiry([item()])}>
              Enquire now
            </button>
          </div>
          <div className="pdp-secondary">
            <button className="btn btn-ghost" onClick={() => addToList(item())}>
              <Icon name="bag" size={16} /> Add to enquiry list
            </button>
            <button className={`icon-btn pdp-icon ${wished ? 'on' : ''}`} onClick={() => toggleWish(p.slug)} aria-pressed={wished} aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}>
              <Icon name="heart" />
            </button>
            <button className={`icon-btn pdp-icon ${comparing ? 'on' : ''}`} onClick={() => toggleCompare(p.slug)} aria-pressed={comparing} aria-label={comparing ? 'Remove from compare' : 'Add to compare'}>
              <Icon name="compare" />
            </button>
          </div>
          <a className="pdp-wa" href={`https://wa.me/${BRAND.whatsapp}?text=${waText}`} target="_blank" rel="noreferrer">
            <Icon name="chat" size={18} /> Ask a question on WhatsApp
          </a>
          {qty >= 10 || p.category === 'seating' || p.category === 'living' ? (
            <p className="pdp-trade">
              <strong>Buying 10 or more?</strong> Get trade pricing and a dedicated consultant. <Link to="/trade#enquire" className="text-link">Request a quote</Link>
            </p>
          ) : null}

          <form className="pdp-pin" onSubmit={checkPin}>
            <label htmlFor="pin" className="small">
              <Icon name="truck" size={18} /> Check delivery
            </label>
            <div>
              <input id="pin" className="input" inputMode="numeric" maxLength={6} placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))} />
              <button className="btn btn-sm btn-ghost">Check</button>
            </div>
            {eta && (
              <p className="small" role="status">
                {eta}
              </p>
            )}
          </form>

          <ul className="pdp-assure">
            <li>
              <Icon name="shield" size={18} /> {p.warranty}
            </li>
            <li>
              <Icon name="tool" size={18} /> {p.category === 'living' ? 'White-glove delivery and placement' : 'Assembly by our team in metro cities'}
            </li>
            <li>
              <Icon name="receipt" size={18} /> GST invoice for businesses
            </li>
            <li>
              <Icon name="pin" size={18} /> <Link to="/contact#studios" className="text-link">Try it at a studio</Link>
            </li>
          </ul>

          <div className="pdp-acc">
            <Accordion title="Overview" open>
              <p>{p.description}</p>
              <ul className="pdp-highlights">
                {p.highlights.map((h) => (
                  <li key={h}>
                    <Icon name="check" size={16} /> {h}
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Dimensions & specifications">
              {specs.length ? (
                specs.map(([group, rows]) => (
                  <table className="spec-table" key={group}>
                    <caption>{group}</caption>
                    <tbody>
                      {rows.map(([k, v]) => (
                        <tr key={k + v}>
                          <th scope="row">{k}</th>
                          <td>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ))
              ) : (
                <p>Detailed drawings are available on request.</p>
              )}
              <table className="spec-table">
                <caption>Details</caption>
                <tbody>
                  <tr>
                    <th scope="row">SKU</th>
                    <td className="num">{variant.sku}</td>
                  </tr>
                  <tr>
                    <th scope="row">Materials</th>
                    <td>{p.material.join(', ')}</td>
                  </tr>
                  {p.mechanism && (
                    <tr>
                      <th scope="row">Mechanism</th>
                      <td>{p.mechanism}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Accordion>
            <Accordion title="Delivery & assembly">
              <p>
                Free delivery to 40+ cities. {p.leadTime}. {p.category === 'living' ? 'Delivered and placed in your room by our own crew, who attach the legs and take the packaging away.' : p.category === 'seating' ? 'Chairs arrive largely assembled and take around fifteen minutes to finish.' : 'Ships flat-packed with all tools; complimentary assembly in metro cities.'}{' '}
                <Link to="/info/delivery-and-assembly" className="text-link">
                  Delivery details
                </Link>
              </p>
            </Accordion>
            <Accordion title="Warranty & care">
              <p>
                {p.warranty}. Vacuum mesh and fabric gently; wipe frames with a dry cloth.{' '}
                <Link to="/info/warranty" className="text-link">
                  Warranty
                </Link>{' '}
                ·{' '}
                <Link to="/info/care" className="text-link">
                  Care guide
                </Link>
              </p>
            </Accordion>
          </div>
        </div>
      </section>

      {story.length > 0 && (
        <section className="pdp-story">
          <div className="wrap">
            <p className="eyebrow">Design details</p>
            <h2 className="h2" style={{ margin: '12px 0 40px', maxWidth: '14em' }}>
              {p.name}, up close.
            </h2>
            <div className="story-grid">
              {story.map((s, n) => (
                <article key={s.title} className={`story-item ${s.image ? '' : 'no-img'}`}>
                  {s.image && (
                    <div className="story-media">
                      <img src={s.image} alt="" loading="lazy" />
                    </div>
                  )}
                  <span className="num muted small">0{n + 1}</span>
                  <h3 className="h3">{s.title}</h3>
                  <p className="muted">{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="wrap section-tight pdp-lower" id="reviews">
        <div>
          <h2 className="h3" style={{ marginBottom: 16 }}>
            What owners say
          </h2>
          <div className="review-summary">
            <span className="review-score">{p.rating.toFixed(1)}</span>
            <div>
              <Rating value={p.rating} count={p.reviews} />
              <p className="small muted" style={{ marginTop: 6 }}>
                Verified purchases across India
              </p>
            </div>
          </div>
          <blockquote className="review">
            “Comfortable from the first day, and the {p.category === 'seating' ? 'adjustments are easy to find' : 'finish is better than the photos'}. Delivery was on time and the team was courteous.”
            <footer className="small muted">Verified buyer · Pune</footer>
          </blockquote>
        </div>
        {p.faqs.length > 0 && (
          <div>
            <h2 className="h3" style={{ marginBottom: 16 }}>
              Questions, answered
            </h2>
            {p.faqs.map((f) => (
              <Accordion key={f.q} title={f.q}>
                <p>{f.a}</p>
              </Accordion>
            ))}
          </div>
        )}
      </section>

      <section className="wrap section-tight">
        <div className="section-head">
          <h2 className="h2">You may also like</h2>
          <Link to={`/shop/${p.category}`} className="link">
            All {category.title.toLowerCase()} <Icon name="arrow" size={16} className="arrow" />
          </Link>
        </div>
        <div className="grid-products">
          {related(p).map((r) => (
            <ProductCard key={r.slug} product={r} />
          ))}
        </div>
      </section>

      {recentProducts.length > 0 && (
        <section className="wrap section-tight" style={{ paddingTop: 0 }}>
          <h2 className="h3" style={{ marginBottom: 24 }}>
            Recently viewed
          </h2>
          <div className="grid-products">
            {recentProducts.map((r) => (
              <ProductCard key={r.slug} product={r} />
            ))}
          </div>
        </section>
      )}

      <div className="pdp-sticky" aria-hidden="false">
        <div>
          <strong>{p.name}</strong>
          <span className="num small">{formatPrice(variant.price)}</span>
        </div>
        <button className="btn btn-clay btn-sm" onClick={() => openEnquiry([item()])}>
          Enquire
        </button>
      </div>
    </div>
  );
}
