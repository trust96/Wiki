# Backend agent

Laravel API (`backend/`). PHP 8.3, Laravel 13, Pest, Pint.

This file is the index. Do not copy other spaces’ conventions here.

## Before changing code

Read, in this order:

- [`backend.md`](backend.md) — locked decisions, domain, slice order
- [`endpoints.md`](endpoints.md) — **live** API contract for the dashboard

Then match the nearest existing Laravel file. Prefer extending current patterns over a new package or folder shape.

## Commands

From `backend/`:

```bash
php artisan test
vendor/bin/pint --test
php artisan route:list --path=api
```

## Source map

```
app/Http/          controllers, requests, resources, middleware
app/Models/
app/Policies/
app/Mail/          already: auth mailables
routes/api.php     API only (create it in slice 1)
database/migrations/
tests/             Pest
```

## Endpoints (required for every shipped route)

`endpoints.md` is what the frontend follows. `backend.md` is the plan, not the live catalog.

When you **create, change, or remove** a public `/api` route, update `endpoints.md` in the same change:

1. Add or edit the row in the index table.
2. Add or edit the detail block (method, path, auth, role, request, `data`, errors).
3. Write the real payload shapes, not “see controller”.
4. Delete the row if the route is gone.
5. Only list routes that exist in `php artisan route:list --path=api`.

Do not ship a slice without that update. Do not document planned-only routes as shipped.

## Non-negotiables

- One slice at a time, in the order in `backend.md`. Tick the slice checklist when it is done.
- JSON envelope: `{ isSuccess, code, data }`.
- Auth: Sanctum Bearer token. No cookie session for the dashboard.
- If a spec and `backend.md` disagree on backend behaviour, `backend.md` wins until both are updated.
- No extra tables, packages, or roles unless `backend.md` says so.
- Pest for new behaviour. Pint for style.
