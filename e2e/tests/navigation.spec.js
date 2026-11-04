import { test, expect } from '@playwright/test';

test.describe('AUTOX — Navigation Suite', () => {
  test('should navigate to all primary public routes', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const routes = [
      { name: 'Shop', href: '/shop', expectedHeading: /Hardware Catalog|Showroom Catalog|All Equipment|Performance Accessories/i },
      { name: 'Categories', href: '/categories', expectedHeading: /Accessory Divisions|Equipment Divisions|Accessory Categories/i },
      { name: '3D Showroom', href: '/showroom', expectedHeading: /3D Digital Showroom|Interactive 3D|Accessory Showroom/i },
      { name: 'Guides', href: '/guides', expectedHeading: /ENGINEERED KNOWLEDGE|Automotive.*Guides/i },
      { name: 'About', href: '/about', expectedHeading: /Engineered For Your Drive|About AUTOX/i },
      { name: 'Contact', href: '/contact', expectedHeading: /Contact AUTOX Support|Get in Touch/i }
    ];

    for (const r of routes) {
      await page.goto(r.href, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('h1, h2').first()).toHaveText(r.expectedHeading);
    }
  });

  test('should support mobile navigation slide-in menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Mobile menu toggle button
    const menuBtn = page.locator('header button[aria-label="Toggle navigation menu"]');
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    await page.waitForTimeout(400);

    // Verify slide-in navigation link is visible and clickable
    const mobileShopLink = page.locator('header nav a[href="/shop"]:visible').first();
    await expect(mobileShopLink).toBeVisible();

    await mobileShopLink.click();
    await page.waitForURL(/\/shop/);
    expect(page.url()).toContain('/shop');
  });
});
