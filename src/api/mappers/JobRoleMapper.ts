import { JobRole } from '../models/JobRole';
import { JobRoleResponse } from '../models/JobRoleResponse';

/**
 * Maps JobRole entities to JobRoleResponse DTOs
 */
export class JobRoleMapper {
  static toResponse(jobRole: JobRole): JobRoleResponse {
    return {
      jobRoleId: jobRole.jobRoleId,
      roleName: jobRole.roleName,
      jobLocation: jobRole.jobLocation,
      capabilityId: jobRole.capabilityId,
      bandId: jobRole.bandId,
      closingDate: jobRole.closingDate ? jobRole.closingDate.toISOString().split('T')[0] : null,
    };
  }

  static toResponseArray(jobRoles: JobRole[]): JobRoleResponse[] {
    return jobRoles.map(jobRole => this.toResponse(jobRole));
  }
}
