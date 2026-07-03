# 2. Problem Statement

## 2.1 The Trust Problem in Freelance Payments

Freelance work involves two parties who often do not know each other personally:

- **Clients** fear paying upfront and receiving poor or no deliverables.
- **Freelancers** fear completing work and being denied payment.

Direct payment methods (UPI, bank transfer, cash) transfer funds immediately with no built-in protection, hold mechanism, or neutral dispute resolution.

## 2.2 Proposed Solution

MCA App introduces a **platform-managed escrow model**:

1. The client deposits funds into a platform wallet.
2. When a job is posted, the budget is **locked in escrow** — not sent to the freelancer yet.
3. The freelancer completes and submits work.
4. The client reviews and **approves** — only then are funds released to the freelancer.
5. If a dispute arises, an **admin** mediates and routes funds appropriately.

This mirrors payment protection models used by platforms such as Upwork and PayPal Escrow, adapted for academic demonstration.

## 2.3 Why a Progressive Web Application?

Traditional web apps require opening a browser every time. A PWA allows users to:

- **Install** the app on their home screen (Android, iOS, desktop)
- Launch in **standalone mode** without browser chrome
- Access a **cached app shell** when offline
- Use a **mobile-optimized interface** with bottom navigation

No separate native app (React Native / Expo) is required — one React codebase serves all devices.

## 2.4 Scope

### In Scope

- User registration and JWT-based login with role validation
- Wallet creation, PIN setup, balance top-up (simulated), and admin balance assignment
- Job posting, browsing, applying, accepting, updating, and deleting
- Escrow funding, work submission, approval, cancellation, and refund
- Dispute raising and admin resolution
- Per-job messaging
- Transaction history and admin statistics
- PWA installability, service worker, and offline fallback

### Out of Scope

- Real UPI, bank, or payment gateway integration
- KYC, AML, or regulatory compliance
- Licensed escrow institution status
- Production-grade security audits

## 2.5 Assumptions

- Users have access to a modern web browser and internet connection for API calls
- MongoDB Atlas cluster is configured and reachable
- Wallet top-ups are simulated for demonstration purposes
