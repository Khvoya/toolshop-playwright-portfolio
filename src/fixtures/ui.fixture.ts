import type { Page } from "@playwright/test";

import { getSettings } from "../config/settings";
import { HeaderComponent } from "../ui/components/header.component";
import { AdminProductFormPage } from "../ui/pages/admin-product-form.page";
import { AdminProductsPage } from "../ui/pages/admin-products.page";
import { CartPage } from "../ui/pages/cart.page";
import { CheckoutPage } from "../ui/pages/checkout.page";
import { FavoritesPage } from "../ui/pages/favorites.page";
import { HomePage } from "../ui/pages/home.page";
import { LoginPage } from "../ui/pages/login.page";
import { ProductDetailsPage } from "../ui/pages/product-details.page";
import { RegisterPage } from "../ui/pages/register.page";
import { apiTest } from "./api.fixture";

export interface UiFixtures {
  browserDiagnostics: undefined;
  authenticatedPage: Page;
  pageWithCart: Page;
  adminPage: Page;
  header: HeaderComponent;
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  favoritesPage: FavoritesPage;
  adminProductsPage: AdminProductsPage;
  adminProductFormPage: AdminProductFormPage;
}

export const test = apiTest.extend<UiFixtures>({
  browserDiagnostics: [
    async ({ page }, use, testInfo) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(error.message));
      await use(undefined);
      if (testInfo.status !== testInfo.expectedStatus) {
        await testInfo.attach("Last page URL", { body: page.url(), contentType: "text/plain" });
        await testInfo.attach("Browser errors", {
          body: errors.join("\n") || "No browser errors",
          contentType: "text/plain",
        });
      }
    },
    { auto: true },
  ],
  authenticatedPage: async ({ page, registeredUser }, use) => {
    if (!registeredUser.token) throw new Error("The registered user has no API token");
    await page.addInitScript(
      (token) => localStorage.setItem("auth-token", token),
      registeredUser.token,
    );
    await use(page);
  },
  pageWithCart: async ({ authenticatedPage, cart }, use) => {
    await authenticatedPage.addInitScript(
      (cartId) => sessionStorage.setItem("cart_id", cartId),
      cart.id,
    );
    await use(authenticatedPage);
  },
  adminPage: async ({ page, adminApi }, use) => {
    await page.addInitScript(
      (token) => localStorage.setItem("auth-token", token),
      adminApi.accessToken,
    );
    await use(page);
  },
  header: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page, getSettings()));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page, getSettings()));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page, getSettings()));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page, getSettings()));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page, getSettings()));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page, getSettings()));
  },
  favoritesPage: async ({ authenticatedPage }, use) => {
    await use(new FavoritesPage(authenticatedPage, getSettings()));
  },
  adminProductsPage: async ({ adminPage }, use) => {
    await use(new AdminProductsPage(adminPage, getSettings()));
  },
  adminProductFormPage: async ({ adminPage }, use) => {
    await use(new AdminProductFormPage(adminPage, getSettings()));
  },
});

export { expect } from "@playwright/test";
