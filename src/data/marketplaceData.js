

export const STORES = [
  {
    id: 'air-india',
    name: 'Air India',
    category: 'Travel',
    noCostMonths: 18,
    logo: { bg: '#D8232A', color: '#FFFFFF', text: 'AIR INDIA' },
    isNearby: false,
  },
  {
    id: 'apple-premium-reseller',
    name: 'Apple Premium Reseller',
    category: 'Electronics',
    noCostMonths: 24,
    logo: { bg: '#0B0B0F', color: '#FFFFFF', text: 'Premium Reseller' },
    isNearby: false,
  },
  {
    id: 'caratlane',
    name: 'CaratLane',
    category: 'Jewellery',
    noCostMonths: 6,
    logo: { bg: '#7B1FA2', color: '#FFFFFF', text: 'CARATLANE' },
    isNearby: true,
    distanceKm: 1.2,
  },
  {
    id: 'cgh-earth',
    name: 'CGH Earth',
    category: 'Hospitality',
    noCostMonths: 24,
    logo: { bg: '#F4F1E8', color: '#33502E', text: 'cgh earth' },
    isNearby: false,
  },
  {
    id: 'samsung-store',
    name: 'Samsung Store',
    category: 'Electronics',
    noCostMonths: 12,
    logo: { bg: '#1428A0', color: '#FFFFFF', text: 'SAMSUNG' },
    isNearby: true,
    distanceKm: 2.4,
  },
  {
    id: 'croma',
    name: 'Croma',
    category: 'Electronics',
    noCostMonths: 9,
    logo: { bg: '#00A651', color: '#FFFFFF', text: 'Croma' },
    isNearby: true,
    distanceKm: 0.8,
  },
  {
    id: 'tanishq',
    name: 'Tanishq',
    category: 'Jewellery',
    noCostMonths: 12,
    logo: { bg: '#8B0000', color: '#F5D98B', text: 'TANISHQ' },
    isNearby: true,
    distanceKm: 3.6,
  },
];

// ---- EMI plan template helper ------------------------------------------

/** Builds a set of no-cost tenure options plus one longer interest-bearing option. */
function emiTemplates({ noCostTenures, extendedTenure, extendedRate }) {
  const plans = noCostTenures.map((tenureMonths) => ({
    id: `m${tenureMonths}-nc`,
    tenureMonths,
    interestRate: 0,
    processingFee: 0,
    isNoCost: true,
  }));
  if (extendedTenure) {
    plans.push({
      id: `m${extendedTenure}-std`,
      tenureMonths: extendedTenure,
      interestRate: extendedRate,
      processingFee: 499,
      isNoCost: false,
    });
  }
  return plans;
}

// ---- Products -----------------------------------------------------------
// Only stores that sell physical/purchasable products carry a catalogue.
// Air India and CGH Earth intentionally have none, which lets the empty
// state be exercised through a completely normal user path.

