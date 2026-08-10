# Token Efficiency Guide — KPI System

How to complete this project using the least tokens possible with AI coding tools (Claude Code, OpenCode, Cursor, etc).

---

## Core Principle

Don't paste entire docs every time. Feed only what the current phase needs.

---

## What to Paste Per Phase

### Phase 0 — Setup
- `Database.md` (full — needed for schema + migration SQL)
- `AGENTS.md` section "Architecture Facts That Matter" + "Env Vars Required"
- Note: local dev uses `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` (pgAdmin4 style). `DATABASE_URL` only for Render deploy.
- Prompt from `Prompts.md` Phase 0

### Phase 1 — Admin Auth
- `Error-Handling.md` section 3 (Error Catalog — rows for INVALID_CREDENTIALS, UNAUTHORIZED, FORBIDDEN)
- `Security.md` section 2 (Authentication) + section 6 (Rate Limiting)
- Prompt from `Prompts.md` Phase 1

### Phase 2 — Section & Employee Management
- `Database.md` sections 3.2 + 3.3 (sections + employees table schemas — includes `image_url`)
- `Error-Handling.md` section 3 (rows for DUPLICATE_SECTION, DUPLICATE_EMPLOYEE_CODE, SECTION_NOT_FOUND)
- `Security.md` section 11 (file upload security — multer config, allowed types, max size)
- Prompt from `Prompts.md` Phase 2

### Phase 3 — Employee Registration & Login
- `Database.md` section 3.3 (employees table)
- `Error-Handling.md` section 3 (rows for EMPLOYEE_NOT_FOUND, ALREADY_REGISTERED, INVALID_CREDENTIALS)
- `Security.md` section 1 (Passwords) + section 2 (Authentication)
- Prompt from `Prompts.md` Phase 3

### Phase 4 — Cycle Assignment & Progress
- `Database.md` section 3.4 (cycles table) + section 5 (Derived Values)
- `Error-Handling.md` section 3 (rows for CYCLE_ALREADY_ACTIVE, TARGET_EXCEEDED, CYCLE_NOT_ACTIVE)
- `Security.md` section 3 (Authorization — ownership check)
- Prompt from `Prompts.md` Phase 4

### Phase 5 — Scoring & Public Dashboard
- `Database.md` section 5 (Derived Values) + section 6 (Sample Query)
- `Design.md` section 1.1 (Public Dashboard) + section 4 (Component List)
- `Error-Handling.md` full (need all error shapes for frontend)
- Prompt from `Prompts.md` Phase 5

### Phase 6 — Cycle Close-Out & History
- `Database.md` section 3.4 (cycles table — status + final_score fields)
- `Error-Handling.md` section 3 (full — for any new error codes)
- Prompt from `Prompts.md` Phase 6

### Phase 7 — Hardening
- `Security.md` (full — reviewing against everything)
- `Error-Handling.md` (full — reviewing against everything)
- Prompt from `Prompts.md` Phase 7

---

## Token-Saving Rules

1. **Never paste all 7 docs at once.** Only the ones listed above per phase.
2. **Reference file names instead of content when the AI already has the file.** Example: "Follow the error codes in Error-Handling.md" — the AI can read it from the repo.
3. **Don't re-paste the same doc in consecutive phases** unless the AI lost context (new session).
4. **If starting a new session mid-phase**, paste only:
   - The current phase's prompt from `Prompts.md`
   - The specific doc sections it needs (see above)
   - A one-line summary of what's already built: "NestJS project exists, PostgreSQL connected, Phases 0–2 complete."
5. **Skip `Architecture.md` entirely** unless the AI asks about module structure — the prompts already reference the correct modules.
6. **Skip `Design.md` entirely** until Phase 5 — it's only needed for the frontend dashboard.
7. **Don't paste `Prompts.md` file itself** — just paste the specific prompt block for the current phase.

---

## Session Restart Template

When you start a fresh session and need to continue from where you left off, paste this:

```
Continuing KPI system build. Phases [X] complete. Starting Phase [Y].

[Phase Y prompt from Prompts.md]

[Only the doc sections listed above for Phase Y]

DB config: local dev uses pgAdmin4 style (DB_HOST, DB_PORT, DB_USERNAME,
DB_PASSWORD, DB_DATABASE). Production uses DATABASE_URL on Render.
Employee images: stored in backend /uploads/, served as static files.
Current repo state: [brief — e.g. "NestJS + React deployed, DB migrated, auth working"]
```

---

## Cost Estimate (Approximate)

| Phases | Docs Pasted | Approx Tokens |
|--------|-------------|---------------|
| 0 | Database.md + AGENTS.md excerpt | ~1.5k |
| 1 | Error-Handling.md excerpt + Security.md excerpt | ~0.8k |
| 2 | Database.md excerpt + Error-Handling.md excerpt | ~0.8k |
| 3 | Database.md excerpt + Error-Handling.md + Security.md | ~1.2k |
| 4 | Database.md excerpt + Error-Handling.md + Security.md | ~1.2k |
| 5 | Database.md + Error-Handling.md + Design.md | ~2.0k |
| 6 | Database.md excerpt + Error-Handling.md | ~1.0k |
| 7 | Security.md + Error-Handling.md (full) | ~1.5k |
| **Total** | | **~10k input tokens** |

Each prompt itself is ~100–200 tokens. Output varies by complexity but averages ~2–4k tokens per phase.

**Note:** Phase 2 includes image upload (multer + validation) which adds ~200 tokens to the prompt.

---

## Quick Reference: Which Doc Covers What

| Need | File | Section |
|------|------|---------|
| Table schema | `Database.md` | 3.1–3.4 |
| SQL samples | `Database.md` | 6 |
| Migration order | `Database.md` | 7 |
| Error codes | `Error-Handling.md` | 3 |
| Validation rules | `Error-Handling.md` | 4 |
| Password rules | `Security.md` | 1 |
| JWT details | `Security.md` | 2 |
| Guard logic | `Security.md` | 3 |
| SQL injection rules | `Security.md` | 5 |
| Rate limiting | `Security.md` | 6 |
| CORS config | `Security.md` | 7 |
| File upload security | `Security.md` | 11 |
| UI pages | `Design.md` | 1 |
| React components | `Design.md` | 4 |
| Module structure | `Architecture.md` | 3–4 |
| Env vars (local) | `AGENTS.md` | DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE |
| Env vars (production) | `AGENTS.md` | DATABASE_URL |

---

## Anti-Patterns (Wastes Tokens)

- Pasting all 8 docs in every prompt (~15k wasted tokens per phase)
- Re-explaining what the project is when the AI already has context
- Asking "how should I structure this?" when `Architecture.md` already answers it
- Pasting `Prompts.md` and `AGENTS.md` together — redundant
- Re-stating constraints already in the doc (e.g. "use raw pg, no ORM" — the AI reads this from the repo)
- Forgetting to mention image upload security rules when implementing employee photo features
