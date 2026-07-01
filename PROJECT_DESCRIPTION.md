# FintechEL — Project Description

## What Is This Project?

**FintechEL** is a secure escrow-based freelance marketplace. It lets clients post paid jobs, holds the payment in a protected escrow account, and releases funds to the freelancer only after the client approves the completed work.

The platform reduces payment risk for both sides:

- **Clients** do not pay freelancers upfront without protection.
- **Freelancers** know the money is already reserved before they start work.

All payments use **Indian Rupees (INR ₹)** and are tracked through wallets, escrow records, and transaction logs.

---

## Problem Statement

In freelance work, trust is a major issue:

- Clients worry freelancers will take payment and not deliver.
- Freelancers worry clients will refuse to pay after work is done.

Traditional direct transfers (UPI, bank transfer) offer no built-in dispute or hold mechanism. **FintechEL** solves this with an escrow model — similar to platforms like PayPal Escrow or Upwork's payment protection — implemented as a learning/demonstration fintech system.

---

## Core Concept: Escrow

**Escrow** means a third party (the platform) holds money until conditions are met.

```
Client Wallet  →  Escrow Account (HELD)  →  Freelancer Wallet (RELEASED)
     │                    │                           │
  Deduct on           Money locked              Paid on client
  job post            until work done           approval
```

### Escrow States

| Status     | Meaning                                              |
|------------|------------------------------------------------------|
| `HELD`     | Money locked; freelancer can work / submit           |
| `SUBMITTED`| Freelancer marked work as complete; awaiting client  |
| `RELEASED` | Client approved; funds sent to freelancer wallet     |
| `REFUNDED` | Job cancelled; funds returned to client              |
| `DISPUTED` | Conflict raised; admin resolves who receives funds   |

---

## User Roles

### 1. Client

Clients are job posters and payers.

**Can do:**
- Create a wallet and set a 4-digit PIN
- Add money to wallet (simulated top-up)
- Post jobs with a budget — **funds are locked in escrow immediately**
- Review applicants and accept a freelancer
- Message freelancers
- Approve completed work and release payment
- Raise disputes if needed
- View escrow status and transaction history

### 2. Freelancer

Freelancers find and complete work.

**Can do:**
- Browse open jobs on the marketplace
- Apply to jobs and track applications
- Save jobs to a wishlist
- Message clients
- Submit work when assigned and escrow is funded
- Receive payment into wallet after client approval
- Raise disputes if needed

### 3. Admin

Admins oversee the platform.

**Can do:**
- View platform statistics (users, wallets, jobs, escrow volume)
- Manage clients and freelancers (assign balance, freeze accounts)
- View all escrow transactions
- Resolve disputes and route funds to the correct party
- Monitor full transaction history

---

## End-to-End Workflow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│ Client posts│     │ Freelancer   │     │ Freelancer  │     │ Client       │
│ job + PIN   │ ──► │ applies      │ ──► │ submits     │ ──► │ approves     │
│ (escrow HELD)│     │ Client accepts│     │ work        │     │ (RELEASED)   │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────────┘
```

**Step-by-step:**

1. Client sets up wallet PIN and ensures sufficient balance.
2. Client posts a job with title, description, budget, and deadline.
3. On post, the budget is deducted from the client wallet and held in escrow (`HELD`).
4. Freelancers see the job on the marketplace and apply.
5. Client reviews applicants and accepts one — escrow is linked to that freelancer.
6. Freelancer completes the work and clicks **Submit Work** on the Escrow page.
7. Client reviews and clicks **Approve & Pay** with wallet PIN.
8. Escrow amount is credited to the freelancer wallet; job status becomes `COMPLETED`.

If a job is deleted before a freelancer is assigned, escrow funds are **refunded** to the client wallet.

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                     │
│  Landing │ Auth │ Dashboards │ Jobs │ Escrow │ Messages     │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (JWT)
┌──────────────────────────▼──────────────────────────────────┐
│                   Express Backend (Node.js)                  │
│  Auth │ Jobs │ Wallets │ Escrow │ Messages │ Admin │ Disputes│
└──────────────────────────┬──────────────────────────────────┘
                           │ Mongoose ODM
┌──────────────────────────▼──────────────────────────────────┐
│                     MongoDB Atlas                            │
│  Users │ Wallets │ Jobs │ Escrows │ Transactions │ Messages  │
└─────────────────────────────────────────────────────────────┘
```

### Key Backend Modules

| Module        | Purpose                                      |
|---------------|----------------------------------------------|
| `User`        | Accounts with role (Admin / Client / Freelancer) |
| `Wallet`      | INR balance + hashed PIN per user            |
| `Job`         | Job postings, applicants, assigned freelancer |
| `Escrow`      | Held payment linked to a job                 |
| `Transaction` | Audit log of every fund movement             |
| `Message`     | Job-scoped chat between client and freelancer |

### Security Features

- JWT-based authentication with role validation at login
- Protected API routes via middleware
- Wallet PIN required for posting jobs, funding escrow, and releasing payments
- Bcrypt-hashed PIN storage
- Role-based frontend route guards

---

## Frontend Pages

| Page               | Role(s)           | Purpose                          |
|--------------------|-------------------|----------------------------------|
| Home               | Public            | Landing / marketing page         |
| Login / Register   | Public            | Authentication                   |
| Client Dashboard   | Client            | Overview, wallet, quick actions  |
| Freelancer Dashboard | Freelancer      | Overview, applications summary   |
| Post Job           | Client            | Create job + lock escrow         |
| My Jobs            | Client            | Manage applicants & escrow       |
| Find Jobs          | Freelancer        | Marketplace & wishlist           |
| My Applications    | Freelancer        | Applied / accepted jobs          |
| Escrow             | Client, Freelancer| Submit work / approve payment    |
| Messages           | Client, Freelancer| Per-job messaging                |
| Transaction History| Client, Freelancer| Payment audit trail              |
| Admin Dashboard    | Admin             | Platform management              |

---

## Fintech Concepts Demonstrated

This project is designed as a **fintech engineering lab** and covers:

1. **Digital wallets** — User balances with PIN-protected operations
2. **Escrow holding** — Segregated funds between payer and payee
3. **Payment release** — Conditional disbursement on approval
4. **Refund flow** — Return held funds on cancellation
5. **Dispute resolution** — Admin-mediated fund routing
6. **Transaction ledger** — Immutable-style activity log
7. **Role-based financial access** — Different permissions per user type
8. **Multi-currency ready structure** — Currently INR, extensible to others

---

## Scope & Limitations

This is an **educational / demonstration** project, not a production payment system:

- Wallet top-ups are simulated (no real UPI/bank integration)
- No KYC, regulatory compliance, or real banking APIs
- Escrow is platform-managed in MongoDB, not a licensed escrow institution
- Suitable for coursework, demos, and learning fintech architecture patterns

---

## Team / Context

**FintechEL** — Fintech Engineering Lab project at **RVCE** (R.V. College of Engineering).

The name combines **Fintech** (financial technology) and **EL** (Engineering Lab), reflecting the goal of building and understanding real-world fintech workflows in a controlled learning environment.

---

## Related Files

- [README.md](./README.md) — Setup, run instructions, and demo credentials
- [PROJECT_PROGRESS.md](./PROJECT_PROGRESS.md) — Development phase checklist
