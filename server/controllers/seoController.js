import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { guidesData } from '../data/guidesData.js';

const SITE_URL = process.env.CLIENT_URL || 'https://autox.pk';

/**
 * Generate robots.txt dynamically with safe indexing and crawler directives
 */
export const getRobotsTxt = (req, res) => {
  const robots = `# ========================================================
# AUTOX — Automotive E-Commerce Discovery Directives
# Brand: AUTOX (Engineered For Your Drive)
# Market: Pakistan | Currency: PKR
# ========================================================

User-agent: *
Allow: /
Allow: /shop
Allow: /categories
Allow: /categories/*
Allow: /product/*
Allow: /showroom
Allow: /about
Allow: /contact
Allow: /faq
Allow: /guides
Allow: /guides/*
Allow: /privacy-policy
Allow: /terms
Allow: /shipping-policy
Allow: /return-policy

# Disallow Private, Administrative, and Transactional Paths
Disallow: /admin
Disallow: /admin/
Disallow: /account
Disallow: /account/
Disallow: /cart
Disallow: /checkout
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /api/

# Crawler Directives for Search & Answer Engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /
Disallow: /admin/
Disallow: /account/
Disallow: /checkout/
Disallow: /cart/
Disallow: /api/

User-agent: PerplexityBot
Allow: /
Disallow: /admin/
Disallow: /account/
Disallow: /checkout/
Disallow: /cart/
Disallow: /api/

User-agent: ClaudeBot
Allow: /
Disallow: /admin/
Disallow: /account/
Disallow: /checkout/
Disallow: /cart/
Disallow: /api/

# Canonical Sitemap Declaration
Sitemap: ${SITE_URL}/sitemap.xml
`;

  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.header('Cache-Control', 'public, max-age=86400');
  return res.send(robots);
};

/**
 * Generate comprehensive, live, database-backed XML sitemap
 */
