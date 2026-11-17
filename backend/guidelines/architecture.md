# Backend architecture

```text
backend/
|-- src/
|   |-- api/
|   |   |-- auth/
|   |   `-- user/
|   |-- middleware/
|   |-- helper/
|   |-- generated/prisma/   (generated)
|   |-- app.ts
|   |-- server.ts
|   `-- startup.ts
|-- prisma/
|   |-- schema/
|   `-- migrations/
|-- tests/
|-- types/
|-- scripts/
`-- guidelines/
```

- `src/server.ts`: connect Redis, run startup, listen. `src/app.ts`: middleware and `/api` routers; preserve middleware order.
- Keep features in `src/api/<feature>/`: routes wire middleware, controllers handle HTTP, services handle persistence, mappers select fields.
- Reuse `src/middleware/` and `src/helper/`, especially the shared Prisma client and logger.
- Preserve `{ ok, code, data }` responses; use `EApiCode` and centralized error handling.
- Yup validation applies body transforms; failures return 400/`ValidationError`. Password changes use `currentPassword`/`newPassword`.
- Authentication uses Redis-backed sessions and `auth(...roles)`; lower numeric roles are more privileged.
- Edit `prisma/schema/`, include required migrations in `prisma/migrations/`, and regenerate the client. Never hand-edit generated output.
- Users are soft-deleted through `deletedAt`; filtering is not automatic. Never expose password hashes.
