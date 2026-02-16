import type {
	Band,
	Capability,
	PrismaClient,
	JobRole as PrismaJobRole,
	Status,
} from "../generated/client";
import type { JobRole } from "../models/jobRole";

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
				status: true,
			},
		});

		return jobRoles.map(
			(
				jr: PrismaJobRole & {
					capability: Capability | null;
					band: Band | null;
					status: Status | null;
				},
			) => ({
				jobRoleId: jr.jobRoleId,
				roleName: jr.roleName || "",
				location: jr.jobLocation || "",
				capabilityId: jr.capabilityId,
				bandId: jr.bandId,
				closingDate: jr.closingDate
					? jr.closingDate.toISOString().split("T")[0]
					: "",
				description: jr.description,
				responsibilities: jr.responsibilities,
				sharepointUrl: jr.sharepointUrl,
				statusId: jr.statusId,
				numberOfOpenPositions: jr.numberOfOpenPositions,
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
				status: jr.status
					? {
							statusId: jr.status.statusId,
							statusName: jr.status.statusName,
						}
					: undefined,
			}),
		);
	}

	async getJobRoleById(jobRoleId: number): Promise<JobRole | null> {
		const jobRole = await this.prisma.jobRole.findUnique({
			where: { jobRoleId },
			include: {
				capability: true,
				band: true,
				status: true,
			},
		});

		if (!jobRole) {
			return null;
		}

		return {
			jobRoleId: jobRole.jobRoleId,
			roleName: jobRole.roleName || "",
			location: jobRole.jobLocation || "",
			capabilityId: jobRole.capabilityId,
			bandId: jobRole.bandId,
			closingDate: jobRole.closingDate
				? jobRole.closingDate.toISOString().split("T")[0]
				: "",
			description: jobRole.description,
			responsibilities: jobRole.responsibilities,
			sharepointUrl: jobRole.sharepointUrl,
			statusId: jobRole.statusId,
			numberOfOpenPositions: jobRole.numberOfOpenPositions,
			capability: jobRole.capability
				? {
						capabilityId: jobRole.capability.capabilityId,
						capabilityName: jobRole.capability.capabilityName,
					}
				: undefined,
			band: jobRole.band
				? {
						bandId: jobRole.band.bandId,
						bandName: jobRole.band.bandName,
					}
				: undefined,
			status: jobRole.status
				? {
						statusId: jobRole.status.statusId,
						statusName: jobRole.status.statusName,
					}
				: undefined,
		};
	}
}
