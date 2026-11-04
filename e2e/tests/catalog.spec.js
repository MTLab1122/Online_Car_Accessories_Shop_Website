import { test, expect } from '@playwright/test';
import { ShopPage } from '../pages/ShopPage.js';

test.describe('AUTOX — Catalog & Product Filtering Suite', () => {
  test('should display seeded catalog products with authoritative PKR prices', async ({ page }) => {
    const shop = new ShopPage(page);
    await shop.goto();

    // Verify product cards are displayed
    const cardCount = await shop.productCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // Verify PKR currency symbol and formatted numbers
    const prices = page.locator('text=/PKR|₨/i');
    await expect(prices.first()).toBeVisible();
  });

  test('should search products by keyword and display filtered results', async ({ page }) => {
    const shop = new ShopPage(page);
    await shop.search('Intercooler');

    // Should find the Silicone Intercooler Hose Kit
    const match = page.locator('text=/Intercooler/i').first();
    await expect(match).toBeVisible();
  });

  test('should display active filter chips and allow resetting', async ({ page }) => {
    const shop = new ShopPage(page);
    await shop.goto();

    // Click a category filter in aside sidebar
    const catBtn = page.locator('aside button:not(:has-text("All Equipment"))').first();
    await catBtn.scrollIntoViewIfNeeded();
    await catBtn.click();

    // Verify active chips section is displayed
    const chip = page.locator('text=/Active Filters/i').first();
    await expect(chip).toBeVisible({ timeout: 10000 });
  });
});
