# 3. System Architecture

## 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              React PWA Frontend (Vite + Service Worker)      │
│  Landing │ Auth │ Dashboards │ Jobs │ Escrow │ Messages     │
│  Install App │ Offline shell │ Mobile bottom navigation      │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (JWT Bearer token)
                           │ VITE_API_BASE=/api → Vite proxy (dev)
┌──────────────────────────▼──────────────────────────────────┐
│                   Express Backend (Node.js)                  │
│  Auth │ Jobs │ Wallets │ Escrow │ Messages │ Admin │ Disputes│
│  Middleware: CORS, JSON parser, JWT protect, role guards       │
└──────────────────────────┬──────────────────────────────────┘
                           │ Mongoose ODM
┌──────────────────────────▼──────────────────────────────────┐
│                     MongoDB Atlas                            │
│  Users │ Wallets │ Jobs │ Escrows │ Transactions │ Messages  │
└─────────────────────────────────────────────────────────────┘
```

## 3.2 Request Flow

Every API call follows this path:

```
React Component
      ↓
api.js (apiFetch / apiPost)
      ↓
/api/*  (Vite proxy in dev → localhost:5000)
      ↓
Express Route (routes/*.js)
      ↓
Controller (controllers/*.js)
      ↓
Mongoose Model → MongoDB Atlas
      ↓
JSON Response → React UI
```

## 3.3 Project Folder Structure

```
mca-app/
├── backend/
│   ├── config/db.js           # MongoDB connection
│   ├── controllers/           # Business logic
│   ├── middleware/            # JWT auth, role guards
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API route definitions
│   ├── utils/                 # Auth, escrow, seed helpers
│   └── server.js              # Express entry point
│
├── frontend/
│   ├── public/
│   │   ├── manifest.json      # PWA manifest
│   │   ├── offline.html       # Offline fallback
│   │   └── icons/             # App icons
│   └── src/
│       ├── pages/             # Route pages
│       ├── components/        # UI components
│       ├── context/           # Auth + PWA install context
│       ├── services/api.js    # Central API client
│       └── constants/         # Roles, nav, currency
│
├── report/                    # Project report (this folder)
├── README.md
└── PROJECT_DESCRIPTION.md
```

## 3.4 Database Models

| Model | Purpose |
|-------|---------|
| `User` | Account with role (Admin / Client / Freelancer) and status |
| `Wallet` | INR balance and bcrypt-hashed 4-digit PIN per user |
| `Job` | Job postings, applicants list, assigned freelancer |
| `Escrow` | Held payment amount linked to a job |
| `Transaction` | Audit log of every fund movement |
| `Message` | Job-scoped chat between client and freelancer |
| `Wishlist` | Freelancer saved jobs |

## 3.5 Security Architecture

| Layer | Mechanism |
|-------|-----------|
| Authentication | JWT issued on login; stored in localStorage |
| Authorization | `protect` middleware validates token on every protected route |
| Role enforcement | `adminOnly` middleware; frontend `ProtectedRoute` guards |
| Wallet operations | 4-digit PIN required for job post, escrow fund, and payment release |
| PIN storage | Bcrypt hash — never stored in plain text |
