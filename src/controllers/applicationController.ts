import type { Request, Response } from "express";

import type { ApplicationWithIncludes } from "../dao/applicationDao";
import { toApplicationResponse } from "../mappers/applicationMapper";
import type { ApplicationService } from "../services/applicationService";
import type { S3Service } from "../services/s3Service";

export class ApplicationController {
	private applicationService: ApplicationService;
	private s3Service: S3Service;

	constructor(applicationService: ApplicationService, s3Service: S3Service) {
		this.applicationService = applicationService;
		this.s3Service = s3Service;
	}

	// Apply for a job with CV upload
	public applyForJob = async (req: Request, res: Response): Promise<void> => {
		try {
			if (!req.file) {
				res.status(400).json({ message: "CV file is required" });
				return;
			}

			const userId = Number(req.userId);
			if (Number.isNaN(userId)) {
				res.status(401).json({ message: "Invalid user ID" });
				return;
			}
			if (!userId) {
				res.status(401).json({ message: "User not authenticated" });
				return;
			}

			const { jobRoleId } = req.body;
			if (!jobRoleId) {
				res.status(400).json({ message: "Job role ID is required" });
				return;
			}

			const jobRoleNumber = Number(jobRoleId);
			if (Number.isNaN(jobRoleNumber)) {
				res.status(400).json({ message: "Invalid job role ID" });
				return;
			}

			// Check if user can apply for this job
			const canApplyResult = await this.applicationService.canUserApplyForJob(
				userId,
				jobRoleNumber,
			);

			if (!canApplyResult.canApply) {
				res.status(400).json({ message: canApplyResult.reason });
				return;
			}

			// Upload CV to S3
			const cvUrl = await this.s3Service.uploadCV(req.file, userId);

			// Create the application
			const application = (await this.applicationService.applyForJob(userId, {
				jobRoleId: jobRoleNumber,
				cvUrl: cvUrl,
			})) as ApplicationWithIncludes;

			const mappedApplication = toApplicationResponse(application);

			res.status(201).json({
				message: "Application submitted successfully",
				application: mappedApplication,
			});
		} catch (error) {
			console.error("Error applying for job:", error);
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: "Failed to submit application" });
			}
		}
	};

	// Get all applications for the current user
	// public getMyApplications = async (
	// 	req: Request,
	// 	res: Response,
	// ): Promise<void> => {
	// 	try {
	// 		const userId = req.userId;
	// 		if (!userId) {
	// 			res.status(401).json({ message: "User not authenticated" });
	// 			return;
	// 		}

	// 		const applications = (await this.applicationService.getApplicationsByUser(
	// 			userId,
	// 		)) as ApplicationWithIncludes[];

	// 		const formattedApplications = applications.map((app) => ApplicationMapper.toApplicationResponse(app));

	// 		res.status(200).json({
	// 			applications: formattedApplications,
	// 		});
	// 	} catch (error) {
	// 		console.error("Error getting user applications:", error);
	// 		res.status(500).json({ message: "Failed to retrieve applications" });
	// 	}
	// };

	// // Get application by ID
	// public getApplicationById = async (
	// 	req: Request,
	// 	res: Response,
	// ): Promise<void> => {
	// 	try {
	// 		const { applicationId } = req.params;
	// 		const userId = req.userId;

	// 		if (!userId) {
	// 			res.status(401).json({ message: "User not authenticated" });
	// 			return;
	// 		}

	// 		const applicationNumber = Number(applicationId);
	// 		if (Number.isNaN(applicationNumber)) {
	// 			res.status(400).json({ message: "Invalid application ID" });
	// 			return;
	// 		}

	// 		const application = (await this.applicationService.getApplicationById(
	// 			applicationNumber,
	// 		)) as ApplicationWithIncludes | null;

	// 		if (!application) {
	// 			res.status(404).json({ message: "Application not found" });
	// 			return;
	// 		}

	// 		// Check if the application belongs to the current user
	// 		if (application.userId !== userId) {
	// 			res.status(403).json({ message: "Access denied" });
	// 			return;
	// 		}

	// 		const mappedApplication = ApplicationMapper.toApplicationResponse(application);

	// 		res.status(200).json({
	// 			application: mappedApplication,
	// 		});
	// 	} catch (error) {
	// 		console.error("Error getting application:", error);
	// 		res.status(500).json({ message: "Failed to retrieve application" });
	// 	}
	// };

	// // Check if user can apply for a specific job role
	// public checkCanApply = async (req: Request, res: Response): Promise<void> => {
	// 	try {
	// 		const { jobRoleId } = req.params;
	// 		const userId = req.userId;

	// 		if (!userId) {
	// 			res.status(401).json({ message: "User not authenticated" });
	// 			return;
	// 		}

	// 		const jobRoleNumber = Number(jobRoleId);
	// 			appliedAt: app.appliedAt,
	// 			updatedAt: app.updatedAt,
	// 			cvUrl: app.cvUrl,
	// 		}));

	// 		res.status(200).json({
	// 			applications: formattedApplications,
	// 		});
	// 	} catch (error) {
	// 		console.error("Error getting user applications:", error);
	// 		res.status(500).json({ message: "Failed to retrieve applications" });
	// 	}
	// };

	// // Get application by ID
	// public getApplicationById = async (
	// 	req: Request,
	// 	res: Response,
	// ): Promise<void> => {
	// 	try {
	// 		const { applicationId } = req.params;
	// 		const userId = req.userId;

	// 		if (!userId) {
	// 			res.status(401).json({ message: "User not authenticated" });
	// 			return;
	// 		}

	// 		const applicationNumber = Number(applicationId);
	// 		if (Number.isNaN(applicationNumber)) {
	// 			res.status(400).json({ message: "Invalid application ID" });
	// 			return;
	// 		}

	// 		const application = (await this.applicationService.getApplicationById(
	// 			applicationNumber,
	// 		)) as ApplicationWithIncludes | null;

	// 		if (!application) {
	// 			res.status(404).json({ message: "Application not found" });
	// 			return;
	// 		}

	// 		// Check if the application belongs to the current user
	// 		if (application.userId !== userId) {
	// 			res.status(403).json({ message: "Access denied" });
	// 			return;
	// 		}

	// 		res.status(200).json({
	// 			application: {
	// 				applicationId: application.applicationId,
	// 				jobRole: {
	// 					jobRoleId: application.jobRole.jobRoleId,
	// 					roleName: application.jobRole.roleName,
	// 					jobLocation: application.jobRole.jobLocation,
	// 					capability: application.jobRole.capability.capabilityName,
	// 					band: application.jobRole.band.bandName,
	// 					closingDate: application.jobRole.closingDate,
	// 					description: application.jobRole.description,
	// 					responsibilities: application.jobRole.responsibilities,
	// 				},
	// 				applicationStatus: application.applicationStatus,
	// 				appliedAt: application.appliedAt,
	// 				updatedAt: application.updatedAt,
	// 				cvUrl: application.cvUrl,
	// 			},
	// 		});
	// 	} catch (error) {
	// 		console.error("Error getting application:", error);
	// 		res.status(500).json({ message: "Failed to retrieve application" });
	// 	}
	// };

	// // Check if user can apply for a specific job role
	// public checkCanApply = async (req: Request, res: Response): Promise<void> => {
	// 	try {
	// 		const { jobRoleId } = req.params;
	// 		const userId = req.userId;

	// 		if (!userId) {
	// 			res.status(401).json({ message: "User not authenticated" });
	// 			return;
	// 		}

	// 		const jobRoleNumber = Number(jobRoleId);
	// 		if (Number.isNaN(jobRoleNumber)) {
	// 			res.status(400).json({ message: "Invalid job role ID" });
	// 			return;
	// 		}

	// 		const canApplyResult = await this.applicationService.canUserApplyForJob(
	// 			userId,
	// 			jobRoleNumber,
	// 		);

	// 		res.status(200).json(canApplyResult);
	// 	} catch (error) {
	// 		console.error("Error checking if user can apply:", error);
	// 		res
	// 			.status(500)
	// 			.json({ message: "Failed to check application eligibility" });
	// 	}
	// };

	// // Admin endpoint: Get all applications for a specific job role
	// public getApplicationsForJobRole = async (
	// 	req: Request,
	// 	res: Response,
	// ): Promise<void> => {
	// 	try {
	// 		const { jobRoleId } = req.params;

	// 		const jobRoleNumber = Number(jobRoleId);
	// 		if (Number.isNaN(jobRoleNumber)) {
	// 			res.status(400).json({ message: "Invalid job role ID" });
	// 			return;
	// 		}

	// 		const applications =
	// 			(await this.applicationService.getApplicationsByJobRole(
	// 				jobRoleNumber,
	// 			)) as ApplicationWithIncludes[];

	// 		const formattedApplications = applications.map((app) => ({
	// 			applicationId: app.applicationId,
	// 			user: {
	// 				userId: app.user.userId,
	// 				userEmail: app.user.userEmail,
	// 			},
	// 			applicationStatus: app.applicationStatus,
	// 			appliedAt: app.appliedAt,
	// 			updatedAt: app.updatedAt,
	// 			cvUrl: app.cvUrl,
	// 		}));

	// 		res.status(200).json({
	// 			jobRoleId: jobRoleNumber,
	// 			applications: formattedApplications,
	// 		});
	// 	} catch (error) {
	// 		console.error("Error getting applications for job role:", error);
	// 		res.status(500).json({ message: "Failed to retrieve applications" });
	// 	}
	// };

	// // Admin endpoint: Update application status
	// public updateApplicationStatus = async (
	// 	req: Request,
	// 	res: Response,
	// ): Promise<void> => {
	// 	try {
	// 		const { applicationId } = req.params;
	// 		const { status } = req.body;

	// 		const applicationNumber = Number(applicationId);
	// 		if (Number.isNaN(applicationNumber)) {
	// 			res.status(400).json({ message: "Invalid application ID" });
	// 			return;
	// 		}

	// 		if (
	// 			!status ||
	// 			!["IN_PROGRESS", "REVIEWING", "ACCEPTED", "REJECTED"].includes(status)
	// 		) {
	// 			res.status(400).json({
	// 				message:
	// 					"Valid status is required (IN_PROGRESS, REVIEWING, ACCEPTED, REJECTED)",
	// 			});
	// 			return;
	// 		}

	// 		const updatedApplication =
	// 			await this.applicationService.updateApplicationStatus(
	// 				applicationNumber,
	// 				status,
	// 			);

	// 		res.status(200).json({
	// 			message: "Application status updated successfully",
	// 			application: {
	// 				applicationId: updatedApplication.applicationId,
	// 				applicationStatus: updatedApplication.applicationStatus,
	// 				updatedAt: updatedApplication.updatedAt,
	// 			},
	// 		});
	// 	} catch (error) {
	// 		console.error("Error updating application status:", error);
	// 		if (error instanceof Error) {
	// 			res.status(400).json({ message: error.message });
	// 		} else {
	// 			res
	// 				.status(500)
	// 				.json({ message: "Failed to update application status" });
	// 		}
	// 	}
	// };
}
