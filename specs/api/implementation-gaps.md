# Implementation gaps and reviewed decisions

The [API index](README.md) is a **reviewed target**, not shipped behavior.
This comparison is based on inspected source, not a live integration test.
The backend and dashboard remain unchanged. MSW success is not backend delivery.

## Current implementation

Paths in this section describe the **existing `/api` implementation**, not
target `/api/v1` routes.

| Area | Evidence | Current state versus reviewed target |
| --- | --- | --- |
| Runtime | `backend/package.json`, `backend/src/app.ts` | Express/Prisma; earlier Laravel/Sanctum description was stale |
| Prefix | `backend/src/app.ts` | Mounts `/api`, not `/api/v1` |
| Sessions | `backend/src/middleware/sessionMiddleware.ts`, `protectedRoutes.ts` | Redis cookies exist; reviewed cookie/CSRF/rotation/expiry/revocation rules require implementation |
| Envelope/status | `backend/src/middleware/formatResponse.ts`, `backend/src/helper/constants.ts` | Wire `{ok, code, data}` and numeric codes; target uses `isSuccess`, string codes, HTTP 200/critical-500 policy |
| Validation | `backend/src/middleware/validationMiddleware.ts` | Message discarded by envelope; reviewed field-error structure absent |
| Registration | `backend/src/api/auth/auth.controller.ts`, `auth.helper.ts` | Email/password persistence; no target username, confirmation/length policy, termsVersion/evidence, atomic verification scheduling |
| Login | `backend/src/api/auth/auth.controller.ts` | Email/password session exists; no username login; verification bypassed; no reviewed response projections/CSRF |
| Session read | `backend/src/api/auth/auth.route.ts` | Target session endpoint absent |
| Logout | `backend/src/api/auth/auth.controller.ts` | Session destruction exists; reviewed cookie clearing/idempotency not established |
| Verification/resend | `backend/src/api/auth/auth.route.ts` | Target operations absent |
| Recovery request | `backend/src/api/auth/auth.controller.ts`, `auth.service.ts` | Account lookup reveals not-found; email service placeholder |
| Recovery completion/resend | `backend/src/api/auth/auth.controller.ts` | Success-only placeholders; no token consumption/password change |
| Self-user read/update | `backend/src/api/user/user.route.ts`, `user.mapper.ts` | ID-based `/user/:id`, not session-derived `/users/me`; reviewed projections/writable fields absent |
| Onboarding | `backend/prisma/schema/user.prisma` | No explicit completion state or reviewed one-time completion guard |
| Password change | `backend/src/api/user/user.controller.ts`, `user.route.ts` | Current-password check/update exists; validation and all-session/token revocation differ |
| Deletion | `backend/src/api/user/user.controller.ts` | ID-based soft delete; confirmation, revocation, retention/anonymization, response differ |
| Public profile | `backend/src/api/user/user.route.ts`, `user.mapper.ts` | Reads require session and include private fields; no anonymous public-only view |
| User schema | `backend/prisma/schema/user.prisma` | UUID IDs, email/name/surname/numeric role/verifiedAt; username, artistName, bio/avatar/onboarding and comparison keys absent |
| Client transport | `dashboard/src/helper/normalizeBaseQuery.ts`, `request.ts` | Includes cookies, normalizes `ok` to internal `isSuccess`; PATCH, CSRF, string errors, reviewed status interpretation require migration |
| Client identity | `dashboard/src/services/auth/auth.ts` | Name reused as artistName/firstName, email as username; onboarding inferred from name |
| Mocks | `dashboard/src/main.tsx`, `dashboard/src/mocks/auth.handler.ts` | MSW starts unconditionally, simulates old routes/bio storage, not reviewed lifecycle or HTML contract |

## Existing routes versus target

Current paths below are relative to `/api`; target paths are relative to
**`/api/v1`**. Matching suffixes do not mean the target is shipped.

| Current method/path | Target method/path | Delivery assessment |
| --- | --- | --- |
| `POST /auth/register` | `POST /auth/register` | Partial; version prefix/contract differ |
| `POST /auth/login` | `POST /auth/login` | Partial; identifier/session contract differs |
| `POST /auth/logout` | `POST /auth/logout` | Partial; reviewed session/cookie rules missing |
| `POST /auth/forgotten_password` | `POST /auth/password-reset-requests` | Partial lookup; no mail delivery |
| `POST /auth/change_forgotten_password/:code` | `POST /auth/password-resets` | Placeholder |
| `POST /auth/resend/forgotten_password/:email/:language` | Repeat `POST /auth/password-reset-requests` | Placeholder; target removes email/token from paths |
| `GET /user/:id` | `GET /users/me` or `GET /users/{id}` | Partial; must separate identity/access/projections |
| `PUT /user/:id` | `PATCH /users/me` | Partial; different identity/fields |
| `PUT /user/password/:id` | `PUT /users/me/password` | Partial |
| `DELETE /user/:id` | `DELETE /users/me` | Partial |
| `GET /user` | Future admin listing | Deferred; no self-service equivalent |

