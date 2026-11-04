import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { ProductDetailPage } from '../pages/ProductDetailPage.js';
import { CartDrawerPage } from '../pages/CartDrawerPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { loginAsCustomer, TEST_USERS } from '../helpers/auth.helper.js';
import {
  findOrderByNumber,
  getProductBySlug,
  closeDbConnection
} from '../helpers/db.helper.js';

test.describe('AUTOX — End-to-End Real Customer Purchase Journey', () => {
  test.setTimeout(60000);

  test.afterAll(async () => {
    await closeDbConnection();
  });

  test('should complete full customer order with Cash on Delivery and verify backend persistence', async ({ page }) => {
    // 1. Authenticate customer first
    await loginAsCustomer(page, TEST_USERS.customer);

    // 2. Open AUTOX Homepage & verify branding
    const home = new HomePage(page);
    await home.goto();
    await expect(home.brandLogo).toBeVisible();
    await expect(home.heroHeadline).toBeVisible();

    // 3. Navigate to Shop
    await page.goto('/shop', { waitUntil: 'domcontentloaded' });

    // 4. Open product details
    const productCard = page.locator('main a[href*="/product/"]').first();
    await productCard.waitFor({ state: 'visible', timeout: 15000 });
    await productCard.click();
    await page.waitForURL(/\/product\//, { timeout: 10000 });

    const pdp = new ProductDetailPage(page);
    const productName = await pdp.title.textContent();
    expect(productName).toBeTruthy();

    // Verify PKR price and stock availability
    await expect(pdp.price).toBeVisible();
    await expect(pdp.stockBadge).toBeVisible();

    // Record slug from current URL for database verification
    const currentUrl = page.url();
    const productSlug = currentUrl.split('/product/')[1]?.split('?')[0];

    // Read initial database stock before order
    const initialProductDoc = await getProductBySlug(productSlug);
    const initialStock = initialProductDoc?.stock || 0;
    expect(initialStock).toBeGreaterThan(0);

    // 5. Add product to cart
    await pdp.addToCart();

    // 6. Verify slide-out cart drawer opens with item
    const cart = new CartDrawerPage(page);
    await expect(cart.drawer).toBeVisible({ timeout: 10000 });
    await cart.waitForItem();
    await expect(cart.checkoutButton).toBeVisible();

    // 7. Proceed to checkout
    await cart.proceedToCheckout();

    // 8. Fill delivery information
    const checkout = new CheckoutPage(page);
    await checkout.fillDeliveryAddress({
      fullName: 'Hamza Tariq',
      phone: '+92 300 9876543',
      street: 'House 42, Block D, DHA Phase 5',
      city: 'Lahore',
      province: 'Punjab',
      postalCode: '54792'
    });

    // 9. Select Cash on Delivery
    await checkout.selectPaymentMethod('cod');

    // 10. Submit the order
    await checkout.submitOrder();

    // 11. Verify UI Order Confirmation & Order Number
    const orderNumber = await checkout.getConfirmedOrderNumber();
    expect(orderNumber).toBeTruthy();
    expect(orderNumber).toMatch(/^AOX-\d{8}-[\w-]+$/);

    // 12. Direct Database Verification
    const orderInDb = await findOrderByNumber(orderNumber);
    expect(orderInDb).toBeTruthy();
    expect(orderInDb.paymentMethod).toBe('cod');
    expect(['placed', 'pending', 'confirmed']).toContain(orderInDb.orderStatus);
    expect(orderInDb.items.length).toBeGreaterThanOrEqual(1);

    // 13. Verify inventory deduction
    const updatedProductDoc = await getProductBySlug(productSlug);
    expect(updatedProductDoc.stock).toBeLessThan(initialStock);
  });
});
