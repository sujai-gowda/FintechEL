# MCA App — Secure Escrow Platform (PWA)

A full-stack fintech Progressive Web Application that holds client payments in escrow until freelance work is delivered and approved. Built with **React + Vite (PWA)**, **Express**, and **MongoDB Atlas**.

Install directly from Chrome — no app store required.

---

## Features

- **Installable PWA** — Add to Home Screen on Android and iOS; launches in standalone mode
- **Install App button** — Navbar button triggers the native install dialog when supported
- **Offline support** — Service worker caches the app shell; offline fallback page included
- **Role-based access** — Admin, Client, and Freelancer dashboards
- **Wallet system** — INR balances with 4-digit PIN protection
- **Job marketplace** — Post, browse, apply, and accept jobs
- **Escrow payments** — Budget locked in escrow when a job is posted; released on approval
- **Messaging** — Client–freelancer chat per job
- **Dispute handling** — Raise and resolve payment disputes (admin)
- **Transaction history** — Full audit trail of wallet and escrow activity
- **Mobile-first UI** — Bottom navigation on mobile, sidebar on desktop

---

## Tech Stack

| Layer    | Technology                                           |
|----------|------------------------------------------------------|
| Frontend | React 19, Vite 8, Tailwind CSS 4, React Router 7    |
| PWA      | vite-plugin-pwa, Service Worker, Web App Manifest   |
| Backend  | Node.js, Express, JWT Authentication                 |
| Database | MongoDB Atlas (Mongoose)                             |
| Currency | INR (₹)                                              |

---

## Project Structure

```
mca-app/
├── backend/                  # Express REST API (unchanged business logic)
│   ├── config/               # Database connection
│   ├── controllers/          # Business logic
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API route definitions
│   └── utils/                # Auth, escrow, transaction helpers
│
├── frontend/                 # React PWA (mobile-first)
│   ├── public/
│   │   ├── manifest.json     # Web App Manifest
│   │   ├── offline.html      # Offline fallback page
│   │   └── icons/            # App icons (192×192, 512×512, 180×180)
│   └── src/
│       ├── pages/            # Route pages
│       ├── components/
│       │   ├── InstallAppButton.jsx   # Navbar install button
│       │   └── InstallPrompt.jsx      # Bottom install banner
│       ├── context/
│       │   └── PWAInstallContext.jsx  # Shared install state
│       ├── services/
│       │   └── api.js        # Central API client (all requests)
│       └── constants/        # Roles, currency, landing copy
│
├── report/                   # Full project report documentation
│   ├── README.md             # Report index
│   ├── 01-introduction.md
│   ├── 02-problem-statement.md
│   ├── 03-system-architecture.md
│   ├── 04-modules-and-features.md
│   ├── 05-escrow-workflow.md
│   ├── 06-api-reference.md
│   ├── 07-pwa-implementation.md
│   ├── 08-technology-stack.md
│   ├── 09-setup-and-deployment.md
│   └── 10-conclusion.md
│
├── README.md
└── PROJECT_DESCRIPTION.md
```

---

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas cluster (free tier works)
- Chrome (recommended for PWA installation on desktop)
- Any modern mobile browser (Chrome on Android, Safari on iOS)

---

## Setup

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd mca-app

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure backend environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/mca-app?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### 3. Configure frontend environment

```bash
cp frontend/.env.example frontend/.env
```

Default (recommended for local development):

```env
VITE_API_BASE=/api
```

The Vite dev server proxies `/api` to `http://localhost:5000`, so the same config works on **desktop and mobile** when you open the Network URL.

For production, set the full API URL:

```env
VITE_API_BASE=https://your-api.example.com/api
```

---

## Running the Application

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

Server runs at `http://localhost:5000` (also bound to `0.0.0.0` for network access).

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Vite displays:

```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://<your-ip>:5173/
```

- **Desktop**: Open `http://localhost:5173`
- **Mobile (same Wi-Fi)**: Open the **Network URL** in Chrome

---

## API Configuration

All frontend requests flow through a single client:

```
React Component → api.js (apiFetch) → /api/* → Vite Proxy → Express → MongoDB
```

| Setting | Development | Production |
|---------|-------------|------------|
| `VITE_API_BASE` | `/api` (proxied) | Full URL to your API |
| Backend port | `5000` | Your deployment port |
| CORS | Handled via same-origin proxy in dev | Configure reverse proxy |

### Verify connection

```bash
# Backend health (direct)
curl http://localhost:5000/api/health

# Through Vite proxy (frontend must be running)
curl http://localhost:5173/api/health
```

Expected response:

```json
{ "status": "ok", "message": "Escrow Platform Backend Running", "database": "connected" }
```

---

## Installing the PWA

### Install App button (Chrome / Edge)

When install is available, an **Install App** button appears in the navbar. Click it to trigger the native install dialog.

### Android (Chrome)

