import type { NextFunction, Request, Response } from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiJobRoleController } from "../controllers/apiJobRoleController";
import { createApp } from "../index";
import type { JobRoleResponse } from "../models/jobRoleResponse";
import type { JobRoleService } from "../services/jobRoleService";

interface AuthenticatedRequest extends Request {
	user?: { role: string };
}

vi.mock("../services/jobRoleService");
vi.mock("../middleware/authMiddleware", () => ({
	authMiddleware: (
		req: AuthenticatedRequest,
		_res: Response,
		next: NextFunction,
	) => {
		req.user = { role: "ADMIN" }; // Set a fake user role for testing
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

	it("should return 400 for invalid job role id", async () => {
		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).get("/api/job-roles/abc");

		expect(response.status).toBe(400);
		expect(response.body).toEqual({ message: "Invalid job role ID" });
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

	it("should return 400 for invalid request body", async () => {
		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).post("/api/job-roles").send({
			roleName: "",
			jobLocation: "",
		});

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Invalid request body");
		expect(response.body.errors.length).toBeGreaterThan(0);
	});

	it("should return 400 when required fields are missing", async () => {
		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).post("/api/job-roles").send({
			roleName: "Software Engineer",
			jobLocation: "Manchester",
			capabilityId: 1,
			bandId: 1,
			description: "A role for software engineers",
			responsibilities: "Develop software solutions",
			statusId: 1,
			numberOfOpenPositions: 3,
		});

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Invalid request body");
		expect(response.body.errors).toContain("Closing Date is required");
		expect(response.body.errors).toContain(
			"SharePoint URL is required and must be a non-empty string",
		);
	});

	it("should return 400 for invalid date and sharepoint url", async () => {
		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).post("/api/job-roles").send({
			roleName: "Software Engineer",
			jobLocation: "Manchester",
			capabilityId: -1,
			bandId: 0,
			closingDate: "invalid-date",
			description: "A role for software engineers",
			responsibilities: "Develop software solutions",
			sharepointUrl: "not-a-url",
			statusId: 0,
			numberOfOpenPositions: 0,
		});

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Invalid request body");
		expect(response.body.errors).toContain("closingDate must be a valid date");
		expect(response.body.errors).toContain(
			"SharePoint URL must be a valid URL",
		);
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

	it("should accept a valid sharepoint url update", async () => {
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
			sharepointUrl: "https://sharepoint.example.com/job/1",
		});

		expect(response.status).toBe(200);
		expect(response.body).toEqual(mockJobRoleResponse);
	});

	it("should accept a valid closing date update", async () => {
		const closingDate = "2026-12-31";
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
			closingDate: closingDate,
		});

		expect(response.status).toBe(200);
		expect(response.body).toEqual(mockJobRoleResponse);
	});

	it("should return 400 for invalid job role id", async () => {
		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).put("/api/job-roles/abc").send({
			roleName: "Senior Software Engineer",
		});

		expect(response.status).toBe(400);
		expect(response.body).toEqual({ message: "Invalid job role ID" });
	});

	it("should return 400 when no update fields provided", async () => {
		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).put("/api/job-roles/1").send({});

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Invalid request body");
		expect(response.body.errors).toContain(
			"At least one field must be provided for update",
		);
	});

	it("should return 400 for invalid update fields", async () => {
		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).put("/api/job-roles/1").send({
			roleName: "",
			jobLocation: "",
			capabilityId: -1,
			bandId: 0,
			closingDate: "invalid-date",
			description: "",
			responsibilities: "",
			sharepointUrl: "not-a-url",
			statusId: 0,
			numberOfOpenPositions: 0,
		});

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Invalid request body");
		expect(response.body.errors.length).toBeGreaterThan(0);
	});

	it("should return 400 for empty sharepointUrl in update", async () => {
		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).put("/api/job-roles/1").send({
			sharepointUrl: "",
		});

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Invalid request body");
		expect(response.body.errors).toContain(
			"SharePoint URL must be a non-empty string",
		);
	});

	it("should return 404 if job role not found", async () => {
		vi.mocked(mockJobRoleService.updateJobRole).mockResolvedValue(null);

		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).put("/api/job-roles/999").send({
			roleName: "Senior Software Engineer",
		});

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: "Job role not found" });
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
		vi.mocked(mockJobRoleService.deleteJobRole).mockResolvedValue(true);

		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).delete("/api/job-roles/1");

		expect(response.status).toBe(204);
	});

	it("should return 400 for invalid job role id", async () => {
		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).delete("/api/job-roles/abc");

		expect(response.status).toBe(400);
		expect(response.body).toEqual({ message: "Invalid job role ID" });
	});

	it("should return 404 if job role not found", async () => {
		vi.mocked(mockJobRoleService.deleteJobRole).mockResolvedValue(false);

		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).delete("/api/job-roles/999");

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: "Job role not found" });
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

	it("should return 404 for prisma not found error", async () => {
		vi.mocked(mockJobRoleService.deleteJobRole).mockRejectedValue({
			code: "P2025",
		});

		const controller = new ApiJobRoleController(mockJobRoleService);
		const app = createApp(controller);

		const response = await request(app).delete("/api/job-roles/1");

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ message: "Job role not found" });
	});
});
