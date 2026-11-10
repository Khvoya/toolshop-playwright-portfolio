import { expect, test } from "../../src/fixtures/ui.fixture";

test("UI @smoke: adding a product updates the cart badge", async ({
  productDetailsPage,
  product,
  testData,
  header,
}) => {
  await test.step("Act: add one API-selected product from its details page", async () => {
    await productDetailsPage.open(product);
    await productDetailsPage.addToCart();
    testData.trackCart(await productDetailsPage.sessionStorageValue("cart_id"));
  });

  await test.step("Assert: navigation shows one cart item", async () => {
    await expect(header.navigation.cartQuantity).toHaveText("1");
  });
});

test("UI: cart recalculates line and order totals after quantity change", async ({
  pageWithCart,
  cartPage,
  product,
}) => {
  await test.step("Arrange: open an API-created cart", async () => {
    expect(pageWithCart).toBeTruthy();
    await cartPage.open();
    await expect(cartPage.quantity(product)).toHaveValue("1");
  });

  await test.step("Act: increase the quantity to three", () => cartPage.setQuantity(product, 3));

  await test.step("Assert: line and order totals use the new quantity", async () => {
    const expectedTotal = `$${(product.price * 3).toFixed(2)}`;
    await expect(cartPage.linePrice(product)).toHaveText(expectedTotal);
    await expect(cartPage.total).toHaveText(expectedTotal);
  });
});
