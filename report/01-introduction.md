# 1. Introduction

## 1.1 Project Title

**MCA App — Secure Escrow Platform (Progressive Web Application)**

## 1.2 Overview

MCA App is a full-stack fintech web application that enables secure payments between clients and freelancers using an **escrow-based payment model**. Instead of direct bank or UPI transfers, the platform holds client funds in a protected escrow account until the client explicitly approves completed work.

The project is built for the **Master of Computer Applications (MCA)** program at **R.V. College of Engineering (RVCE)**. It demonstrates real-world fintech concepts — digital wallets, escrow holding, conditional payment release, dispute resolution, and transaction auditing — in a controlled educational environment.

## 1.3 Objectives

1. Design and implement a **role-based freelance marketplace** with three user types: Admin, Client, and Freelancer.
2. Build a **wallet system** with PIN-protected financial operations in Indian Rupees (INR).
3. Implement a complete **escrow lifecycle** — fund, hold, submit, approve, refund, and dispute.
4. Deliver the application as a **Progressive Web Application (PWA)** that behaves like a native mobile app.
5. Ensure reliable **frontend–backend communication** through a centralized API client and JWT authentication.
6. Provide **mobile-first responsive design** for Android, iPhone, tablet, and desktop.

## 1.4 Deliverables

| Deliverable | Location |
|-------------|----------|
| React PWA frontend | `frontend/` |
| Express REST API backend | `backend/` |
| MongoDB Atlas database integration | `backend/config/db.js` |
| Project report | `report/` (this folder) |
| Setup and run guide | `README.md` |
| Project summary | `PROJECT_DESCRIPTION.md` |

## 1.5 Target Users

- **Clients** — individuals or businesses posting paid freelance jobs
- **Freelancers** — professionals seeking and completing paid work
- **Admins** — platform operators managing users, wallets, and disputes
