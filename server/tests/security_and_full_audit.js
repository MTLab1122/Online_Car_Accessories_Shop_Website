import axios from 'axios';
import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:5000/api/v1';

async function runSecurityAndFullAudit() {
  console.log('================================================================');
  console.log('🛡️  AUTOX DEEP SECURITY & FULL-SITE FUNCTIONALITY AUDIT');
  console.log(`📡 Backend:  ${API_URL}`);
  console.log(`💻 Frontend: ${BASE_URL}`);
  console.log(`⏰ Time:     ${new Date().toISOString()}`);
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, desc, error = null) => {
    if (condition) {
      console.log(`✅ [AUDIT PASS] ${desc}`);
      passed++;
    } else {
      console.error(`❌ [AUDIT FAIL] ${desc}`, error || '');
      failed++;
    }
  };

  // -----------------------------------------------------------------
  // 1. SECURITY AUDIT: HTTP Security Headers
  // -----------------------------------------------------------------
  console.log('\n--- 1. HTTP Security Headers Audit ---');
  try {
    const res = await axios.get('http://localhost:5000/api/health');
    assert(res.headers['x-content-type-options'] === 'nosniff', 'Helmet active: X-Content-Type-Options: nosniff');
    assert(res.headers['x-frame-options'] === 'SAMEORIGIN' || res.headers['cross-origin-resource-policy'] !== undefined, 'Helmet active: Frame/Origin protection');
  } catch (err) {
    assert(false, 'Security headers verification', err.message);
  }

  // -----------------------------------------------------------------
  // 2. SECURITY AUDIT: RBAC Authorization Gatekeeper
  // -----------------------------------------------------------------
  console.log('\n--- 2. RBAC & Access Control Audit ---');

  // Unauthenticated access to admin endpoints
  try {
    await axios.get(`${API_URL}/admin/dashboard`);
    assert(false, 'Unauthenticated access to /admin/dashboard must be rejected');
  } catch (err) {
    assert(err.response?.status === 401, 'Unauthenticated /admin/dashboard blocked with 401 Unauthorized');
  }

  // Customer credentials login
  let customerToken = '';
  try {
    const res = await axios.post(`${API_URL}/auth/login`, {
      email: 'hamza.tariq@example.pk',
      password: 'Password123!'
    });
    customerToken = res.data.token;
    assert(customerToken && res.data.data.role === 'customer', 'Customer authenticated successfully');
  } catch (err) {
    assert(false, 'Customer login failed', err.message);
  }

  // Customer attempting to access Admin endpoint
  try {
    await axios.get(`${API_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(false, 'Customer accessing /admin/dashboard must be forbidden');
  } catch (err) {
    assert(err.response?.status === 403, 'Customer accessing /admin/dashboard blocked with 403 Forbidden');
  }

  // Customer attempting to create a product (Admin only)
  try {
    await axios.post(`${API_URL}/products`, {
      name: 'Hacked Product',
      price: 100
    }, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(false, 'Customer creating product must be forbidden');
  } catch (err) {
    assert(err.response?.status === 403, 'Customer product creation blocked with 403 Forbidden');
  }

  // -----------------------------------------------------------------
  // 3. SECURITY AUDIT: Input Validation & Injection Resistance
  // -----------------------------------------------------------------
  console.log('\n--- 3. Validation & Injection Resistance Audit ---');

  // Attempt NoSQL Operator Injection in login
  try {
    await axios.post(`${API_URL}/auth/login`, {
      email: { $gt: '' },
      password: 'randomPassword123'
    });
    assert(false, 'NoSQL operator injection in login must be rejected');
  } catch (err) {
    assert(err.response?.status === 400, 'NoSQL injection safely rejected by Zod validator with 400 Bad Request');
  }

  // Attempt Malformed Product ID query
  try {
    await axios.get(`${API_URL}/products/invalid-id-format-12345`);
    assert(false, 'Invalid product slug should return 404');
  } catch (err) {
    assert(err.response?.status === 404, 'Invalid product query returns graceful 404 (No crash)');
  }

  // -----------------------------------------------------------------
  // 4. FUNCTIONALITY AUDIT: Catalog Sorting, Filtering, and Pagination
  // -----------------------------------------------------------------
  console.log('\n--- 4. Catalog Search, Sorting & Filtering Audit ---');

  try {
    // Sort by price ascending
    const ascRes = await axios.get(`${API_URL}/products?sort=price-asc&limit=5`);
    const prices = ascRes.data.data.map(p => p.price);
    const isSortedAsc = prices.every((p, i, arr) => i === 0 || arr[i - 1] <= p);
    assert(isSortedAsc, 'Sort by price ascending produces verified sorted records');

    // Sort by price descending
    const descRes = await axios.get(`${API_URL}/products?sort=price-desc&limit=5`);
    const descPrices = descRes.data.data.map(p => p.price);
    const isSortedDesc = descPrices.every((p, i, arr) => i === 0 || arr[i - 1] >= p);
    assert(isSortedDesc, 'Sort by price descending produces verified sorted records');

    // Category filter
    const catRes = await axios.get(`${API_URL}/products?category=exterior-accessories`);
    assert(catRes.data.data.length > 0, `Category filter returned ${catRes.data.data.length} exterior accessories`);

    // In-stock only filter
    const stockRes = await axios.get(`${API_URL}/products?inStock=true`);
    const allInStock = stockRes.data.data.every(p => p.stock > 0);
    assert(allInStock, 'In-stock filter returns only products with stock > 0');
  } catch (err) {
    assert(false, 'Catalog filtering/sorting failed', err.message);
  }

  // -----------------------------------------------------------------
  // 5. FUNCTIONALITY AUDIT: Business Logic & Stock Deduction
  // -----------------------------------------------------------------
  console.log('\n--- 5. Business Logic & Stock Integrity Audit ---');

  try {
    const productsRes = await axios.get(`${API_URL}/products?limit=1`);
    const prod = productsRes.data.data[0];

    try {
      await axios.post(`${API_URL}/cart/items`, {
        productId: prod._id,
        quantity: 99999
      }, {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      assert(false, 'Adding quantity exceeding available stock must be rejected');
    } catch (err) {
      assert(err.response?.status === 400,
        `Over-stock protection active: cart controller rejected excessive quantity with 400 (${err.response?.data?.message})`);
    }
  } catch (err) {
    assert(false, 'Stock validation test error', err.message);
  }

  // -----------------------------------------------------------------
  // 6. BROWSER AUDIT: Comprehensive Route Rendering (Headless Chrome)
  // -----------------------------------------------------------------
  console.log('\n--- 6. Browser Experience & Navigation Audit (Chrome) ---');

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const testedRoutes = [
    { path: '/', expected: 'UPGRADE' },
    { path: '/shop', expected: 'Shop Accessories' },
    { path: '/categories', expected: 'Divisions' },
    { path: '/showroom', expected: 'Showroom', wait: 'domcontentloaded' },
    { path: '/about', expected: 'AUTOX' },
    { path: '/contact', expected: 'Contact' },
    { path: '/faq', expected: 'Questions' },
    { path: '/cart', expected: 'Cart' },
    { path: '/login', expected: 'Access Cockpit' },
    { path: '/register', expected: 'Register Pilot' },
    { path: '/forgot-password', expected: 'Reset Password' },
    { path: '/privacy-policy', expected: 'Privacy' },
    { path: '/privacy', expected: 'Privacy' },
    { path: '/terms', expected: 'Terms' },
    { path: '/shipping-policy', expected: 'Shipping' },
    { path: '/shipping', expected: 'Shipping' },
    { path: '/return-policy', expected: 'Return' },
    { path: '/returns', expected: 'Return' }
  ];

  for (const r of testedRoutes) {
    try {
      await page.goto(`${BASE_URL}${r.path}`, { waitUntil: r.wait || 'networkidle' });
      const text = await page.innerText('body');
      const normalized = text.replace(/\s+/g, ' ').toLowerCase();
      const found = normalized.includes(r.expected.toLowerCase());
      assert(found, `Route ${r.path} rendered successfully with expected content ("${r.expected}")`);
    } catch (err) {
      assert(false, `Route ${r.path} failed to render cleanly`, err.message);
    }
  }

  await browser.close();

  // -----------------------------------------------------------------
  // FINAL SCORECARD
  // -----------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`📊 AUDIT COMPLETE: ${passed} PASSED | ${failed} FAILED`);
  console.log(`🎯 Reliability Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityAndFullAudit();
