/**
 * AUTOX Showcase Demonstration Data
 * Provides high-fidelity luxury automotive catalog fallback
 * for static GitHub Pages and offline client browsing.
 */

export const showcaseCategories = [
  {
    _id: 'cat_01',
    name: 'Exterior Accessories',
    slug: 'exterior-accessories',
    description: 'Aerodynamic carbon fiber splitters, spoilers, diffusers, and protective ceramic guard coats.',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'cat_02',
    name: 'Interior Accessories',
    slug: 'interior-accessories',
    description: 'Ergonomic racing seats, ambient cockpit illumination, carbon steering wheels, and luxury floor mats.',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'cat_03',
    name: 'Car Electronics',
    slug: 'car-electronics',
    description: '4K dual dashcams, heads-up display units (HUD), TPMS telemetry, and smart vehicle trackers.',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'cat_04',
    name: 'Lighting Accessories',
    slug: 'lighting-accessories',
    description: 'Hyper-LED projector headlights, underglow RGB ground lighting, and laser auxiliary fog lamps.',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'cat_05',
    name: 'Performance Parts',
    slug: 'performance-parts',
    description: 'Cold air induction systems, high-flow stainless downpipes, coilover suspensions, and ECU tuning adapters.',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'cat_06',
    name: 'Wheels & Telemetry',
    slug: 'wheels-and-tires',
    description: 'Forged lightweight monoblock rims, titanium lug nuts, and valve cap telemetry sensors.',
    image: 'https://images.unsplash.com/photo-1558441719-7f363dd780db?auto=format&fit=crop&w=800&q=80'
  }
];

export const showcaseProducts = [
  {
    _id: 'prod_01',
    name: 'Carbon Fiber GT Wing Spoiler',
    slug: 'carbon-fiber-gt-wing-spoiler',
    sku: 'EXT-SPO-01',
    brand: 'AeroCraft Pro',
    category: showcaseCategories[0],
    price: 45000,
    discountPrice: 39500,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    numReviews: 28,
    isFeatured: true,
    description: 'Ultra-lightweight high-downforce dry carbon fiber rear wing engineered for track aerodynamics and street stability. Dual-plane aerofoil profile provides up to 180kg downforce at 160 km/h.',
    specifications: [
      { name: 'Material', value: 'Toray 3K Pre-preg Carbon Fiber' },
      { name: 'Finish', value: 'Gloss UV-Inhibited Clear Coat' },
      { name: 'Downforce', value: '180 kg @ 160 km/h' },
      { name: 'Warranty', value: '2 Years Manufacturer Warranty' }
    ]
  },
  {
    _id: 'prod_02',
    name: 'Forged 19" Monoblock Wheel Set',
    slug: 'forged-19-monoblock-wheel-set',
    sku: 'WHL-FORG-01',
    brand: 'Apex Racing',
    category: showcaseCategories[5],
    price: 185000,
    discountPrice: 169000,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1558441719-7f363dd780db?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 5.0,
    numReviews: 19,
    isFeatured: true,
    description: '6061-T6 aerospace aluminum forged wheels. Extreme strength-to-weight ratio shedding 4.2 kg unsprung weight per corner for razor-sharp steering feedback.',
    specifications: [
      { name: 'Construction', value: 'Forged 6061-T6 Aerospace Aluminum' },
      { name: 'Diameter / Width', value: '19 x 9.5J ET35' },
      { name: 'Bolt Pattern', value: '5x114.3 / 5x112 / 5x120' },
      { name: 'Weight', value: '8.4 kg per corner' }
    ]
  },
  {
    _id: 'prod_03',
    name: 'Alcantara Sport Steering Wheel with Shift Lights',
    slug: 'alcantara-sport-steering-wheel-with-shift-lights',
    sku: 'INT-STR-02',
    brand: 'Veloce Dynamics',
    category: showcaseCategories[1],
    price: 68000,
    discountPrice: 62000,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.8,
    numReviews: 34,
    isFeatured: true,
    description: 'Ergonomic D-cut racing steering wheel wrapped in Italian Alcantara with gloss carbon fiber accents and integrated 16-LED RPM shift telemetry HUD indicator.',
    specifications: [
      { name: 'Grip Wrap', value: 'Genuine Italian Alcantara' },
      { name: 'Telemetry HUD', value: '16-LED Progressive RPM Display' },
      { name: 'Paddle Cutouts', value: 'Compatible with OEM Magnetic Paddles' }
    ]
  },
  {
    _id: 'prod_04',
    name: 'Titanium Dual Valved Exhaust System',
    slug: 'titanium-dual-valved-exhaust-system',
    sku: 'PRF-EXH-03',
    brand: 'Innotech Performance',
    category: showcaseCategories[4],
    price: 145000,
    discountPrice: 132000,
    stock: 6,
    images: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    numReviews: 22,
    isFeatured: true,
    description: 'Grade 1 aerospace titanium full cat-back exhaust with wireless key fob valve controllers. Toggle between quiet urban cruising and aggressive full-bore track resonance.',
    specifications: [
      { name: 'Material', value: 'Titanium Grade 1 (0.8mm wall thickness)' },
      { name: 'Weight Reduction', value: '-14.8 kg vs OEM stainless' },
      { name: 'Sound Valve', value: 'Dual Vacuum-Actuated Electronic Valves' }
    ]
  },
  {
    _id: 'prod_05',
    name: '4K Dual Dashcam with Cloud Telemetry & GPS',
    slug: '4k-dual-dashcam-with-cloud-telemetry-gps',
    sku: 'ELC-CAM-01',
    brand: 'VisionGuard Auto',
    category: showcaseCategories[2],
    price: 32000,
    discountPrice: 28500,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.7,
    numReviews: 45,
    isFeatured: false,
    description: 'Dual Sony Starvis 2 image sensors recording front 4K HDR and rear 1080p 60fps with continuous 24/7 parking surveillance and G-sensor incident locking.',
    specifications: [
      { name: 'Sensor', value: 'Sony STARVIS 2 IMX678' },
      { name: 'Resolution', value: 'Front: 3840x2160 @ 30fps | Rear: 1920x1080 @ 60fps' },
      { name: 'Connectivity', value: 'Dual-band Wi-Fi 6 & Built-in GPS' }
    ]
  },
  {
    _id: 'prod_06',
    name: 'Hyper-LED Matrix Projector Headlight Assembly',
    slug: 'hyper-led-matrix-projector-headlight-assembly',
    sku: 'LGT-HL-01',
    brand: 'LumenTech Optics',
    category: showcaseCategories[3],
    price: 88000,
    discountPrice: 79000,
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 4.9,
    numReviews: 17,
    isFeatured: false,
    description: 'Adaptive laser-assisted bi-LED projector headlights delivering 600 meters of road throw with sequential amber turn signals and start-up animation sequence.',
    specifications: [
      { name: 'Luminous Output', value: '12,000 Lumens per Pair' },
      { name: 'Color Temperature', value: '6000K Pure Diamond White' },
      { name: 'Ingress Rating', value: 'IP68 Submersible Waterproof' }
    ]
  }
];

