import { test } from "@playwright/test";

import type { ApiClient } from "../client";
import type { ErrorResponse, Favorite } from "../models";

export class FavoritesApi {
  constructor(private readonly client: ApiClient) {}

  list(): Promise<Favorite[]> {
    return test.step("List favorites through API", () =>
      this.client.send<Favorite[]>("GET", "/favorites"));
  }

  listUnauthorized(): Promise<ErrorResponse> {
    return test.step("Reject anonymous favorites access through API", () =>
      this.client.send<ErrorResponse>("GET", "/favorites", { expectedStatus: 401 }));
  }

  add(productId: string): Promise<Favorite> {
    return test.step("Add a favorite through API", () =>
      this.client.send<Favorite>("POST", "/favorites", {
        payload: { product_id: productId },
        expectedStatus: 201,
        retry: false,
      }));
  }

  delete(favoriteId: string): Promise<null> {
    return test.step("Delete a favorite through API", () =>
      this.client.send<null>("DELETE", `/favorites/${favoriteId}`, {
        expectedStatus: [204, 404],
        retry: false,
      }));
  }
}
