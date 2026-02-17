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
		(req as Request & { userRole: string }).userRole = "ADMIN";
		next();
	},
	requireRoles: () => (_req: Request, _res: Response, next: NextFunction) => {
		next();
	},
}));

describe("GET /api/job-roles", () => {
	let mockJobRoleService: JobRoleService;

	beforeEach(() => {
		mockJobRoleService = {
			getJobRoles: vi.fn(),
			getJobRoleById: vi.fn(),
			createJobRole: vi.fn(),
			updateJobRole: vi.fn(),
			deleteJobRole: vi.fn(),
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

describe("GET /api/job-roles/:id", () => {
	let mockJobRoleService: JobRoleService;

	beforeEach(() => {
		mockJobRoleService = {
			getJobRoles: vi.fn(),
			getJobRoleById: vi.fn(),
			createJobRole: vi.fn(),
			updateJobRole: vi.fn(),
			deleteJobRole: vi.fn(),
		} as unknown as JobRoleService;
	});

	it("should return a job role by id", async () => {
		const closingDate = "2026-02-09";
		const mockJobRoleResponse: JobRoleResponse = {
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
		};

		vi.mocked(mockJobRoleService.getJobRoleById).mockResolvedValue(
			mockJobRoleResponse,
		);

		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).get("/api/job-roles/1");

		expect(response.status).toBe(200);
		expect(response.body).toEqual(mockJobRoleResponse);
	});

	it("should return 404 if job role not found", async () => {
		vi.mocked(mockJobRoleService.getJobRoleById).mockResolvedValue(null);

		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).get("/api/job-roles/999");

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: "Job role not found" });
	});

	it("should return 500 if service throws an error", async () => {
		vi.mocked(mockJobRoleService.getJobRoleById).mockRejectedValue(
			new Error("Database error"),
		);

		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).get("/api/job-roles/1");

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: "Failed to get job role" });
	});
});

describe("POST /api/job-roles", () => {
	let mockJobRoleService: JobRoleService;

	beforeEach(() => {
		mockJobRoleService = {
			getJobRoles: vi.fn(),
			getJobRoleById: vi.fn(),
			createJobRole: vi.fn(),
			updateJobRole: vi.fn(),
			deleteJobRole: vi.fn(),
		} as unknown as JobRoleService;
	});

	it("should create a new job role", async () => {
		const closingDate = "2026-02-09";
		const mockJobRoleResponse: JobRoleResponse = {
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
		};

		vi.mocked(mockJobRoleService.createJobRole).mockResolvedValue(
			mockJobRoleResponse,
		);

		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).post("/api/job-roles").send({
			roleName: "Software Engineer",
			jobLocation: "Manchester",
			capabilityId: 1,
			bandId: 1,
			closingDate: "2026-02-09",
			description: "A role for software engineers",
			responsibilities: "Develop software solutions",
			sharepointUrl: "https://sharepoint.example.com/job/1",
			statusId: 1,
			numberOfOpenPositions: 3,
		});

		expect(response.status).toBe(201);
		expect(response.body).toEqual(mockJobRoleResponse);
	});

	it("should return 500 if service throws an error", async () => {
		vi.mocked(mockJobRoleService.createJobRole).mockRejectedValue(
			new Error("Database error"),
		);

		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).post("/api/job-roles").send({
			roleName: "Software Engineer",
			jobLocation: "Manchester",
			capabilityId: 1,
			bandId: 1,
			closingDate: "2026-02-09",
			description: "A role for software engineers",
			responsibilities: "Develop software solutions",
			sharepointUrl: "https://sharepoint.example.com/job/1",
			statusId: 1,
			numberOfOpenPositions: 3,
		});

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: "Failed to create job role" });
	});
});

describe("PUT /api/job-roles/:id", () => {
	let mockJobRoleService: JobRoleService;

	beforeEach(() => {
		mockJobRoleService = {
			getJobRoles: vi.fn(),
			getJobRoleById: vi.fn(),
			createJobRole: vi.fn(),
			updateJobRole: vi.fn(),
			deleteJobRole: vi.fn(),
		} as unknown as JobRoleService;
	});

	it("should update a job role", async () => {
		const closingDate = "2026-02-09";
		const mockJobRoleResponse: JobRoleResponse = {
			jobRoleId: 1,
			roleName: "Senior Software Engineer",
			location: "Manchester",
			capability: "Engineering",
			band: "Associate",
			closingDate: closingDate,
			description: "A role for senior software engineers",
			responsibilities: "Lead software solutions",
			sharepointUrl: "https://sharepoint.example.com/job/1",
			status: "Open",
			numberOfOpenPositions: 3,
		};

		vi.mocked(mockJobRoleService.updateJobRole).mockResolvedValue(
			mockJobRoleResponse,
		);

		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).put("/api/job-roles/1").send({
			roleName: "Senior Software Engineer",
			description: "A role for senior software engineers",
		});

		expect(response.status).toBe(200);
		expect(response.body).toEqual(mockJobRoleResponse);
	});

	it("should return 500 if service throws an error", async () => {
		vi.mocked(mockJobRoleService.updateJobRole).mockRejectedValue(
			new Error("Database error"),
		);

		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).put("/api/job-roles/1").send({
			roleName: "Senior Software Engineer",
		});

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: "Failed to update job role" });
	});
});

describe("DELETE /api/job-roles/:id", () => {
	let mockJobRoleService: JobRoleService;

	beforeEach(() => {
		mockJobRoleService = {
			getJobRoles: vi.fn(),
			getJobRoleById: vi.fn(),
			createJobRole: vi.fn(),
			updateJobRole: vi.fn(),
			deleteJobRole: vi.fn(),
		} as unknown as JobRoleService;
	});

	it("should delete a job role", async () => {
		vi.mocked(mockJobRoleService.deleteJobRole).mockResolvedValue(undefined);

		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).delete("/api/job-roles/1");

		expect(response.status).toBe(204);
	});

	it("should return 500 if service throws an error", async () => {
		vi.mocked(mockJobRoleService.deleteJobRole).mockRejectedValue(
			new Error("Database error"),
		);

		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).delete("/api/job-roles/1");

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ message: "Failed to delete job role" });
	});
});
