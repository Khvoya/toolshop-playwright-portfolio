import { expect } from "@playwright/test";
import type { Locator } from "@playwright/test";

import type { Address, Credentials } from "../../api/models";
import { BasePage } from "../base.page";
import { countryCode } from "../countries";

export class CheckoutPage extends BasePage {
  async signIn(credentials?: Credentials): Promise<void> {
    if (credentials && (await this.page.getByTestId("login-submit").isVisible())) {
      await this.page.getByTestId("email").fill(credentials.email);
      await this.page.getByTestId("password").fill(credentials.password);
      await this.page.getByTestId("login-submit").click();
    }
    const proceed = this.page.getByTestId("proceed-2");
    await expect(proceed).toBeEnabled();
    await proceed.click();
  }

  async fillAddress(address: Address): Promise<void> {
    await this.page.getByTestId("country").selectOption(countryCode(address.country));
    const fields: Record<string, string> = {
      postal_code: address.postal_code,
      house_number: address.house_number,
      street: address.street,
      city: address.city,
      state: address.state,
    };
    for (const [testId, value] of Object.entries(fields)) {
      await this.page.getByTestId(testId).fill(value);
    }
    const proceed = this.page.getByTestId("proceed-3");
    await expect(proceed).toBeEnabled();
    await proceed.click();
  }

  get finishButton(): Locator {
    return this.page.getByTestId("finish");
  }

  get confirmation(): Locator {
    return this.page.locator("#order-confirmation");
  }

  async payCashOnDelivery(): Promise<void> {
    await this.page.getByTestId("payment-method").selectOption("cash-on-delivery");
    await expect(this.finishButton).toBeEnabled();
    await this.finishButton.click();
    await expect(this.page.getByTestId("payment-success-message")).toBeVisible();
    await this.finishButton.click();
    await expect(this.confirmation).toBeVisible();
    await expect(this.confirmation).toContainText("INV-");
  }
}
