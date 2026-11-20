// Site-wide content. Placeholder business details are marked in README.md and must be
// confirmed by MGR CASA before launch.
export const BRAND = {
  name: 'MGR CASA',
  tagline: 'Contemporary furniture, designed in India.',
  phone: '+91 80 4000 0000',
  phoneHref: 'tel:+918040000000',
  whatsapp: '918040000000',
  email: 'hello@mgrcasa.in',
  tradeEmail: 'trade@mgrcasa.in',
  hours: 'Mon–Sat, 10:00–19:00 IST',
  gstNote: 'Prices include GST',
};

export const STUDIOS = [
  {
    city: 'Bengaluru',
    name: 'Indiranagar Studio',
    address: '12, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
    hours: 'Tue–Sun, 11:00–20:00',
    image: '/images/scenes/room-orange.webp',
  },
  {
    city: 'Mumbai',
    name: 'Lower Parel Studio',
    address: 'Unit 4, Mill Compound, Senapati Bapat Marg, Lower Parel, Mumbai 400013',
    hours: 'Tue–Sun, 11:00–20:00',
    image: '/images/scenes/room-art.webp',
  },
  {
    city: 'Gurugram',
    name: 'Trade Experience Centre',
    address: 'Tower B, Golf Course Road, Sector 54, Gurugram 122002',
    hours: 'Mon–Sat, 10:00–18:30 · by appointment',
    image: '/images/scenes/workspace-floor.webp',
  },
];

export const ASSURANCES = [
  { title: 'Free delivery', text: 'To 40+ cities, in 3–7 working days' },
  { title: 'Up to 5-year warranty', text: 'On frames and mechanisms' },
  { title: 'Assembly on request', text: 'By our own team in metro cities' },
  { title: 'GST invoice', text: 'For business and trade purchases' },
];

export const STATS = [
  { value: 5, suffix: '-yr', label: 'warranty on every chair mechanism' },
  { value: 40, suffix: '+', label: 'cities with free white-glove delivery' },
  { value: 1200, suffix: '+', label: 'workplaces furnished across India' },
  { value: 27, suffix: '', label: 'designs, each tested for 120,000 cycles' },
];

export const TESTIMONIALS = [
  {
    quote: 'We furnished three floors with Ponte and Spira. Eighteen months in, not one mechanism complaint from 420 people. That is the review.',
    name: 'Ananya Rao',
    role: 'Head of Workplace, fintech firm, Bengaluru',
  },
  {
    quote: 'I tried the Vetta at the Indiranagar studio for twenty minutes and ordered it before I stood up. My back noticed within a week.',
    name: 'Karthik Menon',
    role: 'Architect, home studio',
  },
  {
    quote: 'The trade team turned a floor plan into a seat-by-seat specification in two days, with samples on site the following week.',
    name: 'Rhea Kapoor',
    role: 'Interior designer, Mumbai',
  },
];

export const MATERIALS = [
  { name: 'Woven mesh', image: '/images/scenes/detail-mesh.webp', text: 'An elastomeric weave that lets air move through the back, so long afternoons stay cool.' },
  { name: 'Textured fabric', image: '/images/scenes/detail-fabric.webp', text: 'Hard-wearing upholstery with a soft hand, tested to 100,000 rub cycles.' },
  { name: 'Cast frames', image: '/images/scenes/detail-frame.webp', text: 'Glass-filled nylon and die-cast aluminium shaped to flex where your body moves.' },
  { name: 'Moulded foam', image: '/images/scenes/detail-seat.webp', text: 'High-resilience foam that recovers its shape after years of daily sitting.' },
  { name: 'Laminate & steel', image: '/images/scenes/detail-desk.webp', text: 'Edge-banded tops on powder-coated steel, quiet and level on uneven floors.' },
];

export const HOTSPOTS = [
  { x: 50, y: 9, title: 'Contoured headrest', text: 'Height and angle adjust to cradle the neck when you lean back.' },
  { x: 54, y: 33, title: 'Calibrated back', text: 'Two independent panels support each side of the spine.' },
  { x: 24, y: 47, title: '3D armrests', text: 'Up, down, forward and inward, so shoulders can relax.' },
  { x: 58, y: 57, title: 'Sliding seat', text: 'Moves 50 mm forward to support the full length of the thigh.' },
  { x: 47, y: 69, title: 'Multi-lock tilt', text: 'Locks at five angles; tension tuned by a dial.' },
  { x: 70, y: 90, title: 'Aluminium base', text: 'Die-cast and polished, on 65 mm silent castors.' },
];

