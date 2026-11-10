import type { Locator, Page } from "@playwright/test";

import { BaseComponent } from "./base.component";

export class ProductCardComponent extends BaseComponent {
  constructor(page: Page, productId: string) {
    super(page, page.getByTestId(`product-${productId}`));
  }

  get name(): Locator {
    return this.root.getByTestId("product-name");
  }

  get price(): Locator {
    return this.root.getByTestId("product-price");
  }

  async open(): Promise<void> {
    await this.root.click();
  }
}
