import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { fromPrice, getProduct } from '../data/catalogue';
import { cut, HERO_SLIDES, ratioOf, type HeroSlide } from '../data/heroSlides';
import { formatPrice } from '../lib/format';
import { prefersReducedMotion } from '../lib/hooks';
import '../styles/hero.css';

const FRAME_W = 1440;
const FRAME_H = 900;
const CAP_LINE = 403.5;
const WIPE_MS = 970;
const AUTOPLAY_MS = 2600;
const IDLE_MS = 6000;
/** parallax factors per layer: word, shadow, product, fruit, corner */
const FACTORS = [0.4, 0.3, 0.15, 0.55, 0.75];

// measured coverage curve of the panel wipe (t → c), smoothstep between points
const COVER: [number, number][] = [
  [0, 0], [0.031, 0.006], [0.134, 0.012], [0.206, 0.023], [0.278, 0.047], [0.34, 0.07], [0.412, 0.105], [0.485, 0.158],
  [0.546, 0.246], [0.583, 0.55], [0.62, 0.825], [0.69, 0.9], [0.79, 0.94], [0.85, 0.956], [0.93, 0.975], [1, 1],
];
function cover(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  for (let i = 1; i < COVER.length; i++) {
    const [t1, c1] = COVER[i];
    if (t <= t1) {
      const [t0, c0] = COVER[i - 1];
      const k = (t - t0) / (t1 - t0);
      return c0 + (c1 - c0) * (3 * k * k - 2 * k * k * k);
    }
  }
  return 1;
}
const easeOutQuad = (k: number) => 1 - (1 - k) * (1 - k);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** random but stable bob timings per piece */
const BOB = HERO_SLIDES.map((s) => s.pieces.map(() => ({ dur: 3.2 + Math.random() * 1.8, delay: -Math.random() * 4 })));

interface Metrics {
  u: number;
  frameW: number;
  visibleW: number;
}

