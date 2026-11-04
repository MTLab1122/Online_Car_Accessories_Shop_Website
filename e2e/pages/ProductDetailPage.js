/**
 * Page Object: AUTOX Product Detail Page
 */
export class ProductDetailPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('h1').first();
    this.price = page.locator('text=/PKR|₨/i').first();
    this.stockBadge = page.locator('text=/In Stock|Only.*Left|Sold Out/i').first();
    this.quantitySpan = page.locator('span.font-mono.text-sm.font-bold').first();
    this.minusButton = page.locator('button[aria-label="Decrease quantity"], button:has(svg.lucide-minus)').first();
    this.plusButton = page.locator('button[aria-label="Increase quantity"], button:has(svg.lucide-plus)').first();
    this.addToCartButton = page.locator('button:has-text("Add to Cart")');
    this.buyNowButton = page.locator('button:has-text("Buy Now")');
    this.toggle3DButton = page.locator('button:has-text("Interactive 3D"), button:has-text("View 2D Gallery")');
    this.canvas3D = page.locator('canvas');
  }

  async goto(slug) {
    await this.page.goto(`/product/${slug}`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async setQuantity(qty) {
    let current = parseInt((await this.quantitySpan.textContent()) || '1', 10);
    while (current < qty) {
      await this.plusButton.click();
      current++;
      await this.page.waitForTimeout(100);
    }
    while (current > qty) {
      await this.minusButton.click();
      current--;
      await this.page.waitForTimeout(100);
    }
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async buyNow() {
    await this.buyNowButton.click();
    await this.page.waitForURL(/\/checkout/, { timeout: 10000 });
  }

  async toggle3D() {
    await this.toggle3DButton.click();
    await this.page.waitForTimeout(500);
  }
}
