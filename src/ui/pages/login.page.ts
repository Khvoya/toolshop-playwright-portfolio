import { expect } from "@playwright/test";
import type { Locator } from "@playwright/test";

import type { Credentials } from "../../api/models";
import { BasePage } from "../base.page";

export class LoginPage extends BasePage {
  async open(path = "/auth/login"): Promise<void> {
    await this.navigate(path);
    await expect(this.page.getByTestId("login-form")).toBeVisible();
  }

  get error(): Locator {
    return this.page.getByTestId("login-error");
  }

  async login(credentials: Credentials): Promise<void> {
    await this.page.getByTestId("email").fill(credentials.email);
    await this.page.getByTestId("password").fill(credentials.password);
    await this.page.getByTestId("login-submit").click();
  }

  async loginSuccessfully(credentials: Credentials): Promise<void> {
    await this.login(credentials);
    await expect(this.page).toHaveURL(`${this.settings.uiBaseUrl}/account`);
  }
}
