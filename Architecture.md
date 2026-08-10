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
- **EmployeeModule** — admin creates employee records; employee self-registration endpoint; employee profile
- **CycleModule** — task assignment (target + period), progress marking, cycle close-out
- **DashboardModule** — public ranking endpoints (no auth): employee ranking, section ranking, section drill-down
- **CommonModule** — shared: exception filters, DTOs, pipes, guards

## 4. Folder Structure
```
src/
  auth/
    auth.module.ts
    auth.service.ts
    auth.controller.ts
    guards/
      admin.guard.ts
      employee.guard.ts
    strategies/
      jwt.strategy.ts
  admin/
  section/
  employee/
  cycle/
  dashboard/
  common/
    filters/
    dto/
    decorators/
  main.ts
  app.module.ts
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
- **Repository/Query layer** — raw `pg` queries or query builder (no ORM in v1 — see Database.md)

## 7. Auth Flow Summary
- Two guard types: `AdminGuard`, `EmployeeGuard` — both check JWT + role claim
- Public dashboard routes have **no guard**
- JWT payload: `{ sub, role: 'admin' | 'employee', iat, exp }`

## 8. Environment Config
- `.env` holds: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `ADMIN_SEED_ID`, `ADMIN_SEED_PASSWORD`
- Loaded via `@nestjs/config`, validated on startup (fail fast if missing)

## 9. Deployment Topology
- Backend: Render Web Service (auto-deploy from GitHub main branch)
- Database: Render PostgreSQL (managed)
- Frontend: Vercel (auto-deploy from GitHub)
- CORS on backend restricted to the Vercel frontend origin
