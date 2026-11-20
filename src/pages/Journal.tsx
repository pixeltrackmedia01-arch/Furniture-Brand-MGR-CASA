import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { PRODUCTS } from '../data/catalogue';
import { ARTICLES } from '../data/site';
import { formatDate } from '../lib/format';
import { useSeo } from '../lib/hooks';
import NotFound from './NotFound';

export function JournalIndex() {
  useSeo('Journal', 'Guides, craft notes and ideas for living and working well, from the MGR CASA studio.');
  const [lead, ...rest] = ARTICLES;
  return (
    <div className="wrap" style={{ paddingBottom: 96 }}>
      <header className="page-head">
        <p className="eyebrow">Journal</p>
        <h1 className="h1">
          Notes on living <em className="italic">and</em> working well.
        </h1>
      </header>
      <Link to={`/journal/${lead.slug}`} className="journal-lead">
        <div className="journal-media">
          <img src={lead.image} alt="" />
        </div>
        <div>
          <p className="eyebrow">
            {lead.kicker} · {formatDate(lead.date)} · {lead.readTime}
          </p>
          <h2 className="h2" style={{ margin: '14px 0' }}>
            {lead.title}
          </h2>
          <p className="lede">{lead.excerpt}</p>
          <span className="link" style={{ marginTop: 20 }}>
            Read the story
          </span>
        </div>
      </Link>
      <div className="journal-grid" style={{ marginTop: 64 }}>
        {rest.map((a, n) => (
          <Reveal key={a.slug} delay={n * 0.08} as="article" className="journal-card">
            <Link to={`/journal/${a.slug}`}>
              <div className="journal-media">
                <img src={a.image} alt="" loading="lazy" />
              </div>
              <p className="eyebrow" style={{ margin: '18px 0 8px' }}>
                {a.kicker} · {a.readTime}
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
  );
}

export function Article() {
  const { slug } = useParams();
  const a = ARTICLES.find((x) => x.slug === slug);
  useSeo(a?.title ?? 'Journal', a?.excerpt);
  if (!a) return <NotFound />;
  const picks = PRODUCTS.filter((p) => (a.kicker === 'Trade' ? p.line === 'Studio' : p.badges.includes('Bestseller'))).slice(0, 4);
  return (
    <article>
      <div className="wrap">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Journal', to: '/journal' }, { label: a.title }]} />
        <header className="article-head">
          <p className="eyebrow">
            {a.kicker} · {formatDate(a.date)} · {a.readTime}
          </p>
          <h1 className="h1" style={{ margin: '16px 0' }}>
            {a.title}
          </h1>
          <p className="lede">{a.excerpt}</p>
        </header>
      </div>
      <Reveal variant="img" className="article-hero">
        <img src={a.image} alt="" />
      </Reveal>
      <div className="wrap article-body">
        {a.body.map((b, n) => (
          <div key={n}>
            {b.h && <h2 className="h3">{b.h}</h2>}
            <p className={n === 0 ? 'article-first' : ''}>{b.p}</p>
          </div>
        ))}
      </div>
      <section className="wrap section-tight">
        <h2 className="h3" style={{ marginBottom: 24 }}>
          Pieces mentioned
        </h2>
        <div className="grid-products">
          {picks.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </article>
  );
}
