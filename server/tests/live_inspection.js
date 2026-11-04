import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';
const CLIENT_BASE = 'http://localhost:5173';

const log = (step, msg, ok = true) => {
  const icon = ok ? '✅' : '❌';
  console.log(`${icon} [${step}] ${msg}`);
};

const fail = (step, msg, err) => {
  console.error(`❌ [${step}] FAILED: ${msg}`, err?.response?.data || err?.message || err);
  process.exit(1);
};

async function runLiveInspection() {
  console.log('================================================================');
  console.log('🚗 AUTOX LIVE SYSTEM INSPECTION & CRUD VERIFICATION');
  console.log(`📡 Backend Target:  ${API_BASE}`);
  console.log(`💻 Frontend Target: ${CLIENT_BASE}`);
  console.log('================================================================\n');

  // 1. Health & Frontend Reachability
  try {
    const health = await axios.get('http://localhost:5000/api/health');
    log('HEALTH', `Backend API is healthy (status: ${health.data.status})`);
  } catch (err) {
    fail('HEALTH', 'Cannot reach backend /api/health', err);
  }

  try {
    const fe = await axios.get(CLIENT_BASE);
    log('FRONTEND', `Frontend HTML served with HTTP ${fe.status}`);
  } catch (err) {
    fail('FRONTEND', 'Cannot reach frontend Vite dev server', err);
  }

  // 2. Navigation & Public Catalog Read
  let categories = [];
  try {
    const res = await axios.get(`${API_BASE}/categories`);
    categories = res.data.data;
    log('CATALOG', `Fetched ${categories.length} categories (expected >= 10)`);
    if (categories.length < 10) throw new Error('Less than 10 categories found');
  } catch (err) {
    fail('CATALOG', 'Failed to fetch categories', err);
  }

  let products = [];
  try {
    const res = await axios.get(`${API_BASE}/products?limit=50`);
    products = res.data.data;
    log('CATALOG', `Fetched ${products.length} products (expected >= 31)`);
    if (products.length < 31) throw new Error('Less than 31 products found');
  } catch (err) {
    fail('CATALOG', 'Failed to fetch products', err);
  }

  // Filter test
  try {
    const filterCat = categories[0].slug;
    const res = await axios.get(`${API_BASE}/products?category=${filterCat}`);
    log('FILTER', `Category filter '${filterCat}' returned ${res.data.data.length} products`);
  } catch (err) {
    fail('FILTER', 'Category filter query failed', err);
  }

  // Search test
  try {
    const res = await axios.get(`${API_BASE}/products?search=Carbon`);
    log('SEARCH', `Search for 'Carbon' returned ${res.data.data.length} matching products`);
  } catch (err) {
    fail('SEARCH', 'Search query failed', err);
  }

  // Product details by slug
  const sampleProduct = products[0];
  try {
    const res = await axios.get(`${API_BASE}/products/${sampleProduct.slug}`);
    const details = res.data.data.product || res.data.data;
    log('DETAILS', `Retrieved details for '${details.name}' (PKR ₨ ${details.price})`);
  } catch (err) {
    fail('DETAILS', `Failed to get product details for slug ${sampleProduct.slug}`, err);
  }

  // 3. User Authentication & Customer Flow
  let customerToken = '';
  let customerUser = null;
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, {
      email: 'hamza.tariq@example.pk',
      password: 'Password123!'
    });
    customerToken = res.data.token;
    customerUser = res.data.data;
    log('AUTH', `Customer login successful as: ${customerUser.name} (${customerUser.email})`);
  } catch (err) {
    fail('AUTH', 'Customer login failed', err);
  }

  const customerAuth = { headers: { Authorization: `Bearer ${customerToken}` } };

  // Profile read and update
  try {
    const updateRes = await axios.patch(`${API_BASE}/users/profile`, {
      phone: '+92 300 9876543'
    }, customerAuth);
    log('USER CRUD', `Updated customer profile phone to: ${updateRes.data.data.phone}`);

    const addrRes = await axios.post(`${API_BASE}/users/addresses`, {
      fullName: 'Hamza Tariq',
      phone: '+92 300 9876543',
      street: 'House 42, Street 7, Sector F-7/2',
      city: 'Islamabad',
      province: 'Islamabad Capital Territory',
      postalCode: '44000',
      isDefault: true
    }, customerAuth);
    log('USER CRUD', `Added address for customer in: Islamabad`);
  } catch (err) {
    fail('USER CRUD', 'Profile update failed', err);
  }

  // 4. Cart CRUD Operations
  try {
    // Add product to cart
    const addRes = await axios.post(`${API_BASE}/cart`, {
      productId: sampleProduct._id,
      quantity: 2
    }, customerAuth);
    log('CART CRUD', `Added '${sampleProduct.name}' (qty: 2) to cart. Subtotal: PKR ₨ ${addRes.data.data.subtotal}`);

    // Update quantity
    const updateCartRes = await axios.patch(`${API_BASE}/cart/${sampleProduct._id}`, {
      quantity: 3
    }, customerAuth);
    log('CART CRUD', `Updated cart quantity to 3. New subtotal: PKR ₨ ${updateCartRes.data.data.subtotal}`);

    // Read cart
    const getCartRes = await axios.get(`${API_BASE}/cart`, customerAuth);
    log('CART CRUD', `Retrieved cart with ${getCartRes.data.data.items.length} items`);
  } catch (err) {
    fail('CART CRUD', 'Cart operations failed', err);
  }

  // 5. Wishlist CRUD Operations
  try {
    const wishRes = await axios.post(`${API_BASE}/wishlist/${sampleProduct._id}`, {}, customerAuth);
    log('WISHLIST CRUD', `Added product to wishlist. Current count: ${wishRes.data.data.length}`);

    const getWish = await axios.get(`${API_BASE}/wishlist`, customerAuth);
    log('WISHLIST CRUD', `Retrieved customer wishlist with ${getWish.data.data.length} items`);

    const delWish = await axios.delete(`${API_BASE}/wishlist/${sampleProduct._id}`, customerAuth);
    log('WISHLIST CRUD', `Removed product from wishlist. Remaining count: ${delWish.data.data.length}`);
  } catch (err) {
    fail('WISHLIST CRUD', 'Wishlist operations failed', err);
  }

  // 6. Promotional Coupon Validation
  try {
    const couponRes = await axios.post(`${API_BASE}/coupons/validate`, {
      code: 'AUTOX10',
      cartTotal: 10000
    });
    log('COUPON', `Coupon 'AUTOX10' validated successfully! Discount: PKR ₨ ${couponRes.data.data.discountAmount}`);
  } catch (err) {
    fail('COUPON', 'Coupon validation failed', err);
  }

  // 7. Order Placement & Customer Order Retrieval
  let createdOrderId = null;
  try {
    const orderPayload = {
      shippingAddress: {
        fullName: 'Hamza Tariq',
        phone: '+92 300 9876543',
        street: 'House 42, Street 7, Sector F-7/2',
        city: 'Islamabad',
        province: 'Islamabad Capital Territory',
        postalCode: '44000'
      },
      paymentMethod: 'cod'
    };

    const orderRes = await axios.post(`${API_BASE}/orders`, orderPayload, customerAuth);
    createdOrderId = orderRes.data.data._id;
    const orderNumber = orderRes.data.data.orderNumber;
    log('ORDER CRUD', `Order placed successfully! Tracking #: ${orderNumber} (ID: ${createdOrderId})`);

    const myOrdersRes = await axios.get(`${API_BASE}/orders/my`, customerAuth);
    log('ORDER CRUD', `Retrieved ${myOrdersRes.data.data.length} orders for customer`);
  } catch (err) {
    fail('ORDER CRUD', 'Order placement failed', err);
  }

  // 8. Admin Authentication & Management CRUD Operations
  let adminToken = '';
  let adminUser = null;
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@autox.pk',
      password: 'Admin@AutoX2026!'
    });
    adminToken = res.data.token;
    adminUser = res.data.data;
    log('ADMIN AUTH', `Admin login successful as: ${adminUser.name} (${adminUser.role})`);
  } catch (err) {
    fail('ADMIN AUTH', 'Admin login failed', err);
  }

  const adminAuth = { headers: { Authorization: `Bearer ${adminToken}` } };

  // Admin Overview Analytics
  try {
    const overviewRes = await axios.get(`${API_BASE}/admin/dashboard`, adminAuth);
    const metrics = overviewRes.data.data.metrics || overviewRes.data.data;
    log('ADMIN ANALYTICS', `Stats fetched — Gross Revenue: PKR ₨ ${metrics.totalRevenue}, Orders: ${metrics.totalOrders}, Customers: ${metrics.totalCustomers}, Products: ${metrics.totalProducts}`);
  } catch (err) {
    fail('ADMIN ANALYTICS', 'Failed to fetch admin overview', err);
  }

  // Admin Order Status Update
  try {
    const statusRes = await axios.patch(`${API_BASE}/admin/orders/${createdOrderId}/status`, {
      orderStatus: 'processing'
    }, adminAuth);
    log('ADMIN ORDER CRUD', `Updated order ${createdOrderId} status to: ${statusRes.data.data.orderStatus}`);

    const shipRes = await axios.patch(`${API_BASE}/admin/orders/${createdOrderId}/status`, {
      orderStatus: 'shipped'
    }, adminAuth);
    log('ADMIN ORDER CRUD', `Updated order ${createdOrderId} status to: ${shipRes.data.data.orderStatus}`);
  } catch (err) {
    fail('ADMIN ORDER CRUD', 'Admin order status update failed', err);
  }

  // Admin Category CRUD: Create, Update, Delete
  let testCatId = null;
  try {
    const newCat = await axios.post(`${API_BASE}/categories`, {
      name: 'Custom Turbo Accessories',
      description: 'High boost turbo kits and intercooler components'
    }, adminAuth);
    testCatId = newCat.data.data._id;
    log('CATEGORY CRUD', `Created test category: '${newCat.data.data.name}' (ID: ${testCatId})`);

    const updatedCat = await axios.put(`${API_BASE}/categories/${testCatId}`, {
      name: 'Custom High-Flow Turbo Accessories'
    }, adminAuth);
    log('CATEGORY CRUD', `Updated test category name to: '${updatedCat.data.data.name}'`);
  } catch (err) {
    fail('CATEGORY CRUD', 'Category CRUD operations failed', err);
  }

  // Admin Product CRUD: Create, Update, Delete
  let testProdId = null;
  try {
    const newProd = await axios.post(`${API_BASE}/products`, {
      name: 'Titanium Billet Blow-Off Valve 50mm',
      category: testCatId.toString(),
      brand: 'AutoX Performance',
      SKU: `ATX-BOV-${Date.now().toString().slice(-4)}`,
      price: 28500,
      stock: 15,
      shortDescription: 'High precision atmospheric blow-off valve for turbocharged applications.',
      description: 'Manufactured from 6061 billet aluminum with titanium accents for ultimate throttle response and turbo surge protection.',
      images: ['https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80']
    }, adminAuth);
    testProdId = newProd.data.data._id;
    log('PRODUCT CRUD', `Created test product: '${newProd.data.data.name}' at PKR ₨ ${newProd.data.data.price} (ID: ${testProdId})`);

    // Update product price & stock
    const updatedProd = await axios.put(`${API_BASE}/products/${testProdId}`, {
      price: 29999,
      stock: 20
    }, adminAuth);
    log('PRODUCT CRUD', `Updated product price to PKR ₨ ${updatedProd.data.data.price} and stock to ${updatedProd.data.data.stock}`);

    // Delete test product
    await axios.delete(`${API_BASE}/products/${testProdId}`, adminAuth);
    log('PRODUCT CRUD', `Successfully deleted test product (${testProdId})`);

    // Delete test category
    await axios.delete(`${API_BASE}/categories/${testCatId}`, adminAuth);
    log('CATEGORY CRUD', `Successfully deleted test category (${testCatId})`);
  } catch (err) {
    fail('PRODUCT CRUD', 'Product CRUD operations failed', err);
  }

  // 9. Contact & Newsletter
  try {
    const contactRes = await axios.post(`${API_BASE}/contact`, {
      name: 'Test Customer',
      email: 'customer.test@example.pk',
      phone: '+92 300 1234567',
      subject: 'Inquiry regarding 3D Configurator',
      message: 'Can I inspect performance exhaust systems in the 3D showroom?'
    });
    log('CONTACT FORM', `Submitted contact form message (ID: ${contactRes.data.data._id})`);

    const newsRes = await axios.post(`${API_BASE}/newsletter/subscribe`, {
      email: `newsletter_${Date.now()}@example.pk`
    });
    log('NEWSLETTER', `Subscribed user to automotive newsletter: ${newsRes.data.data.email}`);
  } catch (err) {
    fail('CONTACT/NEWSLETTER', 'Contact or newsletter endpoint failed', err);
  }

  // 10. Frontend Route Verification
  const frontendRoutes = [
    '/',
    '/shop',
    '/categories',
    '/about',
    '/contact',
    '/faq',
    '/cart',
    '/checkout',
    '/login',
    '/register',
    '/logo.svg'
  ];

  console.log('\n--- Checking Frontend Navigations & Assets ---');
  for (const route of frontendRoutes) {
    try {
      const res = await axios.get(`${CLIENT_BASE}${route}`);
      log('NAV ROUTE', `${route} returned HTTP ${res.status}`);
    } catch (err) {
      fail('NAV ROUTE', `Frontend route ${route} failed to respond`, err);
    }
  }

  console.log('\n================================================================');
  console.log('🎉 ALL LIVE INSPECTIONS, NAVIGATIONS & CRUD OPERATIONS PASSED!');
  console.log('================================================================\n');
}

runLiveInspection();
