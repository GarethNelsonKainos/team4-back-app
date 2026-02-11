import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "../index";
import { JobRoleService } from "../services/jobRoleService";
import { JobRoleResponse } from "../models/jobRoleResponse";

vi.mock("../services/jobRoleService");
vi.mock("../middleware/authMiddleware", () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.userId = 1; // Set a fake userId for testing
    next();
  },
}));

describe("GET /api/job-roles", () => {
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

    vi.spyOn(JobRoleService.prototype, "getJobRoles").mockResolvedValue(
      mockJobRoleResponses,
    );

    const response = await request(app).get("/api/job-roles");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockJobRoleResponses);
  });

  it("should return 500 if service throws an error", async () => {
    vi.spyOn(JobRoleService.prototype, "getJobRoles").mockRejectedValue(
      new Error("Database error"),
    );

    const response = await request(app).get("/api/job-roles");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Failed to get job roles" });
  });
});
