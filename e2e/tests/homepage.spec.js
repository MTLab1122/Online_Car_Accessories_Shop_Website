import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';

test.describe('AUTOX — Homepage Experience', () => {
  test('should render AUTOX brand wordmark and hero headline', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await expect(home.brandLogo).toBeVisible();
    await expect(home.heroHeadline).toContainText(/UPGRADE/i);
    await expect(page.locator('text=ENGINEERED FOR YOUR DRIVE').first()).toBeVisible();
  });

  test('should display equipment divisions and featured products with PKR currency', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Scroll down to bring Section 3 & 4 into view
    const division = page.locator('h2:has-text("Equipment Divisions"), h2:has-text("Divisions")').first();
    await division.scrollIntoViewIfNeeded();
    await expect(division).toBeVisible({ timeout: 15000 });

    // Check PKR pricing in featured products
    const pkrPrice = page.locator('text=/PKR|₨/i').first();
    await pkrPrice.scrollIntoViewIfNeeded();
    await expect(pkrPrice).toBeVisible({ timeout: 15000 });
  });

  test('should open live search overlay on search trigger', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.openSearch();
    const searchInput = page.locator('input[placeholder*="Search by component" i], input[placeholder*="Search" i]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });

    // Type query and verify live results appear
    await searchInput.fill('Carbon');
    await page.waitForTimeout(600);

    const resultCount = await page.locator('a[href*="/product/"]').count();
    expect(resultCount).toBeGreaterThan(0);

    // ESC key closes search overlay
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(searchInput).not.toBeVisible();
  });

  test('should transition navbar background style on scroll', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const header = page.locator('header').first();
    await expect(header).toBeVisible();

    // Scroll down 150px
    await page.evaluate(() => window.scrollTo(0, 150));
    await page.waitForTimeout(300);

    // Header should have glass-nav-scrolled or dark backdrop
    const classes = await header.getAttribute('class');
    expect(classes).toMatch(/glass-nav-scrolled|bg-autox-surface|backdrop-blur/);
  });
});
