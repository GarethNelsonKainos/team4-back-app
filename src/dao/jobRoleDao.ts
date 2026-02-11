import { JobRole } from "../models/jobRole";
import { PrismaClient } from "@prisma/client";

export class JobRoleDao {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getJobRoles(): Promise<JobRole[]> {
    const jobRoles = await this.prisma.jobRole.findMany({
      include: {
        capability: true,
        band: true,
      },
    });

    return jobRoles.map((jr: any) => ({
      jobRoleId: jr.jobRoleId,
      roleName: jr.roleName || "",
      location: jr.jobLocation || "",
      capabilityId: jr.capabilityId,
      bandId: jr.bandId,
      closingDate: jr.closingDate
        ? jr.closingDate.toISOString().split("T")[0]
        : "",
      capability: jr.capability
        ? {
            capabilityId: jr.capability.capabilityId,
            capabilityName: jr.capability.capabilityName,
          }
        : undefined,
      band: jr.band
        ? {
            bandId: jr.band.bandId,
            bandName: jr.band.bandName,
          }
        : undefined,
    }));
  }
}
