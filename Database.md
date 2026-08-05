# Database Design

## Overview
PostgreSQL is used as the primary data store. The schema is designed to support all functional requirements while maintaining referential integrity and query performance.

## Entity‑Relationship Diagram (ERD)
┌─────────────┐ ┌─────────────┐
│ Section │ │ KpiPeriod │
├─────────────┤ ├─────────────┤
│ id (PK) │ │ id (PK) │
│ name │ │ name │
│ description │ │ start_date │
│ created_at │ │ end_date │
│ updated_at │ │ created_at │
└──────┬──────┘ └──────┬──────┘
│ │
│ (1..) │ (1..)
│ │
▼ ▼
┌─────────────┐ ┌─────────────┐
│ User │ │ Task │
├─────────────┤ ├─────────────┤
│ id (PK) │◄─────│ id (PK) │
│ employee_id │ │ title │
│ full_name │ │ description │
│ section_id │ │ file_number │ (assigned)
│ designation │ │ kpi_score │
│ phone │ │ deadline │
│ email │ │ kpi_period_id (FK)│
│ password │ │ assigned_to (FK) │
│ role (enum) │ │ created_at │
│ avatar_url │ │ updated_at │
│ created_at │ └──────┬──────┘
│ updated_at │ │
└─────────────┘ │ (1)
│
│ (1)
▼
┌─────────────┐
│ Submission │
├─────────────┤
│ id (PK) │
│ task_id (FK)│
│ completed_file_number │
│ submitted_at│
│ updated_at │
└─────────────┘

text

## Table Details

### `users`
Stores both admin and employee accounts.

| Column          | Type                     | Constraints                    |
|-----------------|--------------------------|--------------------------------|
| id              | UUID                     | PRIMARY KEY, DEFAULT gen_random_uuid() |
| employee_id     | VARCHAR(50)              | UNIQUE, NOT NULL               |
| full_name       | VARCHAR(100)             | NOT NULL                       |
| section_id      | UUID                     | FOREIGN KEY (sections.id)      |
| designation     | VARCHAR(100)             |                                |
| phone           | VARCHAR(20)              |                                |
| email           | VARCHAR(255)             | UNIQUE                         |
| password_hash   | VARCHAR(255)             | NOT NULL (for all users)       |
| role            | ENUM('admin','employee') | NOT NULL, DEFAULT 'employee'   |
| avatar_url      | TEXT                     |                                |
| created_at      | TIMESTAMP                | DEFAULT NOW()                  |
| updated_at      | TIMESTAMP                | DEFAULT NOW()                  |
| deleted_at      | TIMESTAMP                | NULL (soft delete)             |

Indexes: `employee_id`, `section_id`, `role`

### `sections`

| Column          | Type                     | Constraints                    |
|-----------------|--------------------------|--------------------------------|
| id              | UUID                     | PRIMARY KEY                    |
| name            | VARCHAR(100)             | UNIQUE, NOT NULL               |
| description     | TEXT                     |                                |
| created_at      | TIMESTAMP                | DEFAULT NOW()                  |
| updated_at      | TIMESTAMP                | DEFAULT NOW()                  |

### `kpi_periods`

| Column          | Type                     | Constraints                    |
|-----------------|--------------------------|--------------------------------|
| id              | UUID                     | PRIMARY KEY                    |
| name            | VARCHAR(100)             | NOT NULL                       |
| start_date      | DATE                     | NOT NULL                       |
| end_date        | DATE                     | NOT NULL                       |
| created_at      | TIMESTAMP                | DEFAULT NOW()                  |
| updated_at      | TIMESTAMP                | DEFAULT NOW()                  |

Index: `start_date`, `end_date`

### `tasks`

| Column          | Type                     | Constraints                    |
|-----------------|--------------------------|--------------------------------|
| id              | UUID                     | PRIMARY KEY                    |
| title           | VARCHAR(255)             | NOT NULL                       |
| description     | TEXT                     |                                |
| file_number     | VARCHAR(50)              | NOT NULL (assigned file number)|
| kpi_score       | DECIMAL(5,2)             | NOT NULL, DEFAULT 0            |
| deadline        | DATE                     | NOT NULL                       |
| kpi_period_id   | UUID                     | FOREIGN KEY (kpi_periods.id)   |
| assigned_to     | UUID                     | FOREIGN KEY (users.id)         |
| created_at      | TIMESTAMP                | DEFAULT NOW()                  |
| updated_at      | TIMESTAMP                | DEFAULT NOW()                  |

Indexes: `kpi_period_id`, `assigned_to`, `deadline`

### `submissions`

| Column                  | Type                     | Constraints                    |
|-------------------------|--------------------------|--------------------------------|
| id                      | UUID                     | PRIMARY KEY                    |
| task_id                 | UUID                     | FOREIGN KEY (tasks.id), UNIQUE |
| completed_file_number   | VARCHAR(50)              | NOT NULL                       |
| submitted_at            | TIMESTAMP                | DEFAULT NOW()                  |
| updated_at              | TIMESTAMP                | DEFAULT NOW()                  |

Each task can have at most one submission (latest is overwritten on edit).

## KPI Score Calculation

- Each `task` has a `kpi_score`.
- When a `submission` is created or updated for that task, the score is **immediately** added to the employee’s total score.
- Total score = sum of `kpi_score` of all tasks assigned to that employee that have a submission.
- Employee ranking: computed via SQL window function `RANK() OVER (ORDER BY total_score DESC)`.
- Section average: average of total scores of employees in that section; section ranking uses `RANK()` over average scores.

## Queries for Rankings

**Employee ranking:**
```sql
SELECT u.id, u.full_name, u.employee_id, s.name AS section,
       COALESCE(SUM(t.kpi_score), 0) AS total_score,
       RANK() OVER (ORDER BY COALESCE(SUM(t.kpi_score), 0) DESC) AS rank
FROM users u
LEFT JOIN sections s ON u.section_id = s.id
LEFT JOIN tasks t ON t.assigned_to = u.id
LEFT JOIN submissions sub ON sub.task_id = t.id
WHERE u.role = 'employee' AND u.deleted_at IS NULL
GROUP BY u.id, s.name;
Section ranking:

sql
SELECT s.id, s.name,
       AVG(emp.total_score) AS avg_score,
       RANK() OVER (ORDER BY AVG(emp.total_score) DESC) AS rank
FROM sections s
JOIN (
    SELECT u.section_id, COALESCE(SUM(t.kpi_score), 0) AS total_score
    FROM users u
    LEFT JOIN tasks t ON t.assigned_to = u.id
    LEFT JOIN submissions sub ON sub.task_id = t.id
    WHERE u.role = 'employee' AND u.deleted_at IS NULL
    GROUP BY u.id
) emp ON emp.section_id = s.id
GROUP BY s.id;
Migrations
Prisma schema.prisma defines all models.

Use prisma migrate dev for development and prisma migrate deploy for production.

Seed script for default admin user and sample data.

Future Consideration
If the client chooses verification before score contribution, add a verified_at timestamp and a status enum to submissions. Only verified submissions would contribute to the score. The current schema can be extended with minimal changes.