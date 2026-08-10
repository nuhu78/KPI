# Build Phases

## Phase 0 — Setup
- Init NestJS project, connect PostgreSQL (Render DB), env config with validation
- Init React project (Vite), connect to Vercel
- Run initial migration (`admins`, `sections`, `employees`, `cycles` tables)
- Seed admin account
- **Deliverable:** empty API responds, DB connected, frontend deployed skeleton

## Phase 1 — Admin Auth
- `POST /auth/admin/login` → JWT
- `AdminGuard`
- Admin login page (frontend)
- **Deliverable:** admin can log in and reach a protected empty dashboard

## Phase 2 — Section & Employee Management (Admin)
- Section CRUD endpoints + admin UI (create/edit/list sections)
- Employee creation endpoint (admin adds employee_code + name + section) + admin UI
- **Deliverable:** admin can create sections and pre-register employees

## Phase 3 — Employee Registration & Login
- `POST /auth/employee/register` (id match → set password)
- `POST /auth/employee/login` → JWT
- `EmployeeGuard`
- Register + login pages (frontend)
- **Deliverable:** an admin-created employee can self-register and log in

## Phase 4 — Cycle Assignment & Progress
- Admin assigns target + period to an employee (single + bulk-by-section)
- Employee progress endpoint (increment completed_files)
- Admin task-assignment UI, employee "my target" UI
- **Deliverable:** full task lifecycle works end-to-end for one employee

## Phase 5 — Scoring & Public Dashboard
- Score calculation (employee + section aggregate)
- Public dashboard endpoints (no auth)
- Public dashboard UI: employee ranking, section ranking, section drill-down
- **Deliverable:** landing page shows live rankings

## Phase 6 — Cycle Close-Out & History
- Job/admin action to close expired cycles → lock final_score, set status = completed
- Employee history view (past cycles)
- **Deliverable:** cycles roll over correctly, history is preserved

## Phase 7 — Hardening
- Error handling pass (see Error-Handling.md)
- Security pass (see Security.md)
- Basic tests for scoring logic and auth guards
- **Deliverable:** production-ready v1

## Suggested Pace
Each phase is a self-contained, demoable increment — good checkpoint to show your brother progress before moving to the next.
