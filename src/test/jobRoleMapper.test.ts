import { describe, expect, it } from "vitest";
import type { JobRoleWithRelations } from "../dao/jobRoleDao";
import { JobRoleMapper } from "../mappers/jobRoleMapper";
import type { JobRole } from "../models/jobRole";

const baseJobRole: JobRole = {
	jobRoleId: 1,
	roleName: "Software Engineer",
	location: "Manchester",
	capabilityId: 1,
	bandId: 1,
	closingDate: "2026-02-09",
	description: "A role for software engineers",
	responsibilities: "Develop software solutions",
	sharepointUrl: "https://sharepoint.example.com/job/1",
	statusId: 1,
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
	describe("fromPrisma", () => {
		it("should map Prisma job role to JobRole model", () => {
			const closingDate = new Date("2026-02-09");
			const prismaJobRole: JobRoleWithRelations = {
				jobRoleId: 1,
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

			const result = JobRoleMapper.fromPrisma(prismaJobRole);

			expect(result).toEqual({
				jobRoleId: 1,
				roleName: "Software Engineer",
				location: "Manchester",
				capabilityId: 1,
				bandId: 1,
				closingDate: "2026-02-09",
				description: "A role for software engineers",
				responsibilities: "Develop software solutions",
				sharepointUrl: "https://sharepoint.example.com/job/1",
				statusId: 1,
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
			});
		});

		it("should handle null values in related entities", () => {
			const prismaJobRole: JobRoleWithRelations = {
				jobRoleId: 2,
				roleName: "Test Role",
				jobLocation: "Test Location",
				capabilityId: 2,
				bandId: 2,
				closingDate: new Date("2026-02-09"),
				description: "Description for role",
				responsibilities: "Responsibilities for role",
				sharepointUrl: "https://sharepoint.example.com/job/2",
				statusId: 1,
				numberOfOpenPositions: 2,
				capability: {
					capabilityId: 2,
					capabilityName: null,
				},
				band: {
					bandId: 2,
					bandName: null,
				},
				status: {
					statusId: 1,
					statusName: "Open",
				},
			};

			const result = JobRoleMapper.fromPrisma(prismaJobRole);

			expect(result).toEqual({
				jobRoleId: 2,
				roleName: "Test Role",
				location: "Test Location",
				capabilityId: 2,
				bandId: 2,
				closingDate: "2026-02-09",
				description: "Description for role",
				responsibilities: "Responsibilities for role",
				sharepointUrl: "https://sharepoint.example.com/job/2",
				statusId: 1,
				numberOfOpenPositions: 2,
				capability: {
					capabilityId: 2,
					capabilityName: null,
				},
				band: {
					bandId: 2,
					bandName: null,
				},
				status: {
					statusId: 1,
					statusName: "Open",
				},
			});
		});
	});

	describe("toResponse", () => {
		it("should map a job role to response", () => {
			const result = JobRoleMapper.toResponse(baseJobRole);

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
			const jobRole = { ...baseJobRole, capability: undefined };

			const result = JobRoleMapper.toResponse(jobRole);

			expect(result.capability).toBe("Unknown");
		});

		it("should handle missing band and use Unknown", () => {
			const jobRole = { ...baseJobRole, band: undefined };

			const result = JobRoleMapper.toResponse(jobRole);

			expect(result.band).toBe("Unknown");
		});

		it("should handle null capability name", () => {
			const jobRole = {
				...baseJobRole,
				capability: { capabilityId: 1, capabilityName: null },
			};

			const result = JobRoleMapper.toResponse(jobRole);

			expect(result.capability).toBe("Unknown");
		});

		it("should handle missing status and use Unknown", () => {
			const jobRole = { ...baseJobRole, status: undefined };

			const result = JobRoleMapper.toResponse(jobRole);

			expect(result.status).toBe("Unknown");
		});
	});
});