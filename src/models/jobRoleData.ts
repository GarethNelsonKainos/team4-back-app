export interface JobRoleData {
	jobRoleId: number;
	roleName: string;
	jobLocation: string;
	closingDate: Date;
	description: string;
	responsibilities: string;
	sharepointUrl: string;
	numberOfOpenPositions: number;
	capability: { capabilityId: number; capabilityName: string | null } | null;
	band: { bandId: number; bandName: string | null } | null;
	status: { statusId: number; statusName: string } | null;
}
