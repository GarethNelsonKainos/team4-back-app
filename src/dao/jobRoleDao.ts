import { JobRole } from "../models/jobRole";
import { prisma } from "../db";

export class JobRoleDao {
  async getJobRoles(): Promise<JobRole[]> {
    // Fetch job roles from database with related capability and band data
    const jobRoles = await prisma.jobRole.findMany({
      include: {
        capability: true,
        band: true,
      },
    });

    // Map Prisma data to our JobRole model format
    return jobRoles.map((jr) => ({
      jobRoleId: jr.jobRoleId,
      roleName: jr.roleName || "",
      location: jr.jobLocation || "",
      capabilityId: jr.capabilityId,
      bandId: jr.bandId,
      closingDate: jr.closingDate || new Date(),
      capability: jr.capability,
      band: jr.band,
    }));
  }
}
