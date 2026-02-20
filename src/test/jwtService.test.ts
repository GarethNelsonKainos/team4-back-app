import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import UserRole from "../models/userRole.js";
import { JwtService } from "../services/jwtService.js";

describe("JwtService", () => {
	let jwtService: JwtService;

	beforeAll(() => {
		// Ensure JWT_SECRET is set for tests
		if (!process.env.JWT_SECRET) {
			process.env.JWT_SECRET = "test-secret-key-for-testing-purposes-only";
		}
	});

	beforeEach(() => {
		jwtService = new JwtService();
	});

	describe("generateToken", () => {
		it("should generate a valid JWT token", () => {
			const userId = 123;
			const userEmail = "test@example.com";
			const token = jwtService.generateToken(
				userId,
				userEmail,
				UserRole.APPLICANT,
			);

			expect(token).toBeDefined();
			expect(typeof token).toBe("string");
			// JWT format: header.payload.signature
			expect(token.split(".").length).toBe(3);
		});

		it("should generate different tokens for different users", () => {
			const token1 = jwtService.generateToken(
				1,
				"user1@example.com",
				UserRole.APPLICANT,
			);
			const token2 = jwtService.generateToken(
				2,
				"user2@example.com",
				UserRole.ADMIN,
			);

			expect(token1).not.toBe(token2);
		});

		it("should throw an error if userId is invalid", () => {
			try {
				jwtService.generateToken(
					null as unknown as number,
					"test@example.com",
					"ADMIN",
				);
				expect.fail("Should have thrown an error");
			} catch (error: unknown) {
				expect((error as Error).message).toContain(
					"User ID must be a valid number",
				);
			}
		});

		it("should throw an error if userId is not a number", () => {
			try {
				jwtService.generateToken(
					"123" as unknown as number,
					"test@example.com",
					"ADMIN",
				);
				expect.fail("Should have thrown an error");
			} catch (error: unknown) {
				expect((error as Error).message).toContain(
					"User ID must be a valid number",
				);
			}
		});

		it("should throw an error if JWT_SECRET is not set", () => {
			// Temporarily remove JWT_SECRET
			const originalSecret = process.env.JWT_SECRET;
			delete process.env.JWT_SECRET;

			try {
				jwtService.generateToken(123, "test@example.com", UserRole.APPLICANT);
				expect.fail("Should have thrown an error");
			} catch (error: unknown) {
				expect((error as Error).message).toContain("JWT_SECRET is not defined");
			} finally {
				// Restore JWT_SECRET
				if (originalSecret) {
					process.env.JWT_SECRET = originalSecret;
				}
			}
		});
	});

	describe("verifyToken", () => {
		let validToken: string;

		beforeEach(() => {
			validToken = jwtService.generateToken(
				123,
				"test@example.com",
				UserRole.APPLICANT,
			);
		});

		it("should verify and decode a valid token", () => {
			const decoded = jwtService.verifyToken(validToken);

			expect(decoded).toBeDefined();
			expect(decoded.userId).toBe(123);
			expect(decoded.userEmail).toBe("test@example.com");
			expect(decoded.iat).toBeDefined(); // issued at time
			expect(decoded.exp).toBeDefined(); // expiration time
		});

		it("should throw an error for invalid token", () => {
			try {
				jwtService.verifyToken("invalid.token.here");
				expect.fail("Should have thrown an error");
			} catch (error: unknown) {
				expect(error).toBeDefined();
			}
		});

		it("should throw an error for malformed token", () => {
			try {
				jwtService.verifyToken("notarealtoken");
				expect.fail("Should have thrown an error");
			} catch (error: unknown) {
				expect(error).toBeDefined();
			}
		});

		it("should throw an error if token is empty", () => {
			try {
				jwtService.verifyToken("");
				expect.fail("Should have thrown an error");
			} catch (error: unknown) {
				expect((error as Error).message).toContain(
					"Token must be a non-empty string",
				);
			}
		});

		it("should throw an error if JWT_SECRET is not set", () => {
			const originalSecret = process.env.JWT_SECRET;
			delete process.env.JWT_SECRET;

			try {
				jwtService.verifyToken(validToken);
				expect.fail("Should have thrown an error");
			} catch (error: unknown) {
				expect((error as Error).message).toContain("JWT_SECRET is not defined");
			} finally {
				if (originalSecret) {
					process.env.JWT_SECRET = originalSecret;
				}
			}
		});

		it("should contain correct payload data", () => {
			const userId = 456;
			const userEmail = "user456@example.com";
			const token = jwtService.generateToken(
				userId,
				userEmail,
				UserRole.APPLICANT,
			);
			const decoded = jwtService.verifyToken(token);

			expect(decoded.userId).toBe(userId);
			expect(decoded.userEmail).toBe(userEmail);
			expect(decoded.userRole).toBe("APPLICANT");
		});
	});
});
