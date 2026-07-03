# 6. API Reference

Base URL (development): `/api` (proxied to `http://localhost:5000/api`)

Authentication: `Authorization: Bearer <JWT token>` on protected routes.

---

## 6.1 Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Server and database status |

**Response:**
```json
{ "status": "ok", "message": "Escrow Platform Backend Running", "database": "connected" }
```

---

## 6.2 Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Login with email, password, role |
| POST | `/api/auth/register` | No | Register new account |
| GET | `/api/auth/me` | Yes | Get current user profile |

---

## 6.3 Wallets

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/wallets/me` | Yes | Any | Get current user wallet |
| POST | `/api/wallets/setup-pin` | Yes | Any | Set 4-digit wallet PIN |
| POST | `/api/wallets/add-money` | Yes | Any | Simulated wallet top-up |
| GET | `/api/wallets` | Yes | Admin | List all wallets |
| POST | `/api/wallets/assign` | Yes | Admin | Assign balance to user |

---

## 6.4 Jobs

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/jobs` | Yes | Any | Browse open jobs |
| POST | `/api/jobs` | Yes | Client | Create job (locks escrow) |
| GET | `/api/jobs/myjobs` | Yes | Client | Client's posted jobs |
| GET | `/api/jobs/applied` | Yes | Freelancer | Freelancer's applications |
| PUT | `/api/jobs/:id` | Yes | Client | Update job |
| DELETE | `/api/jobs/:id` | Yes | Client | Delete job (refunds escrow) |
| POST | `/api/jobs/:id/apply` | Yes | Freelancer | Apply to job |
| POST | `/api/jobs/:id/accept` | Yes | Client | Accept applicant |
| GET | `/api/jobs/wishlist` | Yes | Freelancer | Get wishlist |
| POST | `/api/jobs/wishlist` | Yes | Freelancer | Toggle wishlist item |

---

## 6.5 Escrow

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/escrow/fund` | Yes | Client | Fund escrow for a job |
| POST | `/api/escrow/submit` | Yes | Freelancer | Submit completed work |
| POST | `/api/escrow/approve` | Yes | Client | Approve and release payment |
| GET | `/api/escrow/my` | Yes | Client/Freelancer | User's escrow records |
| GET | `/api/escrow` | Yes | Admin | All escrow records |

---

## 6.6 Disputes

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/dispute/raise` | Yes | Client/Freelancer | Raise a dispute |
| POST | `/api/dispute/resolve` | Yes | Admin | Resolve dispute |
| POST | `/api/dispute/cancel` | Yes | Client | Cancel job and refund |

---

## 6.7 Messages

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/messages/conversations` | Yes | List all conversation threads |
| POST | `/api/messages/send` | Yes | Send a message |
| GET | `/api/messages/:jobId/:userId` | Yes | Get messages in a thread |

---

## 6.8 History

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/history/transactions/my` | Yes | Any | Personal transaction history |
| GET | `/api/history/transactions/all` | Yes | Admin | All platform transactions |
| GET | `/api/history/notifications/my` | Yes | Any | User notifications |

---

## 6.9 Users & Admin

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/users` | Yes | Admin | List all users |
| PUT | `/api/users/:id/freeze` | Yes | Admin | Freeze or unfreeze user |
| GET | `/api/admin/stats` | Yes | Admin | Platform statistics |

---

## 6.10 Frontend API Client

All frontend calls use `frontend/src/services/api.js`:

```javascript
// Authenticated request
const data = await apiFetch('/wallets/me', token);

// Public POST (login/register)
const data = await apiPost('/auth/login', { email, password, role });
```

Environment variable: `VITE_API_BASE=/api` (development, proxied by Vite).
