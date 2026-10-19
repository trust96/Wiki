# Backend domain — Wiki Dance

Domain plan for the Node API in `be/`. UI lives in `dashboard/`. Product pages live in `specs/`.

Work one slice at a time, in order. Do not start slice N+1 until slice N is done. Do not invent extra tables, packages, or roles unless this file says so.

Shipped HTTP lives in [`endpoints.md`](endpoints.md). The dashboard follows that file, not this one.

## How to use this file

1. Read **Locked decisions** before writing code.
2. Implement the next unchecked slice in `be/`, matching the existing Express + Prisma code.
3. Tick the slice checklist in this file when that slice is done.
4. Add every new `/api` route to [`endpoints.md`](endpoints.md) in the same change (index + detail). The frontend reads only that catalog.
5. If a spec and this file disagree on backend behaviour, this file wins until we update both together.

## Current state

Service is `be/` (Express, Prisma, Postgres, Redis sessions).

Already shipped (see [`endpoints.md`](endpoints.md)):

- Register, login, logout
- Forgotten-password routes (handlers do not send mail or change the password yet)
- User read, update, soft delete, change password
- User columns: `email`, `password`, `name`, `surname`, `status`, `role`, `verifiedAt`, `bannedAt`, `deletedAt`

Not built yet: wiki articles, revisions, moderation, public profiles, onboarding, verification mail.

Do not copy leftover Strapi paths (`?populate=*`, `/event-pages`).

## Locked decisions

| Topic | Decision |
| --- | --- |
| Auth | Redis session cookie already used by `be`. Do not add a second auth stack. |
| After publish | Author is public (article + profile contributions). |
| Who can edit | Anyone can propose an edit. Same draft → review → publish flow as a new article. |
| Versioning | Git-lite we own (`articles` + `revisions`). No Git binary, no library that versions every save. |
| Draft saves | Autosave updates the same draft row. Public history = published revisions only. |
| Wrong approve | Rollback = move `published_revision_id` to `parent_id`. First publish rollback = unpublish. Revert-as-new-revision is later. |
| Moderator identity | Queue payloads never include author. `block-author` resolves `author_id` only on the server. |
| Settings | Grouped endpoints (`profile`, `account`, `preferences`, `notifications`). `role` is not a user setting. |
| Permissions | Three roles, checked in application code. No permission package. |
| Google login | Out of v1 slices. Same user + same session when we add it. |

## Non-negotiables

- Stack stays the Node service in `be/`. No second framework.
- Keep the JSON envelope `be` already sends: `{ "ok": bool, "code": number|null, "data": ... }`.
- Write actions require **verified email**, **finished onboarding**, and **not banned**.
- Moderators never receive `author_id`, `username`, `user_id`, or avatar on queue payloads. Tests must assert this.
- `first_name` / `last_name` / `email` are never on public profile payloads.
- Published history is append-only. Never delete or rewrite a published revision. Rollback only moves the live pointer.

---

## Domain

### Roles

| Role | Can |
| --- | --- |
| `user` | Own drafts, submit, view published, view public profiles |
| `moderator` | Everything a user can + review queue (blind) + approve/reject + rollback recently approved + `block-author` |
| `admin` | Everything + publish immediately + user search + change role + ban from anagrafica + see authors in queue |

Moderator has **no** user directory. If they can search users, anonymity is gone.

`be` stores `role` as a number today (`ADMIN = 100`, `MODERATOR = 250`, `USER = 500`). Keep that encoding unless a later slice changes it on purpose.

### Users

Extend `User`. The generic `name` column is already there; add the real profile fields below when the slice needs them.

| Column | Notes |
| --- | --- |
| `username` | Unique, public |
| `first_name`, `last_name` | Private. Today the row has `name` and `surname`. |
| `bio`, `avatar_path` | Public |
| `role` | `user` \| `moderator` \| `admin` (stored as the numbers above) |
| `verifiedAt` | Already exists |
| `onboarding_completed_at` | Null until onboarding is done |
| `bannedAt`, `ban_reason` | `bannedAt` exists. `ban_reason` does not yet. |
| `deletedAt` | Soft delete. Already exists. |
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

These settings routes are the goal. Shipped user routes are in [`endpoints.md`](endpoints.md).

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

Prefix `/api`. Shipped auth is the session in [`endpoints.md`](endpoints.md). The list below is the goal for slices that are not shipped yet.

### Auth

Already shipped: register, login, logout, forgotten-password stubs. Still to build:

```
POST /api/auth/verify/{code}      -- then onboarding
POST /api/auth/resend-verification
```

Forgot / reset password stay on the routes already in [`endpoints.md`](endpoints.md). Finish the handlers there; do not add a parallel pair.

Register does **not** return a session by itself. Login opens the session.  
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

Do these in order. Each slice is a vertical: Prisma schema + routes + checks.

### Slice 1 — Auth + me

- [x] Register, login, logout (session). See [`endpoints.md`](endpoints.md).
- [x] Shared JSON envelope for `/api/*`: `{ ok, code, data }`. Keep it.
- [ ] Extend `User` (username, names, bio, avatar, onboarding, ban reason). Keep the existing role numbers.
- [ ] Verify and resend verification. Forgotten-password handlers must actually send mail and change the password.
- [ ] `GET /api/me`, `PATCH /api/me/profile` (this is onboarding when `onboarding_completed_at` is null).
- [ ] Seed one admin.
- [ ] Tests: happy paths, bad password, unverified, banned, session revoke, private fields absent from public shapes.
- [ ] Add every shipped route from this slice to `endpoints.md`.

**Out of this slice:** articles, settings groups beyond profile, Google.

### Slice 2 — Settings + policies

- [ ] Settings group endpoints (password, email, preferences, notifications, delete).
- [ ] Change password ends the session; user logs in again.
- [ ] Delete account = soft delete + end session.
- [ ] Role checks. Admin user search / role / ban routes.
- [ ] Tests: user cannot change own role; moderator cannot list users; admin can.
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
- [ ] Tests: owner-only draft write; stranger cannot read others’ drafts; published GET hides nothing required and does show author; conflict on stale parent.
- [ ] Add every shipped route from this slice to `endpoints.md`.

**Out of this slice:** moderator queue (admin may publish to unblock tests).

### Slice 4 — Blind queue + rollback + block

- [ ] Moderator queue + blind revision resource.
- [ ] Approve / reject / rollback / block-author.
- [ ] Rollback rules (parent pointer, first-publish unpublish, 24h moderator window).
- [ ] Ban side effects (login + write).
- [ ] Admin-only audit of moderation actions.
- [ ] Tests: moderator JSON has no identity fields; approve fast-forward; stale approve = conflict; rollback restores parent; block-author response has no username; banned user cannot login.
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

## Versioning we will not use

Own `articles` + `revisions`. Do not add a package that writes a version on every save, a real Git repo, or a permission package. Three roles are enough. A small `moderation_events` table covers admin audit. v1 can diff two JSON snapshots in application code.

## Mapping to specs

| Spec | Backend slice |
| --- | --- |
| `specs/authentication/*` | 1–2 |
| `specs/authentication/profile.md` | 1–2 (public contributions after slice 3) |
| `specs/authentication/settings.md` | 2 |
| `specs/wiki/person/*`, `specs/wiki/section/*` | 3 |
| `specs/admin/users.md` | 2 (admin) |
| `specs/admin/moderation.md` | 4 (review queue now; reports later) |
