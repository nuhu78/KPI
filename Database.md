# Database Schema

## 1. Engine
PostgreSQL. No ORM in v1 — plain SQL via `pg` (node-postgres), with a `migrations/` folder of numbered `.sql` files run manually or via a lightweight runner (e.g. `node-pg-migrate`).

### Local (pgAdmin4)
Connect via host/port/username/password/database — no URL needed. App uses `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` env vars.

### Production (Render)
Uses `DATABASE_URL` connection string provided by Render.

## 2. ERD (textual)
```
Section (1) ──< (many) Employee (1) ──< (many) Cycle
Admin (standalone, no relations)
```

## 3. Tables

### 3.1 `admins`
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| admin_id | VARCHAR(50) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMPTZ | DEFAULT now() |

*Single row in v1, seeded on first deploy.*

### 3.2 `sections`
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | UNIQUE, NOT NULL |
| created_at | TIMESTAMPTZ | DEFAULT now() |

### 3.3 `employees`
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| employee_code | VARCHAR(50) | UNIQUE, NOT NULL |
| name | VARCHAR(150) | NOT NULL |
| image_url | VARCHAR(255) | NULLABLE (profile photo path/URL) |
| section_id | INTEGER | NOT NULL, REFERENCES sections(id) |
| password_hash | VARCHAR(255) | NULLABLE (null until registered) |
| is_registered | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMPTZ | DEFAULT now() |

- Admin inserts a row with `employee_code`, `name`, `section_id` and `is_registered = false`
- On registration, `password_hash` is set and `is_registered = true`
- `image_url` is set by admin during employee creation or updated later (stores local path or URL)

### 3.4 `cycles`
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| employee_id | INTEGER | NOT NULL, REFERENCES employees(id) |
| target_files | INTEGER | NOT NULL, CHECK (target_files > 0) |
| completed_files | INTEGER | DEFAULT 0, CHECK (completed_files >= 0) |
| start_date | DATE | NOT NULL |
| end_date | DATE | NOT NULL |
| status | VARCHAR(20) | DEFAULT 'active' — 'active' \| 'completed' |
| final_score | NUMERIC(5,2) | NULLABLE — set when status becomes 'completed' |
| created_at | TIMESTAMPTZ | DEFAULT now() |

- **Constraint (app-level, enforced in service):** only one `status = 'active'` cycle per employee at a time
- `completed_files <= target_files` enforced in service logic

## 4. Indexes
```sql
CREATE INDEX idx_employees_section ON employees(section_id);
CREATE INDEX idx_cycles_employee ON cycles(employee_id);
CREATE INDEX idx_cycles_status ON cycles(status);
CREATE UNIQUE INDEX idx_employees_code ON employees(employee_code);
```

## 5. Derived Values (not stored, computed on read)
- Employee current score: `(completed_files / target_files) * 100` from their active cycle
- Section score: `AVG(employee current scores)` for employees in that section
- Ranking: `ORDER BY score DESC` (application-level sort after fetch, or SQL window function)

## 6. Sample Query — Public Ranking
```sql
SELECT e.id, e.name, e.section_id, c.completed_files, c.target_files,
       ROUND((c.completed_files::numeric / c.target_files) * 100, 2) AS score
FROM employees e
JOIN cycles c ON c.employee_id = e.id AND c.status = 'active'
ORDER BY score DESC;
```

## 7. Migration Order
1. `001_create_admins.sql`
2. `002_create_sections.sql`
3. `003_create_employees.sql`
4. `004_create_cycles.sql`
5. `005_seed_admin.sql`
