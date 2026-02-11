import type { PrismaClient } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { type DeepMockProxy, mockDeep } from "vitest-mock-extended";
import { JobRoleDao } from "../dao/jobRoleDao";
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
				capability: {
					capabilityId: 1,
					capabilityName: "Engineering",
				},
				band: {
					bandId: 1,
					bandName: "Associate",
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
				capability: {
					capabilityId: 1,
					capabilityName: "Engineering",
				},
				band: {
					bandId: 1,
					bandName: "Associate",
				},
			},
		];

		prismaMock.jobRoles.findMany.mockResolvedValue(mockDbJobRoles);

		const result = await jobRoleDao.getJobRoles();

		expect(result).toEqual(expectedJobRoles);

		expect(prismaMock.jobRoles.findMany).toHaveBeenCalledWith({
			include: {
				capability: true,
				band: true,
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
				capability: {
					capabilityId: 2,
					capabilityName: "Data",
				},
				band: {
					bandId: 2,
					bandName: "Consultant",
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
				capability: {
					capabilityId: 2,
					capabilityName: "Data",
				},
				band: {
					bandId: 2,
					bandName: "Consultant",
				},
			},
		];

		prismaMock.jobRoles.findMany.mockResolvedValue(
			mockDbJobRolesWithNulls as typeof mockDbJobRolesWithNulls,
		);

		const result = await jobRoleDao.getJobRoles();

		expect(result).toEqual(expectedJobRoles);

		expect(prismaMock.jobRoles.findMany).toHaveBeenCalledWith({
			include: {
				capability: true,
				band: true,
			},
		});
	});
});
