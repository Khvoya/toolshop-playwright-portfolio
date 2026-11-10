import { apiTest as test, expect } from "../../src/fixtures/api.fixture";

test.describe("Authentication API", () => {
  test("API @smoke: a registered customer receives a bearer token", async ({
    api,
    registeredUser,
  }) => {
    const token = await test.step("Act: authenticate with the generated credentials", () =>
      api.auth.login(registeredUser.credentials));

    await test.step("Assert: the token is present and has an expiration", () => {
      expect(token.access_token).toBeTruthy();
      expect(token.token_type.toLowerCase()).toBe("bearer");
      expect(token.expires_in).toBeGreaterThan(0);
    });
  });

  test("API @negative: invalid credentials are rejected", async ({ api, registeredUser }) => {
    const error = await test.step("Act: submit a valid email and an invalid password", () =>
      api.auth.loginRejected({
        email: registeredUser.credentials.email,
        password: "Wrong!Password123",
      }));

    await test.step("Assert: API exposes an authentication error", () => {
      expect(error.error).toBeTruthy();
    });
  });

  test("API: logout invalidates the current token", async ({ api, registeredUser }) => {
    expect(registeredUser.token).toBeTruthy();
    await test.step("Act: log out the authenticated API session", () => api.auth.logout());

    const error =
      await test.step("Assert: the invalidated token cannot access private favorites", () =>
        api.favorites.listUnauthorized());
    expect(error.message).toBe("Unauthorized");
  });
});
