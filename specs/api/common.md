# Common API contract

**Reviewed target contract. Not a description of shipped behavior.**
See [implementation gaps](implementation-gaps.md) for the unchanged backend
and [authentication](authentication.md) / [users](users.md) for domain rules.

## Transport and representation

- Prefix: `/api/v1`. Production uses HTTPS; origins and development ports are
  deployment configuration.
- Requests and responses use JSON with `Content-Type: application/json`.
  Field names are camelCase. User IDs are opaque UUID strings, not credentials.
- Timestamps are UTC ISO 8601 strings, for example `2026-11-15T13:00:00Z`.
  Unset timestamps use `null`, never `""`.
- Reject unknown or non-writable fields with `VALIDATION_ERROR`; apply no changes.
  An omitted update field keeps its value. Explicit `null` is accepted only
  when the endpoint declares the writable field nullable.
- Account updates are atomic. Validation/conflict failures apply no partial
  changes; uniqueness must also hold under concurrent requests.

## Response envelope and HTTP status

API-controlled JSON responses use **HTTP 200 for success and ordinary failure**.
Clients must inspect `isSuccess`; HTTP 200 alone does not mean success.
**HTTP 500 is reserved for critical server failures**: unexpected internal
exceptions or essential-dependency failures preventing safe processing.

```json
{ "isSuccess": true, "code": null, "data": null }
```

```json
{
  "isSuccess": false,
  "code": "VALIDATION_ERROR",
  "data": null,
  "errors": { "confirmPassword": ["Passwords do not match."] }
}
```

| Field | Contract |
| --- | --- |
| `isSuccess` | Boolean application outcome, independent of HTTP 200 |
| `code` | `null` on success; stable string identifier on failure |
| `data` | Endpoint-defined object or `null` on success; always `null` on failure |
| `errors` | Only on validation failure: field names mapped to message arrays |

Operations with nothing to return still send the success envelope with
`data: null`; never an empty body. Error codes are stable identifiers, not
display copy. Validation messages describe field errors; clients can localize
their UI using the code and field names.

Malformed JSON has no field errors:

```json
{ "isSuccess": false, "code": "INVALID_REQUEST", "data": null }
```

Critical failures use HTTP 500 and the same envelope:

```json
{ "isSuccess": false, "code": "INTERNAL_ERROR", "data": null }
```

Never expose stack traces, database details, or raw dependency errors.
Infrastructure-generated responses outside the API are not guaranteed to use
this status/envelope policy.

### Error codes

| HTTP | Code | Meaning |
| --- | --- | --- |
| 200 | `INVALID_REQUEST` | Malformed/oversized JSON, or unsupported method on an existing API path |
| 200 | `VALIDATION_ERROR` | Invalid, unknown, non-writable, or mismatched fields |
| 200 | `UNAUTHENTICATED` | Missing/expired/revoked session, including deleted/banned account sessions |
| 200 | `INVALID_CREDENTIALS` | Wrong login credentials or unknown/deleted/banned account |
| 200 | `EMAIL_NOT_VERIFIED` | Valid login credentials, but email is unverified; no session created |
| 200 | `ONBOARDING_REQUIRED` | Session exists, but an account operation requires completed onboarding |
| 200 | `FORBIDDEN` | Other access denial, including rejected mutation origin |
| 200 | `CSRF_INVALID` | Missing/invalid session-bound CSRF header |
| 200 | `NOT_FOUND` | Unknown API route or unavailable public profile |
| 200 | `IDENTITY_UNAVAILABLE` | Registration email or username conflicts; do not identify which |
| 200 | `USERNAME_UNAVAILABLE` | Profile-update username conflicts |
| 200 | `ARTIST_NAME_UNAVAILABLE` | Artist-name conflict |
| 200 | `ONBOARDING_ALREADY_COMPLETED` | A second onboarding-completion attempt |
| 200 | `VERIFICATION_TOKEN_INVALID` | Invalid/expired/used token or unavailable account |
| 200 | `RESET_TOKEN_INVALID` | Invalid/expired/used token or unavailable account |
| 200 | `RATE_LIMITED` | Request budget exceeded; includes `Retry-After` seconds |
| 500 | `INTERNAL_ERROR` | Critical server failure |

These are shared failures in addition to each endpoint's domain failures:
all operations can encounter request throttling or a critical error; JSON
operations can encounter malformed/oversized bodies or field errors.
Session-bound operations can fail authentication; protected mutations can fail
origin or CSRF checks. Ordinary errors never use HTTP 4xx or 503 in this contract.

## Session and request protection

- Cookie-only authentication: no Bearer access token in the response or request.
  A client-held user ID is never a session credential.
- Production cookie: `__Host-wiki_session`, `Path=/`, no `Domain` attribute,
  `Secure`, `HttpOnly`, `SameSite=Lax`. It is host-only. App/API deployment
  must support this same-site policy; cross-site deployment needs a separate
  policy review. Development settings may explicitly differ.
- Credentialed CORS permits only configured app/site origins, not a wildcard.
  Configure development origins separately. Browser clients send credentials.
- Validate the origin of state-changing requests, including login/registration.
  Missing `Origin` requires equivalent trusted-source validation or rejection.
  CORS alone is not protection against cross-site request forgery.
- Cookie-authenticated mutations additionally require `X-CSRF-Token`.
  Login/session responses return the matching `csrfToken`; it is not an
  authentication credential. Failure uses `CSRF_INVALID`.
- The CSRF token stays stable within a session, rotates with a new session,
  and expires/revokes with it. Session reads do not rotate it.
- Successful login rotates the session identifier. An existing authenticated
  session must log out before registration/login; otherwise return `FORBIDDEN`.
