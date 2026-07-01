# Dossier Next.js Migration

This is the migrated Next.js App Router version of the Dossier frontend.

## Run locally

```bash
npm install
npm run dev
```

or:

```bash
bun install
bun run dev
```

Open `http://localhost:3000`.

## What changed

- Converted from Vite/TanStack Router to Next.js App Router.
- Preserved the Dossier corkboard/case-file UI theme.
- Replaced TanStack `Link` / navigation with `next/link` and `next/navigation`.
- Added App Router pages:
  - `/`
  - `/auth`
  - `/dashboard`
  - `/applications/new`
  - `/applications/[id]`
  - `/resumes`
  - `/analytics`
  - `/settings`
- Kept mock data in `lib/mock-data.ts` for now.

## Next development step

The frontend is still using mock data. The next backend step is to add:

1. Prisma schema
2. PostgreSQL database
3. Auth.js signup/login
4. Application CRUD API routes
5. Resume upload flow with S3/R2
