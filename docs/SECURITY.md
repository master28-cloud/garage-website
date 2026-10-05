# Security & Compliance Design
**AutoPro Garage · v1.0 · 2026-10-05**

## 1. Threat model (STRIDE, condensed)

| Threat | Example | Control |
|---|---|---|
| **Spoofing** | Attacker impersonates admin | Bcrypt-hashed password + JWT HS256 + 5-attempt rate limit |
| **Tampering** | Modified booking payload | Zod schema, strict types, server-side enum enforcement |
| **Repudiation** | Admin denies status change | `AuditLog` row per status change |
| **Information disclosure** | Database leak | TLS everywhere, Neon encryption-at-rest, IP hashed not stored raw |
| **Denial of service** | Form flood | Rate-limiter 5 req/min/IP, Vercel firewall |
| **Elevation of privilege** | Bypass admin check | Middleware guards `/admin/dashboard`, server-side session verify on every API |

## 2. Authentication & sessions
- Single admin account seeded via env (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`).
- Password hashed with **bcryptjs cost 10**.
- Session is a signed JWT (`jose`, HS256), stored in an **HttpOnly, Secure, SameSite=Lax** cookie, 8-hour expiry.
- Middleware (`middleware.ts`) verifies the JWT before every protected request.
- Logout clears the cookie server-side.

## 3. Authorisation
- All admin API routes call `getSession()` and require `role === 'ADMIN'` before touching data.
- Public API (`/api/bookings`) is unauthenticated but validated and rate-limited.

## 4. Input validation
- Every request body is validated with **Zod**. First failure returns 400 with a safe message (no stack traces).
- `vehicleYear` numeric cast, `preferredDate` date cast, `service` enum narrowed.
- Phone regex is Kenya-specific.

## 5. Output encoding
- React escapes by default. No `dangerouslySetInnerHTML` except the JSON-LD block (serialised JSON, no user data).

## 6. Transport & headers
Set in `next.config.js`:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

Vercel terminates TLS 1.3 automatically.

## 7. Secrets management
- `.env` is git-ignored.
- Vercel environment variables encrypted at rest.
- `JWT_SECRET` must be ≥ 64 hex chars; rotate on employee offboarding.

## 8. Database
- Connections over **TLS** (`sslmode=require`).
- Prisma pooled URL used in Vercel; direct URL for migrations only.
- No raw SQL from user input — all queries go through Prisma.
- Row-level control not required at this scale; enforced at app layer.

## 9. Privacy & compliance

### 9.1 Kenya Data Protection Act, 2019
- Data controller: **AutoPro Garage**, Nairobi.
- DPO contact: `privacy@autoprogarage.co.ke`.
- Lawful bases: **contract** (service delivery), **consent** (marketing), **legal obligation** (tax, insurance records).
- Subject rights supported: access, correction, deletion, portability, withdraw consent.

### 9.2 GDPR (for EU visitors)
- Cookie banner records granular consent (necessary / analytics / marketing).
- No marketing or analytics cookies set until explicit opt-in.
- IP addresses are hashed (SHA-256) before storage.
- Data processors documented in Privacy Policy.

### 9.3 Cookies
| Name | Purpose | Lifetime | Category |
|---|---|---|---|
| `apg_session` | Admin auth | 8 hours | Necessary |
| `apg_consent_v1` (localStorage) | Remember consent | Until cleared | Necessary |

Analytics / marketing scripts are **not** loaded until the user opts in.

## 10. Logging
- Vercel captures stdout/stderr per invocation (14-day retention on free, 30+ on paid).
- No PII is logged — booking logs reference only `id`.
- `AuditLog` tracks admin writes with actor email, action, entity, meta JSON.

## 11. Vulnerability management
- `npm audit` run in CI.
- Dependabot alerts enabled on the GitHub repo.
- Prisma + Next.js kept on patch releases; monthly dependency bump PR.

## 12. Incident response
1. Detect — Vercel alerts, Neon alerts, user report.
2. Contain — rotate `JWT_SECRET`, revoke Neon password, deploy mitigation.
3. Assess — scope affected rows via `AuditLog`.
4. Notify — within **72 hours** to ODPC (DPA 2019) and affected users as required.
5. Learn — postmortem committed to `docs/incidents/`.

## 13. Admin dashboard specific
- Protected by middleware → login redirect.
- Reads 100 most recent bookings; status changes are audited.
- No bulk delete endpoint in v1 — single-row status PATCH only.
- CSRF: not applicable (cookie SameSite=Lax + fetch same-origin only). If opening to third-party browsers, add CSRF tokens.
