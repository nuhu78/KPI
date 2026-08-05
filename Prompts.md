# Development Prompts

This document contains a curated list of prompts to feed to an AI assistant (like ChatGPT) to accelerate the generation of boilerplate code, CRUD operations, and complex logic. Use them as starting points and adapt to your project.

---

## Backend (NestJS + Prisma)

### 1. Generate a NestJS module with CRUD
Generate a NestJS module for "sections" with:

Prisma model for Section (id, name, description, timestamps)

DTOs for create and update

Controller with GET, POST, PATCH, DELETE endpoints

Service with proper error handling (404, 409)

Use class-validator for validation

Protect all routes with JWT auth guard, admin role guard

text

### 2. Create JWT Authentication
Implement JWT authentication in NestJS:

AuthModule with login (email/password) and register endpoints

Use bcrypt for password hashing

Return access token on login

Create JwtAuthGuard and RolesGuard

Employee registration: verify employee_id exists, then set password

text

### 3. Compute rankings
Write a NestJS service method that:

Computes employee ranking by total KPI score (sum of scores from tasks with submissions)

Returns list with rank, employee name, ID, section, total score

Use raw SQL or Prisma's $queryRaw with window functions

Also compute section rankings by average score

text

### 4. Submission logic
Create a Submission module in NestJS:

Endpoint POST /submissions to submit completed file number for a task

Validate that task exists and is assigned to the logged-in employee

If submission already exists, update it (edit)

Return updated submission

text

### 5. Admin dashboard statistics
Write a service that returns admin dashboard stats:

Total employees, total sections, total tasks, total submissions

Also return list of recent activities (optional)

Use Prisma aggregation functions

text

---

## Frontend (React + Vite)

### 1. Setup React Router with authentication
Create a React app with:

React Router v6

Public route (homepage)

Protected routes for admin and employee

AuthContext with login/logout functions

Redirect to /login if not authenticated

text

### 2. Data fetching with React Query
Set up React Query in the project:

Create API client with Axios

Implement useQuery hooks for:

Fetching employee list

Fetching tasks for current employee

Fetching rankings

Implement useMutation for submitting file number, editing employee, etc.

text

### 3. Table component with sorting and filtering
Build a reusable Table component in React:

Accepts columns (with accessors), data, and optional render functions

Supports sorting by column (click header)

Supports filtering via input fields above the table

Responsive with horizontal scroll on small screens

text

### 4. Public dashboard
Create a PublicDashboard component that:

Fetches employee rankings and section rankings from API

Displays two tables (Employee Ranking, Section Ranking)

When a section is clicked, fetch and show employees of that section with their individual rankings

Use React Query for caching and background updates

text

### 5. Employee task list with submission form
Build a TaskList component for employee dashboard:

Shows assigned tasks in a list/card layout

Each task displays title, description, file number, score, deadline

If no submission yet, show a form to enter completed file number

If submission exists, show the value and an edit button (pre-fill form)

Use React Hook Form for validation

text

### 6. Admin form for task assignment
Create an admin TaskForm that:

Allows selecting KPI Period and Employee (dropdowns from API)

Inputs for title, description, file number, kpi_score, deadline

On submit, call API to create task

Show success/error toast notifications

text

---

## General

### 7. Deployment to Render
Write a deployment guide for Render:

Backend: create a Web Service, set build command, start command, environment variables

Frontend: create a Static Site, point to build output

PostgreSQL: use Render's managed database, set DATABASE_URL

Configure CORS to allow frontend URL

Use prisma migrate deploy in start script

text

### 8. Error handling integration
Implement global error handling in React:

Create an ErrorBoundary component

Use Axios interceptors to display toast messages on API errors

Show inline validation errors from server using React Hook Form's setError

text

---

Feel free to adjust these prompts to match your exact implementation details. They serve as a blueprint to generate consistent, production‑ready code rapidly.
