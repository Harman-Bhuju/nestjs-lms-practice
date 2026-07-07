# Basic LMS Practice (NestJS Learning Project)

This is a basic backend REST API for a Learning Management System (LMS) that I created while learning **NestJS**, **TypeScript**, and **TypeORM**. It serves as a practice project to understand core backend concepts.

## What I Learned / Features Implemented

- **Authentication & Authorization:** Secure user login and registration using JWT (JSON Web Tokens).
- **Role-Based Access Control (RBAC):** Supports `ADMIN` and `TEACHER` roles, restricted via custom guards (`@RolesGuard`).
- **Course Management:** Basic CRUD operations for courses.
  - Teachers can create, read, update, and soft-delete their own courses.
  - Admins can manage all courses in the system.
- **Custom Decorators:** Implementation of custom decorators like `@CurrentUser` for clean parameter extraction.
- **Soft Deletes:** Prevents accidental data loss by "soft deleting" courses (moves to a recycle bin state with a `deletedBy` tracker).

## Tech Stack Used

- **Framework:** NestJS
- **Language:** TypeScript
- **Database ORM:** TypeORM
- **Authentication:** Passport, JWT
- **Database:** (Insert your DB here, e.g., PostgreSQL/MySQL)

## Project Setup

```bash
# Clone the repository
$ git clone <your-repo-url>

# Go into the project directory
$ cd LMS

# Install dependencies
$ npm install
```

## Environment Variables

Create a `.env` file in the root directory and add your variables (example):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=root
DB_PASS=password
DB_NAME=lms_db
JWT_SECRET=your_super_secret_key
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Author

- Harman Bhuju
