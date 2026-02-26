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
			getJobRoleById: vi.fn(),
			createJobRole: vi.fn(),
			updateJobRole: vi.fn(),
			deleteJobRole: vi.fn(),
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

	it("should get a job role by id and map it to response", async () => {
		const closingDate = new Date("2026-02-09");
		const mockJobRoleData: JobRoleData = {
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
		};

		const expectedResponse: JobRoleResponse = {
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
		};

		vi.mocked(mockJobRoleDao.getJobRoleById).mockResolvedValue(
			mockJobRoleData as unknown as Awaited<
				ReturnType<typeof mockJobRoleDao.getJobRoleById>
			>,
		);

		const result = await jobRoleService.getJobRoleById(1);

		expect(result).toEqual(expectedResponse);
		expect(mockJobRoleDao.getJobRoleById).toHaveBeenCalledWith(1);
	});

	it("should return null if job role not found", async () => {
		vi.mocked(mockJobRoleDao.getJobRoleById).mockResolvedValue(null);

		const result = await jobRoleService.getJobRoleById(999);

		expect(result).toBeNull();
		expect(mockJobRoleDao.getJobRoleById).toHaveBeenCalledWith(999);
	});

	it("should create a new job role", async () => {
		const closingDate = new Date("2026-02-09");
		const createInput = {
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
		};

		const mockJobRoleData: JobRoleData = {
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
		};

		const expectedResponse: JobRoleResponse = {
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
		};

		vi.mocked(mockJobRoleDao.createJobRole).mockResolvedValue(
			mockJobRoleData as unknown as Awaited<
				ReturnType<typeof mockJobRoleDao.createJobRole>
			>,
		);

		const result = await jobRoleService.createJobRole(createInput);

		expect(result).toEqual(expectedResponse);
		expect(mockJobRoleDao.createJobRole).toHaveBeenCalledWith(createInput);
	});

	it("should update a job role", async () => {
		const closingDate = new Date("2026-02-09");
		const updateInput = {
			roleName: "Senior Software Engineer",
		};

		const mockExistingJobRole: JobRoleData = {
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
		};

		const mockJobRoleData: JobRoleData = {
			jobRoleId: 1,
			roleName: "Senior Software Engineer",
			jobLocation: "Manchester",
			closingDate: closingDate,
			description: "A role for software engineers",
			responsibilities: "Develop software solutions",
			sharepointUrl: "https://sharepoint.example.com/job/1",
			numberOfOpenPositions: 3,
			capability: { capabilityId: 1, capabilityName: "Engineering" },
			band: { bandId: 1, bandName: "Associate" },
			status: { statusId: 1, statusName: "Open" },
		};

		const expectedResponse: JobRoleResponse = {
			jobRoleId: 1,
			roleName: "Senior Software Engineer",
			location: "Manchester",
			capability: "Engineering",
			band: "Associate",
			closingDate: "2026-02-09",
			description: "A role for software engineers",
			responsibilities: "Develop software solutions",
			sharepointUrl: "https://sharepoint.example.com/job/1",
			status: "Open",
			numberOfOpenPositions: 3,
		};

		vi.mocked(mockJobRoleDao.getJobRoleById).mockResolvedValue(
			mockExistingJobRole as unknown as Awaited<
				ReturnType<typeof mockJobRoleDao.getJobRoleById>
			>,
		);

		vi.mocked(mockJobRoleDao.updateJobRole).mockResolvedValue(
			mockJobRoleData as unknown as Awaited<
				ReturnType<typeof mockJobRoleDao.updateJobRole>
			>,
		);

		const result = await jobRoleService.updateJobRole(1, updateInput);

		expect(result).toEqual(expectedResponse);
		expect(mockJobRoleDao.getJobRoleById).toHaveBeenCalledWith(1);
		expect(mockJobRoleDao.updateJobRole).toHaveBeenCalledWith(1, updateInput);
	});

	it("should return null when updating a missing job role", async () => {
		vi.mocked(mockJobRoleDao.getJobRoleById).mockResolvedValue(null);

		const result = await jobRoleService.updateJobRole(999, {
			roleName: "Missing Role",
		});

		expect(result).toBeNull();
		expect(mockJobRoleDao.getJobRoleById).toHaveBeenCalledWith(999);
		expect(mockJobRoleDao.updateJobRole).not.toHaveBeenCalled();
	});

	it("should delete a job role", async () => {
		const closingDate = new Date("2026-02-09");
		const mockExistingJobRole: JobRoleData = {
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
		};

		vi.mocked(mockJobRoleDao.getJobRoleById).mockResolvedValue(
			mockExistingJobRole as unknown as Awaited<
				ReturnType<typeof mockJobRoleDao.getJobRoleById>
			>,
		);

		vi.mocked(mockJobRoleDao.deleteJobRole).mockResolvedValue(
			undefined as unknown as Awaited<
				ReturnType<typeof mockJobRoleDao.deleteJobRole>
			>,
		);

		const result = await jobRoleService.deleteJobRole(1);

		expect(result).toBe(true);
		expect(mockJobRoleDao.getJobRoleById).toHaveBeenCalledWith(1);
		expect(mockJobRoleDao.deleteJobRole).toHaveBeenCalledWith(1);
	});

	it("should return false when deleting a missing job role", async () => {
		vi.mocked(mockJobRoleDao.getJobRoleById).mockResolvedValue(null);

		const result = await jobRoleService.deleteJobRole(999);

		expect(result).toBe(false);
		expect(mockJobRoleDao.getJobRoleById).toHaveBeenCalledWith(999);
		expect(mockJobRoleDao.deleteJobRole).not.toHaveBeenCalled();
	});
});
