# Backend (`be/`) agent

Node/TypeScript API service in `be/` using Prisma + PostgreSQL, Redis-backed sessions, and Docker Compose for local infra.

This guide applies only to files under `be/`.

## Before changing code

Read the nearest related code first, then match existing patterns:

- `be/package.json` for real scripts/entrypoints
- `be/tsconfig.json` for compile boundaries and output
- `be/prisma/schema/main.prisma` for DB datasource/client targets
- `be/src/helper/constants.ts` for env defaults
- `be/src/server.ts` and `be/src/startup.ts` for runtime boot flow

Prefer extending current structure over introducing new architecture.

## Conventions

- Keep changes small and scoped to the requested behavior.
- Prefer environment-driven configuration; avoid hardcoded credentials and hosts.
- Keep Prisma schema and app usage in sync when changing DB behavior.
- Reuse existing middleware/helper patterns before adding new abstractions.
- Preserve API behavior unless the task explicitly asks for a contract change.

## Commands

From `be/`:

```bash
yarn dev
yarn db:migrate
yarn db:deploy
yarn serve
```

From repo root (workspace form):

```bash
yarn workspace wiki_server dev
```

## Validation expectations

Run validations relevant to the files you changed:

- App/runtime changes: `yarn dev` or `yarn serve`
- Prisma changes: `yarn db:deploy` (and `yarn db:migrate` when developing migrations)
- Container changes (`Dockerfile` / `docker-compose.yml`):
  - `docker compose -f docker-compose.yml config`
  - `docker build --target development -t wiki-be-dev .`
  - `docker build --target production -t wiki-be-prod .`

If a validation cannot be executed locally (missing permissions/services), report that clearly with the exact blocker.

## Docker and infra notes

- Compose service names are network hostnames (`postgres`, `redis`).
- `DATABASE_URL` must resolve to the Postgres service in containerized runs.
- Session middleware currently expects Redis at `redis://redis:6379`; keep compose/app alignment when editing infra.
