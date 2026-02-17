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

export interface CreateJobRoleInput {
	roleName: string;
	jobLocation: string;
	capabilityId: number;
	bandId: number;
	closingDate: Date | string;
	description: string;
	responsibilities: string;
	sharepointUrl: string;
	statusId: number;
	numberOfOpenPositions: number;
}

export type UpdateJobRoleInput = Partial<CreateJobRoleInput>;
