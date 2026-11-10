import { expect, test } from "../../src/fixtures/ui.fixture";

test("UI @negative: checkout requires a payment method", async ({
  pageWithCart,
  cartPage,
  checkoutPage,
  registeredUser,
}) => {
  await test.step("Arrange: reach payment through an API-created cart and browser session", async () => {
    expect(pageWithCart).toBeTruthy();
    await cartPage.open();
    await cartPage.proceedToSignIn();
    await checkoutPage.signIn();
    await checkoutPage.fillAddress(registeredUser.account.address);
  });

  await test.step("Assert: order submission is disabled until payment is selected", async () => {
    await expect(checkoutPage.finishButton).toBeVisible();
    await expect(checkoutPage.finishButton).toBeDisabled();
  });
});
