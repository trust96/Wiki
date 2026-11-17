# Backend development

## Workspace and environment

This repository uses Yarn workspaces. The backend workspace is `wiki_server`.
Run the commands below from the repository root, not from a different project.
Use the existing workspace dependencies and lockfile rather than introducing
another package manager or backend-specific lockfile.

For local development, copy `backend/.env.example` to `backend/.env` and set
the values for the intended environment. Never commit `.env` or credentials.
PostgreSQL and Redis must be available before starting the server.

The example uses localhost for host-side connections. Within Docker Compose,
the service hostnames are `postgres` and `redis`; `localhost` would refer to
the current container. The root Compose file supplies container configuration.
Do not treat example credentials or fallback secrets as production settings.

## Existing commands

| Command from repository root | Purpose and effects |
| --- | --- |
| `yarn workspace wiki_server dev` | Watch `src/server.ts` with tsx; connects to services and runs startup work |
| `yarn workspace wiki_server db:generate` | Regenerate the Prisma client from the schema |
| `yarn workspace wiki_server db:migrate` | Run Prisma development migrations; changes the configured database and can create migration files |
| `yarn workspace wiki_server db:deploy` | Apply pending migrations to the configured database |
| `yarn workspace wiki_server build` | Generate Prisma client and bundle `src/server.ts` into `dist/` with esbuild |
| `yarn workspace wiki_server serve` | Apply migrations, then run `dist/server.js`; requires an existing build |

Confirm the target environment before database-changing commands. Do not run
migrations or launch infrastructure merely to validate documentation.
Schema changes should include the corresponding migration when required and
client regeneration. Never hand-edit generated files in `src/generated/` or
build output in `dist/`; both are ignored.

The Prisma CLI configuration has a fallback database URL so generation can run
without secrets. That fallback does not establish a working runtime database
connection; the shared runtime client reads `DATABASE_URL`.

## Code conventions

- TypeScript with ESM; follow nearby imports and named/default export choices.
  Most local imports are extensionless, while some generated-client imports
  use `.js`. Do not impose a new import convention across unrelated files.
- Root `.editorconfig` specifies two spaces, LF line endings, and a final
  newline. Source generally uses double quotes and semicolons.
- Backend `.prettierrc` sets `printWidth` to 180. No backend formatting script
  is configured; do not add tooling just to reformat a small change.
- `tsconfig.json` uses bundler module resolution and `noEmit`, with strict mode
  disabled. Keep changes compatible with existing settings rather than
  tightening compiler options incidentally.
- Follow feature-local route/controller/service organization and reuse shared
  middleware, constants, mappers, and the Prisma client. See
  [architecture](architecture.md) for behavior and boundaries.

## Verification

There are currently no backend test, lint, formatting, or type-check scripts,
and no tracked backend test suite. The `ts-jest` dependency alone is not a
configured test runner. Do not report nonexistent checks as passing or assume
a `yarn test`/`yarn lint` command exists.

For application changes, choose checks relevant to the change from the
available tooling. The build verifies generation and bundling, not TypeScript
type correctness: esbuild does not type-check. If a separate compiler check
is needed, the existing TypeScript dependency can be invoked with
`yarn workspace wiki_server exec tsc --noEmit`; its scope is determined by
`backend/tsconfig.json`, not every file in the workspace.

Runtime checks require the intended service configuration and may change
database/session state. Do not use shared or production data for ad hoc checks.
Report checks that could not be run and their blockers honestly. Add focused
tests for changed behavior when suitable test infrastructure exists; introducing
a test framework is a separate scope decision.

Documentation-only changes do not need a build or running services. Check
paths, links, claims, and whitespace; use `git diff --check` and inspect new
files as well as tracked diffs.
