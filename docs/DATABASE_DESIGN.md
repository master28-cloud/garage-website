# Database Design
**AutoPro Garage · PostgreSQL (Neon) · Prisma 5 · v1.0**

## 1. Entity-Relationship (text diagram)

```
┌────────────┐ 1       0..N  ┌──────────────┐
│  AdminUser │ ─────────────►│   AuditLog   │ (actor email)
└────────────┘               └──────────────┘

┌────────────┐
│  Booking   │  (independent — one row per booking)
└────────────┘

┌────────────────┐    ┌───────────────┐
│ CookieConsent  │    │ NewsletterLead│  (standalone)
└────────────────┘    └───────────────┘
```

v1 is intentionally flat; a `Vehicle` + `Customer` normalisation is a Phase 2 item once repeat-visit cohorts are tracked. Today, each `Booking` holds its own contact + vehicle snapshot to keep the hot path (public form → write) minimal.

## 2. Tables

### 2.1 `Booking`
| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id              | `text` (cuid)              | NO | cuid() | PK |
| name            | `text`                     | NO |  | 2–80 chars (enforced in Zod) |
| phone           | `text`                     | NO |  | Kenyan format `^(\+254|0)[17]\d{8}$` |
| email           | `text`                     | YES |  | Optional |
| vehicleMake     | `text`                     | NO |  |  |
| vehicleModel    | `text`                     | NO |  |  |
| vehicleYear     | `integer`                  | YES |  | 1980–2030 |
| service         | `ServiceType` (enum)       | NO |  | 9 values |
| preferredDate   | `timestamptz`              | NO |  | Future-dated |
| notes           | `text`                     | YES |  | ≤ 500 chars |
| status          | `BookingStatus` (enum)     | NO | `PENDING` |  |
| consentPrivacy  | `boolean`                  | NO | `false` | Required at submit |
| consentMarket   | `boolean`                  | NO | `false` | Opt-in |
| ipHash          | `text`                     | YES |  | SHA-256(IP), 32 chars — not reversible |
| userAgent       | `text`                     | YES |  | Truncated 200 |
| createdAt       | `timestamptz`              | NO | now() |  |
| updatedAt       | `timestamptz`              | NO | now() | Auto-updated |

**Indexes:** `createdAt`, `status`, `phone`.

### 2.2 `AdminUser`
PK `id` (cuid), unique `email`, `passwordHash` (bcrypt cost 10), `name`, `role` (`ADMIN`|`STAFF`), `lastLoginAt`, timestamps.

### 2.3 `AuditLog`
`id`, `actorEmail`, `action` (e.g. `booking.status_change`), `entity` (`Booking`), `entityId`, `meta` (JSONB), `ip`, `createdAt`. Indexed on `createdAt`, `actorEmail`.

### 2.4 `CookieConsent` (optional server-side mirror of banner state)
`anonId` (UUID), booleans for `necessary`/`analytics`/`marketing`, `version` string, timestamps. Keyed only by anon id — no PII.

### 2.5 `NewsletterLead`
`email` (unique), `source`, `consent`, `createdAt`.

## 3. Enums
```
BookingStatus = PENDING | CONFIRMED | IN_PROGRESS | COMPLETED | CANCELLED
ServiceType   = ENGINE_DIAGNOSTICS | PANEL_BEATING | WHEEL_ALIGNMENT |
                BRAKE_SUSPENSION  | AC_SERVICING  | ELECTRICAL     |
                PRE_PURCHASE_INSPECTION | INSURANCE_CLAIM | OTHER
Role          = ADMIN | STAFF
```

## 4. Access patterns
| Query | Table(s) | Index used |
|---|---|---|
| Create booking | Booking | PK |
| List recent bookings (admin) | Booking | `createdAt DESC` |
| Filter by status | Booking | `status` |
| Lookup by phone (support) | Booking | `phone` |
| Admin status change log | AuditLog | `createdAt` |

## 5. Data retention
| Data | Retention | Reason |
|---|---|---|
| Booking | 7 years | Tax/insurance obligations |
| AuditLog | 2 years | Security forensics |
| CookieConsent | 24 months | Prove GDPR compliance |
| NewsletterLead | Until withdrawn | Opt-in email |

Scheduled job (future): `DELETE FROM "Booking" WHERE "createdAt" < now() - interval '7 years'`.

## 6. Migrations
Managed by Prisma Migrate. For Neon:
```powershell
npx prisma migrate dev --name <change>   # local
npx prisma migrate deploy                # CI/prod
```
Alternative for serverless: `npx prisma db push` (no migration files).

## 7. Backups
- Neon point-in-time restore (paid plans).
- GitHub Action nightly `pg_dump` to encrypted S3 bucket (template to be added).

## 8. Example SQL

```sql
-- Create a booking manually (triage/testing)
INSERT INTO "Booking" (id, name, phone, "vehicleMake", "vehicleModel", service, "preferredDate", "consentPrivacy")
VALUES ('ckxxx', 'Jane Wambui', '0712345678', 'Toyota', 'Prado', 'ENGINE_DIAGNOSTICS', NOW() + interval '2 days', true);

-- Admin dashboard query
SELECT id, name, phone, service, status, "preferredDate"
FROM "Booking"
ORDER BY "createdAt" DESC
LIMIT 100;
```
