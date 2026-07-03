# 9. Setup and Deployment

## 9.1 Prerequisites

- Node.js 18 or higher
- npm
- MongoDB Atlas account (free tier)
- Modern browser (Chrome recommended for PWA)

## 9.2 Installation

```bash
git clone <repository-url>
cd mca-app

cd backend && npm install
cd ../frontend && npm install
```

## 9.3 Backend Configuration

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

**MongoDB Atlas setup:**
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Add your IP to Network Access (or `0.0.0.0/0` for development)
4. Copy the connection string into `MONGODB_URI`

## 9.4 Frontend Configuration

```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_BASE=/api
```

The Vite dev server proxies `/api` to `http://localhost:5000`.

## 9.5 Running Locally

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Expected output: `Server running on http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` (or the Network URL for mobile testing).

## 9.6 Verify Connection

```bash
curl http://localhost:5000/api/health
curl http://localhost:5173/api/health
```

## 9.7 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@escrow.com | Admin@FintechEL2026 |
| Client | client@escrow.com | client123 |
| Freelancer | freelancer@escrow.com | freelancer123 |

## 9.8 Production Build

**Frontend:**
```bash
cd frontend
npm run build        # outputs to dist/
npm run preview      # test production build locally
```

Set `VITE_API_BASE` to your production API URL before building.

**Backend:**
```bash
cd backend
npm start
```

## 9.9 Deployment Options

| Approach | Description |
|----------|-------------|
| Same domain | Reverse proxy routes `/` to frontend and `/api` to Express |
| Separate hosts | Set `VITE_API_BASE=https://api.example.com/api`; enable CORS on backend |
| Frontend static | Deploy `dist/` to Netlify, Vercel, or Nginx |
| Backend | Deploy to Railway, Render, or VPS with Node.js |

**PWA note:** HTTPS is required for service worker and install in production.

## 9.10 Common Issues

| Issue | Solution |
|-------|----------|
| `EADDRINUSE` port 5000 | Kill existing node process: `netstat -ano \| findstr :5000` then `Stop-Process -Id <PID> -Force` |
| Failed to fetch | Ensure backend is running; use `VITE_API_BASE=/api` |
| MongoDB connection failed | Check URI, Atlas IP whitelist, cluster status |
| PWA install not showing | Use Chrome; check DevTools → Application → Service Workers |
