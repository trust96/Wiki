# Backend

These instructions apply to `backend/` and its descendants, in addition to
the [root instructions](../AGENTS.md). Do not apply dashboard or site
conventions here.

## Read before changing

- [Architecture](guidelines/architecture.md): lifecycle, feature boundaries,
  HTTP contracts, authentication, and persistence.
- [Development](guidelines/development.md): environment, commands, style,
  migrations, and verification.

Read the relevant guidance before editing. Stack: Node.js, TypeScript ESM,
Express, Prisma with PostgreSQL, and Redis-backed sessions.

## Code map

| Path | Purpose |
| --- | --- |
| `src/server.ts`, `src/startup.ts` | Service connections, startup work, listener |
| `src/app.ts` | Express middleware and `/api` router registration |
| `src/api/{auth,user}/` | Feature routes, controllers, services, and supporting files |
| `src/middleware/` | Sessions, authorization, validation, responses, errors, logs, CORS |
| `src/helper/` | Shared Prisma client, constants, logger, utilities |
| `prisma/schema/`, `prisma/migrations/` | Database schema and migration history |
| `types/` | TypeScript declaration extensions |
| `tests/` | Vitest integration tests with disposable PostgreSQL and Redis |

## Common commands

Run from the repository root using the existing Yarn workspace:

```sh
yarn workspace wiki_server dev
yarn workspace wiki_server build
yarn workspace wiki_server db:generate
yarn workspace wiki_server test
yarn workspace wiki_server test:typecheck
```

Runtime requires PostgreSQL, Redis, and local configuration based on
`.env.example`. Integration tests instead require Docker and automatically
create disposable services; they do not need `.env` or development services.
See the development guide before running migrations or
`serve`: these commands change the configured database. The build bundles
code but does not type-check it. No backend lint script is configured.

## Guardrails

- Follow existing feature boundaries and reuse shared middleware, mappers,
  constants, and `src/helper/prisma.ts`; avoid parallel infrastructure.
- Preserve API paths, statuses, and the `{ ok, code, data }` response envelope
  unless the task explicitly changes them.
- Follow current code and explicit task requirements, not `specs/`.
  The root README's v1 auth description differs from the implementation.
- Never hand-edit `src/generated/` or `dist/`, or commit `.env` and secrets.
  Keep schema changes and required migrations consistent.
- Keep changes focused. Do not copy incidental implementation gaps into new
  code or introduce tooling or stack changes implicitly.
