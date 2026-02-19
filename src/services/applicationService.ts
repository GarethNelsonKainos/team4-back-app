import type {
	ApplicationDao,
	ApplicationWithIncludes,
	CreateApplicationData,
} from "../dao/applicationDao";
import type { JobRoleDao } from "../dao/jobRoleDao";

export interface JobApplicationRequest {
	jobRoleId: number;
	cvUrl: string;
}

export class ApplicationService {
	private applicationDao: ApplicationDao;
	private jobRoleDao: JobRoleDao;

	constructor(applicationDao: ApplicationDao, jobRoleDao: JobRoleDao) {
		this.applicationDao = applicationDao;
		this.jobRoleDao = jobRoleDao;
	}

	async applyForJob(
		userId: number,
		data: JobApplicationRequest,
	): Promise<ApplicationWithIncludes> {
		// Check if user has already applied for this job
		const existingApplication =
			await this.applicationDao.checkExistingApplication(
				userId,
				data.jobRoleId,
			);

		if (existingApplication) {
			throw new Error("You have already applied for this job role");
		}

		// Check if job role exists and is open for applications
		const jobRole = await this.jobRoleDao.getJobRoleById(data.jobRoleId);
		if (!jobRole) {
			throw new Error("Job role not found");
		}

		// Check if job role is open and has available positions
		if (jobRole.status.statusName.toLowerCase() !== "open") {
			throw new Error("This job role is not open for applications");
		}

		if (jobRole.numberOfOpenPositions <= 0) {
			throw new Error("No open positions available for this job role");
		}

		// Check if closing date has passed
		const now = new Date();
		if (jobRole.closingDate < now) {
			throw new Error("The closing date for this job role has passed");
		}

		// Create the application
		const applicationData: CreateApplicationData = {
			userId: userId,
			jobRoleId: data.jobRoleId,
			cvUrl: data.cvUrl,
		};

		return await this.applicationDao.createApplication(applicationData);
	}

	async canUserApplyForJob(
		userId: number,
		jobRoleId: number,
	): Promise<{ canApply: boolean; reason?: string }> {
		// Check if user has already applied
		const existingApplication =
			await this.applicationDao.checkExistingApplication(userId, jobRoleId);

		if (existingApplication) {
			return {
				canApply: false,
				reason: "You have already applied for this job role",
			};
		}

		// Check job role availability
		const jobRole = await this.jobRoleDao.getJobRoleById(jobRoleId);
		if (!jobRole) {
			return {
				canApply: false,
				reason: "Job role not found",
			};
		}

		if (jobRole.status.statusName.toLowerCase() !== "open") {
			return {
				canApply: false,
				reason: "This job role is not open for applications",
			};
		}

		if (jobRole.numberOfOpenPositions <= 0) {
			return {
				canApply: false,
				reason: "No open positions available",
			};
		}

		const now = new Date();
		if (jobRole.closingDate < now) {
			return {
				canApply: false,
				reason: "The closing date has passed",
			};
		}

		return { canApply: true };
	}
}
