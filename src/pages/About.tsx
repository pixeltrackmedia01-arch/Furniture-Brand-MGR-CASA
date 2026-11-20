import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { STATS } from '../data/site';
import { useSeo } from '../lib/hooks';

const VALUES = [
  { n: '01', t: 'Support first', p: 'Every design begins with the body: how it sits, leans, reaches and rests. Form follows, never the other way round.' },
  { n: '02', t: 'Made for India', p: 'Mesh that breathes through a Chennai summer, frames that stay level on uneven floors, sizes that fit real Indian homes.' },
  { n: '03', t: 'Fewer, better', p: 'A focused collection of pieces we would use ourselves, rather than a catalogue of thousands.' },
  { n: '04', t: 'Promise in writing', p: 'Up to five years of warranty, and a team that answers the phone when something needs attention.' },
];

const PROCESS = [
  { t: 'Sketch', p: 'Our Bengaluru studio draws and models each piece around Indian anthropometric data.' },
  { t: 'Prototype', p: 'Working prototypes are built and refined over months of daily use by the team.' },
  { t: 'Test', p: 'Seats, backs and mechanisms are cycle-tested to 120,000 movements and climate-conditioned.' },
  { t: 'Make', p: 'Production partners in Karnataka and Maharashtra build to our specifications under our own QC.' },
  { t: 'Deliver', p: 'Our own logistics and assembly crews deliver to more than 40 cities.' },
];

export default function About() {
  useSeo('Our story', 'MGR CASA designs contemporary furniture in India for the long, ordinary hours of life and work.');
  return (
    <div className="about">
      <section className="wrap page-head">
        <p className="eyebrow">Our story</p>
        <h1 className="display" style={{ marginTop: 16, maxWidth: '10em' }}>
          Quiet furniture for <em className="italic">busy</em> lives.
        </h1>
      </section>
      <Reveal variant="img" className="about-hero">
        <img src="/images/scenes/hero-linen.webp" alt="A calm home office with an MGR CASA chair and desk" />
      </Reveal>
      <section className="wrap section about-intro">
        <p className="eyebrow">Since the beginning</p>
        <div>
          <p className="h3" style={{ lineHeight: 1.25 }}>
            MGR CASA began with a simple frustration: furniture in India was either beautiful or comfortable, rarely both, and almost never designed for the way we actually live and work here.
          </p>
          <p className="lede" style={{ marginTop: 24 }}>
            We set out to change that with a small, considered collection of seating, desks and storage, drawn in our own studio, tested relentlessly and made with partners who share our standards. Today our pieces furnish homes, studios and workplaces from Kochi to Chandigarh.
          </p>
        </div>
      </section>
      <section className="section-tight" style={{ background: 'var(--paper)' }}>
        <div className="wrap">
          <h2 className="h2" style={{ marginBottom: 48 }}>What we believe</h2>
          <div className="values">
            {VALUES.map((v, n) => (
              <Reveal key={v.n} delay={n * 0.08} className="value">
                <span className="num muted">{v.n}</span>
                <h3 className="h3">{v.t}</h3>
                <p className="muted">{v.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="wrap section">
        <div className="section-head">
          <h2 className="h2">
            From sketch to <em className="italic">your</em> room.
          </h2>
        </div>
        <ol className="process">
          {PROCESS.map((s, n) => (
            <Reveal as="li" key={s.t} delay={n * 0.08}>
              <span className="num">0{n + 1}</span>
              <h3 className="h3">{s.t}</h3>
              <p className="muted">{s.p}</p>
            </Reveal>
          ))}
        </ol>
      </section>
      <section className="about-split">
        <img src="/images/scenes/detail-frame.webp" alt="Close-up of a chair frame and mesh" loading="lazy" />
        <div>
          <div className="stats-mini">
            {STATS.map((s) => (
              <div key={s.label}>
                <strong className="num">
                  {s.value.toLocaleString('en-IN')}
                  {s.suffix}
                </strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 40 }}>
            <Link to="/shop" className="btn btn-light">
              Explore the collection
            </Link>
            <Link to="/contact#studios" className="btn btn-outline-light">
              Visit a studio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
