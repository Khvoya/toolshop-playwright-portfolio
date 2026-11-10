import { test } from "@playwright/test";

import { ApiResponseError } from "../api/client";
import type { Cart, Favorite, Product, TestUser } from "../api/models";
import type { ToolshopApi } from "../api/toolshop.api";
import { ProductFactory } from "../factories/product.factory";
import { UserFactory } from "../factories/user.factory";

export class TestDataManager {
  private readonly userIds: string[] = [];
  private readonly cartIds: string[] = [];
  private readonly favoriteIds: string[] = [];
  private readonly productIds: string[] = [];

  constructor(
    private readonly api: ToolshopApi,
    private readonly adminApi: ToolshopApi,
  ) {}

  async createUser(authenticate = true): Promise<TestUser> {
    const newUser = UserFactory.build();
    const account = await this.api.users.register(newUser);
    this.trackUser(account.id);
    const user: TestUser = { account, credentials: UserFactory.credentials(newUser) };
    if (authenticate) {
      const token = await this.api.authenticate(user.credentials);
      user.token = token.access_token;
    }
    return user;
  }

  trackUser(userId: string): void {
    if (!this.userIds.includes(userId)) this.userIds.push(userId);
  }

  trackCart(cartId: string): void {
    if (!this.cartIds.includes(cartId)) this.cartIds.push(cartId);
  }

  trackProduct(productId: string): void {
    if (!this.productIds.includes(productId)) this.productIds.push(productId);
  }

  async createCart(product: Product, quantity = 1): Promise<Cart> {
    const cartId = await this.api.carts.create();
    this.trackCart(cartId);
    await this.api.carts.addItem(cartId, product.id, quantity);
    return this.api.carts.get(cartId);
  }

  async createFavorite(product: Product): Promise<Favorite> {
    const favorite = await this.api.favorites.add(product.id);
    this.favoriteIds.push(favorite.id);
    return favorite;
  }

  async createProduct(): Promise<Product> {
    const [brands, categories, images] = await Promise.all([
      this.adminApi.products.brands(),
      this.adminApi.products.categories(),
      this.adminApi.products.images(),
    ]);
    const brand = brands[0];
    const category = categories[0];
    const image = images[0];
    if (!brand || !category || !image) {
      throw new Error("Seeded product references are required");
    }
    const product = await this.adminApi.products.create(
      ProductFactory.build({
        brandId: brand.id,
        categoryId: category.id,
        imageId: image.id,
      }),
    );
    this.trackProduct(product.id);
    return product;
  }

  async cleanup(): Promise<void> {
    const errors: unknown[] = [];
    await this.cleanupAll(this.favoriteIds, (id) => this.api.favorites.delete(id), errors);
    await this.cleanupAll(this.cartIds, (id) => this.api.carts.delete(id), errors);
    await this.cleanupAll(this.productIds, (id) => this.adminApi.products.delete(id), errors);
    await this.cleanupAll(this.userIds, (id) => this.deleteUser(id), errors);
    if (errors.length > 0) throw new AggregateError(errors, "Test data cleanup failed");
  }

  private async deleteUser(userId: string): Promise<void> {
    try {
      await this.adminApi.users.delete(userId);
    } catch (error) {
      if (!(error instanceof ApiResponseError) || error.status !== 409) throw error;
      await test.info().attach("Cleanup note", {
        body: `User ${userId} retained because upstream preserves order history`,
        contentType: "text/plain",
      });
    }
  }

  private async cleanupAll(
    ids: string[],
    cleanup: (id: string) => Promise<unknown>,
    errors: unknown[],
  ): Promise<void> {
    for (const id of ids.reverse()) {
      try {
        await cleanup(id);
      } catch (error) {
        errors.push(error);
      }
    }
  }
}
