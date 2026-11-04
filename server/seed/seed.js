import dotenv from 'dotenv';
import mongoose from 'mongoose';
import slugify from 'slugify';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Coupon from '../models/Coupon.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import Newsletter from '../models/Newsletter.js';
import Contact from '../models/Contact.js';
import { connectDB, disconnectDB } from '../config/db.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log(`[AUTOX Seed Engine] Initiating database connection...`);
    await connectDB();

    // Verify Admin credentials
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'AUTOX Administrator';

    if (!adminEmail || !adminPassword) {
      console.error(`[AUTOX Seed Error]: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are mandatory for seeding.`);
      process.exit(1);
    }

    console.log(`[AUTOX Seed Engine] Clearing existing records...`);
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Order.deleteMany(),
      Review.deleteMany(),
      Coupon.deleteMany(),
      Cart.deleteMany(),
      Wishlist.deleteMany(),
      Newsletter.deleteMany(),
      Contact.deleteMany()
    ]);

    console.log(`[AUTOX Seed Engine] Creating users (Admin & Customers)...`);
    // Create Admin
    const admin = await User.create({
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      phone: '+92 300 1234567',
      role: 'admin',
      isEmailVerified: true,
      addresses: [{
        fullName: adminName,
        phone: '+92 300 1234567',
        street: 'AUTOX Headquarters, Blue Area',
        city: 'Islamabad',
        province: 'Federal Capital',
        postalCode: '44000',
        isDefault: true
      }]
    });

    // Create Sample Customers
    const customer1 = await User.create({
      name: 'Hamza Tariq',
      email: 'hamza.tariq@example.pk',
      password: 'Password123!',
      phone: '+92 321 9876543',
      role: 'customer',
      isEmailVerified: true,
      addresses: [{
        fullName: 'Hamza Tariq',
        phone: '+92 321 9876543',
        street: 'House 42, Block D, DHA Phase 5',
        city: 'Lahore',
        province: 'Punjab',
        postalCode: '54792',
        isDefault: true
      }]
    });

    const customer2 = await User.create({
      name: 'Zainab Bilal',
      email: 'zainab.bilal@example.pk',
      password: 'Password123!',
      phone: '+92 333 4567890',
      role: 'customer',
      isEmailVerified: true,
      addresses: [{
        fullName: 'Zainab Bilal',
        phone: '+92 333 4567890',
        street: 'Apartment 8B, Clifton Block 4',
        city: 'Karachi',
        province: 'Sindh',
        postalCode: '75600',
        isDefault: true
      }]
    });

    console.log(`[AUTOX Seed Engine] Seeding 10 core categories...`);
    const initialCategories = [
      {
        name: 'Exterior Accessories',
        slug: 'exterior-accessories',
        description: 'Aerodynamic body kits, carbon fiber spoilers, roof racks, and protective ceramic guard coats.',
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Interior Accessories',
        slug: 'interior-accessories',
        description: 'Ergonomic racing seats, ambient cockpit illumination, carbon steering wheels, and luxury floor mats.',
        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Car Electronics',
        slug: 'car-electronics',
        description: '4K dual dashcams, heads-up display units (HUD), TPMS telemetry, and smart vehicle trackers.',
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Lighting Accessories',
        slug: 'lighting-accessories',
        description: 'Hyper-LED projector headlights, underglow RGB ground lighting, and laser auxiliary fog lamps.',
        image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Performance Parts',
        slug: 'performance-parts',
        description: 'Cold air induction systems, high-flow stainless downpipes, coilover suspensions, and ECU tuning adapters.',
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Cleaning and Maintenance',
        slug: 'cleaning-and-maintenance',
        description: 'Professional ceramic coating kits, cordless dual-action polishers, foam cannons, and microfiber kits.',
        image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Safety Accessories',
        slug: 'safety-accessories',
        description: 'Heavy-duty tire inflators, emergency jump starters, medical trauma kits, and window glass breakers.',
        image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Wheels and Tires',
        slug: 'wheels-and-tires',
        description: 'Forged lightweight monoblock rims, titanium lug nuts, and valve cap telemetry sensors.',
        image: 'https://images.unsplash.com/photo-1558441719-7f363dd780db?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Audio Systems',
        slug: 'audio-systems',
        description: 'Subwoofers, neodymium component tweeters, DSP amplifiers, and sound deadening insulation.',
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Car Styling Accessories',
        slug: 'car-styling-accessories',
        description: 'Custom metal badging, anodized tow straps, aerodynamic canards, and caliper covers.',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
      }
    ];

    const createdCategories = await Category.insertMany(initialCategories);
    const catMap = {};
    createdCategories.forEach(c => {
      catMap[c.slug] = c._id;
    });

    console.log(`[AUTOX Seed Engine] Seeding 30+ comprehensive automotive products...`);
    const productsData = [
      // 1. Exterior
      {
        name: 'Carbon Fiber GT Racing Rear Wing Spoiler',
        SKU: 'EXT-CF-SP01',
        description: 'Crafted from autoclave 3K dry carbon fiber, this adjustable GT track wing delivers up to 180kg of authoritative aerodynamic downforce at 180 km/h. Includes CNC-machined T6 aluminum risers and universal mounting hardware.',
        shortDescription: '3K Autoclave Dry Carbon Fiber high-downforce GT track wing with anodized mounts.',
        category: catMap['exterior-accessories'],
        brand: 'AeroCraft Pro',
        price: 85000,
        discountPercentage: 10,
        stock: 14,
        images: [
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
        ],
        model3D: '',
        specifications: [
          { key: 'Material', value: '3K Dry Carbon Fiber' },
          { key: 'Span Width', value: '145 cm' },
          { key: 'Weight', value: '2.85 kg' },
          { key: 'Finish', value: 'UV-Protected High Gloss' }
        ],
        ratingAverage: 4.9,
        ratingCount: 18,
        isFeatured: true,
        isBestSeller: true
      },
      {
        name: 'Universal Front Bumper Splitter & Canards Kit',
        SKU: 'EXT-SPL-02',
        description: 'Aerodynamic high-impact ABS gloss black front splitter lip with side vortex generators. Protects lower chassis from road debris while directing airflow under the vehicle for high-speed stability.',
        shortDescription: 'High-impact gloss black splitter lip with reinforcing strut rods.',
        category: catMap['exterior-accessories'],
        brand: 'Veloce Dynamics',
        price: 24500,
        discountPercentage: 15,
        stock: 22,
        images: [
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Material', value: 'Reinforced ABS' },
          { key: 'Fitment', value: 'Universal 3-Piece Modular' },
          { key: 'Hardware', value: 'Stainless Steel Fasteners' }
        ],
        ratingAverage: 4.7,
        ratingCount: 12,
        isFeatured: false,
        isBestSeller: false
      },
      {
        name: 'Ceramic Nano-Infused Paint Protection Shield 50ml',
        SKU: 'EXT-CER-03',
        description: '9H hardness hydrophobic nano-ceramic coating designed to shield paintwork against ultraviolet degradation, acid rain, bird droppings, and microscopic swirl scratches for up to 36 months.',
        shortDescription: '9H permanent hydrophobic ceramic coating for deep mirror gloss.',
        category: catMap['exterior-accessories'],
        brand: 'ShieldTech',
        price: 14000,
        discountPercentage: 0,
        stock: 45,
        images: [
          'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Hardness', value: '9H Diamond Grade' },
          { key: 'Durability', value: 'Up to 3 Years' },
          { key: 'Contact Angle', value: '115 degrees Hydrophobic' }
        ],
        ratingAverage: 4.8,
        ratingCount: 31,
        isFeatured: true,
        isBestSeller: false
      },

      // 2. Interior
      {
        name: 'Ergonomic Alcantara & Nappa Leather Sport Bucket Seat',
        SKU: 'INT-SEAT-01',
        description: 'FIA-inspired reclining sport bucket seat featuring authentic Italian Alcantara center inserts and premium Nappa leather bolsters. Engineered with dual-density memory foam for cross-country touring comfort.',
        shortDescription: 'Italian Alcantara & Nappa leather reclining sport seat with lateral support.',
        category: catMap['interior-accessories'],
        brand: 'CorsaLux',
        price: 95000,
        discountPercentage: 5,
        stock: 8,
        images: [
          'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Upholstery', value: 'Alcantara & Nappa Leather' },
          { key: 'Recline Mechanism', value: 'Quick-Tilt Dual Recliner' },
          { key: 'Weight', value: '14.2 kg' }
        ],
        ratingAverage: 5.0,
        ratingCount: 9,
        isFeatured: true,
        isBestSeller: false
      },
      {
        name: 'Carbon Fiber LED Shift Indicator Steering Wheel',
        SKU: 'INT-WHL-02',
        description: 'Flat-bottom ergonomic steering wheel handcrafted with genuine carbon fiber and perforated leather grips. Integrated OLED multi-function display presents real-time RPM, speed, lap timer, and engine coolant temp.',
        shortDescription: 'OLED Shift-indicator custom carbon fiber steering wheel with F1 shift LEDs.',
        category: catMap['interior-accessories'],
        brand: 'AeroCraft Pro',
        price: 125000,
        discountPercentage: 8,
        stock: 6,
        images: [
          'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Display', value: 'OLED Smart HUD Engine' },
          { key: 'LED Sequence', value: '16 RGB Shift Markers' },
          { key: 'Grip', value: 'Perforated German Nappa Leather' }
        ],
        ratingAverage: 4.9,
        ratingCount: 22,
        isFeatured: true,
        isBestSeller: true
      },
      {
        name: '64-Color Symphony Fiber Optic Ambient Lighting Kit',
        SKU: 'INT-LGT-03',
        description: 'APP-controlled automotive fiber optic ambient lighting. Features dreamcolor dynamic chasing modes, rhythm music sync, stealth hidden installation, and ultra-durable heat-resistant light guides.',
        shortDescription: 'APP-controlled 64-color ambient light tubing with sound-reactive music sync.',
        category: catMap['interior-accessories'],
        brand: 'LuminaDrive',
        price: 18500,
        discountPercentage: 20,
        stock: 35,
        images: [
          'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Control', value: 'iOS/Android App & RF Remote' },
          { key: 'Length', value: '6 Laser Optical Fibers (Total 8m)' },
          { key: 'Voltage', value: '12V DC Stabilized' }
        ],
        ratingAverage: 4.6,
        ratingCount: 17,
        isFeatured: false,
        isBestSeller: true
      },

      // 3. Electronics
      {
        name: '4K Ultra-HD Dual Dashcam with Night Vision & Starvis Sensor',
        SKU: 'ELC-CAM-01',
        description: 'Front 4K UHD and rear 1080P dual recording with Sony Starvis IMX415 sensor. Features 5GHz Wi-Fi file transfer, GPS route logging, supercapacitor power cell, and 24-hour G-sensor parking surveillance.',
        shortDescription: 'Sony Starvis 4K dual dashcam with GPS logging and 24/7 parking mode.',
        category: catMap['car-electronics'],
        brand: 'Vanguard Vision',
        price: 36000,
        discountPercentage: 12,
        stock: 28,
        images: [
          'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Front Sensor', value: 'Sony Starvis IMX415 4K' },
          { key: 'Viewing Angle', value: '170° Wide Angle' },
          { key: 'Storage Support', value: 'Up to 256GB MicroSD U3' }
        ],
        ratingAverage: 4.8,
        ratingCount: 41,
        isFeatured: true,
        isBestSeller: true
      },
      {
        name: 'Wireless Heads-Up Display (HUD) Telemetry Unit',
        SKU: 'ELC-HUD-02',
        description: 'Plug-and-play OBD2 & GPS dual system heads-up display. Projects crystal-clear speed, water temperature, battery voltage, and intake pressure directly onto your windshield without distracting driver vision.',
        shortDescription: 'Windshield optical projection HUD with OBD2 engine telemetry diagnostics.',
        category: catMap['car-electronics'],
        brand: 'Vanguard Vision',
        price: 19500,
        discountPercentage: 0,
        stock: 19,
        images: [
          'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Compatibility', value: 'OBD2 / EUOBD (2008+ Vehicles)' },
          { key: 'Display Type', value: 'HD Nano-Coating Reflective Mirror' }
        ],
        ratingAverage: 4.7,
        ratingCount: 15,
        isFeatured: false,
        isBestSeller: false
      },
      {
        name: 'Solar Wireless Tire Pressure Monitoring System (TPMS)',
        SKU: 'ELC-TPM-03',
        description: 'Precision internal/external tire pressure and temperature telemetry system powered by mono-crystalline solar glass. Real-time visual and acoustic alarms for punctures, blowouts, and slow leaks.',
        shortDescription: 'Solar-charged digital TPMS with 4 external wireless pressure sensors.',
        category: catMap['car-electronics'],
        brand: 'TireGuard Pro',
        price: 12500,
        discountPercentage: 10,
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Accuracy', value: '±0.1 Bar' },
          { key: 'Battery Life', value: 'Up to 2 Years Per Sensor' }
        ],
        ratingAverage: 4.6,
        ratingCount: 28,
        isFeatured: false,
        isBestSeller: false
      },

      // 4. Lighting
      {
        name: 'Laser Matrix Bi-LED Projector Headlight Retrofit Kit 3.0"',
        SKU: 'LGT-PRJ-01',
        description: 'State-of-the-art 3-inch Bi-LED and laser auxiliary projector modules delivering 22,000 lumens per pair. Features razor-sharp low-beam cutoff and laser high-beam penetration up to 800 meters.',
        shortDescription: '22,000 Lumens Bi-LED laser retrofit projector lamps with crisp cutoff.',
        category: catMap['lighting-accessories'],
        brand: 'LuminaDrive',
        price: 52000,
        discountPercentage: 15,
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Luminous Output', value: '22,000 LM Per Pair' },
          { key: 'Color Temperature', value: '6000K Pure Diamond White' },
          { key: 'Lifespan', value: '50,000+ Hours' }
        ],
        ratingAverage: 4.9,
        ratingCount: 33,
        isFeatured: true,
        isBestSeller: true
      },
      {
        name: 'Bluetooth Smart RGB Underglow Chassis Illumination',
        SKU: 'LGT-UND-02',
        description: 'Waterproof IP68 exterior silicone LED strips designed for underbody ground neon effects. Offers 210 dynamic chasing presets, color wheel personalization, and brake safety light override.',
        shortDescription: 'IP68 waterproof automotive exterior underglow with app-driven chasing modes.',
        category: catMap['lighting-accessories'],
        brand: 'LuminaDrive',
        price: 16500,
        discountPercentage: 5,
        stock: 25,
        images: [
          'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Waterproof Grade', value: 'IP68 Submersible' },
          { key: 'Strip Configuration', value: '2x 90cm + 2x 120cm' }
        ],
        ratingAverage: 4.5,
        ratingCount: 19,
        isFeatured: false,
        isBestSeller: false
      },

      // 5. Performance Parts
      {
        name: '32-Way Damping Adjustable Monotube Coilover Suspension Kit',
        SKU: 'PRF-COIL-01',
        description: 'Motorsport-calibrated monotube coilover system with 32 levels of rebound and compression damping adjustment. T6-6061 forged aluminum spring perches and SAE9254 high-tensile steel springs.',
        shortDescription: 'Track-ready 32-click damping adjustable monotube suspension coilovers.',
        category: catMap['performance-parts'],
        brand: 'Apex Apex Motorsport',
        price: 145000,
        discountPercentage: 10,
        stock: 7,
        images: [
          'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Damping Steps', value: '32-Way Precision Clicker' },
          { key: 'Piston Diameter', value: '52mm Monotube' },
          { key: 'Height Drop', value: '30mm to 70mm' }
        ],
        ratingAverage: 5.0,
        ratingCount: 14,
        isFeatured: true,
        isBestSeller: false
      },
      {
        name: 'Carbon Fiber High-Velocity Cold Air Intake System',
        SKU: 'PRF-INTK-02',
        description: 'Thermal-insulating carbon fiber airbox coupled with a high-flow dry inverted cone filter. Increases airflow velocity into the throttle body, generating an audible turbo spool and +12 to +18 WHP gains.',
        shortDescription: 'Thermal carbon airbox cold air intake for increased horsepower and throttle snap.',
        category: catMap['performance-parts'],
        brand: 'Apex Motorsport',
        price: 68000,
        discountPercentage: 0,
        stock: 12,
        images: [
          'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Material', value: 'Pre-Preg Carbon Fiber' },
          { key: 'Power Gain', value: '+14.2 WHP Dyno Proven' }
        ],
        ratingAverage: 4.8,
        ratingCount: 16,
        isFeatured: false,
        isBestSeller: true
      },
      {
        name: 'Titanium Valvetronic Cat-Back Exhaust Muffler',
        SKU: 'PRF-EXH-03',
        description: 'Ultralight GR2 titanium cat-back exhaust with electronic valve cutout. Switch effortlessly between civil neighborhood silence and an intoxicating, unrestricted straight-pipe symphony with the wireless keyfob.',
        shortDescription: 'GR2 titanium valvetronic exhaust system with dual burnt blue quad tips.',
        category: catMap['performance-parts'],
        brand: 'TitanRoar',
        price: 185000,
        discountPercentage: 5,
        stock: 4,
        images: [
          'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Material', value: 'Grade 2 Lightweight Titanium' },
          { key: 'Valve Mechanism', value: 'Billet CNC Vacuum Solenoid' },
          { key: 'Weight Reduction', value: '-12.8 kg vs OEM' }
        ],
        ratingAverage: 5.0,
        ratingCount: 8,
        isFeatured: true,
        isBestSeller: false
      },

      // 6. Cleaning and Maintenance
      {
        name: 'Cordless Dual-Action 15mm Orbital Car Polisher Kit',
        SKU: 'CLN-POL-01',
        description: 'Brushless 20V battery-powered random orbital polisher with a 15mm throw. Effortlessly eliminates swirls, scratches, and oxidation without thermal holograms or burnt edges on clear coats.',
        shortDescription: 'Brushless cordless 15mm long-throw DA polisher with 2x 4.0Ah batteries.',
        category: catMap['cleaning-and-maintenance'],
        brand: 'DetailMaster',
        price: 38000,
        discountPercentage: 10,
        stock: 18,
        images: [
          'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Throw Orbit', value: '15mm Dual Action' },
          { key: 'Speed Range', value: '2000 - 4800 OPM' },
          { key: 'Batteries Included', value: '2x 20V Lithium-Ion 4000mAh' }
        ],
        ratingAverage: 4.8,
        ratingCount: 25,
        isFeatured: false,
        isBestSeller: true
      },
      {
        name: 'Snow Foam Lance Cannon with Stainless Steel Quick Connector',
        SKU: 'CLN-FOC-02',
        description: 'Heavy brass core and stainless steel orifice foam lance producing thick, shaving-cream-like foam blanket that encapsulates dirt particles before wash mitt contact, preventing microscopic clear coat swirls.',
        shortDescription: 'Heavy-duty brass snow foam cannon with adjustable spray pattern knob.',
        category: catMap['cleaning-and-maintenance'],
        brand: 'DetailMaster',
        price: 6500,
        discountPercentage: 0,
        stock: 50,
        images: [
          'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Pressure Rating', value: '1000 - 3200 PSI' },
          { key: 'Reservoir Volume', value: '1000 ml Graduated Bottle' }
        ],
        ratingAverage: 4.7,
        ratingCount: 39,
        isFeatured: false,
        isBestSeller: false
      },

      // 7. Safety Accessories
      {
        name: '2500A Peak Smart Emergency Jump Starter & Power Bank',
        SKU: 'SFT-JMP-01',
        description: 'Heavy-duty lithium jump starter producing 2500A peak current to jump-start up to 8.5L gas or 6.5L diesel engines up to 35 times on a single charge. Features 65W PD USB-C fast charging and LED strobe flashlight.',
        shortDescription: '2500A peak emergency jump starter with spark-proof smart clamps.',
        category: catMap['safety-accessories'],
        brand: 'SafeDrive Pro',
        price: 22000,
        discountPercentage: 15,
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Peak Amps', value: '2500 Amps' },
          { key: 'Battery Capacity', value: '20,000 mAh' },
          { key: 'Safety Protections', value: 'Reverse Polarity, Over-charge, Spark-proof' }
        ],
        ratingAverage: 4.9,
        ratingCount: 52,
        isFeatured: true,
        isBestSeller: true
      },
      {
        name: 'Heavy Duty Dual-Cylinder 150 PSI Digital Tire Inflator',
        SKU: 'SFT-INF-02',
        description: 'Direct-drive twin-cylinder air compressor capable of inflating a flat R18 tire in under 2.5 minutes. Features auto-shutoff digital gauge, vibration-dampened rubber feet, and a 5m heavy polyurethane hose.',
        shortDescription: 'High-speed dual-cylinder metal tire pump with auto-shutoff preset.',
        category: catMap['safety-accessories'],
        brand: 'SafeDrive Pro',
        price: 15500,
        discountPercentage: 0,
        stock: 26,
        images: [
          'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Air Flow Rate', value: '70 Liters/min' },
          { key: 'Max Working Pressure', value: '150 PSI' },
          { key: 'Power Connector', value: 'Battery Clamps + 12V DC Socket' }
        ],
        ratingAverage: 4.8,
        ratingCount: 34,
        isFeatured: false,
        isBestSeller: false
      },

      // 8. Wheels and Tires
      {
        name: 'Forged Monoblock 19" Aero-Spoke Alloy Wheels Set of 4',
        SKU: 'WHL-FORG-01',
        description: 'Aerospace-grade 6061-T6 forged aluminum alloy wheels. Weighing just 8.9 kg per wheel, this set reduces unsprung rotational mass dramatically, enhancing steering agility and acceleration responsiveness.',
        shortDescription: '6061-T6 lightweight forged 19" monoblock wheels in Satin Anthracite finish.',
        category: catMap['wheels-and-tires'],
        brand: 'ForgedLab',
        price: 240000,
        discountPercentage: 5,
        stock: 5,
        images: [
          'https://images.unsplash.com/photo-1558441719-7f363dd780db?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Size & Offset', value: '19x8.5J ET35 / 19x9.5J ET40' },
          { key: 'Bolt Pattern', value: '5x114.3 / 5x112' },
          { key: 'Weight', value: '8.9 kg per corner' }
        ],
        ratingAverage: 5.0,
        ratingCount: 11,
        isFeatured: true,
        isBestSeller: false
      },
      {
        name: 'Titanium Grade 5 Open-Ended Lug Nut Set (20 Pcs)',
        SKU: 'WHL-LUG-02',
        description: 'Machined from Ti-6Al-4V aerospace grade 5 titanium. Features burnt rainbow anodizing, 60-degree conical seats, and ultra-high tensile strength resisting stripped threads during high-torque track use.',
        shortDescription: 'Burnt rainbow Ti-6Al-4V grade 5 titanium racing lug nuts M12x1.5.',
        category: catMap['wheels-and-tires'],
        brand: 'ForgedLab',
        price: 28000,
        discountPercentage: 10,
        stock: 20,
        images: [
          'https://images.unsplash.com/photo-1558441719-7f363dd780db?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Thread Pitch', value: 'M12 x 1.5 / M12 x 1.25' },
          { key: 'Length', value: '48mm Open-End' },
          { key: 'Material', value: 'Aerospace Grade 5 Titanium' }
        ],
        ratingAverage: 4.8,
        ratingCount: 19,
        isFeatured: false,
        isBestSeller: true
      },

      // 9. Audio Systems
      {
        name: '12" 1500W RMS Dual-Voice-Coil Sealed Subwoofer with Enclosure',
        SKU: 'AUD-SUB-01',
        description: 'Competition-grade 12-inch cast aluminum basket subwoofer powered by oversized triple-stacked strontium magnets and carbon-mica cone. Delivers deep, chest-thumping sub-bass reproduction down to 22Hz.',
        shortDescription: '1500W RMS 12-inch competition subwoofer housed in acoustic birch enclosure.',
        category: catMap['audio-systems'],
        brand: 'SonicBlast Audio',
        price: 62000,
        discountPercentage: 12,
        stock: 10,
        images: [
          'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'RMS Power', value: '1500 Watts (3000W Peak)' },
          { key: 'Voice Coil', value: '3.0" 4-Layer High-Temp Copper' },
          { key: 'Frequency Response', value: '20 Hz – 250 Hz' }
        ],
        ratingAverage: 4.9,
        ratingCount: 27,
        isFeatured: true,
        isBestSeller: true
      },
      {
        name: '8-Channel Digital Signal Processor (DSP) with Class-D Amplifier',
        SKU: 'AUD-DSP-02',
        description: 'Audiophile grade 8-channel DSP amplifier delivering 100W RMS per channel into 4 ohms. 31-band parametric equalizer, time alignment, active crossovers, and lossless Bluetooth 5.1 streaming.',
        shortDescription: '8-channel digital sound processor and precision Class-D multi-channel amp.',
        category: catMap['audio-systems'],
        brand: 'SonicBlast Audio',
        price: 88000,
        discountPercentage: 0,
        stock: 8,
        images: [
          'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'DAC Resolution', value: '32-Bit / 192 kHz Burr-Brown' },
          { key: 'Output Power', value: '8 x 100W @ 4 Ohm' },
          { key: 'EQ Adjustments', value: '31-Band Parametric Per Channel' }
        ],
        ratingAverage: 4.9,
        ratingCount: 15,
        isFeatured: false,
        isBestSeller: false
      },

      // 10. Car Styling
      {
        name: 'Brembo Style Aluminum Alloy Brake Caliper Covers (Set of 4)',
        SKU: 'STY-CAL-01',
        description: 'High-temp powder-coated aircraft aluminum caliper covers. Securely fastened with stainless steel brackets without adhesive, giving your vehicle an aggressive supercar big-brake visual appearance.',
        shortDescription: 'Aircraft-grade aluminum performance caliper covers in Rosso Corsa Red.',
        category: catMap['car-styling-accessories'],
        brand: 'Veloce Dynamics',
        price: 14500,
        discountPercentage: 15,
        stock: 35,
        images: [
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Material', value: '6061-T6 Aluminum' },
          { key: 'Finish', value: 'High-Temp Powder Coat (Rosso Red)' }
        ],
        ratingAverage: 4.6,
        ratingCount: 38,
        isFeatured: false,
        isBestSeller: true
      },
      {
        name: 'Heavy Duty Anodized Aluminum Racing Tow Strap & Hook Kit',
        SKU: 'STY-TOW-02',
        description: 'High-strength polyester ribbon tow strap rated for 10,000 lbs break strength with CNC-machined aluminum mounting bracket. A motorsport functional styling staple for track enthusiasts.',
        shortDescription: '10,000 lbs high-tensile racing tow strap with CNC bolt-on adapter.',
        category: catMap['car-styling-accessories'],
        brand: 'Apex Motorsport',
        price: 4500,
        discountPercentage: 0,
        stock: 60,
        images: [
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Break Strength', value: '10,000 lbs (4535 kg)' },
          { key: 'Strap Width', value: '50mm Motorsport Grade' }
        ],
        ratingAverage: 4.8,
        ratingCount: 42,
        isFeatured: false,
        isBestSeller: false
      },
      // Additional items to exceed 30+ catalog items
      {
        name: 'Wireless Fast MagSafe Automotive Induction Phone Mount',
        SKU: 'ELC-MNT-04',
        description: 'Active cooling MagSafe wireless charger with motorized auto-clamping vent mounts. Delivers 15W Qi high-speed inductive charging while preventing phone overheating during GPS navigation.',
        shortDescription: '15W MagSafe cooled inductive car charger mount with motorized clamps.',
        category: catMap['car-electronics'],
        brand: 'Vanguard Vision',
        price: 9500,
        discountPercentage: 10,
        stock: 40,
        images: [
          'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Charging Standard', value: '15W Qi Fast Induction' },
          { key: 'Mount Type', value: 'Vent Grip + Telescopic Suction' }
        ],
        ratingAverage: 4.7,
        ratingCount: 30,
        isFeatured: false,
        isBestSeller: false
      },
      {
        name: 'WeatherTech All-Season 3D Laser-Measured Floor Liners',
        SKU: 'INT-MAT-04',
        description: 'Custom molded all-weather floor liners crafted from non-toxic odorless TPE compound. Features deep reservoir spill channels that trap snow, mud, and sand, protecting carpet upholstery.',
        shortDescription: 'Custom molded laser-measured waterproof TPE floor liners (Full Set).',
        category: catMap['interior-accessories'],
        brand: 'CorsaLux',
        price: 26000,
        discountPercentage: 0,
        stock: 22,
        images: [
          'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Material', value: 'Heavy Duty TPE Rubber' },
          { key: 'Spill Capacity', value: 'Deep High-Wall Channels' }
        ],
        ratingAverage: 4.9,
        ratingCount: 21,
        isFeatured: false,
        isBestSeller: false
      },
      {
        name: 'Aerodynamic ABS Rear Bumper Lower Diffuser with LED F1 Brake Light',
        SKU: 'EXT-DIF-04',
        description: 'Aggressive four-fin rear bumper diffuser with integrated center F1-style flashing LED strobe brake light. Channels underbody air smoothly to reduce low-pressure aerodynamic turbulence.',
        shortDescription: 'Rear underbody quad-fin diffuser featuring F1 pulse brake flasher.',
        category: catMap['exterior-accessories'],
        brand: 'AeroCraft Pro',
        price: 32000,
        discountPercentage: 12,
        stock: 16,
        images: [
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'F1 Strobe', value: '12 LED High-Intensity Pulse' },
          { key: 'Material', value: 'UV Coated Piano Black ABS' }
        ],
        ratingAverage: 4.8,
        ratingCount: 19,
        isFeatured: true,
        isBestSeller: false
      },
      {
        name: 'High-Temperature Silicone Intercooler & Radiator Hose Kit',
        SKU: 'PRF-HSE-04',
        description: '4-ply polyester reinforced silicone coolant hose kit engineered to withstand temperatures from -60°C up to +260°C and burst pressures up to 240 PSI. Eliminates swelling and cracking under boost.',
        shortDescription: '4-ply reinforced high-pressure silicone boost hose kit in Hyper Orange.',
        category: catMap['performance-parts'],
        brand: 'Apex Motorsport',
        price: 19500,
        discountPercentage: 0,
        stock: 25,
        images: [
          'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Burst Pressure', value: '240 PSI' },
          { key: 'Temperature Range', value: '-60°C to +260°C' }
        ],
        ratingAverage: 4.7,
        ratingCount: 14,
        isFeatured: false,
        isBestSeller: false
      },
      {
        name: 'Ultra-Dense Acoustic Sound Deadening Insulation Sheets (36 Sq Ft)',
        SKU: 'AUD-INS-03',
        description: 'Butyl rubber and foil constrained-layer vibration dampening sheets. Eliminates door panel rattles, road noise, and engine hum, boosting audio fidelity and bass response by up to +6dB.',
        shortDescription: 'Butyl acoustic deadening mat (80 mil thickness) for road noise suppression.',
        category: catMap['audio-systems'],
        brand: 'SonicBlast Audio',
        price: 21500,
        discountPercentage: 10,
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Thickness', value: '80 mil (2.0 mm)' },
          { key: 'Coverage', value: '36 Square Feet (9 Sheets)' }
        ],
        ratingAverage: 4.8,
        ratingCount: 22,
        isFeatured: false,
        isBestSeller: false
      },
      {
        name: 'Gloss Carbon Fiber Shark Fin Roof Antenna Cover',
        SKU: 'EXT-ANT-05',
        description: 'Aerodynamic UV-stabilized autoclave dry carbon fiber shark fin cover. Easily mounts over OEM antenna to provide a racing aesthetic without affecting radio or GPS reception.',
        shortDescription: 'Autoclave carbon fiber antenna overlay with 3M automotive adhesive.',
        category: catMap['exterior-accessories'],
        brand: 'AeroCraft Pro',
        price: 8500,
        discountPercentage: 0,
        stock: 38,
        images: [
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Material', value: 'Toray 3K Carbon Fiber' },
          { key: 'Installation', value: 'Pre-applied 3M VHB Tape' }
        ],
        ratingAverage: 4.7,
        ratingCount: 16,
        isFeatured: false,
        isBestSeller: false
      },
      {
        name: 'Motorsport Billet Aluminum Magnetic Oil Drain Plug',
        SKU: 'PRF-PLG-05',
        description: 'Machined from T6-6061 aircraft aluminum with an ultra-strong neodymium rare-earth magnet. Captures microscopic abrasive ferrous metal shavings circulating in motor oil.',
        shortDescription: 'Neodymium magnetic oil drain plug for enhanced engine longevity.',
        category: catMap['performance-parts'],
        brand: 'Apex Motorsport',
        price: 3200,
        discountPercentage: 0,
        stock: 75,
        images: [
          'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
        ],
        specifications: [
          { key: 'Magnet Type', value: 'N45 Neodymium High-Temp' },
          { key: 'Thread Spec', value: 'M14 x 1.5' }
        ],
        ratingAverage: 4.9,
        ratingCount: 44,
        isFeatured: false,
        isBestSeller: true
      }
    ];

    const productsWithSlugs = productsData.map((p, idx) => ({
      ...p,
      slug: slugify(p.name, { lower: true, strict: true }) + '-' + (1000 + idx)
    }));

    const createdProducts = await Product.insertMany(productsWithSlugs);
    console.log(`[AUTOX Seed Engine] Successfully seeded ${createdProducts.length} products.`);

    console.log(`[AUTOX Seed Engine] Seeding promotional coupons...`);
    const couponsData = [
      {
        code: 'AUTOX10',
        discountType: 'percentage',
        discountValue: 10,
        minimumOrderAmount: 5000,
        maximumDiscount: 15000,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        usageLimit: 500,
        isActive: true
      },
      {
        code: 'SUPERDRIVE',
        discountType: 'percentage',
        discountValue: 15,
        minimumOrderAmount: 20000,
        maximumDiscount: 25000,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        usageLimit: 200,
        isActive: true
      },
      {
        code: 'VIP500',
        discountType: 'fixed',
        discountValue: 500,
        minimumOrderAmount: 3000,
        maximumDiscount: null,
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        usageLimit: 1000,
        isActive: true
      }
    ];
    await Coupon.insertMany(couponsData);

    console.log(`[AUTOX Seed Engine] Seeding realistic sample order for customer...`);
    const firstProduct = createdProducts[0];
    const secondProduct = createdProducts[3];

    const sampleOrder = await Order.create({
      orderNumber: 'AOX-20261104-9841',
      user: customer1._id,
      items: [
        {
          product: firstProduct._id,
          name: firstProduct.name,
          SKU: firstProduct.SKU,
          price: firstProduct.price * 0.9,
          quantity: 1,
          image: firstProduct.images[0]
        },
        {
          product: secondProduct._id,
          name: secondProduct.name,
          SKU: secondProduct.SKU,
          price: secondProduct.price * 0.95,
          quantity: 1,
          image: secondProduct.images[0]
        }
      ],
      shippingAddress: customer1.addresses[0],
      subtotal: (firstProduct.price * 0.9) + (secondProduct.price * 0.95),
      shippingFee: 0, // Free above 5000
      discount: 500,
      total: (firstProduct.price * 0.9) + (secondProduct.price * 0.95) - 500,
      coupon: {
        code: 'VIP500',
        discountAmount: 500
      },
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'processing',
      deliveryTracking: [
        {
          status: 'placed',
          message: 'Order placed by customer.',
          location: 'AUTOX Lahore Fulfillment Center',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        {
          status: 'confirmed',
          message: 'Payment verified and items allocated.',
          location: 'AUTOX Logistics Hub, Pakistan',
          timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000)
        },
        {
          status: 'processing',
          message: 'Items packed in protective carbon packaging.',
          location: 'AUTOX Logistics Hub, Pakistan',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      ]
    });

    console.log(`[AUTOX Seed Engine] Seeding verified buyer reviews...`);
    await Review.create([
      {
        user: customer1._id,
        product: firstProduct._id,
        order: sampleOrder._id,
        rating: 5,
        title: 'Unbelievable Downforce and Fitment',
        comment: 'Installed this GT wing on my Civic track build. The carbon weave is flawless and the high-speed rear stability on the motorway is noticeably tighter.',
        status: 'approved'
      },
      {
        user: customer2._id,
        product: createdProducts[6]._id, // 4K Dashcam
        rating: 5,
        title: 'Crystal Clear Night Vision in Karachi',
        comment: 'The Sony sensor captures license plates even on pitch-black service roads. The 5GHz Wi-Fi makes downloading accident clips effortless.',
        status: 'approved'
      }
    ]);

    // Recalculate average ratings
    await Review.calcAverageRatings(firstProduct._id);
    await Review.calcAverageRatings(createdProducts[6]._id);

    console.log(`[AUTOX Seed Engine] Initializing customer wishlist...`);
    await Wishlist.create({
      user: customer1._id,
      products: [createdProducts[4]._id, createdProducts[11]._id]
    });

    console.log(`[AUTOX Seed Engine] Subscribing test newsletter...`);
    await Newsletter.create({
      email: 'car.enthusiast@autox.pk',
      isSubscribed: true
    });

    console.log(`=======================================================`);
    console.log(`✅ DATABASE SEED COMPLETE`);
    console.log(`👑 Administrator created:`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`👤 Customer created:`);
    console.log(`   Email: hamza.tariq@example.pk / Password123!`);
    console.log(`📦 Categories: 10`);
    console.log(`🏎️ Products: ${createdProducts.length}`);
    console.log(`🎟️ Active Coupons: AUTOX10, SUPERDRIVE, VIP500`);
    console.log(`=======================================================`);

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error(`[AUTOX Seed Engine Error]:`, error);
    process.exit(1);
  }
};

seedDatabase();
