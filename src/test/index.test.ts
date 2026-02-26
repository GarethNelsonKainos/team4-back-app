import type { NextFunction, Request, Response } from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { ApiJobRoleController } from "../controllers/apiJobRoleController";
import { createApp } from "../index";
import type { JobRoleService } from "../services/jobRoleService";

interface AuthenticatedRequest extends Request {
	user?: { role: string };
}

vi.mock("../middleware/authMiddleware", () => ({
	authMiddleware: (
		req: AuthenticatedRequest,
		_res: Response,
		next: NextFunction,
	) => {
		req.user = { role: "APPLICANT" };
		next();
	},
}));

describe("createApp", () => {
	it("should return 403 for non-admin job role creation", async () => {
		const mockJobRoleService = {
			getJobRoles: vi.fn(),
			getJobRoleById: vi.fn(),
			createJobRole: vi.fn(),
			updateJobRole: vi.fn(),
			deleteJobRole: vi.fn(),
		} as unknown as JobRoleService;

		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).post("/api/job-roles").send({
			roleName: "Ignored",
			jobLocation: "Nowhere",
			capabilityId: 1,
			bandId: 1,
			closingDate: "2026-02-09",
			description: "Ignored",
			responsibilities: "Ignored",
			sharepointUrl: "https://sharepoint.example.com/job/1",
			statusId: 1,
			numberOfOpenPositions: 1,
		});

		expect(response.status).toBe(403);
		expect(response.body).toEqual({ error: "Forbidden" });
	});
});
