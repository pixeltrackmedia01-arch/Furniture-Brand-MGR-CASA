import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { formatPrice } from '../lib/format';
import { useSeo } from '../lib/hooks';
import { useStore } from '../lib/store';

export default function EnquiryList() {
  useSeo('Your enquiry list');
  const { list, updateQty, removeFromList, openEnquiry } = useStore();
  const total = list.reduce((s, x) => s + x.price * x.qty, 0);
  const seats = list.reduce((s, x) => s + x.qty, 0);

  return (
    <div className="wrap" style={{ paddingBottom: 96 }}>
      <header className="page-head">
        <p className="eyebrow">Enquiry list</p>
        <h1 className="h1">Your selection</h1>
        <p className="lede">Gather the pieces you are considering and send them together. We will confirm availability, delivery and a final quotation. No payment is taken online.</p>
      </header>
      {list.length === 0 ? (
        <div className="empty">
          <h2 className="h3">Your enquiry list is empty.</h2>
          <p className="muted">Add pieces from any product page to request a combined quotation.</p>
          <Link to="/shop" className="btn">
            Browse the collection
          </Link>
        </div>
      ) : (
        <div className="list-grid">
          <ul className="list-items">
            {list.map((i) => (
              <li key={i.variantId} className="list-item">
                <Link to={`/product/${i.productSlug}`}>
                  <img src={i.image} alt="" />
                </Link>
                <div>
                  <Link to={`/product/${i.productSlug}`} className="h4">
                    {i.title}
                  </Link>
                  <p className="small muted">{i.variantLabel}</p>
                  <div className="qty" role="group" aria-label={`Quantity for ${i.title}`}>
                    <button onClick={() => updateQty(i.variantId, i.qty - 1)} aria-label="Decrease">
                      <Icon name="minus" size={14} />
                    </button>
                    <input
                      value={i.qty}
                      inputMode="numeric"
                      aria-label="Quantity"
                      onChange={(e) => updateQty(i.variantId, Number(e.target.value.replace(/\D/g, '')) || 1)}
                    />
                    <button onClick={() => updateQty(i.variantId, i.qty + 1)} aria-label="Increase">
                      <Icon name="plus" size={14} />
                    </button>
                  </div>
                </div>
                <div className="list-item-end">
                  <span className="num">{formatPrice(i.price * i.qty)}</span>
                  <button className="text-link small" onClick={() => removeFromList(i.variantId)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <aside className="list-summary">
            <h2 className="h4">Summary</h2>
            <dl>
              <div>
                <dt>Items</dt>
                <dd className="num">{seats}</dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd>Free</dd>
              </div>
              <div className="total">
                <dt>Indicative total</dt>
                <dd className="num">{formatPrice(total)}</dd>
              </div>
            </dl>
            <p className="small muted">Inclusive of GST. Final pricing is confirmed in your quotation.</p>
            {seats >= 10 && (
              <p className="pdp-trade small">
                <strong>{seats} items qualifies for trade pricing.</strong> Mention your company in the form and we will apply it.
              </p>
            )}
            <button className="btn btn-clay btn-block" onClick={() => openEnquiry(list, 'list')}>
              Send enquiry
            </button>
            <Link to="/shop" className="btn btn-ghost btn-block" style={{ marginTop: 8 }}>
              Continue browsing
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
