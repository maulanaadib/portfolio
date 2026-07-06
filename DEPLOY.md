# Deployment Guide

Deploy this portfolio to Vercel with a PostgreSQL database (Coolify or any provider).

## Architecture

- **App**: Vercel (Next.js 14)
- **Database**: PostgreSQL (Coolify self-hosted, but works with any Postgres)
- **Repo**: GitHub → auto-deploy on every push to `master`

## One-time setup

### 1. Database (Coolify)

In your Coolify dashboard:

1. Create a new **PostgreSQL** resource
2. Note the connection details (host, port, user, password, database name)
3. Connection string format:
   ```
   postgresql://USER:PASSWORD@HOST:PORT/DBNAME
   ```
4. Make sure the DB is reachable from Vercel's region. If Coolify is on your local network, you may need to:
   - Expose Postgres publicly (with firewall rules limiting to Vercel IPs), OR
   - Use a tunnel (Cloudflare Tunnel, ngrok), OR
   - Run Vercel CLI deploy from inside the same network (`vercel deploy` from a machine that can reach the DB)

> **Note**: For hobby use, the easiest path is to make the DB reachable from the public internet with a strong password. For production, use a managed DB (Neon, Supabase, Vercel Postgres) or a tunnel.

### 2. Push schema to the database

From your local machine:

```bash
# 1. Create local .env with the production DATABASE_URL
echo 'DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME"' > .env
echo 'NEXTAUTH_SECRET="any-random-32-char-string-for-local-test"' >> .env
echo 'NEXTAUTH_URL="http://localhost:3000"' >> .env
echo 'ADMIN_EMAIL="admin@example.com"' >> .env
echo 'ADMIN_PASSWORD="admin123"' >> .env
echo 'ADMIN_NAME="Admin"' >> .env

# 2. Push the schema
npx prisma db push

# 3. (Optional) Seed sample data
npm run db:seed
```

You should see: `Your database is now in sync with the Prisma schema.`

### 3. Login to Vercel

```bash
vercel login
```

This opens a browser. Sign in with your Vercel account.

### 4. Deploy

From the project folder:

```bash
# First-time: link the project (creates .vercel/ directory, asks for project name)
vercel link

# Then set all environment variables (replace values!):
vercel env add DATABASE_URL production
# paste: postgresql://USER:PASSWORD@HOST:PORT/DBNAME

vercel env add NEXTAUTH_SECRET production
# paste: a 32+ character random string. Generate with:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

vercel env add NEXTAUTH_URL production
# paste: https://your-domain.vercel.app (you'll get this URL after first deploy)

vercel env add ADMIN_EMAIL production
# paste: your admin email

vercel env add ADMIN_PASSWORD production
# paste: a strong password

vercel env add ADMIN_NAME production
# paste: your display name

# Trigger first production deploy
vercel --prod
```

After deploy finishes, Vercel prints your URL (e.g. `https://portfolio-xyz.vercel.app`).

### 5. Update NEXTAUTH_URL

After getting the production URL, update it:

```bash
vercel env add NEXTAUTH_URL production
# paste: https://your-actual-url.vercel.app
# Then remove the old one:
vercel env rm NEXTAUTH_URL production
```

Or set it via Vercel dashboard: **Project → Settings → Environment Variables**.

### 6. Seed production data

Run the seed script against the production DB. Easiest: temporarily set `DATABASE_URL` to the production value, then run:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME" npx tsx prisma/seed.ts
```

> **Note**: This seeds sample data. You can also skip this step and just log in to `/admin` and add your real data through the UI.

## Day-to-day workflow

### Push code changes

```bash
git add .
git commit -m "your change"
git push
```

Vercel auto-deploys. Check progress at `https://vercel.com/your-account/portfolio`.

### Edit content (the whole point of the app!)

1. Go to `https://your-site.vercel.app/admin/login`
2. Sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`
3. Edit anything — changes appear on the public site within seconds (no redeploy needed)

### Rotate the admin password

```bash
vercel env rm ADMIN_PASSWORD production
vercel env add ADMIN_PASSWORD production
# paste new password
```

Then trigger a redeploy (or just edit via Vercel dashboard).

## Custom domain

In Vercel dashboard:

1. **Project → Settings → Domains**
2. Add your domain (e.g. `yourname.com`)
3. Follow DNS instructions (add A record or CNAME)
4. Update `NEXTAUTH_URL` env var to `https://yourname.com`
5. Redeploy

## Local development

The `.env.example` is for local dev. To run locally:

```bash
# Option A: use SQLite (change schema back temporarily)
# Edit prisma/schema.prisma: provider = "sqlite"
# Use DATABASE_URL="file:./dev.db"
# Then: npx prisma db push && npm run db:seed

# Option B: use the same Postgres from Coolify
cp .env.example .env
# Edit .env with your DATABASE_URL
npx prisma db push
npm run dev
```

## Troubleshooting

### "Build failed: prisma generate"

Vercel's `postinstall` script runs `prisma generate` automatically (defined in `package.json`). If it fails, check that:
- `DATABASE_URL` is set in Vercel env vars
- The DB is reachable from Vercel's build region

### "PrismaClientInitializationError" at runtime

The DB connection string is wrong, or the DB is unreachable from Vercel's runtime region. Check:
- Connection string format (`postgresql://...`)
- DB allows connections from Vercel's IPs
- DB is running (check Coolify)

### Login redirects loop

`NEXTAUTH_URL` doesn't match the actual deployed URL. Update it via `vercel env add NEXTAUTH_URL production`.

### Local dev shows old data

Clear `.next` cache: `rm -rf .next && npm run dev`.

## Cost

- Vercel: Free tier covers hobby projects (100 GB bandwidth/month)
- Coolify: Self-hosted, free (you own the server)
- Domain (optional): ~$10-15/year

## Backup strategy

The DB is just a normal PostgreSQL database. Back it up via:

```bash
# Dump to file
pg_dump "postgresql://USER:PASSWORD@HOST:PORT/DBNAME" > backup.sql

# Restore
psql "postgresql://USER:PASSWORD@HOST:PORT/DBNAME" < backup.sql
```

Or set up automated daily backups in Coolify.
