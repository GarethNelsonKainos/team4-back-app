import { JobRoleDao } from "../dao/jobRoleDao";
import { JobRoleResponse } from "../models/jobRoleResponse";
import { JobRoleMapper } from "../mappers/jobRoleMapper";
import { JobRole } from "@prisma/client";

export class JobRoleService {
  private jobRoleDao: JobRoleDao;

  constructor() {
    this.jobRoleDao = new JobRoleDao();
  }

  public async getJobRoles(): Promise<JobRoleResponse[]> {
    const jobRoles = await this.jobRoleDao.getJobRoles();

    const jobRoleResponses: JobRoleResponse[] = jobRoles.map((jobRole) => {
      // Use the capability and band names from the included relations
      const capabilityName = jobRole.capability.capabilityName;
      const bandName = jobRole.band.bandName;

      return JobRoleMapper.toResponse(jobRole, capabilityName, bandName);
    });

    return jobRoleResponses;
  }
}
