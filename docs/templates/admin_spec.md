# Admin UI spec template

```ts
import { expect, test } from "../../src/fixtures/ui.fixture";

test("Admin UI: generated catalog record is changed", async ({
  adminApi,
  testData,
  adminProductsPage,
}) => {
  const product = await test.step("Arrange: create an isolated product through admin API", () =>
    testData.createProduct());

  await test.step("Act: execute the admin journey through page objects", async () => {
    await adminProductsPage.open();
    // Use an existing page action or extend the page/component.
  });

  await test.step("Assert: verify persistence independently through API", async () => {
    const actual = await adminApi.products.get(product.id);
    expect(actual.id).toBe(product.id);
  });
});
```

Use only generated catalog records, never seeded products. Submit a complete DTO on edit. Track UI-created products and verify mutations through API.
