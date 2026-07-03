# 5. Escrow Workflow

## 5.1 Escrow Concept

**Escrow** is a financial arrangement where a third party (the platform) holds funds until predefined conditions are met. In MCA App, the condition for release is **client approval of submitted work**.

```
Client Wallet  →  Escrow (HELD)  →  Freelancer Wallet (RELEASED)
     │                  │                      │
  Deduct on         Locked until          Paid on client
  job post          work approved         approval + PIN
```

## 5.2 Escrow States

| Status | Meaning | Who Can Act |
|--------|---------|-------------|
| `HELD` | Funds locked; work in progress | Freelancer can submit work |
| `SUBMITTED` | Work marked complete; awaiting review | Client can approve |
| `RELEASED` | Client approved; funds sent to freelancer | None — complete |
| `REFUNDED` | Job cancelled; funds returned to client | None — complete |
| `DISPUTED` | Conflict raised | Admin resolves |

## 5.3 End-to-End Workflow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│ Client posts│     │ Freelancer   │     │ Freelancer  │     │ Client       │
│ job + PIN   │ ──► │ applies      │ ──► │ submits     │ ──► │ approves     │
│ (HELD)      │     │ Client accepts│     │ work        │     │ (RELEASED)   │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────────┘
```

### Step-by-Step

1. **Client** sets wallet PIN and ensures sufficient INR balance.
2. **Client** posts a job (title, description, budget, deadline) with PIN confirmation.
3. Budget is **deducted** from client wallet and held in escrow (`HELD`).
4. **Freelancer** browses marketplace and applies to the job.
5. **Client** reviews applicants in My Jobs and accepts one freelancer.
6. **Freelancer** completes work and clicks **Submit Work** on the Escrow page (`SUBMITTED`).
7. **Client** reviews deliverables and clicks **Approve & Pay** with wallet PIN.
8. Escrow amount is **credited** to freelancer wallet; job status becomes `COMPLETED` (`RELEASED`).

## 5.4 Alternative Flows

### Job Cancellation (Before Assignment)

- Client deletes job → escrow funds **refunded** to client wallet (`REFUNDED`)

### Dispute

- Either party raises a dispute → status becomes `DISPUTED`
- Admin reviews and resolves → funds routed to client or freelancer

### Admin Balance Assignment

- Admin assigns INR to client wallet via Admin Dashboard
- Client can then post jobs without simulated top-up

## 5.5 Transaction Logging

Every fund movement creates a `Transaction` record:

- Wallet debit on job post
- Escrow hold
- Escrow release to freelancer
- Refund to client
- Admin balance assignment

All records are visible in the Transaction History page.
