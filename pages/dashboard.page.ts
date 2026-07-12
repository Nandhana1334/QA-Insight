import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  readonly firstProductLink: Locator;
  readonly addToCartButton: Locator;
  readonly cartNavButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstProductLink = page.locator('.card-title a').first();
    this.addToCartButton = page.locator('text=Add to cart');
    this.cartNavButton = page.locator('#cartur');
  }

  async addFirstProductToCart() {
    await this.clickElement(this.firstProductLink, 'Open first product');

    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await this.clickElement(this.addToCartButton, 'Add first product to cart');
  }
}
