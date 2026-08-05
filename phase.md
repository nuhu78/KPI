
---

## Phase.md

```markdown
# Development Phases

The project is divided into 8 phases, each with clear deliverables and milestones. The total estimated duration is **8‑10 weeks** for a full team, adjustable for solo developers.

## Phase 0 – Project Setup & Database (Week 1)
- Set up Git repository, project structure (backend/frontend).
- Initialize NestJS and React+Vite projects.
- Configure Prisma with PostgreSQL (local and Render).
- Define database schema and generate migrations.
- Implement environment variable management.

**Deliverables:** Working database connection, basic project skeleton.

## Phase 1 – Authentication & User Management (Week 1-2)
- Backend: JWT authentication (login, register, guards).
- Frontend: Login page, registration (employee sign‑up with Employee ID).
- Admin: create employee accounts (with section, designation, etc.).
- Role‑based access control (admin vs employee).

**Deliverables:** Login/logout, role‑based routing, employee creation.

## Phase 2 – Section & Employee Management (Week 2-3)
- Backend: CRUD for sections, CRUD for employees (admin only).
- Frontend: Admin pages for managing sections and employees (list, add, edit, delete).
- Upload profile image (optional).

**Deliverables:** Fully functional section and employee management.

## Phase 3 – KPI Period & Task Management (Week 3-4)
- Backend: CRUD for KPI periods, CRUD for tasks (assign to employee, select period, set score and deadline).
- Frontend: Admin pages for periods and tasks.

**Deliverables:** Ability to create KPI periods and assign tasks to employees.

## Phase 4 – Employee Dashboard & Submissions (Week 4-5)
- Backend: endpoints for employee to view assigned tasks, submit completed file number, edit submission.
- Frontend: Employee dashboard showing profile, assigned tasks, submission form, edit capability.

**Deliverables:** Employees can view tasks and submit/update completed file numbers.

## Phase 5 – Rankings & Public Dashboard (Week 5-6)
- Backend: compute employee and section rankings (SQL queries), expose via REST.
- Frontend: Public landing page with employee ranking and section ranking tables.
- Click on section → show employees in that section with their individual scores/ranks.

**Deliverables:** Public ranking pages fully dynamic and up‑to‑date.

## Phase 6 – Admin Dashboard & Analytics (Week 6-7)
- Backend: aggregate statistics (total employees, tasks, submissions, etc.).
- Frontend: Admin dashboard with summary cards, charts (KPI distribution, section performance).
- Rankings display (same as public but within admin area).

**Deliverables:** Admin analytics and overview.

## Phase 7 – Search & Filter (Week 7-8)
- Implement search/filter on employee list, task list, ranking tables.
- Filter by section, KPI period, employee name, file number.

**Deliverables:** All relevant tables have search and filter capabilities.

## Phase 8 – Responsiveness, Testing, Deployment (Week 8-10)
- Polish responsive design (mobile/tablet/desktop).
- Write unit and integration tests (backend: Jest, frontend: Vitest + React Testing Library).
- Deploy to Render: backend as web service, frontend as static site, PostgreSQL.
- Set up CI/CD (GitHub Actions) for automatic deployment on push to main.
- Perform end‑to‑end testing and bug fixing.

**Deliverables:** Fully production‑ready system live on Render.

---

## Milestones
- **M1** (End of Phase 2): Admin can manage sections and employees.
- **M2** (End of Phase 4): Employees can submit file numbers.
- **M3** (End of Phase 6): Rankings and admin dashboards functional.
- **M4** (End of Phase 8): System deployed and accessible.

## Parallel Work
- Frontend and backend can be developed in parallel after API contracts are defined.
- Use Swagger/OpenAPI to document endpoints early.