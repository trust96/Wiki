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
yarn build
yarn serve
```

From repo root (workspace form):

```bash
yarn workspace wiki_server dev
```

## Validation expectations

Run validations relevant to the files you changed:

- App/runtime changes: `yarn dev` or `yarn serve`
- Typecheck: `yarn exec tsc -p ./tsconfig.json` (noEmit; production emit is esbuild via `yarn build`)
- Prisma changes: `yarn db:deploy` (and `yarn db:migrate` when developing migrations)
- Container changes (`Dockerfile` / `docker-compose.yml`):
  - Prefer root: `docker compose -f docker-compose.yml config`
  - From repo root: `docker build -f be/Dockerfile --target backend-development -t wiki-be-dev .`
  - From repo root: `docker build -f be/Dockerfile --target backend-production -t wiki-be-prod .`
  - Or root Dockerfile: `docker build -f Dockerfile --target backend-development -t wiki-be-dev .`

If a validation cannot be executed locally (missing permissions/services), report that clearly with the exact blocker.

## Docker and infra notes

- Prefer the **root** `Dockerfile` + `docker-compose.yml` (Yarn workspace-aware; shared `deps` stage).
- `be/Dockerfile` stage names match root: `backend-development`, `backend-production` (build from repo root with `-f be/Dockerfile`).
- Compose service names are network hostnames (`postgres`, `redis`, `backend-prod`).
- `DATABASE_URL` / `REDIS_URL` must resolve to those services in containerized runs.
- From the host, use `REDIS_URL=redis://127.0.0.1:6379` (see `.env.example`).
- Same-server prod: only `frontend-prod` (nginx) is published; it proxies `/auth` and `/user` to `backend-prod`. Postgres/Redis bind to `127.0.0.1` only.
- Session middleware requires Redis; connection failure aborts startup.
