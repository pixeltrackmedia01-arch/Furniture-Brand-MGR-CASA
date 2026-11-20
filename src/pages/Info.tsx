import { Link, useParams } from 'react-router-dom';
import { Accordion } from '../components/Accordion';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { GENERAL_FAQ, INFO_PAGES } from '../data/site';
import { useSeo } from '../lib/hooks';
import NotFound from './NotFound';

const NAV = Object.entries(INFO_PAGES).map(([slug, p]) => ({ slug, title: p.title }));

export function Info() {
  const { slug = '' } = useParams();
  const page = INFO_PAGES[slug];
  useSeo(page?.title ?? 'Help', page?.intro);
  if (!page) return <NotFound />;
  return (
    <div className="wrap" style={{ paddingBottom: 96 }}>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Help' }, { label: page.title }]} />
      <div className="info-layout">
        <nav aria-label="Help topics" className="info-nav">
          {NAV.map((n) => (
            <Link key={n.slug} to={`/info/${n.slug}`} aria-current={n.slug === slug ? 'page' : undefined}>
              {n.title}
            </Link>
          ))}
          <Link to="/faq">FAQ</Link>
        </nav>
        <div className="info-body">
          <h1 className="h1">{page.title}</h1>
          <p className="lede" style={{ margin: '16px 0 40px' }}>
            {page.intro}
          </p>
          {page.sections.map((s) => (
            <section key={s.h}>
              <h2 className="h3">{s.h}</h2>
              <p>{s.p}</p>
            </section>
          ))}
          <p className="small muted" style={{ marginTop: 40 }}>
            Questions? <Link to="/contact" className="text-link">Contact our team</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  useSeo('Frequently asked questions');
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: GENERAL_FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return (
    <div className="wrap" style={{ paddingBottom: 96 }}>
      <script type="application/ld+json">{JSON.stringify(ld)}</script>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]} />
      <div className="info-layout">
        <nav aria-label="Help topics" className="info-nav">
          {NAV.map((n) => (
            <Link key={n.slug} to={`/info/${n.slug}`}>
              {n.title}
            </Link>
          ))}
          <Link to="/faq" aria-current="page">
            FAQ
          </Link>
        </nav>
        <div className="info-body">
          <h1 className="h1" style={{ marginBottom: 40 }}>
            Questions, answered.
          </h1>
          {GENERAL_FAQ.map((f, n) => (
            <Accordion key={f.q} title={f.q} open={n === 0}>
              <p>{f.a}</p>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
}