1. Open the Network URL in Chrome
2. Tap **Install App** in the navbar, or Menu → **Install App**
3. The app opens from your home screen in standalone mode

### iPhone / iPad (Safari)

Safari does not support `beforeinstallprompt`. Use:

1. Open the Network URL in Safari
2. Tap **Share** → **Add to Home Screen**
3. Tap **Add**

### Desktop (Chrome)

1. Open `http://localhost:5173` in Chrome
2. Click **Install App** in the navbar, or the install icon (⊕) in the address bar

---

## Demo Accounts

| Role       | Email                   | Password              |
|------------|-------------------------|-----------------------|
| Admin      | admin@escrow.com        | Admin@FintechEL2026   |
| Client     | client@escrow.com       | client123             |
| Freelancer | freelancer@escrow.com   | freelancer123         |

Demo users are seeded automatically on first server start.

---

## Escrow Workflow

1. **Client** — Set wallet PIN, add money (or ask Admin to assign balance)
2. **Client** — Post a job with budget + PIN → funds locked in escrow
3. **Freelancer** — Browse jobs and apply
4. **Client** — Accept applicant in **My Jobs**
5. **Freelancer** — Submit work from **Escrow** page
6. **Client** — Approve with PIN → payment released to freelancer wallet

---

## API Overview

| Endpoint                    | Description                        |
|-----------------------------|------------------------------------|
| `GET  /api/health`          | Health check                       |
| `POST /api/auth/login`      | Login with email, password, role   |
| `POST /api/auth/register`   | Register new account               |
| `GET  /api/auth/me`         | Current user (JWT required)        |
| `GET  /api/wallets/me`      | Get current user wallet            |
| `POST /api/wallets/add-money` | Add money to wallet              |
| `POST /api/jobs`            | Post job (locks escrow)            |
| `POST /api/jobs/:id/apply`  | Freelancer applies                 |
| `POST /api/jobs/:id/accept` | Client accepts applicant           |
| `POST /api/escrow/submit`   | Freelancer submits work            |
| `POST /api/escrow/approve`  | Client releases payment            |
| `GET  /api/history/transactions/my` | Transaction history          |
| `GET  /api/messages/conversations` | Message threads               |
| `GET  /api/admin/stats`     | Admin platform statistics          |

Full API under `/api/*` — see `backend/routes/` for all endpoints.

---

## Build & Deployment

### Frontend production build

```bash
cd frontend
npm run build
npm run preview   # serves dist/ with API proxy on port 5173
```

Set `VITE_API_BASE` to your production API before building, or serve frontend and backend behind the same domain with a reverse proxy routing `/api` to Express.

### Backend production

```bash
cd backend
npm start
```

Ensure `MONGODB_URI`, `JWT_SECRET`, and `PORT` are set in the environment.

---

## Troubleshooting

### "Failed to fetch" / "Cannot reach the server"

1. **Start the backend** — `cd backend && npm run dev`
2. **Use `/api` in frontend `.env`** — do not hardcode `localhost:5000` or a stale IP
3. **Restart frontend** after changing `.env`
4. **Check health** — `curl http://localhost:5000/api/health`

### Mobile cannot connect

1. Phone and PC must be on the **same Wi-Fi**
2. Open the **Network URL** from Vite (not `localhost`)
3. Allow Node.js through Windows Firewall if prompted

### PWA install button not showing

- Use **Chrome** or **Edge** on desktop/Android
- iOS Safari requires manual **Add to Home Screen**
- Service worker must be registered (check DevTools → Application → Service Workers)
- App must meet installability criteria (manifest + icons + HTTPS in production)

### MongoDB connection failed

1. Verify `MONGODB_URI` in `backend/.env`
2. Whitelist your IP in MongoDB Atlas → Network Access
3. Check Atlas cluster is running

### Login works on desktop but not mobile (fixed)

Previously, some pages called `http://localhost:5000` directly while others used env config. All requests now go through `frontend/src/services/api.js` with Vite proxying `/api` to the backend.

---

## PWA Technical Details

| Feature              | Implementation                              |
|----------------------|---------------------------------------------|
| Service Worker       | vite-plugin-pwa (Workbox) in dev + prod     |
| Web App Manifest     | `public/manifest.json` + vite-plugin-pwa      |
| Install button       | `InstallAppButton.jsx` in navbar              |
| Install banner       | `InstallPrompt.jsx` — `beforeinstallprompt`   |
| Offline fallback     | `public/offline.html`                         |
| Auto update          | `registerSW({ registerType: 'autoUpdate' })`  |
| Safe area insets     | `env(safe-area-inset-*)` for iPhone notch     |
| Mobile navigation    | Bottom tab bar on mobile, sidebar on desktop  |

---

## License

Academic / educational project — RVCE MCA.

For a detailed overview of the problem, architecture, and user roles, see [PROJECT_DESCRIPTION.md](./PROJECT_DESCRIPTION.md) or the full report in [report/](./report/).
