# E2E spec template

Use E2E only for a critical journey that crosses layers. Do not duplicate isolated API/UI assertions.

```ts
import { expect, test } from "../../src/fixtures/ui.fixture";

test("E2E @smoke: critical customer outcome is persisted", async ({
  api,
  registeredUser,
  pageWithCart,
  cartPage,
}) => {
  await test.step("Arrange: prepare identity and state through API fixtures", async () => {
    expect(pageWithCart).toBeTruthy();
    await cartPage.open();
  });

  await test.step("Act: complete the critical UI journey", async () => {
    // Compose page/component business actions.
  });

  await test.step("Assert: independently verify the outcome through API", async () => {
    const orders = await api.orders.list();
    expect(orders.data.some((order) => order.user_id === registeredUser.account.id)).toBe(true);
  });
});
```

Document why E2E is necessary. Preserve unique data, account for non-deletable order history, and run both UI and E2E real suites.
