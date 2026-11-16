# Users

**Reviewed target; not shipped behavior.** Apply the [common contract](common.md).
This domain covers self-service and public profiles, not admin user management.
Ordinary successes/failures use HTTP 200; critical errors use HTTP 500.

## User representations

| Field | Full self-profile | Public profile | Rules |
| --- | --- | --- | --- |
| `id` | Yes | Yes | Server-owned opaque UUID |
| `username` | Yes | Yes | Unique login handle; preserve display casing |
| `artistName` | Yes | Yes | Separate unique public name, 1-100 code points |
| `bio` | Yes | Yes | Sanitized HTML; default `""`; max 300 decoded text code points |
| `avatarUrl` | Yes, nullable | Yes, nullable | Optional server-managed image URL |
| `email` | Yes | Never | Private; preserve casing; changes deferred |
| `firstName` | Yes | Never | Private, 1-150 code points |
| `lastName` | Yes | Never | Private, 1-150 code points |
| `isOnboarded` | Yes | Never | Server-owned completion state |
| `emailVerifiedAt` | Yes, nullable | Never | Server-owned verification timestamp |

Full self-profile/public responses are available only after onboarding and
contain non-null required names. Before onboarding, login/session `user`
contains only `id` and `isOnboarded: false`; `csrfToken` sits outside `user`.
Unverified login creates no session.

Exclude passwords/hashes, tokens, session identifiers, role, deletedAt/bannedAt,
and other internal fields from both projections. Username, artistName, and
private firstName are distinct; never map them to the same stored property.

## Read current user

`GET /api/v1/users/me` - verified, onboarded session; no request body.

Resolve the account exclusively from the session, not a client-supplied ID.
Return `data: { user }` using the full self-profile and `Cache-Control: no-store`.
Invalid session: `UNAUTHENTICATED`. Pre-onboarding session: `ONBOARDING_REQUIRED`.

Example success (also the full `user` shape for onboarded login/session responses):

```json
{
  "isSuccess": true,
  "code": null,
  "data": {
    "user": {
      "id": "73f4abf8-fd1c-4d51-8d1a-1281bab2f3de",
      "username": "DanceMember",
      "artistName": "House Dancer",
      "bio": "<p>Dancer and <strong>teacher</strong>.</p>",
      "avatarUrl": null,
      "email": "Dancer@Example.com",
      "firstName": "Example",
      "lastName": "Dancer",
      "isOnboarded": true,
      "emailVerifiedAt": "2026-11-15T13:00:00Z"
    }
  }
}
```

## Update current user

`PATCH /api/v1/users/me` - verified, onboarded session.

| Writable field | Rules |
| --- | --- |
| `username` | Optional valid unique username; renames allowed |
| `artistName` | Optional valid unique artist name; renames allowed |
| `firstName`, `lastName` | Optional valid private names |
| `bio` | Optional sanitized HTML; `""` clears it |

Require at least one writable field. Omission preserves current values;
none of these fields accepts `null`. Required names cannot be cleared.
Reject `id`, `email`, `role`, `isOnboarded`, `emailVerifiedAt`, `avatarUrl`,
and any other non-writable/unknown fields with `VALIDATION_ERROR`.
Avatar delivery/removal is deferred; do not accept arbitrary image URLs.

```json
{
  "artistName": "House Dancer",
  "bio": "<p>Dancer and <strong>teacher</strong>.</p>"
}
```

Success returns `data: { user }` including canonical sanitized bio.
Invalid fields: `VALIDATION_ERROR`. Conflicts: `USERNAME_UNAVAILABLE` or
`ARTIST_NAME_UNAVAILABLE`. Pre-onboarding: `ONBOARDING_REQUIRED`.
All updates/uniqueness checks are atomic; apply no changes on failure.

## Complete onboarding

`POST /api/v1/users/me/onboarding` - verified session, including pre-onboarding.

Require `artistName`, `firstName`, `lastName`; `bio` is optional and omission
preserves it. Apply common field rules. Avatar is not required.

```json
{
  "artistName": "House Dancer",
  "firstName": "Example",
  "lastName": "Dancer",
  "bio": "<p>Learning and sharing dance history.</p>"
}
```