export const getSitemapXml = async (req, res, next) => {
  try {
    const [categories, products] = await Promise.all([
      Category.find({ isActive: true }).select('slug updatedAt').lean(),
      Product.find({ isActive: true }).select('slug updatedAt').lean()
    ]);

    const staticRoutes = [
      { path: '/', priority: '1.0', changefreq: 'daily', lastmod: new Date().toISOString().split('T')[0] },
      { path: '/shop', priority: '0.9', changefreq: 'daily', lastmod: new Date().toISOString().split('T')[0] },
      { path: '/categories', priority: '0.8', changefreq: 'weekly', lastmod: new Date().toISOString().split('T')[0] },
      { path: '/showroom', priority: '0.8', changefreq: 'weekly', lastmod: new Date().toISOString().split('T')[0] },
      { path: '/guides', priority: '0.8', changefreq: 'weekly', lastmod: new Date().toISOString().split('T')[0] },
      { path: '/about', priority: '0.6', changefreq: 'monthly', lastmod: '2026-03-01' },
      { path: '/contact', priority: '0.6', changefreq: 'monthly', lastmod: '2026-03-01' },
      { path: '/faq', priority: '0.6', changefreq: 'monthly', lastmod: '2026-03-01' },
      { path: '/shipping-policy', priority: '0.5', changefreq: 'monthly', lastmod: '2026-03-01' },
      { path: '/return-policy', priority: '0.5', changefreq: 'monthly', lastmod: '2026-03-01' },
      { path: '/privacy-policy', priority: '0.4', changefreq: 'monthly', lastmod: '2026-03-01' },
      { path: '/terms', priority: '0.4', changefreq: 'monthly', lastmod: '2026-03-01' }
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static core pages
    for (const route of staticRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${SITE_URL}${route.path}</loc>\n`;
      xml += `    <lastmod>${route.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic Category Pages
    for (const cat of categories) {
      const lastModDate = cat.updatedAt ? new Date(cat.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${SITE_URL}/categories/${cat.slug}</loc>\n`;
      xml += `    <lastmod>${lastModDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic Product Detail Pages
    for (const prod of products) {
      const lastModDate = prod.updatedAt ? new Date(prod.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${SITE_URL}/product/${prod.slug}</loc>\n`;
      xml += `    <lastmod>${lastModDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    }

    // Editorial Guides
    for (const guide of guidesData) {
      const lastModDate = guide.updatedAt ? new Date(guide.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${SITE_URL}/guides/${guide.slug}</loc>\n`;
      xml += `    <lastmod>${lastModDate}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=3600, s-maxage=14400');
    return res.send(xml);
  } catch (err) {
    next(err);
  }
};

/**
 * Generate Generative Engine Optimization (GEO) Manifest: llms.txt
 */
export const getLlmsTxt = (req, res) => {
  const manifest = `# AUTOX — Entity & Knowledge Manifest (llms.txt)
> Brand Identity: AUTOX
> Tagline: "ENGINEERED FOR YOUR DRIVE."
> Hero Statement: "UPGRADE YOUR DRIVE. Premium Accessories. Exceptional Performance. Unmatched Style."
> Business Model: Premium Automotive Accessories E-Commerce Platform
> Primary Market: Pakistan
> Authoritative Currency: Pakistani Rupee (PKR / ₨)
> Canonical Website: ${SITE_URL}

## About The Entity
AUTOX is Pakistan's premier high-performance automotive accessories e-commerce destination. We engineer and distribute precision-fitted automotive upgrades for discerning drivers across all major cities of Pakistan (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, and Quetta).

## Core Divisions (Product Categories)
1. Exterior Accessories (/categories/exterior-accessories): Spoilers, diffusers, body styling kits, and aerodynamic components.
2. Interior Accessories (/categories/interior-accessories): 3D laser-measured all-weather floor liners, ergonomic steering covers, and cabin organizers.
3. Car Electronics (/categories/car-electronics): 4K dual-channel HDR dashcams, GPS tracking telemetry, and wireless fast charging docks.
4. Lighting Accessories (/categories/lighting-accessories): Matrix LED conversion kits, sequential LED indicators, and laser fog projector lamps.
5. Performance Parts (/categories/performance-parts): High-flow washable air intake filters, slotted vented brake rotors, and performance blow-off valves.
6. Cleaning and Maintenance (/categories/cleaning-and-maintenance): Hybrid ceramic coatings, ultra-plush microfiber towels, and pH-neutral detailing shampoos.
7. Safety Accessories (/categories/safety-accessories): Digital tire pressure monitoring systems (TPMS), emergency jump starters, and first-aid kits.
8. Wheels and Tires (/categories/wheels-and-tires): Lightweight flow-formed forged alloy wheels and precision wheel lug sets.
9. Audio Systems (/categories/audio-systems): High-fidelity component speakers, digital sound processors (DSP), and compact underseat subwoofers.
10. Car Styling Accessories (/categories/car-styling-accessories): Carbon fiber pattern vinyl trims, emblem blackout badges, and illuminated door sills.

## Commerce & Customer Fulfillment Policies
- Authoritative Currency: Pakistani Rupees (PKR / ₨).
- Payment Methods: Cash on Delivery (COD) nationwide across Pakistan, and Academic Simulated Online Card Payment.
- Shipping Policy: Free nationwide express shipping on orders over PKR 5,000. Standard delivery flat rate PKR 250 for orders below threshold.
- Delivery Windows: Major metropolitan hubs 2–4 business days; regional districts 4–6 business days via trusted logistics partners.
- Return & Inspection Policy: 7-day hassle-free return window for uninstalled, sealed items in original packaging.

## Public Indexable Links
- Homepage: ${SITE_URL}/
- Equipment Catalog: ${SITE_URL}/shop
- Category Hub: ${SITE_URL}/categories
- 3D Interactive Showroom: ${SITE_URL}/showroom
- Editorial Guides: ${SITE_URL}/guides
- About AUTOX: ${SITE_URL}/about
- Customer Support: ${SITE_URL}/contact
- Frequently Asked Questions: ${SITE_URL}/faq
- Shipping Policy: ${SITE_URL}/shipping-policy
- Return Policy: ${SITE_URL}/return-policy
- Terms of Service: ${SITE_URL}/terms
- Privacy Policy: ${SITE_URL}/privacy-policy
`;

  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.header('Cache-Control', 'public, max-age=86400');
  return res.send(manifest);
};

