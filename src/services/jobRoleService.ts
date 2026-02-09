import { JobRoleDao } from "../dao/jobRoleDao";
import { JobRole } from "../models/jobRole";
import { JobRoleResponse } from "../models/jobRoleResponse";
import { JobRoleMapper } from "../mappers/jobRoleMapper";

export class JobRoleService {
  private jobRoleDao: JobRoleDao;

  constructor() {
    this.jobRoleDao = new JobRoleDao();
  }

  public async getJobRoles(): Promise<JobRoleResponse[]> {
    const jobRoles: JobRole[] = await this.jobRoleDao.getJobRoles();

    const jobRoleResponses: JobRoleResponse[] = jobRoles.map((jobRole) => {
      // Use the capability and band names from the included relations
      const capabilityName = jobRole.capability?.capabilityName || "Unknown";
      const bandName = jobRole.band?.bandName || "Unknown";

      return JobRoleMapper.toResponse(jobRole, capabilityName, bandName);
    });

    return jobRoleResponses;
  }
}
