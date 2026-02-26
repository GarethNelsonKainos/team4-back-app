import type { NextFunction, Request, Response } from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../index.js";
import * as dbModule from "../db.js";
import UserRole from "../models/userRole";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

// Mock Prisma database layer
vi.mock("../db.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock PasswordService
vi.mock("../services/passwordService.js", () => {
  return {
    PasswordService: class {
      hashPassword = vi.fn().mockResolvedValue("$2b$10$hashedpassword");
      verifyPassword = vi.fn().mockResolvedValue(true);
    },
  };
});

vi.mock("../middleware/authMiddleware.js", () => ({
  authMiddleware: (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ) => {
    req.user = { role: "ADMIN" };
    next();
  },
  requireRoles: () => (_req: Request, _res: Response, next: NextFunction) => {
    next();
  },
}));

describe("Registration Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/register", () => {
    it("should successfully register a new user", async () => {
      const newUser = {
        userId: 1,
        userEmail: "newuser@example.com",
        userPassword: "$2b$10$hashedpassword",
        userRole: UserRole.APPLICANT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock findUnique to return null (user doesn't exist)
      vi.mocked(dbModule.prisma.user.findUnique).mockResolvedValue(null);
      // Mock create to return the new user
      vi.mocked(dbModule.prisma.user.create).mockResolvedValue(newUser);

      const app = createApp(undefined);

      const response = await request(app)
        .post("/api/register")
        .send({ email: "newuser@example.com", password: "password123" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("User registered successfully");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.userEmail).toBe("newuser@example.com");
    });

    it("should return 409 if email is already registered", async () => {
      const existingUser = {
        userId: 1,
        userEmail: "existing@example.com",
        userPassword: "$2b$10$hashedpassword",
        userRole: UserRole.APPLICANT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(dbModule.prisma.user.findUnique).mockResolvedValue(
        existingUser,
      );

      const app = createApp(undefined);

      const response = await request(app)
        .post("/api/register")
        .send({ email: "existing@example.com", password: "password123" });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("Email is already registered");
    });

    it("should return 400 if email is missing", async () => {
      const app = createApp(undefined);

      const response = await request(app)
        .post("/api/register")
        .send({ password: "password123" });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain(
        "Email and password are required",
      );
    });

    it("should return 400 if password is missing", async () => {
      const app = createApp(undefined);

      const response = await request(app)
        .post("/api/register")
        .send({ email: "newuser@example.com" });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain(
        "Email and password are required",
      );
    });

    it("should return 400 if password is less than 6 characters", async () => {
      const app = createApp(undefined);

      const response = await request(app)
        .post("/api/register")
        .send({ email: "newuser@example.com", password: "short" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Password must be at least 6 characters long",
      );
    });

    it("should return 500 if database query fails", async () => {
      vi.mocked(dbModule.prisma.user.findUnique).mockRejectedValue(
        new Error("Database error"),
      );

      const app = createApp(undefined);

      const response = await request(app)
        .post("/api/register")
        .send({ email: "newuser@example.com", password: "password123" });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Internal server error");
    });

    it("should hash the password before storing", async () => {
      const newUser = {
        userId: 1,
        userEmail: "newuser@example.com",
        userPassword: "$2b$10$hashedpassword",
        userRole: UserRole.APPLICANT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(dbModule.prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(dbModule.prisma.user.create).mockResolvedValue(newUser);

      const app = createApp(undefined);

      const response = await request(app)
        .post("/api/register")
        .send({ email: "newuser@example.com", password: "password123" });

      expect(response.status).toBe(201);
      // Verify the create was called (password should have been hashed)
      expect(vi.mocked(dbModule.prisma.user.create)).toHaveBeenCalled();
    });
  });
});
