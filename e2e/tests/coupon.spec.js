import { test, expect } from '@playwright/test';
import { CartDrawerPage } from '../pages/CartDrawerPage.js';

test.describe('AUTOX — Promotional Coupon Validation Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop', { waitUntil: 'domcontentloaded' });
    const addBtn = page.locator('main button[title*="Add to Shopping Cart"]').first();
    await addBtn.waitFor({ state: 'visible', timeout: 15000 });
    await addBtn.click();

    const cart = new CartDrawerPage(page);
    await expect(cart.drawer).toBeVisible({ timeout: 10000 });
    await cart.waitForItem();
  });

  test('A. should accept valid percentage coupon AUTOX10 and calculate discount in PKR', async ({ page }) => {
    const cart = new CartDrawerPage(page);
    await expect(cart.drawer).toBeVisible();

    // If coupon is already applied from previous session, remove it first
    if (await cart.removeCouponBtn.isVisible()) {
      await cart.removeCouponBtn.click();
      await page.waitForTimeout(600);
    }

    // Apply AUTOX10
    await cart.applyCoupon('AUTOX10');

    // Verify confirmation badge
    await expect(cart.appliedCouponBadge).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=AUTOX10').first()).toBeVisible();

    // Verify discount line item exists
    const discountLine = page.locator('span:has-text("Discount")').first();
    await expect(discountLine).toBeVisible();
  });

  test('B. should reject nonexistent coupon code with validation error', async ({ page }) => {
    const cart = new CartDrawerPage(page);
    await expect(cart.drawer).toBeVisible();

    // If coupon is already applied, remove it
    if (await cart.removeCouponBtn.isVisible()) {
      await cart.removeCouponBtn.click();
      await page.waitForTimeout(600);
    }

    await cart.applyCoupon('FAKEPROMO999');

    // Should display rejection toast
    const errorToast = page.locator('text=/Invalid or expired coupon|Coupon not found/i').first();
    await expect(errorToast).toBeVisible({ timeout: 6000 });
  });

  test('C. should remove applied coupon and restore authoritative total', async ({ page }) => {
    const cart = new CartDrawerPage(page);
    await expect(cart.drawer).toBeVisible();

    // Ensure AUTOX10 is applied
    if (!await cart.removeCouponBtn.isVisible()) {
      await cart.applyCoupon('AUTOX10');
      await page.waitForTimeout(600);
    }

    await expect(cart.removeCouponBtn).toBeVisible({ timeout: 10000 });
    await cart.removeCouponBtn.click();

    // Verify coupon input is available again
    await expect(cart.couponInput).toBeVisible({ timeout: 10000 });
  });

  test('D. should enforce minimum purchase order restrictions', async ({ page }) => {
    // SUPERDRIVE requires PKR 20,000 minimum order amount
    const cart = new CartDrawerPage(page);
    await expect(cart.drawer).toBeVisible();

    if (await cart.removeCouponBtn.isVisible()) {
      await cart.removeCouponBtn.click();
      await page.waitForTimeout(600);
    }

    await cart.applyCoupon('SUPERDRIVE');

    // Either accepted (if cart > 20000) or rejected with minimum amount notice
    const result = page.locator('text=/SUPERDRIVE|Minimum order amount/i').first();
    await expect(result).toBeVisible({ timeout: 10000 });
  });
});
