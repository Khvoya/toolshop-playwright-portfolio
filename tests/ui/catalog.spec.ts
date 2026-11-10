import { expect, test } from "../../src/fixtures/ui.fixture";

test("UI @smoke: catalog shows API product data", async ({ homePage, product }) => {
  await test.step("Act: open the catalog", () => homePage.open());

  await test.step("Assert: the selected product card has correct name and price", async () => {
    const card = homePage.productCard(product);
    await expect(card.name).toHaveText(product.name);
    await expect(card.price).toHaveText(`$${product.price.toFixed(2)}`);
  });
});

test("UI: catalog search finds a known product", async ({ homePage, product }) => {
  await test.step("Arrange: open the catalog", () => homePage.open());
  await test.step("Act: submit the exact product name", () => homePage.search(product.name));

  await test.step("Assert: the product card is displayed", async () => {
    await expect(homePage.productCard(product).root).toBeVisible();
  });
});

test("UI: product details match the API model", async ({
  homePage,
  productDetailsPage,
  product,
}) => {
  await test.step("Act: navigate from a catalog card to product details", async () => {
    await homePage.open();
    await homePage.productCard(product).open();
  });

  await test.step("Assert: name, description and unit price match API data", async () => {
    await expect(productDetailsPage.name).toHaveText(product.name);
    await expect(productDetailsPage.description).toHaveText(product.description);
    await expect(productDetailsPage.unitPrice).toHaveText(product.price.toFixed(2));
  });
});
