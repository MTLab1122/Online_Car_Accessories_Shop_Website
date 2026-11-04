import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

describe('SEO, AEO & Discovery Engine Test Suite', () => {
  it('GET /robots.txt should return authoritative crawler directives with sitemap reference', async () => {
    const res = await request(app).get('/robots.txt');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/plain/);
    expect(res.text).toContain('User-agent: *');
    expect(res.text).toContain('Disallow: /admin');
    expect(res.text).toContain('Disallow: /checkout');
    expect(res.text).toContain('Disallow: /cart');
    expect(res.text).toContain('Disallow: /account');
    expect(res.text).toContain('Disallow: /api/');
    expect(res.text).toContain('Sitemap: https://autox.pk/sitemap.xml');
  });

  it('GET /sitemap.xml should return valid XML schema with core static, category, product, and guide URLs', async () => {
    // Ensure at least one category and product exist in test memory DB
    const category = await Category.create({
      name: 'Exhaust Systems',
      slug: 'exhaust-systems',
      description: 'Valvetronic titanium exhausts'
    });

    const product = await Product.create({
      name: 'Titanium Cat-Back Exhaust System',
      description: 'Valvetronic titanium exhaust system for high flow and deep acoustic tone',
      category: category._id,
      brand: 'Apex Motorsport',
      price: 185000,
      stock: 5,
      SKU: 'EXH-TITAN-01'
    });

    const res = await request(app).get('/sitemap.xml');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/xml|text\/xml/);
    expect(res.text).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(res.text).toContain('<loc>https://autox.pk/</loc>');
    expect(res.text).toContain('<loc>https://autox.pk/shop</loc>');
    expect(res.text).toContain('<loc>https://autox.pk/categories</loc>');
    expect(res.text).toContain('<loc>https://autox.pk/guides</loc>');
    expect(res.text).toContain(`<loc>https://autox.pk/categories/${category.slug}</loc>`);
    expect(res.text).toContain(`<loc>https://autox.pk/product/${product.slug}</loc>`);
    expect(res.text).toContain('</urlset>');
  });

  it('GET /llms.txt should return authoritative AI agent knowledge manifest', async () => {
    const res = await request(app).get('/llms.txt');

    expect(res.status).toBe(200);
    expect(res.text).toContain('# AUTOX — Entity & Knowledge Manifest');
    expect(res.text).toContain('ENGINEERED FOR YOUR DRIVE');
    expect(res.text).toContain('Pakistani Rupee (PKR / ₨)');
    expect(res.text).toContain('Cash on Delivery');
  });

  it('GET /api/v1/guides should return topical authority editorial guides', async () => {
    const res = await request(app).get('/api/v1/guides');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);

    const firstGuide = res.body.data[0];
    expect(firstGuide).toHaveProperty('slug');
    expect(firstGuide).toHaveProperty('title');
    expect(firstGuide).toHaveProperty('excerpt');
    expect(firstGuide).toHaveProperty('readTime');
  });

  it('GET /api/v1/guides/:slug should return individual guide details with sections', async () => {
    const res = await request(app).get('/api/v1/guides/car-accessories-buying-guide-pakistan');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('car-accessories-buying-guide-pakistan');
    expect(res.body.data.sections.length).toBeGreaterThan(0);
    expect(res.body.data.relatedCategories).toContain('interior-accessories');
  });

  it('GET /api/v1/guides/:slug with invalid slug should return 404', async () => {
    const res = await request(app).get('/api/v1/guides/non-existent-cluster-slug-123');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
