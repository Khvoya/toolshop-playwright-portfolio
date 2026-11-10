import { ProductFactory } from "../../src/factories/product.factory";
import { expect, test } from "../../src/fixtures/ui.fixture";

test("Admin UI @smoke: created product is persisted through API", async ({
  adminApi,
  testData,
  adminProductsPage,
  adminProductFormPage,
}) => {
  const draft =
    await test.step("Arrange: build a unique product with seeded references", async () => {
      const [brands, categories, images] = await Promise.all([
        adminApi.products.brands(),
        adminApi.products.categories(),
        adminApi.products.images(),
      ]);
      const brand = brands[0];
      const category = categories[0];
      const image = images[0];
      if (!brand || !category || !image) throw new Error("Seeded product references are required");
      return ProductFactory.build({
        brandId: brand.id,
        categoryId: category.id,
        imageId: image.id,
      });
    });

  await test.step("Act: create the product through the admin form", async () => {
    await adminProductsPage.open();
    await adminProductsPage.openAdd();
    await adminProductFormPage.create(draft);
  });

  await test.step("Assert: independent API search returns the complete product", async () => {
    const created = (await adminApi.products.search(draft.name)).data.find(
      (product) => product.name === draft.name,
    );
    if (!created) throw new Error("The UI-created product was not found through API");
    testData.trackProduct(created.id);
    expect(created.price).toBeCloseTo(draft.price);
    expect(created.brand.id).toBe(draft.brand_id);
    expect(created.category.id).toBe(draft.category_id);
  });
});

test("Admin UI: product name and price can be edited", async ({
  adminApi,
  testData,
  adminProductsPage,
  adminProductFormPage,
}) => {
  const product = await test.step("Arrange: create an isolated product through admin API", () =>
    testData.createProduct());
  const updatedName = `${product.name} Updated`;
  const updatedPrice = 29.99;
  const update = ProductFactory.build(
    {
      brandId: product.brand.id,
      categoryId: product.category.id,
      imageId: product.product_image.id,
    },
    { name: updatedName, price: updatedPrice },
  );

  await test.step("Act: edit the product through the admin form", async () => {
    await adminProductsPage.open();
    await adminProductsPage.openEdit(product);
    await adminProductFormPage.update(update);
  });

  await test.step("Assert: API details contain the updated values", async () => {
    const updated = await adminApi.products.get(product.id);
    expect(updated.name).toBe(updatedName);
    expect(updated.price).toBeCloseTo(updatedPrice);
  });
});

test("Admin UI: generated product can be deleted", async ({
  adminApi,
  testData,
  adminProductsPage,
}) => {
  const product = await test.step("Arrange: create a deletable product through admin API", () =>
    testData.createProduct());

  await test.step("Act: find and delete the product through admin UI", async () => {
    await adminProductsPage.open();
    await adminProductsPage.delete(product);
  });

  await test.step("Assert: independent API verification returns not found", async () => {
    await adminApi.products.getMissing(product.id);
  });
});
