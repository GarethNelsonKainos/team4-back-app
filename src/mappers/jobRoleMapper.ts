import { JobRole } from "../models/jobRole";

import { JobRoleResponse } from "../models/jobRoleResponse";

export class JobRoleMapper {
  
  static toResponse(jobRole: JobRole, capabilityName: string, bandName: string): JobRoleResponse {
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
