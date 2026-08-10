# AGENTS.md — KPI System

## What This Is

Class project: employee KPI ranking system. NestJS REST API + React frontend + PostgreSQL. Single-department scale, no microservices.

**Current state:** Planning only — no code yet. Build phases defined in `Phase.md`.

## Key Docs

| File | Purpose |
|------|---------|
| `Architecture.md` | Module breakdown, folder structure, request flow |
| `Database.md` | Schema, indexes, migration order, scoring formula |
| `Design.md` | UI pages, components, navigation flow |
| `Error-Handling.md` | Response shape, error codes, validation rules |
| `Security.md` | Auth, injection, rate limiting, secrets |
| `Phase.md` | Build phases 0–7 (sequential) |
| `Prompts.md` | Ready-to-paste prompts for each phase |

## Architecture Facts That Matter

- **No ORM** — raw `pg` (node-postgres) queries, parameterized only (`$1, $2...`). Reject string-concatenated SQL.
- **Two JWT roles:** `admin` and `employee`. Guards: `AdminGuard`, `EmployeeGuard`.
- **Public dashboard routes have no auth** — read-only aggregate data only.
- **One active cycle per employee** — enforced in service layer, not DB constraint.
- **Scoring formula:** `(completed_files / target_files) * 100`. Section score = avg of employee scores.
- **Admin is seeded** — single row from `ADMIN_SEED_ID` / `ADMIN_SEED_PASSWORD` env vars.
- **Employee images** — stored in `/uploads/` folder, served as static files, path saved in `image_url` column.

## Env Vars Required

### Local Development (pgAdmin4)
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=kpi_db
```

### Production (Render)
```
DATABASE_URL=postgres://user:pass@host:5432/kpi_db
```

### Common (both)
```
JWT_SECRET=your_secret
JWT_EXPIRES_IN=8h
ADMIN_SEED_ID=admin
ADMIN_SEED_PASSWORD=changeme
```

All via `@nestjs/config`, fail-fast on startup if missing. App builds `DATABASE_URL` from individual vars when `DATABASE_URL` is not set.

## Build Order

Phases 0→7 in `Phase.md` are sequential dependencies. Each phase is a demoable checkpoint.

## When Implementing

- Follow error codes exactly as listed in `Error-Handling.md`
- Use `class-validator` DTOs + global `ValidationPipe` (`whitelist: true, forbidExpectedType: true`)
- Passwords: bcrypt cost factor 10–12, min 8 chars
- CORS restricted to Vercel frontend origin only
- Rate limit login endpoints (`@nestjs/throttler`, ~5 attempts/min per IP)
- Employee images: multer for upload, validate file type (jpg/jpeg/png), max 2MB, store in `/uploads/`
- Deploy: Render (backend + DB), Vercel (frontend). Auto-deploy from GitHub main.
