import type { PrismaClient } from "../generated/client";
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

		prismaMock.jobRole.findMany.mockResolvedValue(mockDbJobRoles);

		const result = await jobRoleDao.getJobRoles();

		expect(result).toEqual(expectedJobRoles);

		expect(prismaMock.jobRole.findMany).toHaveBeenCalledWith({
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
				capability: null,
				band: null,
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
				capability: undefined,
				band: undefined,
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
			},
		});
	});
});
