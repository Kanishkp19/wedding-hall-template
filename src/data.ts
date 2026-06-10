import { VenueItem, GalleryItem, TestimonialItem, PackageItem, BookingData } from './types';

export const HERO_BG_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxuW0drrXdwDTkC6x7f_2zpMaSvyzLajtFcqWR61pCopM3JHx6iVDNef4s9m_230V84-ovx5nHz10TKjt7lD05k6kfjkFIivT9ZKrxnpgRZXVp35om6HrNqsYJ-7D0GT3BpvLYLB7GxPYsNnIUW69hPihOuwTdvuHaQGYzmQrdog5B7Gf78s7eV7m-3RdUxFNDlrJpocFp3vq7u7XuKCkkZrD0IxtfD8rVgX9NghXMzhQS22xVSbtzLmEQR9rbLszdY5veAaGYbfk';

export const ABOUT_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZvHSbJU3zjlTHR_c0U01WkOG14KCN8Oq-bbU3sWFF2rGLpbslIbgkpFuBpSGMP6bKMX4g0p1iJCTpWJkMaONe5BXObcicPdNlbkO4hxyLBVN_kLwrMrn6jeJ2y6fppUsAJ6hsU-7suPA0hVKKiEv4lUEOrzMdGxpPFlmXOpjlrDkwFkUA8oroci2ermdULr6gBX7BzqySO9pPTEP3Ckx4u9T5UGgZfkDHwWNbTkggoxdEJs11WSx1xF5scqIb8y6ThA3zD-XDKkU';

export const MAP_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdqvSdyAxWxOiQcX_tPAZPbiMzC1Or4vCcHvkxH_w7c1uBbYO7CP91K9q4D5-rLjfBV94VnJ_r0TPxcu9nw5rBwMvuqMWxoV2nT5Q0MOBoP_6ARLU6Qcsb_M4wkFCo3rlxlNquf4iK0QStLeW4Co23bP7GPSUaAbOM-JaSVVhm1C9OELlK8_fRsuF6zM5Z7OVi4BSN0jKrqyEZ6tX-iKL27ighYl8fj4C6NHS2HfmKqQxjN58ReeScCjuwUPgbAglG29_MJDSxfFQ';

