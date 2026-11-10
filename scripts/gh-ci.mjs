import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const [command, ...args] = process.argv.slice(2);

function gh(ghArgs) {
  const result = spawnSync("gh", ghArgs, { stdio: "inherit", shell: false });
  if (result.error) {
    throw new Error("GitHub CLI is unavailable; install gh and run gh auth login", {
      cause: result.error,
    });
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

switch (command) {
  case "workflows":
    gh(["workflow", "list"]);
    break;
  case "runs":
    gh(["run", "list", "--workflow", "ci.yml", "--limit", args[0] ?? "10"]);
    break;
  case "dispatch":
    gh(["workflow", "run", "ci.yml", "--ref", args[0] ?? "main"]);
    gh(["run", "list", "--workflow", "ci.yml", "--limit", "5"]);
    break;
  case "watch":
    if (!args[0]) throw new Error("Usage: npm run gh:ci -- watch <run-id>");
    gh(["run", "watch", args[0], "--exit-status"]);
    break;
  case "download":
    if (!args[0]) throw new Error("Usage: npm run gh:ci -- download <run-id> [directory]");
    gh(["run", "download", args[0], "--dir", resolve(args[1] ?? "artifacts/downloaded")]);
    break;
  default:
    throw new Error("Usage: npm run gh:ci -- <workflows|runs|dispatch|watch|download> [args]");
}
