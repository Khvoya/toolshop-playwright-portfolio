import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateApi } from "swagger-typescript-api";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const apiBaseUrl = process.env.TOOLSHOP_API_BASE_URL ?? "http://localhost:8091";

await generateApi({
  name: "data-contracts.ts",
  url: `${apiBaseUrl}/docs?api-docs.json`,
  output: resolve(root, "src/api/generated"),
  generateClient: false,
  generateRouteTypes: false,
  generateResponses: false,
  sortTypes: true,
  silent: false,
});
