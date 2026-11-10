import { UserFactory } from "../../src/factories/user.factory";
import { expect, test } from "../../src/fixtures/ui.fixture";

test("UI @smoke: a new customer can register and authenticate through API", async ({
  registerPage,
  api,
  testData,
}) => {
  const newUser = await test.step("Arrange: generate a unique registration DTO", () =>
    UserFactory.build());

  await test.step("Act: complete and submit the UI registration form", async () => {
    await registerPage.open();
    await registerPage.register(newUser);
  });

  await test.step("Assert: the new credentials authenticate and return the same identity", async () => {
    await api.authenticate(UserFactory.credentials(newUser));
    const account = await api.users.me();
    testData.trackUser(account.id);
    expect(account.email).toBe(newUser.email);
    expect(account.first_name).toBe(newUser.first_name);
  });
});
