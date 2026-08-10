# Token Efficiency Guide — KPI System

How to complete this project using the least tokens possible with AI coding tools (Claude Code, OpenCode, Cursor, etc).

---

## Core Principle

Don't paste entire docs every time. Feed only what the current phase needs.

---

## What to Reference Per Phase

| Phase | Files to Read |
|-------|---------------|
| 0 | `Database.md`, `AGENTS.md` |
| 1 | `Error-Handling.md` section 3, `Security.md` sections 2+6 |
| 2 | `Database.md` sections 3.2+3.3, `Error-Handling.md` section 3, `Security.md` section 11 |
| 3 | `Database.md` section 3.3, `Error-Handling.md` section 3, `Security.md` sections 1+2 |
| 4 | `Database.md` sections 3.4+5, `Error-Handling.md` section 3, `Security.md` section 3 |
| 5 | `Database.md` sections 5+6, `Design.md` sections 1.1+4, `Error-Handling.md` full |
| 6 | `Database.md` section 3.4, `Error-Handling.md` section 3 |
| 7 | `Security.md` full, `Error-Handling.md` full |

---

## Token-Saving Rules

1. **Never paste all docs at once.** Only reference the ones needed per phase.
2. **Reference files by name** — the AI can read them from the repo.
3. **Don't repeat what's already in the docs** — just say "read AGENTS.md", don't copy its content.
4. **Skip `Architecture.md`** unless the AI asks about module structure.
5. **Skip `Design.md`** until Phase 5.
6. **Don't paste `Prompts.md` itself** — just say "use Phase [Y] prompt from Prompts.md".
7. **Keep "Current repo state" to 1 line** — just say what's done, not how it works.

---

## Session Restart Template

### Generic Template
```
Continuing KPI system build. Phases [X] complete. Starting Phase [Y].

Read these files:
- Prompts.md (Phase [Y])
- AGENTS.md
- [Relevant doc sections for this phase]

Current: [what's done]
```

### Phase 0
```
Set up a new KPI system project.

Read these files:
- Prompts.md (Phase 0)
- AGENTS.md
- Database.md

Follow the prompt exactly.
```

### Phase 1
```
Continuing KPI system build. Phase 0 complete. Starting Phase 1.

Read these files:
- Prompts.md (Phase 1)
- AGENTS.md
- Error-Handling.md section 3
- Security.md sections 2 + 6

Current: monorepo created, PostgreSQL connected, entities defined, admin seeded.
```

### Phase 2
```
Continuing KPI system build. Phases 0–1 complete. Starting Phase 2.

Read these files:
- Prompts.md (Phase 2)
- AGENTS.md
- Database.md sections 3.2 + 3.3
- Error-Handling.md section 3
- Security.md section 11

Current: admin login + JWT + guards working.
```

### Phase 3
```
Continuing KPI system build. Phases 0–2 complete. Starting Phase 3.

Read these files:
- Prompts.md (Phase 3)
- AGENTS.md
- Database.md section 3.3
- Error-Handling.md section 3
- Security.md sections 1 + 2

Current: sections CRUD, employee creation with photo upload working.
```

### Phase 4
```
Continuing KPI system build. Phases 0–3 complete. Starting Phase 4.

Read these files:
- Prompts.md (Phase 4)
- AGENTS.md
- Database.md sections 3.4 + 5
- Error-Handling.md section 3
- Security.md section 3

Current: employee registration + login working, both guards active.
```

### Phase 5
```
Continuing KPI system build. Phases 0–4 complete. Starting Phase 5.

Read these files:
- Prompts.md (Phase 5)
- AGENTS.md
- Database.md sections 5 + 6
- Design.md sections 1.1 + 4
- Error-Handling.md full

Current: full cycle lifecycle working (assign, progress, scoring).
```

### Phase 6
```
Continuing KPI system build. Phases 0–5 complete. Starting Phase 6.

Read these files:
- Prompts.md (Phase 6)
- AGENTS.md
- Database.md section 3.4
- Error-Handling.md section 3

Current: public dashboard showing live rankings with photos.
```

### Phase 7
```
Continuing KPI system build. Phases 0–6 complete. Starting Phase 7.

Read these files:
- Prompts.md (Phase 7)
- AGENTS.md
- Security.md full
- Error-Handling.md full

Current: all features working, cycles close out, history view done.
```

---

## Cost Estimate (Approximate)

Each session restart: ~50-100 tokens (just references + repo state).

Don't paste doc content — let the AI read files directly from the repo. That's the whole point.

---

## Quick Reference: Which Doc Covers What

| Need | File |
|------|------|
| Entity schema | `Database.md` |
| Error codes | `Error-Handling.md` |
| Auth/JWT/Guards | `Security.md` |
| File upload rules | `Security.md` |
| UI pages + components | `Design.md` |
| Module structure | `Architecture.md` |
| Env vars | `AGENTS.md` |
| Prompts (per phase) | `Prompts.md` |
| Build phases | `Phase.md` |

---

## Anti-Patterns (Wastes Tokens)

- Pasting all docs in every prompt
- Copying content from docs into your prompt (just reference the file)
- Re-stating what's in AGENTS.md (env vars, architecture facts)
- Re-stating what's in Prompts.md (the prompt itself)
- Explaining the project from scratch when the AI can read the repo
