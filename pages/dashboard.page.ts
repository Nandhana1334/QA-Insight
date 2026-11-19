import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { DashboardLocators } from '../locators/dashboard.locators';

export class DashboardPage extends BasePage {
  readonly firstProductLink: Locator;
  readonly addToCartButton: Locator;
  readonly cartNavButton: Locator;

  constructor(page: Page) {
    super(page);

    this.firstProductLink = page.locator(DashboardLocators.firstProductLink).first();
    this.addToCartButton = page.locator(DashboardLocators.addToCartButton);
    this.cartNavButton = page.locator(DashboardLocators.cartNavButton);
  }

  async addProductToCart(productName: string) {
  await this.navigateTo('/');

  const productLink = this.page
    .locator(DashboardLocators.firstProductLink)
    .filter({ hasText: productName });

  await this.clickElement(productLink, `Open ${productName}`);

  await Promise.all([
    this.page.waitForEvent('dialog').then((dialog) => dialog.accept()),
    this.clickElement(
      this.addToCartButton,
      `Add ${productName} to cart`,
    ),
  ]);
}
}