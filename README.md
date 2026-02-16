# Home Queen – Smart Family & Home Services Platform

A production-ready super app for women and families to manage household tasks, budget, kids, shopping, and book home services.

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Radix UI, Framer Motion, Zustand
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM

## Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment

```bash
cp .env.example .env
```

Edit `.env` and set your `DATABASE_URL` (PostgreSQL connection string). For local development you can use [Supabase](https://supabase.com) free tier or run PostgreSQL locally.

### 3. Initialize database

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### 4. Run development server

```bash
pnpm dev
```

- **Frontend**: http://localhost:8080
- **API**: http://localhost:3001

### Test credentials

- Email: `wife@homequeen.com`
- Password: `password123`

## Project Structure

```
├── client/           # React SPA
│   ├── components/   # UI components
│   ├── pages/        # Route pages
│   ├── store/        # Zustand stores
│   └── lib/          # Utilities
├── server/           # Express API
│   ├── routes/       # API handlers
│   ├── middleware/   # Auth, etc.
│   └── lib/          # Prisma, utils
├── shared/           # Shared types
└── prisma/           # Schema & migrations
```

## API Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/register` | POST | Register |
| `/api/auth/login` | POST | Login |
| `/api/users/me` | GET | Current user |
| `/api/family` | GET/POST | Family |
| `/api/services` | GET | Services list |
| `/api/providers` | GET | Service providers |
| `/api/providers/:id` | GET | Provider detail |
| `/api/bookings` | GET/POST | Bookings |
| `/api/tasks` | GET/POST | Tasks |
| `/api/expenses` | GET/POST | Expenses |
| `/api/expenses/summary` | GET | Expense summary |
| `/api/notifications` | GET | Notifications |

## Scripts

- `pnpm dev` – Start dev server (Vite + Express)
- `pnpm build` – Build for production
- `pnpm start` – Start production server
- `pnpm db:generate` – Generate Prisma client
- `pnpm db:push` – Push schema to DB
- `pnpm db:seed` – Seed sample data
- `pnpm db:studio` – Open Prisma Studio

## Deployment

- **Frontend**: Vercel, Netlify (static build)
- **Backend**: Railway, Render (Node)
- **Database**: Supabase PostgreSQL

Set `NODE_ENV=production` and configure `DATABASE_URL` and `JWT_SECRET`.

## Features

- Authentication (email/password, JWT)
- Dashboard with tasks, expenses, notifications
- House management (tasks)
- Financial tracking (expenses, categories, charts)
- Home services marketplace (cleaning, plumbing, babysitter, etc.)
- Provider profiles with reviews
- Booking system
- Shopping, Kids, Community modules (placeholder for expansion)

---

Built with ❤️ for families across Egypt and the Middle East.
