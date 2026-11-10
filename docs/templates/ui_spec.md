# UI spec template

```ts
import { expect, test } from "../../src/fixtures/ui.fixture";

test("UI: customer observes a business outcome", async ({ homePage, product }) => {
  await test.step("Arrange: establish state through existing API fixtures", async () => {
    // Prefer registeredUser, product, cart, or a TestDataManager action.
  });

  await test.step("Act: perform the user journey through page objects", () => homePage.open());

  await test.step("Assert: verify the observable outcome", async () => {
    await expect(homePage.productCard(product).root).toBeVisible();
  });
});
```

Checklist: no selectors/storage code in the spec, reusable elements are root-scoped components, web-first waits replace sleeps, UI-created records are tracked, and the real UI suite passes in Chromium.