First success atomically persists the fields, sets `isOnboarded: true`, and
returns the full `data: { user }`. The server does not redirect.

**Reject every attempt after completion** with `ONBOARDING_ALREADY_COMPLETED`;
do not update fields. Guard completion atomically so concurrent requests cannot
both succeed. Later profile edits use `PATCH /users/me`, not onboarding.

```json
{
  "isSuccess": false,
  "code": "ONBOARDING_ALREADY_COMPLETED",
  "data": null
}
```

Other invalid fields/conflicts use `VALIDATION_ERROR`,
`USERNAME_UNAVAILABLE`, or `ARTIST_NAME_UNAVAILABLE` as applicable.
Unknown/non-writable fields remain rejected, including a submitted user ID
or completion flag.

## Change password

`PUT /api/v1/users/me/password` - verified, onboarded session.

| Request field | Rules |
| --- | --- |
| `currentPassword` | Required; must match current password after approved trimming |
| `newPassword` | Required; 8-30 code points after trimming, no complexity requirements |
| `confirmNewPassword` | Required; matches newPassword after trimming |

Success changes the password, revokes all sessions and reset tokens, clears
the cookie, and returns `data: null`. The user must log in again.

Wrong current password or invalid new-password/confirmation fields use
`VALIDATION_ERROR`, with messages under the affected field; make no changes.
Pre-onboarding sessions use `ONBOARDING_REQUIRED`.

```json
{
  "isSuccess": false,
  "code": "VALIDATION_ERROR",
  "data": null,
  "errors": { "currentPassword": ["Current password is incorrect."] }
}
```

Forgotten-password [recovery](authentication.md#complete-password-reset) uses
an email token instead of the current password.

## Delete account

`DELETE /api/v1/users/me` - verified, onboarded session.

Require a JSON body containing `username` and `currentPassword`:

```json
{ "username": "DanceMember", "currentPassword": "<password>" }
```

Confirm the current handle under its approved case/whitespace rules and verify
the password with approved trimming. Invalid confirmation uses
`VALIDATION_ERROR`; a wrong password message belongs under `currentPassword`.

On success:

- Soft-delete the session's account and immediately remove public-profile access.
- Remove credentials; revoke all sessions and verification/reset tokens.
- Clear the current cookie; return success with `data: null`.
- Schedule private-profile anonymization after **30 days**.

Do not delete another account through a supplied ID. Pre-onboarding sessions
fail with `ONBOARDING_REQUIRED`. After deletion, sessionless retries return
`UNAUTHENTICATED`, not anonymous deletion success.

### Retention and identity reuse

Reserve deleted email, username, and artist-name comparison keys during those
30 days; release them on anonymization. Reuse creates a **new UUID** and never
inherits former account/content ownership.

Preserve wiki history with non-public internal attribution and the public
label **Deleted user**, not the former public identity. Detailed content-domain
implementation remains follow-up; this endpoint does not erase wiki history.
There is no restore endpoint in scope.

Terms-evidence retention needs a separately documented lawful policy. Soft
deletion is not immediate erasure, and these product rules are not a compliance
certification or permission for indefinite personal-data retention.

## Read public profile

`GET /api/v1/users/{id}` - anonymous UUID lookup; no request body.

Return `data: { user }` containing only approved public fields, even when the
owner is logged in. Use `Cache-Control: no-store` initially.

```json
{
  "isSuccess": true,
  "code": null,
  "data": {
    "user": {
      "id": "73f4abf8-fd1c-4d51-8d1a-1281bab2f3de",
      "username": "DanceMember",
      "artistName": "House Dancer",
      "bio": "<p>Dancer and <strong>teacher</strong>.</p>",
      "avatarUrl": null
    }
  }
}
```

Only active, verified, onboarded accounts have visible profiles. Missing,
malformed, unverified, not-onboarded, deleted, or banned IDs all return
`NOT_FOUND`, without revealing the reason.

```json
{ "isSuccess": false, "code": "NOT_FOUND", "data": null }
```

Public user-directory/search endpoints, contributions, profile links, and
pagination remain deferred. Private account data is never added to this
projection based on the caller's session.
