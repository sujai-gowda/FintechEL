# FintechEL — Escrow Platform for Freelance Jobs

A full-stack fintech application that holds client payments in escrow until freelance work is delivered and approved. Built with **React**, **Express**, and **MongoDB Atlas**.

## Features

- **Role-based access** — Admin, Client, and Freelancer dashboards
- **Wallet system** — INR balances with 4-digit PIN protection
- **Job marketplace** — Post, browse, apply, and accept jobs
- **Escrow payments** — Budget locked in escrow when a job is posted; released to freelancer on approval
- **Messaging** — Client–freelancer chat per job
- **Dispute handling** — Raise and resolve payment disputes (admin)
- **Transaction history** — Full audit trail of wallet and escrow activity

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Backend  | Node.js, Express, JWT auth          |
| Database | MongoDB Atlas (Mongoose)            |
| Currency | INR (₹)                             |

## Project Structure

```
FintechEL/
├── backend/          # Express API, models, controllers, routes
│   ├── config/       # Database connection
│   ├── controllers/  # Business logic
│   ├── models/       # Mongoose schemas (User, Job, Wallet, Escrow, etc.)
│   ├── routes/       # API route definitions
│   └── utils/        # Helpers (auth, escrow, transactions)
├── frontend/         # React SPA
│   └── src/
│       ├── pages/          # Route pages
│       ├── components/     # Reusable UI components
│       ├── services/       # API client
│       └── constants/      # Roles, currency, landing copy
├── README.md
└── PROJECT_DESCRIPTION.md
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas cluster (free tier works)

## Setup

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd FintechEL

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure backend environment

Create `backend/.env` from the example:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/fintechel?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### 3. Run the application

**Terminal 1 — Backend**

```bash
cd backend
npm run dev
```

Server runs at `http://localhost:5000`

**Terminal 2 — Frontend**

```bash
cd frontend
npm run dev
```

App opens at `http://localhost:5173`

## Demo Accounts

| Role       | Email                   | Password        |
|------------|-------------------------|-----------------|
| Admin      | admin@escrow.com        | admin123        |
| Client     | client@escrow.com       | client123       |
| Freelancer | freelancer@escrow.com   | freelancer123   |

Demo users are seeded automatically on first server start.

## Escrow Workflow (Quick Guide)

1. **Client** — Set wallet PIN, add money (or ask Admin to assign balance)
2. **Client** — Post a job with budget + PIN → funds locked in escrow
3. **Freelancer** — Browse jobs and apply
4. **Client** — Accept applicant in **My Jobs**
5. **Freelancer** — Submit work from **Escrow** page
6. **Client** — Approve with PIN → payment released to freelancer wallet

## API Overview

| Endpoint              | Description                    |
|-----------------------|--------------------------------|
| `POST /api/auth/login` | Login with email, password, role |
| `POST /api/jobs`       | Post job (locks escrow)        |
| `POST /api/jobs/:id/apply` | Freelancer applies         |
| `POST /api/jobs/:id/accept` | Client accepts applicant  |
| `POST /api/escrow/submit` | Freelancer submits work     |
| `POST /api/escrow/approve` | Client releases payment    |
| `GET /api/wallets/me`  | Get current user wallet        |

Full API is under `/api/*` — see `backend/routes/` for all endpoints.

## Health Check

```bash
curl http://localhost:5000/api/health
```

## License

Academic / educational project — RVCE Fintech.

For a detailed overview of the problem, architecture, and user roles, see [PROJECT_DESCRIPTION.md](./PROJECT_DESCRIPTION.md).
