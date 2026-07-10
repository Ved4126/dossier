# Dossier 🕵️‍♂️

![Frontend](https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Next.js_API_Routes-black?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-Neon_PostgreSQL-00E699?style=for-the-badge&logo=postgresql&logoColor=white)
![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma)
![Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=for-the-badge&logo=vercel)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

A full-stack job application tracker where every job application is managed like a case file and linked to the exact resume version submitted.

🔗 **Live Demo:** `https://dossier-black.vercel.app/`

---

## 👤 My Role — Ved Dabhi

I designed and built Dossier as a full-stack portfolio project to solve a real problem faced by internship and job seekers: keeping track of applications, resume versions, job descriptions, and progress across many opportunities.

I was responsible for:

- Designing the product idea and detective/case-file user experience
- Building the full Next.js frontend
- Creating the authentication system
- Designing the PostgreSQL database schema
- Building API routes for applications, resumes, and analytics
- Connecting Prisma with Neon PostgreSQL
- Implementing resume-to-application linking
- Deploying the project on Vercel

---

## 📌 Project Overview

When applying to many internships or jobs, it becomes difficult to remember:

- Which resume version was submitted
- What the original job description said
- When the application was filed
- Whether the status changed
- Which resume versions are getting interviews
- Which applications are still active

Dossier solves this by treating every job application as a **case file**.

Each application stores the company, role, job description, status, applied date, and the exact resume version submitted. Resume files are stored in a dedicated **Resume Evidence Locker**, where they can be uploaded, viewed, downloaded, deleted, and linked to application cases.

---

## ✨ Features

### 🔐 Authentication

- User signup
- User login
- User logout
- JWT-based sessions
- HTTP-only cookies
- Protected private pages
- User-specific data access

### 🗂️ Application Case Management

- Create new job application cases
- View all cases on a dashboard
- Open detailed case files
- Edit company, role, and job description
- Update application status
- Delete application cases
- Track applied date and last updated date

### 📎 Resume Evidence Locker

- Upload resume versions
- View uploaded resumes
- Download resumes
- Delete resumes
- Track how many applications are linked to each resume
- Store resume metadata in the database

### 🔗 Resume-to-Application Linking

- Select an existing resume when creating a case
- Upload a new resume while creating a case
- Link each application to the exact submitted resume
- View/download the linked resume from the case detail page
- Swap the linked resume after case creation

### 📊 Analytics

- Real database-backed analytics
- Total application count
- Status breakdown
- Interview rate
- Offer count
- Linked resume count
- Resume performance based on linked applications

### 🎨 UI Theme

Dossier uses a detective-inspired interface:

- Corkboard layout
- Paper cards
- Case files
- Evidence locker concept
- Typewriter-style typography
- Stamp-style status badges
- Resume paper trail system

---

## 🧰 Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js App Router |
| UI | React, TypeScript, Tailwind CSS |
| Icons | Lucide React |
| Backend | Next.js API Routes |
| Database | Neon PostgreSQL |
| ORM | Prisma |
| Auth | bcryptjs, jsonwebtoken, HTTP-only cookies |
| Deployment | Vercel |

---

## 🗄️ Database Design

Dossier uses three main database models:

### User

Stores account and authentication information.

```prisma
model User {
  id           String   @id @default(cuid())
  name         String?
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  resumes      ResumeVersion[]
  applications Application[]
}
```

### ResumeVersion

Stores resume versions uploaded by each user.

```prisma
model ResumeVersion {
  id         String   @id @default(cuid())
  userId     String
  label      String
  fileName   String
  fileUrl    String
  storageKey String?
  mimeType   String?
  fileSize   Int?
  uploadedAt DateTime @default(now())

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  applications Application[]

  @@index([userId])
}
```

### Application

Stores each job application case.

```prisma
model Application {
  id              String            @id @default(cuid())
  userId          String
  company         String
  role            String
  jobDescription  String
  status          ApplicationStatus @default(APPLIED)
  appliedDate     DateTime?
  resumeVersionId String?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  resumeVersion ResumeVersion? @relation(fields: [resumeVersionId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([resumeVersionId])
}
```

### Application Status

```prisma
enum ApplicationStatus {
  APPLIED
  OA
  INTERVIEW
  REJECTED
  OFFER
}
```

---

## 🧭 Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/auth` | Login and signup |
| `/dashboard` | Application case board |
| `/applications/new` | Create a new case |
| `/applications/[id]` | View, edit, update, delete a case |
| `/resumes` | Resume Evidence Locker |
| `/analytics` | Case analytics |
| `/settings` | User account settings |

---

## 🔌 API Routes

### Authentication

```txt
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Applications

```txt
GET    /api/applications
POST   /api/applications
PATCH  /api/applications/[id]
DELETE /api/applications/[id]
```

### Resumes

```txt
GET    /api/resumes
POST   /api/resumes
GET    /api/resumes/[id]
DELETE /api/resumes/[id]
```

### Database Test

```txt
GET /api/test-db
```

---

## 🔐 Security

Dossier includes several important security features:

- Passwords are hashed with bcryptjs
- Sessions are stored in HTTP-only cookies
- JWT tokens are signed with a server-side secret
- Private pages are protected server-side
- Application and resume queries are filtered by the logged-in user ID
- Users cannot access, update, or delete another user’s applications or resumes

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Ved4126/dossier.git
cd dossier
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="your-neon-postgresql-connection-string"
JWT_SECRET="your-local-development-secret"
```

Do not commit `.env` to GitHub.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run migrations

```bash
npx prisma migrate dev
```

### 6. Start the development server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## 🚀 Production Build

```bash
npm run build
```

The production build runs Prisma Client generation before the Next.js build:

```json
"build": "prisma generate && next build"
```

This helps ensure Prisma works correctly during Vercel deployment.

---

## 🌎 Deployment

Dossier is deployed on Vercel.

Required production environment variables:

```txt
DATABASE_URL
JWT_SECRET
```

These should be added in:

```txt
Vercel Project Settings → Environment Variables
```

Do not include quotation marks around the values in Vercel.

---

## 📁 Current File Storage Note

For the MVP, uploaded resume files are stored as data URLs in the database. This works for demo purposes and small files, but a production-grade version should use external object storage.

Recommended future options:

- Vercel Blob
- UploadThing
- Supabase Storage
- Cloudflare R2
- AWS S3

The database should eventually store only the file URL or storage key.

---

## 🧪 Current MVP Status

Completed:

- Authentication
- Protected pages
- Application CRUD
- Resume upload/list/delete
- Resume view/download
- Resume-to-application linking
- Resume swapping
- Database-backed dashboard
- Database-backed analytics
- Vercel deployment

---

## 💡 Why Dossier?

Most job trackers only answer:

```txt
Where did I apply?
```

Dossier answers more useful questions:

```txt
Which resume did I submit?
Which applications reached interviews?
Which resume version is performing best?
What exactly was in the job description?
What changed over time?
```

That makes Dossier more than a tracker. It becomes a personal evidence system for the job search.

---

## 👨‍💻 Author

Built by **Ved Dabhi**  
Software Engineering student at **San José State University**

GitHub: [Ved4126](https://github.com/Ved4126)
