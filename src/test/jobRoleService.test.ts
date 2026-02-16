import { beforeEach, describe, expect, it, vi } from "vitest";
import type { JobRoleDao } from "../dao/jobRoleDao";
import type { JobRoleData } from "../models/jobRoleData";
import type { JobRoleResponse } from "../models/jobRoleResponse";
import { JobRoleService } from "../services/jobRoleService";

describe("JobRoleService", () => {
	let jobRoleService: JobRoleService;
	let mockJobRoleDao: JobRoleDao;

	beforeEach(() => {
		mockJobRoleDao = {
			getJobRoles: vi.fn(),
		} as unknown as JobRoleDao;

		jobRoleService = new JobRoleService(mockJobRoleDao);
	});

	it("should get job roles and map them to responses", async () => {
		const closingDate = new Date("2026-02-09");
		const mockPrismaJobRoles: JobRoleData[] = [
			{
				jobRoleId: 1,
				roleName: "Software Engineer",
				jobLocation: "Manchester",
				closingDate: closingDate,
				description: "A role for software engineers",
				responsibilities: "Develop software solutions",
				sharepointUrl: "https://sharepoint.example.com/job/1",
				numberOfOpenPositions: 3,
				capability: { capabilityId: 1, capabilityName: "Engineering" },
				band: { bandId: 1, bandName: "Associate" },
				status: { statusId: 1, statusName: "Open" },
			},
		];

		const expectedResponses: JobRoleResponse[] = [
			{
				jobRoleId: 1,
				roleName: "Software Engineer",
				location: "Manchester",
				capability: "Engineering",
				band: "Associate",
				closingDate: "2026-02-09",
				description: "A role for software engineers",
				responsibilities: "Develop software solutions",
				sharepointUrl: "https://sharepoint.example.com/job/1",
				status: "Open",
				numberOfOpenPositions: 3,
			},
		];

		vi.mocked(mockJobRoleDao.getJobRoles).mockResolvedValue(
			mockPrismaJobRoles as unknown as Awaited<
				ReturnType<typeof mockJobRoleDao.getJobRoles>
			>,
		);

		const result = await jobRoleService.getJobRoles();

		expect(result).toEqual(expectedResponses);
		expect(mockJobRoleDao.getJobRoles).toHaveBeenCalledOnce();
	});

	it("should handle missing capability and band relations", async () => {
		const closingDate = new Date("2026-02-09");
		const mockPrismaJobRoles: JobRoleData[] = [
			{
				jobRoleId: 1,
				roleName: "Software Engineer",
				jobLocation: "Manchester",
				closingDate: closingDate,
				description: "A role for software engineers",
				responsibilities: "Develop software solutions",
				sharepointUrl: "https://sharepoint.example.com/job/1",
				numberOfOpenPositions: 3,
				capability: null,
				band: null,
				status: null,
			},
		];

		const expectedResponses: JobRoleResponse[] = [
			{
				jobRoleId: 1,
				roleName: "Software Engineer",
				location: "Manchester",
				capability: "Unknown",
				band: "Unknown",
				closingDate: "2026-02-09",
				description: "A role for software engineers",
				responsibilities: "Develop software solutions",
				sharepointUrl: "https://sharepoint.example.com/job/1",
				status: "Unknown",
				numberOfOpenPositions: 3,
			},
		];

		vi.mocked(mockJobRoleDao.getJobRoles).mockResolvedValue(
			mockPrismaJobRoles as unknown as Awaited<
				ReturnType<typeof mockJobRoleDao.getJobRoles>
			>,
		);

		const result = await jobRoleService.getJobRoles();

		expect(result).toEqual(expectedResponses);
		expect(mockJobRoleDao.getJobRoles).toHaveBeenCalledOnce();
	});
});
