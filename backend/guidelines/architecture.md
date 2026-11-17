# Backend architecture

Paths below are relative to `backend/` unless stated otherwise.

## Application lifecycle

- `src/server.ts` connects Redis, runs `src/startup.ts`, then starts listening.
  Startup currently initializes `globalThis.gemmaState` and queries users.
  Starting the server therefore requires both Redis and PostgreSQL.
- `src/app.ts` constructs the Express app separately from the listener. Its
  middleware order is JSON parsing, sessions, CORS, request logging, response
  formatting, routers under `/api`, then centralized error handling.
- Register feature routers in `src/app.ts`. Preserve middleware order unless
  the requested change requires otherwise.

## Feature organization

Features live in `src/api/`, currently `auth/` and `user/`. Follow the nearby
feature rather than creating a new architectural layer:

| File | Existing responsibility |
| --- | --- |
| `*.route.ts` | HTTP paths, methods, authorization, validation, controller wiring |
| `*.controller.ts` | Request/session access, orchestration, HTTP status and response |
| `*.service.ts` | Database operations and supporting service work |
| `*.helper.ts` | Feature helpers, including auth Yup schemas |
| `*.mapper.ts` | Explicit request/response field mapping |
| `*.model.ts` | Feature-specific TypeScript types |

Not every feature needs every file. Shared middleware belongs in
`src/middleware/`; shared utilities and constants belong in `src/helper/`.
Reuse the shared logger rather than introducing a second logging system.

## HTTP behavior

Routes currently mount under `/api`, including `/api/auth` and `/api/user`.
Preserve existing paths, status codes, and payloads unless a task explicitly
changes the contract.

Controllers send `{ data }` for success or `{ code: EApiCode.SomeCode }` for
an expected error. `formatResponse.ts` produces the shared
`{ ok, code, data }` envelope; successful responses have `code: null`, while
error responses have `data: null`. Reuse `EApiCode` from `helper/constants.ts`
and the centralized error handler instead of inventing a parallel envelope.
Inspect the formatter when changing validation or error payloads: arbitrary
fields such as `message` are not forwarded.

`validationMiddleware.ts` validates `{ body, query, params }` with Yup schemas.
It currently discards the value returned by Yup, so schema transforms do not
by themselves normalize `req.body`. Do not assume otherwise.

## Authentication and authorization

- Sessions use `express-session` with a Redis store configured in
  `sessionMiddleware.ts`; session types are extended in
  `types/express-session-type.d.ts`.
- `protectedRoutes.ts` provides `auth(...roles)`, checks `req.session.user`,
  and applies numeric role comparisons from `USER_ROLE`. Lower role numbers
  are more privileged; inspect the actual comparison before changing access.
- CORS uses the comma-separated `CORS_ORIGIN` configuration and enables
  credentials. Browser clients using sessions need credentialed requests.
- Use the existing bcrypt password hashing flow and `PASSWORD_SALT`; never
  add plaintext credential storage or logging.

Existing authentication code is not proof that every intended auth flow is
complete. Email delivery functions currently contain placeholders.

## Persistence

Import the shared client from `src/helper/prisma.ts`; it uses Prisma's pg
adapter and `DATABASE_URL`. Avoid creating clients in individual handlers.

- Prisma configuration: `prisma.config.ts`.
- PostgreSQL schema files: `prisma/schema/`.
- Versioned migrations: `prisma/migrations/`.
- Generated client: `src/generated/prisma/`; regenerate, do not hand-edit.

User deletion currently sets `deletedAt`. User list and email lookups filter
deleted users, but not every query does. Preserve the soft-delete model and
consider visibility explicitly when adding queries; do not assume automatic
filtering. Keep response field selection explicit through mappers rather than
returning raw database records, especially records containing password hashes.

## Implementation versus product intent

Consult the repository's [product overview](../../specs/README.md) and
[authentication specs](../../specs/authentication/) for relevant requirements.
Approved specs are product intent, not an inventory of implemented features.

The root README currently describes a different v1 authentication API and
`{ isSuccess, code, data }` responses. Those claims do not match the current
routes and formatter. Verify behavior in code, flag discrepancies, and clarify
the intended contract before implementing a change that depends on them.
Do not silently migrate the API or rewrite approved specs to resolve a mismatch.
