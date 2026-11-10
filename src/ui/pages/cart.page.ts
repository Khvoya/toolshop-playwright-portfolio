import { expect } from "@playwright/test";
import type { Locator } from "@playwright/test";

import type { Product } from "../../api/models";
import { BasePage } from "../base.page";

export class CartPage extends BasePage {
  async open(path = "/checkout"): Promise<void> {
    await this.navigate(path);
    await expect(this.total).toBeVisible();
  }

  row(product: Product): Locator {
    return this.page.locator("tbody tr").filter({
      has: this.page.getByTestId("product-title").getByText(product.name, { exact: false }),
    });
  }

  productTitle(product: Product): Locator {
    return this.row(product).getByTestId("product-title");
  }

  quantity(product: Product): Locator {
    return this.page.getByLabel(`Quantity for ${product.name}`, { exact: true });
  }

  linePrice(product: Product): Locator {
    return this.row(product).getByTestId("line-price");
  }

  get total(): Locator {
    return this.page.getByTestId("cart-total");
  }

  async setQuantity(product: Product, quantity: number): Promise<void> {
    const field = this.quantity(product);
    await field.fill(String(quantity));
    await field.press("Tab");
    await expect(field).toHaveValue(String(quantity));
  }

  async proceedToSignIn(): Promise<void> {
    await this.page.getByTestId("proceed-1").click();
  }
}
