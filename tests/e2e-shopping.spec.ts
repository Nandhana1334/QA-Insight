import { test, expect } from '../fixtures/base-test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import users from '../test-data/users.json' with { type: 'json' };
import products from '../test-data/products.json' with { type: 'json' };

test.describe('Demoblaze shopping flow', () => {
  // Test 1: Valid login and add a single product
  test('verifies that a user can sign in and add a product to the cart', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.login(
      users.validUser.username,
      users.validUser.password,
    );

    await expect(loginPage.nameUserDisplay).toBeVisible({ timeout: 10000 });
    await expect(loginPage.nameUserDisplay).toContainText(
      `Welcome ${users.validUser.username}`,
    );

    await dashboardPage.addProductToCart(products.firstProduct.name);

    await dashboardPage.clickElement(
      dashboardPage.cartNavButton,
      'Open cart',
    );

    await expect(page).toHaveURL(/cart\.html$/);

    await expect(
      page.getByRole('cell', { name: products.firstProduct.name }).first(),
    ).toBeVisible();
  });

  // Test 2: Add multiple products to cart
  test('verifies that multiple products can be added to the cart', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.login(
      users.validUser.username,
      users.validUser.password,
    );

    await dashboardPage.addProductToCart(products.firstProduct.name);
    await dashboardPage.addProductToCart(products.secondProduct.name);

    await dashboardPage.clickElement(
      dashboardPage.cartNavButton,
      'Open cart',
    );

    await expect(page).toHaveURL(/cart\.html$/);

    await expect(
      page.getByRole('cell', { name: products.firstProduct.name }).first(),
    ).toBeVisible();

    await expect(
      page.getByRole('cell', { name: products.secondProduct.name }).first(),
    ).toBeVisible();
  });

  // Test 3: Invalid login
  test('shows an error when the provided credentials are invalid', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('User does not exist.');
      await dialog.accept();
    });

    await loginPage.login(
      users.invalidUser.username,
      users.invalidUser.password,
    );

    await expect(loginPage.nameUserDisplay).not.toBeVisible();
  });

  // Test 4: Cart page navigation
  test('allows a user to open the cart page from the home page', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.clickElement(
      dashboardPage.cartNavButton,
      'Open cart',
    );

    await expect(page).toHaveURL(/cart\.html$/);
  });
});