// We export an interface called JobRole.
// An "interface" in TypeScript describes the shape of an object.
export interface JobRole {
  // The unique ID of the job role, coming from the database.
  jobRoleId: number;

  // The name/title of the job role, e.g. "Software Engineer".
  roleName: string;

  // The location of the job, e.g. "Manchester".
  location: string;

  // Foreign key to the Capability table (e.g. "Engineering", "HR").
  capabilityId: number;

  // Foreign key to the Band table (e.g. "Junior", "Senior").
  bandId: number;

  // The closing date for applications, stored as a string (like "2026-02-09").
  closingDate: Date;
}
