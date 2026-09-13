# API endpoints

Live contract for the dashboard. **Only routes that exist in Laravel.** Planned routes stay in [`backend.md`](backend.md).

If a path is not in the index below, the frontend must not call it.

## Shared

| | |
| --- | --- |
| Base | `/api` |
| Envelope | `{ "isSuccess": boolean, "code": number \| null, "data": ... }` |
| Auth header | `Authorization: Bearer {token}` |
| Truth | `php artisan route:list --path=api` |

## Index

No routes shipped yet.

When a route ships, add a row here and a detail block in the matching section.

| Method | Path | Auth | Role | Slice |
| --- | --- | --- | --- | --- |
| — | — | — | — | — |

## Detail template

Copy this when adding a route. Replace every placeholder.

### `METHOD /api/example`

| | |
| --- | --- |
| Auth | no / bearer |
| Role | any / `user` / `moderator` / `admin` |
| Slice | 1–4 |

**Request**

```json
{}
```

**`data` (success)**

```json
{}
```

**Errors**

| `code` | When |
| --- | --- |
| — | — |

## Auth

_None shipped._

## Me / settings

_None shipped._

## Users

_None shipped._

## Articles

_None shipped._

## Moderation

_None shipped._

## Admin

_None shipped._
