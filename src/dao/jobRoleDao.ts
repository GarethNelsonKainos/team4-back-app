import type {
	Band,
	Capability,
	PrismaClient,
	JobRole as PrismaJobRole,
	Status,
} from "../generated/client";

export type JobRoleWithRelations = PrismaJobRole & {
	capability: Capability | null;
	band: Band | null;
	status: Status | null;
};

export class JobRoleDao {
	private prisma: PrismaClient;

	constructor(prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async getJobRoles(): Promise<JobRoleWithRelations[]> {
		return await this.prisma.jobRole.findMany({
			include: {
				capability: true,
				band: true,
				status: true,
			},
		});
	}

	async getJobRoleById(jobRoleId: number): Promise<JobRoleWithRelations | null> {
		return await this.prisma.jobRole.findUnique({
			where: { jobRoleId },
			include: {
				capability: true,
				band: true,
				status: true,
			},
		});
	}
}
