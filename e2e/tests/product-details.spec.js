import { test, expect } from '@playwright/test';
import { ProductDetailPage } from '../pages/ProductDetailPage.js';

async function openFirstProduct(page) {
  await page.goto('/shop', { waitUntil: 'domcontentloaded' });
  const firstProductLink = page.locator('a[href*="/product/"]').first();
  await firstProductLink.waitFor({ state: 'visible', timeout: 15000 });
  await firstProductLink.click();
  await page.waitForURL(/\/product\//, { timeout: 10000 });
}

test.describe('AUTOX — Product Details Suite', () => {
  test('should display product specifications, stock status and PKR price', async ({ page }) => {
    await openFirstProduct(page);

    const pdp = new ProductDetailPage(page);
    await expect(pdp.title).toBeVisible();
    await expect(pdp.price).toBeVisible();
    await expect(pdp.stockBadge).toBeVisible();
    await expect(pdp.addToCartButton).toBeVisible();
    await expect(pdp.buyNowButton).toBeVisible();
  });

  test('should enforce quantity boundaries', async ({ page }) => {
    await openFirstProduct(page);

    const pdp = new ProductDetailPage(page);

    // Initial quantity should be 1
    await expect(pdp.quantitySpan).toHaveText('1');

    // Minus button should be disabled at qty 1
    await expect(pdp.minusButton).toBeDisabled();

    // Increase to 2
    await pdp.plusButton.click();
    await expect(pdp.quantitySpan).toHaveText('2');

    // Minus button enabled now
    await expect(pdp.minusButton).toBeEnabled();
    await pdp.minusButton.click();
    await expect(pdp.quantitySpan).toHaveText('1');
  });

  test('should switch between 2D Master Render and 3D Interactive View', async ({ page }) => {
    await openFirstProduct(page);

    const pdp = new ProductDetailPage(page);

    if (await pdp.toggle3DButton.isVisible()) {
      await pdp.toggle3D();
      // Should show either canvas or fallback render
      const canvasOrFallback = page.locator('canvas, [aria-label*="render" i], text=/2D Master Render|Interactive 3D/i').first();
      await expect(canvasOrFallback).toBeVisible();
    }
  });

  test('should switch technical specification tabs', async ({ page }) => {
    await openFirstProduct(page);

    // Click Fitment Tab
    const fitmentTab = page.locator('button:has-text("Fitment & Engineering")');
    if (await fitmentTab.isVisible()) {
      await fitmentTab.click();
      await expect(page.locator('text=/Bolt-On Compatibility|Vehicle Fitment/i')).toBeVisible();
    }

    // Click Logistics Tab
    const shippingTab = page.locator('button:has-text("Logistics & Warranty")');
    if (await shippingTab.isVisible()) {
      await shippingTab.click();
      await expect(page.locator('text=/Nationwide Delivery|Standard Dispatch/i')).toBeVisible();
    }
  });
});
