import { JobRoleDao } from "../dao/jobRoleDao";
import { JobRole } from "../models/jobRole";
import { JobRoleResponse } from "../models/jobRoleResponse";
import { JobRoleMapper } from "../mappers/jobRoleMapper";

// Mock lookup data — pretend these came from the capability and band database tables.
// Maps an ID to a human-readable name.
const MOCK_CAPABILITIES: Record<number, string> = {
  1: "Engineering",
  2: "Data & AI",
  3: "Platforms",
};

const MOCK_BANDS: Record<number, string> = {
  1: "Associate",
  2: "Senior Associate",
  3: "Consultant",
};

export class JobRoleService {
  private jobRoleDao: JobRoleDao;

  constructor() {
    this.jobRoleDao = new JobRoleDao();
  }

  public async getJobRoles(): Promise<JobRoleResponse[]> {
    const jobRoles: JobRole[] = await this.jobRoleDao.getJobRoles();

    const jobRoleResponses: JobRoleResponse[] = jobRoles.map((jobRole) => {
      // Look up the capability name using the capabilityId, default to "Unknown" if not found
      const capabilityName =
        MOCK_CAPABILITIES[jobRole.capabilityId] || "Unknown";
      // Look up the band name using the bandId, default to "Unknown" if not found
      const bandName = MOCK_BANDS[jobRole.bandId] || "Unknown";

      return JobRoleMapper.toResponse(jobRole, capabilityName, bandName);
    });

    return jobRoleResponses;
  }
}
