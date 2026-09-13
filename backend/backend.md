# Backend plan — Wiki Dance

Laravel API for a community wiki for dancers. UI lives in `dashboard/`. Product pages live in `specs/`. This file is the backend build order and the locked domain rules.

Work one slice at a time, in order. Do not start slice N+1 until slice N is merged and tested. Do not invent extra tables, packages, or roles unless this file says so.

Shipped HTTP lives in [`endpoints.md`](endpoints.md). The dashboard follows that file, not this one.

## How to use this file

1. Read **Locked decisions** before writing code.
2. Implement the next unchecked slice. Leave later slices untouched.
3. Tick the slice checklist in this file when that slice is done.
4. Add every new `/api` route to [`endpoints.md`](endpoints.md) in the same change (index + detail). The frontend reads only that catalog.
5. If a spec and this file disagree on backend behaviour, this file wins until we update both together.

## Current state

Almost empty Laravel 13 app (PHP 8.3, Pest).

Already there:

- `User` skeleton (`name`, `email`, `password`)
- Mailables: `VerificationMail`, `ForgottenPasswordMail`, `CredentialsMail`
- No `routes/api.php`, no Sanctum, no roles, no wiki models

Dashboard already sends `Authorization: Bearer` and expects `{ isSuccess, code, data }`. Laravel owns the contract. Do not copy leftover Strapi paths (`?populate=*`, `/event-pages`).

## Locked decisions

| Topic | Decision |
| --- | --- |
| Auth | Sanctum personal access tokens. “Session” = token + `GET /api/me`. Not Laravel cookie sessions. |
| After publish | Author is public (article + profile contributions). |
| Who can edit | Anyone can propose an edit. Same draft → review → publish flow as a new article. |
| Versioning | Git-lite we own (`articles` + `revisions`). No Git binary, no auto-version trait. |
| Draft saves | Autosave updates the same draft row. Public history = published revisions only. |
| Wrong approve | Rollback = move `published_revision_id` to `parent_id`. First publish rollback = unpublish. Revert-as-new-revision is later. |
| Moderator identity | Queue payloads never include author. `block-author` resolves `author_id` only on the server. |
| Settings | Grouped endpoints (`profile`, `account`, `preferences`, `notifications`). `role` is not a user setting. |
| Permissions | Three roles, Laravel policies. No Spatie Permission. |
| Google login | Out of v1 slices. Same user + same token when we add it. |

## Non-negotiables

- Stack stays Laravel. No new framework.
- JSON envelope on every API response: `{ "isSuccess": bool, "code": number|null, "data": ... }`.
- Write actions require **verified email**, **finished onboarding**, and **not banned**.
- Moderators never receive `author_id`, `username`, `user_id`, or avatar on queue payloads. Tests must assert this.
- `first_name` / `last_name` / `email` are never on public profile payloads.
- Published history is append-only. Never delete or rewrite a published revision. Rollback only moves the live pointer.
- Pest for new behaviour. Pint for style.

---

## Domain

### Roles

| Role | Can |
| --- | --- |
| `user` | Own drafts, submit, view published, view public profiles |
| `moderator` | Everything a user can + review queue (blind) + approve/reject + rollback recently approved + `block-author` |
| `admin` | Everything + publish immediately + user search + change role + ban from anagrafica + see authors in queue |

Moderator has **no** user directory. If they can search users, anonymity is gone.

### Users

Extend `users`. Drop the generic `name` column when we add real profile fields.

| Column | Notes |
| --- | --- |
| `username` | Unique, public |
| `first_name`, `last_name` | Private |
| `bio`, `avatar_path` | Public |
| `role` | `user` \| `moderator` \| `admin` |
| `email_verified_at` | Already exists |
| `onboarding_completed_at` | Null until onboarding is done |
| `banned_at`, `ban_reason` | Internal |
| `deleted_at` | Soft delete |
| `theme`, `locale` | Preferences. Or a `preferences` JSON — pick one and keep it. |

Settings groups (not one mega-form):

| Group | Fields | Route |
| --- | --- | --- |
| Profile | username, names, bio, avatar | `PATCH /api/me/profile` |
| Account | email, password, delete | `PATCH /api/settings/email`, `.../password`, `DELETE /api/me` |
| Preferences | theme, locale | `PATCH /api/settings/preferences` |
| Notifications | mail on approve/reject | `PATCH /api/settings/notifications` |

`GET /api/me` → self (profile + settings + role).  
`GET /api/users/{username}` → public only.  
`GET /api/users/{username}/contributions` → published revisions only.

