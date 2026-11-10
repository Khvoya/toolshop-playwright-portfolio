import { expect, test } from "@playwright/test";

test("framework configuration is available without the application", async () => {
  await test.step("Assert: the self-test project runs independently", () => {
    expect(test.info().project.name).toBe("self");
  });
});
