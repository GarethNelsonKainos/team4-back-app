import { JobRole } from "../models/jobRole";
import { JobRoleResponse } from "../models/jobRoleResponse";

export class JobRoleMapper {
  static toResponse(jobRole: JobRole): JobRoleResponse {
    const capabilityName = jobRole.capability?.capabilityName || "Unknown";
    const bandName = jobRole.band?.bandName || "Unknown";

    return {
      jobRoleId: jobRole.jobRoleId,
      roleName: jobRole.roleName,
      location: jobRole.location,
      capability: capabilityName,
      band: bandName,
      closingDate: jobRole.closingDate,
    };
  }
}
