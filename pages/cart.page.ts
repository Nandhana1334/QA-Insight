import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { CartLocators } from '../locators/cart.locators';

export class CartPage extends BasePage {
  readonly totalPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.totalPrice = page.locator(CartLocators.totalPrice);
  }

  async removeProductFromCart(productName: string) {
    const productRow = this.page
      .locator(CartLocators.productRows)
      .filter({ hasText: productName });

    await this.clickElement(
      productRow.locator(CartLocators.deleteButton),
      `Remove ${productName} from cart`,
    );

    await productRow.waitFor({ state: 'detached' });
  }
  async getTotalPrice(): Promise<number> {
  const total = await this.totalPrice.textContent();
  return Number(total?.trim() || 0);
}
}