export const VENUES: VenueItem[] = [
  {
    id: 'venue-1',
    name: 'Sabha Niwas Durbar',
    type: 'INDOOR',
    capacity: '500 Guests',
    description: 'A magnificent historic audience chamber featuring original 19th-century gilded arches, pure Belgian crystal chandeliers, hand-ground lapis lazuli wall frescoes, and ceremonial viewing balconies.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQAzuydyXcl49fbi62bUATRa91lqBz3JmAKYFxy2j02Hg6VfaUdqpoE9U_2Fjhjo3yqA8nU6tlauJs7DgrCGsBuVGEq5cnZ_qPmBPJ2K-QahWUDXctDestpC-ERpfxlAdtiUbDa0HtpC0gqFspsnMvOqkVRGsiILORZUUavIzQEFSUSlcHVDRu6Vp0B3cl6cfGLeI4eSKY7f0BDtVHO_VMl2jFjvDXgMMohqjCY78T62UghdKXjndt6YLekzHQD_x_vE9hUZHJGkI',
    status: 'Available'
  },
  {
    id: 'venue-2',
    name: 'The Zenana Kund & Pavilions',
    type: 'OUTDOOR',
    capacity: '300 Guests',
    description: 'An elegant open-air courtyard surrounding a historic, beautifully lit stepwell pool, with scalloped white marble jali screens and stunning midnight reflections of Lake Pichola.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBj1kW00DXp9Y3YEsg24jSU0ulFDO7OYMgV0PP_7oO38tUevoKfYOfv8UPS15VJgMzTzU0tlQILOiWbUpDu3XkD5mk2mTyEzrBBNitzsp1tb_oMKknV2Of_-RHBPJ-Evq_2M8bgqhREPgNDz0Oo1ooYn5gCWoOJyfbaEMfKwLIzDQlJBC0JnX3ERcJRFvRnN95LZX462GA-VnWDcxSRugBOapfVoRA8i1Cg9OpCWwQ5TDU9UunJGfVLOrgzj6kKkIBhZ3l4Tabkh9I',
    status: 'Booked'
  },
  {
    id: 'venue-3',
    name: 'The Badi Mahal Bagh',
    type: 'GARDEN',
    capacity: '1000+ Guests',
    description: 'A sprawling, three-tiered manicured lawn enclosed by ancient Mewari stone fort walls, featuring white marble waterfalls, age-old frangipani canopies, and vintage stone pathways.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBMFXwFY6Z0LRCfm1wOiLVUj0aXyi11EiHgrxsHrk19Z8Z3HRpLnxWWJB3lRWxWQU4ZfyPIDtWidBHYSFi3GBbf5-s5sSfUQxWVARAxAyhq3gFgLg_M6-lKDO3s5LZc4aI_7Lzse8G9PbOD6TS4t-4Y2bnlWw00U7VOMTTJR7VBtzeeU40Vq4QDYrNfCGsx6BVkVLGpirIGBO-qdL154-q8lvTusP6254dRDizzDCFU5tizFIhvpy89G-SZ7-LSHPm7NulKglDlO0',
    status: 'Available'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gallery-1',
    alt: 'Opulent Stone Carvings & Gold Inlays',
    category: 'INDOOR',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYwBo3xFZAQ5Yh4PMYlSz1hh3ysDKHpDjvGdrisJW3ClDFjIjw23gWnlUgesR06HL1Y9Z0F680WV4ZRRkGSwRImDbGVw-hc9MSc_QWeLZArWB1rY7S9H2aIoqtFL9FK2oKKRedpTcLmZGnWWitD7zyXE_PXLYw1s63yHhMGtL6Syl3xcy5VYB_Ohp7yj6-0-6zcf0mhN0EOez3JaaYeKqXFyV574quJZ7-8OHp0muWzJpYecjIrDJB6Fw0tSch9rFwGODdhylVwHI'
  },
  {
    id: 'gallery-2',
    alt: 'Mansion Facade & Calm Mirror Reflection at Twilight',
    category: 'GARDEN',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUe2SOcwHwiXo59Miv_Q9mTkSSTML4pZOmew9W087NURWoRdO2d8CJqGQ3JVVVrK9b0oTbyiSwR8f2c_RLSwN6Ij8KMbOwkoBD3y1imlgG0zwxvR7ybyX9kRrUxFZ9YJSgolo5OBLSXuLMAwx6JSUqIvCJ3py7ehcEdSWgXgQG4VhV_7XTp-YoSFIHiWD8PVSEt65mqI8HBBAm_KMRWdDy31L1ht6xhmHnbcnyZbkZViwKpMDY8obTJDFY1ZrIh0PXGyhD3KotV2o'
  },
  {
    id: 'gallery-3',
    alt: 'Elegant Table Setup with Deep Crimson Roses',
    category: 'STAGE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq-dsSFTMYz5dDMn5v2Usrjo-aDDZSqTsyG29bM4PBJJ68-q9vmFHT-zxWAr5-xQLaoIlW2Q945yp3nKbEPntsUTQUW8hrE327BH9UVcSh8vki7tq07-BbRflL92kf4au5QeHp02mLWQDhM4HlK44dkXsG08FkZuGACmqF4WZdv6MNwlucdxZE1-Nti6cwdQ9MC14QyO2aoLMqAkmIeP0AK3juVHxJm6YCcMD3oOAsX77ch9jfjA6315-g8bCkM_UUObrInJiLmwc'
  },
  {
    id: 'gallery-4',
    alt: 'Symmetrical Sandstone Archways Palace Corridor',
    category: 'INDOOR',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiCnrV7mj5ZEKb-XVOTRO8TE6Dldu_M8L1IRKghUl1wwv3WtFHpSviOloz1dVke6-zpWTy4yQIkuPcDyVuvPAxOO_WYV-Ttjt74mS12l19MXPaK0K-rj5Hly3LcRZWsuVHIEbMLfz77HLa-P38WbmGOCb5tlsGzH6bl7FVIxgldNurcdkFEjoMazRSOqN-01IUdP95l9GjH5CxCUrLLJymCz7DRncav7R-u0e6iN90c1nDRmwl6PeuX6_DRe6TbfyRh5Y5kC0_8wA'
  },
  {
    id: 'gallery-5',
    alt: 'Plush Velvet Restorative Lounge & Ornate Marble Fireplace',
    category: 'STAGE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLs58s5stVz-CqAEr-fAc5jODx7NvCxVsyk8r0Hm-3ncz8Ry_8JQiB1mbZlm84qWgoiRr35DruxCObL_GIqY44hqnDFouZkGVvND8FEDSytAQj9uomru1eBN2glpBaKPmOsVr_gM4DfEPI5-UiOGj4NwG2zNr3l7QMZVko_449usNCJaoFobDhzKOwyPeGqVARaS9G-LvsO3ivq5ZG4C1FYfYWS6nVonhW73NXKZwb_9rMOXHYMWatLd9i6xTvdjE1_yVWdG4H2Tg'
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-1',
    quote: '"Our royal alliance in the Sabha Niwas was like stepping into a Mewari chronicle. The ancient Ghoomar dancer circle with flaming lamps, and standard-setting protocol-perfect butler service made it an event we will cherish for lifetimes."',
    author: 'Aanya & Vikram Singh',
    stars: 5
  },
  {
    id: 't-2',
    quote: '"From the stunning hand-carved sandstones reflecting lit-up oil lanterns to the bespoke family manuscript recipes under a starry Pichola view, Heritage Estates curated an affair that spellbound all our international guests."',
    author: 'Priyanka & Devashish Mehta',
    stars: 5
  },
  {
    id: 't-3',
    quote: '"Meticulous, regal hospitality. The personal royal liaison coordinated every micro-element of our 3-day sanctuary wedding, honoring local Rajput principles. Truly the gold standard of living luxury."',
    author: 'Riya & Ranveer Rathore',
    stars: 5
  }
];

