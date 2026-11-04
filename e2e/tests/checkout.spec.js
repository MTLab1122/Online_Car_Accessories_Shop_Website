import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { TEST_USERS } from '../helpers/auth.helper.js';

test.describe('AUTOX — Checkout & Payment Protocol Suite', () => {
  test('should require customer sign in before entering checkout', async ({ page }) => {
    // 1. Ensure user is logged out (clear cookies)
    await page.context().clearCookies();

    // 2. Direct navigate to checkout -> ProtectedRoute redirects immediately to /login
    await page.goto('/checkout', { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/\/login/, { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });

  test('should display Academic Demonstration notice when Simulated Card is selected', async ({ page }) => {
    // Log in as customer
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.locator('main form input[type="email"]').fill(TEST_USERS.customer.email);
    await page.locator('main form input[type="password"]').fill(TEST_USERS.customer.password);
    await page.locator('main form button[type="submit"]').click();
    await page.waitForURL(/\/account/, { timeout: 10000 });

    // Ensure cart has an item
    await page.goto('/shop', { waitUntil: 'domcontentloaded' });
    const addBtn = page.locator('main button[title*="Add to Shopping Cart"]').first();
    await addBtn.waitFor({ state: 'visible', timeout: 15000 });
    await addBtn.click();
    await page.waitForTimeout(600);

    // Go to checkout
    const checkout = new CheckoutPage(page);
    await checkout.goto();

    // Select Simulated Card
    await checkout.selectPaymentMethod('simulated_card');
    await expect(checkout.academicNotice).toBeVisible();
    await expect(page.locator('text=/Academic Demonstration Notice/i')).toBeVisible();
    await expect(page.locator('text=/No real bank transaction occurs/i')).toBeVisible();

    // Switch back to Cash on Delivery
    await checkout.selectPaymentMethod('cod');
    await expect(checkout.academicNotice).not.toBeVisible();
  });
});
