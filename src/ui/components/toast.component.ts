import type { Locator, Page } from "@playwright/test";

import { BaseComponent } from "./base.component";

export class ToastComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, page.getByRole("alert").last());
  }

  get message(): Locator {
    return this.root;
  }
}
