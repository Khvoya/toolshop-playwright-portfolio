import { apiTest as test, expect } from "../../src/fixtures/api.fixture";

test.describe("Favorites API", () => {
  test("API @smoke: authenticated customer can create and list a favorite", async ({
    api,
    testData,
    registeredUser,
    product,
  }) => {
    await test.step("Arrange: create a favorite through the API fixture service", () =>
      testData.createFavorite(product));
    const favorites = await test.step("Act: list the current customer's favorites", () =>
      api.favorites.list());

    await test.step("Assert: the favorite belongs to the generated user and product", () => {
      expect(favorites).toHaveLength(1);
      expect(favorites[0]?.user_id).toBe(registeredUser.account.id);
      expect(favorites[0]?.product_id).toBe(product.id);
      expect(favorites[0]?.product.name).toBe(product.name);
    });
  });

  test("API @negative: anonymous customer cannot list favorites", async ({ api }) => {
    const error = await test.step("Act: request a private resource without a token", () =>
      api.favorites.listUnauthorized());

    await test.step("Assert: API returns an authorization error", () => {
      expect(error.message).toBe("Unauthorized");
    });
  });
});