export function FlavourHero() {
  const stageRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layerRefs = useRef<(HTMLDivElement | null)[][]>(HERO_SLIDES.map(() => []));
  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const metrics = useRef<Metrics>({ u: 1, frameW: FRAME_W, visibleW: FRAME_W });
  const current = useRef(0);
  const busy = useRef(false);
  const lastInteraction = useRef(-Infinity);
  const inView = useRef(true);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [underline, setUnderline] = useState({ x: 0, w: 0 });
  const reduced = useRef(prefersReducedMotion());

  /* ---------------- layout: unit, frame and word fitting ---------------- */
  const layout = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const mobile = W <= 820 || H > W;
    const u = mobile ? Math.min(W / 640, (H - 200) / 620) : Math.min(W / FRAME_W, H / FRAME_H);
    const fy = mobile ? 8 : -22 * u;
    stage.style.setProperty('--u', `${u}px`);
    stage.style.setProperty('--fx', `${W / 2 - (FRAME_W / 2) * u}px`);
    stage.style.setProperty('--fy', `${H / 2 - (FRAME_H / 2) * u + fy}px`);
    const visibleW = Math.min(FRAME_W, W / u);
    metrics.current = { u, frameW: FRAME_W * u, visibleW };
    setMobile(mobile);

    // word fitting with canvas measurement of the real font
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return;
    ctx.font = "700 100px 'Outfit Variable', Outfit, sans-serif";
    const capM = ctx.measureText('H');
    const capRatio = capM.actualBoundingBoxAscent / 100 || 0.7;
    const asc = (capM.fontBoundingBoxAscent ?? 100) / 100;
    const desc = (capM.fontBoundingBoxDescent ?? 26) / 100;
    const baseOffset = (1 - (asc + desc)) / 2 + asc; // baseline from top at line-height 1
    const target = Math.min(1400, visibleW * 0.92);
    HERO_SLIDES.forEach((s, i) => {
      const el = wordRefs.current[i];
      if (!el) return;
      const m = ctx.measureText(s.word);
      const ink100 = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      const n = s.word.length - 1;
      let ls = 0.005;
      let F = 445;
      if ((ink100 / 100 + ls * n) * F > target * 0.95) {
        ls = -0.035;
        F = Math.min(445, target / (ink100 / 100 + ls * n));
      }
      const baseline = CAP_LINE + (capRatio * F) / 2;
      el.style.fontSize = `calc(${F} * var(--u))`;
      el.style.letterSpacing = `${ls}em`;
      el.style.top = `calc(${baseline - baseOffset * F} * var(--u))`;
    });
  }, []);

  const placeUnderline = useCallback((i: number) => {
    const t = tabRefs.current[i];
    if (t) setUnderline({ x: t.offsetLeft, w: t.offsetWidth });
  }, []);

  useLayoutEffect(() => {
    layout();
    placeUnderline(0);
    const on = () => {
      layout();
      placeUnderline(current.current);
    };
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, [layout, placeUnderline]);

  /* ---------------- opening sequence ---------------- */
  useEffect(() => {
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      layout();
      placeUnderline(current.current);
      setReady(true);
      if (reduced.current) return;
      const fw = metrics.current.frameW;
      layerRefs.current[0].forEach((el, li) =>
        el?.animate([{ transform: `translate3d(${FACTORS[li] * fw}px,0,0)` }, { transform: 'translate3d(0,0,0)' }], {
          duration: 900,
          easing: 'cubic-bezier(0.22, 0.8, 0.3, 1)',
        }),
      );
    };
    document.fonts?.ready.then(reveal);
    const failsafe = setTimeout(reveal, 3000);
    return () => clearTimeout(failsafe);
  }, [layout, placeUnderline]);

  /* ---------------- the wipe transition ---------------- */
  const go = useCallback(
    (to: number, dir: 1 | -1) => {
      const from = current.current;
      if (busy.current || to === from) return;
      const A = slideRefs.current[from];
      const B = slideRefs.current[to];
      if (!A || !B) return;
      setActive(to);
      placeUnderline(to);

      if (reduced.current) {
        B.style.visibility = 'visible';
        B.style.zIndex = '2';
        A.style.visibility = 'hidden';
        A.style.zIndex = '0';
        current.current = to;
        return;
      }

      busy.current = true;
      const fw = metrics.current.frameW;
      const aLayers = layerRefs.current[from];
      const bLayers = layerRefs.current[to];
      B.style.visibility = 'visible';
      B.style.zIndex = '1';
      A.style.zIndex = '2';
      bLayers.forEach((el, li) => el && (el.style.transform = `translate3d(${dir * FACTORS[li] * fw}px,0,0)`));
      const start = performance.now();
      let aDone = false;

      const tick = (now: number) => {
        const t = (now - start) / WIPE_MS;
        if (!aDone) {
          const c = cover(t);
          A.style.clipPath = dir > 0 ? `inset(0 ${c * 100}% 0 0)` : `inset(0 0 0 ${c * 100}%)`;
          aLayers.forEach((el) => el && (el.style.transform = `translate3d(${-dir * c * 0.14 * fw}px,0,0)`));
          if (t >= 1) {
            aDone = true;
            A.style.visibility = 'hidden';
            A.style.zIndex = '0';
            A.style.clipPath = '';
            aLayers.forEach((el) => el && (el.style.transform = ''));
          }
        }
        const k = easeOutQuad(clamp01((t - 0.5) / 0.42));
        bLayers.forEach((el, li) => el && (el.style.transform = `translate3d(${dir * (1 - k) * FACTORS[li] * fw}px,0,0)`));
        if (aDone && k >= 1) {
          bLayers.forEach((el) => el && (el.style.transform = ''));
          B.style.zIndex = '2';
          current.current = to;
          busy.current = false;
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
    [placeUnderline],
  );

  const n = HERO_SLIDES.length;
  const next = useCallback(() => go((current.current + 1) % n, 1), [go, n]);
  const prev = useCallback(() => go((current.current - 1 + n) % n, -1), [go, n]);
  const user = (fn: () => void) => () => {
    lastInteraction.current = performance.now();
    fn();
  };

  /* ---------------- autoplay, keyboard, swipe ---------------- */
  useEffect(() => {
    const id = setInterval(() => {
      if (!ready || document.visibilityState !== 'visible' || !inView.current) return;
      if (performance.now() - lastInteraction.current < IDLE_MS) return;
      next();
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [next, ready]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { threshold: 0.35 });
    io.observe(stage);
    const onKey = (e: KeyboardEvent) => {
      if (!inView.current) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight') user(next)();
      if (e.key === 'ArrowLeft') user(prev)();
    };
    let sx = 0;
    let sy = 0;
    let tracking = false;
    const down = (e: PointerEvent) => {
      tracking = true;
      sx = e.clientX;
      sy = e.clientY;
    };
    const up = (e: PointerEvent) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) user(dx < 0 ? next : prev)();
    };
    window.addEventListener('keydown', onKey);
    stage.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      io.disconnect();
      window.removeEventListener('keydown', onKey);
      stage.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [next, prev]); // eslint-disable-line react-hooks/exhaustive-deps

  const slide = HERO_SLIDES[active];
  const product = getProduct(slide.productSlug);

  return (
    <section ref={stageRef} className={`fhero ${ready ? 'is-ready' : ''} ${reduced.current ? 'is-reduced' : ''}`} aria-roledescription="carousel" aria-label="Featured furniture">
      {HERO_SLIDES.map((s, si) => (
        <Slide
          key={s.key}
          s={s}
          si={si}
          first={si === 0}
          mobile={mobile}
          slideRef={(el) => (slideRefs.current[si] = el)}
          layerRef={(li, el) => (layerRefs.current[si][li] = el)}
          wordRef={(el) => (wordRefs.current[si] = el)}
          hidden={si !== active && !ready}
        />
      ))}

      <div className="fhero-ui">
        <div className="fhero-tabs fhero-rise" role="tablist" aria-label="Choose a collection" style={{ '--d': '330ms' } as CSSProperties}>
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.key}
              ref={(el) => (tabRefs.current[i] = el)}
              role="tab"
              aria-selected={i === active}
              aria-current={i === active ? 'true' : undefined}
              onClick={user(() => go(i, i > current.current ? 1 : -1))}
            >
              {s.tab}
            </button>
          ))}
          <span className="fhero-underline" style={{ width: underline.w, transform: `translateX(${underline.x}px)` }} />
        </div>

        <button className="fhero-arrow fhero-prev fhero-rise" aria-label="Previous collection" onClick={user(prev)} style={{ '--d': '490ms' } as CSSProperties}>
          <svg viewBox="0 0 28 28" aria-hidden="true">
            <path d="M24 14H4 M12 6l-8 8 8 8" />
          </svg>
        </button>

        <div className="fhero-cta fhero-rise" style={{ '--d': '570ms' } as CSSProperties}>
          <Link to={slide.shopHref} className="fhero-shop">
            Shop now
          </Link>
          {product && (
            <Link to={`/product/${product.slug}`} className="fhero-caption" aria-live="polite">
              {product.title}
              <span className="fhero-price"> · from {formatPrice(fromPrice(product))}</span>
            </Link>
          )}
        </div>

        <button className="fhero-arrow fhero-next fhero-rise" aria-label="Next collection" onClick={user(next)} style={{ '--d': '650ms' } as CSSProperties}>
          <svg viewBox="0 0 28 28" aria-hidden="true">
            <path d="M4 14h20 M16 6l8 8-8 8" />
          </svg>
        </button>
      </div>
    </section>
  );
}

