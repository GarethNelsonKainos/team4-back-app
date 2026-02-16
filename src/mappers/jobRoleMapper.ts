import type { JobRoleWithRelations } from "../dao/jobRoleDao";
import type { JobRoleResponse } from "../models/jobRoleResponse";

export namespace JobRoleMapper {
	export function toResponse(
		prismaJobRole: JobRoleWithRelations,
	): JobRoleResponse {
		return {
			jobRoleId: prismaJobRole.jobRoleId,
			roleName: prismaJobRole.roleName,
			location: prismaJobRole.jobLocation,
			capability: prismaJobRole.capability?.capabilityName ?? "Unknown",
			band: prismaJobRole.band?.bandName ?? "Unknown",
			closingDate: prismaJobRole.closingDate.toISOString().split("T")[0],
			description: prismaJobRole.description,
			responsibilities: prismaJobRole.responsibilities,
			sharepointUrl: prismaJobRole.sharepointUrl,
			status: prismaJobRole.status?.statusName ?? "Unknown",
			numberOfOpenPositions: prismaJobRole.numberOfOpenPositions,
		};
	}
}
