# Architecture

## Layers

1. **Specs** (`tests/`) describe a business rule with `test.step` and assertions.
2. **Fixtures** (`src/fixtures/`) compose settings, Playwright, API sessions, browser state, data lifecycle, and pages.
3. **Pages/components** (`src/ui/`) own browser interactions and locators. Every component is scoped to a root locator.
4. **Resource clients** (`src/api/resources/`) own endpoint semantics and expected statuses.
5. **Transport** (`src/api/client.ts`) owns headers, authentication, redacted diagnostics, retries, status checks, and JSON decoding.
6. **Generated DTOs/domain models/factories** provide API contracts and unique valid input data.
7. **TestDataManager** tracks resources and cleans them in reverse dependency order.

Specs depend on pages/resources, not transport. Pages may expose locators for web-first assertions; they should not hide expected business values.

## Choosing a test level

- Use **API** for status, validation, response contracts, isolated business rules, and data setup.
- Use **UI** for rendering, interaction, navigation, client validation, and browser-visible state.
- Use **Admin UI** for administrator journeys over generated, isolated catalog data.
- Use **E2E** only for critical journeys that cross at least two layers and need independent verification.
- Use **self** for deterministic tests of framework helpers without the application.

Do not repeat the same assertion at all levels. API verifies contracts and persisted state; UI verifies rendering and interaction; E2E verifies a critical customer outcome.

## Settings

`getSettings()` centralizes `TOOLSHOP_` environment settings and `.env`: UI/API URLs, timeouts, retry policy, browser mode, and seeded admin cleanup credentials. Do not read environment variables elsewhere in test code.

## Swagger and domain models

`npm run generate:api` uses `swagger-typescript-api` and the local `/docs?api-docs.json` endpoint. It generates DTOs only; handwritten resource clients remain responsible for transport semantics. Upstream Swagger marks many response fields optional, so `src/api/models.ts` defines strict domain projections for fields required by the tested business contract. Do not manually edit generated code or claim that TypeScript types provide runtime validation.

## Browser authentication

API login creates a bearer token. `authenticatedPage` installs it as `auth-token` before the first application navigation. `pageWithCart` also installs the API-created `cart_id` in session storage. `adminPage` uses the seeded admin token. Login UI is exercised explicitly only in authentication and E2E specs.

## Retry policy

Transport retries only safe/idempotent methods by default and only on `429`, `5xx`, or Playwright request errors. Mutating requests opt out. The helper uses exponential backoff with jitter and is covered by deterministic self-tests. Assertion failures are never retried by transport. CI alone enables one Playwright retry so both attempts and diagnostics remain visible.

## Diagnostics

Every run writes Playwright HTML and Allure results. Failed browser tests include screenshot, video, trace, last URL, and console/page errors. API requests/responses are attached with passwords, tokens, and payment secrets recursively redacted.
