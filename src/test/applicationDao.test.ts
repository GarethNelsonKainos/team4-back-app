import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApplicationDao } from "../dao/applicationDao";
import type { PrismaClient } from "../generated/client";

describe("ApplicationDao", () => {
	let prisma: PrismaClient;
	let applicationDao: ApplicationDao;

	beforeEach(() => {
		prisma = {
			application: {
				create: vi.fn(),
				findFirst: vi.fn(),
			},
		} as unknown as PrismaClient;

		applicationDao = new ApplicationDao(prisma);
	});

	it("should create an application with includes", async () => {
		const created = { applicationId: 1 };
		vi.mocked(prisma.application.create).mockResolvedValue(
			created as Awaited<ReturnType<typeof prisma.application.create>>,
		);

		const result = await applicationDao.createApplication({
			userId: 1,
			jobRoleId: 2,
			cvUrl: "https://example.com/cv.pdf",
		});

		expect(result).toBe(created);
		expect(prisma.application.create).toHaveBeenCalledWith({
			data: {
				userId: 1,
				jobRoleId: 2,
				cvUrl: "https://example.com/cv.pdf",
				applicationStatus: "SUBMITTED",
			},
			include: {
				user: true,
				jobRole: {
					include: {
						band: true,
						capability: true,
						status: true,
					},
				},
			},
		});
	});

	it("should check existing application", async () => {
		vi.mocked(prisma.application.findFirst).mockResolvedValue(
			null as Awaited<ReturnType<typeof prisma.application.findFirst>>,
		);

		const result = await applicationDao.checkExistingApplication(1, 2);

		expect(result).toBeNull();
		expect(prisma.application.findFirst).toHaveBeenCalledWith({
			where: {
				userId: 1,
				jobRoleId: 2,
			},
		});
	});
});
