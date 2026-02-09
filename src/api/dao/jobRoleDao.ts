import { JobRole } from '../models/JobRole';
// REFACTOR WHEN PRISMA IS LIVE: import { PrismaClient } from '@prisma/client';

/**
 * Data Access Object for JobRoles
 * 
 * REFACTORING GUIDE WHEN PRISMA IS OPERATIONAL:
 * ===============================================
 * 1. Import PrismaClient (uncomment line 2 above)
 * 2. Replace mockJobRoles array with: private prisma = new PrismaClient();
 * 3. Update getAllJobRoles() - replace mock return with: return await this.prisma.jobRoles.findMany();
 * 4. Update getJobRoleById() - replace mock return with: return await this.prisma.jobRoles.findUnique({ where: { jobRoleId: id } });
 * 5. Add database error handling (try/catch blocks)
 * 6. NO changes needed to method signatures or return types - they already match Prisma's pattern
 * 
 * IMPACT: Only this file needs refactoring. Service, Controller, and Routes remain unchanged.
 */
export class JobRoleDao {
  // REFACTOR WHEN PRISMA IS LIVE: Replace this mock array with: private prisma = new PrismaClient();
  // Mock data - temporary until Prisma is running
  private mockJobRoles: JobRole[] = [
    {
      jobRoleId: 1,
      roleName: 'Software Engineer',
      jobLocation: 'Belfast',
      capabilityId: 1,
      bandId: 3,
      closingDate: new Date('2026-03-15'),
    },
    {
      jobRoleId: 2,
      roleName: 'Lead Software Engineer',
      jobLocation: 'London',
      capabilityId: 1,
      bandId: 4,
      closingDate: new Date('2026-03-20'),
    },
    {
      jobRoleId: 3,
      roleName: 'Data Analyst',
      jobLocation: 'Birmingham',
      capabilityId: 2,
      bandId: 2,
      closingDate: new Date('2026-04-01'),
    },
    {
      jobRoleId: 4,
      roleName: 'Product Manager',
      jobLocation: 'Manchester',
      capabilityId: 3,
      bandId: 5,
      closingDate: null,
    },
  ];

  /**
   * Retrieve all job roles from the database
   * 
   * REFACTOR WHEN PRISMA IS LIVE:
   * Replace method body with: return await this.prisma.jobRoles.findMany();
   * Add try/catch for database errors
   * 
   * @returns Promise<JobRole[]>
   */
  async getAllJobRoles(): Promise<JobRole[]> {
    // TEMPORARY: Simulate async database call with mock data
    // REFACTOR: return await this.prisma.jobRoles.findMany();
    return Promise.resolve(this.mockJobRoles);
  }

  /**
   * Retrieve a job role by ID
   * 
   * REFACTOR WHEN PRISMA IS LIVE:
   * Replace method body with: return await this.prisma.jobRoles.findUnique({ where: { jobRoleId: id } });
   * Add try/catch for database errors
   * 
   * @param id - The job role ID
   * @returns Promise<JobRole | null>
   */
  async getJobRoleById(id: number): Promise<JobRole | null> {
    // TEMPORARY: Find in mock data array
    // REFACTOR: return await this.prisma.jobRoles.findUnique({ where: { jobRoleId: id } });
    const jobRole = this.mockJobRoles.find(jr => jr.jobRoleId === id);
    return Promise.resolve(jobRole || null);
  }
}
