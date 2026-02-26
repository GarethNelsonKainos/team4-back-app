import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
	ApplicationDao,
	ApplicationWithIncludes,
} from "../dao/applicationDao";
import type { JobRoleDao } from "../dao/jobRoleDao";
import { ApplicationService } from "../services/applicationService";

const baseJobRole = () => ({
	jobRoleId: 10,
	roleName: "Engineer",
	jobLocation: "Manchester",
	capabilityId: 1,
	bandId: 1,
	closingDate: new Date(Date.now() + 60_000),
	description: "Role",
	responsibilities: "Build",
	sharepointUrl: "https://sharepoint.example.com/job/10",
	statusId: 1,
	numberOfOpenPositions: 1,
	band: { bandId: 1, bandName: "Associate" },
	capability: { capabilityId: 1, capabilityName: "Engineering" },
	status: { statusId: 1, statusName: "Open" },
});

const buildJobRole = (overrides?: Partial<ReturnType<typeof baseJobRole>>) => ({
	...baseJobRole(),
	...overrides,
});

describe("ApplicationService", () => {
	let applicationDao: ApplicationDao;
	let jobRoleDao: JobRoleDao;
	let service: ApplicationService;

	beforeEach(() => {
		applicationDao = {
			checkExistingApplication: vi.fn(),
			createApplication: vi.fn(),
		} as unknown as ApplicationDao;

		jobRoleDao = {
			getJobRoleById: vi.fn(),
		} as unknown as JobRoleDao;

		service = new ApplicationService(applicationDao, jobRoleDao);
	});

	describe("applyForJob", () => {
		it("should throw when user already applied", async () => {
			vi.mocked(applicationDao.checkExistingApplication).mockResolvedValue({
				applicationId: 1,
			} as ApplicationWithIncludes);

			await expect(
				service.applyForJob(1, { jobRoleId: 10, cvUrl: "url" }),
			).rejects.toThrow("You have already applied for this job role");
		});

		it("should throw when job role not found", async () => {
			vi.mocked(applicationDao.checkExistingApplication).mockResolvedValue(
				null,
			);
			vi.mocked(jobRoleDao.getJobRoleById).mockResolvedValue(null);

			await expect(
				service.applyForJob(1, { jobRoleId: 10, cvUrl: "url" }),
			).rejects.toThrow("Job role not found");
		});

		it("should throw when job role is not open", async () => {
			vi.mocked(applicationDao.checkExistingApplication).mockResolvedValue(
				null,
			);
			vi.mocked(jobRoleDao.getJobRoleById).mockResolvedValue(
				buildJobRole({ status: { statusId: 2, statusName: "Closed" } }),
			);

			await expect(
				service.applyForJob(1, { jobRoleId: 10, cvUrl: "url" }),
			).rejects.toThrow("This job role is not open for applications");
		});

		it("should throw when no open positions are available", async () => {
			vi.mocked(applicationDao.checkExistingApplication).mockResolvedValue(
				null,
			);
			vi.mocked(jobRoleDao.getJobRoleById).mockResolvedValue(
				buildJobRole({ numberOfOpenPositions: 0 }),
			);

			await expect(
				service.applyForJob(1, { jobRoleId: 10, cvUrl: "url" }),
			).rejects.toThrow("No open positions available for this job role");
		});

		it("should throw when closing date has passed", async () => {
			vi.mocked(applicationDao.checkExistingApplication).mockResolvedValue(
				null,
			);
			vi.mocked(jobRoleDao.getJobRoleById).mockResolvedValue(
				buildJobRole({ closingDate: new Date(Date.now() - 60_000) }),
			);

			await expect(
				service.applyForJob(1, { jobRoleId: 10, cvUrl: "url" }),
			).rejects.toThrow("The closing date for this job role has passed");
		});

		it("should create an application when checks pass", async () => {
			vi.mocked(applicationDao.checkExistingApplication).mockResolvedValue(
				null,
			);
			vi.mocked(jobRoleDao.getJobRoleById).mockResolvedValue(buildJobRole());

			const created = {
				applicationId: 1,
				userId: 1,
				jobRoleId: 10,
				cvUrl: "url",
				applicationStatus: "SUBMITTED",
				appliedAt: new Date(),
			} as ApplicationWithIncludes;

			vi.mocked(applicationDao.createApplication).mockResolvedValue(created);

			const result = await service.applyForJob(1, {
				jobRoleId: 10,
				cvUrl: "url",
			});

			expect(result).toBe(created);
			expect(applicationDao.createApplication).toHaveBeenCalledWith({
				userId: 1,
				jobRoleId: 10,
				cvUrl: "url",
			});
		});
	});

	describe("canUserApplyForJob", () => {
		it("should return false when already applied", async () => {
			vi.mocked(applicationDao.checkExistingApplication).mockResolvedValue({
				applicationId: 1,
			} as ApplicationWithIncludes);

			const result = await service.canUserApplyForJob(1, 10);

			expect(result).toEqual({
				canApply: false,
				reason: "You have already applied for this job role",
			});
		});

		it("should return false when job role not found", async () => {
			vi.mocked(applicationDao.checkExistingApplication).mockResolvedValue(
				null,
			);
			vi.mocked(jobRoleDao.getJobRoleById).mockResolvedValue(null);

			const result = await service.canUserApplyForJob(1, 10);

			expect(result).toEqual({
				canApply: false,
				reason: "Job role not found",
			});
		});

		it("should return false when job role is not open", async () => {
			vi.mocked(applicationDao.checkExistingApplication).mockResolvedValue(
				null,
			);
			vi.mocked(jobRoleDao.getJobRoleById).mockResolvedValue(
				buildJobRole({ status: { statusId: 2, statusName: "Closed" } }),
			);

			const result = await service.canUserApplyForJob(1, 10);

			expect(result).toEqual({
				canApply: false,
				reason: "This job role is not open for applications",
			});
		});

		it("should return false when no open positions", async () => {
			vi.mocked(applicationDao.checkExistingApplication).mockResolvedValue(
				null,
			);
			vi.mocked(jobRoleDao.getJobRoleById).mockResolvedValue(
				buildJobRole({ numberOfOpenPositions: 0 }),
			);

			const result = await service.canUserApplyForJob(1, 10);

			expect(result).toEqual({
				canApply: false,
				reason: "No open positions available",
			});
		});

		it("should return false when closing date passed", async () => {
			vi.mocked(applicationDao.checkExistingApplication).mockResolvedValue(
				null,
			);
			vi.mocked(jobRoleDao.getJobRoleById).mockResolvedValue(
				buildJobRole({ closingDate: new Date(Date.now() - 60_000) }),
			);

			const result = await service.canUserApplyForJob(1, 10);

			expect(result).toEqual({
				canApply: false,
				reason: "The closing date has passed",
			});
		});

		it("should return true when eligible", async () => {
			vi.mocked(applicationDao.checkExistingApplication).mockResolvedValue(
				null,
			);
			vi.mocked(jobRoleDao.getJobRoleById).mockResolvedValue(buildJobRole());

			const result = await service.canUserApplyForJob(1, 10);

			expect(result).toEqual({ canApply: true });
		});
	});
});
