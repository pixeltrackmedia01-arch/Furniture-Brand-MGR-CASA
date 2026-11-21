import { Link } from 'react-router-dom';
import { PRODUCTS, type Product } from '../data/catalogue';
import { cut } from '../data/heroSlides';
import { Icon } from './Icon';
import { Reveal } from './Reveal';

interface Tile {
  title: string;
  to: string;
  img: string;
  bg: string;
  match: (p: Product) => boolean;
  wide?: boolean;
}

const TILES: Tile[] = [
  { title: 'Sofas', to: '/shop/living?type=sofas', img: 'sole-sapphire', bg: '#DCE4EE', match: (p) => p.subcategory === 'sofas', wide: true },
  { title: 'Executive chairs', to: '/shop/seating?type=executive', img: 'luna-tan', bg: '#F1E2CF', match: (p) => p.subcategory === 'executive' },
  { title: 'Boss chairs', to: '/shop/seating?type=boss', img: 'regent-tan', bg: '#EADFD3', match: (p) => p.subcategory === 'boss' },
  { title: 'Office chairs', to: '/shop/seating?type=task', img: 'vetta-task', bg: '#E4E8DD', match: (p) => p.subcategory === 'task' },
  { title: 'Ergonomic mesh', to: '/shop/seating?material=Mesh', img: 'aurelio-grey', bg: '#DFE6D8', match: (p) => p.category === 'seating' && p.material.includes('Mesh') },
  { title: 'Sectionals', to: '/shop/living?type=sectionals', img: 'riviera-sapphire', bg: '#E2E7F0', match: (p) => p.subcategory === 'sectionals', wide: true },
  { title: 'Armchairs', to: '/shop/living?type=armchairs', img: 'sole-rose-armchair', bg: '#F5DEDC', match: (p) => p.subcategory === 'armchairs' },
  { title: 'Sofa-cum-beds', to: '/shop/living?type=sofa-beds', img: 'dormi-teal', bg: '#DDEAE6', match: (p) => p.subcategory === 'sofa-beds' },
  { title: 'Ottomans & kids', to: '/shop/living?type=ottomans', img: 'lino-turmeric-ottoman', bg: '#F4E6C8', match: (p) => p.subcategory === 'ottomans' },
  { title: 'Standing desks', to: '/shop/desks?type=height-adjustable', img: 'altezza-desk', bg: '#EFE7DA', match: (p) => p.subcategory === 'height-adjustable' },
  { title: 'Study & work tables', to: '/shop/desks?type=work-tables', img: 'quaderno-table', bg: '#EDE3D6', match: (p) => p.subcategory === 'work-tables' },
  { title: 'Storage', to: '/shop/storage', img: 'mensola-shelf', bg: '#E6E1DA', match: (p) => p.category === 'storage' },
];

export function CategoryGrid() {
  return (
    <section className="section cat-section" aria-labelledby="cat-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Shop by category</p>
            <h2 className="h2" id="cat-title" style={{ marginTop: 14 }}>
              Find your <em className="italic">piece.</em>
            </h2>
          </div>
          <Link to="/shop" className="link">
            Shop everything <Icon name="arrow" size={16} className="arrow" />
          </Link>
        </div>
        <ul className="cat-grid">
          {TILES.map((t, i) => {
            const count = PRODUCTS.filter(t.match).length;
            return (
              <Reveal as="li" key={t.title} delay={(i % 4) * 0.06}>
                <Link to={t.to} className={`cat-tile ${t.wide ? 'is-wide' : ''}`} style={{ background: t.bg }}>
                  <span className="cat-media">
                    <img src={cut(t.img)} alt="" loading="lazy" />
                  </span>
                  <span className="cat-meta">
                    <span className="cat-title">{t.title}</span>
                    <span className="cat-count">
                      {count} {count === 1 ? 'piece' : 'pieces'}
                      <Icon name="arrow" size={14} />
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
