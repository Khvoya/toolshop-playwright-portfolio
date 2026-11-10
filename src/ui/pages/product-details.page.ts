import { expect } from "@playwright/test";
import type { Locator } from "@playwright/test";

import type { Product } from "../../api/models";
import { BasePage } from "../base.page";
import { ToastComponent } from "../components/toast.component";

export class ProductDetailsPage extends BasePage {
  async open(product: Product): Promise<void> {
    await this.navigate(`/product/${product.id}`);
    await expect(this.name).toHaveText(product.name);
  }

  get name(): Locator {
    return this.page.getByTestId("product-name");
  }

  get description(): Locator {
    return this.page.getByTestId("product-description");
  }

  get unitPrice(): Locator {
    return this.page.getByTestId("unit-price");
  }

  get toast(): ToastComponent {
    return new ToastComponent(this.page);
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.page.getByTestId("quantity").fill(String(quantity));
  }

  async addToCart(): Promise<void> {
    await this.page.getByTestId("add-to-cart").click();
    await expect(this.toast.message).toBeVisible();
  }

  async addToFavorites(): Promise<void> {
    await this.page.getByTestId("add-to-favorites").click();
    await expect(this.toast.message).toBeVisible();
  }
}
