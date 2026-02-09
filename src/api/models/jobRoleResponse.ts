/**
 * JobRoleResponse DTO - the response format returned to clients
 */
export interface JobRoleResponse {
  jobRoleId: number;
  roleName: string;
  jobLocation: string;
  capabilityId: number;
  bandId: number;
  closingDate: string | null; // ISO 8601 format
}
