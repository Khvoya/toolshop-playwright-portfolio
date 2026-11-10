import type { Page } from "@playwright/test";

import type { Settings } from "../config/settings";

export abstract class BasePage {
  constructor(
    readonly page: Page,
    protected readonly settings: Settings,
  ) {}

  protected async navigate(path: string): Promise<void> {
    const url = `${this.settings.uiBaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }

  async sessionStorageValue(key: string): Promise<string> {
    const value = await this.page.evaluate((name) => sessionStorage.getItem(name), key);
    if (!value) throw new Error(`Session storage key ${key} is empty`);
    return value;
  }
}
