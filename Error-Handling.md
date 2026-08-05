# Error Handling Strategy

## Backend (NestJS)

### Global Exception Filter
- Catch all exceptions and format them consistently.
- Response structure:
```json
{
  "statusCode": 400,
  "timestamp": "2026-08-05T10:00:00Z",
  "path": "/api/v1/tasks",
  "message": "Validation failed",
  "errors": [
    { "field": "title", "message": "Title is required" }
  ]
}
HTTP Status Codes
200 – OK

201 – Created

204 – No Content

400 – Bad Request (validation, malformed input)

401 – Unauthorized (missing/invalid token)

403 – Forbidden (insufficient permissions)

404 – Not Found

409 – Conflict (duplicate unique key)

500 – Internal Server Error (unexpected)

Validation
Use class-validator with DTOs.

Pipe ValidationPipe with whitelist: true and forbidNonWhitelisted: true.

Database Errors
Prisma errors are caught and mapped to appropriate HTTP exceptions (e.g., P2002 unique constraint → 409).

Logging
NestJS built‑in logger for errors with stack trace in development.

In production, log only to console (Render captures logs).

Custom Exceptions
Extend HttpException for domain‑specific errors (e.g., TaskAlreadySubmittedException).

Frontend (React)
API Client Interceptors
Axios interceptors:

Request: add JWT token.

Response: handle token expiry (401) → logout.

Global error handling via a React Context or a utility that displays toast notifications.

Error Boundaries
Wrap main sections with React Error Boundaries to prevent entire app from crashing.

Display a fallback UI with a retry button.

Form Validation
React Hook Form with Zod or Yup schemas – client‑side validation before submission.

Server‑side errors are shown inline next to the relevant field.

User Feedback
Toast notifications for success, error, warning, and info.

For critical errors, a modal with details and contact support option.

Graceful Degradation
If an API call fails, show a user‑friendly message and allow retry.

Skeleton loaders during pending requests.

Logging (Frontend)
In development, log errors to console.

In production, consider integrating with Sentry for error tracking (optional).

Example Workflow
User submits a form.

Client‑side validation passes.

API request fails with 400.

Interceptor catches error, extracts message, and displays toast.

Form fields are highlighted with error messages.

Security Considerations in Error Messages
Never expose internal stack traces to clients.

In production, return generic messages for 500 errors ("Something went wrong").

For validation, provide clear field‑specific messages without revealing sensitive data.