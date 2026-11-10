import type { Page } from "@playwright/test";

import { BaseComponent } from "./base.component";

export class PaginationComponent extends BaseComponent {
  constructor(page: Page) {
    const root = page.getByRole("navigation").filter({ has: page.getByTestId("pagination-next") });
    super(page, root);
  }

  async nextPage(): Promise<void> {
    await this.root.getByTestId("pagination-next").click();
  }

  async openPage(pageNumber: number): Promise<void> {
    await this.root.getByRole("button", { name: `Page-${pageNumber}` }).click();
  }
}
