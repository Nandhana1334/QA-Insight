import { Page, Locator } from '@playwright/test';
import { StepLogger } from '../utils/step-logger';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  protected async runStep(name: string, action: () => Promise<void>) {
    StepLogger.log(name);

    console.log(`STEP ✓ ${name}`);

    await action();
  }

  async navigateTo(url: string) {
  await this.page.goto(url, {
    waitUntil: 'domcontentloaded',
  });
}

  async clickElement(locator: Locator, step: string) {
    StepLogger.log(step);
    await this.runStep(step, async () => {
      await locator.waitFor({
        state: 'visible',
      });

      await locator.click();
    });
  }

  async fillInput(locator: Locator, text: string) {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(text);
  }
}
