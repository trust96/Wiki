# wiki

## Backend authentication

The Express/Prisma backend exposes authentication at `/api/v1/auth`:
`POST /register`, `POST /login`, `GET /session`, `POST /logout`,
`POST /email-verification`, `POST /email-verification/resend`,
`POST /password-reset-requests`, and `POST /password-resets`.
Ordinary outcomes use HTTP 200 with `{ isSuccess, code, data }`; critical
failures use HTTP 500. Field validation uses Yup.

Copy `backend/.env.example` to `backend/.env` and supply the actual published
`TERMS_VERSION`, app/site origins, sender, SMTP settings, HTTPS frontend
verification/reset URLs, and a random 32-byte hex `MAIL_ENCRYPTION_KEY`.
Generate the encryption key with `openssl rand -hex 32`; keep it and its ID
stable until queued mail has drained. Do not commit credentials.

Run `yarn workspace wiki_server db:deploy`, then
`yarn workspace wiki_server dev`. PostgreSQL and Redis must be available.
The server runs the durable SMTP outbox worker alongside the API. Delivery
retries reuse the original token and expiry; SMTP acceptance is not a guarantee
of inbox delivery. A crash after SMTP acceptance can cause duplicate mail
with the same token. Delivered/cancelled jobs discard encrypted token payloads.
Resend/reset requests enqueue encrypted work before resolving eligibility;
the worker then applies account checks and destination-specific suppression.
Production startup requires complete mail/terms configuration, HTTPS origins,
and an explicit session secret of at least 32 characters. SMTP requires TLS
in production. In development, missing mail configuration disables registration
and mail requests with `INTERNAL_ERROR`; it never simulates delivery.

Browser requests must use credentials. Mutations require an exact configured
`Origin`; authenticated mutations additionally require `X-CSRF-Token` from
login/session responses. Production uses the host-only Secure/HttpOnly/Lax
`__Host-wiki_session` cookie; development uses `wiki_session` over local HTTP.
Configure `TRUSTED_PROXIES` only with actual proxy IPs/CIDRs. The API does not
trust forwarded addresses by default. Sessions expire after 24 hours idle or
30 days from login, and password reset revokes every account session.

Frontend verification/reset pages must read fragment tokens, remove them from
browser history, and submit JSON to the API. Those pages and dashboard
integration are separate work: the existing dashboard/old mocks do not match
the new API. Legacy auth and `/api/user` routes are retired, without aliases,
and legacy cookies cannot authenticate. Existing legacy accounts require a
fresh registration; no legacy password conversion is performed.

Onboarding and v1 user endpoints are not implemented here. Newly verified
accounts can log in, inspect minimal session state, and log out, but cannot yet
complete onboarding. Full login/session projections are supported for accounts
that have already completed onboarding.
