import { ApiResponseError } from "../../src/api/client";
import { apiTest as test, expect } from "../../src/fixtures/api.fixture";

test.describe("Carts API", () => {
  test("API @smoke: cart item quantity can be updated", async ({ api, cart, product }) => {
    const updated = await test.step("Act: change the generated cart item quantity", async () => {
      await api.carts.updateQuantity(cart.id, product.id, 3);
      return api.carts.get(cart.id);
    });

    await test.step("Assert: the cart contains only the requested quantity", () => {
      expect(updated.cart_items).toHaveLength(1);
      expect(updated.cart_items[0]?.product_id).toBe(product.id);
      expect(updated.cart_items[0]?.quantity).toBe(3);
    });
  });

  test("API @negative: zero cart quantity is rejected", async ({ api, cart, product }) => {
    await test.step("Act/Assert: submit an invalid zero quantity", async () => {
      const error = await api.carts
        .addItem(cart.id, product.id, 0)
        .catch((value: unknown) => value);
      expect(error).toBeInstanceOf(ApiResponseError);
      expect((error as ApiResponseError).status).toBe(422);
    });
  });

  test("API @negative: missing cart returns not found", async ({ api }) => {
    await test.step("Act/Assert: request a nonexistent cart", async () => {
      await api.carts.getMissing("00000000-0000-0000-0000-000000000000");
    });
  });
});
