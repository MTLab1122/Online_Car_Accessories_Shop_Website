import { defineConfig, devices } from '@playwright/test';

/**
 * AUTOX — Playwright End-to-End Automation Configuration
 * Desktop, Mobile Viewports, WebGL Headless Flags, and Reporting
 */
export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Deterministic sequential database operations for orders & coupons
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  outputDir: 'test-results',

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-features=WebXR'
      ]
    }
  },

  projects: [
    {
      name: 'Desktop Chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'Mobile iPhone 14',
      use: {
        ...devices['iPhone 14'],
        defaultBrowserType: 'chromium',
        viewport: { width: 390, height: 844 }
      }
    },
    {
      name: 'Mobile Small',
      use: {
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true
      }
    },
    {
      name: 'Tablet Portrait',
      use: {
        viewport: { width: 768, height: 1024 },
        isMobile: true,
        hasTouch: true
      }
    }
  ],

  webServer: [
    {
      command: 'npm --prefix server run dev',
      url: 'http://localhost:5000/api/v1/health',
      reuseExistingServer: true,
      timeout: 30000
    },
    {
      command: 'npm --prefix client run dev -- --host',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 30000
    }
  ]
});
