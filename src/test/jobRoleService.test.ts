import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { JobRoleService } from "../services/jobRoleService.js";
import { JobRoleDao } from "../dao/jobRoleDao.js";
import { JobRole } from "../models/jobRole.js";
import { JobRoleResponse } from "../models/jobRoleResponse.js";

vi.mock("../dao/jobRoleDao");

describe("JobRoleService", () => {
  const jobRoleService = new JobRoleService();
  let getJobRolesMock: Mock;

  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();
    getJobRolesMock = vi.spyOn(JobRoleDao.prototype, "getJobRoles");
  });

  it("should get job roles and map them to responses", async () => {
    const closingDate = "2026-02-09";
    const mockJobRoles: JobRole[] = [
      {
        jobRoleId: 1,
        roleName: "Software Engineer",
        location: "Manchester",
        capability: { capabilityId: 1, capabilityName: "Engineering" },
        band: { bandId: 1, bandName: "Associate" },
        capabilityId: 1,
        bandId: 1,
        closingDate: closingDate,
      },
    ];

    const expectedResponses: JobRoleResponse[] = [
      {
        jobRoleId: 1,
        roleName: "Software Engineer",
        location: "Manchester",
        capability: "Engineering",
        band: "Associate",
        closingDate: closingDate,
      },
    ];

    getJobRolesMock.mockResolvedValue(mockJobRoles);

    const result = await jobRoleService.getJobRoles();

    expect(result).toEqual(expectedResponses);
    expect(getJobRolesMock).toHaveBeenCalledOnce();
  });

  it("should handle missing capability and band relations", async () => {
    const closingDate = "2026-02-09";
    const mockJobRoles: JobRole[] = [
      {
        jobRoleId: 1,
        roleName: "Software Engineer",
        location: "Manchester",
        capability: undefined, 
        band: undefined, 
        capabilityId: 1,
        bandId: 1,
        closingDate: closingDate,
      },
    ];

    const expectedResponses: JobRoleResponse[] = [
      {
        jobRoleId: 1,
        roleName: "Software Engineer",
        location: "Manchester",
        capability: "Unknown", 
        band: "Unknown", 
        closingDate: closingDate,
      },
    ];

    getJobRolesMock.mockResolvedValue(mockJobRoles);

    const result = await jobRoleService.getJobRoles();

    expect(result).toEqual(expectedResponses);
    expect(getJobRolesMock).toHaveBeenCalledOnce();
  });
});
