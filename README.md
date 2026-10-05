# AutoPro Garage

Premium automotive repair website for Kenya — Next.js 14, Prisma, Neon Postgres, Tailwind, deployed on Vercel.

**Tagline:** Drive In Broken. Drive Out Brilliant.
**CEO & Founder:** Brian Mugambi Mbaabu
**WhatsApp:** +254 727 718 981

---

## Features

- Mobile-first landing page (Hero, Before/After drag slider, Services, Mission/Vision, Stats counters, Hierarchy, Testimonials, Contact).
- Booking form that **writes to the Neon database and then redirects to WhatsApp** with a pre-filled, referenced message.
- GDPR / Kenya DPA 2019 cookie banner (necessary, analytics, marketing).
- Admin dashboard at `/admin/login` with JWT session, protected by middleware.
- SEO: Open Graph, JSON-LD (`AutoRepair`), `/sitemap.xml`, `/robots.txt`, security headers.
- Images sourced from Unsplash (free licence) with African / Kenyan contexts.

---

## 1 · Install

```powershell
cd garage-website
npm install
```

## 2 · Neon database

1. Create a free account at https://console.neon.tech
2. Create a project. Copy **both** connection strings:
   - **Pooled** (ends in `-pooler.neon.tech`) → `DATABASE_URL`
   - **Direct** → `DIRECT_URL`
3. Copy `.env.example` to `.env` and paste the values.

```powershell
Copy-Item .env.example .env
```

4. Generate your admin password hash and JWT secret:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('bcryptjs').hashSync('YourStrongPassword!', 10))"
```

Paste both into `.env` as `JWT_SECRET` and `ADMIN_PASSWORD_HASH`.

5. Push the schema to Neon and seed the admin user:

```powershell
npx prisma generate
npx prisma db push
npm run db:seed
```

## 3 · Run locally

```powershell
npm run dev
```

Open http://localhost:3000 — admin at `/admin/login`.

## 4 · Publish on GitHub (CLI)

If you don't have GitHub CLI: https://cli.github.com/

```powershell
git init
git add .
git commit -m "Initial commit: AutoPro Garage"
gh auth login
gh repo create autopro-garage --public --source=. --remote=origin --push
```

## 5 · Deploy on Vercel

```powershell
npm i -g vercel
vercel login
vercel link
# Set env vars (interactive)
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add JWT_SECRET
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD_HASH
vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER
vercel env add NEXT_PUBLIC_SITE_URL
vercel --prod
```

Or push to GitHub and import the repo from https://vercel.com/new — set the same env vars in the dashboard.

## 6 · WhatsApp flow

The booking form posts to `/api/bookings`. On success, the response includes a `whatsappUrl` built with:

```
https://wa.me/254727718981?text=<pre-filled booking details with reference ID>
```

The client redirects the user to that URL ~1s after showing the success state.
No official WhatsApp Business API account is required for this consumer click-to-chat flow.

## 7 · Documentation

- `docs/PRD.md` — Product requirements
- `docs/ARCHITECTURE.md` — System architecture
- `docs/DATABASE_DESIGN.md` — Schema & data flow
- `docs/SECURITY.md` — Security & compliance