export const PRODUCTS = [
  {
    id: 'iphone-15',
    storeId: 'apple-premium-reseller',
    name: 'iPhone 15',
    description:
      'A19 chip, 48MP Main camera with 2x Telephoto, Dynamic Island, and USB-C — in durable color-infused glass and aluminium.',
    basePrice: 79900,
    rating: 4.7,
    variantGroups: [
      {
        id: 'storage',
        label: 'Storage',
        options: [
          { id: '128gb', label: '128GB', priceDelta: 0 },
          { id: '256gb', label: '256GB', priceDelta: 10000 },
          { id: '512gb', label: '512GB', priceDelta: 24000 },
        ],
      },
      {
        id: 'color',
        label: 'Colour',
        options: [
          { id: 'black', label: 'Black', priceDelta: 0 },
          { id: 'blue', label: 'Blue', priceDelta: 0 },
          { id: 'green', label: 'Green', priceDelta: 0 },
          { id: 'yellow', label: 'Yellow', priceDelta: 0 },
        ],
      },
    ],
    emiPlanTemplates: emiTemplates({ noCostTenures: [3, 6, 9, 12], extendedTenure: 24, extendedRate: 13 }),
  },
  {
    id: 'iphone-15-pro',
    storeId: 'apple-premium-reseller',
    name: 'iPhone 15 Pro',
    description:
      'Titanium design, A17 Pro chip, and the most advanced Pro camera system yet, with a customizable Action button.',
    basePrice: 134900,
    rating: 4.8,
    variantGroups: [
      {
        id: 'storage',
        label: 'Storage',
        options: [
          { id: '128gb', label: '128GB', priceDelta: 0 },
          { id: '256gb', label: '256GB', priceDelta: 11000 },
          { id: '512gb', label: '512GB', priceDelta: 33000 },
          { id: '1tb', label: '1TB', priceDelta: 55000 },
        ],
      },
      {
        id: 'color',
        label: 'Colour',
        options: [
          { id: 'titanium-black', label: 'Black Titanium', priceDelta: 0 },
          { id: 'titanium-white', label: 'White Titanium', priceDelta: 0 },
          { id: 'titanium-blue', label: 'Blue Titanium', priceDelta: 0 },
        ],
      },
    ],
    emiPlanTemplates: emiTemplates({ noCostTenures: [6, 12, 18], extendedTenure: 24, extendedRate: 12 }),
  },
  {
    id: 'macbook-air-m3',
    storeId: 'apple-premium-reseller',
    name: 'MacBook Air 13" (M3)',
    description:
      'The world\u2019s most popular laptop, supercharged by the M3 chip. Up to 18 hours of battery life in a fanless design.',
    basePrice: 114900,
    rating: 4.9,
    variantGroups: [
      {
        id: 'storage',
        label: 'Storage',
        options: [
          { id: '256gb', label: '256GB SSD', priceDelta: 0 },
          { id: '512gb', label: '512GB SSD', priceDelta: 20000 },
        ],
      },
      {
        id: 'color',
        label: 'Colour',
        options: [
          { id: 'midnight', label: 'Midnight', priceDelta: 0 },
          { id: 'starlight', label: 'Starlight', priceDelta: 0 },
          { id: 'silver', label: 'Silver', priceDelta: 0 },
        ],
      },
    ],
    emiPlanTemplates: emiTemplates({ noCostTenures: [6, 12, 18, 24], extendedTenure: null }),
  },
  {
    id: 'galaxy-s24',
    storeId: 'samsung-store',
    name: 'Galaxy S24',
    description:
      'Galaxy AI is here. Circle to Search, live translation on calls, and a 50MP camera system built for low light.',
    basePrice: 74999,
    rating: 4.5,
    variantGroups: [
      {
        id: 'storage',
        label: 'Storage',
        options: [
          { id: '128gb', label: '128GB', priceDelta: 0 },
          { id: '256gb', label: '256GB', priceDelta: 6000 },
        ],
      },
      {
        id: 'color',
        label: 'Colour',
        options: [
          { id: 'onyx-black', label: 'Onyx Black', priceDelta: 0 },
          { id: 'marble-grey', label: 'Marble Grey', priceDelta: 0 },
          { id: 'amber-yellow', label: 'Amber Yellow', priceDelta: 0 },
        ],
      },
    ],
    emiPlanTemplates: emiTemplates({ noCostTenures: [3, 6, 9, 12], extendedTenure: null }),
  },
  {
    id: 'galaxy-watch6',
    storeId: 'samsung-store',
    name: 'Galaxy Watch6',
    description: 'Advanced sleep coaching and body composition insights, in a slimmer, lighter design.',
    basePrice: 29999,
    rating: 4.4,
    variantGroups: [
      {
        id: 'size',
        label: 'Case size',
        options: [
          { id: '40mm', label: '40mm', priceDelta: 0 },
          { id: '44mm', label: '44mm', priceDelta: 2500 },
        ],
      },
      {
        id: 'color',
        label: 'Colour',
        options: [
          { id: 'graphite', label: 'Graphite', priceDelta: 0 },
          { id: 'silver', label: 'Silver', priceDelta: 0 },
        ],
      },
    ],
    emiPlanTemplates: emiTemplates({ noCostTenures: [3, 6], extendedTenure: null }),
  },
  {
    id: 'lg-oled-tv',
    storeId: 'croma',
    name: 'LG 55" OLED C4 TV',
    description: 'Self-lit OLED pixels, a4 Gen7 AI processor, and 144Hz refresh for console gaming.',
    basePrice: 129990,
    rating: 4.6,
    variantGroups: [
      {
        id: 'size',
        label: 'Screen size',
        options: [
          { id: '55-inch', label: '55-inch', priceDelta: 0 },
          { id: '65-inch', label: '65-inch', priceDelta: 60000 },
        ],
      },
    ],
    emiPlanTemplates: emiTemplates({ noCostTenures: [3, 6, 9], extendedTenure: 18, extendedRate: 15 }),
  },
  {
    id: 'dyson-v15',
    storeId: 'croma',
    name: 'Dyson V15 Detect',
    description: 'Laser reveals microscopic dust, with a piezo sensor that counts and sizes particles as you clean.',
    basePrice: 62900,
    rating: 4.7,
    variantGroups: [],
    emiPlanTemplates: emiTemplates({ noCostTenures: [3, 6, 9], extendedTenure: null }),
  },
  {
    id: 'diamond-pendant',
    storeId: 'caratlane',
    name: 'Solitaire Aura Diamond Pendant',
    description: 'A single brilliant-cut diamond in a 4-prong setting, finished in certified hallmark gold.',
    basePrice: 24999,
    rating: 4.6,
    variantGroups: [
      {
        id: 'metal',
        label: 'Metal',
        options: [
          { id: 'yellow-gold', label: 'Yellow Gold', priceDelta: 0 },
          { id: 'white-gold', label: 'White Gold', priceDelta: 1500 },
          { id: 'rose-gold', label: 'Rose Gold', priceDelta: 1500 },
        ],
      },
    ],
    emiPlanTemplates: emiTemplates({ noCostTenures: [3, 6], extendedTenure: null }),
  },
  {
    id: 'gold-earrings',
    storeId: 'caratlane',
    name: 'Everyday Gold Stud Earrings',
    description: 'Lightweight 18K gold studs designed for daily wear, with secure screw-back fastening.',
    basePrice: 18999,
    rating: 4.5,
    variantGroups: [
      {
        id: 'size',
        label: 'Size',
        options: [
          { id: 'small', label: 'Small', priceDelta: 0 },
          { id: 'medium', label: 'Medium', priceDelta: 800 },
          { id: 'large', label: 'Large', priceDelta: 1600 },
        ],
      },
    ],
    emiPlanTemplates: emiTemplates({ noCostTenures: [3, 6], extendedTenure: null }),
  },
  {
    id: 'gold-necklace',
    storeId: 'tanishq',
    name: 'Heritage Gold Necklace',
    description: 'Traditional temple-inspired design in hallmark gold, crafted for festive and bridal wear.',
    basePrice: 145000,
    rating: 4.8,
    variantGroups: [
      {
        id: 'purity',
        label: 'Purity',
        options: [
          { id: '18k', label: '18K Gold', priceDelta: 0 },
          { id: '22k', label: '22K Gold', priceDelta: 22000 },
        ],
      },
    ],
    emiPlanTemplates: emiTemplates({ noCostTenures: [3, 6, 9, 12], extendedTenure: null }),
  },
];

export function getStoreById(storeId) {
  return STORES.find((store) => store.id === storeId) ?? null;
}

export function getProductById(productId) {
  return PRODUCTS.find((product) => product.id === productId) ?? null;
}


export function getAllProductsWithStore() {
  return PRODUCTS.map((product) => ({
    ...product,
    store: getStoreById(product.storeId),
  }));
}
