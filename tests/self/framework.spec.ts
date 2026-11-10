import { expect, test } from "@playwright/test";

import { redact } from "../../src/api/client";
import { withRetry } from "../../src/api/retry";
import { UserFactory } from "../../src/factories/user.factory";

test("Self: retry recovers after transient responses", async () => {
  const responses = [503, 429, 200];
  const delays: number[] = [];

  const result = await test.step("Act: execute retry without real sleeping", () =>
    withRetry(() => Promise.resolve(responses.shift() ?? 200), {
      retryResult: (status) => status === 429 || status >= 500,
      retryException: () => false,
      maxAttempts: 3,
      initialDelayMs: 200,
      maxDelayMs: 1000,
      sleep: (milliseconds) => {
        delays.push(milliseconds);
        return Promise.resolve();
      },
      randomValue: () => 0,
    }));

  await test.step("Assert: success and exponential delays are returned", () => {
    expect(result).toBe(200);
    expect(delays).toEqual([100, 200]);
  });
});

test("Self: retry does not repeat a permanent result", async () => {
  let calls = 0;
  const result = await withRetry(
    () => {
      calls += 1;
      return Promise.resolve(400);
    },
    {
      retryResult: (status) => status >= 500,
      retryException: () => false,
      maxAttempts: 3,
      initialDelayMs: 100,
      maxDelayMs: 1000,
      sleep: () => Promise.resolve(),
    },
  );

  expect(result).toBe(400);
  expect(calls).toBe(1);
});

test("Self: retry propagates a permanent exception unchanged", async () => {
  const failure = new Error("invalid response");

  await test.step("Act/Assert: a non-retryable exception is not replaced", async () => {
    await expect(
      withRetry(() => Promise.reject(failure), {
        retryResult: () => false,
        retryException: () => false,
        maxAttempts: 3,
        initialDelayMs: 100,
        maxDelayMs: 1000,
      }),
    ).rejects.toBe(failure);
  });
});

test("Self: diagnostics redact credentials recursively", async () => {
  const result = await test.step("Act: redact nested request and response data", () =>
    redact({
      email: "qa@example.com",
      password: "secret",
      nested: [{ access_token: "token", safe: 42 }],
    }));

  await test.step("Assert: secrets are hidden while useful diagnostics remain", () => {
    expect(result).toEqual({
      email: "qa@example.com",
      password: "[REDACTED]",
      nested: [{ access_token: "[REDACTED]", safe: 42 }],
    });
  });
});

test("Self: user factory creates unique valid credentials", async () => {
  const [first, second] = await test.step("Act: build two customer DTOs", () => [
    UserFactory.build(),
    UserFactory.build(),
  ]);

  await test.step("Assert: generated identities are independent and valid", () => {
    expect(first.email).not.toBe(second.email);
    expect(first.password).not.toBe(second.password);
    expect(first.address.postal_code).toBe("1234AB");
    expect(first.password).toMatch(/[A-Z]/);
    expect(first.password).toMatch(/[a-z]/);
    expect(first.password).toMatch(/[0-9]/);
    expect(first.password).toMatch(/[!]/);
  });
});
