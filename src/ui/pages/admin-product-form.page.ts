import { expect } from "@playwright/test";

import type { NewProduct } from "../../api/models";
import { BasePage } from "../base.page";
import { ProductFormComponent } from "../components/product-form.component";

export class AdminProductFormPage extends BasePage {
  get form(): ProductFormComponent {
    return new ProductFormComponent(this.page);
  }

  async create(product: NewProduct): Promise<void> {
    await this.form.fill(product);
    await this.form.submit();
    await this.expectSaved();
  }

  async update(product: NewProduct): Promise<void> {
    await this.form.fill(product);
    await this.form.submit();
    await this.expectSaved();
  }

  private async expectSaved(): Promise<void> {
    await expect(this.page.getByRole("alert").filter({ hasText: "Product saved!" })).toBeVisible();
  }
}
