import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { poolConstructorMock, prismaPgMock, prismaClientMock, disconnectMock } =
	vi.hoisted(() => ({
		poolConstructorMock: vi.fn(),
		prismaPgMock: vi.fn(),
		prismaClientMock: vi.fn(),
		disconnectMock: vi.fn(),
	}));

vi.mock("pg", () => ({
	default: {
		Pool: class PoolMock {
			constructor(options: unknown) {
				poolConstructorMock(options);
			}
		},
	},
}));

vi.mock("@prisma/adapter-pg", () => ({
	PrismaPg: class PrismaPgMock {
		constructor(pool: unknown) {
			prismaPgMock(pool);
		}
	},
}));

vi.mock("../generated/client", () => ({
	PrismaClient: class PrismaClientMock {
		$disconnect = disconnectMock;

		constructor(options: unknown) {
			prismaClientMock(options);
		}
	},
}));

describe("db", () => {
	const originalEnv = { ...process.env };

	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
		process.env = { ...originalEnv, DATABASE_URL: "postgres://example" };

		const poolInstance = { id: "pool" };
		poolConstructorMock.mockImplementation(() => poolInstance);
		prismaPgMock.mockImplementation(() => undefined);
		prismaClientMock.mockImplementation(() => undefined);
	});

	afterEach(() => {
		process.env = { ...originalEnv };
		process.removeAllListeners("beforeExit");
	});

	it("should initialize prisma with pg adapter", async () => {
		await import("../db");

		expect(poolConstructorMock).toHaveBeenCalledWith({
			connectionString: "postgres://example",
		});
		expect(prismaPgMock).toHaveBeenCalled();
		expect(prismaClientMock).toHaveBeenCalledWith({
			adapter: expect.any(Object),
		});
	});

	it("should disconnect prisma on beforeExit", async () => {
		await import("../db");

		process.emit("beforeExit");
		await new Promise((resolve) => setImmediate(resolve));

		expect(disconnectMock).toHaveBeenCalled();
	});
});
