import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

import { BaseComponent } from "./base.component";

export class MainNavComponent extends BaseComponent {
  constructor(page: Page) {
    const root = page.getByRole("navigation").filter({ has: page.getByTestId("nav-home") });
    super(page, root);
  }

  get signInLink(): Locator {
    return this.root.getByTestId("nav-sign-in");
  }

  get cartQuantity(): Locator {
    return this.root.getByTestId("cart-quantity");
  }

  get userMenu(): Locator {
    return this.root.getByTestId("nav-menu");
  }

  async openSignIn(): Promise<void> {
    await this.signInLink.click();
  }

  async openFavorites(): Promise<void> {
    await this.root.getByTestId("nav-menu").click();
    await this.root.getByTestId("nav-my-favorites").click();
  }

  async signOut(): Promise<void> {
    await this.root.getByTestId("nav-menu").click();
    await this.root.getByTestId("nav-sign-out").click();
    await expect(this.signInLink).toBeVisible();
  }

  async openCart(): Promise<void> {
    await this.root.getByTestId("nav-cart").click();
  }
}
