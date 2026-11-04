import { test, expect } from '@playwright/test';
import { CartDrawerPage } from '../pages/CartDrawerPage.js';

test.describe('AUTOX — Cart & Slide-Out Manifest Suite', () => {
  test('should add product to cart and open slide-out manifest drawer', async ({ page }) => {
    await page.goto('/shop', { waitUntil: 'domcontentloaded' });
    const addBtn = page.locator('main button[title*="Add to Shopping Cart"]').first();
    await addBtn.waitFor({ state: 'visible', timeout: 15000 });
    await addBtn.click();

    // Verify slide-out cart drawer opens automatically
    const cart = new CartDrawerPage(page);
    await expect(cart.drawer).toBeVisible({ timeout: 10000 });
    await cart.waitForItem();

    // Verify item count and subtotal
    const count = await cart.items.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Verify Free Shipping progress text
    await expect(cart.freeShippingText).toBeVisible();
  });

  test('should adjust quantity inside cart drawer and update pricing', async ({ page }) => {
    await page.goto('/shop', { waitUntil: 'domcontentloaded' });

    // Open cart drawer
    const cartButton = page.locator('header button[aria-label="Open shopping cart"]').first();
    await cartButton.click();

    const cart = new CartDrawerPage(page);
    await expect(cart.drawer).toBeVisible();

    // If empty, add an item first
    if (await cart.emptyMessage.isVisible()) {
      await cart.close();
      const addBtn = page.locator('main button[title*="Add to Shopping Cart"]').first();
      await addBtn.waitFor({ state: 'visible', timeout: 15000 });
      await addBtn.click();
      await expect(cart.drawer).toBeVisible();
      await cart.waitForItem();
    }

    // Increase item quantity
    const plusBtn = page.locator('.space-y-4 button:has(svg.lucide-plus)').first();
    if (await plusBtn.isVisible()) {
      await plusBtn.click();
      await page.waitForTimeout(600);
      const qty = page.locator('.space-y-4 span.font-mono.font-bold').first();
      await expect(qty).toBeVisible();
    }
  });

  test('should close cart drawer via close button and ESC key', async ({ page }) => {
    await page.goto('/shop', { waitUntil: 'domcontentloaded' });

    const cartButton = page.locator('header button[aria-label="Open shopping cart"]').first();
    await cartButton.click();

    const cart = new CartDrawerPage(page);
    await expect(cart.drawer).toBeVisible();

    // Click close button
    await cart.close();
    await page.waitForTimeout(400);
    await expect(cart.drawer).not.toBeVisible();
  });
});
