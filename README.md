# Levelock Event Management Platform – Minimal Starter

A student-friendly, deployable foundation for the **Levelock** online gaming championship event platform.

This starter includes:

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Prisma + Neon PostgreSQL schema (users, events, tickets, registrations, SPOCs, etc.)
- Levelock seed data (event details, ticket types, form fields, SPOC, email template)
- Authentication (NextAuth credentials) + one-time `/setup` page for Super Admin
- Basic public Home page driven by database
- Admin dashboard shell with real stats
- Registration page stub
- Vercel-ready configuration (no cron jobs)
- Complete `.env.example`

**This is intentionally a minimal but solid foundation.**  
Full dynamic registration form, QR generation, check-in scanner, SPOC display on tickets, and Resend campaigns will be expanded next.

---

## Student Deployment (No Terminal Required)

### Step 1 – Download & Extract
Download the ZIP and extract it on your computer.

### Step 2 – Create GitHub Repository
1. Go to [github.com](https://github.com) and sign in.
2. Click **New repository**.
3. Name it e.g. `levelock-event` (public or private).
4. **Do not** initialize with README.
5. Click **Create repository**.

### Step 3 – Upload files via GitHub Web UI
1. On the empty repository page, click **uploading an existing file**.
2. Drag and drop **all** files and folders from the extracted ZIP (including the hidden `.gitignore` and `.env.example`).
3. Commit the files.

### Step 4 – Create Neon Database
1. Go to [neon.tech](https://neon.tech) → Sign up / Log in.
2. Create a new project.
3. Copy the **connection string** (it looks like `postgresql://...@ep-xxx.../neondb?sslmode=require`).

### Step 5 – Create Cloudinary Account (for images later)
See the separate Cloudinary guide. You need:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Step 6 – Create Resend Account (for emails)
1. Go to [resend.com](https://resend.com) → Sign up.
2. Create an API key.
3. (Recommended) Verify a domain or use the onboarding sender for testing.

### Step 7 – Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub.
2. Click **Add New… → Project**.
3. Import the GitHub repository you just created.
4. **Environment Variables** – add these one by one:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Neon connection string |
| `NEXTAUTH_SECRET` | A long random string (e.g. generate at https://generate-secret.vercel.app/32) |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` (update after first deploy) |
| `NEXT_PUBLIC_APP_URL` | Same as above |
| `RESEND_API_KEY` | Your Resend key |
| `RESEND_FROM_EMAIL` | e.g. `noreply@yourdomain.com` or the Resend test address |
| `RESEND_FROM_NAME` | `Levelock` |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary |
| `CLOUDINARY_API_KEY` | From Cloudinary |
| `CLOUDINARY_API_SECRET` | From Cloudinary |

5. Click **Deploy**.

### Step 8 – First-time Setup
1. After deploy succeeds, open `https://your-project.vercel.app/setup`
2. Create the Super Admin account.
3. You will be redirected to `/admin/login`.
4. Log in and open the dashboard.

### Step 9 – (Optional) Seed full Levelock data
If the event data is missing, you can later run the seed via a protected admin action (or temporarily enable a seed API). The `/setup` route already creates a basic Levelock event if none exists.

---

## Local Development (optional – only if you have Node.js)

```bash
npm install
cp .env.example .env
# fill .env with real values
npx prisma db push
npm run db:seed
npm run dev
```

---

## Default Credentials (after seed)

If you ran the seed script:

- Email: `admin@levelock.in`
- Password: `Levelock@2026`

**Change this immediately** after first login in production.

---

## Project Structure (Starter)

```
event-management-platform/
├── prisma/
│   ├── schema.prisma      # Full core schema
│   └── seed.ts            # Levelock seed data
├── src/
│   ├── app/
│   │   ├── page.tsx               # Public home
│   │   ├── register/page.tsx      # Registration stub
│   │   ├── setup/page.tsx         # First-time Super Admin
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   └── page.tsx           # Dashboard
│   │   └── api/
│   │       ├── auth/[...nextauth]
│   │       └── setup/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   └── types/
├── .env.example
├── vercel.json
├── package.json
└── README.md
```

---

## Next Steps (Roadmap for full platform)

1. Complete dynamic registration form + server-side validation
2. Ticket + unique QR generation + confirmation email via Resend
3. Ticket page + staff QR scanner / check-in
4. SPOC assignment visible on tickets
5. Event Configuration admin panel (all branding fields)
6. Full CRUD for speakers, sponsors, etc.
7. Email campaigns (manual / on-demand)
8. CSV exports + audit logs

---

## Support

This starter is designed so college students can deploy a real event site using only GitHub + Vercel + the free tiers of Neon, Resend and Cloudinary — no terminal required for deployment.
