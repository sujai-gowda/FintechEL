# 8. Technology Stack

## 8.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI component library |
| Vite | 8 | Build tool and dev server |
| React Router | 7 | Client-side routing |
| Tailwind CSS | 4 | Utility-first styling |
| lucide-react | 1.x | Icon library |
| vite-plugin-pwa | 1.x | Service worker and manifest generation |

### Key Frontend Files

| File | Purpose |
|------|---------|
| `src/services/api.js` | Central API client — all HTTP requests |
| `src/context/AuthContext.jsx` | JWT token and user state |
| `src/context/PWAInstallContext.jsx` | PWA install prompt state |
| `src/components/ProtectedRoute.jsx` | Role-based route guards |
| `src/components/dashboard/DashboardLayout.jsx` | Shared layout with nav and header |
| `vite.config.js` | Vite config, PWA plugin, `/api` proxy |

## 8.2 Backend

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express | HTTP server and routing |
| jsonwebtoken | JWT authentication |
| bcryptjs | Password and PIN hashing |
| cors | Cross-origin resource sharing |
| dotenv | Environment variable loading |
| nodemon | Development auto-restart |

### Key Backend Files

| File | Purpose |
|------|---------|
| `server.js` | Express app entry point |
| `config/db.js` | MongoDB Atlas connection |
| `middleware/authMiddleware.js` | JWT verify, adminOnly guard |
| `controllers/*.js` | Business logic per module |
| `routes/*.js` | Route definitions |
| `models/*.js` | Mongoose schemas |
| `utils/seedUsers.js` | Demo user seeding on startup |

## 8.3 Database

| Technology | Purpose |
|------------|---------|
| MongoDB Atlas | Cloud-hosted document database |
| Mongoose | ODM for schema validation and queries |

### Collections

Users, Wallets, Jobs, Escrows, Transactions, Messages, Wishlists

## 8.4 Development Tools

| Tool | Purpose |
|------|---------|
| npm | Package management |
| oxlint | Frontend linting |
| PostCSS + Autoprefixer | CSS processing |

## 8.5 Communication Pattern

| Aspect | Implementation |
|--------|----------------|
| Protocol | HTTP REST |
| Data format | JSON |
| Auth header | `Authorization: Bearer <token>` |
| Dev proxy | Vite proxies `/api` → `localhost:5000` |
| Env config | `VITE_API_BASE` (frontend), `MONGODB_URI` + `JWT_SECRET` (backend) |
