# Agent guide

## Purpose and boundaries

This repository contains independent TypeScript tests for Practice Software Testing Sprint 5. Do not copy, vendor, or commit upstream application source. `.runtime/` is disposable local infrastructure; never edit it to make tests pass.

Read `README.md`, `docs/ARCHITECTURE.md`, `docs/TEST_DATA.md`, and `docs/AI_TEST_GENERATION.md` before generating tests. Use the closest template in `docs/templates/`.

## Architecture rules

- Specs belong in `tests/api`, `tests/ui`, `tests/admin`, or `tests/e2e`; framework self-tests belong in `tests/self`.
- Specs contain business steps and meaningful assertions. They must not contain raw endpoint paths, browser storage scripts, CSS/XPath, or cleanup loops.
- Add endpoints to a resource client in `src/api/resources/`. Use generated DTOs from `src/api/generated/Api.ts` and domain projections from `src/api/models.ts`.
- Never edit generated DTOs manually. Run `npm run generate:api` against the pinned local application.
- Add UI actions to pages and reusable UI elements to components. Components must be scoped to a root locator.
- Use `data-test`, role, or label locators. Dynamic-attribute CSS is acceptable only when the application has no semantic locator.
- Use Playwright `expect` and locator waits. Never add fixed sleeps or arbitrary timeouts.
- Give every business action in a spec a descriptive `test.step`; nested framework steps should not duplicate the same wording.
- Keep credentials in environment settings. Never log tokens, passwords, or real secret values.

## Test data rules

- Prefer unique data through `TestDataManager` and factories. Do not mutate shared seed accounts.
- Use `registeredUser`, `product`, `cart`, `pageWithCart`, and page fixtures instead of rebuilding preconditions.
- Track resources created through UI with `trackUser`, `trackCart`, or `trackProduct` so teardown can remove them.
- Keep tests independent with two Playwright workers. No test may depend on execution order or another test's records.
- Orders have no delete endpoint and their owners cannot be deleted. Cleanup retains only these order-owning users and records the reason; use an explicit local application reset only outside individual tests.
- Product search uses a full-text index. Generated product names use words at least four characters long; do not reintroduce short search tokens such as `QA`.
- Admin edit requires a complete valid product DTO because upstream details omit stock and flat foreign keys used by the form.

## Implementation workflow

1. Find existing models, resource methods, pages, components, fixtures, and tests before creating new ones.
2. Reuse existing abstractions. Add a missing abstraction rather than placing infrastructure details in a spec.
3. Tag tests in their title with `@smoke` or `@negative` when applicable. All application tests are regression by default.
4. Give every test a clear title and descriptive Arrange/Act/Assert steps. Assert behavior and persisted state, not merely visibility.
5. Update documentation and templates when architecture or commands change.

## Required verification

Run the smallest relevant real suite and all static gates before finishing:

```bash
npm run quality
npx playwright test --list
npm run test:self
npm run test:api
npm run test:ui
npm run test:admin
npm run test:e2e
```

Start the local application with `npm run app -- start`. Never report an application test as verified if it was only listed or statically checked. Do not enable test retries locally to conceal a failure.
