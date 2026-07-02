# Dossier

Dossier is a job application tracker for students and job-seekers. It helps users manage every job application as a case file and keeps each application linked to the exact resume version submitted for that role.

The main problem Dossier solves is simple: when an interview comes in, applicants often cannot remember which tailored resume they sent. Dossier keeps that paper trail clear.

## Project Concept

Every job application is treated as a **case**.

Each case stores:

- Company name
- Role/title
- Job description
- Application status
- Applied date
- Last updated date
- The exact resume version submitted

The signature feature of Dossier is the connection between one application and one resume version. Before an interview, the user can quickly open the case and see exactly which resume they sent.

## Design Theme

Dossier uses a detective case-file and corkboard-inspired interface.

The visual direction includes:

- Corkboard-style dashboard
- Pinned case cards
- Case-file layouts
- Cream paper surfaces
- Red accent details
- Typewriter-style headings
- Resume-as-evidence concept

The goal is to make the app feel memorable and focused without becoming a gimmick. It is still a professional job-search tool.

## Tech Stack

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Lucide React icons

### Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL on Neon

### Authentication

Currently implemented:

- Signup API
- Login API
- Password hashing with bcrypt

Planned:

- Session cookie
- Protected routes
- Logout route
- Current user helper

### Database

- PostgreSQL hosted on Neon
- Prisma for schema, migrations, and database access

### Planned File Storage

Resume files will eventually be stored using:

- Cloudflare R2 or AWS S3

The database will store only file metadata such as:

- File name
- File URL
- Storage key
- MIME type
- File size

The actual resume files will not be stored directly in PostgreSQL.

## Current Features

Implemented so far:

- Next.js project setup
- Dossier-themed frontend UI
- Landing page
- Auth page UI
- Dashboard UI
- New case UI
- Resume library UI
- Analytics UI
- Settings UI
- Neon PostgreSQL database connection
- Prisma schema and migration
- User table
- ResumeVersion table
- Application table
- Signup API route
- Login API route
- Password hashing with bcrypt
- Basic credential validation with Zod

## Planned Features

Next features to build:

- Session cookie after login
- Current user helper
- Logout route
- Connect auth UI to backend signup/login APIs
- Protect dashboard and app routes
- Application CRUD using PostgreSQL
- Resume library CRUD using PostgreSQL
- Resume file upload using Cloudflare R2 or S3
- Link applications to exact resume versions
- Status-based filtering from database
- Resume performance analytics

## Database Models

The main database models are:

### User

Stores account information.

Fields include:

- id
- name
- email
- passwordHash
- createdAt
- updatedAt

### ResumeVersion

Stores resume metadata for a user.

Fields include:

- id
- userId
- label
- fileName
- fileUrl
- storageKey
- mimeType
- fileSize
- uploadedAt

### Application

Stores job application case details.

Fields include:

- id
- userId
- company
- role
- jobDescription
- status
- appliedDate
- resumeVersionId
- createdAt
- updatedAt

## Application Statuses

Applications can have one of these statuses:

- Applied
- Online Assessment
- Interview
- Rejected
- Offer

In Prisma, these are stored as:

- APPLIED
- OA
- INTERVIEW
- REJECTED
- OFFER

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Ved4126/dossier.git
cd dossier
