/**
 * Page Object: AUTOX Slide-Out Cart Drawer
 */
export class CartDrawerPage {
  constructor(page) {
    this.page = page;
    this.drawer = page.locator('div:has-text("Consignment Manifest")').first();
    this.items = page.locator('.space-y-4 > div:has(button[title="Remove item"])');
    this.emptyMessage = page.locator('text=/Your Cart is Empty/i');
    this.freeShippingText = page.locator('text=/Complimentary Shipping Unlocked|Add ₨.*for Free Shipping/i');
    this.couponInput = page.locator('input[placeholder*="Coupon Code" i]');
    this.applyCouponBtn = page.locator('button:has-text("Apply")');
    this.removeCouponBtn = page.locator('button:text-is("Remove")').first();
    this.appliedCouponBadge = page.locator('text=/Coupon .* applied/i').first();
    this.subtotal = page.locator('div:has-text("Subtotal") + span, div:has(span:text-is("Subtotal")) span:last-child');
    this.total = page.locator('div:has(span:text-is("Total Amount")) span:last-child');
    this.checkoutButton = page.locator('button:has-text("Proceed to Checkout")');
    this.closeButton = page.locator('button[aria-label="Close drawer"]');
  }

  async waitForItem() {
    await this.page.locator('.space-y-4 > div:has(button[title="Remove item"])').first().waitFor({ state: 'visible', timeout: 10000 });
  }

  async applyCoupon(code) {
    await this.couponInput.fill(code);
    await this.applyCouponBtn.click();
    await this.page.waitForTimeout(500);
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForURL(/\/checkout/, { timeout: 10000 });
  }

  async close() {
    await this.closeButton.click();
  }
}
