# Backend decisions

Status: skeleton + decisions. Auth API not implemented yet (next PR).

## What was decided and why

### Laravel, not Strapi

Evaluated both against the specs before writing anything:

- Strapi's killer feature is its editorial admin panel — the specs don't describe one. Moderation (`specs/admin/`) is an in-product community flow (report queue, approve/reject, ban), custom code either way.
- Section versioning with diff between any two versions (`specs/wiki/section/diff.md`) doesn't exist in Strapi (draft/publish is not a history) — custom layer either way.
- The repo had already moved to Laravel: `backend/` folder, three auth mail classes with blade templates, Pest configured, AGENTS.md updated.
- Cost of leaving Strapi was one-time: the dashboard spoke Strapi dialect (`populate=*`, `/event-pages`) only because it was built against the old removed Strapi. That rework happened in the API contract PR.

### API contract first

`specs/api.md` defines every route, payload and response before any backend code. The dashboard services and MSW mocks were aligned to it, so frontend and backend build against the same source of truth instead of discovering mismatches at integration time.

### Sanctum personal access tokens

- Frontend already sends `Authorization: Bearer <token>` and stores the token in localStorage (`appToken`).
- Works with separate frontend/backend deployments; no cookie/CORS/session coupling to solve now.
- Rejected Fortify/Jetstream: they bring their own UI and conventions; the contract is already ours, more code to fight than to save.

### Envelope `{ isSuccess, code, data }`

Kept the existing frontend envelope (`TWikiResponseData`) instead of switching to plain JSON or HTTP-status-only errors: the frontend error flow (`apiErrorSlice`, error modal) keys off `isSuccess` and app-level `code`. Laravel will produce it via a response macro. Error codes 100–104 are defined in `specs/api.md`.

### Small contract choices

- `PUT /users/me` instead of `PUT /users/{id}` — the server resolves the user from the token; the client never sends a user id.
- `event-pages` renamed to `/pages` — "event" doesn't appear in any spec; the UI component keeps the `EventPage` name for now.
- `isOnboarded` dropped from the update payload — nothing read it; onboarding completion is implicit in the profile fields.
- Login issues no token for unverified emails (code 101) — the spec routes them to the verification page.
- Dev runs on port 3000 (`php artisan serve --port=3000`) to match the frontend `baseUrl` with zero frontend changes.

### Deferred

- Section versioning (`section_versions` table, diff endpoint) — after auth.
- Persons, search, moderation/reports — after the wiki domain.

## What already exists

- `app/Mail/Auth/` — `VerificationMail`, `CredentialsMail`, `ForgottenPasswordMail` + blade templates, to reuse in the auth PR.
- `database/migrations/` — users, cache, jobs tables.
- `app/Models/User.php` — default Laravel user.

## What's missing

- Sanctum + token issuing/revoking.
- Auth endpoints from `specs/api.md` (register, login, me, logout, verify-email, resend-verification, forgot-password, reset-password).
- Response envelope macro + error code mapping.
- Pest tests for every route.
