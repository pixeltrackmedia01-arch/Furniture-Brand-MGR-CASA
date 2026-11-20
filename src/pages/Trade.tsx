import { Link } from 'react-router-dom';
import { EnquiryForm } from '../components/EnquiryForm';
import { Icon } from '../components/Icon';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { getProduct, type Product } from '../data/catalogue';
import { BRAND } from '../data/site';
import { useSeo } from '../lib/hooks';

const SERVICES = [
  { icon: 'grid', t: 'Space planning', p: 'Send a floor plan; we return a seat-by-seat layout and specification within 48 hours.' },
  { icon: 'pin', t: 'Samples on site', p: 'Trial chairs delivered to your office for a week so your team can sit before you sign.' },
  { icon: 'receipt', t: 'Trade pricing', p: 'Tiered pricing from 10 seats, GST invoicing and proforma billing for procurement teams.' },
  { icon: 'truck', t: 'Staged delivery', p: 'Coordinated delivery and installation across cities, floors and phases.' },
  { icon: 'tool', t: 'Installation', p: 'Assembled and placed by our own crews, packaging removed, ready for Monday.' },
  { icon: 'shield', t: 'Aftercare', p: 'Annual maintenance visits and a dedicated line for facilities teams.' },
] as const;

const SECTORS = ['Technology & IT', 'Co-working', 'Banking & finance', 'Education', 'Healthcare', 'Hospitality', 'Architecture & design', 'Government & PSU'];

export default function Trade() {
  useSeo('Trade & business', 'Office furniture for Indian workplaces: space planning, trade pricing from 10 seats, samples on site and installation by our own crews.');
  const picks = ['ponte-task-chair', 'spira-task-chair', 'forma-task-chair', 'altezza-standing-desk'].map(getProduct) as Product[];
  return (
    <div className="trade">
      <section className="trade-hero">
        <img src="/images/scenes/workspace-floor.webp" alt="An office floor furnished with task chairs and benching desks" />
        <div className="trade-hero-shade" />
        <div className="wrap trade-hero-in">
          <p className="eyebrow">MGR CASA for business</p>
          <h1 className="display">
            Workplaces people <em className="italic">want</em> to come back to.
          </h1>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 32 }}>
            <a href="#enquire" className="btn btn-light">
              Request a quote
            </a>
            <a href={BRAND.phoneHref} className="btn btn-outline-light">
              Call the trade desk
            </a>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2 className="h2">
            One partner, from plan to <em className="italic">last</em> chair.
          </h2>
          <p className="lede" style={{ maxWidth: '26em' }}>
            Architects, designers, facilities teams and founders work with a single consultant who sees the project through.
          </p>
        </div>
        <div className="services">
          {SERVICES.map((s, n) => (
            <Reveal key={s.t} delay={(n % 3) * 0.08} className="service">
              <Icon name={s.icon} size={26} />
              <h3 className="h3">{s.t}</h3>
              <p className="muted">{s.p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-tight" style={{ background: 'var(--paper)' }}>
        <div className="wrap">
          <p className="eyebrow" style={{ marginBottom: 20 }}>
            Sectors we furnish
          </p>
          <div className="sectors">
            {SECTORS.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2 className="h2">Most specified for workplaces</h2>
          <Link to="/collections/studio" className="link">
            The Studio collection <Icon name="arrow" size={16} className="arrow" />
          </Link>
        </div>
        <div className="grid-products">
          {picks.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="section trade-form-wrap" id="enquire">
        <div className="wrap trade-form">
          <div>
            <p className="eyebrow">Request a quote</p>
            <h2 className="h2" style={{ margin: '16px 0 24px' }}>
              Tell us about your space.
            </h2>
            <p className="lede">We reply within one working day with next steps, indicative pricing and, if useful, a time to visit your site.</p>
            <ol className="trade-steps">
              <li>
                <strong>Brief</strong> — a 20-minute call about headcount, cities and timing.
              </li>
              <li>
                <strong>Proposal</strong> — layout, specification and trade pricing.
              </li>
              <li>
                <strong>Samples</strong> — trial pieces at your office.
              </li>
              <li>
                <strong>Delivery</strong> — installed by our crews, on schedule.
              </li>
            </ol>
            <p className="small muted">
              Prefer email? Write to <a className="text-link" href={`mailto:${BRAND.tradeEmail}`}>{BRAND.tradeEmail}</a>
            </p>
          </div>
          <div className="form-card">
            <EnquiryForm kind="trade" trade submitLabel="Request a quote" />
          </div>
        </div>
      </section>
    </div>
  );
}
