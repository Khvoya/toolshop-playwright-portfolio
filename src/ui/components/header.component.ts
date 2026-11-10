import type { Page } from "@playwright/test";

import { MainNavComponent } from "./navigation.component";

export class HeaderComponent {
  readonly navigation: MainNavComponent;

  constructor(page: Page) {
    this.navigation = new MainNavComponent(page);
  }
}
