export interface JobRole {
  jobRoleId: number;
  roleName: string;
  location: string;
  capabilityId: number;
  bandId: number;
  closingDate: string;

  capability?: {
    capabilityId: number;
    capabilityName: string | null;
  };
  band?: {
    bandId: number;
    bandName: string | null;
  };
}
