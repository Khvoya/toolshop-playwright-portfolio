# Continuous integration

## Workflow

`.github/workflows/ci.yml` has two job types:

- `quality`: locked npm install, Prettier, ESLint, strict TypeScript, dependency audit, and self-tests.
- `tests`: API/UI/Admin/E2E matrix against an independent pinned Docker application on each runner.

Pull requests run only `@smoke` tests. Main-branch pushes and manual dispatch run all application tests. Each runner uses two Playwright workers and one diagnostic retry. Local runs have no test retry.

The API job also regenerates Swagger DTOs and fails if the committed generated file is stale.

## Artifacts

Each suite uploads `allure-results-<suite>-<run-number>` for 14 days. Failure traces, videos, screenshots, and Playwright HTML are uploaded separately. Application logs are printed on failure. The application is stopped in an `always()` step.

Download a run's artifacts:

```bash
npm run gh:ci -- download <run-id>
allure generate artifacts/downloaded/allure-results-api-<run-number> --clean -o artifacts/allure-report
```

Point Allure at the directory containing `*-result.json` files; each suite must be rendered separately or its results copied into one directory.

## GitHub CLI

`scripts/gh-ci.mjs` wraps non-interactive `gh workflow` and `gh run` commands. Run `gh auth login` first. No GitHub token is stored in project files.

```bash
npm run gh:ci -- workflows
npm run gh:ci -- runs
npm run gh:ci -- dispatch main
npm run gh:ci -- watch <run-id>
npm run gh:ci -- download <run-id>
```

## Failure policy

A retry is diagnostic, not a quality-gate bypass. Investigate the first attempt and fix product/test defects. Do not increase retries, skip a stable assertion, or add fixed sleeps to obtain a green workflow.
