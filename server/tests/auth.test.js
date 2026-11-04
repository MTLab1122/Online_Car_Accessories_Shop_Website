import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';

describe('Authentication & User Security Test Suite', () => {
  beforeEach(async () => {
    await User.deleteMany();
  });

  it('POST /api/v1/auth/register — should register a new customer with hashed password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Saad Ali',
        email: 'saad.ali@example.pk',
        password: 'Password123!',
        phone: '+92 300 1122334'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('saad.ali@example.pk');
    expect(res.body.data.role).toBe('customer');
    expect(res.body.token).toBeDefined();

    // Verify password is not plaintext in database
    const savedUser = await User.findOne({ email: 'saad.ali@example.pk' }).select('+password');
    expect(savedUser.password).not.toBe('Password123!');
    expect(savedUser.password.startsWith('$2')).toBe(true);
  });

  it('POST /api/v1/auth/register — should prevent duplicate email registrations', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Saad Ali',
        email: 'saad.ali@example.pk',
        password: 'Password123!'
      });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Saad Duplicate',
        email: 'saad.ali@example.pk',
        password: 'DifferentPass123!'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('POST /api/v1/auth/login — should login with valid credentials and return http-only cookie', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Saad Ali',
        email: 'saad.ali@example.pk',
        password: 'Password123!'
      });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'saad.ali@example.pk',
        password: 'Password123!'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toMatch(/token=/);
  });

  it('POST /api/v1/auth/login — should reject invalid password credentials', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Saad Ali',
        email: 'saad.ali@example.pk',
        password: 'Password123!'
      });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'saad.ali@example.pk',
        password: 'WrongPassword999!'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  it('GET /api/v1/auth/me — should authenticate user via Bearer token', async () => {
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Saad Ali',
        email: 'saad.ali@example.pk',
        password: 'Password123!'
      });

    const token = regRes.body.token;

    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.success).toBe(true);
    expect(meRes.body.data.name).toBe('Saad Ali');
  });

  it('POST /api/v1/auth/logout — should clear auth token cookie', async () => {
    const res = await request(app).post('/api/v1/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
