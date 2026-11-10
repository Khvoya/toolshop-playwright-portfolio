import { test } from "@playwright/test";

import type { Credentials, ErrorResponse, Token } from "../models";
import type { ApiClient } from "../client";

export class AuthApi {
  constructor(private readonly client: ApiClient) {}

  login(credentials: Credentials): Promise<Token> {
    return test.step("Authenticate through API", () =>
      this.client.send<Token>("POST", "/users/login", { payload: credentials, retry: false }));
  }

  loginRejected(credentials: Credentials): Promise<ErrorResponse> {
    return test.step("Reject invalid credentials through API", () =>
      this.client.send<ErrorResponse>("POST", "/users/login", {
        payload: credentials,
        expectedStatus: 401,
        retry: false,
      }));
  }

  logout(): Promise<null> {
    return test.step("Log out through API", () => this.client.send<null>("GET", "/users/logout"));
  }
}
