export interface JobRole {
	jobRoleId: number;
	roleName: string;
	location: string;
	capabilityId: number;
	bandId: number;
	closingDate: string;
	description: string;
	responsibilities: string;
	sharepointUrl: string;
	statusId: number;
	numberOfOpenPositions: number;

	capability?: {
		capabilityId: number;
		capabilityName: string | null;
	};
	band?: {
		bandId: number;
		bandName: string | null;
	};
	status?: {
		statusId: number;
		statusName: string;
	};
}
