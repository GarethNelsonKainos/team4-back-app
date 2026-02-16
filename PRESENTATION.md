# Database Architecture Presentation

## Team 4 Backend Application - Prisma & PostgreSQL

---

## 🎯 Overview (0:00-0:15)

### What is Prisma?

**Prisma** is a modern ORM (Object-Relational Mapping) that bridges the gap between our code and the database.

- **Type-safe database access** - Built-in TypeScript support
- **Intuitive query API** - Write database queries that feel like writing JavaScript
- **Automated migrations** - Track schema changes over time
- **Schema as source of truth** - Single `.prisma` file defines entire database structure

**Why did we choose it?**

- Easy to use for a team project
- Built-in migrations & seeding
- Type-safe queries prevent runtime errors
- Strong TypeScript integration with our project

---

## 📊 Our Database Architecture (0:15-0:45)

### Technology Stack

- **Database**: PostgreSQL (powerful, reliable relational DB)
- **ORM**: Prisma v7.3.0 with Postgres Adapter (see [package.json](package.json) dependencies)
- **Language**: TypeScript
- **Development**: Prisma's local PostgreSQL server

### Schema Overview: 5 Core Models

**Defined in**: [prisma/schema.prisma](prisma/schema.prisma)

```
┌─────────────┐
│    User     │
├─────────────┤
│ userId      │
│ userEmail   │ (UNIQUE)
│ userPassword│
│ createdAt   │
│ updatedAt   │
└─────────────┘

       CONNECTION
           ↓
┌──────────────────────┐
│    JobRole           │
├──────────────────────┤
│ jobRoleId (PK)       │
│ roleName             │
│ jobLocation          │
│ description          │
│ responsibilities     │
│ sharepointUrl        │
│ closingDate          │
│ numberOfOpenPositions│
│ FK: bandId           │
│ FK: capabilityId     │
│ FK: statusId         │
└──────────────────────┘
        ↓    ↓    ↓
    ┌───┴─┬──┴──┬──┴───┐
    │     │     │      │
┌────────┐
│  Band  │
├────────┤
│bandId  │
│bandName│
└────────┘
(Associate, Senior Associate, Consultant)

┌──────────────┐
│ Capability   │
├──────────────┤
│capabilityId  │
│capabilityName│
└──────────────┘
(Engineering, Data & AI, Platforms)

┌────────────┐
│   Status   │
├────────────┤
│ statusId   │
│ statusName │
└────────────┘
(Open, Closed)
```

### Key Design Decisions

- **One-to-Many Relationships**: One Band/Capability/Status → Many JobRoles
- **Referential Integrity**: Foreign keys ensure data consistency
- **Timestamp Tracking**: Auto-managed `createdAt` and `updatedAt` for audit trails
- **Unique Constraints**: Email and Status names must be unique

---

## 🔧 Configuration Overview (0:45-1:00)

### [prisma.config.ts](prisma.config.ts)

```typescript
schema: "prisma/schema.prisma"; // Where our DB definition lives
migrations: {
  path: "prisma/migrations";
} // Where our history is tracked
datasource: {
  url: env("DATABASE_URL");
} // Connection string from .env
```

### [prisma/schema.prisma](prisma/schema.prisma)

- **Generator**: Generates TypeScript client in [src/generated/](src/generated/)
- **Datasource**: PostgreSQL provider (provider = "postgresql")
- **Models**: Define 5 tables with types, constraints, and relationships
- **Generated Output**: [src/generated/client.ts](src/generated/client.ts), [src/generated/models/JobRole.ts](src/generated/models/JobRole.ts), [src/generated/models/Band.ts](src/generated/models/Band.ts), etc.

### [package.json](package.json) Dependencies

```json
"@prisma/client"      // Query builder & runtime
"@prisma/adapter-pg"  // PostgreSQL adapter for v7
"pg"                  // Node.js PostgreSQL driver
```

---

## 🚀 Database Initialization & Seeding (1:00-1:20)

### The Build Process: Ground Up

1. **Schema Definition** → Define models in [prisma/schema.prisma](prisma/schema.prisma)
2. **Migration** → `npx prisma migrate dev` creates SQL and updates DB
3. **Client Generation** → Prisma generates [src/generated/client.ts](src/generated/client.ts)
4. **Seeding** → `npm run seed` (defined in [package.json](package.json) line 8) populates initial data

### Seeding: [prisma/seed.ts](prisma/seed.ts)

The seed file initializes our database with production-like data:

**Order matters!**

```
1. Create Statuses (Open, Closed) - Line 14-22 in seed.ts
   ↓
2. Create Bands (Associate, Senior Associate, Consultant) - Lines 24-37 in seed.ts
   ↓
3. Create Capabilities (Engineering, Data & AI, Platforms) - Lines 39-52 in seed.ts
   ↓
4. Create JobRoles (with FK references to above) - Lines 54-120 in seed.ts
```

