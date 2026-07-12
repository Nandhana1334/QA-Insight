import { test, expect } from '../fixtures/base-test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';

test.describe('Demoblaze shopping flow', () => {
  test('verifies that a user can sign in and add a product to the cart', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.login('admin', 'admin');

    await expect(loginPage.nameUserDisplay).toBeVisible({ timeout: 10000 });
    await expect(loginPage.nameUserDisplay).toContainText('Welcome admin');

    await dashboardPage.addFirstProductToCart();

    await dashboardPage.clickElement(dashboardPage.cartNavButton, 'Open cart');

    await expect(page).toHaveURL(/cart\.html$/);
    await expect(
      page.getByRole('cell', { name: 'Samsung galaxy s6' }).first(),
    ).toBeVisible();
  });

  test('shows an error when the provided credentials are invalid', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('User does not exist.');
      await dialog.accept();
    });

    await loginPage.login('invalid-user', 'wrong-password');

    await expect(loginPage.nameUserDisplay).not.toBeVisible();
  });

  test('allows a user to open the cart page from the home page', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.clickElement(dashboardPage.cartNavButton, 'Open cart');

    await expect(page).toHaveURL(/cart\.html$/);
  });
});
