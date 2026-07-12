import { test as base } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { BasePage } from '../pages/base.page';

export const test = base;

test.beforeEach(async ({ page }) => {
  const basePage = new BasePage(page);

  await basePage.navigateTo('/');
  const consoleErrors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  (page as any).__consoleErrors = consoleErrors;
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === testInfo.expectedStatus) {
    return;
  }

  fs.mkdirSync('test-results/html', {
    recursive: true,
  });

  fs.mkdirSync('test-results/console', {
    recursive: true,
  });

  const html = await page.content();

  const htmlPath = path.join('test-results', 'html', `${testInfo.testId}.html`);

  fs.writeFileSync(htmlPath, html);

  const consoleErrors = ((page as any).__consoleErrors as string[]) ?? [];

  const consolePath = path.join(
    'test-results',
    'console',
    `${testInfo.testId}.txt`,
  );

  fs.writeFileSync(consolePath, consoleErrors.join('\n'));

  testInfo.attachments.push({
    name: 'console-errors',
    path: consolePath,
    contentType: 'text/plain',
  });
});

export { expect } from '@playwright/test';
