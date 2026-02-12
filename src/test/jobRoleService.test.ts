import { beforeEach, describe, expect, it, vi } from "vitest";
import type { JobRoleDao } from "../dao/jobRoleDao";
import type { JobRole } from "../models/jobRole";
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
		const closingDate = "2026-02-09";
		const mockJobRoles: JobRole[] = [
			{
				jobRoleId: 1,
				roleName: "Software Engineer",
				location: "Manchester",
				capability: { capabilityId: 1, capabilityName: "Engineering" },
				band: { bandId: 1, bandName: "Associate" },
				status: { statusId: 1, statusName: "Open" },
				capabilityId: 1,
				bandId: 1,
				closingDate: closingDate,
				description: "A role for software engineers",
				responsibilities: "Develop software solutions",
				sharepointUrl: "https://sharepoint.example.com/job/1",
				statusId: 1,
				numberOfOpenPositions: 3,
			},
		];

		const expectedResponses: JobRoleResponse[] = [
			{
				jobRoleId: 1,
				roleName: "Software Engineer",
				location: "Manchester",
				capability: "Engineering",
				band: "Associate",
				closingDate: closingDate,
				description: "A role for software engineers",
				responsibilities: "Develop software solutions",
				sharepointUrl: "https://sharepoint.example.com/job/1",
				status: "Open",
				numberOfOpenPositions: 3,
			},
		];

		vi.mocked(mockJobRoleDao.getJobRoles).mockResolvedValue(mockJobRoles);

		const result = await jobRoleService.getJobRoles();

		expect(result).toEqual(expectedResponses);
		expect(mockJobRoleDao.getJobRoles).toHaveBeenCalledOnce();
	});

	it("should handle missing capability and band relations", async () => {
		const closingDate = "2026-02-09";
		const mockJobRoles: JobRole[] = [
			{
				jobRoleId: 1,
				roleName: "Software Engineer",
				location: "Manchester",
				capability: undefined,
				band: undefined,
				status: undefined,
				capabilityId: 1,
				bandId: 1,
				closingDate: closingDate,
				description: "A role for software engineers",
				responsibilities: "Develop software solutions",
				sharepointUrl: "https://sharepoint.example.com/job/1",
				statusId: 1,
				numberOfOpenPositions: 3,
			},
		];

		const expectedResponses: JobRoleResponse[] = [
			{
				jobRoleId: 1,
				roleName: "Software Engineer",
				location: "Manchester",
				capability: "Unknown",
				band: "Unknown",
				closingDate: closingDate,
				description: "A role for software engineers",
				responsibilities: "Develop software solutions",
				sharepointUrl: "https://sharepoint.example.com/job/1",
				status: "Unknown",
				numberOfOpenPositions: 3,
			},
		];

		vi.mocked(mockJobRoleDao.getJobRoles).mockResolvedValue(mockJobRoles);

		const result = await jobRoleService.getJobRoles();

		expect(result).toEqual(expectedResponses);
		expect(mockJobRoleDao.getJobRoles).toHaveBeenCalledOnce();
	});
});
