import { test, expect } from '@playwright/test';

test.describe('AUTOX — 3D Showroom & WebGL Studio Suite', () => {
  test('should mount Three.js canvas with non-zero dimensions and studio HUD', async ({ page }) => {
    await page.goto('/showroom');
    await page.waitForLoadState('domcontentloaded');

    // Verify showroom title overlay
    await expect(page.locator('text=Interactive 3D Configurator')).toBeVisible();
    await expect(page.locator('h2:has-text("Accessory Showroom")')).toBeVisible();

    // Verify canvas element exists and is rendered
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeAttached();

    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    expect(box.width).toBeGreaterThan(100);
    expect(box.height).toBeGreaterThan(100);
  });

  test('should toggle all three studio lighting presets (Midnight, Sunset, Cyber Noir)', async ({ page }) => {
    await page.goto('/showroom');
    await page.waitForLoadState('domcontentloaded');

    const midnightBtn = page.locator('button:text-is("Midnight")');
    const sunsetBtn = page.locator('button:text-is("Sunset")');
    const cyberBtn = page.locator('button:text-is("Cyber Noir")');

    await expect(midnightBtn).toBeVisible();
    await expect(sunsetBtn).toBeVisible();
    await expect(cyberBtn).toBeVisible();

    // Switch to Sunset
    await sunsetBtn.click();
    await expect(sunsetBtn).toHaveClass(/bg-autox-orange/);

    // Switch to Cyber Noir
    await cyberBtn.click();
    await expect(cyberBtn).toHaveClass(/bg-autox-orange/);

    // Switch back to Midnight
    await midnightBtn.click();
    await expect(midnightBtn).toHaveClass(/bg-autox-orange/);
  });

  test('should switch accessory pedestal stands and update telemetry card', async ({ page }) => {
    await page.goto('/showroom');
    await page.waitForLoadState('domcontentloaded');

    // Stand pills
    const stand2Btn = page.locator('button:has-text("Stand 2")');
    await expect(stand2Btn).toBeVisible();
    await stand2Btn.click();

    // Inspector card should update to Forged 19" Rim
    await expect(page.locator('text=/Forged 19" Rim/i')).toBeVisible();
    await expect(page.locator('text=/WHL-FORG-01/i')).toBeVisible();

    const stand4Btn = page.locator('button:has-text("Stand 4")');
    await stand4Btn.click();
    await expect(page.locator('text=/Titanium Exhaust/i')).toBeVisible();
    await expect(page.locator('text=/PRF-EXH-03/i')).toBeVisible();
  });

  test('should trigger camera reset and turntable orbit controls without JavaScript errors', async ({ page }) => {
    const jsErrors = [];
    page.on('pageerror', (err) => jsErrors.push(err.message));

    await page.goto('/showroom');
    await page.waitForLoadState('domcontentloaded');

    // Reset Camera
    const resetBtn = page.locator('button:has-text("Reset View"), button[title="Reset Camera View"]');
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
    }

    // Toggle Turntable
    const turntableBtn = page.locator('button:has-text("Turntable"), button[title*="Turntable"]').first();
    if (await turntableBtn.isVisible()) {
      await turntableBtn.click();
      await page.waitForTimeout(500);
      await turntableBtn.click();
    }

    expect(jsErrors.length).toBe(0);
  });
});
