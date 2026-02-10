import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockDeep, mockReset, DeepMockProxy } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { JobRoleDao } from "../dao/jobRoleDao";
import { prisma } from "../db";
import { JobRole } from "../models/jobRole";

vi.mock("../db", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("JobRoleDao", () => {
  const jobRoleDao = new JobRoleDao();

  beforeEach(() => {
    mockReset(prismaMock);
  });

  it("should return job roles from the database", async () => {
    const closingDate = new Date();
    const mockDbJobRoles = [
      {
        jobRoleId: 1,
        roleName: "Software Engineer",
        jobLocation: "Manchester",
        capabilityId: 1,
        bandId: 1,
        closingDate: closingDate,
        capability: {
          capabilityId: 1,
          capabilityName: "Engineering",
        },
        band: {
          bandId: 1,
          bandName: "Associate",
        },
      },
    ];

    const expectedJobRoles: JobRole[] = [
      {
        jobRoleId: 1,
        roleName: "Software Engineer",
        location: "Manchester",
        capabilityId: 1,
        bandId: 1,
        closingDate: closingDate,
        capability: {
          capabilityId: 1,
          capabilityName: "Engineering",
        },
        band: {
          bandId: 1,
          bandName: "Associate",
        },
      },
    ];

    prismaMock.jobRole.findMany.mockResolvedValue(mockDbJobRoles);

    const result = await jobRoleDao.getJobRoles();

    expect(result).toEqual(expectedJobRoles);

    expect(prismaMock.jobRole.findMany).toHaveBeenCalledWith({
      include: {
        capability: true,
        band: true,
      },
    });
  });

  it("should handle null values from the database and apply fallbacks", async () => {
    const fixedDate = new Date();
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);

    const mockDbJobRolesWithNulls = [
      {
        jobRoleId: 2,
        roleName: null,
        jobLocation: null,
        capabilityId: 2,
        bandId: 2,
        closingDate: null,
        capability: {
          capabilityId: 2,
          capabilityName: "Data",
        },
        band: {
          bandId: 2,
          bandName: "Consultant",
        },
      },
    ];

    const expectedJobRoles: JobRole[] = [
      {
        jobRoleId: 2,
        roleName: "",
        location: "",
        capabilityId: 2,
        bandId: 2,
        closingDate: fixedDate,
        capability: {
          capabilityId: 2,
          capabilityName: "Data",
        },
        band: {
          bandId: 2,
          bandName: "Consultant",
        },
      },
    ];

    prismaMock.jobRole.findMany.mockResolvedValue(mockDbJobRolesWithNulls);

    const result = await jobRoleDao.getJobRoles();

    expect(result).toEqual(expectedJobRoles);

    expect(prismaMock.jobRole.findMany).toHaveBeenCalledWith({
      include: {
        capability: true,
        band: true,
      },
    });

    vi.useRealTimers();
  });
});
