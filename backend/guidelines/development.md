# Backend development

Run `yarn workspace wiki_server <script>` from the repository root; use the root `yarn.lock`.

| Script | Purpose |
| --- | --- |
| `dev` | Watch the server; requires PostgreSQL, Redis, and configuration from `.env.example` |
| `build` | Generate Prisma client and bundle; does not type-check |
| `db:generate` | Regenerate Prisma client |
| `db:migrate` / `db:deploy` | Create/apply development migrations / apply pending migrations |
| `serve` | Apply migrations and start the existing build |
| `test` | Run Vitest/Supertest integration tests; requires Docker |
| `test:typecheck` | Type-check application, tests, and test configuration |

- Confirm database targets before migrations or manual runtime checks. Never commit secrets or edit `src/generated/` or `dist/`.
- Follow nearby TypeScript ESM conventions: two spaces, LF, double quotes, semicolons; Prettier width 180. No lint/format script exists.
- Run `test` before `test:typecheck` on fresh checkouts to generate Prisma types. Pass a test file to select cases.
- Tests use real PostgreSQL, Redis, and bcrypt. Testcontainers supplies disposable services and migrations; no `.env` or development services needed.
- Keep tests serial, fixtures unique, and cleanup scoped. Close connections/transports and stop owned containers on failure too; never disable the resource reaper.
- Add focused regressions; do not treat placeholder flows as implemented. Documentation-only changes need link/whitespace checks, not services.
