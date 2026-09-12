# Falcon Design

Production-oriented bilingual (English / Arabic) corporate website with Admin CMS, powered by Next.js App Router and Supabase.

Company content is derived from the Falcon Design company profile (Steel & Aluminum Works — Al Ain, Abu Dhabi, UAE). Gallery images are included under `public/gallery/`.

## Technology stack

- Next.js 15 (App Router) + TypeScript
- React 19 + Tailwind CSS 4
- Framer Motion + Lucide React
- Supabase (PostgreSQL, Auth, Storage, RLS)
- Zod validation
- Next.js Metadata API, sitemap, robots

## Features

- Public site: Home, About, Services, Gallery, Contact
- Locale routes: `/en/*` and `/ar/*` with RTL/LTR
- Language switcher preserves the current path
- Admin CMS for all page content, SEO, gallery, services, contact emails
- Contact form with server validation, honeypot, and rate limiting
- Dynamic SEO: metadata, Open Graph, Twitter, canonical, hreflang, JSON-LD
- `sitemap.xml` and `robots.txt`
- Fallback seed content when Supabase env is not configured (public site still renders)

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — middleware redirects `/` → `/en`.

## Environment variables

See `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000

CONTACT_EMAIL_1=EMAIL_1
CONTACT_EMAIL_2=EMAIL_2
CONTACT_EMAIL_3=EMAIL_3
CONTACT_EMAIL_4=EMAIL_4
CONTACT_EMAIL_5=EMAIL_5
```

- Never commit real secrets.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- Public contact emails are managed in CMS table `contact_emails` (preferred). Env placeholders are for configuration reference.

## Supabase setup

1. Create a Supabase project.
2. Copy URL + anon key + service role key into `.env.local`.
3. Run SQL migrations in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_storage.sql`
4. Seed demo content:
   - `supabase/seed/001_seed.sql`
5. In Authentication, create an admin user (email/password).
6. Register the admin in the database:

```sql
insert into public.admin_users (user_id, email)
values ('<auth-user-uuid>', 'your-admin@email.com');
```

## Storage setup

Buckets created by migration `002_storage.sql`:

- `site-media` (public read, admin write)
- `gallery` (public read, admin write)

Allowed MIME types: JPEG, PNG, WebP, GIF, AVIF — max 10MB.

Add your Supabase storage host to `next.config.ts` `images.remotePatterns` if it differs from `*.supabase.co`.

## Authentication & authorization

- Login: `/admin/login` via Supabase Auth (`signInWithPassword`).
- Authorization: row in `admin_users` with `is_active = true`.
- Protected routes under `/admin/*` use server-side `requireAdmin()` / `assertAdmin()`.
- RLS policies enforce public read of published content and admin write access.
- No hardcoded admin passwords in source.

## Local development without Supabase

If env vars are missing or still placeholders:

- Public pages render from `src/lib/data/fallback.ts` (aligned with SQL seed).
- Contact API accepts submissions but does not persist them.
- Admin login/CMS mutations require a configured Supabase project.

## Managing content

| Area | Admin route | Notes |
|------|-------------|--------|
| Dashboard | `/admin` | Counts for services, gallery, messages |
| Home | `/admin/home` | Hero, statistics, CTA, SEO |
| About | `/admin/about` | Intro, vision, mission, values, timeline, team |
| Services | `/admin/services` | Full CRUD, feature/active, categories |
| Gallery | `/admin/gallery` | Categories + images, upload, feature |
| Contact | `/admin/contact` | Business info, map, social, messages |
| Contact emails | `/admin/contact-emails` | Exactly five entries |
| Settings | `/admin/settings` | Company profile / social defaults |

After saves, server actions call `revalidatePath` for `/en` and `/ar` routes.

## SEO

- Per-page SEO fields in `site_pages` (editable in Admin)
- Canonical + `hreflang` (`en`, `ar`, `x-default`)
- Organization / LocalBusiness + WebSite + BreadcrumbList JSON-LD
- `/sitemap.xml`, `/robots.txt` (blocks `/admin`)

## Production deployment (Vercel)

1. Push the repository.
2. Import the project in Vercel.
3. Set all environment variables (use production `NEXT_PUBLIC_SITE_URL`).
4. Deploy.
5. Confirm Supabase Auth redirect URLs include your production domain.
6. Run migrations + seed (or production content) on the Supabase project.

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run start    # start production server
npm run lint     # ESLint
```

## Project structure (high level)

```text
src/
  app/
    [locale]/          # public bilingual pages
    admin/             # CMS (login + protected editors)
    api/contact/       # contact form endpoint
    sitemap.ts
    robots.ts
  components/          # UI, layout, page sections, admin
  lib/                 # supabase, auth, data, seo, validation, i18n
  config/site.ts
  types/database.ts
supabase/
  migrations/
  seed/
public/gallery/        # project images 01–23
```

## Security notes

- RLS enabled on CMS tables
- Service role key is server-only
- Contact form: Zod validation, honeypot, IP-hash rate limit
- Uploads: MIME/size validation in admin uploader
- Admin mutations always call `assertAdmin()` first

## Testing checklist

- [x] Production build succeeds
- [x] Public routes generate for `/en` and `/ar`
- [x] Sitemap + robots generated
- [ ] Connect real Supabase and verify admin login
- [ ] Upload gallery images to Storage buckets
- [ ] Submit contact form and confirm `contact_messages` row
- [ ] Toggle locale EN | عربي on each page

## License

Private project for Falcon Design.
