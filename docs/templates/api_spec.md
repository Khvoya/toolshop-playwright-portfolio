# API spec template

Choose the closest existing spec first. The example shows structure; reuse real resources and fixtures instead of inventing parallel abstractions.

```ts
import { apiTest as test, expect } from "../../src/fixtures/api.fixture";

test("API @negative: business rule is enforced", async ({ api, registeredUser }) => {
  const input = await test.step("Arrange: describe the generated input", async () => {
    return undefined; // Replace with a factory/fixture result.
  });

  await test.step("Act: call a resource-client business action", async () => {
    // Reuse or add a resource method; never put an endpoint path here.
  });

  await test.step("Assert: verify the business error or persisted state", () => {
    expect(input).toBeDefined();
  });
});
```

Checklist: expected status belongs in the resource, secrets are redacted, mutating calls disable transport retry, created records are tracked, and the real API suite passes.
