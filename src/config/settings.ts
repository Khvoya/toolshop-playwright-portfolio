export interface Settings {
  readonly uiBaseUrl: string;
  readonly apiBaseUrl: string;
  readonly adminEmail: string;
  readonly adminPassword: string;
  readonly headless: boolean;
  readonly actionTimeoutMs: number;
  readonly navigationTimeoutMs: number;
  readonly apiTimeoutMs: number;
  readonly apiMaxAttempts: number;
  readonly apiRetryInitialDelayMs: number;
  readonly apiRetryMaxDelayMs: number;
}

let cachedSettings: Settings | undefined;

function numberFromEnv(name: string, fallback: number, minimum = 1): number {
  const raw = process.env[name];
  const value = raw === undefined ? fallback : Number(raw);
  if (!Number.isFinite(value) || value < minimum) {
    throw new Error(`${name} must be a number greater than or equal to ${minimum}`);
  }
  return value;
}

function requiredFromEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required; copy .env.example to .env`);
  return value;
}

export function getSettings(): Settings {
  cachedSettings ??= {
    uiBaseUrl: process.env.TOOLSHOP_UI_BASE_URL ?? "http://localhost:4200",
    apiBaseUrl: process.env.TOOLSHOP_API_BASE_URL ?? "http://localhost:8091",
    adminEmail: requiredFromEnv("TOOLSHOP_ADMIN_EMAIL"),
    adminPassword: requiredFromEnv("TOOLSHOP_ADMIN_PASSWORD"),
    headless: process.env.TOOLSHOP_HEADLESS !== "false",
    actionTimeoutMs: numberFromEnv("TOOLSHOP_ACTION_TIMEOUT_MS", 10_000),
    navigationTimeoutMs: numberFromEnv("TOOLSHOP_NAVIGATION_TIMEOUT_MS", 30_000),
    apiTimeoutMs: numberFromEnv("TOOLSHOP_API_TIMEOUT_MS", 30_000),
    apiMaxAttempts: numberFromEnv("TOOLSHOP_API_MAX_ATTEMPTS", 3),
    apiRetryInitialDelayMs: numberFromEnv("TOOLSHOP_API_RETRY_INITIAL_DELAY_MS", 200),
    apiRetryMaxDelayMs: numberFromEnv("TOOLSHOP_API_RETRY_MAX_DELAY_MS", 2000),
  };
  return cachedSettings;
}
