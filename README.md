# Editable Portfolio

A personal portfolio website with a built-in admin dashboard. Edit your content anytime through a login-protected panel — no code changes needed.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Prisma · SQLite · NextAuth

## Features

- Public portfolio site with dark/light mode (responsive)
- Login-protected admin dashboard at `/admin`
- Edit profile, skills, projects, experience, education, services, testimonials
- Built-in contact form with messages inbox
- Zero-config — uses SQLite, no external services required

## Quick start

```bash
# 1. Install dependencies (Prisma client auto-generated)
npm install

# 2. Set up the database
npm run db:push

# 3. (Optional) Seed sample content
npm run db:seed

# 4. Start dev server
npm run dev
```

Open <http://localhost:3000> for the public site.
Open <http://localhost:3000/admin/login> for the admin panel.

**Default admin credentials** (change these in `.env` before deploying):
- Email: `admin@example.com`
- Password: `admin123`

## Configuration

Edit `.env`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="change-me-to-a-long-random-string"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
ADMIN_NAME="Admin"
```

> **Important:** Before deploying, change `NEXTAUTH_SECRET` to a random 32+ char string and update admin credentials.

## Editing your portfolio

1. Go to `/admin/login` and sign in
2. Use the sidebar to navigate to any section
3. Add/edit/delete items — changes appear on the public site immediately
4. New contact form submissions appear in **Messages**

## Project structure

```
src/
  app/
    (public)/          # Public portfolio site
      page.tsx         # Homepage
      layout.tsx       # Nav + Footer wrapper
    admin/
      login/           # Login page (public)
      (dashboard)/     # Protected admin pages
        page.tsx       # Dashboard home
        profile/       # Edit profile
        skills/        # CRUD skills
        projects/      # CRUD projects
        experience/    # CRUD work experience
        education/     # CRUD education
        services/      # CRUD services
        testimonials/  # CRUD testimonials
        messages/      # View contact form messages
    api/               # REST API routes (all under auth except /api/contact)
  components/
    public/            # Public-site components (Nav, Footer, sections)
    admin/             # Admin components (shell, forms, lists)
  lib/                 # Prisma, auth, schemas, CRUD helpers
prisma/
  schema.prisma        # Database schema
  seed.ts              # Sample data
```

## Customization

**Theme colors:** Edit `tailwind.config.ts` (look for `accent`) and `src/app/globals.css` CSS variables.

**Section order/content:** Sections on the homepage hide themselves automatically when their data is empty. To reorder, use the "Sort order" field in each admin page.

**Add new section:** Add a model in `prisma/schema.prisma`, run `npm run db:push`, add API routes + admin page, then add a section component to `src/components/public/Sections.tsx` and `src/app/(public)/page.tsx`.

## Deployment

This is a standard Next.js app. Easy options:
- **Vercel** (recommended) — zero config, free tier
- **Netlify** — also works
- **Self-host** — `npm run build && npm start`

For production, set all env vars in your hosting provider's dashboard, and use a persistent disk or migrate to PostgreSQL for the database.

## License

MIT
