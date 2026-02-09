// This is the shape of the data we send back to the frontend (API response).
export interface JobRoleResponse {
  // A simpler ID field name for the client.
  jobRoleId: number;

  // Same as roleName from JobRole, but we can keep it nullable.
  roleName: string;

  // Same as jobLocation from JobRole.
  location: string;

  // Optional: human-readable capability name (if we join tables).
  capability: string;

  // Optional: human-readable band name.
  band: string;

  // Closing date as a string (e.g. "2026-02-09").
  closingDate: Date;
}
