# Putting AutoPro Garage online — free

Netlify (hosting) + Neon (database). Both free tiers, both permit running your
own commercial site. Budget about 30 minutes.

You will create three accounts. I cannot do that part for you — each one needs
an email confirmation in a browser. Everything else is already prepared.

---

## Before you start

Have these ready to paste. They are your real credentials, already generated:

| Name | Value |
|---|---|
| `JWT_SECRET` | `727a58a79735ea0c445204395d0dce7237e503b6cfabf756c7faba049d038e7b` |
| `ADMIN_EMAIL` | `admin@autoprogarage.co.ke` |
| `ADMIN_PASSWORD_HASH` | `$2a$10$0imq/ah2e/pPIKhyW.s2m.0RN5DPerogx8MGwLLXPiJinjg0VBguC` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `254727718981` |

> **Read this or your admin login will fail.**
> In your local `.env` the hash is written with backslashes (`\$2a\$10\$…`).
> That is only needed locally, because Next.js expands `.env` files.
> **In Netlify, paste the version in the table above — no backslashes.**
> Your admin password itself is still `j5DqRIIFml5fR1`.

---

## Step 1 — Database (Neon)

1. Go to **https://console.neon.tech** and sign up (GitHub is quickest).
2. Create a project. Name it `autopro`. Pick the region closest to Kenya —
   **AWS eu-central-1 (Frankfurt)** is the best available.
3. On the project dashboard open **Connection Details**. You need two strings:
   - the one **with** `-pooler` in the hostname → this is `DATABASE_URL`
   - the one **without** `-pooler` → this is `DIRECT_URL`

   Both end in `?sslmode=require`. Keep them in Notepad for a moment.

4. Create the tables. In PowerShell, inside the `garage-website` folder:

   ```powershell
   $env:DATABASE_URL="<paste the pooler URL>"
   $env:DIRECT_URL="<paste the direct URL>"
   npx prisma db push
   ```

   You should see **"Your database is now in sync with your Prisma schema."**

Your local site keeps using local PostgreSQL. Neon is only for the live site.

---

## Step 2 — Code on GitHub

Netlify deploys from a GitHub repository.

```powershell
gh auth login
```

Choose **GitHub.com** → **HTTPS** → **Login with a web browser**, and follow it.
Then:

```powershell
gh repo create autopro-garage --private --source=. --remote=origin --push
```

Use `--private`. Nothing secret is committed — `.env` is git-ignored — but a
private repo is the sensible default for a business.

---

## Step 3 — Netlify

1. Go to **https://app.netlify.com/signup** and sign up **with GitHub**.
2. **Add new site** → **Import an existing project** → **GitHub** → pick
   `autopro-garage`.
3. Netlify reads `netlify.toml` from the repo, so build command and publish
   directory are already correct. Do not change them.
4. **Before clicking Deploy**, open **Add environment variables** and add all
   six:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | your Neon **pooler** URL |
   | `DIRECT_URL` | your Neon **direct** URL |
   | `JWT_SECRET` | from the table at the top |
   | `ADMIN_EMAIL` | from the table at the top |
   | `ADMIN_PASSWORD_HASH` | from the table at the top — **no backslashes** |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | `254727718981` |

5. Click **Deploy**. First build takes 2–4 minutes.

You will get an address like `random-name-123456.netlify.app`.

---

## Step 4 — Name the site and finish

1. **Site configuration → Change site name** → `autoprogarage`.
   You now have `https://autoprogarage.netlify.app`.
2. Add one final environment variable so SEO tags and the sitemap use the real
   address:

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://autoprogarage.netlify.app` |

3. **Deploys → Trigger deploy → Deploy site** so that variable takes effect.

---

## Step 5 — Check it worked

- Open your site. The homepage should load with the hero image.
- Go to `/admin/login`, sign in with `admin@autoprogarage.co.ke` /
  `j5DqRIIFml5fR1`. You should reach the dashboard, empty.
- Submit a test booking on the live site. It should save and open WhatsApp.
- Refresh the admin dashboard — the booking should be listed.

If the login fails, it is almost always the backslashes in
`ADMIN_PASSWORD_HASH`. Re-paste it without them and redeploy.

---

## Updating the site later

```powershell
git add .
git commit -m "describe your change"
git push
```

Netlify rebuilds and publishes automatically, usually within three minutes.

---

## About a .co.ke domain

`autoprogarage.netlify.app` works, but for a real garage a Kenyan domain is
worth the roughly **KSh 1,000–1,500 a year**. Registrars include Truehost,
Kenya Website Experts and Safaricom. Once you own it:

Netlify → **Domain management** → **Add a domain** → enter it, then set the DNS
records Netlify shows you at your registrar. HTTPS is issued automatically and
free. The only change needed in the app is updating `NEXT_PUBLIC_SITE_URL`.

---

## Free tier limits

| | Netlify free | Neon free |
|---|---|---|
| Traffic | 100 GB/month | — |
| Build time | 300 minutes/month | — |
| Storage | — | 0.5 GB |
| Compute | 125k function calls/month | ~190 hours/month |

A garage site will not come close to these. Commercial use is permitted on
both; Netlify only requires a paid plan if you resell hosting to other people.

---

## Before you share the link publicly

Two things from earlier still need doing:

1. **Gallery photos** — the before/after pairs are stock placeholders of
   different vehicles. Replace with your own intake and handover shots. See
   `public/images/gallery/README.md`.
2. **Partner logos** — the footer names AutoXpress, Toyota Kenya, Jubilee and
   others. Naming a company as a partner asserts a commercial relationship.
   Confirm you have permission, or edit the list in
   `components/PartnerLogos.tsx`.
