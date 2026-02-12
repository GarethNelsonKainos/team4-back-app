import type {
	Band,
	Capability,
	PrismaClient,
	JobRole as PrismaJobRole,
	Status,
} from "@prisma/client";
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
}
