# Authentication

**Reviewed target; not shipped behavior.** Apply the [common contract](common.md).
Ordinary successes/failures use HTTP 200; critical errors use HTTP 500.
Registration/login must not replace an existing authenticated session.

## Registration

`POST /api/v1/auth/register` - anonymous.

| Request field | Rules |
| --- | --- |
| `email` | Required valid email under approved normalization/uniqueness rules |
| `username` | Required; approved syntax, length, casing, trimming, uniqueness |
| `password` | Required; trimmed, 8-30 Unicode code points, no complexity requirements |
| `confirmPassword` | Required; matches password after trimming |
| `termsAccepted` | Required boolean `true` |
| `termsVersion` | Required; matches the currently accepted published version |

Collect artist name and private first/last names during onboarding, not here.
Reject missing/stale terms versions with `VALIDATION_ERROR`.
Persist the accepted version and a server-generated `acceptedAt` timestamp.

```json
{
  "email": "Dancer@Example.com",
  "username": "DanceMember",
  "password": "<new-password>",
  "confirmPassword": "<new-password>",
  "termsAccepted": true,
  "termsVersion": "<current-published-version>"
}
```

Placeholders illustrate the shape, not real secrets or a published terms version.
Email delivery/display preserves `Dancer@Example.com`; its comparison key is
case-insensitive. Username display preserves `DanceMember`.

Success creates an unverified, not-onboarded account, durably schedules initial
verification mail in the same commit, and creates **no session**:

```json
{ "isSuccess": true, "code": null, "data": null }
```

Email/username conflicts use generic `IDENTITY_UNAVAILABLE`, not a field-specific
existence disclosure. This reduces detail but does not eliminate registration
enumeration. Invalid fields use `VALIDATION_ERROR`.
An active session must log out first; otherwise `FORBIDDEN`.

## Login

`POST /api/v1/auth/login` - anonymous.

| Request field | Rules |
| --- | --- |
| `identifier` | Required email or username; approved whitespace/case comparison |
| `password` | Required; approved surrounding-whitespace trimming before matching |

```json
{ "identifier": "DanceMember", "password": "<password>" }
```

Success rotates the session identifier, sets the approved cookie, and returns
`data: { user, csrfToken }`. A verified user who is not onboarded receives only
the minimal user projection:

```json
{
  "isSuccess": true,
  "code": null,
  "data": {
    "user": {
      "id": "73f4abf8-fd1c-4d51-8d1a-1281bab2f3de",
      "isOnboarded": false
    },
    "csrfToken": "<session-bound-csrf-token>"
  }
}
```

After onboarding, `user` is the [full self-user projection](users.md#user-representations).
The CSRF token is not a session identifier or login credential. Never return
a Bearer token.

| Failure | Code and effect |
| --- | --- |
| Unknown identifier, wrong password, deleted/banned account | `INVALID_CREDENTIALS`; no session |
| Correct credentials but unverified email | `EMAIL_NOT_VERIFIED`; no session |
| Already authenticated | `FORBIDDEN`; do not replace session |
| Invalid/unknown request fields | `VALIDATION_ERROR`; no session |

Do not distinguish an unknown identifier from an incorrect password.
An unverified account must verify before login. A verified pre-onboarding
session can only read minimal session status, complete onboarding, or log out.
Clients choose the appropriate screen; the server enforces access.

## Current session

`GET /api/v1/auth/session` - active session; no request fields/body.

Success returns `data: { user, csrfToken }` using the same onboarding-dependent
projection as login. The CSRF token remains stable within the session.
Use `Cache-Control: no-store`. Missing/expired/revoked sessions, including
deleted/banned account sessions, fail with `UNAUTHENTICATED`.

## Logout

`POST /api/v1/auth/logout` - active session or anonymous; no request fields.

Revoke only the current session and clear its cookie; other devices remain
logged in. Return success with `data: null`, including when already logged out
or the session expired. Origin checks apply; an active authenticated session
additionally requires the CSRF header.

## Email verification

`POST /api/v1/auth/email-verification` - possession of verification token.

Request: `{ "token": "<verification-token>" }`.
Token is bound to the account, email, and verification purpose, single-use,
and expires **24 hours after issuance**.

Success atomically marks email verified and consumes the token. Return
`data: null`; **do not create a session or complete onboarding**. The user
logs in afterward. The API does not redirect.

Invalid, expired, used, or unavailable-account tokens all return
`VERIFICATION_TOKEN_INVALID` without changing account state.

```json
{
  "isSuccess": false,
  "code": "VERIFICATION_TOKEN_INVALID",
  "data": null
}
```

## Resend verification

`POST /api/v1/auth/email-verification/resend` - anonymous.

Request: `{ "email": "Dancer@Example.com" }`.
Require valid syntax and the approved email lookup normalization.

For a valid email, return the same success with `data: null` for eligible,
unknown, already-verified, banned, and deleted accounts. Send only to active
unverified accounts. Invalid syntax uses `VALIDATION_ERROR`.

Issuing a new token invalidates previous verification tokens for that account.
Destination-specific mail suppression issues no token, so it does not
invalidate existing tokens. Apply the [common limits](common.md#rate-and-size-limits)
without exposing eligibility through response/header differences.

## Request password reset

`POST /api/v1/auth/password-reset-requests` - anonymous.

Request: `{ "email": "Dancer@Example.com" }`.
Require valid email syntax and the approved normalization.
Return the same success with `data: null` for eligible/ineligible accounts;
send only to active accounts, **including unverified ones**.
Invalid syntax uses `VALIDATION_ERROR`. Limits must not disclose eligibility.

Reset tokens are account/purpose-bound and single-use, expiring **30 minutes
after issuance**. Issuing a token invalidates older reset tokens, not verification
tokens. A suppressed send issues no new token.

Requesting a reset does not change the password, verify email, create a session,
or revoke existing sessions.

## Complete password reset

`POST /api/v1/auth/password-resets` - reset token; no session or old password.

| Request field | Rules |
| --- | --- |
| `token` | Required, valid, unexpired, single-use reset token |
| `password` | Required new password under approved trimming/length-only policy |
| `confirmPassword` | Required; matches after trimming |

On success, atomically change the password, consume the token, invalidate
other reset tokens, and revoke **all account sessions**. Return `data: null`.
Do not create a session or verify email. The user logs in again under the
approved verification policy.

Invalid/expired/used/unavailable-account token: `RESET_TOKEN_INVALID`.
Invalid password/confirmation: `VALIDATION_ERROR`; leave an otherwise valid
token usable, without account changes.

```json
{ "isSuccess": false, "code": "RESET_TOKEN_INVALID", "data": null }
```

Only [authenticated password change](users.md#change-password), not forgotten-
password recovery, requires the current password.

## Mail and lifecycle guarantees

- For eligible requests, success means **durably scheduled**, not delivered.
  Registration account creation and initial scheduling commit together.
- Delivery retries reuse the issued token; they do not issue a replacement
  or extend its original expiry.
- Critical inability to accept/schedule work safely uses HTTP 500 with
  `INTERNAL_ERROR`. Handle endpoint-wide failure consistently so account
  eligibility is not disclosed through success/error differences.
- Use configured HTTPS frontend links with tokens in URL fragments, for example
  `https://app.example.com/verify#token=<verification-token>`, never in a
  path/query string. Remove tokens from browser history and submit them in JSON.
  Never leak them through logs or referrers.
- Verification does not imply onboarding. Recovery does not verify email.
- Apply [session policies](common.md#session-and-request-protection),
  [credential secrecy](common.md#credential-secrecy), and
  [rate/size limits](common.md#rate-and-size-limits) to these flows.
