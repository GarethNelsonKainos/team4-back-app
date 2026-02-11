import { describe, it, expect, vi, beforeEach } from "vitest";
import { JobRoleService } from "../services/jobRoleService";
import { JobRoleDao } from "../dao/jobRoleDao";
import { JobRole } from "../models/jobRole";
import { JobRoleResponse } from "../models/jobRoleResponse";

describe("JobRoleService", () => {
  let jobRoleService: JobRoleService;
  let mockJobRoleDao: JobRoleDao;

  beforeEach(() => {
    mockJobRoleDao = {
      getJobRoles: vi.fn(),
    } as unknown as JobRoleDao;
    
    jobRoleService = new JobRoleService(mockJobRoleDao);
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

    vi.mocked(mockJobRoleDao.getJobRoles).mockResolvedValue(mockJobRoles);

    const result = await jobRoleService.getJobRoles();

    expect(result).toEqual(expectedResponses);
    expect(mockJobRoleDao.getJobRoles).toHaveBeenCalledOnce();
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

    vi.mocked(mockJobRoleDao.getJobRoles).mockResolvedValue(mockJobRoles);

    const result = await jobRoleService.getJobRoles();

    expect(result).toEqual(expectedResponses);
    expect(mockJobRoleDao.getJobRoles).toHaveBeenCalledOnce();
  });
});
