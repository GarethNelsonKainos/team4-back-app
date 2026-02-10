import { JobRole } from "@prisma/client";
import { prisma } from "../db";

export class JobRoleDao {
  async getJobRoles(): Promise<(JobRole & { capability: any; band: any })[]> {
    // Fetch job roles from database with related capability and band data
    const jobRoles = await prisma.jobRole.findMany({
      include: {
        capability: true,
        band: true,
      },
    });

    return jobRoles;
  }
}
