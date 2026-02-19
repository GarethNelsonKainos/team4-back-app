import type { Application, PrismaClient } from "../generated/client";

export interface CreateApplicationData {
	userId: number;
	jobRoleId: number;
	cvUrl: string;
}

export interface UpdateApplicationData {
	applicationStatus: string;
}

// Define Application with includes for proper typing
export type ApplicationWithIncludes = Application & {
	user: {
		userId: number;
		userEmail: string;
		userPassword: string;
		createdAt: Date;
		updatedAt: Date;
	};
	jobRole: {
		jobRoleId: number;
		roleName: string;
		jobLocation: string;
		capabilityId: number;
		bandId: number;
		closingDate: Date;
		description: string;
		responsibilities: string;
		sharepointUrl: string;
		statusId: number;
		numberOfOpenPositions: number;
		band: {
			bandId: number;
			bandName: string | null;
		};
		capability: {
			capabilityId: number;
			capabilityName: string | null;
		};
		status: {
			statusId: number;
			statusName: string;
		};
	};
};

export class ApplicationDao {
	private prisma: PrismaClient;

	constructor(prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async createApplication(
		data: CreateApplicationData,
	): Promise<ApplicationWithIncludes> {
		return (await this.prisma.application.create({
			data: {
				userId: data.userId,
				jobRoleId: data.jobRoleId,
				cvUrl: data.cvUrl,
				applicationStatus: "SUBMITTED",
			},
			include: {
				user: true,
				jobRole: {
					include: {
						band: true,
						capability: true,
						status: true,
					},
				},
			},
		})) as ApplicationWithIncludes;
	}

	async checkExistingApplication(
		userId: number,
		jobRoleId: number,
	): Promise<Application | null> {
		return await this.prisma.application.findFirst({
			where: {
				userId: userId,
				jobRoleId: jobRoleId,
			},
		});
	}
}
