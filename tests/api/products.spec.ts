import { apiTest as test, expect } from "../../src/fixtures/api.fixture";

test.describe("Products API", () => {
  test("API @smoke: catalog page matches the typed product contract", async ({ api }) => {
    const page = await test.step("Act: request the first catalog page", () => api.products.list());

    await test.step("Assert: pagination and product fields are valid", () => {
      expect(page.current_page).toBe(1);
      expect(page.data.length).toBeGreaterThan(0);
      expect(page.data.length).toBeLessThanOrEqual(page.per_page);
      expect(page.total).toBeGreaterThanOrEqual(page.data.length);
      for (const product of page.data) {
        expect(product.id).toBeTruthy();
        expect(product.name).toBeTruthy();
        expect(product.price).toBeGreaterThanOrEqual(0);
        expect(typeof product.in_stock).toBe("boolean");
        expect(product.brand.id).toBeTruthy();
        expect(product.category.id).toBeTruthy();
      }
    });
  });

  test("API: catalog pagination returns the requested page", async ({ api }) => {
    const firstPage = await test.step("Arrange: read catalog metadata", () => api.products.list());
    expect(firstPage.last_page).toBeGreaterThanOrEqual(2);

    const secondPage = await test.step("Act: request the second catalog page", () =>
      api.products.list(2));

    await test.step("Assert: the requested page contains distinct products", () => {
      expect(secondPage.current_page).toBe(2);
      expect(secondPage.data.length).toBeGreaterThan(0);
      const firstIds = new Set(firstPage.data.map((item) => item.id));
      expect(secondPage.data.some((item) => firstIds.has(item.id))).toBe(false);
    });
  });

  test("API: product search returns matching products and consistent details", async ({
    api,
    product,
  }) => {
    const results = await test.step("Act: search by the exact seeded product name", () =>
      api.products.search(product.name));

    await test.step("Assert: the requested product is present and details are consistent", async () => {
      expect(results.total).toBeGreaterThanOrEqual(1);
      expect(results.data.map((item) => item.id)).toContain(product.id);
      const details = await api.products.get(product.id);
      expect(details).toMatchObject({ id: product.id, name: product.name, price: product.price });
    });
  });

  test("API @negative: missing product returns a not-found response", async ({ api }) => {
    const error = await test.step("Act: request a nonexistent product identifier", () =>
      api.products.getMissing("missing-product-id"));

    await test.step("Assert: the error contract is meaningful", () => {
      expect(error.message ?? error.error).toBeTruthy();
    });
  });
});
