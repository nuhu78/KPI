# Error Handling

## 1. Standard Response Shape
All errors return a consistent JSON body via a global NestJS exception filter:
```json
{
  "statusCode": 400,
  "error": "BAD_REQUEST",
  "message": "Target files must be greater than 0",
  "path": "/cycles",
  "timestamp": "2026-08-06T10:00:00.000Z"
}
```

## 2. Global Exception Filter
- One `AllExceptionsFilter` catches everything (`HttpException` + unhandled errors)
- Unhandled/unknown errors → log full stack server-side, return generic `500` with no internal detail leaked to client
- `class-validator` DTO failures are auto-formatted into the same shape (Nest's `ValidationPipe` with a custom `exceptionFactory`)

## 3. Error Catalog

| Scenario | HTTP Status | Error Code |
|---|---|---|
| Invalid login credentials | 401 | INVALID_CREDENTIALS |
| Employee ID not found at registration | 404 | EMPLOYEE_NOT_FOUND |
| Employee already registered | 409 | ALREADY_REGISTERED |
| JWT missing/expired/invalid | 401 | UNAUTHORIZED |
| Admin-only route hit by employee token | 403 | FORBIDDEN |
| Section name already exists | 409 | DUPLICATE_SECTION |
| Employee code already exists | 409 | DUPLICATE_EMPLOYEE_CODE |
| Assigning a cycle while one is already active | 409 | CYCLE_ALREADY_ACTIVE |
| Marking progress past target | 400 | TARGET_EXCEEDED |
| Marking progress on a completed/expired cycle | 400 | CYCLE_NOT_ACTIVE |
| Target files ≤ 0 or missing | 400 | VALIDATION_ERROR |
| Referencing a section that doesn't exist | 404 | SECTION_NOT_FOUND |
| Database connection failure | 503 | SERVICE_UNAVAILABLE |

## 4. Validation Rules (DTO-level, via class-validator)
- `employee_code`: required, string, 1–50 chars
- `name`: required, string, 1–150 chars
- `image_url`: optional, string, max 255 chars (file path or URL)
- `target_files`: required, integer, min 1, max 100 (sane upper bound)
- `password`: required, min 8 chars
- `section name`: required, string, 1–100 chars, unique (checked in service)

## 5. Business-Rule Errors (handled in service layer, not DTO)
- One active cycle per employee — check before insert, throw `ConflictException`
- Completed files can't exceed target — check before increment, throw `BadRequestException`
- Registration requires exact match on `employee_code` and `is_registered = false`

## 6. Frontend Handling
- Central API client (axios/fetch wrapper) catches non-2xx responses, reads `error` code, maps to user-facing message
- 401 → redirect to login, clear stored token
- 403 → show "not authorized" page/toast
- Field-level `VALIDATION_ERROR` → map `message` to the relevant form field
- Frontend lives in `frontend/` folder, API calls go to `backend/` API

## 7. Logging
- Server logs every 5xx with stack trace (never sent to client)
- 4xx logged at info/warn level (no stack trace needed) for basic audit trail
- No sensitive data (passwords, full JWT) ever logged
