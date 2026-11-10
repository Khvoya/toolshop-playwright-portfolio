import { ApiResponseError } from "../../src/api/client";
import { UserFactory } from "../../src/factories/user.factory";
import { apiTest as test, expect } from "../../src/fixtures/api.fixture";

test.describe("Users API", () => {
  test("API @smoke: registration returns the customer contract", async ({
    api,
    registeredUser,
  }) => {
    const currentUser =
      await test.step("Act: read the current user with the generated bearer token", () =>
        api.users.me());

    await test.step("Assert: persisted identity and address match the registration", () => {
      expect(currentUser.id).toBe(registeredUser.account.id);
      expect(currentUser.email).toBe(registeredUser.account.email);
      expect(currentUser.address).toEqual(registeredUser.account.address);
    });
  });

  test("API @negative: weak password is rejected during registration", async ({ api }) => {
    const newUser = await test.step("Arrange: a unique customer DTO with a weak password", () =>
      UserFactory.build({ password: "weakpassword" }));
    const error = await test.step("Act: submit the invalid registration request", () =>
      api.users.registerRejected(newUser));

    await test.step("Assert: validation details are returned", () => {
      expect(Object.keys(error).length).toBeGreaterThan(0);
    });
  });

  test("API @negative: duplicate email cannot be registered twice", async ({
    api,
    registeredUser,
  }) => {
    const duplicate = UserFactory.build({ email: registeredUser.account.email });

    await test.step("Act/Assert: the duplicate request is rejected with a conflict", async () => {
      const error = await api.users.register(duplicate).catch((value: unknown) => value);
      expect(error).toBeInstanceOf(ApiResponseError);
      expect((error as ApiResponseError).status).toBe(409);
    });
  });

  test("API @negative: anonymous customer cannot read the current user", async ({ api }) => {
    const error = await test.step("Act: request current-user data without a token", () =>
      api.users.meUnauthorized());

    await test.step("Assert: API returns an authorization error", () => {
      expect(error.message).toBe("Unauthorized");
    });
  });
});
