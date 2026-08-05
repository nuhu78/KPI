# Architecture

## Overview
The KPI Management System is a full‑stack web application built with a **React (Vite)** frontend and a **NestJS** backend, backed by a **PostgreSQL** database. The application is deployed on **Render** and serves three main interfaces:
- **Public Dashboard** – accessible without authentication.
- **Admin Dashboard** – for managing sections, employees, KPI periods, and tasks.
- **Employee Dashboard** – for viewing assigned tasks, submitting completed file numbers, and viewing personal rankings.

## Technology Stack

| Layer          | Technology                                      |
|----------------|-------------------------------------------------|
| **Frontend**   | React 18, Vite, TypeScript, Tailwind CSS, React Query, React Hook Form, Recharts |
| **Backend**    | NestJS, TypeScript, Prisma (ORM), PostgreSQL, JWT, class-validator |
| **Database**   | PostgreSQL (hosted on Render)                   |
| **Deployment** | Render (Web Service for backend, Static Site for frontend) |

## High‑Level Architecture
┌─────────────────────┐
│ Browser │
│ (React / Vite) │
└────────┬────────────┘
│ HTTP / HTTPS
┌────────▼────────────┐
│ NestJS Backend │
│ (API Gateway + │
│ Business Logic) │
└────────┬────────────┘
│ Prisma ORM
┌────────▼────────────┐
│ PostgreSQL │
│ (Render Managed) │
└─────────────────────┘

text

## Backend Structure (NestJS)
src/
├── main.ts
├── app.module.ts
├── common/
│ ├── guards/ (JWT auth, roles)
│ ├── interceptors/ (logging, transform)
│ ├── filters/ (global exception filter)
│ └── decorators/ (custom decorators)
├── modules/
│ ├── auth/ (login, registration, JWT)
│ ├── users/ (employee & admin management)
│ ├── sections/ (CRUD sections)
│ ├── kpi-periods/ (CRUD KPI periods)
│ ├── tasks/ (CRUD tasks, assignment)
│ ├── submissions/ (handle completed file numbers)
│ ├── rankings/ (compute employee & section rankings)
│ └── dashboard/ (admin/employee dashboard data)
└── config/ (environment variables, database config)

text

## Frontend Structure (React + Vite)
src/
├── main.tsx
├── App.tsx
├── components/
│ ├── common/ (Button, Card, Table, Modal, etc.)
│ ├── auth/ (Login, Register)
│ ├── admin/ (Sections, Employees, KPIPeriods, Tasks)
│ ├── employee/ (TaskList, SubmissionForm, Profile)
│ ├── public/ (PublicDashboard, Ranking tables)
│ └── layout/ (Navbar, Sidebar)
├── hooks/ (useAuth, useRankings, custom hooks)
├── services/ (API client, endpoints)
├── contexts/ (AuthContext, ThemeContext)
├── utils/ (helpers, validators)
├── types/ (TypeScript interfaces)
└── styles/ (Tailwind overrides)

text

## API Design (RESTful)
All endpoints are prefixed with `/api/v1`.

| Resource        | Endpoints (examples)                                      |
|-----------------|-----------------------------------------------------------|
| Auth            | `POST /auth/login`, `POST /auth/register`                |
| Users           | `GET /users`, `POST /users`, `PATCH /users/:id`, `DELETE /users/:id` |
| Sections        | `GET /sections`, `POST /sections`, `PATCH /sections/:id`, `DELETE /sections/:id` |
| KPI Periods     | `GET /kpi-periods`, `POST /kpi-periods`, `PATCH /kpi-periods/:id`, `DELETE /kpi-periods/:id` |
| Tasks           | `GET /tasks`, `POST /tasks`, `PATCH /tasks/:id`, `DELETE /tasks/:id` |
| Submissions     | `POST /submissions`, `PATCH /submissions/:taskId`        |
| Rankings        | `GET /rankings/employees`, `GET /rankings/sections`, `GET /rankings/sections/:sectionId/employees` |
| Dashboard       | `GET /dashboard/admin`, `GET /dashboard/employee`        |

## State Management
- **Server state** – React Query (caching, refetching, mutations).
- **Client state** – React Context for authentication, theme, and global UI.

## Deployment on Render
- **Backend**: Web Service – build command `npm run build`, start command `npm run start:prod`, environment variables set via Render dashboard.
- **Frontend**: Static Site – build output `dist`, publish directory `dist`.
- **Database**: Render PostgreSQL – securely connected via internal network (or public with SSL).

## Environment Variables (`.env`)
Backend
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
PORT=3000
FRONTEND_URL=https://...

Frontend (Vite)
VITE_API_URL=https://api.example.com/api/v1

text

## Monitoring & Logging
- NestJS built‑in logger for server logs.
- Error tracking – optional integration with Sentry.
- Performance – use of compression and Helmet.

## Scalability Considerations
- The design is modular; vertical scaling is sufficient for the expected load.
- Database indexes are placed on frequently queried columns.
- Ranking queries are optimized using SQL window functions.
