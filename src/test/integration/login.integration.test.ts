import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../../index";
import { prisma } from "../../db";

describe("Login Integration Tests", () => {
	const app = createApp();
	const testEmail = `test-login-${Date.now()}@example.com`;
	const testPassword = "testPassword123";

	beforeEach(async () => {
		// Clean up test user before each test
		await prisma.user.deleteMany({
			where: { userEmail: testEmail },
		});
	});

	describe("POST /api/login - Happy Path", () => {
		it("should successfully login and return a valid token", async () => {
			// 1. Register a user
			await request(app)
				.post("/api/register")
				.send({
					email: testEmail,
					password: testPassword,
				});

			// 2. Login with credentials
			const response = await request(app)
				.post("/api/login")
				.send({
					email: testEmail,
					password: testPassword,
				});

			// 3. Verify response
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("token");
			expect(typeof response.body.token).toBe("string");
		});
	});

	describe("POST /api/login - Token Validation", () => {
		it("should return a token with correct JWT format (3 parts separated by dots)", async () => {
			// Register user
			await request(app)
				.post("/api/register")
				.send({
					email: testEmail,
					password: testPassword,
				});

			// Login
			const response = await request(app)
				.post("/api/login")
				.send({
					email: testEmail,
					password: testPassword,
				});

			const token = response.body.token;

			// Verify JWT format: header.payload.signature
			const parts = token.split(".");
			expect(parts.length).toBe(3);
			expect(parts[0]).toBeTruthy(); // Header
			expect(parts[1]).toBeTruthy(); // Payload
			expect(parts[2]).toBeTruthy(); // Signature
		});

		it("should allow using token in protected endpoint (Authorization header)", async () => {
			// Register user
			await request(app)
				.post("/api/register")
				.send({
					email: testEmail,
					password: testPassword,
				});

			// Login
			const loginResponse = await request(app)
				.post("/api/login")
				.send({
					email: testEmail,
					password: testPassword,
				});

			const token = loginResponse.body.token;

			// Use token in protected endpoint
			const protectedResponse = await request(app)
				.get("/api/job-roles")
				.set("Authorization", `Bearer ${token}`);

			// Should not return 401 Unauthorized
			expect(protectedResponse.status).not.toBe(401);
		});

		it("should reject invalid token format in Authorization header", async () => {
			const response = await request(app)
				.get("/api/job-roles")
				.set("Authorization", "Bearer invalid.token.here");

			expect(response.status).toBe(401);
			expect(response.body.message).toContain("Invalid or expired token");
		});
	});

	describe("POST /api/login - Error Cases", () => {
		it("should return 400 if email is missing", async () => {
			const response = await request(app)
				.post("/api/login")
				.send({
					password: testPassword,
				});

			expect(response.status).toBe(400);
			expect(response.body.message).toContain("Email and password are required");
		});

		it("should return 400 if password is missing", async () => {
			const response = await request(app)
				.post("/api/login")
				.send({
					email: testEmail,
				});

			expect(response.status).toBe(400);
			expect(response.body.message).toContain("Email and password are required");
		});

		it("should return 401 if email does not exist", async () => {
			const response = await request(app)
				.post("/api/login")
				.send({
					email: `nonexistent-${Date.now()}@example.com`,
					password: testPassword,
				});

			expect(response.status).toBe(401);
			expect(response.body.message).toContain("Invalid email or password");
		});

		it("should return 401 if password is incorrect", async () => {
			// Register user
			await request(app)
				.post("/api/register")
				.send({
					email: testEmail,
					password: testPassword,
				});

			// Login with wrong password
			const response = await request(app)
				.post("/api/login")
				.send({
					email: testEmail,
					password: "wrongPassword123",
				});

			expect(response.status).toBe(401);
			expect(response.body.message).toContain("Invalid email or password");
		});

		it("should not reveal whether email exists or password is wrong", async () => {
			// Register a user
			await request(app)
				.post("/api/register")
				.send({
					email: testEmail,
					password: testPassword,
				});

			// Try login with non-existent email
			const nonExistentResponse = await request(app)
				.post("/api/login")
				.send({
					email: `different-${Date.now()}@example.com`,
					password: testPassword,
				});

			// Try login with wrong password
			const wrongPasswordResponse = await request(app)
				.post("/api/login")
				.send({
					email: testEmail,
					password: "wrongPassword123",
				});

			// Both should return same status and message (security best practice)
			expect(nonExistentResponse.status).toBe(401);
			expect(wrongPasswordResponse.status).toBe(401);
			expect(nonExistentResponse.body.message).toBe(
				wrongPasswordResponse.body.message,
			);
		});
	});

	describe("POST /api/login - Token Content Validation", () => {
		it("should include user information in token payload", async () => {
			// Register user
			const registerRes = await request(app)
				.post("/api/register")
				.send({
					email: testEmail,
					password: testPassword,
				});

			const userId = registerRes.body.user.userId;

			// Login
			const loginRes = await request(app)
				.post("/api/login")
				.send({
					email: testEmail,
					password: testPassword,
				});

			const token = loginRes.body.token;

			// Decode JWT payload (base64)
			const parts = token.split(".");
			const payloadBase64 = parts[1];
			const payload = JSON.parse(
				Buffer.from(payloadBase64, "base64").toString("utf-8"),
			);

			// Verify payload contains expected claims
			expect(payload.userId).toBe(userId);
			expect(payload.userEmail).toBe(testEmail);
			expect(payload.userRole).toBeDefined();
		});

		it("should have token expiration in payload", async () => {
			// Register user
			await request(app)
				.post("/api/register")
				.send({
					email: testEmail,
					password: testPassword,
				});

			// Login
			const loginRes = await request(app)
				.post("/api/login")
				.send({
					email: testEmail,
					password: testPassword,
				});

			const token = loginRes.body.token;
			const parts = token.split(".");
			const payloadBase64 = parts[1];
			const payload = JSON.parse(
				Buffer.from(payloadBase64, "base64").toString("utf-8"),
			);

			// JWT should have expiration time (exp claim)
			expect(payload.exp).toBeDefined();
			expect(typeof payload.exp).toBe("number");

			// exp should be in the future
			const expirationTime = payload.exp * 1000; // Convert to milliseconds
			expect(expirationTime).toBeGreaterThan(Date.now());
		});
	});
});
