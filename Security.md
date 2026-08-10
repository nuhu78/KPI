# Security

## 1. Passwords
- Hashed with `bcrypt`, cost factor 10–12
- Never stored or logged in plaintext
- Minimum 8 characters enforced at DTO level

## 2. Authentication
- JWT-based, signed with `JWT_SECRET` (strong random value, stored only in env vars — never committed)
- Token expiry: short-lived (e.g. 8h) — reasonable for a small internal tool, no refresh tokens needed in v1
- Two roles encoded in the JWT payload: `admin`, `employee` — guards check both signature validity and role claim

## 3. Authorization
- `AdminGuard` on all section/employee-management/cycle-assignment routes
- `EmployeeGuard` on progress-marking and "my history" routes, with an ownership check (employee can only touch their own cycle — verified server-side from JWT `sub`, never trust a client-supplied employee id)
- Public dashboard routes explicitly have no guard — but only expose read-only, non-sensitive aggregate data (no passwords, no raw employee list beyond name/section/score)

## 4. Input Validation
- All request bodies validated via `class-validator` DTOs + global `ValidationPipe` (`whitelist: true, forbidExpectedType: true`) — strips/rejects unexpected fields
- Numeric bounds enforced (target_files > 0, reasonable max) to prevent nonsense data

## 5. SQL Injection
- No ORM in v1 — all raw queries **must** use parameterized queries (`$1, $2...` with `pg`), never string-concatenated SQL
- Code review checklist item: reject any PR with string-built SQL

## 6. Rate Limiting
- Apply `@nestjs/throttler` on both login endpoints (e.g. 5 attempts/min per IP) to slow brute-force attempts against the small employee/admin credential space

## 7. CORS
- Backend CORS restricted to the deployed Vercel frontend origin only (no wildcard `*` in production)

## 8. Secrets Management
- `.env` in `.gitignore`, never committed
- Production secrets (DATABASE_URL, JWT_SECRET, ADMIN_SEED_PASSWORD) set directly in Render's environment variable dashboard
- Rotate `ADMIN_SEED_PASSWORD` after first login if it's ever hardcoded for initial setup

## 9. Data Exposure
- Public dashboard never returns: password hashes, employee_code (internal id), email/phone if added later
- Error responses never leak stack traces or internal messages to the client (see Error-Handling.md)

## 10. Transport
- HTTPS enforced end-to-end (Render and Vercel both provide this by default) — no HTTP fallback

## 11. Out of Scope (v1, revisit if the system grows)
- Refresh token rotation
- 2FA
- Audit logging of admin actions
- IP allowlisting for admin panel
