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
| `controller` | Request/session handling, expected-condition checks, workflow ordering, service calls, response mapping, HTTP statuses and API codes. Names end in `Controller`. |
| `service` | Cohesive persistence, password and external-system operations; no Express, HTTP or session mutation. |
| `validation` | Feature-owned Yup schemas; names end in `Validation`. |
| `mapper` | Pure allowlisted request/response field mapping; no persistence or workflows. |
| `model` | Necessary input, response and operation-data types. |

## Decisions

- Apply this pattern to existing auth/user code, not just new features.
- Controllers orchestrate request workflows and return early for expected
  conditions such as missing users, duplicate emails and incorrect passwords.
  Keep persistence, hashing/verification and external-system details in services;
  controllers must not import Prisma or bcrypt. No extra repositories, generic
  frameworks, barrels or empty boilerplate.
- Keep dependencies one-way: auth may use user services/mappers, not vice versa.
  Validation belongs to its consuming feature, including user password changes.
  Services must not call controllers or response mappers.
- Services return plain values: entities, lists, nullable lookups, booleans,
  operation data or void. Do not wrap them in discriminated outcome envelopes.
  Controllers choose statuses and `EApiCode` from those values. Let unexpected
  errors reach centralized error handling; no blanket catches, domain-error
  framework or HTTP-aware service errors.
- Keep consistency-sensitive operations cohesive, such as hashing and writing
  a password. An operation need not be a single query or library call, and
  operation boundaries alone do not guarantee transactional atomicity.
- Use accurate input/Prisma types, not `any` or `as any`. Preserve nullability
  and Date values until JSON serialization. Mappers select supported writable
  or public fields and never expose password hashes.
- Reuse shared middleware/helpers, especially Prisma, logging and constants.
  Use `res.success({ status, data })` or `res.fail({ status, code })` with explicit
  properties; pass `null` for successes without data and existing `EApiCode`
  values for failures. The response middleware owns `{ ok, code, data }`
  serialization without overriding `res.json()`. Register it before JSON
  parsing so early errors can use the same helpers and response envelope.
- Structural refactors preserve routes, middleware order, statuses, codes,
  fields, sessions, validation, permissions, soft deletion and mapper defaults
  (including role assignment). Types must not add runtime validation.
- Defer unfinished verification/reset/email flows and existing behavior gaps;
  placeholders are not completed-workflow examples. Do not implicitly add
  endpoints, mount unrouted controllers, change schema or implement features.
