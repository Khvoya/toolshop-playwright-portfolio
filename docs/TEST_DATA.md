# Test data and isolation

## Rules

- Generate a unique email and password for every customer with `UserFactory`.
- Build DTOs with factories; create persistent entities through resource clients in `TestDataManager`.
- Use the seeded admin only for admin tests and cleanup, never as a customer precondition.
- Do not mutate shared customer accounts. Seeded products are read-only in customer journeys; admin tests create their own products.
- Give each test a fresh API request context and browser context. No cookies, storage, carts, or favorites are shared between tests.
- Use product names with tokens at least four characters long. The upstream full-text search does not reliably match shorter tokens.

## Lifecycle

`TestDataManager` tracks generated users, carts, favorites, and products. UI-created records must be registered with `trackUser`, `trackCart`, or `trackProduct`. Teardown removes favorites, then carts, then products, then users. Delete operations accept `404` because checkout intentionally deletes the cart after payment and UI tests may already delete their record.

Orders are historical invoices and the upstream API has no delete operation. It also rejects deleting their owners with `409`, so teardown deliberately retains only those users and records the reason; other cleanup errors fail the fixture. Run `npm run app -- reset` outside a test run when a completely fresh database is required. This destroys only this project's application volumes.

## Parallel execution

The default is two Playwright workers. Unique identities and isolated carts/products prevent data collisions. Never introduce a global database reset fixture, shared generated account, or assertion over all private records. Filter private collections by the current user and use relative invariants for public pagination/search.

## Admin edit constraint

The product-details response does not contain stock or flat brand/category/image IDs expected by the Angular edit form. Update tests therefore submit a complete valid `NewProduct` DTO. Do not work around this by editing `.runtime/` or by treating a success toast as sufficient verification.
