import { EnquiryForm } from '../components/EnquiryForm';
import { Icon } from '../components/Icon';
import { BRAND, STUDIOS } from '../data/site';
import { useSeo } from '../lib/hooks';

export default function Contact() {
  useSeo('Studios & contact', 'Visit MGR CASA studios in Bengaluru, Mumbai and Gurugram, or contact our team by phone, WhatsApp or email.');
  return (
    <div>
      <section className="wrap page-head">
        <p className="eyebrow">Studios & contact</p>
        <h1 className="h1">
          Come and <em className="italic">sit</em> with us.
        </h1>
        <p className="lede">Every piece is on the floor at our studios. Drop in, or book a time with a consultant who can help you choose.</p>
        <div className="contact-quick">
          <a href={BRAND.phoneHref}>
            <Icon name="phone" /> <span><strong>Call</strong>{BRAND.phone}</span>
          </a>
          <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noreferrer">
            <Icon name="chat" /> <span><strong>WhatsApp</strong>Usually replies within an hour</span>
          </a>
          <a href={`mailto:${BRAND.email}`}>
            <Icon name="mail" /> <span><strong>Email</strong>{BRAND.email}</span>
          </a>
        </div>
      </section>

      <section className="wrap section-tight" id="studios">
        <div className="studios">
          {STUDIOS.map((s) => (
            <article key={s.name} className="studio">
              <div className="studio-media">
                <img src={s.image} alt={`${s.name}, ${s.city}`} loading="lazy" />
              </div>
              <p className="eyebrow" style={{ marginTop: 18 }}>
                {s.city}
              </p>
              <h2 className="h3" style={{ margin: '6px 0 10px' }}>
                {s.name}
              </h2>
              <p className="muted small">{s.address}</p>
              <p className="small">{s.hours}</p>
              <a className="text-link small" href={`https://maps.google.com/?q=${encodeURIComponent(s.address)}`} target="_blank" rel="noreferrer">
                Get directions
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper)' }} id="visit">
        <div className="wrap trade-form">
          <div>
            <p className="eyebrow">Book a visit or send a message</p>
            <h2 className="h2" style={{ margin: '16px 0 24px' }}>
              How can we help?
            </h2>
            <p className="lede">Tell us what you are looking for and which studio suits you. We will confirm a time, or answer your question, within one working day.</p>
            <p className="small muted">{BRAND.hours}</p>
          </div>
          <div className="form-card">
            <EnquiryForm kind="studio-visit" submitLabel="Send message" />
          </div>
        </div>
      </section>
    </div>
  );
}
