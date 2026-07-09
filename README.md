# Intern-Hiring-React
A full-stack project for intern evaluation (React + Next.js + Node.js + PostgreSQL).

## Project Overview

The **Employee Leave Management System** is a **full-stack web application** designed to evaluate interns on their proficiency in **React, Next.js, Node.js, and PostgreSQL**. This system allows employees to apply for leaves, managers to approve/reject leave requests, and admins to manage users, view reports, and oversee the entire system.

**Expected Completion Time:** 1 week  
**Tech Stack:** React, Next.js (App Router), Node.js, Express, PostgreSQL, Prisma ORM

## Roles and Permissions

| Role         | Permissions                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------- |
| **Employee** | Apply for leave, view own leave history, view leave balance, cancel own leave requests      |
| **Manager**  | Approve/reject leave requests, view team leave requests, view team leave reports            |
| **Admin**    | Manage users (CRUD), view all leave requests, generate reports, manage leave types/policies |


## Features to Implement

### 1. **User Authentication & Authorization**

- User registration (Admin can create users)
- User login/logout 
- Role-based access control (Employee, Manager, Admin)
- Password hashing

### 2. **Leave Management**

- **Employee:**
  - Apply for leave (type, start date, end date, reason)
  - View own leave history and balance
  - Cancel own pending leave requests
- **Manager:**
  - View leave requests from their team
  - Approve/reject leave requests
  - View team leave calendar
- **Admin:**
  - Manage leave types (e.g., Annual, Sick, Maternity)
  - Set leave policies (e.g., max days per type)

### 3. **Leave Request Workflow**

- Employee submits a leave request → Manager receives notification
- Manager approves/rejects → Employee receives notification
- System updates leave balance automatically

### 4. **Reports (Admin Only)**

- **Leave Summary Report:** Total leaves taken by type, department, or employee
- **Leave Balance Report:** Remaining leave balance for all employees
- **Leave Calendar:** Visual representation of leaves (by team or company-wide)
- Export reports as **CSV/Excel** (bonus)

### 5. **Database Schema (PostgreSQL + Prisma)**

- **User:** id, name, email, password, role (Employee/Manager/Admin), managerId (for reporting hierarchy)
- **LeaveType:** id, name (e.g., Annual, Sick), maxDays
- **LeaveRequest:** id, userId, leaveTypeId, startDate, endDate, status (Pending/Approved/Rejected), reason, createdAt
- **LeaveBalance:** id, userId, leaveTypeId, balance (auto-updated)

### 6. **API Endpoints (RESTful)**

- **Auth:** `POST /api/auth/login`, `POST /api/auth/logout`
- **Users:** `GET /api/users` (Admin), `POST /api/users` (Admin), `GET /api/users/me`
- **Leave Types:** `GET /api/leave-types`, `POST /api/leave-types` (Admin)
- **Leave Requests:**
  - `GET /api/leave-requests` (Employee: own, Manager: team, Admin: all)
  - `POST /api/leave-requests` (Employee)
  - `PUT /api/leave-requests/:id` (Manager: approve/reject, Employee: cancel)
- **Reports:** `GET /api/reports/leave-summary`, `GET /api/reports/leave-balance` (Admin)

### 7. **Frontend (Next.js App Router)**

- **Pages:**
  - Login
  - Dashboard (role-specific)
  - Leave Application (Employee)
  - Leave Requests (Manager)
  - User Management (Admin)
  - Reports (Admin)
- **UI Requirements:**
  - Responsive design (Tailwind CSS recommended)
  - Form validation (client-side + server-side)
  - Loading states and error handling
  - Notifications (toast messages for actions)


### Prerequisites

- Node.js (v22+)
- PostgreSQL (local or Docker)
- Git
- Basic knowledge of TypeScript (recommended)

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/ReadNRevise/Intern-Hiring-React.git
cd Intern-Hiring-React
```

#### 2. Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Create your `.env` file (copying `.env.example`):
   ```bash
   cp .env.example .env
   ```
   *Make sure `DATABASE_URL` matches your local PostgreSQL instance.*
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run migrations and generate the Prisma Client:
   ```bash
   npx prisma migrate dev
   ```
5. Seed the database with test accounts (Admin, Managers, Employees, Leave Policies):
   ```bash
   npx prisma db seed
   ```
6. Start the backend developer server:
   ```bash
   npm run dev
   ```
   *(Running on http://localhost:3001)*

#### 3. Frontend Setup
1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Create your `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *(Running on http://localhost:3000)*

---

## Unit & Integration Testing

The project contains unit and integration test suites validating both frontend utilities and full backend workflows.

### Running Backend Tests
From the `server` directory:
```bash
npm run test
```
*Runs the API integration test suite (`tests/api.test.ts`) covering Authentication, RBAC route guarding, Leave request validations, and Approval/Rejection transitions.*

To run the standalone concurrency test:
```bash
node --loader ts-node/esm tests/concurrency.test.ts
```
*Validates the atomic balance decrement transaction under simultaneous dual approval requests, asserting that only one request succeeds and balance never goes negative.*

### Running Frontend Tests
From the `client` directory:
```bash
npm run test
```
*Runs the frontend utility tests including role-based dashboard path resolution.*

---

## Documented Design Decisions

1. **No Self-Registration Endpoint**:
   - In accordance with the assignment specifications, users cannot register themselves. Only an authenticated **Admin** can create new employee/manager accounts via the User Management panel. This ensures strict corporate directory integrity.
2. **Top-Level Reporting Hierarchy (`managerId: null`)**:
   - Employees report to a specific Manager. Top-level managers and Admins have `managerId: null`, meaning they have no direct supervisor above them. This design handles the root nodes of the organizational hierarchy gracefully.
3. **Cookie-Only Authentication**:
   - The application does not store JWT tokens in `localStorage` or `sessionStorage` to mitigate XSS vulnerabilities. Cookies are sent with `httpOnly` flags, and the Next.js client uses `credentials: "include"` for all fetch operations.

---

## Deployment Instructions

Detailed deployment instructions for Vercel, Render, and PostgreSQL setup are available in [DEPLOYMENT.md](file:///c:/Users/arjun/Intern-Hiring-React/DEPLOYMENT.md).

## 💡 Tips for Interns

- **Refer to Docs**:
  - [Next.js Docs](https://nextjs.org/docs)
  - [Prisma Docs](https://www.prisma.io/docs)
  - [Express Docs](https://expressjs.com/)
  - [Jest Docs](https://jestjs.io/docs/getting-started)
  - [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)

- **Ask for Help**: If stuck, ask for clarification on requirements or concepts.

## Additional Notes

- **Bonus Points**:
  - Leave calendar with drag-and-drop
  - Integration tests or E2E tests
## 🤝 Need Help?

Reach out to the team via email for any questions or clarifications!
