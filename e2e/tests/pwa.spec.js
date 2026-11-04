import { test, expect } from '@playwright/test';

test.describe('AUTOX — Progressive Web App (PWA) & Offline Suite', () => {
  test('A. Web App Manifest is accessible, valid JSON, and contains authoritative metadata', async ({ request }) => {
    const res = await request.get('/manifest.webmanifest');
    expect(res.status()).toBe(200);

    const manifest = await res.json();
    expect(manifest.name).toBe('AUTOX — Premium Car Accessories');
    expect(manifest.short_name).toBe('AUTOX');
    expect(manifest.background_color).toBe('#080A0D');
    expect(manifest.theme_color).toBe('#080A0D');
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('/');
    expect(manifest.icons.length).toBeGreaterThanOrEqual(4);
  });

  test('B. Application icons load successfully with status 200', async ({ request }) => {
    const icon192 = await request.get('/icons/icon-192x192.png');
    expect(icon192.status()).toBe(200);
    expect(icon192.headers()['content-type']).toContain('image/png');

    const icon512 = await request.get('/icons/icon-512x512.png');
    expect(icon512.status()).toBe(200);
    expect(icon512.headers()['content-type']).toContain('image/png');

    const logoSvg = await request.get('/logo.svg');
    expect(logoSvg.status()).toBe(200);
  });

  test('C. Service Worker registers and controls the client', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Check service worker registration in browser
    const swRegistered = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return false;
      const reg = await navigator.serviceWorker.getRegistration();
      return !!reg;
    });

    expect(swRegistered).toBe(true);
  });

  test('D. Dedicated offline fallback page loads with luxury styling', async ({ page }) => {
    await page.goto('/offline.html');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1')).toContainText(/Your drive doesn't stop/i);
    await expect(page.locator('text=Telemetry Disconnected')).toBeVisible();
    await expect(page.locator('button:has-text("Re-Establish Link")')).toBeVisible();
  });

  test('E. Offline status indicator triggers when connectivity is lost and restores on reconnect', async ({ page, context }) => {
    await page.goto('/shop');
    await page.waitForLoadState('domcontentloaded');
    // Ensure lazy loaded components and header are rendered before cutting network
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // Emulate network disconnection
    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));

    // Verify floating offline indicator pill appears
    const offlinePill = page.getByText(/Telemetry Offline/i).first();
    await expect(offlinePill).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Viewing cached catalog equipment/i).first()).toBeVisible();

    // Emulate network restoration
    await context.setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event('online')));

    // Verify restored indicator appears
    const restoredPill = page.getByText(/Telemetry Restored/i).first();
    await expect(restoredPill).toBeVisible({ timeout: 10000 });
  });

  test('F. Security: Private authentication and order endpoints are never cached', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Inspect service worker caches
    const cachedPrivateRoutes = await page.evaluate(async () => {
      if (!('caches' in window)) return [];
      const cacheNames = await caches.keys();
      const privateHits = [];

      for (const name of cacheNames) {
        const cache = await caches.open(name);
        const requests = await cache.keys();
        for (const req of requests) {
          if (
            req.url.includes('/api/v1/auth') ||
            req.url.includes('/api/v1/orders') ||
            req.url.includes('/api/v1/cart') ||
            req.url.includes('/api/v1/admin')
          ) {
            privateHits.push(req.url);
          }
        }
      }
      return privateHits;
    });

    expect(cachedPrivateRoutes.length).toBe(0);
  });
});
