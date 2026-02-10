import { JobRole } from "@prisma/client";
import { JobRoleResponse } from "../models/jobRoleResponse";

export class JobRoleMapper {
  static toResponse(jobRole: JobRole, capabilityName: string, bandName: string): JobRoleResponse {
    if (jobRole.roleName == null) throw new Error("roleName cannot be null");
    if (jobRole.jobLocation == null) throw new Error("jobLocation cannot be null");
    if (jobRole.closingDate == null) throw new Error("closingDate cannot be null");
    return {
      jobRoleId: jobRole.jobRoleId,
      roleName: jobRole.roleName,
      location: jobRole.jobLocation,
      capability: capabilityName,
      band: bandName,
      closingDate: jobRole.closingDate.toISOString(),
    };
  }
}
