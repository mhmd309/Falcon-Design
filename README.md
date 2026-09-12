# Falcon Design

Bilingual (Arabic / English) corporate website for Falcon Design — Steel & Aluminum Works in Al Ain, Abu Dhabi, UAE.

Content is **static in code** (no database / no admin CMS). Edit `src/lib/data/content.ts` for text, emails, and image paths. Gallery files live in `public/gallery/`; certificate images in `public/certificates/`.

## Stack

- Next.js 16 (App Router) + TypeScript
- React 19 + Tailwind CSS 4
- Framer Motion + Lucide React
- Zod (contact form validation)

## Pages

- Home, About, Services, Gallery, **Certificates**, Contact
- Locales: `/ar/*` (default) and `/en/*` with RTL/LTR
- Contact form: client + API validation, honeypot, rate limiting

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/ar`.

Optional env:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Editing content

| What | Where |
|------|--------|
| Company copy, services, gallery metadata, emails, certificates | `src/lib/data/content.ts` |
| Gallery photos | `public/gallery/*.jpeg` |
| Certificate images | `public/certificates/*` (replace SVGs with real scans) |
| Navigation labels | `src/config/site.ts` |

Contact emails are listed in `contactEmails` inside `content.ts` — edit them manually there.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