- Expire sessions after **24 hours without a successful authenticated request**
  and at **30 days from login regardless of activity**. Rejected/anonymous
  requests do not extend idle expiry. Cookie/server expiry cannot exceed the
  absolute cap.
- Logout revokes only the current session. Password reset/change and deletion
  revoke all account sessions. Deleted/banned accounts cannot authenticate.
  Apply account-state checks rather than trusting stale session data.
- All auth/private-account responses use `Cache-Control: no-store`.
  Public-profile responses also use `no-store` initially.

### Credential secrecy

Passwords/hashes, verification/reset tokens, and session identifiers never appear
in JSON responses or logs. Verification/reset tokens are delivered through
their email flows; the session identifier stays in its cookie. The approved
`csrfToken` response field is allowed. Placeholder request examples are not
real credentials.

## Identity validation

Trim surrounding Unicode `White_Space` before identity validation and comparison.
Preserve the chosen display casing. Do not apply NFC/NFKC normalization.

| Field | Rules |
| --- | --- |
| `username` | 3-30 ASCII letters/numbers/underscore/hyphen; first character alphanumeric; no spaces or `@` |
| `email` | Valid email syntax; preserve entered casing for storage, display, and delivery |
| `artistName` | 1-100 Unicode code points after trimming; Unicode letters/numbers/spaces/punctuation, no controls or line breaks |
| `firstName`, `lastName` | Each 1-150 Unicode code points after trimming; single-line Unicode plain text, no controls/line breaks; private |

Username login/uniqueness uses an ASCII-lowercase comparison key.
Email and artist-name comparison keys use Unicode full case folding without
Unicode normalization. Backend/database comparisons must use the same key
algorithm. Artist names are unique case-insensitively, separately from usernames.
Display spelling remains unchanged by comparison-key generation.

Do not remove email dots or plus tags: distinct aliases can register separately.
Canonical Unicode equivalence is not guaranteed for artist names; visually
identical encodings can remain distinct because NFC normalization was declined.

## Password validation

- Trim leading/trailing Unicode `White_Space`, including tabs/newlines, before
  validation, confirmation comparison, hashing, and password matching in every
  flow, including login and current-password reauthentication.
- Preserve internal whitespace, casing, and Unicode composition.
- New passwords must contain **8-30 Unicode code points after trimming**.
  No uppercase/lowercase/number/special-character requirements.
- Do not retroactively apply new-password length validation at login; match
  existing credentials using the approved surrounding-whitespace policy.
- Registration/reset require `confirmPassword` matching `password`; authenticated
  change requires `confirmNewPassword` matching `newPassword`. Compare the
  trimmed values and never store the confirmation.
- Do not silently truncate accepted input. Thirty Unicode code points can
  exceed bcrypt's 72-byte boundary; full-input hashing and existing-password
  compatibility are [implementation work](implementation-gaps.md#follow-up-implementation-work).

## Rich-text bio

`bio` is an editor-independent **sanitized HTML string**, not plain text or
editor-specific JSON.

- Allowed tags: `p`, `br`, `strong`, `b`, `em`, `i`, `u`, `s`, `ol`, `ul`,
  `li`, `a`. Only `a[href]` is an allowed attribute; its URL must be absolute
  HTTP/HTTPS.
- The server removes unsupported/unsafe markup and attributes before storage.
  Do not rely on client-only sanitization. Return canonical sanitized HTML in
  successful user-update responses.
- No headings, images, video, embeds, tables, custom styles, event handlers,
  or executable content. No other link schemes or attributes, including `target`.
- Maximum **300 Unicode code points of decoded text after sanitization**,
  excluding HTML tags. Raw HTML has the separate byte cap below.
- Optional; empty bio is `""`, never `null`. `bio: ""` clears it.
  Sanitized empty markup such as `<p><br></p>` and whitespace-only content
  become `""`. Omission on update preserves the existing bio.

## Access states

| Account state | Authenticated operations allowed in this scope |
| --- | --- |
| Unverified | Login is rejected; no session created |
| Verified, not onboarded | Minimal session-status read, onboarding, logout only |
| Verified, onboarded | Session read/logout and all self-service operations |
| Deleted/banned | No session access; public profile unavailable |

Anonymous operations are registration/login, verification/resend, password
recovery, and eligible public-profile read. No admin access is implied.
Pre-onboarding login/session `user` contains only `id` and `isOnboarded: false`;
after onboarding it uses the [self-user projection](users.md#user-representations).

## Rate and size limits

All request budgets below are rolling, count failed attempts, and use only
trusted deployment/proxy configuration to determine the client IP.

| Budget | Limit |
| --- | --- |
| All API requests | 120/IP/minute |
| Login attempts | 10/IP/10 minutes |
| Registrations | 5/IP/hour |
| Verification resend and reset requests, combined | 10/IP/hour |
| Mail per normalized destination and purpose | At most 1/minute and 5/hour |

Exceeding a request/IP budget returns `RATE_LIMITED`, HTTP 200, with
`Retry-After` in whole seconds until retry. Expose that header through
`Access-Control-Expose-Headers` for allowed browser origins.

Destination-specific mail suppression returns the same eligibility-neutral
success, without issuing a new token. Never reveal account eligibility or
destination cooldowns through response/header differences. Request/IP throttles
remain distinct from these silent mail-send limits.

| Input | Maximum | Failure |
| --- | --- | --- |
| Raw JSON body, measured in UTF-8 before parsing | 64 KiB | `INVALID_REQUEST` |
| Raw bio HTML, measured in UTF-8 before sanitization | 16 KiB | `VALIDATION_ERROR` on `bio` |

One KiB is 1,024 bytes. These raw-input limits do not replace the field-level
character/decoded-text limits.