**Example Job Roles Created** (in [prisma/seed.ts](prisma/seed.ts)):

- ✅ Software Engineer (lines 54-68) - Engineering, Associate, London
- ✅ Senior Software Engineer (lines 70-84) - Engineering, Senior Associate, Manchester
- ✅ Data Scientist (lines 86-100) - Data & AI, Senior Associate, Belfast
- ✅ Platform Engineer (lines 102-120) - Platforms, Consultant, Edinburgh

### Key Script Commands

```bash
npm run seed           # Run database seeding
npx prisma migrate dev # Create and run migrations
npx prisma db push    # Push schema changes without migrations
npx prisma studio    # Visual database browser
```

---

## 🔄 Migrations: Version Control for Your Database (1:20-1:35)

### What Are Migrations?

Migrations are timestamped SQL files that track every database schema change.

### Our Migration History

```
prisma/migrations/
├── 20260209153759_v1_migration/
│   └── migration.sql        # Initial tables: Band, Capability, JobRole, Status
├── 20260209155903_test_migration/
│   └── migration.sql        # Test changes
├── 20260209162105_final_test/
│   └── migration.sql        # Final refinements
├── 20260210143054_make_jobrole_fields_required/
│   └── migration.sql        # Made fields NOT NULL
├── 20260211105259_add_user_table/
│   └── migration.sql        # Added User model
└── 20260212105405_add_jobrole_fields_and_status_table/
    └── migration.sql        # Added additional fields & refined Status
```

### Why Migrations Matter

- **Version Control**: Every schema change is tracked and reversible
- **Team Collaboration**: New team members run `prisma migrate deploy` to sync schema
- **Audit Trail**: Know exactly when and how tables evolved
- **Production Safety**: Test migrations in dev before deploying

### Migration Workflow

```bash
npm install              # Installs Prisma
npx prisma migrate dev   # Creates a new migration & applies it
# Edit schema → Name migration → SQL generated → Applied to DB
```

---

## 💾 ORM Layer: Data Access (1:35-1:50)

### How We Query Data: The DAO Pattern

Our **Data Access Objects (DAOs)** encapsulate all database queries. Located in [src/dao/](src/dao/)

### Example: [src/dao/jobRoleDao.ts](src/dao/jobRoleDao.ts)

```typescript
export class JobRoleDao {
  private prisma: PrismaClient;

  async getJobRoles(): Promise<JobRole[]> {
    // Type-safe query with auto-complete (lines 15-25)
    const jobRoles = await this.prisma.jobRole.findMany({
      include: {
        capability: true, // JOIN capability
        band: true, // JOIN band
        status: true, // JOIN status
      },
    });
    // Returns strongly typed JobRole[] with related data (lines 26-52)
  }
}
```

Full implementation: [src/dao/jobRoleDao.ts](src/dao/jobRoleDao.ts) lines 14-60

### Prisma Query Methods Used

Examples in [prisma/seed.ts](prisma/seed.ts):

