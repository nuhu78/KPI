# Architecture

## 1. Style
Monolithic REST API (NestJS) + separate React frontend. No microservices — not needed at this scale (single department, small user count).

## 2. High-Level Diagram
```
┌─────────────┐        REST/JSON        ┌──────────────────┐
│   React     │ ─────────────────────▶  │   NestJS API      │
│  (Vercel)   │ ◀─────────────────────  │   (Render)         │
└─────────────┘                         └────────┬──────────┘
                                                   │
                                                   ▼
                                         ┌──────────────────┐
                                         │   PostgreSQL      │
                                         │   (Render DB)      │
                                         └──────────────────┘
```

## 3. Backend Module Breakdown (NestJS)
- **AuthModule** — login (admin + employee), JWT issuing/validation, guards
- **AdminModule** — admin-only endpoints (seeded account bootstrap)
- **SectionModule** — CRUD for sections
- **EmployeeModule** — admin creates employee records; employee self-registration endpoint; employee profile; image upload
- **CycleModule** — task assignment (target + period), progress marking, cycle close-out
- **DashboardModule** — public ranking endpoints (no auth): employee ranking, section ranking, section drill-down
- **CommonModule** — shared: exception filters, DTOs, pipes, guards

## 4. Folder Structure
```
kpi-system/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── guards/
│   │   │   │   ├── admin.guard.ts
│   │   │   │   └── employee.guard.ts
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   ├── admin/
│   │   ├── section/
│   │   ├── employee/
│   │   ├── cycle/
│   │   ├── dashboard/
│   │   ├── common/
│   │   │   ├── filters/
│   │   │   ├── dto/
│   │   │   └── decorators/
│   │   ├── entities/
│   │   │   ├── admin.entity.ts
│   │   │   ├── section.entity.ts
│   │   │   ├── employee.entity.ts
│   │   │   └── cycle.entity.ts
│   │   ├── uploads/
│   │   ├── main.ts
│   │   └── app.module.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RankingTable.jsx
│   │   │   ├── SectionAccordion.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── AdminSectionManager.jsx
│   │   │   ├── AdminEmployeeManager.jsx
│   │   │   ├── AdminCycleAssigner.jsx
│   │   │   ├── EmployeeCycleCard.jsx
│   │   │   ├── EmployeeHistoryTable.jsx
│   │   │   └── PhotoUpload.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── admin/
│   │   │   │   ├── Sections.jsx
│   │   │   │   ├── Employees.jsx
│   │   │   │   └── Cycles.jsx
│   │   │   └── employee/
│   │   │       └── MyCycle.jsx
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## 5. Request Flow (example: employee marks a file complete)
1. Employee frontend sends `PATCH /cycles/:id/progress` with JWT in header
2. `EmployeeGuard` validates JWT, attaches employee to request
3. Controller → `CycleService.incrementProgress(cycleId, employeeId)`
4. Service verifies the cycle belongs to that employee, `completed < target`
5. Update row, recalculate score, return updated cycle
6. Frontend updates the progress bar

## 6. API Layering
- **Controller** — routing, request validation (DTOs + `class-validator`), calls service
- **Service** — business logic (scoring math, cycle rules, registration matching)
- **Repository** — TypeORM repository for database access (entities + query builder)

## 7. Auth Flow Summary
- Two guard types: `AdminGuard`, `EmployeeGuard` — both check JWT + role claim
- Public dashboard routes have **no guard**
- JWT payload: `{ sub, role: 'admin' | 'employee', iat, exp }`

## 8. Environment Config
- **Local (pgAdmin4):** individual vars — `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- **Production (Render):** single `DATABASE_URL` connection string
- **Common:** `JWT_SECRET`, `JWT_EXPIRES_IN`, `ADMIN_SEED_ID`, `ADMIN_SEED_PASSWORD`
- Loaded via `@nestjs/config`, validated on startup (fail fast if missing)
- App detects which mode: if `DATABASE_URL` exists → use it, otherwise build it from `DB_*` vars

## 9. Deployment Topology
- Backend: Render Web Service (auto-deploy from `backend/` folder on GitHub main branch)
- Database: Render PostgreSQL (managed)
- Frontend: Vercel (auto-deploy from `frontend/` folder on GitHub)
- Employee images: stored in `backend/src/uploads/`, served as static files
- CORS on backend restricted to the Vercel frontend origin