function Slide({
  s,
  si,
  first,
  mobile,
  slideRef,
  layerRef,
  wordRef,
  hidden,
}: {
  s: HeroSlide;
  si: number;
  first: boolean;
  mobile: boolean;
  slideRef: (el: HTMLDivElement | null) => void;
  layerRef: (li: number, el: HTMLDivElement | null) => void;
  wordRef: (el: HTMLDivElement | null) => void;
  hidden: boolean;
}) {
  const pw = mobile ? Math.min(s.product.w, 600) : s.product.w;
  const ph = pw * ratioOf(s.product.img);
  const shadows = [
    { cx: s.product.cx, cy: s.product.bottom - 4, w: pw * (ratioOf(s.product.img) < 1 ? 0.92 : 0.86), h: 30 },
    ...s.pieces.filter((p) => p.shadow).map((p) => ({ cx: p.x + p.w / 2, cy: p.y + p.w * ratioOf(p.img) + 22, w: p.w * 0.95, h: 20 })),
  ];
  const loading = first ? 'eager' : 'lazy';

  return (
    <div
      ref={slideRef}
      className="fhero-slide"
      style={{ background: s.bg, visibility: first ? 'visible' : 'hidden', zIndex: first ? 2 : 0 } as CSSProperties}
      aria-hidden={hidden || undefined}
      role="group"
      aria-roledescription="slide"
      aria-label={`${si + 1} of ${HERO_SLIDES.length}: ${s.tab}`}
    >
      <div className="fhero-frame">
        <div className="fhero-layer" ref={(el) => layerRef(0, el)}>
          <div className="fhero-word" ref={wordRef} aria-hidden="true">
            {s.word}
          </div>
        </div>
        <div className="fhero-layer" ref={(el) => layerRef(1, el)} aria-hidden="true">
          {shadows.map((sh, i) => (
            <span key={i} className="fhero-shadow" style={box(sh.cx - sh.w / 2, sh.cy - sh.h / 2, sh.w, sh.h)} />
          ))}
        </div>
        <div className="fhero-layer" ref={(el) => layerRef(2, el)}>
          <img className="fhero-product" src={cut(s.product.img)} alt={s.product.alt} loading={loading} style={box(s.product.cx - pw / 2, s.product.bottom - ph, pw, ph)} />
        </div>
        {(['fruit', 'corner'] as const).map((layer, li) => (
          <div key={layer} className="fhero-layer" ref={(el) => layerRef(3 + li, el)} aria-hidden="true">
            {s.pieces.map((p, pi) =>
              p.layer !== layer ? null : (
                <div key={pi} className={`fhero-piece ${layer === 'corner' ? 'is-corner' : ''}`} style={{ ...box(p.x, p.y, p.w, p.w * ratioOf(p.img)), transform: p.mirror ? 'scaleX(-1)' : undefined }}>
                  <img
                    src={cut(p.img)}
                    alt=""
                    loading={loading}
                    style={{ '--r': `${p.rot ?? 0}deg`, animationDuration: `${BOB[si][pi].dur}s`, animationDelay: `${BOB[si][pi].delay}s` } as CSSProperties}
                  />
                </div>
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const box = (x: number, y: number, w: number, h: number): CSSProperties => ({
  left: `calc(${x} * var(--u))`,
  top: `calc(${y} * var(--u))`,
  width: `calc(${w} * var(--u))`,
  height: `calc(${h} * var(--u))`,
});
