/**
 * Page Object: AUTOX Shop Page
 */
export class ShopPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.locator('input[placeholder*="Search by component" i], input[placeholder*="Search" i]').first();
    this.productCards = page.locator('a[href*="/product/"]');
    this.categoryFilters = page.locator('aside button');
    this.clearFiltersButton = page.locator('button:has-text("Reset All Filters"), button:has-text("Clear All")');
  }

  async goto() {
    await this.page.goto('/shop', { waitUntil: 'domcontentloaded' });
    await this.page.waitForSelector('a[href*="/product/"]', { timeout: 15000 });
  }

  async search(query) {
    await this.page.goto(`/shop?search=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded' });
    await this.page.waitForSelector('a[href*="/product/"]', { timeout: 15000 });
  }

  async clickProductByTitle(title) {
    const card = this.page.locator(`h3:has-text("${title}"), a:has-text("${title}")`).first();
    await card.scrollIntoViewIfNeeded();
    await card.click();
    await this.page.waitForURL(/\/product\//, { timeout: 10000 });
  }
}
