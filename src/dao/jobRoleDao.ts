import { JobRole } from "../models/jobRole";

export class JobRoleDao {
  async getJobRoles(): Promise<JobRole[]> {
    // For now, we'll return some sample data.
    return [
      {
        jobRoleId: 1,
        roleName: "Software Engineer",
        location: "London",
        capabilityId: 1,
        bandId: 1,
        closingDate: new Date("2024-12-31"),
      },
      {
        jobRoleId: 2,
        roleName: "Data Scientist",
        location: "New York",
        capabilityId: 2,
        bandId: 2,
        closingDate: new Date("2025-01-15"),
      },
    ];
  }
}
