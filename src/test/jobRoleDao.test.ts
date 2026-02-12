import { beforeEach, describe, expect, it } from "vitest";
import { type DeepMockProxy, mockDeep } from "vitest-mock-extended";
import { JobRoleDao } from "../dao/jobRoleDao";
import type { PrismaClient } from "../generated/client";
import type { JobRole } from "../models/jobRole";

describe("JobRoleDao", () => {
	let prismaMock: DeepMockProxy<PrismaClient>;
	let jobRoleDao: JobRoleDao;

	beforeEach(() => {
		prismaMock = mockDeep<PrismaClient>();
		jobRoleDao = new JobRoleDao(prismaMock);
	});

	it("should return job roles from the database", async () => {
		const closingDate = new Date("2026-02-09");
		const mockDbJobRoles = [
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

		const expectedJobRoles: JobRole[] = [
			{
				jobRoleId: 1,
				roleName: "Software Engineer",
				location: "Manchester",
				capabilityId: 1,
				bandId: 1,
				closingDate: "2026-02-09",
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

		expect(result).toEqual(expectedJobRoles);

		expect(prismaMock.jobRole.findMany).toHaveBeenCalledWith({
			include: {
				capability: true,
				band: true,
				status: true,
			},
		});
	});

	it("should handle null values from the database and apply fallbacks", async () => {
		const _fixedDate = new Date("2026-02-09");

		const mockDbJobRolesWithNulls = [
			{
				jobRoleId: 2,
				roleName: null,
				jobLocation: null,
				capabilityId: 2,
				bandId: 2,
				closingDate: null,
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

		const expectedJobRoles: JobRole[] = [
			{
				jobRoleId: 2,
				roleName: "",
				location: "",
				capabilityId: 2,
				bandId: 2,
				closingDate: "",
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

		prismaMock.jobRole.findMany.mockResolvedValue(
			mockDbJobRolesWithNulls as unknown as Awaited<
				ReturnType<typeof prismaMock.jobRole.findMany>
			>,
		);

		const result = await jobRoleDao.getJobRoles();

		expect(result).toEqual(expectedJobRoles);

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
		const mockDbJobRolesWithNullRelations = [
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

		const expectedJobRoles: JobRole[] = [
			{
				jobRoleId: 3,
				roleName: "Product Manager",
				location: "London",
				capabilityId: 3,
				bandId: 3,
				closingDate: "2026-02-09",
				description: "PM role",
				responsibilities: "Manage products",
				sharepointUrl: "https://sharepoint.example.com/job/3",
				statusId: 1,
				numberOfOpenPositions: 1,
				capability: undefined,
				band: undefined,
				status: undefined,
			},
		];

		prismaMock.jobRole.findMany.mockResolvedValue(
			mockDbJobRolesWithNullRelations as unknown as Awaited<
				ReturnType<typeof prismaMock.jobRole.findMany>
			>,
		);

		const result = await jobRoleDao.getJobRoles();

		expect(result).toEqual(expectedJobRoles);

		expect(prismaMock.jobRole.findMany).toHaveBeenCalledWith({
			include: {
				capability: true,
				band: true,
				status: true,
			},
		});
	});
});
