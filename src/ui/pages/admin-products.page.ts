import { expect } from "@playwright/test";
import type { Locator } from "@playwright/test";

import type { Product } from "../../api/models";
import { BasePage } from "../base.page";

export class AdminProductsPage extends BasePage {
  async open(): Promise<void> {
    await this.navigate("/admin/products");
    await expect(this.page.getByTestId("page-title")).toHaveText("Products");
  }

  async search(name: string): Promise<void> {
    await this.page.getByTestId("product-search-query").fill(name);
    await this.page.getByTestId("product-search-submit").click();
  }

  row(product: Product): Locator {
    return this.page.locator("tbody tr").filter({
      has: this.page.getByText(product.name, { exact: true }),
    });
  }

  async openAdd(): Promise<void> {
    await this.page.getByTestId("product-add").click();
    await expect(this.page.getByTestId("page-title")).toHaveText("Add Product");
  }

  async openEdit(product: Product): Promise<void> {
    await this.search(product.name);
    await expect(this.row(product)).toBeVisible();
    await this.page.getByTestId(`product-edit-${product.id}`).click();
    await expect(this.page.getByTestId("page-title")).toHaveText("Edit Product");
    await expect(this.page.getByTestId("name")).toHaveValue(product.name);
  }

  async delete(product: Product): Promise<void> {
    await this.search(product.name);
    const row = this.row(product);
    await expect(row).toBeVisible();
    await this.page.getByTestId(`product-delete-${product.id}`).click();
    await expect(
      this.page.getByRole("alert").filter({ hasText: "Product deleted." }),
    ).toBeVisible();
    await expect(row).toHaveCount(0);
  }
}
