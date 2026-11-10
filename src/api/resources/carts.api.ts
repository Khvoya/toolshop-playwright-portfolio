import { test } from "@playwright/test";

import type { ApiClient } from "../client";
import type { Cart } from "../models";

export class CartsApi {
  constructor(private readonly client: ApiClient) {}

  async create(): Promise<string> {
    return test.step("Create a cart through API", async () => {
      const response = await this.client.send<{ id: string }>("POST", "/carts", {
        payload: {},
        expectedStatus: 201,
        retry: false,
      });
      return response.id;
    });
  }

  addItem(cartId: string, productId: string, quantity = 1): Promise<null> {
    return test.step("Add a product to the cart through API", () =>
      this.client.send<null>("POST", `/carts/${cartId}`, {
        payload: { product_id: productId, quantity },
        retry: false,
      }));
  }

  get(cartId: string): Promise<Cart> {
    return test.step("Read the cart through API", () =>
      this.client.send<Cart>("GET", `/carts/${cartId}`));
  }

  getMissing(cartId: string): Promise<unknown> {
    return test.step("Read a missing cart through API", () =>
      this.client.send<unknown>("GET", `/carts/${cartId}`, { expectedStatus: 404 }));
  }

  updateQuantity(cartId: string, productId: string, quantity: number): Promise<null> {
    return test.step("Update cart item quantity through API", () =>
      this.client.send<null>("PUT", `/carts/${cartId}/product/quantity`, {
        payload: { product_id: productId, quantity },
        retry: false,
      }));
  }

  delete(cartId: string): Promise<null> {
    return test.step("Delete the cart through API", () =>
      this.client.send<null>("DELETE", `/carts/${cartId}`, {
        expectedStatus: [204, 404],
        retry: false,
      }));
  }
}
