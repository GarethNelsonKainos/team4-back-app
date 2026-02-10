import { JobRoleDao } from "../dao/jobRoleDao";
import { JobRoleResponse } from "../models/jobRoleResponse";
import { JobRoleMapper } from "../mappers/jobRoleMapper";

export class JobRoleService {
  private jobRoleDao: JobRoleDao;

  constructor() {
    this.jobRoleDao = new JobRoleDao();
  }

  public async getJobRoles(): Promise<JobRoleResponse[]> {
    const jobRoles = await this.jobRoleDao.getJobRoles();

    const jobRoleResponses: JobRoleResponse[] = jobRoles.map((jobRole) => {
      return JobRoleMapper.toResponse(jobRole);
    });

    return jobRoleResponses;
  }
}