export interface Article {
  slug: string;
  title: string;
  kicker: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  body: { h?: string; p: string }[];
}

export const ARTICLES: Article[] = [
  {
    slug: 'setting-up-a-home-office-that-works',
    title: 'Setting up a home office that actually works',
    kicker: 'Guide',
    excerpt: 'Five measurements that matter more than the desk you choose.',
    image: '/images/scenes/room-rug.webp',
    date: '2026-10-28',
    readTime: '6 min read',
    body: [
      { p: 'Most home offices begin as a corner and a laptop. The difference between a corner that tires you and one that sustains you comes down to a handful of measurements, almost none of which depend on how much you spend.' },
      { h: 'Start with the chair, not the desk', p: 'Set the seat so your feet rest flat and your thighs are roughly level. Then bring the desk to you: the work surface should sit just below your elbows when your shoulders are relaxed.' },
      { h: 'Put the screen at eye level', p: 'The top of the screen should sit at or slightly below eye height, about an arm’s length away. A raised shelf or a stack of books does the job as well as an arm.' },
      { h: 'Light from the side', p: 'Place the desk so daylight falls across it rather than behind the screen or directly in your eyes. In Indian homes with strong afternoon sun, a sheer curtain is worth more than any lamp.' },
      { h: 'Move every half hour', p: 'No chair is good enough to sit in without moving. A sit-stand desk helps, but so does a phone call taken standing, or a glass of water fetched from the kitchen.' },
    ],
  },
  {
    slug: 'how-we-test-a-chair',
    title: 'How we test a chair before it carries our name',
    kicker: 'Craft',
    excerpt: '120,000 cycles, 40 °C humidity rooms and a lot of sitting.',
    image: '/images/scenes/detail-frame.webp',
    date: '2026-09-14',
    readTime: '4 min read',
    body: [
      { p: 'Every MGR CASA chair goes through the same gauntlet before it reaches a studio floor. Some of it is automated; a surprising amount of it is people sitting, for a long time, and telling us what they notice.' },
      { h: 'Cycle testing', p: 'Seats are loaded and released 120,000 times; backs are reclined and returned 120,000 times. That is roughly ten years of an ordinary working life.' },
      { h: 'Climate', p: 'Mesh and foam are conditioned at 40 °C and high humidity, because a chair that behaves in a temperate lab may sag in a Chennai summer.' },
      { h: 'Long sits', p: 'Finally, a panel of colleagues of different heights and builds uses each prototype for a full working fortnight. Their notes shape the final tension, foam density and arm travel.' },
    ],
  },
  {
    slug: 'sit-stand-desks-explained',
    title: 'Sit-stand desks, explained without the hype',
    kicker: 'Guide',
    excerpt: 'What a height-adjustable desk can and cannot do for you.',
    image: '/images/scenes/room-velvet.webp',
    date: '2026-08-02',
    readTime: '5 min read',
    body: [
      { p: 'A standing desk will not undo a sedentary day on its own. What it does well is make movement the default: a small change in posture, many times a day.' },
      { h: 'Gas lift or motor?', p: 'Gas-lift desks are quiet, need no power and suit lighter set-ups. Motorised desks carry heavier loads and multiple monitors. Both are worth having if you will actually use them.' },
      { h: 'How long to stand', p: 'Begin with ten to fifteen minutes in each hour and build gradually. Comfortable shoes and an anti-fatigue mat help more than people expect.' },
    ],
  },
  {
    slug: 'furnishing-a-workplace-for-hybrid-teams',
    title: 'Furnishing a workplace for hybrid teams',
    kicker: 'Trade',
    excerpt: 'Fewer desks, better chairs, and more places to meet.',
    image: '/images/scenes/workspace-floor.webp',
    date: '2026-07-11',
    readTime: '7 min read',
    body: [
      { p: 'Hybrid offices are used differently. Fewer people sit at a fixed desk all week, and more come in to meet, collaborate and focus for a day at a time.' },
      { h: 'Specify for the range of bodies', p: 'Shared desks mean shared chairs. Choose a chair whose adjustments are easy to find, so each person can make it theirs in under a minute.' },
      { h: 'Plan zones, not rows', p: 'Combine focus desks, touchdown tables and soft seating. Our trade team can model a floor and suggest the right mix for your headcount and attendance pattern.' },
    ],
  },
];

