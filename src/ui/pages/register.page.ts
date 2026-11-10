import { expect } from "@playwright/test";

import type { NewUser } from "../../api/models";
import { BasePage } from "../base.page";
import { countryCode } from "../countries";

export class RegisterPage extends BasePage {
  async open(path = "/auth/register"): Promise<void> {
    await this.navigate(path);
    await expect(this.page.getByTestId("register-form")).toBeVisible();
  }

  async register(user: NewUser): Promise<void> {
    const fields: Record<string, string> = {
      "first-name": user.first_name,
      "last-name": user.last_name,
      dob: user.dob,
      postal_code: user.address.postal_code,
      house_number: user.address.house_number,
      street: user.address.street,
      city: user.address.city,
      state: user.address.state,
      phone: user.phone,
      email: user.email,
      password: user.password,
    };
    for (const [testId, value] of Object.entries(fields)) {
      await this.page.getByTestId(testId).fill(value);
    }
    await this.page.getByTestId("country").selectOption(countryCode(user.address.country));
    await this.page.getByTestId("register-submit").click();
    await expect(this.page).toHaveURL(`${this.settings.uiBaseUrl}/auth/login`);
  }
}
