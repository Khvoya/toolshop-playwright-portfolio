# Abstraction decision checklist

## Add a resource method when

- A spec needs a new endpoint, expected status, or payload shape.
- The same API operation is needed by fixtures and specs.
- A negative case deserves an explicit expected-status method.

Use generated DTOs where possible and domain projections for required business fields. Do not edit `src/api/generated/Api.ts` manually.

## Add a component when

- The same UI element group appears on multiple pages.
- Locators/actions should be scoped beneath a stable root.
- The element has independent behavior, such as navigation, pagination, a card, toast, or form.

## Add a page method when

- The action belongs to one route or business screen.
- A spec would otherwise contain selectors, storage scripts, or low-level browser orchestration.

## Add a fixture when

- Multiple tests need the same isolated precondition or teardown.
- Browser/API state can be built through the API wrapper.
- The lifecycle can be guaranteed for passing and failing tests.

Keep factories responsible for valid unique DTOs, `TestDataManager` for persistent resource lifecycles, and specs for business intent and assertions.
