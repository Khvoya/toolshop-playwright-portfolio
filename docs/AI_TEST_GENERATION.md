# AI test generation playbook

## Required context

Before writing a test, inspect:

1. The nearest existing spec in the same suite.
2. `src/fixtures/` for reusable fixtures.
3. Existing resource clients/models for API scenarios.
4. Existing pages/components for UI scenarios.
5. `docs/TEST_DATA.md` for lifecycle and upstream constraints.

Use templates in `docs/templates/` as structural references, not as code to copy blindly.

## Generation algorithm

1. State the single business behavior and choose the lowest sufficient test level.
2. Identify existing fixtures that satisfy Arrange. Add factory/resource/data-manager support only if missing.
3. Keep endpoint paths in resource clients and selectors in pages/components.
4. Reuse generated DTOs and strict domain projections. Regenerate DTOs from the pinned Swagger document when the API changes.
5. Write a clear title and explicit Arrange/Act/Assert `test.step` blocks.
6. Assert observable behavior and independently persisted state. Avoid visibility-only assertions for mutating operations.
7. Track all generated resources for cleanup. Never use another test's data or a global reset.
8. Add `@smoke` only for a critical fast path and `@negative` for rejection/validation behavior.
9. Update abstractions, documentation, and templates if the generated test introduces a reusable concept.

## Prohibited shortcuts

- No fixed sleeps, raw API paths in specs, selectors in specs, or unconditional retries.
- No untyped response contracts when a generated DTO/domain projection exists or is needed.
- No test order dependencies, shared mutable accounts, broad catches around assertions, or local Playwright retries.
- No skips for stable application behavior, suppression of TypeScript errors, or manual edits to generated DTOs.
- No upstream source changes in `.runtime/` and no committing `.env`, artifacts, `node_modules`, or generated reports.

## Definition of done

The new spec is independent under two workers, cleanup succeeds on repeat runs, `npm run quality` passes, collection is error-free, and the relevant real suite passes against the local application. If the application cannot be started, report the test as implemented but unverified.
