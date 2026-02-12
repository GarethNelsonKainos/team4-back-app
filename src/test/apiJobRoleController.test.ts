import type { NextFunction, Request, Response } from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiJobRoleController } from "../controllers/apiJobRoleController";
import { createApp } from "../index";
import type { JobRoleResponse } from "../models/jobRoleResponse";
import type { JobRoleService } from "../services/jobRoleService";

vi.mock("../services/jobRoleService");
vi.mock("../middleware/authMiddleware", () => ({
	authMiddleware: (req: Request, _res: Response, next: NextFunction) => {
		(req as Request & { userId: number }).userId = 1; // Set a fake userId for testing
		next();
	},
}));

describe("GET /api/job-roles", () => {
	let mockJobRoleService: JobRoleService;

	beforeEach(() => {
		mockJobRoleService = {
			getJobRoles: vi.fn(),
		} as unknown as JobRoleService;
	});

	it("should return a list of job roles", async () => {
		const closingDate = "2026-02-09";
		const mockJobRoleResponses: JobRoleResponse[] = [
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

		vi.mocked(mockJobRoleService.getJobRoles).mockResolvedValue(
			mockJobRoleResponses,
		);

		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).get("/api/job-roles");

		expect(response.status).toBe(200);
		expect(response.body).toEqual(mockJobRoleResponses);
	});

	it("should return 500 if service throws an error", async () => {
		vi.mocked(mockJobRoleService.getJobRoles).mockRejectedValue(
			new Error("Database error"),
		);

		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).get("/api/job-roles");

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: "Failed to get job roles" });
	});
});
