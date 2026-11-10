import { setTimeout as delay } from "node:timers/promises";

export interface RetryOptions<T> {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  retryResult: (result: T) => boolean;
  retryException: (error: unknown) => boolean;
  sleep?: (milliseconds: number) => Promise<void>;
  randomValue?: () => number;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions<T>,
): Promise<T> {
  const sleep = options.sleep ?? delay;
  const randomValue = options.randomValue ?? Math.random;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt += 1) {
    try {
      const result = await operation();
      if (attempt === options.maxAttempts || !options.retryResult(result)) return result;
    } catch (error) {
      if (attempt === options.maxAttempts || !options.retryException(error)) throw error;
    }

    const backoff = Math.min(options.initialDelayMs * 2 ** (attempt - 1), options.maxDelayMs);
    await sleep(backoff * (0.5 + randomValue()));
  }

  throw new Error("Retry loop must return or throw");
}