export const INFO_PAGES: Record<string, { title: string; intro: string; sections: { h: string; p: string }[] }> = {
  'delivery-and-assembly': {
    title: 'Delivery & assembly',
    intro: 'Free delivery across 40+ Indian cities, with optional assembly by our own team.',
    sections: [
      { h: 'Where we deliver', p: 'We deliver free of charge to Bengaluru, Mumbai, Delhi NCR, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad and over thirty further cities. For other pincodes, enter yours on any product page for an estimate.' },
      { h: 'How long it takes', p: 'Chairs ship within 3–5 working days; desks and storage within 5–7. Trade orders follow the schedule agreed in your quotation.' },
      { h: 'Assembly', p: 'Chairs arrive largely assembled. Desks and storage ship flat-packed with every tool required. Complimentary assembly is available in metro cities: request it in your enquiry.' },
    ],
  },
  returns: {
    title: 'Returns & cancellations',
    intro: 'If something is not right, we will make it right.',
    sections: [
      { h: 'Cancellations', p: 'Orders can be cancelled free of charge within 24 hours of confirmation.' },
      { h: 'Damage in transit', p: 'Please report visible damage within 48 hours of delivery with photographs. We will replace the affected part or product at no cost.' },
      { h: 'Change of mind', p: 'Unused products in original packaging can be returned within 10 days. A collection fee applies; refunds are processed within 10 working days of collection.' },
    ],
  },
  warranty: {
    title: 'Warranty',
    intro: 'We design for decades and back it in writing.',
    sections: [
      { h: 'Chairs', p: 'Five years on frames and tilt mechanisms, three years on gas lifts and castors, one year on mesh and upholstery.' },
      { h: 'Desks & storage', p: 'Three years on frames and lift mechanisms, one to two years on tops and boards.' },
      { h: 'Making a claim', p: 'Write to us with your order reference and a photograph. Most claims are resolved with a replacement part shipped within a week.' },
    ],
  },
  care: {
    title: 'Care guide',
    intro: 'A few minutes a month keeps every piece looking and working its best.',
    sections: [
      { h: 'Mesh and fabric', p: 'Vacuum with a soft brush attachment. Spot-clean with a damp cloth and mild soap; avoid bleach and solvents.' },
      { h: 'Frames and bases', p: 'Wipe with a dry microfibre cloth. Check castors every few months and remove any hair or thread.' },
      { h: 'Laminate tops', p: 'Wipe spills promptly. Use a coaster under hot cups and avoid abrasive cleaners.' },
    ],
  },
  privacy: {
    title: 'Privacy policy',
    intro: 'This prototype stores enquiries only in your own browser.',
    sections: [
      { h: 'What we collect', p: 'When you send an enquiry we collect your name, contact details and the products you are interested in, solely to respond to you.' },
      { h: 'How we use it', p: 'We use your details to reply, prepare quotations and arrange delivery. We do not sell personal data.' },
      { h: 'Your choices', p: 'You may ask us to access, correct or delete your data at any time by writing to hello@mgrcasa.in.' },
    ],
  },
  terms: {
    title: 'Terms of use',
    intro: 'The conditions that apply when you use this website.',
    sections: [
      { h: 'Prices', p: 'All prices are in Indian Rupees and include GST. Prices and availability may change without notice until an order is confirmed.' },
      { h: 'Product information', p: 'We make every effort to show products accurately. Colours may vary slightly between screens and production batches.' },
      { h: 'Governing law', p: 'These terms are governed by the laws of India, and disputes are subject to the courts of Bengaluru.' },
    ],
  },
};

export const GENERAL_FAQ = [
  { q: 'Can I try a piece before buying?', a: 'Yes. Visit our Bengaluru or Mumbai studio, or book an appointment at the Gurugram Trade Experience Centre. For orders of ten seats or more we can arrange samples at your office.' },
  { q: 'How do I place an order?', a: 'Add pieces to your enquiry list and send it to us, or use the “Enquire” button on any product. A design consultant will confirm availability, delivery and a final quotation, usually within one working day.' },
  { q: 'Do you offer trade or bulk pricing?', a: 'Yes. Architects, designers and businesses furnishing ten or more seats receive trade pricing, a dedicated consultant and planning support.' },
  { q: 'Which payment methods do you accept?', a: 'UPI, credit and debit cards, net banking and bank transfer. Businesses can pay against a proforma invoice with GST.' },
  { q: 'Do you deliver outside India?', a: 'Not yet. We currently deliver to addresses within India only.' },
];
