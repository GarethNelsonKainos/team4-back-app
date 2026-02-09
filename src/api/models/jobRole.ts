/**
 * JobRole model representing the database entity
 */
export interface JobRole {
  jobRoleId: number;
  roleName: string;
  jobLocation: string;
  capabilityId: number;
  bandId: number;
  closingDate: Date | null;
}
