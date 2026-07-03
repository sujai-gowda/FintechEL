# MCA App — Project Description

**MCA App** is a secure escrow-based freelance marketplace built as a **Progressive Web Application (PWA)**. Clients post paid jobs, funds are held in escrow, and payment is released to freelancers only after work is approved.

| Item | Detail |
|------|--------|
| **Project name** | MCA App |
| **Type** | Full-stack web application (PWA) |
| **Institution** | R.V. College of Engineering (RVCE) — MCA |
| **Frontend** | React 19, Vite 8, Tailwind CSS 4 |
| **Backend** | Node.js, Express, JWT |
| **Database** | MongoDB Atlas |
| **Currency** | Indian Rupees (INR ₹) |

---

## Summary

MCA App addresses trust gaps in freelance payments by implementing a third-party **escrow model**. When a client posts a job, the budget is deducted from their wallet and locked in escrow. The freelancer receives payment only after the client approves submitted work. An admin role oversees wallets, disputes, and platform statistics.

The application is delivered as a **PWA**, installable on Android, iOS, and desktop without an app store. It uses a mobile-first UI with bottom navigation, offline app-shell caching, and an **Install App** button in the navbar.

---

## Key Features

- Role-based dashboards (Admin, Client, Freelancer)
- Digital wallets with 4-digit PIN protection
- Job marketplace — post, browse, apply, accept
- Escrow fund holding, submission, approval, and refund
- Per-job messaging between client and freelancer
- Dispute raising and admin resolution
- Full transaction history and audit trail
- PWA installability and offline fallback

---

## Escrow Flow (Brief)

```
Client posts job → Funds HELD in escrow → Freelancer applies → Client accepts
→ Freelancer submits work → Client approves with PIN → Funds RELEASED
```

---

## Documentation

Full project report and technical documentation is available in the **`report/`** folder:

| Document | Contents |
|----------|----------|
| [report/README.md](./report/README.md) | Report index |
| [report/01-introduction.md](./report/01-introduction.md) | Introduction and objectives |
| [report/02-problem-statement.md](./report/02-problem-statement.md) | Problem statement and scope |
| [report/03-system-architecture.md](./report/03-system-architecture.md) | Architecture and data flow |
| [report/04-modules-and-features.md](./report/04-modules-and-features.md) | Modules, roles, and pages |
| [report/05-escrow-workflow.md](./report/05-escrow-workflow.md) | End-to-end escrow workflow |
| [report/06-api-reference.md](./report/06-api-reference.md) | Complete API reference |
| [report/07-pwa-implementation.md](./report/07-pwa-implementation.md) | PWA design and installation |
| [report/08-technology-stack.md](./report/08-technology-stack.md) | Technologies used |
| [report/09-setup-and-deployment.md](./report/09-setup-and-deployment.md) | Setup, run, and deployment |
| [report/10-conclusion.md](./report/10-conclusion.md) | Conclusion and limitations |

Operational instructions: [README.md](./README.md)

Development checklist: [PROJECT_PROGRESS.md](./PROJECT_PROGRESS.md)