### Articles (Git-lite)

```
articles
  id (uuid)
  type                  -- start with `person` only
  slug
  status                -- draft | pending_review | published | rejected
  published_revision_id -- null until first successful publish
  timestamps

revisions
  id (uuid)
  article_id
  parent_id             -- previous live revision (commit parent). Null on first draft
  author_id             -- always stored, never sent to moderators
  snapshot              -- JSON: full person fields + sections
  status                -- draft | pending_review | published | rejected | superseded
  submit_note
  reviewed_by, reviewed_at, review_note
  timestamps
```

`snapshot` is the whole page at that commit. Diff is computed on read between two snapshots. Do not store packfile-style diffs in v1.

One open draft per `(article, user)`. Autosave mutates that row. Submit freezes it (`pending_review`). After that the row is immutable.

```
user saves draft     → same revision row, status=draft
user submits         → status=pending_review
moderator approves   → if parent_id == articles.published_revision_id
                       then published_revision_id = this revision
                       else conflict (author rebases onto new main)
moderator rejects    → status=draft, review_note set, author edits same row and resubmits
admin publishes      → same as approve, skips the queue
```

Public history = revisions that were live (`published` or `superseded`). Drafts stay private to the author.

### Rollback (wrong approve)

Approve only moves the pointer. Nothing is deleted.

- **Rollback:** `published_revision_id = current.parent_id`. Mark the bad revision `superseded`. Page shows the previous live snapshot.
- **First publish rollback:** `published_revision_id = null`, article unpublished. Revision stays for author/admin.
- **Do not** send a published revision back to the review queue.
- Open drafts whose `parent_id` is no longer main are conflicts. Author rebases.

Who:

- Admin: always
- Moderator: only on a revision they approved, within 24 hours

`publication_events` (optional in slice 3, required if rollback ships): `article_id`, `revision_id`, `action` (`publish` \| `rollback` \| `unpublish`), `actor_id`, `at`.

Revert-as-new-revision (copy old snapshot, parent = current main, publish) is **not** in v1.

### Moderation (blind)

Two queues, same anonymity rule:

1. **Review** — new articles and edits (`pending_review`)
2. **Reports** — published content flagged by users (after slice 4)

Moderator sees content, type, dates, maybe `author_prior_rejections` (a number). Never identity.

Actions hit the object, not a person:

- `POST /api/moderation/revisions/{id}/approve`
- `POST /api/moderation/revisions/{id}/reject`
- `POST /api/moderation/revisions/{id}/rollback`
- `POST /api/moderation/revisions/{id}/block-author`

`block-author` bans `revision.author` and returns `{ "blocked": true }` only.

Banned user: cannot login, cannot write. Published pages stay up until an admin unpublishes them. Their pending revisions close.

Admin queue resources **may** include author. Moderator resources **must not**.

Internal audit (admin only): who approved / rejected / blocked / rolled back, which revision, which `author_id`.

---

## API (target)

Prefix `/api`. Auth: `Authorization: Bearer {token}`.

This list is the **goal**. What the frontend may call is only what is in [`endpoints.md`](endpoints.md).

### Auth

```
POST /api/auth/register
POST /api/auth/login              -- identifier = email or username
POST /api/auth/logout
POST /api/auth/verify/{code}      -- issues token, then onboarding
POST /api/auth/resend-verification
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

Register does **not** return a token. Verify and login return `{ token, user }`.  
Unverified login → dedicated error code, not a generic 401.  
Banned login → 403.

### Me / users / settings

```
GET    /api/me
PATCH  /api/me/profile
PATCH  /api/settings/password
PATCH  /api/settings/email
PATCH  /api/settings/preferences
PATCH  /api/settings/notifications
DELETE /api/me

