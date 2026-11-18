# API pattern

Canonical conventions and decision record for `src/api/`. Record every agreed
pattern change here alongside its implementation; keep entries concise.

## Files and responsibilities

Keep flat feature folders: `src/api/<feature>/<feature>.<suffix>.ts`.
Use named exports and camelCase operation names. Add supporting files only
when needed; prefer specific suffixes over generic `.helper.ts` files.

| Suffix | Responsibility |
| --- | --- |
| `route` | Paths, ordered middleware, controller wiring; no business logic. |
| `controller` | Request/session handling, service calls, response mapping, HTTP statuses and API codes. Names end in `Controller`. |
| `service` | Business logic, hashing, persistence and workflows; no Express, HTTP or session mutation. |
| `validation` | Feature-owned Yup schemas; names end in `Validation`. |
| `mapper` | Pure allowlisted request/response field mapping; no persistence or workflows. |
| `model` | Necessary input, response and operation-result types. |

## Decisions

- Apply this pattern to existing auth/user code, not just new features.
- Keep persistence and business operations in services; no extra repositories,
  generic frameworks, barrels or empty boilerplate.
- Keep dependencies one-way: auth may use user services/mappers, not vice versa.
  Validation belongs to its consuming feature, including user password changes.
  Services must not call controllers or response mappers.
- Return small, operation-specific discriminated outcomes for expected failures;
  controllers map them to statuses and `EApiCode`. Let unexpected errors reach
  centralized error handling; no blanket catches or HTTP-aware service errors.
- Use accurate input/Prisma types, not `any` or `as any`. Preserve nullability
  and Date values until JSON serialization. Mappers select supported writable
  or public fields and never expose password hashes.
- Reuse shared middleware/helpers, especially Prisma, logging and constants.
  Let `formatResponse` build `{ ok, code, data }` from `{ data }` or `{ code }`.
- Structural refactors preserve routes, middleware order, statuses, codes,
  fields, sessions, validation, permissions, soft deletion and mapper defaults
  (including role assignment). Types must not add runtime validation.
- Defer unfinished verification/reset/email flows and existing behavior gaps;
  placeholders are not completed-workflow examples. Do not implicitly add
  endpoints, mount unrouted controllers, change schema or implement features.
