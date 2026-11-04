/**
 * Page Object: AUTOX Homepage
 */
export class HomePage {
  constructor(page) {
    this.page = page;
    this.brandLogo = page.locator('header a[href="/"]').first();
    this.heroHeadline = page.locator('h1').first();
    this.shopNav = page.locator('nav a[href="/shop"]').first();
    this.showroomNav = page.locator('nav a[href="/showroom"]').first();
    this.cartButton = page.locator('button[aria-label="Open shopping cart"]').first();
    this.searchButton = page.locator('button[aria-label="Search catalog"]').first();
    this.cartBadge = page.locator('header span.bg-autox-orange');
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.heroHeadline.waitFor({ state: 'visible', timeout: 15000 });
  }

  async openCart() {
    await this.cartButton.click();
    await this.page.waitForTimeout(400);
  }

  async openSearch() {
    await this.searchButton.click();
    await this.page.waitForTimeout(400);
  }
}
