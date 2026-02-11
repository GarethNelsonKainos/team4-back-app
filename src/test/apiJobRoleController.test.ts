import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../index";
import { JobRoleService } from "../services/jobRoleService";
import { ApiJobRoleController } from "../controllers/apiJobRoleController";
import { JobRoleResponse } from "../models/jobRoleResponse";

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
