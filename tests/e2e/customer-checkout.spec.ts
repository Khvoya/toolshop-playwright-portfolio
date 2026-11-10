import { expect, test } from "../../src/fixtures/ui.fixture";

test("E2E @smoke: new customer buys a product after UI login", async ({
  api,
  testData,
  registeredUser,
  product,
  loginPage,
  homePage,
  productDetailsPage,
  header,
  cartPage,
  checkoutPage,
}) => {
  await test.step("Arrange: authenticate the generated customer through the login UI", async () => {
    await loginPage.open();
    await loginPage.loginSuccessfully(registeredUser.credentials);
  });

  await test.step("Act: select the API-selected product and add it to cart", async () => {
    await homePage.open();
    await homePage.productCard(product).open();
    await productDetailsPage.addToCart();
    testData.trackCart(await productDetailsPage.sessionStorageValue("cart_id"));
  });

  await test.step("Act: verify the cart and complete all checkout steps", async () => {
    await header.navigation.openCart();
    await expect(cartPage.productTitle(product)).toBeVisible();
    await cartPage.proceedToSignIn();
    await checkoutPage.signIn();
    await checkoutPage.fillAddress(registeredUser.account.address);
    await checkoutPage.payCashOnDelivery();
  });

  await test.step("Assert: independent API verification finds the customer's paid order", async () => {
    const orders = (await api.orders.list()).data.filter(
      (order) => order.user_id === registeredUser.account.id,
    );
    expect(orders).toHaveLength(1);
    expect(orders[0]?.total).toBeCloseTo(product.price);
    expect(orders[0]?.status).toBe("AWAITING_FULFILLMENT");
  });
});

test("E2E: API-prepared cart is checked out through UI", async ({
  pageWithCart,
  api,
  registeredUser,
  product,
  cart,
  cartPage,
  checkoutPage,
}) => {
  await test.step("Arrange: open the API-created cart in an authenticated browser", async () => {
    expect(pageWithCart).toBeTruthy();
    expect(cart.id).toBeTruthy();
    await cartPage.open();
    await expect(cartPage.quantity(product)).toHaveValue("1");
  });

  await test.step("Act: complete sign-in, address and cash-on-delivery payment steps", async () => {
    await cartPage.proceedToSignIn();
    await checkoutPage.signIn();
    await checkoutPage.fillAddress(registeredUser.account.address);
    await checkoutPage.payCashOnDelivery();
  });

  await test.step("Assert: the order is persisted with the expected customer and total", async () => {
    const order = (await api.orders.list()).data[0];
    expect(order?.user_id).toBe(registeredUser.account.id);
    expect(order?.total).toBeCloseTo(product.price);
    expect(order?.status).toBe("AWAITING_FULFILLMENT");
  });
});