export const PACKAGES: PackageItem[] = [
  {
    id: 'package-1',
    name: 'The Rajkumari Set',
    price: 850000,
    priceDisplay: '₹8,50,000',
    capacity: 'Up to 200 Guests',
    tagline: 'Understated, historically resonant elegance within high-walled courtyard sanctuaries.',
    inclusions: [
      'Exclusive access to the private Mor Chowk Peacock Courtyard',
      'Heritage floral canopies using fresh marigolds and jasmine',
      '5 Antique Mewar Suite chambers for your immediate families',
      'Traditional military trumpet-and-shehnai welcome fanfare',
      'Dedicated Royal Liaison for meticulous timeline supervision',
      'Background classical sitar and santoor recitals by hereditary artists'
    ],
    note: 'View Details'
  },
  {
    id: 'package-2',
    name: 'The Mewar Durbar Sovereign',
    price: 1500000,
    priceDisplay: '₹15,00,000',
    capacity: 'Up to 500 Guests',
    tagline: 'The definitive palatial celebration preserving authentic court protocols.',
    inclusions: [
      'Fortress Exclusivity including Zenana Kund and Sabha Niwas',
      'Zardozi-embroidered silk canopies and slow-burn ghee lanterns',
      '15 Historic Palace Chambers and private lakeview balconies',
      'Elite Mewar Royal Liaison and personal palace butler team',
      'Regal arrival procession with horses, standards, and traditional brass ensemble',
      'All-day ceremonial estate support and custom layout mapping'
    ],
    note: 'Most Requested',
    featured: true
  },
  {
    id: 'package-3',
    name: 'The Maharana Imperial Grandeur',
    price: 2800000,
    priceDisplay: '₹28,00,000',
    capacity: 'Up to 1000+ Guests',
    tagline: 'Uncompromising sovereign luxury, fortress buyout and absolute privacy.',
    inclusions: [
      'Multi-day private fortress takeover and complete estate isolation',
      'Bespoke menus researched from early Mewar royal culinary archives',
      'All 30 ultra-luxury historic suites and royal turret chambers',
      'Authentic aerial salute with synchronized fresh rose petal showers',
      'Chauffeur-guided vintage Rolls-Royce transfers from lakeside jetty',
      'Sovereign round-the-clock custom service by royal protocol experts'
    ],
    note: 'Inquire'
  }
];

// Presets for the Interactive Calendar to show realistic blockages
export const INITIAL_BOOKINGS: BookingData = {
  // 2024-10 October Dates
  '2024-10-04': { status: 'booked' },
  '2024-10-05': { status: 'booked' },
  '2024-10-06': { status: 'booked' },
  '2024-10-07': { status: 'partial', morningBooked: true },
  '2024-10-08': { status: 'partial', eveningBooked: true },
  '2024-10-14': { status: 'booked' }, // Selection from mock starting state
  '2024-10-15': { status: 'booked' },
  '2024-10-16': { status: 'booked' },
  '2024-10-18': { status: 'booked' },
  '2024-10-19': { status: 'booked' },
  '2024-10-20': { status: 'booked' },
  
  // 2024-11 November Dates
  '2024-11-09': { status: 'booked' },
  '2024-11-10': { status: 'partial', eveningBooked: true },
  '2024-11-15': { status: 'booked' },
  '2024-11-16': { status: 'booked' },
  '2024-11-23': { status: 'partial', morningBooked: true },
  '2024-11-24': { status: 'booked' },
  
  // 2024-12 December Dates
  '2024-12-05': { status: 'booked' },
  '2024-12-24': { status: 'booked' },
  '2024-12-25': { status: 'booked' },
  '2024-12-31': { status: 'partial', eveningBooked: true }
};
