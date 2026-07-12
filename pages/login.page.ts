import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly loginNavButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmitButton: Locator;
  readonly nameUserDisplay: Locator;

  constructor(page: Page) {
    super(page); // Memanggil constructor dari BasePage
    this.loginNavButton = page.locator('#login2');
    this.usernameInput = page.locator('#loginusername');
    this.passwordInput = page.locator('#loginpassword');
    this.loginSubmitButton = page.locator('button[onclick="logIn()"]');
    this.nameUserDisplay = page.locator('#nameofuser');
  }

  async login(username: string, password: string) {
    await this.clickElement(this.loginNavButton, 'Open Login Modal');
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginSubmitButton, 'Submit Login');
  }
}
