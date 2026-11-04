/**
 * Page Object: AUTOX Checkout Page
 */
export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.fullNameInput = page.locator('input[name="fullName"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.streetInput = page.locator('input[name="street"]');
    this.citySelect = page.locator('select[name="city"]');
    this.provinceSelect = page.locator('select[name="province"]');
    this.postalCodeInput = page.locator('input[name="postalCode"]');
    this.deliveryInstructionsInput = page.locator('input[name="deliveryInstructions"]');
    this.codOption = page.locator('div:has-text("Cash On Delivery (COD)")').first();
    this.simulatedCardOption = page.locator('div:has-text("Simulated Card (Demo)")').first();
    this.academicNotice = page.locator('text=/Academic Demonstration Notice/i');
    this.orderTotal = page.locator('span.text-2xl.font-display.text-autox-orange');
    this.placeOrderButton = page.locator('button[type="submit"]:has-text("Confirm & Place Order")');
    this.orderConfirmedHeading = page.locator('h2:has-text("Order #")');
  }

  async goto() {
    await this.page.goto('/checkout');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillDeliveryAddress(details) {
    await this.fullNameInput.fill(details.fullName);
    await this.phoneInput.fill(details.phone);
    await this.streetInput.fill(details.street);
    if (details.city) await this.citySelect.selectOption(details.city);
    if (details.province) await this.provinceSelect.selectOption(details.province);
    await this.postalCodeInput.fill(details.postalCode);
  }

  async selectPaymentMethod(method = 'cod') {
    if (method === 'cod') {
      await this.page.locator('text=Cash On Delivery (COD)').first().click();
    } else {
      await this.page.locator('text=Simulated Card (Demo)').first().click();
    }
    await this.page.waitForTimeout(400);
  }

  async submitOrder() {
    await this.placeOrderButton.click();
    await this.page.waitForSelector('h2:has-text("Order #")', { timeout: 15000 });
  }

  async getConfirmedOrderNumber() {
    const text = await this.orderConfirmedHeading.textContent();
    const match = text.match(/Order #(AOX-[\w-]+)/i);
    return match ? match[1] : null;
  }
}
