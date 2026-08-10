# Prompts (for Claude Code / OpenCode CLI)

Use one prompt per phase, in order. Paste `Architecture.md`, `Database.md`, `Error-Handling.md`, and `Security.md` into the tool's context (or point it at the repo docs folder) before running these.

## Phase 0 — Setup
```
Set up a new NestJS + TypeScript project called kpi-system. Connect it to
PostgreSQL using plain pg (node-postgres), no ORM. Add @nestjs/config with
validated env vars: DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, ADMIN_SEED_ID,
ADMIN_SEED_PASSWORD. Create a migrations/ folder with numbered .sql files for
the schema in Database.md (admins, sections, employees, cycles tables plus
indexes). Add a seed script that inserts the admin row from ADMIN_SEED_ID /
ADMIN_SEED_PASSWORD (hashed with bcrypt) if it doesn't already exist.
```

## Phase 1 — Admin Auth
```
Add an AuthModule to the NestJS project. Implement POST /auth/admin/login
that checks admin_id + password (bcrypt compare) against the admins table
and returns a JWT with payload { sub, role: 'admin' }. Add a JwtStrategy and
an AdminGuard that rejects any request without a valid admin-role JWT.
Follow the error response shape and error codes in Error-Handling.md.
```

## Phase 2 — Section & Employee Management
```
Add a SectionModule with full CRUD (create, list, update, delete) restricted
to AdminGuard, matching the sections table in Database.md. Add an
EmployeeModule with an admin-only endpoint to create an employee record
(employee_code, name, section_id) — is_registered defaults to false. Enforce
unique employee_code and unique section name, returning DUPLICATE_SECTION /
DUPLICATE_EMPLOYEE_CODE per Error-Handling.md.
```

## Phase 3 — Employee Registration & Login
```
Add POST /auth/employee/register: takes employee_code + new password, finds
the matching employee row where is_registered = false, hashes the password,
sets is_registered = true. Return EMPLOYEE_NOT_FOUND or ALREADY_REGISTERED
per Error-Handling.md for the failure cases. Add POST /auth/employee/login
returning a JWT with { sub, role: 'employee' }. Add an EmployeeGuard.
```

## Phase 4 — Cycle Assignment & Progress
```
Add a CycleModule. Admin-only endpoint POST /cycles to assign a cycle to one
employee (target_files, start_date, end_date) — reject with
CYCLE_ALREADY_ACTIVE if that employee already has an active cycle. Add a
bulk variant that assigns the same target/period to every employee in a
section. Add an employee-only endpoint PATCH /cycles/:id/progress that
increments completed_files by 1, rejecting with TARGET_EXCEEDED if already
at target and CYCLE_NOT_ACTIVE if the cycle isn't active. Employees can only
modify their own cycle — verify ownership from the JWT.
```

## Phase 5 — Scoring & Public Dashboard
```
Add a DashboardModule with three public (no-auth) endpoints: GET
/dashboard/employees (all employees with an active cycle, name, section,
computed score sorted descending), GET /dashboard/sections (section name +
average score of its employees, sorted descending), and GET
/dashboard/sections/:id/employees (that section's employees ranked). Use
the scoring formula from Database.md section 5. Then build a React public
dashboard page consuming these three endpoints: a ranking table, a
sections list where clicking a section expands to show its employee
ranking inline, and Login/Register links in the top-right corner.
```

## Phase 6 — Cycle Close-Out & History
```
Add a way to close cycles whose end_date has passed: set status =
'completed' and final_score = the computed score at that moment, leaving
completed_files/target_files as the historical record. Run this as an admin
action (endpoint) for v1 rather than a scheduled job. Add GET
/employees/me/history (employee-only) returning their past completed
cycles ordered by end_date descending.
```

## Phase 7 — Hardening
```
Review the whole kpi-system codebase against Security.md and
Error-Handling.md. Add rate limiting on both login endpoints, confirm
bcrypt cost factor, confirm all admin/employee routes have the correct
guard, confirm CORS is restricted to the frontend origin, and add basic
unit tests for the scoring calculation and both guards.
```
