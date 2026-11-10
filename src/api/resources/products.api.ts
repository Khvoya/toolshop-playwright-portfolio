import { test } from "@playwright/test";

import type { ApiClient } from "../client";
import type {
  Brand,
  Category,
  ErrorResponse,
  NewProduct,
  Page,
  Product,
  ProductImage,
} from "../models";

export class ProductsApi {
  constructor(private readonly client: ApiClient) {}

  list(page = 1): Promise<Page<Product>> {
    return test.step("Read a product catalog page through API", () =>
      this.client.send<Page<Product>>("GET", "/products", { params: { page } }));
  }

  search(query: string, page = 1): Promise<Page<Product>> {
    return test.step("Search products through API", () =>
      this.client.send<Page<Product>>("GET", "/products/search", {
        params: { q: query, page },
      }));
  }

  get(productId: string): Promise<Product> {
    return test.step("Read product details through API", () =>
      this.client.send<Product>("GET", `/products/${productId}`));
  }

  getMissing(productId: string): Promise<ErrorResponse> {
    return test.step("Read a missing product through API", () =>
      this.client.send<ErrorResponse>("GET", `/products/${productId}`, { expectedStatus: 404 }));
  }

  async firstRegularInStock(): Promise<Product> {
    const firstPage = await this.list();
    for (let page = 1; page <= firstPage.last_page; page += 1) {
      const result = page === 1 ? firstPage : await this.list(page);
      const product = result.data.find(
        (item) => item.in_stock && !item.is_rental && item.name !== "Thor Hammer",
      );
      if (product) return product;
    }
    throw new Error("No regular in-stock product is available");
  }

  async create(product: NewProduct): Promise<Product> {
    return test.step("Create a product through admin API", async () => {
      const created = await this.client.send<Product>("POST", "/products", {
        payload: product,
        expectedStatus: 201,
        retry: false,
      });
      return this.get(created.id);
    });
  }

  update(productId: string, product: NewProduct): Promise<{ success: boolean }> {
    return test.step("Update a product through admin API", () =>
      this.client.send<{ success: boolean }>("PUT", `/products/${productId}`, {
        payload: product,
        retry: false,
      }));
  }

  delete(productId: string): Promise<null> {
    return test.step("Delete a product through admin API", () =>
      this.client.send<null>("DELETE", `/products/${productId}`, {
        expectedStatus: [204, 404],
        retry: false,
      }));
  }

  brands(): Promise<Brand[]> {
    return this.client.send<Brand[]>("GET", "/brands");
  }

  categories(): Promise<Category[]> {
    return this.client.send<Category[]>("GET", "/categories");
  }

  images(): Promise<ProductImage[]> {
    return this.client.send<ProductImage[]>("GET", "/images");
  }
}
