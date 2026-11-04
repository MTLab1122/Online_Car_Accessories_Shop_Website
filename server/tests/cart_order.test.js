import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';

describe('Cart, Coupon & Order Fulfillment Test Suite', () => {
  let customerToken;
  let testProduct;
  let testCoupon;

  beforeEach(async () => {
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Coupon.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();

    const cat = await Category.create({ name: 'Car Electronics', slug: 'car-electronics' });

    testProduct = await Product.create({
      name: '4K Dual Dashcam',
      SKU: 'TST-CAM-01',
      description: 'High-end dashcam with Starvis night sensor.',
      category: cat._id,
      brand: 'Vanguard Vision',
      price: 30000,
      discountPercentage: 0,
      stock: 5,
      images: ['https://example.com/cam.jpg']
    });

    testCoupon = await Coupon.create({
      code: 'TEST10',
      discountType: 'percentage',
      discountValue: 10,
      minimumOrderAmount: 5000,
      maximumDiscount: 5000,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: 100,
      isActive: true
    });

    const custRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Bilal Khan',
        email: 'bilal.khan@example.pk',
        password: 'Password123!'
      });
    customerToken = custRes.body.token;
  });

  it('POST /api/v1/cart/items — should add product to user cart and compute totals', async () => {
    const res = await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        productId: String(testProduct._id),
        quantity: 2
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.itemCount).toBe(2);
    expect(res.body.data.subtotal).toBe(60000);
  });

  it('POST /api/v1/cart/coupon — should apply valid coupon and calculate discount', async () => {
    // Add item first
    await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ productId: String(testProduct._id), quantity: 1 });

    const couponRes = await request(app)
      .post('/api/v1/cart/coupon')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ code: 'TEST10' });

    expect(couponRes.status).toBe(200);
    expect(couponRes.body.success).toBe(true);
    expect(couponRes.body.data.discount).toBe(3000); // 10% of 30,000
    expect(couponRes.body.data.total).toBe(27000);
  });

  it('POST /api/v1/orders — should create validated order, deduct stock, and clear cart', async () => {
    // Add 2 units to cart
    await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ productId: String(testProduct._id), quantity: 2 });

    const orderRes = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        shippingAddress: {
          fullName: 'Bilal Khan',
          phone: '+92 300 9876543',
          street: 'Main Boulevard, Gulberg III',
          city: 'Lahore',
          province: 'Punjab',
          postalCode: '54660'
        },
        paymentMethod: 'cod'
      });

    expect(orderRes.status).toBe(201);
    expect(orderRes.body.success).toBe(true);
    expect(orderRes.body.data.orderNumber).toMatch(/^AOX-/);
    expect(orderRes.body.data.total).toBe(60000);

    // Verify stock was deducted in database from 5 down to 3
    const updatedProduct = await Product.findById(testProduct._id);
    expect(updatedProduct.stock).toBe(3);

    // Verify cart was cleared
    const cartRes = await request(app)
      .get('/api/v1/cart')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(cartRes.body.data.items.length).toBe(0);
  });

  it('POST /api/v1/orders — should reject order if requested quantity exceeds available stock', async () => {
    // Attempt to order 6 units when stock is only 5
    const addRes = await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ productId: String(testProduct._id), quantity: 6 });

    expect(addRes.status).toBe(400);
    expect(addRes.body.message).toMatch(/insufficient stock/i);
  });
});
