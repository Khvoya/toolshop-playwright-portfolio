import { test as base } from "@playwright/test";

import { ApiClient } from "../api/client";
import type { Cart, Product, TestUser } from "../api/models";
import { ToolshopApi } from "../api/toolshop.api";
import { getSettings } from "../config/settings";
import { TestDataManager } from "../services/test-data.manager";

export interface ApiFixtures {
  api: ToolshopApi;
  adminApi: ToolshopApi;
  testData: TestDataManager;
  registeredUser: TestUser;
  product: Product;
  cart: Cart;
}

export const apiTest = base.extend<ApiFixtures>({
  api: async ({ playwright }, use) => {
    const settings = getSettings();
    const request = await playwright.request.newContext({ baseURL: settings.apiBaseUrl });
    await use(new ToolshopApi(new ApiClient(request, settings)));
    await request.dispose();
  },
  adminApi: async ({ playwright }, use) => {
    const settings = getSettings();
    const request = await playwright.request.newContext({ baseURL: settings.apiBaseUrl });
    const api = new ToolshopApi(new ApiClient(request, settings));
    await api.authenticate({ email: settings.adminEmail, password: settings.adminPassword });
    await use(api);
    await request.dispose();
  },
  testData: async ({ api, adminApi }, use) => {
    const manager = new TestDataManager(api, adminApi);
    await use(manager);
    await manager.cleanup();
  },
  registeredUser: async ({ testData }, use) => {
    await use(await testData.createUser());
  },
  product: async ({ api }, use) => {
    await use(await api.products.firstRegularInStock());
  },
  cart: async ({ testData, product }, use) => {
    await use(await testData.createCart(product));
  },
});

export { expect } from "@playwright/test";
