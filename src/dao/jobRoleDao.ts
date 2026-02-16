import type { PrismaClient } from "../generated/client";
import type {
  CreateJobRoleInput,
  UpdateJobRoleInput,
} from "../models/jobRoleData";

export class JobRoleDao {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getJobRoles() {
    return this.prisma.jobRole.findMany({
      include: {
        capability: true,
        band: true,
        status: true,
      },
    });
  }

  async getJobRoleById(id: number) {
    return this.prisma.jobRole.findUnique({
      where: { jobRoleId: id },
      include: {
        capability: true,
        band: true,
        status: true,
      },
    });
  }

  async createJobRole(data: CreateJobRoleInput) {
    return this.prisma.jobRole.create({
      data,
      include: {
        capability: true,
        band: true,
        status: true,
      },
    });
  }

  async updateJobRole(id: number, data: UpdateJobRoleInput) {
    return this.prisma.jobRole.update({
      where: { jobRoleId: id },
      data,
      include: {
        capability: true,
        band: true,
        status: true,
      },
    });
  }

  async deleteJobRole(id: number) {
    return this.prisma.jobRole.delete({
      where: { jobRoleId: id },
    });
  }
}
