# API endpoints

Live contract for the dashboard. **Only routes that exist in `be/`.** Planned routes stay in [`domain.md`](domain.md).

If a path is not in the index below, the frontend must not call it.

## Shared

| | |
| --- | --- |
| Base | `/api` |
| Envelope | `{ "ok": boolean, "code": number \| null, "data": ... }` |
| Auth | Redis session cookie. Send `credentials: "include"`. No Bearer token. |
| Truth | Routers in `be/src/api/**/**.route.ts` |

### Error codes

| `code` | Meaning |
| --- | --- |
| 100 | Wrong password |
| 101 | Email already used |
| 102 | User not found |
| 103 | No session |
| 104 | Role not allowed |
| 105 | Validation error |
| 106 | Account not verified |
| 500 | Server error |

## Index

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/auth/register` | no |
| POST | `/api/auth/login` | no |
| POST | `/api/auth/logout` | session |
| POST | `/api/auth/forgotten_password` | no |
| POST | `/api/auth/change_forgotten_password/:code` | no |
| POST | `/api/auth/resend/forgotten_password/:email/:language` | no |
| GET | `/api/user` | session |
| GET | `/api/user/:id` | session |
| PUT | `/api/user/:id` | session |
| PUT | `/api/user/password/:id` | session |
| DELETE | `/api/user/:id` | session |

## Auth

### `POST /api/auth/register`

| | |
| --- | --- |
| Auth | no |

**Request**

```json
{ "email": "user@example.com", "password": "secret" }
```

**`data` (success, 201)**

`null`

**Errors**

| `code` | When |
| --- | --- |
| 101 | Email already used |

### `POST /api/auth/login`

| | |
| --- | --- |
| Auth | no |

**Request**

```json
{ "email": "user@example.com", "password": "secret" }
```

**`data` (success, 200)**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": null,
  "surname": null,
  "role": 500,
  "verifiedAt": null
}
```

Sets the session cookie. Does not return a token.

**Errors**

| `code` | When |
| --- | --- |
| 102 | Unknown email |
| 100 | Wrong password |
| 106 | Account not verified (check exists; login currently treats the account as verified) |

### `POST /api/auth/logout`

| | |
| --- | --- |
| Auth | session |

**`data` (success)**

`null`

Destroys the session.

### `POST /api/auth/forgotten_password`

| | |
| --- | --- |
| Auth | no |

**Request**

```json
{ "email": "user@example.com" }
```

**`data` (success)**

`null`

Does not send mail yet.

**Errors**

| `code` | When |
| --- | --- |
| 102 | Unknown email |

### `POST /api/auth/change_forgotten_password/:code`

| | |
| --- | --- |
| Auth | no |

**`data` (success)**

`null`

Does not change the password yet.

### `POST /api/auth/resend/forgotten_password/:email/:language`

| | |
| --- | --- |
| Auth | no |

**`data` (success)**

`null`

Does not send mail yet.

## Users

User `data` shape:

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": null,
  "surname": null,
  "role": 500,
  "verifiedAt": null
}
```

`role`: `100` admin, `250` moderator, `500` user.

### `GET /api/user`

| | |
| --- | --- |
| Auth | session |

**`data` (success)**

Array of users, excluding the session user. Soft-deleted users are omitted.

### `GET /api/user/:id`

| | |
| --- | --- |
| Auth | session |

**`data` (success)**

One user.

**Errors**

| `code` | When |
| --- | --- |
| 102 | Unknown id |

### `PUT /api/user/:id`

| | |
| --- | --- |
| Auth | session |

**Request**

```json
{ "name": "Ada", "surname": "Lovelace", "email": "ada@example.com" }
```

**`data` (success, 201)**

Updated user. `role` is stored as user (`500`).

### `PUT /api/user/password/:id`

| | |
| --- | --- |
| Auth | session |

**Request**

```json
{ "currentPassword": "old", "newPassword": "new" }
```

The validator only requires `password`. The handler reads `currentPassword` and `newPassword`.

**`data` (success)**

`null`

**Errors**

| `code` | When |
| --- | --- |
| 102 | Unknown id |
| 100 | Current password does not match |

### `DELETE /api/user/:id`

| | |
| --- | --- |
| Auth | session |

Sets `deletedAt`. **`data` (success)** is the remaining user list, excluding the session user.
