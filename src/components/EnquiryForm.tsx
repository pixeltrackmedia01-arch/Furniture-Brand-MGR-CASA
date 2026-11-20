import { useState, type FormEvent } from 'react';
import { submitEnquiry, validate, type EnquiryItem, type EnquiryPayload, type EnquiryRecord } from '../lib/enquiry';
import { Icon } from './Icon';

type Kind = EnquiryPayload['kind'];

interface Props {
  kind: Kind;
  items?: EnquiryItem[];
  onDone?: (r: EnquiryRecord) => void;
  submitLabel?: string;
  trade?: boolean;
}

export function EnquiryForm({ kind, items, onDone, submitLabel = 'Send enquiry', trade = false }: Props) {
  const [data, setData] = useState<Partial<EnquiryPayload>>({
    buyerType: trade ? 'business' : 'home',
    contactPreference: 'whatsapp',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<EnquiryRecord | null>(null);
  const [consent, setConsent] = useState(true);
  const business = data.buyerType !== 'home';

  const set = (k: keyof EnquiryPayload) => (e: { target: { value: string } }) => {
    setData((d) => ({ ...d, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: '' }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const required: (keyof EnquiryPayload)[] = ['name', 'phone', 'email', 'city'];
    if (business && trade) required.push('company', 'seats');
    const errs = validate(data, required) as Record<string, string>;
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) {
      const first = Object.keys(errs)[0];
      document.getElementById(`f-${kind}-${first}`)?.focus();
      return;
    }
    setBusy(true);
    const rec = await submitEnquiry({ ...(data as EnquiryPayload), kind, items });
    setBusy(false);
    setDone(rec);
    onDone?.(rec);
  }

  if (done) {
    return (
      <div className="enq-done" role="status">
        <span className="enq-tick">
          <Icon name="check" size={28} />
        </span>
        <h3 className="h3">Thank you, {done.name.split(' ')[0]}.</h3>
        <p className="muted">
          Your enquiry <strong className="num">{done.reference}</strong> has reached our design team. Expect a{' '}
          {done.contactPreference === 'email' ? 'reply by email' : done.contactPreference === 'phone' ? 'call' : 'WhatsApp message'} within one working day.
        </p>
        <p className="small muted">Prototype note: enquiries are saved only in this browser.</p>
      </div>
    );
  }

  const F = ({ k, label, type = 'text', auto }: { k: keyof EnquiryPayload; label: string; type?: string; auto?: string }) => (
    <div className={`field ${errors[k] ? 'has-error' : ''}`}>
      <label htmlFor={`f-${kind}-${k}`}>{label}</label>
      <input
        id={`f-${kind}-${k}`}
        type={type}
        autoComplete={auto}
        value={(data[k] as string) ?? ''}
        onChange={set(k)}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `e-${kind}-${k}` : undefined}
      />
      {errors[k] && (
        <span className="field-error" id={`e-${kind}-${k}`}>
          {errors[k]}
        </span>
      )}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate>
      {!trade && (
        <fieldset className="field" style={{ border: 0, padding: 0, margin: '0 0 18px' }}>
          <legend className="label" style={{ marginBottom: 8 }}>
            I am buying for
          </legend>
          <div className="seg">
            {[
              ['home', 'My home'],
              ['business', 'A business'],
              ['designer', 'A client (designer)'],
            ].map(([v, l]) => (
              <label key={v}>
                <input type="radio" name={`buyer-${kind}`} value={v} checked={data.buyerType === v} onChange={set('buyerType')} />
                <span>{l}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {F({ k: 'name', label: 'Full name', auto: 'name' })}
      <div className="grid-2">
        {F({ k: 'phone', label: 'Mobile', type: 'tel', auto: 'tel' })}
        {F({ k: 'email', label: 'Email', type: 'email', auto: 'email' })}
      </div>
      <div className="grid-2">
        {F({ k: 'city', label: 'City', auto: 'address-level2' })}
        {F({ k: 'pincode', label: 'Pincode (optional)', auto: 'postal-code' })}
      </div>
      {business && (
        <>
          <div className="grid-2">
            {F({ k: 'company', label: trade ? 'Company' : 'Company (optional)', auto: 'organization' })}
            {F({ k: 'gstin', label: 'GSTIN (optional)' })}
          </div>
          {trade && (
            <div className="grid-2">
              <div className={`field ${errors.seats ? 'has-error' : ''}`}>
                <label htmlFor={`f-${kind}-seats`}>Number of seats</label>
                <select id={`f-${kind}-seats`} value={data.seats ?? ''} onChange={set('seats')} aria-invalid={!!errors.seats}>
                  <option value="">Select</option>
                  <option>10–25</option>
                  <option>26–100</option>
                  <option>101–500</option>
                  <option>500+</option>
                </select>
                {errors.seats && <span className="field-error">{errors.seats}</span>}
              </div>
              <div className="field">
                <label htmlFor={`f-${kind}-timeline`}>Timeline</label>
                <select id={`f-${kind}-timeline`} value={data.timeline ?? ''} onChange={set('timeline')}>
                  <option value="">Select</option>
                  <option>Within a month</option>
                  <option>1–3 months</option>
                  <option>3–6 months</option>
                  <option>Just exploring</option>
                </select>
              </div>
            </div>
          )}
        </>
      )}
      <div className="field">
        <label htmlFor={`f-${kind}-message`}>{trade ? 'Tell us about the project' : 'Anything we should know? (optional)'}</label>
        <textarea id={`f-${kind}-message`} value={data.message ?? ''} onChange={set('message')} placeholder={trade ? 'Cities, floor plans, preferred models…' : 'Delivery timing, colour questions, assembly…'} />
      </div>
      <fieldset className="field" style={{ border: 0, padding: 0, margin: '0 0 18px' }}>
        <legend className="label" style={{ marginBottom: 8 }}>
          Best way to reach you
        </legend>
        <div className="seg">
          {[
            ['whatsapp', 'WhatsApp'],
            ['phone', 'Call'],
            ['email', 'Email'],
          ].map(([v, l]) => (
            <label key={v}>
              <input type="radio" name={`pref-${kind}`} value={v} checked={data.contactPreference === v} onChange={set('contactPreference')} />
              <span>{l}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="check" style={{ marginBottom: 20 }}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>I agree to MGR CASA contacting me about this enquiry, as described in the privacy policy.</span>
      </label>
      <button className="btn btn-block" disabled={busy || !consent}>
        {busy ? 'Sending…' : submitLabel}
      </button>
    </form>
  );
}
