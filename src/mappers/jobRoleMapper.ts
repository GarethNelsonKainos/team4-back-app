import type { JobRole } from "../models/jobRole";
import type { JobRoleResponse } from "../models/jobRoleResponse";

export namespace JobRoleMapper {
	export function toResponse(jobRole: JobRole): JobRoleResponse {
		const capabilityName = jobRole.capability?.capabilityName || "Unknown";
		const bandName = jobRole.band?.bandName || "Unknown";

		return {
			jobRoleId: jobRole.jobRoleId,
			roleName: jobRole.roleName,
			location: jobRole.location,
			capability: capabilityName,
			band: bandName,
			closingDate: jobRole.closingDate,
		};
	}
}
