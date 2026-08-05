# Security

## Authentication & Authorization

- **JWT (JSON Web Tokens)** – used for stateless authentication.
  - Access token expires in 7 days (configurable).
  - Token is signed with a strong secret (`JWT_SECRET`).
- **Password hashing** – bcrypt with salt rounds = 10.
- **Registration flow** – employees must have a pre‑created account by admin; they set their password via a secure link or using their employee ID.
- **Role‑based access control** – each endpoint is protected by `JwtAuthGuard` and `RolesGuard` (admin vs employee).
- **Public routes** – only the public dashboard endpoints are open.

## Data Protection

- **Environment variables** – all secrets are stored in `.env` and never committed to version control.
- **HTTPS** – enforced on Render (all traffic over TLS).
- **Input validation** – all incoming payloads are validated using `class-validator` (backend) and Zod/Yup (frontend) to prevent injection attacks.
- **Parameterized queries** – Prisma ORM automatically prevents SQL injection.
- **XSS prevention** – React escapes content by default; additional sanitization applied to user‑generated content (e.g., file numbers) if displayed as HTML.
- **CSRF protection** – not needed for JWT‑based APIs (stateless); however, ensure CORS is properly configured.

## CORS

- Only allow requests from the frontend URL (set in `FRONTEND_URL` environment variable).
- Methods: GET, POST, PATCH, DELETE, OPTIONS.
- Credentials: allowed (for cookies if used, but we use Authorization header).

## Session & Token Storage

- Token is stored in **localStorage** or **httpOnly cookies** (prefer cookies for better security).  
  *Decision*: Use `httpOnly` cookies if possible to mitigate XSS; otherwise, localStorage with careful XSS protection.

## Rate Limiting

- Implement rate limiting on authentication endpoints (e.g., 5 attempts per minute) to prevent brute‑force attacks.
- Use `@nestjs/throttler` or a similar package.

## File Upload (Profile Image)

- Validate file type (image/jpeg, image/png) and size (max 2MB).
- Store images on cloud storage (e.g., Cloudinary) or serve from backend static folder with secure URLs.
- Prevent path traversal attacks by generating random filenames.

## Logging & Monitoring

- Audit logs for critical actions: employee creation, task assignment, submission edits.
- No sensitive data (passwords, tokens) logged.
- Error logs are sanitized to avoid leaking internal details.

## Dependency Security

- Regularly update dependencies and run `npm audit`.
- Use `helmet` middleware to set secure HTTP headers (X‑Frame‑Options, X‑Content‑Type‑Options, etc.).

## Deployment Security

- Render provides isolated environments; use private networking for database if possible.
- Set `NODE_ENV=production` to disable debugging features.
- Ensure that the database user has least‑privilege permissions (only CRUD on needed tables).

## Incident Response

- In case of a security breach, invalidate all tokens by changing `JWT_SECRET`.
- Monitor logs for suspicious activities (multiple failed logins, unusual API calls).

## Data Privacy

- Personal data (employee ID, phone, email) is stored and processed in compliance with relevant regulations (GDPR, etc.).
- Soft delete (`deleted_at`) is used to preserve history but hide data from frontend.

## Additional Recommendations

- Consider adding **refresh tokens** for longer sessions.
- Implement **2FA** if required in future.
- Perform regular penetration testing and vulnerability scanning.