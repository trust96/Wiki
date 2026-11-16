# REST API

**Status: reviewed target contract for authentication and users.
Not a shipped-endpoint reference.**

The target incorporates the decisions from the point-by-point review.
It is implementation-independent; the existing Express/Prisma backend and
dashboard mocks have not been changed to implement it.

## Reading order

| Document | Responsibility |
| --- | --- |
| [Common contract](common.md) | Envelope, errors, sessions, access, validation, limits |
| [Authentication](authentication.md) | Registration, verification, sessions, password recovery |
| [Users](users.md) | Identity, onboarding, self-service, public profiles, deletion |
| [Implementation gaps](implementation-gaps.md) | Reviewed decisions, current backend/mocks, future cutover |

## Contract summary

- Prefix **`/api/v1`**; JSON camelCase, UUID user IDs, UTC ISO 8601 timestamps.
- Envelope **`{ isSuccess, code, data }`** with string error codes and
  field-to-message-array `errors` on validation failure.
- HTTP **200** for application success and ordinary failure; inspect
  `isSuccess`. Critical server failures use HTTP **500** with `INTERNAL_ERROR`.
- Cookie sessions, origin checks, session-bound CSRF header; no Bearer tokens.
- Email-or-username login; unique username and artist name are separate fields.
- Unverified login fails without a session. Before onboarding, allow only
  minimal session read, onboarding, and logout as authenticated operations.
- Passwords: trim surrounding whitespace, 8-30 code points, no complexity
  requirements. Bio: sanitized rich-text HTML, max 300 decoded text code points.
- This pass changes only API documentation, not application code or other specs.

## Target endpoint index

These methods/paths are reviewed targets, **not delivery claims**.
All authenticated mutations require the common origin/CSRF protection.

| Method | Path under `/api/v1` | Access | Domain |
| --- | --- | --- | --- |
| POST | `/auth/register` | Anonymous | [Authentication](authentication.md#registration) |
| POST | `/auth/login` | Anonymous; verified email for success | [Authentication](authentication.md#login) |
| GET | `/auth/session` | Session; minimal before onboarding | [Authentication](authentication.md#current-session) |
| POST | `/auth/logout` | Session or anonymous | [Authentication](authentication.md#logout) |
| POST | `/auth/email-verification` | Verification token | [Authentication](authentication.md#email-verification) |
| POST | `/auth/email-verification/resend` | Anonymous | [Authentication](authentication.md#resend-verification) |
| POST | `/auth/password-reset-requests` | Anonymous | [Authentication](authentication.md#request-password-reset) |
| POST | `/auth/password-resets` | Reset token | [Authentication](authentication.md#complete-password-reset) |
| GET | `/users/me` | Verified, onboarded session | [Users](users.md#read-current-user) |
| PATCH | `/users/me` | Verified, onboarded session | [Users](users.md#update-current-user) |
| POST | `/users/me/onboarding` | Verified session; reject repeat completion | [Users](users.md#complete-onboarding) |
| PUT | `/users/me/password` | Verified, onboarded session | [Users](users.md#change-password) |
| DELETE | `/users/me` | Verified, onboarded session | [Users](users.md#delete-account) |
| GET | `/users/{id}` | Anonymous | [Users](users.md#read-public-profile) |

## Deferred domains and boundaries

These are follow-up requirements, not approved endpoint paths:

- Admin user listing/search, role changes, bans, moderation.
- Wiki pages/persons, search/filters, contributions, publication, section versions/diff.
- Contribution outcomes and notifications.
- Uploads, including avatar delivery/removal; `avatarUrl` is read-only here.
- Translations, supported locales, Google OAuth, email changes, profile links,
  theme preferences, account restoration.

The earlier API document mentioned pages, translations, uploads, persons,
section versions/diff, search, and moderation. Those ideas are preserved as
deferred rather than claimed implemented.

Implementing history attribution/anonymization belongs to later application
work. Terms-evidence retention requires a separately documented lawful policy.
See [reviewed decisions and follow-ups](implementation-gaps.md#reviewed-decisions-and-follow-ups).
Non-API product/design specs remain unchanged; this contract does not silently
rewrite them.
