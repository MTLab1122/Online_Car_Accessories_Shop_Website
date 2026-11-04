/**
 * AUTOX E2E Test Authentication Helpers
 */

export const TEST_USERS = {
  customer: {
    name: 'Hamza Tariq',
    email: 'hamza.tariq@example.pk',
    password: 'Password123!'
  },
  admin: {
    name: 'AUTOX Admin',
    email: 'admin@autox.pk',
    password: 'Admin@AutoX2026!'
  }
};

export const createUniqueTestCustomer = () => {
  const timestamp = Date.now();
  return {
    name: `Pilot Enthusiast ${timestamp.toString().slice(-4)}`,
    email: `pilot.${timestamp}@autox-test.pk`,
    password: 'Password123!',
    phone: '+92 300 9876543',
    street: 'Test Runway 44, Sector F-8/2',
    city: 'Islamabad',
    province: 'Federal Capital',
    postalCode: '44000'
  };
};

export async function loginAsCustomer(page, credentials = TEST_USERS.customer) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });

  await page.locator('main form input[type="email"]').fill(credentials.email);
  await page.locator('main form input[type="password"]').fill(credentials.password);
  await page.locator('main form button[type="submit"]').click();

  // Verify successful redirect to account or requested destination
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
}
