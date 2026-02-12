# team4-back-app

Team 4 Backend Application Feb/March 2026

# Database Setup Guide

This project uses Prisma ORM with Prisma Postgres for local development.

## First-Time Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Local Prisma Postgres Server

```bash
npx prisma dev --detach
```

This starts a local PostgreSQL server in the background. You'll see output with connection details.

### 3. Get Your Database URL

Run the interactive mode to get your connection URL:

```bash
npx prisma dev
```

Press `h` to view the HTTP connection URL. It will look like:

```
prisma+postgres://localhost:51213/?api_key=YOUR_API_KEY
```

### 4. Create Your .env File

Copy `.env.example` and add your actual DATABASE_URL:

```bash
cp .env.example .env
```

Then edit `.env` and paste your connection URL:

```
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=YOUR_ACTUAL_API_KEY"
```

### 5. Run Migrations

Create the database tables:

```bash
npx prisma migrate dev
```

This will apply the schema and create the tables in your local database.

### 6. Seed the Database

Add sample data to your database:

```bash
npm run seed
```

This creates sample bands, capabilities, and job roles for testing.

### 7. Generate Prisma Client

(This usually happens automatically with migrate, but you can run it manually):

```bash
npx prisma generate
```

### 8. Start the Development Server

```bash
npm run dev
```

Your API will be running at http://localhost:3000

## Testing the API

Visit http://localhost:3000/api/job-roles to see the job roles from your database.

## Development Commands

### Running the Application

**Development mode** (with hot reload):
```bash
npm run dev
```
The server will restart automatically when you make changes to the code.

**Production mode**:
```bash
npm run build  # Compile TypeScript to JavaScript
npm start      # Run the compiled application
```

### Building the Application

Compile TypeScript to JavaScript (output in `dist/` folder):
```bash
npm run build
```

### Testing

**Run all tests**:
```bash
npm test
```

**Run tests with interactive UI**:
```bash
npm run test:ui
```

**Run tests with coverage report**:
```bash
npm run coverage
```
Coverage reports are generated in the `coverage/` folder. Open `coverage/index.html` in your browser to view detailed coverage.

### Database Migrations

**Create a new migration** (after changing `schema.prisma`):
```bash
npx prisma migrate dev --name your_migration_name
```

**Apply existing migrations**:
```bash
npx prisma migrate dev
```

**Reset database** (⚠️ deletes all data):
```bash
npx prisma migrate reset
```

**View migration status**:
```bash
npx prisma migrate status
```

**Generate Prisma Client** (after schema changes):
```bash
npx prisma generate
```

### Linting and Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting.

**Format code**:
```bash
npm run format
```

**Lint and fix issues**:
```bash
npm run lint
```

**Format and lint together**:
```bash
npm run check
```

**CI check** (for CI/CD pipelines - doesn't modify files):
```bash
npm run ci:check
```

## Useful Commands

- **Check running Prisma servers**: `npx prisma dev ls`
- **Stop Prisma server**: `npx prisma dev stop`
- **View database in browser**: `npx prisma studio`
- **Reset database**: `npx prisma migrate reset` (⚠️ This deletes all data!)
- **Re-seed database**: `npm run seed`

## Team Workflow

Each team member should:

1. Run their own local Prisma Postgres server (`npx prisma dev --detach`)
2. Create their own `.env` file with their local DATABASE_URL
3. Run migrations to sync the schema (`npx prisma migrate dev`)
4. Optionally seed their database (`npm run seed`)

**Important**: Never commit `.env` to git! It's already in `.gitignore`.

## Merging Database Changes

When merging branches with schema changes:

1. Pull/merge the latest code
2. Run `npm install` (in case of new dependencies)
3. Run `npx prisma migrate dev` (applies new migrations)
4. Run `npx prisma generate` (updates Prisma Client)

## Production (Future AWS Deployment)

In production, you'll use AWS RDS instead of local Prisma Postgres. The `DATABASE_URL` will point to your RDS instance. The same migrations will work - just run them against the production database.
