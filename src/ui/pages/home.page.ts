import { expect } from "@playwright/test";
import type { Locator } from "@playwright/test";

import type { Product } from "../../api/models";
import { BasePage } from "../base.page";
import { PaginationComponent } from "../components/pagination.component";
import { ProductCardComponent } from "../components/product-card.component";

export class HomePage extends BasePage {
  async open(path = "/"): Promise<void> {
    await this.navigate(path);
    await expect(this.productCards.first()).toBeVisible();
  }

  get productCards(): Locator {
    return this.page.locator("a[data-test^='product-']");
  }

  get pagination(): PaginationComponent {
    return new PaginationComponent(this.page);
  }

  productCard(product: Product): ProductCardComponent {
    return new ProductCardComponent(this.page, product.id);
  }

  async search(query: string): Promise<void> {
    await this.page.getByTestId("search-query").fill(query);
    await this.page.getByTestId("search-submit").click();
    await expect(this.page.getByTestId("search-term")).toHaveText(query);
  }
}
