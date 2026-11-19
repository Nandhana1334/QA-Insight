import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { LoginLocators } from '../locators/login.locators';

export class LoginPage extends BasePage {
  readonly loginNavButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmitButton: Locator;
  readonly nameUserDisplay: Locator;

  constructor(page: Page) {
    super(page);

    this.loginNavButton = page.locator(LoginLocators.loginNavButton);
    this.usernameInput = page.locator(LoginLocators.usernameInput);
    this.passwordInput = page.locator(LoginLocators.passwordInput);
    this.loginSubmitButton = page.locator(LoginLocators.loginSubmitButton);
    this.nameUserDisplay = page.locator(LoginLocators.nameUserDisplay);
  }

  async login(username: string, password: string) {
    await this.clickElement(this.loginNavButton, 'Open Login Modal');
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginSubmitButton, 'Submit Login');
  }
}