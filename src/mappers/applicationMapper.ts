import type { ApplicationWithIncludes } from "../dao/applicationDao";

export function toApplicationResponse(application: ApplicationWithIncludes) {
	return {
		applicationId: application.applicationId,
		userId: application.userId,
		jobRoleId: application.jobRoleId,
		cvUrl: application.cvUrl,
		applicationStatus: application.applicationStatus,
		appliedAt: application.appliedAt,
	};
}