- **`findMany()`** - Get multiple records with filters/includes (in [src/dao/jobRoleDao.ts](src/dao/jobRoleDao.ts#L15))
- **`create()`** - Insert single record (used in [prisma/seed.ts](prisma/seed.ts#L14), lines 14-120)
- **`findUnique()`** - Get one record by unique field
- **`update()`** - Modify existing record
- **`delete()`** - Remove record

### Type Safety Benefits

Types generated from [prisma/schema.prisma](prisma/schema.prisma) into:

- [src/generated/client.ts](src/generated/client.ts) - Main Prisma Client
- [src/generated/models/JobRole.ts](src/generated/models/JobRole.ts) - JobRole type
- [src/generated/models/Band.ts](src/generated/models/Band.ts) - Band type
- [src/generated/models/User.ts](src/generated/models/User.ts) - User type
- [src/generated/enums.ts](src/generated/enums.ts) - Enum types

---

## 🌐 API Integration: From DB to Response (1:50-2:00)

### Request Flow: Database to API Response

```
HTTP GET /api/jobroles
         ↓
[src/controllers/apiJobRoleController.ts](src/controllers/apiJobRoleController.ts)
         ↓
[src/services/jobRoleService.ts](src/services/jobRoleService.ts)
         ↓
[src/dao/jobRoleDao.ts](src/dao/jobRoleDao.ts)
         ↓
PRISMA QUERY (SELECT * FROM jobroles...)
         ↓
Database Returns Data
         ↓
MAPPING [src/mappers/jobRoleMapper.ts](src/mappers/jobRoleMapper.ts)
(Transform PrismaJobRole → JobRole)
         ↓
SERVICE returns [src/models/jobRoleResponse.ts](src/models/jobRoleResponse.ts)
         ↓
CONTROLLER returns HTTP 200 + JSON
         ↓
REST API Response: [{ jobRoleId: 1, roleName: "..." }, ...]
```

### Layer Breakdown

**Controller** - [src/controllers/apiJobRoleController.ts](src/controllers/apiJobRoleController.ts)

```typescript
public getJobRoles = async (req: Request, res: Response) => {
  const jobRoles = await this.jobRoleService.getJobRoles();
  res.status(200).json(jobRoles);  // Send to client
};
```

Full implementation: [src/controllers/apiJobRoleController.ts](src/controllers/apiJobRoleController.ts#L9)

**Service** - [src/services/jobRoleService.ts](src/services/jobRoleService.ts)

- Business logic layer
- Calls DAO, applies transformations
- Returns [src/models/jobRoleResponse.ts](src/models/jobRoleResponse.ts) type

**DAO** - [src/dao/jobRoleDao.ts](src/dao/jobRoleDao.ts)

- Direct database queries via Prisma using [src/generated/client.ts](src/generated/client.ts)
- Returns [src/models/jobRole.ts](src/models/jobRole.ts) type from DB

**Mapper** - [src/mappers/jobRoleMapper.ts](src/mappers/jobRoleMapper.ts)

- Transforms Prisma types → API response types
- Maps [src/generated/models/JobRole.ts](src/generated/models/JobRole.ts) to [src/models/jobRoleResponse.ts](src/models/jobRoleResponse.ts)
- Ensures consistent response format

---

## ✨ Dev Experience Commands

### Quick Reference

**All commands defined in** [package.json](package.json) **lines 4-15**

```bash
# Development
npm run dev              # Start watch mode (src/index.ts) → runs tsx watch src/index.ts
npm run seed            # Initialize/reset database with data (runs prisma/seed.ts)
npm test                # Run vitest suite (see tests in src/test/*.test.ts)

# Database
npx prisma studio      # GUI database browser
npx prisma migrate dev # Create & apply migrations (creates prisma/migrations/*.sql)
npm run build           # TypeScript compilation (tsconfig.json)

# Code Quality
npm run format          # Code formatting (Biome) - see biome.json config
npm run lint            # Linting (Biome) - see biome.json config
npm run check           # Full code check
```

**Prisma Configuration** - [prisma.config.ts](prisma.config.ts)
**TypeScript Config** - [tsconfig.json](tsconfig.json)
**Vitest Config** - [vitest.config.ts](vitest.config.ts)
**Biome Config** - [biome.json](biome.json)

---

## 🎓 Summary: The Big Picture

**What We Built:**

- ✅ PostgreSQL database with 5 interconnected models (defined in [prisma/schema.prisma](prisma/schema.prisma))
- ✅ Type-safe Prisma ORM for all queries (generated in [src/generated/](src/generated/))
- ✅ 6 migrations tracking complete schema evolution (stored in [prisma/migrations/](prisma/migrations/))
- ✅ Seed file for reproducible test data ([prisma/seed.ts](prisma/seed.ts))
- ✅ DAOs encapsulating all database access (in [src/dao/](src/dao/))
- ✅ REST APIs exposing job role data (in [src/controllers/](src/controllers/))

**Key Technologies:**

- **Prisma** - Bridges code ↔ database with type safety ([package.json](package.json) + [prisma.config.ts](prisma.config.ts))
- **PostgreSQL** - Robust relational database (configured via DATABASE_URL env var)
- **TypeScript** - Catches errors at compile time (config in [tsconfig.json](tsconfig.json))
- **Migrations** - Version control for schema changes (tracked in [prisma/migrations/](prisma/migrations/))

**Architecture Flow:**

```
Client
  ↓
HTTP GET /api/jobroles (defined in src/index.ts)
  ↓
[src/controllers/apiJobRoleController.ts](src/controllers/apiJobRoleController.ts)
  ↓
[src/services/jobRoleService.ts](src/services/jobRoleService.ts)
  ↓
[src/dao/jobRoleDao.ts](src/dao/jobRoleDao.ts)
  ↓
[src/generated/client.ts](src/generated/client.ts) (Prisma Client)
  ↓
PostgreSQL (via [prisma/schema.prisma](prisma/schema.prisma) schema)
```

**Why This Matters:**

- **Type Safety** prevents runtime errors (see [src/generated/models/](src/generated/models/))
- **Migrations** make database evolution trackable & reversible ([prisma/migrations/](prisma/migrations/))
- **Seeds** ensure consistent test data ([prisma/seed.ts](prisma/seed.ts))
- **ORM** abstracts SQL complexity (Prisma handles queries)
- **Team Ready** - Easy onboarding with migrations ([prisma/migrations/migration_lock.toml](prisma/migrations/migration_lock.toml))

---

## Questions?

Thank you! 🙌
