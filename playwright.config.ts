import "dotenv/config";

import { defineConfig } from "@playwright/test";

import { getSettings } from "./src/config/settings";

const settings = getSettings();

export default defineConfig({
  testDir: "./tests",
  outputDir: "./artifacts/test-results",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [
    ["list"],
    ["html", { outputFolder: "artifacts/playwright-report", open: "never" }],
    [
      "allure-playwright",
      {
        outputFolder: "artifacts/allure-results",
        detail: true,
        suiteTitle: true,
      },
    ],
  ],
  use: {
    baseURL: settings.uiBaseUrl,
    testIdAttribute: "data-test",
    headless: settings.headless,
    actionTimeout: settings.actionTimeoutMs,
    navigationTimeout: settings.navigationTimeoutMs,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "api", testDir: "./tests/api" },
    { name: "ui", testDir: "./tests/ui" },
    { name: "admin", testDir: "./tests/admin" },
    { name: "e2e", testDir: "./tests/e2e" },
    {
      name: "self",
      testDir: "./tests/self",
      use: { trace: "off", video: "off", screenshot: "off" },
    },
  ],
});