GET    /api/users/{username}
GET    /api/users/{username}/contributions
```

### Articles

```
POST   /api/articles
GET    /api/articles/{slug}                 -- published only
GET    /api/me/drafts
PATCH  /api/revisions/{id}                  -- owner, draft only
POST   /api/revisions/{id}/submit
GET    /api/articles/{slug}/revisions       -- public history
GET    /api/revisions/{a}/diff/{b}
```

### Moderation

```
GET    /api/moderation/queue
GET    /api/moderation/revisions/{id}       -- blind resource
POST   /api/moderation/revisions/{id}/approve
POST   /api/moderation/revisions/{id}/reject
POST   /api/moderation/revisions/{id}/rollback
POST   /api/moderation/revisions/{id}/block-author
```

### Admin only

```
GET    /api/admin/users
PATCH  /api/admin/users/{id}/role
POST   /api/admin/users/{id}/ban
```

---

## Slices

Do these in order. Each slice is a vertical: migration + models + policy + routes + Pest.

### Slice 1 — Auth + me

- [ ] Add Laravel Sanctum.
- [ ] Register `routes/api.php` in `bootstrap/app.php`.
- [ ] Shared JSON envelope for `/api/*`.
- [ ] Extend `users` (username, names, bio, avatar, role, onboarding, ban, soft delete). Keep `role` default `user`.
- [ ] Register, login (`identifier`), logout, verify, resend, forgot, reset.
- [ ] Reuse existing mailables. Verification link stays 1 month; verify issues a token.
- [ ] `GET /api/me`, `PATCH /api/me/profile` (this is onboarding when `onboarding_completed_at` is null).
- [ ] Seed one admin.
- [ ] Pest: happy paths, bad password, unverified, banned, token revoke, private fields absent from public shapes.
- [ ] Add every shipped route from this slice to `endpoints.md`.

**Out of this slice:** articles, settings groups beyond profile, Google.

### Slice 2 — Settings + policies

- [ ] Settings group endpoints (password, email, preferences, notifications, delete).
- [ ] Change password revokes tokens; user logs in again.
- [ ] Delete account = soft delete + revoke tokens.
- [ ] Role enum + policies. Admin user search / role / ban routes.
- [ ] Pest: user cannot change own role; moderator cannot list users; admin can.
- [ ] Add every shipped route from this slice to `endpoints.md`.

**Out of this slice:** wiki.

### Slice 3 — Articles + drafts + Git-lite

- [ ] `articles`, `revisions`, `publication_events`.
- [ ] Create article + draft revision. Autosave. One open draft per user per article.
- [ ] Submit. List own drafts. Public `GET` only if published.
- [ ] Admin direct publish (fast-forward if parent matches).
- [ ] Conflict when `parent_id !== published_revision_id`.
- [ ] Public revision list + diff between two snapshots.
- [ ] First `type`: `person`. Snapshot shape matches `specs/wiki/person/*` + sections.
- [ ] Pest: owner-only draft write; stranger cannot read others’ drafts; published GET hides nothing required and does show author; conflict on stale parent.
- [ ] Add every shipped route from this slice to `endpoints.md`.

**Out of this slice:** moderator queue (admin may publish to unblock tests).

### Slice 4 — Blind queue + rollback + block

- [ ] Moderator queue + blind revision resource.
- [ ] Approve / reject / rollback / block-author.
- [ ] Rollback rules (parent pointer, first-publish unpublish, 24h moderator window).
- [ ] Ban side effects (login + write).
- [ ] Admin-only audit of moderation actions.
- [ ] Pest: moderator JSON has no identity fields; approve fast-forward; stale approve = conflict; rollback restores parent; block-author response has no username; banned user cannot login.
- [ ] Add every shipped route from this slice to `endpoints.md`.

**Out of this slice:** user reports, search, Google, revert-as-new-revision.

---

## Later (do not build now)

- Report queue on published content (`specs/admin/moderation.md`)
- Search
- Google OAuth
- Revert as a new published revision
- Extra article `type`s
- Stored diffs / hybrid snapshot packing
- Notifications delivery beyond the settings flags
- Cookie/SPA Sanctum session

## Packages we will not use for wiki history

| Package | Why not |
| --- | --- |
| `overtrue/laravel-versionable` | Versions on every `save()`. No parent, no draft vs published, no queue. |
| `avocet-shores/laravel-rewind` | Same save-driven model. Too young. |
| Real Git | Breaks search, blind queue, and hosting. |
| Spatie Permission | Three roles. Policies are enough. |

`owen-it/laravel-auditing` is optional for admin audit. A small `moderation_events` table is enough if we skip the package.

`jfcherng/php-diff` is fine later for readable diffs. v1 can diff two JSON snapshots in application code.

## Test command

From `backend/`:

```bash
php artisan test
vendor/bin/pint --test
```

## Mapping to specs

| Spec | Backend slice |
| --- | --- |
| `specs/authentication/*` | 1–2 |
| `specs/authentication/profile.md` | 1–2 (public contributions after slice 3) |
| `specs/authentication/settings.md` | 2 |
| `specs/wiki/person/*`, `specs/wiki/section/*` | 3 |
| `specs/admin/users.md` | 2 (admin) |
| `specs/admin/moderation.md` | 4 (review queue now; reports later) |
