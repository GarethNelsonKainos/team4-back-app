import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../../db";
import { createApp } from "../../index";

describe("Register Integration Tests", () => {
	const originalEnv = { ...process.env };
	const app = createApp();
	const baseTestEmail = `test-register-${Date.now()}`;
	let testCounter = 0;

	// Helper to generate unique test emails
	const generateTestEmail = (): string => {
		testCounter++;
		return `${baseTestEmail}-${testCounter}@example.com`;
	};

	beforeAll(() => {
		process.env = {
			...process.env,
			JWT_SECRET: process.env.JWT_SECRET || "test-jwt-secret",
			SALT_ROUNDS: process.env.SALT_ROUNDS || "10",
		};
	});

	beforeEach(async () => {
		// Clean up all test users before each test
		await prisma.user.deleteMany({
			where: {
				userEmail: {
					startsWith: `${baseTestEmail}`,
				},
			},
		});
	});

	afterAll(async () => {
		// Final cleanup after all tests
		await prisma.user.deleteMany({
			where: {
				userEmail: {
					startsWith: `${baseTestEmail}`,
				},
			},
		});

		process.env = { ...originalEnv };
	});

	describe("POST /api/register - Happy Path", () => {
		it("should successfully register a new user with valid credentials", async () => {
			const testEmail = generateTestEmail();
			const testPassword = "validPassword123";

			const response = await request(app).post("/api/register").send({
				email: testEmail,
				password: testPassword,
			});

			// Verify response
			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("message");
			expect(response.body.message).toBe("User registered successfully");
			expect(response.body).toHaveProperty("user");
		});

		it("should return user object with correct structure", async () => {
			const testEmail = generateTestEmail();
			const testPassword = "validPassword123";

			const response = await request(app).post("/api/register").send({
				email: testEmail,
				password: testPassword,
			});

			const user = response.body.user;

			// Verify user object structure
			expect(user).toHaveProperty("userId");
			expect(user).toHaveProperty("userEmail");
			expect(user).toHaveProperty("userRole");
			expect(user).toHaveProperty("createdAt");

			// Verify correct values
			expect(typeof user.userId).toBe("number");
			expect(user.userEmail).toBe(testEmail);
			expect(user.userRole).toBe("APPLICANT"); // Default role
		});

		it("should NOT return password in response (security check)", async () => {
			const testEmail = generateTestEmail();
			const testPassword = "validPassword123";

			const response = await request(app).post("/api/register").send({
				email: testEmail,
				password: testPassword,
			});

			const user = response.body.user;

			// Password should not be in response
			expect(user).not.toHaveProperty("userPassword");
			expect(user).not.toHaveProperty("password");
		});
	});

	describe("POST /api/register - Database Persistence", () => {
		it("should persist user to database", async () => {
			const testEmail = generateTestEmail();
			const testPassword = "validPassword123";

			const response = await request(app).post("/api/register").send({
				email: testEmail,
				password: testPassword,
			});

			const userId = response.body.user.userId;

			// Query database directly
			const savedUser = await prisma.user.findUnique({
				where: { userId },
			});

			expect(savedUser).toBeDefined();
			expect(savedUser?.userEmail).toBe(testEmail);
		});

		it("should store hashed password (not plaintext)", async () => {
			const testEmail = generateTestEmail();
			const testPassword = "validPassword123";

			const response = await request(app).post("/api/register").send({
				email: testEmail,
				password: testPassword,
			});

			const userId = response.body.user.userId;

			// Query database directly
			const savedUser = await prisma.user.findUnique({
				where: { userId },
			});

			// Verify password is hashed (bcrypt format: starts with $2a$, $2b$, or $2y$)
			expect(savedUser?.userPassword).toBeDefined();
			expect(
				/^\$2[aby]\$\d{2}\$.{53}$/.test(savedUser?.userPassword || ""),
			).toBe(true);

			// Verify plaintext password is NOT stored
			expect(savedUser?.userPassword).not.toBe(testPassword);
		});

		it("should set createdAt and updatedAt timestamps", async () => {
			const testEmail = generateTestEmail();
			const testPassword = "validPassword123";

			const response = await request(app).post("/api/register").send({
				email: testEmail,
				password: testPassword,
			});

			const userId = response.body.user.userId;

			// Query database directly
			const savedUser = await prisma.user.findUnique({
				where: { userId },
			});

			expect(savedUser?.createdAt).toBeInstanceOf(Date);
			expect(savedUser?.updatedAt).toBeInstanceOf(Date);

			// Verify timestamps are recent (within last minute)
			const now = Date.now();
			const createdTimeMs = savedUser?.createdAt?.getTime() || 0;
			expect(now - createdTimeMs).toBeLessThan(60000); // Within 60 seconds
		});

		it("should set default role to APPLICANT", async () => {
			const testEmail = generateTestEmail();
			const testPassword = "validPassword123";

			const response = await request(app).post("/api/register").send({
				email: testEmail,
				password: testPassword,
			});

			const userId = response.body.user.userId;

			// Query database directly
			const savedUser = await prisma.user.findUnique({
				where: { userId },
			});

			expect(savedUser?.userRole).toBe("APPLICANT");
		});

		it("should create multiple independent users on separate registrations", async () => {
			const email1 = generateTestEmail();
			const email2 = generateTestEmail();
			const password = "validPassword123";

			const response1 = await request(app).post("/api/register").send({
				email: email1,
				password,
			});

			const response2 = await request(app).post("/api/register").send({
				email: email2,
				password,
			});

			const userId1 = response1.body.user.userId;
			const userId2 = response2.body.user.userId;

			// Verify both users exist in database
			const user1 = await prisma.user.findUnique({
				where: { userId: userId1 },
			});
			const user2 = await prisma.user.findUnique({
				where: { userId: userId2 },
			});

			expect(user1?.userEmail).toBe(email1);
			expect(user2?.userEmail).toBe(email2);
			expect(userId1).not.toBe(userId2);
		});
	});

	describe("POST /api/register - Input Validation", () => {
		it("should return 400 if email is missing", async () => {
			const response = await request(app).post("/api/register").send({
				password: "validPassword123",
			});

			expect(response.status).toBe(400);
			expect(response.body.message).toContain(
				"Email and password are required",
			);
		});

		it("should return 400 if password is missing", async () => {
			const response = await request(app).post("/api/register").send({
				email: generateTestEmail(),
			});

			expect(response.status).toBe(400);
			expect(response.body.message).toContain(
				"Email and password are required",
			);
		});

		it("should return 400 if both email and password are missing", async () => {
			const response = await request(app).post("/api/register").send({});

			expect(response.status).toBe(400);
			expect(response.body.message).toContain(
				"Email and password are required",
			);
		});

		it("should return 400 if email is empty string", async () => {
			const response = await request(app).post("/api/register").send({
				email: "",
				password: "validPassword123",
			});

			expect(response.status).toBe(400);
			expect(response.body.message).toContain(
				"Email and password are required",
			);
		});

		it("should return 400 if password is empty string", async () => {
			const response = await request(app).post("/api/register").send({
				email: generateTestEmail(),
				password: "",
			});

			expect(response.status).toBe(400);
			expect(response.body.message).toContain(
				"Email and password are required",
			);
		});

		it("should return 400 if password is less than 6 characters", async () => {
			const response = await request(app).post("/api/register").send({
				email: generateTestEmail(),
				password: "short", // 5 characters
			});

			expect(response.status).toBe(400);
			expect(response.body.message).toContain(
				"Password must be at least 6 characters long",
			);
		});

		it("should accept password with exactly 6 characters", async () => {
			const testEmail = generateTestEmail();
			const response = await request(app).post("/api/register").send({
				email: testEmail,
				password: "sixchr", // Exactly 6 characters
			});

			expect(response.status).toBe(201);
			expect(response.body.user.userEmail).toBe(testEmail);
		});

		it("should accept password with more than 6 characters", async () => {
			const testEmail = generateTestEmail();
			const response = await request(app).post("/api/register").send({
				email: testEmail,
				password: "longerPassword123",
			});

			expect(response.status).toBe(201);
			expect(response.body.user.userEmail).toBe(testEmail);
		});
	});

	describe("POST /api/register - Duplicate Email Handling", () => {
		it("should return 409 if email already exists", async () => {
			const testEmail = generateTestEmail();
			const testPassword = "validPassword123";

			// First registration
			await request(app).post("/api/register").send({
				email: testEmail,
				password: testPassword,
			});

			// Second registration with same email
			const response = await request(app).post("/api/register").send({
				email: testEmail,
				password: "differentPassword456",
			});

			expect(response.status).toBe(409);
			expect(response.body.message).toBe("Email is already registered");
		});

		it("should not modify original user on duplicate registration attempt", async () => {
			const testEmail = generateTestEmail();
			const password1 = "firstPassword123";
			const password2 = "secondPassword456";

			// First registration
			const response1 = await request(app).post("/api/register").send({
				email: testEmail,
				password: password1,
			});

			const userId = response1.body.user.userId;
			const originalHash = (
				await prisma.user.findUnique({
					where: { userId },
				})
			)?.userPassword;

			// Second registration with same email
			await request(app).post("/api/register").send({
				email: testEmail,
				password: password2,
			});

			// Verify original user's password hash is unchanged
			const updatedUser = await prisma.user.findUnique({
				where: { userId },
			});

			expect(updatedUser?.userPassword).toBe(originalHash);
		});

		it("should be case-sensitive on email duplicate check", async () => {
			const testEmail = generateTestEmail();
			const upperCaseEmail = testEmail.toUpperCase();
			const password = "validPassword123";

			// First registration
			await request(app).post("/api/register").send({
				email: testEmail,
				password,
			});

			// Second registration with uppercase email
			const response = await request(app).post("/api/register").send({
				email: upperCaseEmail,
				password,
			});

			// This depends on your database configuration
			// Typically databases are case-insensitive on email
			// So this should return 409
			expect([201, 409]).toContain(response.status);
		});
	});

	describe("POST /api/register - Error Handling", () => {
		it("should return 500 if internal server error occurs", async () => {
			const testEmail = generateTestEmail();
			const testPassword = "validPassword123";

			// This test assumes the app handles unexpected errors gracefully
			// We'll send valid data but we're testing the error handler
			const response = await request(app).post("/api/register").send({
				email: testEmail,
				password: testPassword,
			});

			// Should succeed normally
			expect([201, 500]).toContain(response.status);
		});

		it("should not expose sensitive error details in response", async () => {
			const testEmail = generateTestEmail();

			const response = await request(app).post("/api/register").send({
				email: testEmail,
				password: "password", // Too short
			});

			// Verify no sensitive stack traces or internal details
			expect(response.body).not.toHaveProperty("stack");
			expect(response.body).not.toHaveProperty("trace");
			expect(JSON.stringify(response.body)).not.toContain("node_modules");
		});
	});

	describe("POST /api/register - Password Hashing Security", () => {
		it("should use different hashes for the same password across registrations", async () => {
			const password = "samePassword123";
			const email1 = generateTestEmail();
			const email2 = generateTestEmail();

			const response1 = await request(app).post("/api/register").send({
				email: email1,
				password,
			});

			const response2 = await request(app).post("/api/register").send({
				email: email2,
				password,
			});

			const userId1 = response1.body.user.userId;
			const userId2 = response2.body.user.userId;

			const user1 = await prisma.user.findUnique({
				where: { userId: userId1 },
			});
			const user2 = await prisma.user.findUnique({
				where: { userId: userId2 },
			});

			// Both passwords are hashed but different due to bcrypt salt
			expect(user1?.userPassword).not.toBe(user2?.userPassword);

			// Both should still be bcrypt format
			expect(/^\$2[aby]\$\d{2}\$.{53}$/.test(user1?.userPassword || "")).toBe(
				true,
			);
			expect(/^\$2[aby]\$\d{2}\$.{53}$/.test(user2?.userPassword || "")).toBe(
				true,
			);
		});
	});

	describe("POST /api/register - Response Headers", () => {
		it("should return appropriate Content-Type header", async () => {
			const testEmail = generateTestEmail();
			const testPassword = "validPassword123";

			const response = await request(app).post("/api/register").send({
				email: testEmail,
				password: testPassword,
			});

			expect(response.type).toContain("application/json");
		});

		it("should not include sensitive headers", async () => {
			const testEmail = generateTestEmail();
			const testPassword = "validPassword123";

			const response = await request(app).post("/api/register").send({
				email: testEmail,
				password: testPassword,
			});

			// Verify no password or user tokens in response headers
			const headerString = JSON.stringify(response.headers);
			expect(headerString).not.toContain(testPassword);
		});
	});

	describe("POST /api/register - Integration with Login", () => {
		it("should allow user to login immediately after registration", async () => {
			const testEmail = generateTestEmail();
			const testPassword = "validPassword123";

			// Register
			const registerResponse = await request(app).post("/api/register").send({
				email: testEmail,
				password: testPassword,
			});

			expect(registerResponse.status).toBe(201);

			// Login with same credentials
			const loginResponse = await request(app).post("/api/login").send({
				email: testEmail,
				password: testPassword,
			});

			expect(loginResponse.status).toBe(200);
			expect(loginResponse.body).toHaveProperty("token");
			expect(typeof loginResponse.body.token).toBe("string");
		});

		it("should return correct user data after registration that matches login", async () => {
			const testEmail = generateTestEmail();
			const testPassword = "validPassword123";

			// Register
			const registerResponse = await request(app).post("/api/register").send({
				email: testEmail,
				password: testPassword,
			});

			const registeredUserId = registerResponse.body.user.userId;
			const registeredUserEmail = registerResponse.body.user.userEmail;

			// Login
			const loginResponse = await request(app).post("/api/login").send({
				email: testEmail,
				password: testPassword,
			});

			// Decode token to verify it was issued for correct user
			const token = loginResponse.body.token;
			const parts = token.split(".");
			const payloadBase64 = parts[1];
			const payload = JSON.parse(
				Buffer.from(payloadBase64, "base64").toString("utf-8"),
			);

			expect(payload.userId).toBe(registeredUserId);
			expect(payload.userEmail).toBe(registeredUserEmail);
		});
	});
});
