# API Contract

Backend: **Laravel** (`backend/`), API prefix `/api`, auth **Sanctum** (personal access token, header `Authorization: Bearer <token>`).

Dev: `php artisan serve --port=3000` (frontend `baseUrl` is `http://localhost:3000/api`).
Prod: `https://api.dancediction.com/api`.

## Envelope

Every JSON response uses the same envelope (frontend `TWikiResponseData`):

```json
{ "isSuccess": true, "code": null, "data": {} }
```

| Field | Type | Meaning |
| --- | --- | --- |
| `isSuccess` | boolean | Business success. `false` triggers the frontend error flow. |
| `code` | number \| null | App error code, `null` on success. |
| `data` | object \| array \| null | Payload. |

### Error codes

| Code | Meaning |
| --- | --- |
| 100 | Invalid credentials |
| 101 | Email not verified |
| 102 | Validation error |
| 103 | Not found |
| 104 | Unauthorized (missing/invalid token) |

HTTP status mirrors the outcome (200/400/401/404/422); the envelope is the source of truth for the frontend.

## Models

### User

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "d.doctor",
  "firstName": "Trust",
  "lastName": "Oriabure",
  "nickname": "D.Doctor",
  "avatar": "https://picsum.photos/400",
  "bio": "...",
  "role": "user",
  "emailVerifiedAt": "2026-01-01T00:00:00Z"
}
```

### Page

```json
{
  "id": 1,
  "title": "Breaking",
  "description": "...",
  "sections": [
    { "id": 1, "title": "History", "content": "...", "order": 1 }
  ],
  "updatedAt": "2026-01-01T00:00:00Z"
}
```

### Translation

```json
{ "key": "home.title", "value": "Home", "locale": "en" }
```

## Routes

All routes below return the envelope. `[auth]` = requires Bearer token.

### Auth

| Method | Route | Payload | data |
| --- | --- | --- | --- |
| POST | `/auth/register` | `{email, username, password, confirmPassword, terms}` | `{user}` — sends verification email |
| POST | `/auth/login` | `{identifier, password}` | `{token, user}` — `identifier` matches email or username. Unverified email → `code 101`, no token |
| GET | `/auth/me` [auth] | — | `{user}` |
| POST | `/auth/logout` [auth] | — | `null` |
| POST | `/auth/verify-email` | `{token}` | `null` |
| POST | `/auth/resend-verification` | `{email}` | `null` |
| POST | `/auth/forgot-password` | `{email}` | `null` |
| POST | `/auth/reset-password` | `{token, password, confirmPassword}` | `null` |

### Users

| Method | Route | Payload | data |
| --- | --- | --- | --- |
| PUT | `/users/me` [auth] | `{firstName?, lastName?, nickname?, bio?, avatar?}` | `{user}` — the server resolves the id from the token; the client never sends a user id |

### Content

| Method | Route | Payload | data |
| --- | --- | --- | --- |
| GET | `/pages` | — | `[page]` |
| GET | `/pages/{id}` | — | `{page}` |

### Translations

| Method | Route | Payload | data |
| --- | --- | --- | --- |
| GET | `/translations?locale={it\|en}` | — | `[translation]` |

### Upload

| Method | Route | Payload | data |
| --- | --- | --- | --- |
| POST | `/upload` [auth] | multipart, field `files` | `{url}` |

## Future (names only, not implemented yet)

- Persons: `GET /persons`, `GET /persons/{id}`, `POST /persons`, `PUT /persons/{id}`
- Section versioning & diff: `GET /sections/{id}/versions`, `GET /sections/{id}/diff?from={v1}&to={v2}`
- Search: `GET /search?q=`
- Moderation: reports queue, approve/reject, ban, role change (see `specs/admin/`)
