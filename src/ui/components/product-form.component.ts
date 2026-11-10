import type { Page } from "@playwright/test";

import type { NewProduct } from "../../api/models";
import { BaseComponent } from "./base.component";

export class ProductFormComponent extends BaseComponent {
  constructor(page: Page) {
    const root = page.locator("form").filter({ has: page.getByTestId("product-submit") });
    super(page, root);
  }

  async fill(product: NewProduct): Promise<void> {
    await this.root.getByTestId("name").fill(product.name);
    await this.root.getByTestId("description").fill(product.description);
    await this.root.getByTestId("stock").fill(String(product.stock));
    await this.root.getByTestId("price").fill(String(product.price));
    await this.root.getByTestId("brand-id").selectOption(product.brand_id);
    await this.root.getByTestId("category-id").selectOption(product.category_id);
    await this.root.getByTestId("product-image-id").selectOption(product.product_image_id);
    await this.root.getByTestId("co2-rating").selectOption(product.co2_rating);
  }

  async submit(): Promise<void> {
    await this.root.getByTestId("product-submit").click();
  }
}
