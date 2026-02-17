import type { PrismaClient } from "../generated/client";

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

	async getJobRoleById(jobRoleId: number) {
		return this.prisma.jobRole.findUnique({
			where: { jobRoleId },
			include: {
				capability: true,
				band: true,
				status: true,
			},
		});
	}
}
