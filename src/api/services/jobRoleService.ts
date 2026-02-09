import { JobRoleDao } from '../dao/JobRoleDao';
import { JobRoleMapper } from '../mappers/JobRoleMapper';
import { JobRoleResponse } from '../models/jobRoleResponse';

/**
 * Service layer for Job Roles business logic
 * Orchestrates DAO calls and data transformation
 */
export class JobRoleService {
  private jobRoleDao: JobRoleDao;

  constructor() {
    this.jobRoleDao = new JobRoleDao();
  }

  /**
   * Get all job roles
   * @returns Promise<JobRoleResponse[]> - Array of job role DTOs
   */
  async getAllJobRoles(): Promise<JobRoleResponse[]> {
    const jobRoles = await this.jobRoleDao.getAllJobRoles();
    return JobRoleMapper.toResponseArray(jobRoles);
  }

  /**
   * Get a single job role by ID
   * @param id - The job role ID
   * @returns Promise<JobRoleResponse | null> - Job role DTO or null if not found
   */
  async getJobRoleById(id: number): Promise<JobRoleResponse | null> {
    const jobRole = await this.jobRoleDao.getJobRoleById(id);
    
    if (!jobRole) {
      return null;
    }
    
    return JobRoleMapper.toResponse(jobRole);
  }
}
