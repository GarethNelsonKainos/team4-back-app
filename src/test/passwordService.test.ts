import { beforeEach, describe, expect, it } from "vitest";
import { PasswordService } from "../services/passwordService.js";

describe("passwordService", () => {
	let passwordService: PasswordService;

	beforeEach(() => {
		passwordService = new PasswordService();
	});

	describe("PasswordService", () => {
		describe("hashPassword", () => {
			it("should hash a password successfully", async () => {
				const plainPassword = "mySecurePassword123";
				const hashed = await passwordService.hashPassword(plainPassword);

				expect(hashed).toBeDefined();
				expect(typeof hashed).toBe("string");
				expect(hashed.length).toBeGreaterThan(0);
			});

			it("should create different hashes for the same password", async () => {
				const plainPassword = "mySecurePassword123";
				const hash1 = await passwordService.hashPassword(plainPassword);
				const hash2 = await passwordService.hashPassword(plainPassword);

				// Bcrypt uses random salt, so hashes should be different
				expect(hash1).not.toBe(hash2);
			});

			it("should throw an error if password is empty", async () => {
				try {
					await passwordService.hashPassword("");
					expect.fail("Should have thrown an error");
				} catch (error: unknown) {
					expect((error as Error).message).toContain(
						"Password must be a non-empty string",
					);
				}
			});

			it("should throw an error if password is not a string", async () => {
				try {
					await passwordService.hashPassword(null as unknown as string);
					expect.fail("Should have thrown an error");
				} catch (error: unknown) {
					expect((error as Error).message).toContain(
						"Password must be a non-empty string",
					);
				}
			});
		});

		describe("verifyPassword", () => {
			it("should return true for matching password", async () => {
				const plainPassword = "mySecurePassword123";
				const hashedPassword =
					await passwordService.hashPassword(plainPassword);

				const isMatch = await passwordService.verifyPassword(
					plainPassword,
					hashedPassword,
				);
				expect(isMatch).toBe(true);
			});

			it("should return false for non-matching password", async () => {
				const plainPassword = "mySecurePassword123";
				const hashedPassword =
					await passwordService.hashPassword(plainPassword);

				const isMatch = await passwordService.verifyPassword(
					"wrongPassword",
					hashedPassword,
				);
				expect(isMatch).toBe(false);
			});

			it("should throw an error if password is empty", async () => {
				try {
					await passwordService.verifyPassword("", "$2b$10$hashedpassword");
					expect.fail("Should have thrown an error");
				} catch (error: unknown) {
					expect(error).toBeDefined();
				}
			});

			it("should throw an error if hashed password is empty", async () => {
				try {
					await passwordService.verifyPassword("password", "");
					expect.fail("Should have thrown an error");
				} catch (error: unknown) {
					expect(error).toBeDefined();
				}
			});
		});
	});
});