Verification/resend, session read, and explicit onboarding routes are absent.
General pages, translations, and upload routes from the superseded API document
are not mounted by `backend/src/app.ts`; content mocks do not make them shipped.

## Reviewed decisions and follow-ups

The point-by-point review is complete. These decisions replace the original
draft proposals; they are not an open approval register.

| Area | Reviewed decision |
| --- | --- |
| Contract | `/api/v1`, camelCase, UUID IDs, UTC ISO 8601/null timestamps |
| Outcome | `{isSuccess, code, data}`; string errors, validation field-message arrays; HTTP 200 except critical HTTP 500 |
| Identity | Separate username/artistName/private names; case-insensitive uniqueness; preserve username/email casing |
| Normalization | ASCII lowercase username key; Unicode case-folded email/artistName keys, no NFC/NFKC; no email alias collapsing |
| Lengths | Username 3-30; artistName 1-100; private names each 1-150 code points |
| Passwords | Trim surrounding Unicode whitespace in every flow; 8-30 new-password code points; no complexity; matching confirmation |
| Bio | Sanitized HTML allowlist; max 300 decoded text code points; empty string clears |
| Sessions | Cookie-only, host-only `__Host-wiki_session`, Secure/HttpOnly/Lax; origin and CSRF checks; 24h idle/30d absolute |
| Verification | Reject unverified login; verify without auto-login; 24h single-use verification token |
| Onboarding | Minimal pre-onboarding session view; only onboarding/logout/session read; reject second completion |
| Recovery/change | Token-based recovery, 30min token; current password only for change; revoke all sessions after either |
| Registration | Required email/username/password/confirmation/termsAccepted/termsVersion; consent timestamp; generic identity-conflict code |
| Mail | Durable scheduling; atomic registration plus initial mail scheduling; retries reuse token; no eligibility disclosure |
| Limits | Reviewed request/mail budgets and raw JSON/bio caps in common contract |
| Profiles | Anonymous UUID lookup, public-only fields for active/verified/onboarded accounts; no-store |
| Deletion | Username/password confirmation; soft delete; immediate credential/session/token removal; 30-day private-profile anonymization |
| Attribution/reuse | Public Deleted user label; non-public internal attribution; release comparison keys on anonymization, new UUID on reuse |
| Migration | Coordinated future client/backend cutover, force re-login, retire old routes; no automatic legacy aliases |

### Explicit boundaries

- Terms-evidence retention needs a separately documented lawful policy.
  The approved 30-day private-profile policy is not permission for indefinite
  retention or a legal compliance certification.
- Detailed content/history attribution implementation is follow-up; do not
  claim this documentation changes or deletes wiki content.
- Avatar upload/removal, admin/moderation, OAuth, email changes, and other
  [deferred domains](README.md#deferred-domains-and-boundaries) need their own specs.
- Non-API specs may still contain older rules (password complexity, plain-text
  bio, auto-login after verification). They are unchanged in this API-only pass;
  apply the reviewed API contract rather than silently treating old rules as
  approvals to change this contract.

## Follow-up implementation work

Implement schema/normalization keys and identity separation, session-derived
authorization, public/private projections, one-time onboarding, verification,
recovery, durable email scheduling, consent evidence, HTML sanitization,
session/CSRF/cookie protection, rate/size limits, and error formatting.

The existing bcrypt implementation has a 72-byte input boundary; 30 Unicode
code points can exceed it. Ensure full accepted-input hashing without silent
truncation. Existing passwords also need explicit compatibility work because
the target trims surrounding whitespace. Do not silently rewrite credentials.

After backend/client/mock changes are ready, perform the reviewed coordinated
cutover to `/api/v1`, the new envelope/fields/string errors/status interpretation,
and session rules. Force re-login; retire old routes without automatic aliases.
Application tests and migration execution belong to that later work, not this
documentation change.

## Documentation integrity

- Every indexed target endpoint has method/path, access, input, result/error,
  and side-effect rules.
- Ordinary failures use HTTP 200 and `isSuccess: false`; critical failures use
  HTTP 500 and `INTERNAL_ERROR`.
- Minimal pre-onboarding and full self/public projections stay distinct.
- No credential secrets in responses/logs; rich-text bio uses server sanitization.
- Current implementation, mocks, reviewed target, and deferred work are labeled.
- Changes remain confined to `specs/api.md` and `specs/api/`.
