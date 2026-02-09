# API Implementation Plan: Job Roles

## Overview
Build a GET /api/job-roles endpoint using Express and Prisma ORM with a layered architecture:  
Routes → Controllers → Services → DAO → Prisma → Database

## Project Structure
```
src/api/
├── controllers/JobRoleController.ts
├── services/JobRoleService.ts
├── dao/JobRoleDao.ts
├── models/JobRoleResponse.ts
├── mappers/JobRoleMapper.ts
└── routes/jobRoleRoutes.ts

prisma/schema.prisma
.env
src/index.ts (modified)
```

---

## Implementation Stages

### Stage 1: Prisma Setup
- Install `@prisma/client` and `prisma`
- Initialize Prisma with `npx prisma init`
- Configure `.env` with database URL
- Set up `prisma/schema.prisma` with JobRoles model
- Run `npx prisma generate` to auto-generate types

### Stage 2: Models & Utilities
- Create `JobRoleResponse.ts` interface (response DTO)
- Create `JobRoleMapper.ts` (maps Prisma JobRoles → JobRoleResponse)

### Stage 3: Data Layer
- Create `JobRoleDao.ts` (queries database with Prisma)

### Stage 4: Business Layer
- Create `JobRoleService.ts` (calls DAO, applies mapper)

### Stage 5: API Layer
- Create `JobRoleController.ts` (handles HTTP responses/errors)
- Create `jobRoleRoutes.ts` (defines GET /job-roles route)
- Update `index.ts` (mount router at /api prefix)

### Stage 6: Test
- Run application and test GET /api/job-roles endpoint

---

## Key Notes

- Prisma auto-generates types from schema (no manual model needed)
- Each layer has single responsibility
- Error response format: `{ "error": "message" }`
- Add `.env` to `.gitignore`

