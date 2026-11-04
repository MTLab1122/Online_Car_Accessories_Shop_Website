import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

describe('Products & Catalog API Test Suite', () => {
  let sampleCategory;
  let adminToken;
  let customerToken;

  beforeEach(async () => {
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    sampleCategory = await Category.create({
      name: 'Exterior Accessories',
      slug: 'exterior-accessories',
      description: 'Aerodynamic track kits'
    });

    // Create Admin
    const adminRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@autox.pk',
        password: 'AdminPassword123!'
      });
    // Promote user to admin in DB
    await User.updateOne({ email: 'admin@autox.pk' }, { role: 'admin' });
    const adminLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@autox.pk', password: 'AdminPassword123!' });
    adminToken = adminLogin.body.token;

    // Create Customer
    const custRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Customer User',
        email: 'customer@example.pk',
        password: 'Password123!'
      });
    customerToken = custRes.body.token;

    // Seed test products
    await Product.create([
      {
        name: 'Carbon Fiber GT Wing',
        SKU: 'TST-GT-01',
        description: 'Track aero wing with autoclave dry weave.',
        category: sampleCategory._id,
        brand: 'AeroCraft Pro',
        price: 85000,
        discountPercentage: 10,
        stock: 12,
        images: ['https://example.com/wing.jpg'],
        isFeatured: true
      },
      {
        name: 'Front Splitter Lip',
        SKU: 'TST-SPL-02',
        description: 'Gloss black aerodynamics splitter.',
        category: sampleCategory._id,
        brand: 'Veloce Dynamics',
        price: 24000,
        discountPercentage: 0,
        stock: 8,
        images: ['https://example.com/splitter.jpg']
      }
    ]);
  });

  it('GET /api/v1/products — should return list of products with pagination', async () => {
    const res = await request(app).get('/api/v1/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.pagination.total).toBe(2);
  });

  it('GET /api/v1/products?search=Wing — should search products by name or description', async () => {
    const res = await request(app).get('/api/v1/products?search=Wing');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toContain('Wing');
  });

  it('GET /api/v1/products?brand=AeroCraft Pro — should filter products by brand', async () => {
    const res = await request(app).get('/api/v1/products?brand=AeroCraft%20Pro');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].brand).toBe('AeroCraft Pro');
  });

  it('POST /api/v1/products — should reject product creation by non-admin customer', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'Unauthorized Product',
        SKU: 'TST-UNAUTH',
        description: 'Unauthorized product description',
        category: sampleCategory._id,
        brand: 'AeroCraft Pro',
        price: 5000,
        stock: 5
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/products — should permit product creation by authorized administrator', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Admin Authorized Spoiler',
        SKU: 'TST-AUTH-03',
        description: 'Legitimate admin created product description',
        category: String(sampleCategory._id),
        brand: 'AeroCraft Pro',
        price: 45000,
        stock: 10
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Admin Authorized Spoiler');
  });
});

