import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authMiddleware } from "../middleware/authMiddleware";
import UserRole from "../models/userRole";
import { JwtService } from "../services/jwtService";

type MockResponse = {
	status: ReturnType<typeof vi.fn>;
	json: ReturnType<typeof vi.fn>;
};

function createMockResponse(): MockResponse {
	const res: MockResponse = {
		status: vi.fn(),
		json: vi.fn(),
	};

	res.status.mockReturnValue(res);
	return res;
}

describe("authMiddleware", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("returns 401 when authorization header is missing", () => {
		const req = { headers: {} } as Request;
		const res = createMockResponse() as unknown as Response;
		const next = vi.fn() as NextFunction;

		authMiddleware(req, res, next);

		expect((res as unknown as MockResponse).status).toHaveBeenCalledWith(401);
		expect((res as unknown as MockResponse).json).toHaveBeenCalledWith({
			message: "Authorization header is missing",
		});
		expect(next).not.toHaveBeenCalled();
	});

	it("returns 401 for invalid bearer header format", () => {
		const req = {
			headers: { authorization: "Bad token" },
		} as unknown as Request;
		const res = createMockResponse() as unknown as Response;
		const next = vi.fn() as NextFunction;

		authMiddleware(req, res, next);

		expect((res as unknown as MockResponse).status).toHaveBeenCalledWith(401);
		expect((res as unknown as MockResponse).json).toHaveBeenCalledWith({
			message: "Invalid authorization header format. Use: Bearer <token>",
		});
		expect(next).not.toHaveBeenCalled();
	});

	it("calls next and attaches decoded user fields for valid token", () => {
		vi.spyOn(JwtService.prototype, "verifyToken").mockReturnValue({
			userId: 42,
			userEmail: "test@example.com",
			userRole: UserRole.ADMIN,
		});

		const req = {
			headers: { authorization: "Bearer valid-token" },
		} as unknown as Request;
		const res = createMockResponse() as unknown as Response;
		const next = vi.fn() as NextFunction;

		authMiddleware(req, res, next);

		expect(next).toHaveBeenCalledOnce();
		expect(req.userId).toBe(42);
		expect(req.userEmail).toBe("test@example.com");
		expect(req.userRole).toBe(UserRole.ADMIN);
	});

	it("returns 401 when token verification throws", () => {
		vi.spyOn(JwtService.prototype, "verifyToken").mockImplementation(() => {
			throw new Error("invalid token");
		});
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		const req = {
			headers: { authorization: "Bearer invalid-token" },
		} as unknown as Request;
		const res = createMockResponse() as unknown as Response;
		const next = vi.fn() as NextFunction;

		authMiddleware(req, res, next);

		expect(consoleSpy).toHaveBeenCalled();
		expect((res as unknown as MockResponse).status).toHaveBeenCalledWith(401);
		expect((res as unknown as MockResponse).json).toHaveBeenCalledWith({
			message: "Invalid or expired token",
		});
		expect(next).not.toHaveBeenCalled();
	});
});
