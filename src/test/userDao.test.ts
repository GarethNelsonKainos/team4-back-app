import type { User } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserDao } from "../dao/userDao.js";
import * as dbModule from "../db.js";

// Mock Prisma with proper structure
vi.mock("../db.js", () => ({
	prisma: {
		user: {
			findUnique: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
		},
	},
}));

describe("UserDao", () => {
	let userDao: UserDao;
	let mockUser: User;
	let prisma: typeof dbModule.prisma;

	beforeEach(() => {
		vi.clearAllMocks();
		prisma = dbModule.prisma;

		// Setup mock user data
		mockUser = {
			userId: 1,
			userEmail: "test@example.com",
			userPassword: "$2b$10$hashedpassword",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	});

	describe("getUserByEmail", () => {
		it("should return user when email exists", async () => {
			userDao = new UserDao();
			vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser);

			const result = await userDao.getUserByEmail("test@example.com");

			expect(result).toEqual(mockUser);
			expect(prisma.user.findUnique).toHaveBeenCalledWith({
				where: { userEmail: "test@example.com" },
			});
		});

		it("should return null when email does not exist", async () => {
			userDao = new UserDao();
			vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

			const result = await userDao.getUserByEmail("notfound@example.com");

			expect(result).toBeNull();
			expect(prisma.user.findUnique).toHaveBeenCalledWith({
				where: { userEmail: "notfound@example.com" },
			});
		});

		it("should throw error if database query fails", async () => {
			userDao = new UserDao();
			vi.mocked(prisma.user.findUnique).mockRejectedValueOnce(
				new Error("Database error"),
			);

			await expect(userDao.getUserByEmail("test@example.com")).rejects.toThrow(
				"Database error",
			);
		});
	});

	describe("getUserForLogin", () => {
		it("should return user with password hash for login", async () => {
			userDao = new UserDao();
			vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser);

			const result = await userDao.getUserForLogin("test@example.com");

			expect(result).toEqual(mockUser);
			expect(prisma.user.findUnique).toHaveBeenCalledWith({
				where: { userEmail: "test@example.com" },
			});
		});

		it("should return null if user not found", async () => {
			userDao = new UserDao();
			vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

			const result = await userDao.getUserForLogin("notfound@example.com");

			expect(result).toBeNull();
		});

		it("should throw error if database query fails", async () => {
			userDao = new UserDao();
			vi.mocked(prisma.user.findUnique).mockRejectedValueOnce(
				new Error("Database error"),
			);

			await expect(userDao.getUserForLogin("test@example.com")).rejects.toThrow(
				"Database error",
			);
		});
	});

	describe("createUser", () => {
		it("should create and return a new user", async () => {
			userDao = new UserDao();
			vi.mocked(prisma.user.create).mockResolvedValueOnce(mockUser);

			const result = await userDao.createUser(
				"test@example.com",
				"hashedpassword123",
			);

			expect(result).toEqual(mockUser);
			expect(prisma.user.create).toHaveBeenCalledWith({
				data: {
					userEmail: "test@example.com",
					userPassword: "hashedpassword123",
				},
			});
		});

		it("should throw error if user creation fails", async () => {
			userDao = new UserDao();
			vi.mocked(prisma.user.create).mockRejectedValueOnce(
				new Error("Email already exists"),
			);

			await expect(
				userDao.createUser("test@example.com", "hashedpassword"),
			).rejects.toThrow("Email already exists");
		});
	});

	describe("updateUserPassword", () => {
		it("should update and return the user with new password", async () => {
			userDao = new UserDao();
			const updatedUser = {
				...mockUser,
				userPassword: "newhashedpassword",
				updatedAt: new Date(),
			};
			vi.mocked(prisma.user.update).mockResolvedValueOnce(updatedUser);

			const result = await userDao.updateUserPassword(1, "newhashedpassword");

			expect(result).toEqual(updatedUser);
			expect(prisma.user.update).toHaveBeenCalled();
		});

		it("should throw error if user not found", async () => {
			userDao = new UserDao();
			vi.mocked(prisma.user.update).mockRejectedValueOnce(
				new Error("User not found"),
			);

			await expect(
				userDao.updateUserPassword(999, "newhashedpassword"),
			).rejects.toThrow("User not found");
		});
	});
});
