import { expect, test } from "../../src/fixtures/ui.fixture";

test("UI: an API-created favorite is visible in the customer account", async ({
  favoritesPage,
  testData,
  registeredUser,
  product,
}) => {
  await test.step("Arrange: create favorite state through API", async () => {
    expect(registeredUser.account.id).toBeTruthy();
    await testData.createFavorite(product);
  });

  await test.step("Act: open the favorites page with API browser authentication", () =>
    favoritesPage.open());

  await test.step("Assert: the selected product is displayed", async () => {
    await expect(favoritesPage.productNames).toHaveText([product.name]);
  });
});
