import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const appDirectory = resolve(root, ".runtime/practice-software-testing");
const appRepository = "https://github.com/testsmith-io/practice-software-testing.git";
const appRevision = "ae7caecb811dd8952c09d997e69be7cb946ecd44";
const composeFile = resolve(appDirectory, "docker-compose.prod.yml");
const composeProject = "toolshop-ts-portfolio";

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, {
    cwd,
    env: {
      ...process.env,
      SPRINT: "sprint5",
      DISABLE_LOGGING: "false",
      COMPOSE_PROJECT_NAME: composeProject,
    },
    stdio: "inherit",
    shell: false,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with status ${result.status}`);
}

function ensureApplication() {
  if (!existsSync(resolve(appDirectory, ".git"))) {
    run("git", ["clone", "--no-checkout", "--filter=blob:none", appRepository, appDirectory]);
  }
  run("git", ["fetch", "--depth", "1", "origin", appRevision], appDirectory);
  run("git", ["checkout", "--detach", "FETCH_HEAD"], appDirectory);
}

function compose(...args) {
  run(
    "docker",
    ["compose", "-f", composeFile, "-f", resolve(root, "compose.app.override.yml"), ...args],
    appDirectory,
  );
}

async function endpointIsReady(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    return response.status === 200;
  } catch {
    return false;
  }
}

async function waitUntilReady(
  endpoints = ["http://localhost:4200", "http://localhost:8091/status"],
  timeoutMs = 300_000,
) {
  const deadline = Date.now() + timeoutMs;
  const pending = new Set(endpoints);
  while (pending.size > 0 && Date.now() < deadline) {
    for (const url of [...pending]) {
      if (await endpointIsReady(url)) {
        console.log(`READY: ${url}`);
        pending.delete(url);
      }
    }
    if (pending.size > 0) await delay(2000);
  }
  if (pending.size > 0) {
    throw new Error(`Application endpoints are not ready: ${[...pending].join(", ")}`);
  }
}

async function migrateDatabase() {
  compose("exec", "-T", "laravel-api", "php", "artisan", "migrate:fresh", "--seed");
  compose(
    "exec",
    "-T",
    "--user",
    "root",
    "laravel-api",
    "chown",
    "-R",
    "www-data:www-data",
    "storage",
  );
  await waitUntilReady(["http://localhost:8091/products"]);
}

const command = process.argv[2];
if (!["start", "stop", "reset", "status", "logs", "wait"].includes(command)) {
  throw new Error("Usage: npm run app -- <start|stop|reset|status|logs|wait>");
}

if (command !== "wait") ensureApplication();

switch (command) {
  case "start":
    compose("up", "--pull", "missing", "-d");
    await waitUntilReady();
    if (!(await endpointIsReady("http://localhost:8091/products"))) await migrateDatabase();
    break;
  case "stop":
    compose("down", "--remove-orphans");
    break;
  case "reset":
    compose("down", "--volumes", "--remove-orphans");
    compose("up", "--pull", "missing", "-d");
    await waitUntilReady();
    await migrateDatabase();
    break;
  case "status":
    compose("ps");
    break;
  case "logs":
    compose("logs", "--tail", "200");
    break;
  case "wait":
    await waitUntilReady();
    break;
}
