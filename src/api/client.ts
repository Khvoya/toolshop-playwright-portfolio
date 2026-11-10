import { test } from "@playwright/test";
import type { APIRequestContext, APIResponse } from "@playwright/test";

import type { Settings } from "../config/settings";
import { withRetry } from "./retry";

export type JsonValue =
  boolean | number | string | null | JsonValue[] | { [key: string]: JsonValue };
export type QueryParameters = Record<string, string | number | boolean>;

const sensitiveFields = new Set([
  "password",
  "access_token",
  "authorization",
  "token",
  "secret",
  "cvv",
  "credit_card_number",
]);

export function redact(value: unknown): JsonValue {
  if (Array.isArray(value)) return value.map(redact);
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        sensitiveFields.has(key.toLowerCase()) ? "[REDACTED]" : redact(item),
      ]),
    );
  }
  if (
    value === null ||
    typeof value === "boolean" ||
    typeof value === "number" ||
    typeof value === "string"
  ) {
    return value;
  }
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "symbol" || typeof value === "function") return value.toString();
  return "undefined";
}

export class ApiResponseError extends Error {
  constructor(
    readonly method: string,
    readonly path: string,
    readonly status: number,
    readonly body: JsonValue,
  ) {
    super(`${method} ${path} returned ${status}: ${JSON.stringify(redact(body))}`);
    this.name = "ApiResponseError";
  }
}

export interface ApiRequestOptions {
  expectedStatus?: number | readonly number[];
  params?: QueryParameters;
  payload?: object;
  retry?: boolean;
}

export class ApiClient {
  private token: string | undefined;

  constructor(
    private readonly request: APIRequestContext,
    private readonly settings: Settings,
  ) {}

  authenticate(token: string): void {
    this.token = token;
  }

  async send<T>(method: string, path: string, options: ApiRequestOptions = {}): Promise<T> {
    const normalizedMethod = method.toUpperCase();
    const shouldRetry =
      options.retry ?? ["GET", "HEAD", "OPTIONS", "QUERY"].includes(normalizedMethod);
    const expectedStatus = options.expectedStatus ?? 200;

    await test.info().attach(`${normalizedMethod} ${path} request`, {
      body: JSON.stringify(redact(options.payload ?? {}), null, 2),
      contentType: "application/json",
    });

    const sendRequest = async (): Promise<APIResponse> =>
      this.request.fetch(path, {
        method: normalizedMethod,
        ...(options.params ? { params: options.params } : {}),
        ...(options.payload ? { data: options.payload } : {}),
        headers: {
          Accept: "application/json",
          ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        },
        timeout: this.settings.apiTimeoutMs,
      });

    const response = shouldRetry
      ? await withRetry(sendRequest, {
          maxAttempts: this.settings.apiMaxAttempts,
          initialDelayMs: this.settings.apiRetryInitialDelayMs,
          maxDelayMs: this.settings.apiRetryMaxDelayMs,
          retryResult: (item) => item.status() === 429 || item.status() >= 500,
          retryException: (error) => error instanceof Error,
        })
      : await sendRequest();

    const body = await responseBody(response);
    await test.info().attach(`${normalizedMethod} ${path} response (${response.status()})`, {
      body: JSON.stringify(redact(body), null, 2),
      contentType: "application/json",
    });

    const accepted = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
    if (!accepted.includes(response.status())) {
      throw new ApiResponseError(normalizedMethod, path, response.status(), body);
    }
    return body as T;
  }
}

async function responseBody(response: APIResponse): Promise<JsonValue> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as JsonValue;
  } catch {
    return text;
  }
}
