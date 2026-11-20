import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { fromPrice, getProduct, LINES, PRODUCTS, type Product } from '../data/catalogue';
import { ARTICLES, HOTSPOTS, MATERIALS, STATS, STUDIOS, TESTIMONIALS } from '../data/site';
import { formatDate, formatPrice } from '../lib/format';
import { prefersReducedMotion, useMediaQuery, useReveal, useScrollProgress, useSeo } from '../lib/hooks';
import '../styles/home.css';

const SLIDES = [
  { image: '/images/scenes/living-hero.webp', caption: 'Riviera Sectional Sofa in sapphire velvet', product: 'riviera-sectional-sofa' },
  { image: '/images/scenes/living-sun.webp', caption: 'Riviera Sectional Sofa in sunflower velvet', product: 'riviera-sectional-sofa' },
  { image: '/images/scenes/hero-terracotta.webp', caption: 'Nido Task Chair in a Bengaluru home studio', product: 'nido-task-chair' },
];

export default function Home() {
  useSeo('MGR CASA · Contemporary furniture, designed in India', 'Sofas, sectionals, executive and ergonomic chairs, sit-stand desks and storage for homes and workplaces. Visit our studios in Bengaluru and Mumbai or enquire online.');
  return (
    <div className="home">
      <Hero />
      <Marquee />
      <Manifesto />
      <Collections />
      <Anatomy />
      <Rail />
      <Spaces />
      <Numbers />
      <Materials />
      <Voices />
      <TradeBand />
      <Journal />
      <StudioCta />
    </div>
  );
}

/* ---------------------------------------------------------------- Hero */
function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ref, progress] = useScrollProgress<HTMLElement>();
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (paused || reduced) return;
    const t = setTimeout(() => setI((x) => (x + 1) % SLIDES.length), 6500);
    return () => clearTimeout(t);
  }, [i, paused, reduced]);

  const slide = SLIDES[i];
  const p = getProduct(slide.product)!;
  const shift = reduced ? 0 : Math.max(0, progress - 0.5) * 2 * 120;

  return (
    <section className="hero" ref={ref} aria-label="Introduction" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="hero-media" style={{ transform: `translate3d(0, ${shift}px, 0)` }}>
        {SLIDES.map((s, n) => (
          <img key={s.image} src={s.image} alt={n === i ? s.caption : ''} className={n === i ? 'on' : ''} {...{ fetchpriority: n === 0 ? 'high' : 'low' }} />
        ))}
      </div>
      <div className="hero-shade" />
      <div className="wrap hero-in">
        <p className="eyebrow hero-eyebrow">
          <span className="line-mask"><span>Contemporary furniture · Designed in India</span></span>
        </p>
        <h1 className="display hero-title">
          <span className="line-mask"><span>Made for the</span></span>
          <span className="line-mask"><span><em className="italic">hours</em> you spend</span></span>
          <span className="line-mask"><span>sitting still.</span></span>
        </h1>
        <div className="hero-actions">
          <Link to="/shop" className="btn btn-light">
            Explore the collection
          </Link>
          <Link to="/trade" className="btn btn-outline-light">
            Furnish a workplace
          </Link>
        </div>
      </div>
      <div className="wrap hero-foot">
        <Link to={`/product/${p.slug}`} className="hero-caption" key={slide.product}>
          <span className="eyebrow">Shown</span>
          <span>
            {p.title} · from {formatPrice(fromPrice(p))}
          </span>
          <Icon name="arrow" size={16} />
        </Link>
        <div className="hero-dots" role="tablist" aria-label="Choose slide">
          {SLIDES.map((s, n) => (
            <button key={s.image} role="tab" aria-selected={n === i} aria-label={`Slide ${n + 1}: ${s.caption}`} onClick={() => setI(n)} className={n === i ? 'on' : ''}>
              <span className="num">0{n + 1}</span>
              <span className="bar">
                <span style={{ animationPlayState: paused ? 'paused' : 'running' }} />
              </span>
            </button>
          ))}
        </div>
      </div>
      <a href="#manifesto" className="hero-scroll" aria-label="Scroll to continue">
        <span />
      </a>
    </section>
  );
}

