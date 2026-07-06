# Deployment Guide

Deploy this portfolio to Vercel with a PostgreSQL database (Coolify or any provider). Two paths are documented — pick the one that fits your workflow.

## Recommended: Dashboard + GitHub (no CLI)

Zero local terminal auth needed. All setup happens in your browser.

### Step 1: Get your database ready

Make sure your Coolify PostgreSQL is reachable from the public internet. Get the connection string:

```
postgresql://USER:PASSWORD@HOST:PORT/DBNAME
```

> **Tip**: If Coolify is on a private network, expose the DB via Cloudflare Tunnel or set Coolify's network to allow public access on the DB port with a strong password.

### Step 2: Push schema to the database (run once, locally)

From your project folder:

```bash
# Create .env with your production DATABASE_URL
Copy-Item .env.example .env
# Edit .env and set DATABASE_URL to your postgresql://... string
# (you can also set the other env vars to placeholder values for now)

# Push schema
npx prisma db push
```

You should see: `Your database is now in sync with the Prisma schema.`

### Step 3: Create Vercel project

1. Go to <https://vercel.com/new>
2. Click **Import** next to `maulanaadib/portfolio` (or your fork)
3. Vercel auto-detects Next.js — leave settings as default
4. **Before clicking Deploy**, click **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | `postgresql://USER:PASSWORD@HOST:PORT/DBNAME` |
   | `NEXTAUTH_SECRET` | (generate below) |
   | `NEXTAUTH_URL` | (set after first deploy — see step 5) |
   | `ADMIN_EMAIL` | your admin email |
   | `ADMIN_PASSWORD` | a strong password |
   | `ADMIN_NAME` | your display name |

5. Generate a strong `NEXTAUTH_SECRET`:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Paste the output as the value.

6. **Skip `NEXTAUTH_URL` for now** — you'll set it after the first deploy gives you a URL.

7. Click **Deploy**

### Step 4: Wait for first deploy

Takes 1-3 minutes. Vercel will show you a URL like `https://portfolio-xyz.vercel.app` when done.

### Step 5: Set NEXTAUTH_URL to your actual URL

1. Go to **Project → Settings → Environment Variables**
2. Add `NEXTAUTH_URL` = `https://your-actual-url.vercel.app`
3. Go to **Deployments** tab → click the three dots on the latest deployment → **Redeploy**

(Without this, login redirects will fail.)

### Step 6: Seed the production database

Run the seed script against the production DB. From your project folder:

```bash
# Set DATABASE_URL to your production value
$env:DATABASE_URL = "postgresql://USER:PASSWORD@HOST:PORT/DBNAME"
npx tsx prisma/seed.ts
```

This populates sample data. You can skip this and just log in to `/admin` to add your real content.

### Step 7: Verify

1. Open your site URL — should show the portfolio (with sample data if you seeded)
2. Go to `/admin/login` and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`
3. Add your real content via the dashboard

---

## Alternative: Vercel CLI (requires `vercel login`)

If you prefer command-line deploys:

```bash
# 1. Login (opens browser, one-time)
vercel login

# 2. Set env vars
$dbUrl = Read-Host "DATABASE_URL"
$secret = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
$adminEmail = Read-Host "ADMIN_EMAIL"
$adminPass = Read-Host -AsSecureString "ADMIN_PASSWORD"

echo $dbUrl | vercel env add DATABASE_URL production
echo $secret | vercel env add NEXTAUTH_SECRET production
echo $adminEmail | vercel env add ADMIN_EMAIL production
$adminPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($adminPass))
echo $adminPassPlain | vercel env add ADMIN_PASSWORD production
echo "Admin" | vercel env add ADMIN_NAME production

# 3. Deploy
vercel --prod
```

After first deploy, set `NEXTAUTH_URL` to the actual URL (see step 5 above) and redeploy.

Or run the bundled one-shot script:

```bash
pwsh scripts/deploy.ps1
```

---

## Day-to-day workflow

### Edit content (the whole point of the app!)

1. Go to `https://your-site.vercel.app/admin/login`
2. Sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`
3. Edit anything — changes appear on the public site within seconds (no redeploy needed)

### Push code changes

```bash
git add .
git commit -m "your change"
git push
```

If you set up the GitHub Actions deploy workflow (see below), this auto-deploys. Otherwise, Vercel also auto-deploys on push when you connect the repo via the dashboard.

### Optional: Auto-deploy via GitHub Actions

The repo includes `.github/workflows/deploy.yml` that deploys via Vercel CLI. To enable:

1. Go to <https://vercel.com/account/tokens> → create a token → copy it
2. Go to your GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**
3. Add three secrets:
   - `VERCEL_TOKEN` = the token from step 1
   - `VERCEL_ORG_ID` = your Vercel team ID (Settings → General in Vercel)
   - `VERCEL_PROJECT_ID` = your project ID (Settings → General in Vercel)

Now every push to `master` triggers a deploy via Actions.

---

## Custom domain

In Vercel dashboard:

1. **Project → Settings → Domains**
2. Add your domain
3. Follow DNS instructions
4. Update `NEXTAUTH_URL` env var to `https://yourdomain.com`
5. Redeploy

---

## Local development

The repo includes `.env.example`. To run locally:

```bash
# Option A: same Postgres (no SQLite hassle)
cp .env.example .env
# Edit .env with your DATABASE_URL
npx prisma db push
npm run dev

# Option B: SQLite (faster, no network)
# Edit prisma/schema.prisma: provider = "sqlite"
# Edit .env: DATABASE_URL="file:./dev.db"
# Then: npx prisma db push && npm run db:seed && npm run dev
```

---

## Troubleshooting

### Build fails with "prisma generate" error

Vercel runs `postinstall` which calls `prisma generate`. If it fails, check that `DATABASE_URL` is set in env vars (can be a placeholder for build, real for runtime).

### Runtime: "PrismaClientInitializationError"

DB connection string is wrong or DB is unreachable from Vercel's region. Check:
- Connection string format (`postgresql://...`)
- DB allows connections from Vercel's IPs (or is fully public)
- DB is running in Coolify

### Login redirects loop / not working

`NEXTAUTH_URL` doesn't match your deployed URL. Update it and redeploy.

### Changes not showing on public site

Browser cache. Hard refresh (Ctrl+Shift+R). Or check Vercel function logs for errors.

---

## Architecture

- **App**: Vercel (Next.js 14 with App Router)
- **Database**: PostgreSQL (Coolify self-hosted, or any provider)
- **CI**: GitHub Actions (typecheck + build verify on every push)
- **CD**: Vercel auto-deploy on push, or GitHub Actions deploy workflow

## Cost

- Vercel: Free tier covers hobby projects (100 GB bandwidth/month)
- Coolify: Self-hosted, free
- Domain (optional): ~$10-15/year
