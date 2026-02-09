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