/* ---------------------------------------------------------------- Marquee */
function Marquee() {
  const items = ['Designed in India', 'Sofas, seating & workspace', 'Up to 5-year warranty', 'Studios in Bengaluru, Mumbai & Gurugram', 'Free delivery to 40+ cities', 'Trade programme from 10 seats', 'Tested to 120,000 cycles'];
  return (
    <div className="marquee" aria-label="Brand promises">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <ul key={k} aria-hidden={k === 1}>
            {items.map((t) => (
              <li key={t}>
                {t}
                <span className="marquee-star">✳</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Manifesto */
function Manifesto() {
  const text =
    'We design furniture for the long, ordinary hours of a life: the deadline, the phone call, the homework, the slow Sunday. Pieces that support the body, quiet the room and are still worth keeping in twenty years.';
  const words = text.split(' ');
  const [ref, progress] = useScrollProgress<HTMLDivElement>();
  const lit = Math.round(Math.min(1, Math.max(0, (progress - 0.18) / 0.42)) * words.length);
  return (
    <section className="section manifesto" id="manifesto">
      <div className="wrap manifesto-grid">
        <p className="eyebrow">(01) — Our point of view</p>
        <div ref={ref}>
          <p className="manifesto-text" aria-label={text}>
            {words.map((w, n) => (
              <span key={n} aria-hidden="true" className={n < lit || prefersReducedMotion() ? 'lit' : ''}>
                {w}{' '}
              </span>
            ))}
          </p>
          <Link to="/about" className="link">
            Read our story <Icon name="arrow" size={16} className="arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Collections */
function Collections() {
  const [active, setActive] = useState(0);
  const counts = useMemo(() => Object.fromEntries(LINES.map((l) => [l.name, PRODUCTS.filter((p) => p.line === l.name).length])), []);
  return (
    <section className="section collections" aria-labelledby="col-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">(02) — Collections</p>
            <h2 className="h2" id="col-title" style={{ marginTop: 16 }}>
              Three collections, <em className="italic">one</em> point of view.
            </h2>
          </div>
          <Link to="/shop" className="link">
            Shop all pieces <Icon name="arrow" size={16} className="arrow" />
          </Link>
        </div>
        <div className="col-panels">
          {LINES.map((l, n) => (
            <Link
              key={l.slug}
              to={`/collections/${l.slug}`}
              className={`col-panel ${active === n ? 'on' : ''}`}
              onMouseEnter={() => setActive(n)}
              onFocus={() => setActive(n)}
            >
              <img src={l.image} alt="" loading="lazy" />
              <div className="col-panel-shade" />
              <span className="col-num">{l.numeral}</span>
              <div className="col-panel-body">
                <h3 className="h2">{l.name}</h3>
                <p>{l.summary}</p>
                <span className="link">
                  {counts[l.name]} pieces <Icon name="arrow" size={16} className="arrow" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Anatomy */
function Anatomy() {
  const [active, setActive] = useState(0);
  const p = getProduct('vetta-task-chair')!;
  const [ref, inView] = useReveal<HTMLDivElement>(0.3);
  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % HOTSPOTS.length), 4200);
    return () => clearTimeout(t);
  }, [active, inView]);
  return (
    <section className="section anatomy" aria-labelledby="anat-title">
      <div className="wrap anatomy-grid">
        <div className="anatomy-copy">
          <p className="eyebrow">(03) — Anatomy of the Vetta</p>
          <h2 className="h2" id="anat-title" style={{ margin: '16px 0 24px' }}>
            Six adjustments.
            <br />
            <em className="italic">Zero</em> guesswork.
          </h2>
          <p className="lede">Our flagship task chair adapts to the body in front of it. Explore the details that make an eight-hour day feel shorter.</p>
          <ol className="anatomy-list">
            {HOTSPOTS.map((h, n) => (
              <li key={h.title}>
                <button className={n === active ? 'on' : ''} onClick={() => setActive(n)} aria-pressed={n === active}>
                  <span className="num">0{n + 1}</span>
                  <span>
                    <strong>{h.title}</strong>
                    <span className="anatomy-text">{h.text}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 32 }}>
            <Link to={`/product/${p.slug}`} className="btn">
              Discover Vetta · {formatPrice(fromPrice(p))}
            </Link>
          </div>
        </div>
        <div className="anatomy-stage" ref={ref}>
          <div className="anatomy-ring" aria-hidden="true" />
          <img src={p.variants[0].images[0]} alt="Vetta Task Chair in graphite, front three-quarter view" loading="lazy" />
          {HOTSPOTS.map((h, n) => (
            <button
              key={h.title}
              className={`hotspot ${n === active ? 'on' : ''}`}
              style={{ left: `${h.x}%`, top: `${h.y}%` } as CSSProperties}
              onClick={() => setActive(n)}
              aria-label={h.title}
            >
              <span>{n + 1}</span>
            </button>
          ))}
          <div className="hotspot-card" key={active} style={{ left: `${Math.min(HOTSPOTS[active].x, 62)}%`, top: `${HOTSPOTS[active].y}%` }} aria-live="polite">
            <strong>{HOTSPOTS[active].title}</strong>
            <span>{HOTSPOTS[active].text}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Horizontal rail */
function Rail() {
  const items = useMemo(() => ['riviera-sectional-sofa', 'luna-executive-chair', 'sole-three-seater-sofa', 'vetta-task-chair', 'lino-three-seater-sofa', 'conte-executive-chair', 'lido-chaise-lounge', 'altezza-standing-desk'].map((s) => getProduct(s)!), []);
  const desktop = useMediaQuery('(min-width: 960px)');
  const pinned = desktop && !prefersReducedMotion();
  const outer = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  const [h, setH] = useState<number | undefined>();

  useEffect(() => {
    if (!pinned) {
      setH(undefined);
      setX(0);
      return;
    }
    let raf = 0;
    const measure = () => {
      const t = track.current;
      if (!t) return;
      const dist = t.scrollWidth - window.innerWidth;
      setH(dist + window.innerHeight);
    };
    const update = () => {
      raf = 0;
      const o = outer.current;
      const t = track.current;
      if (!o || !t) return;
      const dist = t.scrollWidth - window.innerWidth;
      const r = o.getBoundingClientRect();
      const prog = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      setX(-prog * dist);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(raf);
    };
  }, [pinned]);

  return (
    <section ref={outer} className={`rail ${pinned ? 'is-pinned' : ''}`} style={{ height: h }} aria-labelledby="rail-title">
      <div className="rail-sticky">
        <div className="rail-track" ref={track} style={{ transform: `translate3d(${x}px,0,0)` }}>
          <div className="rail-intro">
            <p className="eyebrow">(04) — The edit</p>
            <h2 className="h1" id="rail-title" style={{ margin: '16px 0 24px' }}>
              Pieces people
              <br />
              <em className="italic">keep</em> for years.
            </h2>
            <p className="lede">Our most-loved designs this season, chosen by customers and the studio team alike.</p>
            <Link to="/shop" className="link" style={{ marginTop: 24 }}>
              View everything <Icon name="arrow" size={16} className="arrow" />
            </Link>
          </div>
          {items.map((p, n) => (
            <div className="rail-item" key={p.slug}>
              <span className="rail-index num">{String(n + 1).padStart(2, '0')}</span>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Spaces */
const SPACES = [
  {
    key: 'living',
    label: 'The living room',
    title: 'Sofas you will want to come home to.',
    text: 'Deep seats, performance velvets and sectionals sized for the whole family, plus a sofa-cum-bed for when they stay over.',
    image: '/images/scenes/living-rose.webp',
    products: ['riviera-sectional-sofa', 'sole-three-seater-sofa', 'lido-chaise-lounge'],
  },
  {
    key: 'home',
    label: 'The home office',
    title: 'A desk that belongs in the living room.',
    text: 'Warm finishes, softer seats and compact footprints for the corner of a bedroom or a sunlit nook.',
    image: '/images/scenes/room-gallery.webp',
    products: ['nido-task-chair', 'altezza-standing-desk', 'quaderno-study-table'],
  },
  {
    key: 'work',
    label: 'The executive office',
    title: 'Specified by the floor, chosen by the person.',
    text: 'Contract-grade chairs and desks with adjustments anyone can find in under a minute.',
    image: '/images/scenes/exec-luna.webp',
    products: ['luna-executive-chair', 'conte-executive-chair', 'aurelio-ergonomic-chair'],
  },
  {
    key: 'play',
    label: 'Study & play',
    title: 'For homework, long games and late nights.',
    text: 'Bold upholstery, deep cushioning and desks with room for two screens.',
    image: '/images/scenes/room-art.webp',
    products: ['volta-lounge-chair', 'ritmo-play-desk', 'banco-study-chair'],
  },
];

function Spaces() {
  const [i, setI] = useState(0);
  const s = SPACES[i];
  return (
    <section className="section spaces" aria-labelledby="spaces-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">(05) — Spaces</p>
            <h2 className="h2" id="spaces-title" style={{ marginTop: 16 }}>
              Furniture for <em className="italic">every</em> room you live in.
            </h2>
          </div>
          <div className="tabs" role="tablist" aria-label="Spaces">
            {SPACES.map((x, n) => (
              <button key={x.key} role="tab" id={`tab-${x.key}`} aria-selected={n === i} aria-controls="space-panel" className={n === i ? 'on' : ''} onClick={() => setI(n)}>
                {x.label}
              </button>
            ))}
          </div>
        </div>
        <div className="spaces-grid" id="space-panel" role="tabpanel" aria-labelledby={`tab-${s.key}`}>
          <div className="spaces-media">
            {SPACES.map((x, n) => (
              <img key={x.key} src={x.image} alt={n === i ? x.label : ''} className={n === i ? 'on' : ''} loading="lazy" />
            ))}
          </div>
          <div className="spaces-copy" key={s.key}>
            <h3 className="h3">{s.title}</h3>
            <p className="muted">{s.text}</p>
            <ul className="spaces-products">
              {s.products.map((slug) => {
                const p = getProduct(slug)!;
                return <SpaceProduct key={slug} p={p} />;
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpaceProduct({ p }: { p: Product }) {
  return (
    <li>
      <Link to={`/product/${p.slug}`}>
        <img src={p.variants[0].images[0]} alt="" loading="lazy" />
        <span>
          <strong>{p.title}</strong>
          <span className="muted small num">from {formatPrice(fromPrice(p))}</span>
        </span>
        <Icon name="arrow" size={16} />
      </Link>
    </li>
  );
}

/* ---------------------------------------------------------------- Numbers */
function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [ref, inView] = useReveal<HTMLSpanElement>(0.5);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) return setN(to);
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 1600);
      setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref} className="num">
      {n.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

function Numbers() {
  const [ref, progress] = useScrollProgress<HTMLElement>();
  const y = prefersReducedMotion() ? 0 : (progress - 0.5) * -80;
  return (
    <section className="numbers" ref={ref} aria-labelledby="num-title">
      <div className="wrap">
        <div className="numbers-head">
          <p className="eyebrow">(06) — Made to last</p>
          <h2 className="h2" id="num-title">
            Engineered in India,
            <br />
            tested like it <em className="italic">matters.</em>
          </h2>
        </div>
        <div className="numbers-grid">
          {STATS.map((s, n) => (
            <Reveal key={s.label} delay={n * 0.08} className="stat">
              <div className="stat-value">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <p>{s.label}</p>
            </Reveal>
          ))}
        </div>
        <div className="numbers-strip">
          {['detail-arm', 'detail-lumbar', 'detail-mesh'].map((d, n) => (
            <div key={d} className="numbers-strip-item" style={{ transform: `translate3d(0, ${y * (n === 1 ? -1 : 1)}px, 0)` }}>
              <img src={`/images/scenes/${d}.webp`} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Materials */
function Materials() {
  const [i, setI] = useState(0);
  return (
    <section className="section materials" aria-labelledby="mat-title">
      <div className="wrap materials-grid">
        <div>
          <p className="eyebrow">(07) — Materials</p>
          <h2 className="h2" id="mat-title" style={{ margin: '16px 0 32px' }}>
            Chosen for touch, <em className="italic">tested</em> for time.
          </h2>
          <ul className="mat-list">
            {MATERIALS.map((m, n) => (
              <li key={m.name}>
                <button className={n === i ? 'on' : ''} onMouseEnter={() => setI(n)} onFocus={() => setI(n)} onClick={() => setI(n)} aria-pressed={n === i}>
                  <span className="mat-name">{m.name}</span>
                  <span className="mat-text">{m.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mat-media">
          {MATERIALS.map((m, n) => (
            <img key={m.name} src={m.image} alt={n === i ? `${m.name} detail` : ''} className={n === i ? 'on' : ''} loading="lazy" />
          ))}
          <span className="mat-label">
            {String(i + 1).padStart(2, '0')} / {String(MATERIALS.length).padStart(2, '0')} — {MATERIALS[i].name}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Testimonials */
function Voices() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const t = setTimeout(() => setI((x) => (x + 1) % TESTIMONIALS.length), 7000);
    return () => clearTimeout(t);
  }, [i]);
  const t = TESTIMONIALS[i];
  return (
    <section className="section voices" aria-labelledby="voices-title">
      <div className="wrap">
        <p className="eyebrow" id="voices-title">
          (08) — In their words
        </p>
        <figure className="voice" key={i}>
          <blockquote className="h2">“{t.quote}”</blockquote>
          <figcaption>
            <strong>{t.name}</strong> · <span className="muted">{t.role}</span>
          </figcaption>
        </figure>
        <div className="voice-nav">
          <button className="icon-btn" aria-label="Previous testimonial" onClick={() => setI((i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}>
            <Icon name="arrowLeft" />
          </button>
          <span className="num small">
            {i + 1} / {TESTIMONIALS.length}
          </span>
          <button className="icon-btn" aria-label="Next testimonial" onClick={() => setI((i + 1) % TESTIMONIALS.length)}>
            <Icon name="arrow" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Trade */
function TradeBand() {
  return (
    <section className="trade-band" aria-labelledby="trade-title">
      <div className="trade-media">
        <Reveal variant="img">
          <img src="/images/scenes/workspace-floor.webp" alt="An open-plan office furnished with task chairs and benching desks" loading="lazy" />
        </Reveal>
      </div>
      <div className="trade-copy">
        <p className="eyebrow">(09) — For business</p>
        <h2 className="h2" id="trade-title" style={{ margin: '16px 0 24px' }}>
          From ten seats to <em className="italic">ten floors.</em>
        </h2>
        <p>Our trade team works with architects, designers and workplace leads across India: space planning, samples on site, trade pricing and installation by our own crews.</p>
        <ul className="trade-points">
          <li>Dedicated consultant and seat-by-seat specification</li>
          <li>Trial chairs delivered to your office</li>
          <li>GST invoicing and staged delivery across cities</li>
        </ul>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/trade" className="btn btn-light">
            Explore trade services
          </Link>
          <Link to="/trade#enquire" className="btn btn-outline-light">
            Request a quote
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Journal */
function Journal() {
  return (
    <section className="section" aria-labelledby="journal-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">(10) — Journal</p>
            <h2 className="h2" id="journal-title" style={{ marginTop: 16 }}>
              Notes on living <em className="italic">and</em> working well.
            </h2>
          </div>
          <Link to="/journal" className="link">
            All stories <Icon name="arrow" size={16} className="arrow" />
          </Link>
        </div>
        <div className="journal-grid">
          {ARTICLES.slice(0, 3).map((a, n) => (
            <Reveal key={a.slug} delay={n * 0.1} as="article" className="journal-card">
              <Link to={`/journal/${a.slug}`}>
                <div className="journal-media">
                  <img src={a.image} alt="" loading="lazy" />
                </div>
                <p className="eyebrow" style={{ margin: '18px 0 8px' }}>
                  {a.kicker} · {formatDate(a.date)}
                </p>
                <h3 className="h3">{a.title}</h3>
                <p className="muted" style={{ marginTop: 8 }}>
                  {a.excerpt}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Studio CTA */
function StudioCta() {
  return (
    <section className="studio-cta" aria-labelledby="studio-title">
      <img src="/images/scenes/living-teal.webp" alt="" loading="lazy" />
      <div className="studio-cta-shade" />
      <div className="wrap studio-cta-in">
        <p className="eyebrow">(11) — Visit</p>
        <h2 className="display" id="studio-title">
          Sit <em className="italic">before</em>
          <br />
          you decide.
        </h2>
        <p className="lede">Try every sofa, chair and desk at our studios in {STUDIOS.map((s) => s.city).join(', ').replace(/, ([^,]*)$/, ' and $1')}. Our consultants will help you find the right fit.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/contact#visit" className="btn btn-light">
            Book a studio visit
          </Link>
          <Link to="/contact#studios" className="btn btn-outline-light">
            Find a studio
          </Link>
        </div>
      </div>
    </section>
  );
}
