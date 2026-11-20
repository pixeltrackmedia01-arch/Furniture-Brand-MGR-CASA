import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../data/site';
import { useStore } from '../lib/store';
import { Icon } from './Icon';

export function Footer() {
  const { notify } = useStore();
  const [email, setEmail] = useState('');
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <h4>The MGR CASA letter</h4>
            <p style={{ maxWidth: 360 }}>New designs, studio events and the occasional essay on living well with less. Once a month, never more.</p>
            <form
              className="newsletter"
              onSubmit={(e) => {
                e.preventDefault();
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return notify('Please enter a valid email address');
                setEmail('');
                notify('Thank you. You are on the list.');
              }}
            >
              <label htmlFor="nl-email" className="sr-only">
                Email address
              </label>
              <input id="nl-email" type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="icon-btn" aria-label="Subscribe">
                <Icon name="arrow" />
              </button>
            </form>
            <div className="socials">
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">
                <Icon name="instagram" size={18} />
              </a>
              <a href="https://pinterest.com" aria-label="Pinterest" target="_blank" rel="noreferrer">
                <Icon name="pinterest" size={18} />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer">
                <Icon name="linkedin" size={18} />
              </a>
              <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noreferrer">
                <Icon name="youtube" size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link to="/shop/seating">Seating</Link></li>
              <li><Link to="/shop/desks">Desks & tables</Link></li>
              <li><Link to="/shop/storage">Storage</Link></li>
              <li><Link to="/shop/accessories">Accessories</Link></li>
              <li><Link to="/collections/signature">Signature collection</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">Our story</Link></li>
              <li><Link to="/trade">Trade & business</Link></li>
              <li><Link to="/journal">Journal</Link></li>
              <li><Link to="/contact#studios">Studios</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Care</h4>
            <ul>
              <li><Link to="/info/delivery-and-assembly">Delivery & assembly</Link></li>
              <li><Link to="/info/returns">Returns</Link></li>
              <li><Link to="/info/warranty">Warranty</Link></li>
              <li><Link to="/info/care">Care guide</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4>Talk to us</h4>
            <ul>
              <li><a href={BRAND.phoneHref}>{BRAND.phone}</a></li>
              <li><a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>
              <li><a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp us</a></li>
              <li className="muted">{BRAND.hours}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-word" aria-hidden="true">MGR CASA</div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} MGR CASA. Designed in India. Prices include GST.</span>
        <span style={{ display: 'flex', gap: 20 }}>
          <Link to="/info/privacy">Privacy</Link>
          <Link to="/info/terms">Terms</Link>
        </span>
      </div>
    </footer>
  );
}
