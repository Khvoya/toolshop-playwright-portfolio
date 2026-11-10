import { test } from "@playwright/test";

import type { ApiClient } from "../client";
import type { ErrorResponse, NewUser, User } from "../models";

export class UsersApi {
  constructor(private readonly client: ApiClient) {}

  register(user: NewUser): Promise<User> {
    return test.step("Register a user through API", () =>
      this.client.send<User>("POST", "/users/register", {
        payload: user,
        expectedStatus: 201,
        retry: false,
      }));
  }

  registerRejected(user: NewUser): Promise<ErrorResponse> {
    return test.step("Reject invalid user registration through API", () =>
      this.client.send<ErrorResponse>("POST", "/users/register", {
        payload: user,
        expectedStatus: 422,
        retry: false,
      }));
  }

  me(): Promise<User> {
    return test.step("Read the authenticated user through API", () =>
      this.client.send<User>("GET", "/users/me"));
  }

  meUnauthorized(): Promise<ErrorResponse> {
    return test.step("Reject anonymous current-user access through API", () =>
      this.client.send<ErrorResponse>("GET", "/users/me", { expectedStatus: 401 }));
  }

  delete(userId: string): Promise<null> {
    return test.step("Delete a generated user through admin API", () =>
      this.client.send<null>("DELETE", `/users/${userId}`, {
        expectedStatus: [204, 404],
        retry: false,
      }));
  }
}
