import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApplicationController } from "../controllers/applicationController";
import type { ApplicationWithIncludes } from "../dao/applicationDao";
import type { ApplicationService } from "../services/applicationService";
import type { S3Service } from "../services/s3Service";

interface AppRequest extends Request {
	userId?: number;
	file?: Express.Multer.File;
}

describe("ApplicationController.applyForJob", () => {
	let mockApplicationService: ApplicationService;
	let mockS3Service: S3Service;
	let controller: ApplicationController;

	beforeEach(() => {
		mockApplicationService = {
			canUserApplyForJob: vi.fn(),
			applyForJob: vi.fn(),
		} as unknown as ApplicationService;

		mockS3Service = {
			uploadCV: vi.fn(),
		} as unknown as S3Service;

		controller = new ApplicationController(
			mockApplicationService,
			mockS3Service,
		);
	});

	const buildRes = () =>
		({
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		}) as unknown as Response;

	const buildFile = () =>
		({
			originalname: "cv.pdf",
			buffer: Buffer.from("fake-cv"),
			mimetype: "application/pdf",
		}) as Express.Multer.File;

	it("should return 400 when cv file is missing", async () => {
		const req = {
			userId: 1,
			body: { jobRoleId: 10 },
		} as AppRequest;
		const res = buildRes();

		await controller.applyForJob(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: "CV file is required" });
	});

	it("should return 401 when user id is invalid", async () => {
		const req = {
			userId: undefined,
			file: buildFile(),
			body: { jobRoleId: 10 },
		} as AppRequest;
		const res = buildRes();

		await controller.applyForJob(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: "Invalid user ID" });
	});

	it("should return 401 when user is not authenticated", async () => {
		const req = {
			userId: 0,
			file: buildFile(),
			body: { jobRoleId: 10 },
		} as AppRequest;
		const res = buildRes();

		await controller.applyForJob(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			message: "User not authenticated",
		});
	});

	it("should return 400 when job role id is missing", async () => {
		const req = {
			userId: 1,
			file: buildFile(),
			body: {},
		} as AppRequest;
		const res = buildRes();

		await controller.applyForJob(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: "Job role ID is required",
		});
	});

	it("should return 400 when job role id is invalid", async () => {
		const req = {
			userId: 1,
			file: buildFile(),
			body: { jobRoleId: "bad" },
		} as AppRequest;
		const res = buildRes();

		await controller.applyForJob(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: "Invalid job role ID" });
	});

	it("should return 400 when user cannot apply", async () => {
		vi.mocked(mockApplicationService.canUserApplyForJob).mockResolvedValue({
			canApply: false,
			reason: "Already applied",
		});

		const req = {
			userId: 2,
			file: buildFile(),
			body: { jobRoleId: 10 },
		} as AppRequest;
		const res = buildRes();

		await controller.applyForJob(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: "Already applied" });
	});

	it("should return 201 with application details on success", async () => {
		vi.mocked(mockApplicationService.canUserApplyForJob).mockResolvedValue({
			canApply: true,
		});
		vi.mocked(mockS3Service.uploadCV).mockResolvedValue(
			"https://s3.example.com/cv.pdf",
		);

		const application = {
			applicationId: 1,
			userId: 2,
			jobRoleId: 10,
			cvUrl: "https://s3.example.com/cv.pdf",
			applicationStatus: "SUBMITTED",
			appliedAt: new Date("2026-02-26T10:00:00Z"),
		} as ApplicationWithIncludes;

		vi.mocked(mockApplicationService.applyForJob).mockResolvedValue(
			application,
		);

		const req = {
			userId: 2,
			file: buildFile(),
			body: { jobRoleId: 10 },
		} as AppRequest;
		const res = buildRes();

		await controller.applyForJob(req, res);

		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			message: "Application submitted successfully",
			application: {
				applicationId: 1,
				userId: 2,
				jobRoleId: 10,
				cvUrl: "https://s3.example.com/cv.pdf",
				applicationStatus: "SUBMITTED",
				appliedAt: application.appliedAt,
			},
		});
	});

	it("should return 400 when an error is thrown", async () => {
		vi.mocked(mockApplicationService.canUserApplyForJob).mockRejectedValue(
			new Error("Boom"),
		);

		const req = {
			userId: 2,
			file: buildFile(),
			body: { jobRoleId: 10 },
		} as AppRequest;
		const res = buildRes();

		await controller.applyForJob(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: "Boom" });
	});

	it("should return 500 when a non-error is thrown", async () => {
		vi.mocked(mockApplicationService.canUserApplyForJob).mockRejectedValue(
			"Unexpected",
		);

		const req = {
			userId: 2,
			file: buildFile(),
			body: { jobRoleId: 10 },
		} as AppRequest;
		const res = buildRes();

		await controller.applyForJob(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			message: "Failed to submit application",
		});
	});
});
