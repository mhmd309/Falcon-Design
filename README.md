# Falcon Design

Bilingual (Arabic / English) corporate website for Falcon Design — Steel & Aluminum Works in Al Ain, Abu Dhabi, UAE.

Content is **static in code** (no database / no admin CMS). Edit `src/lib/data/content.ts` for text, emails, and image paths. Gallery files live in `public/gallery/`; certificate images in `public/certificates/`.

## Stack

- Next.js 16 (App Router) + TypeScript
- React 19 + Tailwind CSS 4
- Framer Motion + Lucide React
- Zod (contact form validation)
- Nodemailer / Resend (contact email delivery)

## Pages

- Home, About, Services, Gallery, Certificates, Contact
- Locales: `/ar/*` (default) and `/en/*` with RTL/LTR

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/ar`.

## Contact form email delivery

Add SMTP (or Resend) credentials in `.env.local`.

Gmail: enable 2FA, create an App Password, then set:

```env
CONTACT_TO_EMAIL=falcondesign20@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=falcondesign20@gmail.com
SMTP_PASS=your-app-password
CONTACT_FROM_EMAIL=falcondesign20@gmail.com
```

Without these, the form validates but cannot deliver mail.

## Editing content

| What | Where |
|------|--------|
| Company copy, services, gallery metadata, emails, certificates | `src/lib/data/content.ts` |
| Gallery photos | `public/gallery/*.jpeg` |
| Certificate images | `public/certificates/*` |
| Navigation labels | `src/config/site.ts` |

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
