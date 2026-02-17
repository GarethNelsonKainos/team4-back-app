import { beforeEach, describe, expect, it } from "vitest";
import { type DeepMockProxy, mockDeep } from "vitest-mock-extended";
import { JobRoleDao, type JobRoleWithRelations } from "../dao/jobRoleDao";
import type { PrismaClient } from "../generated/client";

describe("JobRoleDao", () => {
	let prismaMock: DeepMockProxy<PrismaClient>;
	let jobRoleDao: JobRoleDao;

	beforeEach(() => {
		prismaMock = mockDeep<PrismaClient>();
		jobRoleDao = new JobRoleDao(prismaMock);
	});

	it("should return job roles from the database", async () => {
		const closingDate = new Date("2026-02-09");
		const mockDbJobRoles: JobRoleWithRelations[] = [
			{
				jobRoleId: 1,
				roleName: "Software Engineer",
				jobLocation: "Manchester",
				capabilityId: 1,
				bandId: 1,
				closingDate: closingDate,
				description: "A role for software engineers",
				responsibilities: "Develop software solutions",
				sharepointUrl: "https://sharepoint.example.com/job/1",
				statusId: 1,
				numberOfOpenPositions: 3,
				capability: {
					capabilityId: 1,
					capabilityName: "Engineering",
				},
				band: {
					bandId: 1,
					bandName: "Associate",
				},
				status: {
					statusId: 1,
					statusName: "Open",
				},
			},
		];

		prismaMock.jobRole.findMany.mockResolvedValue(mockDbJobRoles);

		const result = await jobRoleDao.getJobRoles();

		expect(result).toEqual(mockDbJobRoles);

		expect(prismaMock.jobRole.findMany).toHaveBeenCalledWith({
			include: {
				capability: true,
				band: true,
				status: true,
			},
		});
	});

	it("should handle additional job roles from the database", async () => {
		const closingDate = new Date("2026-02-10");
		const mockDbJobRolesAdditional: JobRoleWithRelations[] = [
			{
				jobRoleId: 2,
				roleName: "Data Analyst",
				jobLocation: "London",
				capabilityId: 2,
				bandId: 2,
				closingDate: closingDate,
				description: "Description for role",
				responsibilities: "Responsibilities for role",
				sharepointUrl: "https://sharepoint.example.com/job/2",
				statusId: 1,
				numberOfOpenPositions: 2,
				capability: {
					capabilityId: 2,
					capabilityName: "Data",
				},
				band: {
					bandId: 2,
					bandName: "Consultant",
				},
				status: {
					statusId: 1,
					statusName: "Open",
				},
			},
		];

		prismaMock.jobRole.findMany.mockResolvedValue(mockDbJobRolesAdditional);

		const result = await jobRoleDao.getJobRoles();

		expect(result).toEqual(mockDbJobRolesAdditional);

		expect(prismaMock.jobRole.findMany).toHaveBeenCalledWith({
			include: {
				capability: true,
				band: true,
				status: true,
			},
		});
	});

	it("should handle null capability and band relations", async () => {
		const closingDate = new Date("2026-02-09");
		const mockDbJobRolesWithNullRelations: JobRoleWithRelations[] = [
			{
				jobRoleId: 3,
				roleName: "Product Manager",
				jobLocation: "London",
				capabilityId: 3,
				bandId: 3,
				closingDate: closingDate,
				description: "PM role",
				responsibilities: "Manage products",
				sharepointUrl: "https://sharepoint.example.com/job/3",
				statusId: 1,
				numberOfOpenPositions: 1,
				capability: null,
				band: null,
				status: null,
			},
		];

		prismaMock.jobRole.findMany.mockResolvedValue(mockDbJobRolesWithNullRelations);

		const result = await jobRoleDao.getJobRoles();

		expect(result).toEqual(mockDbJobRolesWithNullRelations);

		expect(prismaMock.jobRole.findMany).toHaveBeenCalledWith({
			include: {
				capability: true,
				band: true,
				status: true,
			},
		});
	});

	describe("getJobRoleById", () => {
		it("should return a job role by ID from the database", async () => {
			const closingDate = new Date("2026-02-09");
			const mockDbJobRole: JobRoleWithRelations = {
				jobRoleId: 1,
				roleName: "Software Engineer",
				jobLocation: "Manchester",
				capabilityId: 1,
				bandId: 1,
				closingDate: closingDate,
				description: "A role for software engineers",
				responsibilities: "Develop software solutions",
				sharepointUrl: "https://sharepoint.example.com/job/1",
				statusId: 1,
				numberOfOpenPositions: 3,
				capability: {
					capabilityId: 1,
					capabilityName: "Engineering",
				},
				band: {
					bandId: 1,
					bandName: "Associate",
				},
				status: {
					statusId: 1,
					statusName: "Open",
				},
			};

			prismaMock.jobRole.findUnique.mockResolvedValue(mockDbJobRole);

			const result = await jobRoleDao.getJobRoleById(1);

			expect(result).toEqual(mockDbJobRole);
			expect(prismaMock.jobRole.findUnique).toHaveBeenCalledWith({
				where: { jobRoleId: 1 },
				include: {
					capability: true,
					band: true,
					status: true,
				},
			});
		});

		it("should return null if job role is not found", async () => {
			prismaMock.jobRole.findUnique.mockResolvedValue(null);

			const result = await jobRoleDao.getJobRoleById(999);

			expect(result).toBeNull();
			expect(prismaMock.jobRole.findUnique).toHaveBeenCalledWith({
				where: { jobRoleId: 999 },
				include: {
					capability: true,
					band: true,
					status: true,
				},
			});
		});

		it("should handle specific job role fields correctly", async () => {
			const closingDate = new Date("2026-02-10");
			const mockDbJobRoleSpecific: JobRoleWithRelations = {
				jobRoleId: 2,
				roleName: "Data Analyst",
				jobLocation: "London",
				capabilityId: 2,
				bandId: 2,
				closingDate: closingDate,
				description: "Description for role",
				responsibilities: "Responsibilities for role",
				sharepointUrl: "https://sharepoint.example.com/job/2",
				statusId: 1,
				numberOfOpenPositions: 2,
				capability: {
					capabilityId: 2,
					capabilityName: "Data",
				},
				band: {
					bandId: 2,
					bandName: "Consultant",
				},
				status: {
					statusId: 1,
					statusName: "Open",
				},
			};

			prismaMock.jobRole.findUnique.mockResolvedValue(mockDbJobRoleSpecific);

			const result = await jobRoleDao.getJobRoleById(2);

			expect(result).toEqual(mockDbJobRoleSpecific);
			expect(prismaMock.jobRole.findUnique).toHaveBeenCalledWith({
				where: { jobRoleId: 2 },
				include: {
					capability: true,
					band: true,
					status: true,
				},
			});
		});
	});
});
