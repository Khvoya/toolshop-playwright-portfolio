import { UserFactory } from "../../src/factories/user.factory";
import { expect, test } from "../../src/fixtures/ui.fixture";

test("UI @smoke: customer can sign in and sign out", async ({
  loginPage,
  registeredUser,
  header,
}) => {
  await test.step("Act: sign in with API-generated credentials", async () => {
    await loginPage.open();
    await loginPage.loginSuccessfully(registeredUser.credentials);
  });

  await test.step("Assert: the user menu replaces the sign-in link", async () => {
    await expect(header.navigation.root.getByTestId("nav-menu")).toBeVisible();
  });

  await test.step("Act/Assert: sign out and restore anonymous navigation", () =>
    header.navigation.signOut());
});

test("UI @negative: invalid credentials show an authentication error", async ({ loginPage }) => {
  const newUser = await test.step("Arrange: credentials for an unregistered email", () =>
    UserFactory.build());

  await test.step("Act: submit the invalid credentials", async () => {
    await loginPage.open();
    await loginPage.login({ email: newUser.email, password: "Invalid!123" });
  });

  await test.step("Assert: an accessible error is displayed", async () => {
    await expect(loginPage.error).toBeVisible();
    await expect(loginPage.error).toContainText("Invalid email or password");
  });
});
