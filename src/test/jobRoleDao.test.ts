import { beforeEach, describe, expect, it } from "vitest";
import { type DeepMockProxy, mockDeep } from "vitest-mock-extended";
import { JobRoleDao } from "../dao/jobRoleDao";
import type { PrismaClient } from "../generated/client";
import type { JobRoleData } from "../models/jobRoleData";

describe("JobRoleDao", () => {
  let prismaMock: DeepMockProxy<PrismaClient>;
  let jobRoleDao: JobRoleDao;

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>();
    jobRoleDao = new JobRoleDao(prismaMock);
  });

  it("should return job roles from the database", async () => {
    const closingDate = new Date("2026-02-09");
    const mockDbJobRoles: JobRoleData[] = [
      {
        jobRoleId: 1,
        roleName: "Software Engineer",
        jobLocation: "Manchester",
        closingDate: closingDate,
        description: "A role for software engineers",
        responsibilities: "Develop software solutions",
        sharepointUrl: "https://sharepoint.example.com/job/1",
        numberOfOpenPositions: 3,
        capability: {
          capabilityId: 1,
          capabilityName: "Engineering",
        },
        band: {
          bandId: 1,
          bandName: "Associate",
        },
        status: {
          statusId: 1,
          statusName: "Open",
        },
      },
    ];

    prismaMock.jobRole.findMany.mockResolvedValue(
      mockDbJobRoles as unknown as Awaited<
        ReturnType<typeof prismaMock.jobRole.findMany>
      >,
    );

    const result = await jobRoleDao.getJobRoles();

    expect(result).toEqual(mockDbJobRoles);

    expect(prismaMock.jobRole.findMany).toHaveBeenCalledWith({
      include: {
        capability: true,
        band: true,
        status: true,
      },
    });
  });

  it("should return multiple job roles", async () => {
    const closingDate1 = new Date("2026-02-09");
    const closingDate2 = new Date("2026-03-15");
    const mockDbJobRolesMultiple: JobRoleData[] = [
      {
        jobRoleId: 1,
        roleName: "Software Engineer",
        jobLocation: "Manchester",
        closingDate: closingDate1,
        description: "A role for software engineers",
        responsibilities: "Develop software solutions",
        sharepointUrl: "https://sharepoint.example.com/job/1",
        numberOfOpenPositions: 3,
        capability: {
          capabilityId: 1,
          capabilityName: "Engineering",
        },
        band: {
          bandId: 1,
          bandName: "Associate",
        },
        status: {
          statusId: 1,
          statusName: "Open",
        },
      },
      {
        jobRoleId: 2,
        roleName: "Data Analyst",
        jobLocation: "London",
        closingDate: closingDate2,
        description: "A role for data analysts",
        responsibilities: "Analyze data patterns",
        sharepointUrl: "https://sharepoint.example.com/job/2",
        numberOfOpenPositions: 2,
        capability: {
          capabilityId: 2,
          capabilityName: "Data",
        },
        band: {
          bandId: 2,
          bandName: "Consultant",
        },
        status: {
          statusId: 1,
          statusName: "Open",
        },
      },
    ];

    prismaMock.jobRole.findMany.mockResolvedValue(
      mockDbJobRolesMultiple as unknown as Awaited<
        ReturnType<typeof prismaMock.jobRole.findMany>
      >,
    );

    const result = await jobRoleDao.getJobRoles();

    expect(result).toEqual(mockDbJobRolesMultiple);
    expect(result.length).toBe(2);

    expect(prismaMock.jobRole.findMany).toHaveBeenCalledWith({
      include: {
        capability: true,
        band: true,
        status: true,
      },
    });
  });

  it("should handle null capability and band relations", async () => {
    const closingDate = new Date("2026-02-09");
    const mockDbJobRolesWithNullRelations: JobRoleData[] = [
      {
        jobRoleId: 3,
        roleName: "Product Manager",
        jobLocation: "London",
        closingDate: closingDate,
        description: "PM role",
        responsibilities: "Manage products",
        sharepointUrl: "https://sharepoint.example.com/job/3",
        numberOfOpenPositions: 1,
        capability: null,
        band: null,
        status: null,
      },
    ];

    prismaMock.jobRole.findMany.mockResolvedValue(
      mockDbJobRolesWithNullRelations as unknown as Awaited<
        ReturnType<typeof prismaMock.jobRole.findMany>
      >,
    );

    const result = await jobRoleDao.getJobRoles();

    expect(result).toEqual(mockDbJobRolesWithNullRelations);

    expect(prismaMock.jobRole.findMany).toHaveBeenCalledWith({
      include: {
        capability: true,
        band: true,
        status: true,
      },
    });
  });

  it("should get a single job role by id", async () => {
    const closingDate = new Date("2026-02-09");
    const mockDbJobRole: JobRoleData = {
      jobRoleId: 1,
      roleName: "Software Engineer",
      jobLocation: "Manchester",
      closingDate: closingDate,
      description: "A role for software engineers",
      responsibilities: "Develop software solutions",
      sharepointUrl: "https://sharepoint.example.com/job/1",
      numberOfOpenPositions: 3,
      capability: {
        capabilityId: 1,
        capabilityName: "Engineering",
      },
      band: {
        bandId: 1,
        bandName: "Associate",
      },
      status: {
        statusId: 1,
        statusName: "Open",
      },
    };

    prismaMock.jobRole.findUnique.mockResolvedValue(
      mockDbJobRole as unknown as Awaited<
        ReturnType<typeof prismaMock.jobRole.findUnique>
      >,
    );

    const result = await jobRoleDao.getJobRoleById(1);

    expect(result).toEqual(mockDbJobRole);
    expect(prismaMock.jobRole.findUnique).toHaveBeenCalledWith({
      where: { jobRoleId: 1 },
      include: {
        capability: true,
        band: true,
        status: true,
      },
    });
  });

  it("should return null if job role not found by id", async () => {
    prismaMock.jobRole.findUnique.mockResolvedValue(null);

    const result = await jobRoleDao.getJobRoleById(999);

    expect(result).toBeNull();
    expect(prismaMock.jobRole.findUnique).toHaveBeenCalledWith({
      where: { jobRoleId: 999 },
      include: {
        capability: true,
        band: true,
        status: true,
      },
    });
  });

  it("should create a new job role", async () => {
    const closingDate = new Date("2026-02-09");
    const createInput = {
      roleName: "Software Engineer",
      jobLocation: "Manchester",
      capabilityId: 1,
      bandId: 1,
      closingDate: closingDate,
      description: "A role for software engineers",
      responsibilities: "Develop software solutions",
      sharepointUrl: "https://sharepoint.example.com/job/1",
      statusId: 1,
      numberOfOpenPositions: 3,
    };

    const mockDbJobRole: JobRoleData = {
      jobRoleId: 1,
      roleName: "Software Engineer",
      jobLocation: "Manchester",
      closingDate: closingDate,
      description: "A role for software engineers",
      responsibilities: "Develop software solutions",
      sharepointUrl: "https://sharepoint.example.com/job/1",
      numberOfOpenPositions: 3,
      capability: {
        capabilityId: 1,
        capabilityName: "Engineering",
      },
      band: {
        bandId: 1,
        bandName: "Associate",
      },
      status: {
        statusId: 1,
        statusName: "Open",
      },
    };

    prismaMock.jobRole.create.mockResolvedValue(
      mockDbJobRole as unknown as Awaited<
        ReturnType<typeof prismaMock.jobRole.create>
      >,
    );

    const result = await jobRoleDao.createJobRole(createInput);

    expect(result).toEqual(mockDbJobRole);
    expect(prismaMock.jobRole.create).toHaveBeenCalledWith({
      data: createInput,
      include: {
        capability: true,
        band: true,
        status: true,
      },
    });
  });

  it("should update a job role", async () => {
    const closingDate = new Date("2026-02-09");
    const updateInput = {
      roleName: "Senior Software Engineer",
    };

    const mockDbJobRole: JobRoleData = {
      jobRoleId: 1,
      roleName: "Senior Software Engineer",
      jobLocation: "Manchester",
      closingDate: closingDate,
      description: "A role for software engineers",
      responsibilities: "Develop software solutions",
      sharepointUrl: "https://sharepoint.example.com/job/1",
      numberOfOpenPositions: 3,
      capability: {
        capabilityId: 1,
        capabilityName: "Engineering",
      },
      band: {
        bandId: 1,
        bandName: "Associate",
      },
      status: {
        statusId: 1,
        statusName: "Open",
      },
    };

    prismaMock.jobRole.update.mockResolvedValue(
      mockDbJobRole as unknown as Awaited<
        ReturnType<typeof prismaMock.jobRole.update>
      >,
    );

    const result = await jobRoleDao.updateJobRole(1, updateInput);

    expect(result).toEqual(mockDbJobRole);
    expect(prismaMock.jobRole.update).toHaveBeenCalledWith({
      where: { jobRoleId: 1 },
      data: updateInput,
      include: {
        capability: true,
        band: true,
        status: true,
      },
    });
  });

  it("should delete a job role", async () => {
    prismaMock.jobRole.delete.mockResolvedValue(
      undefined as unknown as Awaited<
        ReturnType<typeof prismaMock.jobRole.delete>
      >,
    );

    await jobRoleDao.deleteJobRole(1);

    expect(prismaMock.jobRole.delete).toHaveBeenCalledWith({
      where: { jobRoleId: 1 },
    });
  });
});
