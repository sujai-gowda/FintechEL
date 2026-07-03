# 4. Modules and Features

## 4.1 User Roles

### Admin

| Capability | Description |
|------------|-------------|
| Platform statistics | View total clients, freelancers, balance, jobs, messages |
| User management | List all users; freeze or unfreeze accounts |
| Wallet management | View all wallets; assign INR balance to users |
| Escrow oversight | View all escrow transactions |
| Dispute resolution | Resolve disputes and route funds |
| Transaction monitoring | View full platform transaction history |

### Client

| Capability | Description |
|------------|-------------|
| Wallet setup | Set 4-digit PIN; add simulated funds |
| Post jobs | Create jobs with budget — escrow locked on post |
| Manage applicants | Review and accept freelancers in My Jobs |
| Approve work | Release escrow payment with PIN |
| Messaging | Chat with assigned freelancer per job |
| Disputes | Raise disputes on problematic jobs |
| History | View personal transaction log |

### Freelancer

| Capability | Description |
|------------|-------------|
| Browse jobs | Marketplace with open job listings |
| Apply | Submit application to jobs |
| Wishlist | Save jobs for later |
| Submit work | Mark escrow work as complete |
| Receive payment | Funds credited to wallet on client approval |
| Messaging | Chat with client per job |
| History | View personal transaction log |

## 4.2 Backend Modules

| Module | Routes | Key Operations |
|--------|--------|----------------|
| Authentication | `/api/auth` | Login, register, get current user |
| Wallets | `/api/wallets` | Get balance, setup PIN, add money, admin assign |
| Jobs | `/api/jobs` | CRUD, apply, accept, wishlist |
| Escrow | `/api/escrow` | Fund, submit, approve, list |
| Disputes | `/api/dispute` | Raise, resolve, cancel job |
| Messages | `/api/messages` | Send, list conversations, get thread |
| History | `/api/history` | Personal and admin transaction logs |
| Users | `/api/users` | Admin user list, freeze account |
| Admin | `/api/admin` | Platform statistics |

## 4.3 Frontend Pages

| Page | Route | Role(s) | Purpose |
|------|-------|---------|---------|
| Home | `/` | Public | Landing and marketing |
| Login | `/login` | Public | Authentication |
| Register | `/register` | Public | New account creation |
| Dashboard | `/dashboard` | Client, Freelancer | Role-specific overview |
| Post Job | `/jobs/create` | Client | Create job + lock escrow |
| My Jobs | `/jobs/my` | Client | Manage applicants |
| Find Jobs | `/jobs` | Freelancer | Marketplace and wishlist |
| My Applications | `/jobs/applied` | Freelancer | Applied jobs |
| Escrow | `/escrow` | Client, Freelancer | Submit / approve work |
| Messages | `/messages` | Client, Freelancer | Per-job chat |
| History | `/history` | Client, Freelancer | Transaction audit trail |
| Admin Dashboard | `/admin` | Admin | Platform control centre |

## 4.4 UI Design

- **Mobile:** Bottom tab navigation (max 5 items), wallet balance strip, safe-area insets for iPhone notch
- **Desktop:** Sticky sidebar navigation, wider tables and stat cards
- **Shared:** Sticky top header with MCA App branding, role badge, Install App button, and logout

## 4.5 Fintech Concepts Demonstrated

1. Digital wallets with PIN-protected operations
2. Escrow fund segregation between payer and payee
3. Conditional payment release on approval
4. Refund on job cancellation
5. Admin-mediated dispute resolution
6. Immutable-style transaction ledger
7. Role-based financial access control
