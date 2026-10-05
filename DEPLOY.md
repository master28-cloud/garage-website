# Deployment Guide — step by step

This is the exact sequence to go from `garage-website/` on your machine to a live site on your own domain.
Everything that needs an interactive login is marked **🔐 you do this once**.

---

## Step 1 — Install dependencies

```powershell
cd garage-website
npm install
```

## Step 2 — Neon (online Postgres) 🔐

Neon is a hosted database — you don't download it, you create a free project.

1. Open https://console.neon.tech → **Sign up with GitHub**.
2. **Create a project** → region `Europe (Frankfurt)` or `AWS us-east-1`.
3. On the project dashboard click **Connection details** → copy:
   - the **Pooled connection** (ends with `-pooler.neon.tech`) → paste as `DATABASE_URL` in `.env`
   - the **Direct connection** → paste as `DIRECT_URL` in `.env`

```powershell
Copy-Item .env.example .env
notepad .env    # paste the two URLs + fill in the rest below
```

## Step 3 — Generate secrets

```powershell
# JWT secret (64-char hex)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Bcrypt hash of your admin password
node -e "console.log(require('bcryptjs').hashSync('ChangeThisStrongPwd!', 10))"
```

Paste the first into `.env` as `JWT_SECRET`, the second as `ADMIN_PASSWORD_HASH`.
Set `ADMIN_EMAIL` to your login email (default: `admin@autoprogarage.co.ke`).

## Step 4 — Create the tables & seed admin

```powershell
npx prisma generate
npx prisma db push     # creates tables in Neon
npm run db:seed        # creates/updates the admin user
```

## Step 5 — Run locally

```powershell
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin/login

Submit a test booking — you should see a success toast, then WhatsApp opens with the pre-filled message to **+254 727 718 981**.

---

## Step 6 — Push to GitHub (CLI) 🔐

```powershell
# install once if you don't have it:
winget install --id GitHub.cli

git init
git add .
git commit -m "Initial commit: AutoPro Garage"
gh auth login       # interactive, one time
gh repo create autopro-garage --public --source=. --remote=origin --push
```

## Step 7 — Deploy on Vercel 🔐

Option A — one-click: visit https://vercel.com/new → import `autopro-garage`.

Option B — CLI:

```powershell
npm i -g vercel
vercel login              # one time
vercel link               # link this folder to a new project
vercel env add DATABASE_URL          # paste pooled URL
vercel env add DIRECT_URL            # paste direct URL
vercel env add JWT_SECRET            # same as .env
vercel env add ADMIN_EMAIL           # same as .env
vercel env add ADMIN_PASSWORD_HASH   # same as .env
vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER   # 254727718981
vercel env add NEXT_PUBLIC_SITE_URL          # https://autoprogarage.co.ke (or your Vercel URL)
vercel --prod
```

## Step 8 — Point your domain (optional)

In Vercel project → **Settings → Domains** → add `autoprogarage.co.ke` and update DNS as prompted.

---

## WhatsApp API — what to know

This project uses WhatsApp's **click-to-chat** endpoint (`https://wa.me/<number>?text=<msg>`), which is officially supported for consumer apps and needs **no API key**.

If you later want:
- Automated replies / templates / broadcast messages → sign up for the **WhatsApp Business API** (via Meta or a BSP like Twilio, 360dialog, Infobip).
- Server-to-server booking confirmations → wire the BSP's HTTP API into `/api/bookings/route.ts` after `prisma.booking.create`.

The current flow already covers the business requirement: *record in DB → redirect user to WhatsApp with a pre-filled booking message*.
