import type { JobRoleData } from "../models/jobRoleData";
import type { JobRoleResponse } from "../models/jobRoleResponse";

export namespace JobRoleMapper {
	export function toResponse(jobRoleData: JobRoleData): JobRoleResponse {
		return {
			jobRoleId: jobRoleData.jobRoleId,
			roleName: jobRoleData.roleName,
			location: jobRoleData.jobLocation,
			capability: jobRoleData.capability?.capabilityName ?? "Unknown",
			band: jobRoleData.band?.bandName ?? "Unknown",
			closingDate: jobRoleData.closingDate.toISOString().split("T")[0],
			description: jobRoleData.description,
			responsibilities: jobRoleData.responsibilities,
			sharepointUrl: jobRoleData.sharepointUrl,
			status: jobRoleData.status?.statusName ?? "Unknown",
			numberOfOpenPositions: jobRoleData.numberOfOpenPositions,
		};
	}
}
