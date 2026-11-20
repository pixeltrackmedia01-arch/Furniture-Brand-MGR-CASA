import { useEffect, useRef } from 'react';
import { BRAND } from '../data/site';
import { formatPrice } from '../lib/format';
import { useStore } from '../lib/store';
import { EnquiryForm } from './EnquiryForm';
import { Icon } from './Icon';

export function EnquiryModal() {
  const { enquiry, closeEnquiry, clearList } = useStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enquiry.open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    setTimeout(() => cardRef.current?.querySelector<HTMLElement>('input, button')?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeEnquiry();
      if (e.key === 'Tab' && cardRef.current) {
        const f = cardRef.current.querySelectorAll<HTMLElement>('a, button, input, select, textarea');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      lastFocus.current?.focus();
    };
  }, [enquiry.open, closeEnquiry]);

  if (!enquiry.open) return null;
  const items = enquiry.items;
  const total = items.reduce((s, x) => s + x.price * x.qty, 0);
  const waText = encodeURIComponent(`Hello MGR CASA, I'd like to know more about: ${items.map((i) => `${i.title} (${i.variantLabel}) × ${i.qty}`).join(', ')}`);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="enq-title">
      <div className="modal-scrim" onClick={closeEnquiry} />
      <div className="modal-card" ref={cardRef}>
        <button className="icon-btn modal-close" onClick={closeEnquiry} aria-label="Close">
          <Icon name="close" />
        </button>
        <aside className="modal-aside">
          <p className="eyebrow">Your enquiry</p>
          {items.map((i) => (
            <div className="mini-item" key={i.variantId}>
              <img src={i.image} alt="" />
              <div>
                <div className="h4">{i.title}</div>
                <div className="small muted">
                  {i.variantLabel} · Qty {i.qty}
                </div>
                <div className="small num">{formatPrice(i.price * i.qty)}</div>
              </div>
            </div>
          ))}
          {items.length > 1 && (
            <div className="small num" style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
              Indicative total <strong>{formatPrice(total)}</strong>
            </div>
          )}
          <div className="small muted" style={{ marginTop: 'auto' }}>
            <p>A design consultant will confirm stock, delivery dates and final pricing, usually within one working day.</p>
            <a className="text-link" href={`https://wa.me/${BRAND.whatsapp}?text=${waText}`} target="_blank" rel="noreferrer">
              Prefer WhatsApp? Message us directly
            </a>
          </div>
        </aside>
        <div className="modal-main">
          <h2 id="enq-title" className="h3" style={{ marginBottom: 6 }}>
            Enquire about {items.length === 1 ? items[0].title.split(' ')[0] : 'these pieces'}
          </h2>
          <p className="muted small" style={{ marginBottom: 24 }}>
            No payment now. We will come back with availability and a quotation.
          </p>
          <EnquiryForm
            kind={enquiry.kind}
            items={items}
            onDone={() => {
              if (enquiry.kind === 'list') clearList();
            }}
          />
        </div>
      </div>
    </div>
  );
}
