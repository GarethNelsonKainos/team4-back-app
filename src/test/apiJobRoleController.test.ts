import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "../index"; // Import the configured app
import { JobRoleService } from "../services/jobRoleService";
import { JobRoleResponse } from "../models/jobRoleResponse";

// Mock the service
vi.mock("../services/jobRoleService");

describe("GET /api/job-roles", () => {
  it("should return a list of job roles", async () => {
    const closingDate = new Date("2026-02-09");
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

    // Mock the implementation of getJobRoles
    vi.spyOn(JobRoleService.prototype, "getJobRoles").mockResolvedValue(
      mockJobRoleResponses,
    );

    const response = await request(app).get("/api/job-roles");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      mockJobRoleResponses.map((r) => ({
        ...r,
        closingDate: r.closingDate.toISOString(),
      })),
    );
  });

  it("should return 500 if service throws an error", async () => {
    // Mock the implementation to throw an error
    vi.spyOn(JobRoleService.prototype, "getJobRoles").mockRejectedValue(
      new Error("Database error"),
    );

    const response = await request(app).get("/api/job-roles");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Failed to get job roles" });
  });
});
