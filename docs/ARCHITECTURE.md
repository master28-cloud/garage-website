# Architecture Design
**AutoPro Garage · v1.0 · 2026-10-05**

## 1. High-level overview

```
┌──────────────┐     HTTPS      ┌────────────────────────┐
│   Visitor    │ ─────────────► │  Vercel Edge CDN       │
│  (browser)   │                │  (static + ISR cache)  │
└──────┬───────┘                └──────────┬─────────────┘
       │                                   │
       │ booking form POST                 │ page requests
       ▼                                   ▼
┌───────────────────────────────────────────────────────┐
│          Vercel Serverless Functions (Node 20)        │
│  Next.js 14 App Router · Route handlers · Middleware  │
└──────────────┬───────────────┬────────────────┬───────┘
               │               │                │
    Prisma ORM │               │                │ WhatsApp
               ▼               ▼                ▼ click-to-chat
         ┌───────────┐   ┌───────────┐    wa.me/254727718981
         │   Neon    │   │   JWT     │
         │ Postgres  │   │  session  │
         │  (TLS)    │   │  (HttpOnly│
         └───────────┘   │   cookie) │
                         └───────────┘
```

## 2. Technology choices
| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 App Router | SSR + SSG + API routes in one deploy, excellent SEO defaults, native Vercel integration. |
| UI | Tailwind CSS + lucide-react | Rapid, consistent, mobile-first. |
| Fonts | Inter + Poppins (Google Fonts via `next/font`) | Modern, premium, high legibility (Millennials/Gen X). |
| DB | Neon Postgres (serverless) | Autosleep + pooled connections suit Vercel; branchable for staging. |
| ORM | Prisma 5 | Type-safe, migrations, good DX. |
| Auth | `jose` JWT in HttpOnly cookie | No session store; stateless. |
| Validation | Zod | Shared schemas between client/server. |
| Hosting | Vercel | Edge CDN, zero-config, generous free tier. |
| Images | Unsplash via `next/image` (remote patterns) | Fast CDN, Africa-sourced imagery. |
| Monitoring | Vercel Analytics (optional) | Add once ready. |

## 3. Request flows

### 3.1 Public page load
`Browser → Vercel Edge (cached HTML) → hydrate (React)`. First byte served from CDN; dynamic parts (none on landing) revalidate per deploy.

### 3.2 Booking submission
```
Browser  ──POST /api/bookings──►  Node runtime
                                   ├─ rate-limit (in-memory, per IP+path)
                                   ├─ Zod validation
                                   ├─ hash IP (SHA-256, truncated)
                                   ├─ prisma.booking.create()
                                   └─ build wa.me URL with reference
Browser  ◄─ 201 { reference, whatsappUrl }
Browser  → window.location = whatsappUrl   (opens WhatsApp)
```

### 3.3 Admin
- Middleware `middleware.ts` runs on `/admin/dashboard/:path*`, verifies JWT, redirects to `/admin/login` on failure.
- Login hits `/api/admin/login`, bcrypt-compares password, issues 8-hour JWT.
- Dashboard reads via server component; status updates PATCH `/api/admin/bookings`.

## 4. Environments
| Env | Branch | DB | URL |
|---|---|---|---|
| Dev | local | Neon dev branch | `localhost:3000` |
| Preview | PRs | Neon preview branch (optional) | Vercel preview |
| Prod | `main` | Neon main | `autoprogarage.co.ke` |

Vercel builds run `prisma generate && next build`. Database migrations are applied via `npx prisma db push` from CI or locally (idempotent).

## 5. Scalability
- Vercel scales serverless automatically. Neon pooled URL (`-pooler.neon.tech`) handles concurrent connections.
- Rate limiter is in-memory (per lambda instance) — fine for v1; upgrade to Upstash Redis if sustained traffic grows.
- Images via `next/image` on the Vercel image optimiser (cached globally).

## 6. Observability
- Vercel logs capture every function invocation.
- `prisma.$use` is **not** installed by default; add timing middleware in Phase 2.
- `AuditLog` table records admin actions.

## 7. Backup & recovery
- Neon offers point-in-time recovery (7 days on paid plans; manual export on free).
- CI/CD: GitHub Actions can run `pg_dump` nightly to S3 (template included in `.github/workflows/` later).

## 8. Future
- Replace in-memory rate limiter with Upstash.
- Add email receipts via Resend.
- Add real-time status updates with Pusher or server-sent events.
- Multi-branch workshop support.
