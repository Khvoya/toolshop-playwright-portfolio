import { expect } from "@playwright/test";
import type { Locator } from "@playwright/test";

import { BasePage } from "../base.page";

export class FavoritesPage extends BasePage {
  async open(path = "/account/favorites"): Promise<void> {
    await this.navigate(path);
    await expect(this.page.getByTestId("page-title")).toBeVisible();
  }

  get productNames(): Locator {
    return this.page.getByTestId("product-name");
  }
}
