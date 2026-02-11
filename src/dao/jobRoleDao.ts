import type { JobRole } from "../models/jobRole";
import type { PrismaClient, JobRoles as PrismaJobRole, Capability, Band } from "@prisma/client";

export class JobRoleDao {
	private prisma: PrismaClient;

	constructor(prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async getJobRoles(): Promise<JobRole[]> {
		const jobRoles = await this.prisma.jobRoles.findMany({
			include: {
				capability: true,
				band: true,
			},
		});

		return jobRoles.map((jr: PrismaJobRole & { capability: Capability | null; band: Band | null }) => ({
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
