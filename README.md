# team4-back-app

Team 4 Backend Application - Feb/March 2026

This project uses Express.js, TypeScript, Prisma ORM, and Prisma Postgres for local development.

## Table of Contents

- [First-Time Setup](#first-time-setup)
- [Development Commands](#development-commands)
  - [Running the API](#running-the-api)
  - [Building](#building)
  - [Testing](#testing)
  - [Linting & Formatting](#linting--formatting)
  - [Database Migrations](#database-migrations)
- [Team Workflow](#team-workflow)
- [Production Deployment](#production-deployment)

---

## First-Time Setup

Follow these steps when cloning the project for the first time:

**1. Install Dependencies**

```bash
npm install
```

**2. Start Local Prisma Postgres Server**

```bash
npx prisma dev --detach
```

This starts a local PostgreSQL server in the background.

**3. Get Your Database URL**

```bash
npx prisma dev
```

Press `h` in the interactive mode to view your connection URL. It looks like:

```
prisma+postgres://localhost:51213/?api_key=YOUR_API_KEY
```

**4. Configure Environment Variables**

```bash
cp .env.example .env
```

Edit `.env` and paste your actual database URL:

```env
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=YOUR_ACTUAL_API_KEY"
```

⚠️ **Never commit `.env` to git** - it's already in `.gitignore`.

**5. Run Database Migrations**

```bash
npx prisma migrate dev
```

This creates all database tables from the schema. Prisma Client is generated automatically.

**6. Seed the Database**

```bash
npm run seed
```

Populates your database with sample bands, capabilities, and job roles for testing.

**7. Start Development Server**

```bash
npm run dev
```

API runs at **http://localhost:3000**

**8. Test the API**  
Visit http://localhost:3000/api/job-roles to verify the setup.

---

---

## Development Commands

### Running the API

**Development Mode** (with hot reload)

```bash
npm run dev
```

Runs at http://localhost:3000 with automatic reloading on file changes.

**Production Mode**

```bash
npm run build    # Compile TypeScript to JavaScript
npm start        # Run compiled code from dist/
```

### Building

```bash
npm run build
```

Compiles TypeScript to JavaScript in the `dist/` folder.

### Testing

```bash
npm test              # Run all tests in watch mode
npm run test:ui       # Open interactive test UI
npm run coverage      # Generate coverage report (saved in coverage/)
```

Tests use Vitest. Coverage reports open automatically in your browser.

### Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for code quality.

```bash
npm run format        # Auto-format all files
npm run lint          # Lint and auto-fix issues
npm run check         # Run format + lint together
npm run ci:check      # CI mode (check only, no fixes)
```

### Database Migrations

**Create New Migration**

```bash
npx prisma migrate dev --name your_migration_name
```

Creates a migration from changes in `prisma/schema.prisma`.

**Apply Pending Migrations**

```bash
npx prisma migrate dev
```

**Reset Database** (⚠️ deletes all data)

```bash
npx prisma migrate reset
```

Drops DB, recreates it, applies migrations, and runs seed.

**Production Deployment**

```bash
npx prisma migrate deploy
```

**Other Database Commands**

```bash
npx prisma studio          # Open database GUI in browser
npx prisma generate        # Regenerate Prisma Client
npx prisma dev ls          # List running Prisma servers
npx prisma dev stop        # Stop local Prisma server
npm run seed               # Re-seed database
```

---

---

## Team Workflow

**Each Team Member:**

1. Run your own local Prisma Postgres server: `npx prisma dev --detach`
2. Create your own `.env` file with your local `DATABASE_URL`
3. Run migrations to sync schema: `npx prisma migrate dev`
4. (Optional) Seed your database: `npm run seed`

**When Merging Branches with Schema Changes:**

1. Pull/merge latest code
2. `npm install` (if new dependencies)
3. `npx prisma migrate dev` (apply new migrations)
4. `npx prisma generate` (update Prisma Client)

---

## Production Deployment

Production uses AWS RDS instead of local Prisma Postgres. Set `DATABASE_URL` to your RDS instance in production environment variables. The same migrations work - run them against the production database using `npx prisma migrate deploy`.
