/* All copy sourced from iceworld.tech/products/ice-prime-pro-anc-black-2nd-gen */

export const PRODUCT = {
  brand: 'ICE',
  name: 'Prime Pro ANC',
  edition: 'Black — 2nd Gen',
  price: 3299,
  compareAt: 4000,
  currency: 'Tk',
  rating: 5,
  reviewCount: 1,
  customers: '80,000+',
  warrantyMonths: 12,
  summary:
    'Wireless earbuds tuned for people who commute, call and play on the same pair. 80 hours of runtime, 45dB of active silence, and a 45ms gaming path.',
}

/* The scroll story. Each id maps 1:1 to a 3D scene beat in src/three/beats.js */
export const CHAPTERS = [
  { id: 'hero', side: 'none', rail: 'Prime Pro ANC', readout: 'STANDBY' },
  { id: 'unbox', side: 'left', rail: 'The case', readout: 'LID OPEN' },
  { id: 'battery', side: 'left', rail: '80 hours', readout: '80H / 7-8H' },
  { id: 'anc', side: 'left', rail: '45dB ANC', readout: '-45 dB' },
  { id: 'bass', side: 'left', rail: '13mm drivers', readout: '13 MM x2' },
  { id: 'water', side: 'left', rail: 'IPX5', readout: 'IPX5' },
  { id: 'app', side: 'left', rail: 'App control', readout: 'ORIGINAL SOUND' },
  { id: 'dual', side: 'left', rail: 'Dual device', readout: '2 LINKS' },
  { id: 'enc', side: 'right', rail: '4-mic ENC', readout: '4 MIC ARRAY' },
  { id: 'gaming', side: 'left', rail: 'Gaming mode', readout: '45 MS' },
  { id: 'specs', side: 'left', rail: 'Full spec', readout: 'BT 6.0' },
  { id: 'buy', side: 'left', rail: 'Order', readout: 'READY' },
]

export const HIGHLIGHTS = [
  { value: '80', unit: 'h', label: 'Total playback with the case' },
  { value: '45', unit: 'dB', label: 'Active noise cancellation' },
  { value: '13', unit: 'mm', label: 'Dual dynamic drivers' },
  { value: '45', unit: 'ms', label: 'Latency in gaming mode' },
]

export const SPECS = [
  {
    group: 'Sound',
    rows: [
      ['Drivers', '13mm dynamic, dual'],
      ['Tuning', 'ICE Signature Turbo Bass'],
      ['Codecs', 'SBC, AAC'],
      ['EQ modes', '3, switchable in app'],
    ],
  },
  {
    group: 'Battery',
    rows: [
      ['Buds alone', '7–8 hours'],
      ['With case', '80 hours total'],
      ['Fast charge', '10 min = 100 min playback'],
      ['Port', 'USB Type-C, charge indicator'],
    ],
  },
  {
    group: 'Silence',
    rows: [
      ['ANC depth', 'Up to 45dB'],
      ['Call noise', 'ENC across 4 mics'],
      ['Fit', 'Sealed ear isolation'],
      ['Assistant', 'AI voice assistant'],
    ],
  },
  {
    group: 'Connection',
    rows: [
      ['Bluetooth', '6.0'],
      ['Multipoint', 'Two devices at once'],
      ['Latency', '45ms in gaming mode'],
      ['Works with', 'iOS, Android, Windows, macOS'],
    ],
  },
  {
    group: 'Build',
    rows: [
      ['Water', 'IPX5 splash and sweat resistant'],
      ['Control', 'Touch surface on each stem'],
      ['Warranty', '12 months replacement'],
      ['Finish', 'Soft-touch black with orange tray'],
    ],
  },
]

export const BOX = [
  'Prime Pro ANC earbuds',
  'Charging case',
  'USB Type-C cable',
  'Ear tips, three sizes',
  'User manual',
]

export const FAQS = [
  {
    q: 'Is there an app?',
    a: 'Yes. Search for Original Sound on Google Play or the App Store. It handles EQ, ANC modes, gaming mode and touch controls.',
  },
  {
    q: 'What comes in the box?',
    a: 'The earbuds, the charging case, a USB Type-C cable, extra ear tips in different sizes, and the user manual.',
  },
  {
    q: 'Does it pair with an iPhone?',
    a: 'Yes. Every ICE earbud pairs with any phone, tablet or laptop that has Bluetooth.',
  },
  {
    q: 'How do I order?',
    a: 'Use Buy now and fill in your details at checkout. Cash on delivery is available. For help, call 01792-402234.',
  },
  {
    q: 'How do I claim the warranty?',
    a: 'Open the Service Center page and submit your details. The servicing team gets in touch from there.',
  },
]

export const REVIEW = {
  name: 'Khaled',
  stars: 5,
  text: 'Amazing color combination and features!!!',
}

export const CONTACT = {
  address: 'ICE Technology, Finlay Square, Nasirabad, Chattogram 4200, Bangladesh',
  email: 'info@iceworld.tech',
  phone: '+880 9647-064321',
  license: 'TRAD/CHTG/019582/2023',
}

export const NAV = [
  { label: 'Shop', href: '#buy' },
  { label: 'Service Center', href: '#faq' },
  { label: 'Our Story', href: '#specs' },
  { label: 'Contact', href: '#contact' },
]

export const FOOTER_LINKS = [
  {
    title: 'Company',
    items: ['About Us', 'Dealers', 'Corporate Orders', 'Influencers', 'Blogs', 'Join Our Team'],
  },
  {
    title: 'Shopping',
    items: [
      'Return and Refund Policy',
      'Terms & Conditions',
      'Privacy Policy',
      'Shipping & Delivery',
      'Warranty Policy',
    ],
  },
]
