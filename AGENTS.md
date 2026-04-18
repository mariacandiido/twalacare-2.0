# Repository Guidelines

## Project Structure & Module Organization
This repository is organized as a monorepo with separate `backend` and `frontend` directories.

- **Backend**: Node.js and Express API. It follows a layered architecture (Controllers -> Services -> Repositories/Prisma). The project is currently in transition from **Sequelize** to **Prisma** for ORM; check both `src/database` and `prisma/schema.prisma`.
- **Frontend**: React application built with Vite and TypeScript. It uses **Tailwind CSS** for styling and **Radix UI** for accessible components. State management is handled primarily via **Zustand** stores in `src/store`.

## Build, Test, and Development Commands
Commands should be run within their respective directories (`backend/` or `frontend/`).

### Backend
- **Development**: `npm run dev` (uses nodemon)
- **Production**: `npm start`
- **Testing**: `npm test` (runs Jest with coverage)
- **Database (Prisma)**:
  - `npx prisma db push`: Sync database schema
  - `node prisma/seed.js`: Populate database with seed data
  - `npx prisma studio`: Visual database explorer

### Frontend
- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Admin Interface**: `npm run dev:admin` (runs with admin-specific Vite config)

## Coding Style & Naming Conventions
- **Frontend**: Strict TypeScript. Components are mostly functional using React hooks. CSS is handled via Tailwind utility classes.
- **Backend**: JavaScript with common module patterns. Business logic resides in `src/services`, while database interactions are abstracted into repositories or Prisma client.
- **Naming**: Use camelCase for variables and functions, PascalCase for React components.

## Testing Guidelines
- **Framework**: Jest is used for backend testing.
- **Location**: Backend tests are located in the `backend/tests/` directory.
- **Execution**: Run `npm test` in the `backend` folder to execute all tests with coverage reporting.

## Commit & Pull Request Guidelines
(No specific git conventions detected as this is not currently a git repository).
