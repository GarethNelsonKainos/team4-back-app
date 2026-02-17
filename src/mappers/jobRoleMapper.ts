import type {
	Band,
	Capability,
	JobRole as PrismaJobRole,
	Status,
} from "../generated/client";
import type { JobRole } from "../models/jobRole";
import type { JobRoleResponse } from "../models/jobRoleResponse";

export namespace JobRoleMapper {
	export function fromPrisma(
		prismaJobRole: PrismaJobRole & {
			capability: Capability | null;
			band: Band | null;
			status: Status | null;
		},
	): JobRole {
		return {
			jobRoleId: prismaJobRole.jobRoleId,
			roleName: prismaJobRole.roleName || "",
			location: prismaJobRole.jobLocation || "",
			capabilityId: prismaJobRole.capabilityId,
			bandId: prismaJobRole.bandId,
			closingDate: prismaJobRole.closingDate
				? prismaJobRole.closingDate.toISOString().split("T")[0]
				: "",
			description: prismaJobRole.description,
			responsibilities: prismaJobRole.responsibilities,
			sharepointUrl: prismaJobRole.sharepointUrl,
			statusId: prismaJobRole.statusId,
			numberOfOpenPositions: prismaJobRole.numberOfOpenPositions,
			capability: prismaJobRole.capability
				? {
						capabilityId: prismaJobRole.capability.capabilityId,
						capabilityName: prismaJobRole.capability.capabilityName,
					}
				: undefined,
			band: prismaJobRole.band
				? {
						bandId: prismaJobRole.band.bandId,
						bandName: prismaJobRole.band.bandName,
					}
				: undefined,
			status: prismaJobRole.status
				? {
						statusId: prismaJobRole.status.statusId,
						statusName: prismaJobRole.status.statusName,
					}
				: undefined,
		};
	}

	export function toResponse(jobRole: JobRole): JobRoleResponse {
		const capabilityName = jobRole.capability?.capabilityName || "Unknown";
		const bandName = jobRole.band?.bandName || "Unknown";
		const statusName = jobRole.status?.statusName || "Unknown";

		return {
			jobRoleId: jobRole.jobRoleId,
			roleName: jobRole.roleName,
			location: jobRole.location,
			capability: capabilityName,
			band: bandName,
			closingDate: jobRole.closingDate,
			description: jobRole.description,
			responsibilities: jobRole.responsibilities,
			sharepointUrl: jobRole.sharepointUrl,
			status: statusName,
			numberOfOpenPositions: jobRole.numberOfOpenPositions,
		};
	}
}
