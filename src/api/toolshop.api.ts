import type { ApiClient } from "./client";
import type { Credentials, Token } from "./models";
import { AuthApi } from "./resources/auth.api";
import { CartsApi } from "./resources/carts.api";
import { FavoritesApi } from "./resources/favorites.api";
import { OrdersApi } from "./resources/orders.api";
import { ProductsApi } from "./resources/products.api";
import { UsersApi } from "./resources/users.api";

export class ToolshopApi {
  private tokenValue: string | undefined;

  readonly auth: AuthApi;
  readonly users: UsersApi;
  readonly products: ProductsApi;
  readonly carts: CartsApi;
  readonly favorites: FavoritesApi;
  readonly orders: OrdersApi;

  constructor(readonly client: ApiClient) {
    this.auth = new AuthApi(client);
    this.users = new UsersApi(client);
    this.products = new ProductsApi(client);
    this.carts = new CartsApi(client);
    this.favorites = new FavoritesApi(client);
    this.orders = new OrdersApi(client);
  }

  get accessToken(): string {
    if (!this.tokenValue) throw new Error("API client is not authenticated");
    return this.tokenValue;
  }

  async authenticate(credentials: Credentials): Promise<Token> {
    const token = await this.auth.login(credentials);
    this.tokenValue = token.access_token;
    this.client.authenticate(token.access_token);
    return token;
  }
}
