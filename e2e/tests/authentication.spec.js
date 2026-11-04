import { test, expect } from '@playwright/test';
import { TEST_USERS } from '../helpers/auth.helper.js';

test.describe('AUTOX — Authentication Suite', () => {
  test('should log in customer with valid credentials and navigate to account', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    await page.locator('main form input[type="email"]').fill(TEST_USERS.customer.email);
    await page.locator('main form input[type="password"]').fill(TEST_USERS.customer.password);
    await page.locator('main form button[type="submit"]').click();

    // Should redirect to account page
    await page.waitForURL(/\/account/, { timeout: 10000 });
    await expect(page.locator(`text=${TEST_USERS.customer.name}`).first()).toBeVisible();
    await expect(page.locator('text=Pilot Customer')).toBeVisible();
  });

  test('should reject customer login with invalid password', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    await page.locator('main form input[type="email"]').fill(TEST_USERS.customer.email);
    await page.locator('main form input[type="password"]').fill('WrongPassword999!');
    await page.locator('main form button[type="submit"]').click();

    // Error toast or validation message
    await expect(page.locator('text=/Invalid email or password|Authentication failed/i').first()).toBeVisible({ timeout: 6000 });
    expect(page.url()).toContain('/login');
  });

  test('should redirect unauthenticated users away from protected /account route', async ({ page }) => {
    await page.goto('/account', { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/\/login/, { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });

  test('should block non-admin customers from protected /admin dashboard', async ({ page }) => {
    // 1. Log in as customer
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.locator('main form input[type="email"]').fill(TEST_USERS.customer.email);
    await page.locator('main form input[type="password"]').fill(TEST_USERS.customer.password);
    await page.locator('main form button[type="submit"]').click();
    await page.waitForURL(/\/account/, { timeout: 10000 });

    // 2. Attempt to navigate to /admin
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Should either redirect home/account or show unauthorized notice
    const url = page.url();
    expect(url).not.toMatch(/\/admin$/);
  });
});
