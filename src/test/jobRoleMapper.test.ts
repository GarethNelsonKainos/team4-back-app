import { describe, expect, it } from "vitest";
import { JobRoleMapper } from "../mappers/jobRoleMapper";
import type { JobRoleData } from "../models/jobRoleData";

const closingDate = new Date("2026-02-09");

const basePrismaJobRole: JobRoleData = {
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

describe("JobRoleMapper", () => {
	it("should map a job role to response", () => {
		const result = JobRoleMapper.toResponse(basePrismaJobRole);

		expect(result).toEqual({
			jobRoleId: 1,
			roleName: "Software Engineer",
			location: "Manchester",
			capability: "Engineering",
			band: "Associate",
			closingDate: "2026-02-09",
			description: "A role for software engineers",
			responsibilities: "Develop software solutions",
			sharepointUrl: "https://sharepoint.example.com/job/1",
			status: "Open",
			numberOfOpenPositions: 3,
		});
	});

	it("should handle missing capability and use Unknown", () => {
		const jobRole = { ...basePrismaJobRole, capability: null };

		const result = JobRoleMapper.toResponse(jobRole);

		expect(result.capability).toBe("Unknown");
	});

	it("should handle missing band and use Unknown", () => {
		const jobRole = { ...basePrismaJobRole, band: null };

		const result = JobRoleMapper.toResponse(jobRole);

		expect(result.band).toBe("Unknown");
	});

	it("should handle null capability name", () => {
		const jobRole = {
			...basePrismaJobRole,
			capability: { capabilityId: 1, capabilityName: null },
		};

		const result = JobRoleMapper.toResponse(jobRole);

		expect(result.capability).toBe("Unknown");
	});

	it("should handle missing status and use Unknown", () => {
		const jobRole = { ...basePrismaJobRole, status: null };

		const result = JobRoleMapper.toResponse(jobRole);

		expect(result.status).toBe("Unknown");
	});

	it("should map multiple job roles consistently", () => {
		const closingDate2 = new Date("2026-03-20");
		const anotherJobRole: JobRoleData = {
			...basePrismaJobRole,
			jobRoleId: 2,
			roleName: "Data Analyst",
			jobLocation: "London",
			closingDate: closingDate2,
		};

		const result1 = JobRoleMapper.toResponse(basePrismaJobRole);
		const result2 = JobRoleMapper.toResponse(anotherJobRole);

		expect(result1.roleName).toBe("Software Engineer");
		expect(result2.roleName).toBe("Data Analyst");
		expect(result1.location).toBe("Manchester");
		expect(result2.location).toBe("London");
	});

	it("should handle different statuses", () => {
		const closedJobRole: JobRoleData = {
			...basePrismaJobRole,
			status: {
				statusId: 2,
				statusName: "Closed",
			},
		};

		const result = JobRoleMapper.toResponse(closedJobRole);

		expect(result.status).toBe("Closed");
	});
});
