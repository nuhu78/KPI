# Design (UI/UX)

## 1. Pages

### 1.1 Public Dashboard (`/`)
- Top bar: system name (left), **Login** / **Register** links (top-right)
- Two ranking panels:
  - **Employee Ranking** — table: rank, name, section, score %, progress bar
  - **Section Ranking** — list: rank, section name, avg score %; each row expandable
    - Clicking a section row drops down an inline table of that section's employees ranked (same columns as employee ranking)
- No sidebar, no auth-gated content — this page must load fast and be legible for someone just glancing at a screen/TV in an office

### 1.2 Login (`/login`)
- Single form: ID (admin id or employee code, one field) + password
- Backend determines role from which table matches — or use two tabs "Admin" / "Employee" for clarity (recommended: two tabs, avoids ambiguity)

### 1.3 Register (`/register`, employee only)
- Field: Employee ID → "Verify" step confirms it exists and isn't registered yet
- Then: set password + confirm password
- Success → redirect to login

### 1.4 Admin Panel (`/admin/*`, behind AdminGuard)
- `/admin/sections` — list, create, rename, delete sections
- `/admin/employees` — list employees (with section, registration status), create new employee (code + name + section)
- `/admin/cycles` — assign target/period to one employee or bulk to a section; view active cycles per employee
- Simple left-nav: Sections | Employees | Cycles

### 1.5 Employee Panel (`/me`, behind EmployeeGuard)
- Current cycle card: target files, completed, days remaining, progress bar
- Big "Mark file complete" button (increments by 1, disabled at target)
- History table below: past cycles (period, target, completed, final score)

## 2. Layout & Visual Direction
- Clean, data-forward — this is an internal ranking tool, not a marketing site
- One accent color for progress/rank highlighting (e.g. top 3 rows get subtle highlight/medal-style marker)
- Score always shown as both a number and a progress bar — glanceable at a distance
- Mobile-responsive: ranking tables collapse to stacked cards on small screens

## 3. Navigation Flow
```
Public Dashboard ──▶ Login ──▶ (role) ──▶ Admin Panel
                  └─▶ Register ──▶ Login ──▶ Employee Panel
```

## 4. Component List (React)
- `RankingTable` (reused for employee ranking + section drill-down)
- `SectionAccordion` (section list with expand/collapse)
- `ProgressBar`
- `LoginForm` (admin/employee tabbed)
- `RegisterForm` (two-step: verify ID → set password)
- `AdminSectionManager`, `AdminEmployeeManager`, `AdminCycleAssigner`
- `EmployeeCycleCard`, `EmployeeHistoryTable`

## 5. Notes
- Keep the public dashboard unauthenticated and cache-friendly (short polling or manual refresh is fine for v1 — no need for websockets)
- Admin and employee panels can share a base authenticated layout (top bar + role-based nav) to avoid duplicating structure
