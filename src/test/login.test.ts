import type { Request, Response } from "express";
import type { Mocked } from "vitest";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { LoginController } from "../controllers/loginController.js";
import type { UserDao } from "../dao/userDao.js";
import type { User } from "../generated/client";
import type { JwtService } from "../services/jwtService.js";
import type { PasswordService } from "../services/passwordService.js";

describe("LoginController", () => {
  let loginController: LoginController;
  let mockUser: User;
  let mockUserDao: Mocked<UserDao>;
  let mockPasswordService: Mocked<PasswordService>;
  let mockJwtService: Mocked<JwtService>;

  beforeAll(() => {
    // Ensure JWT_SECRET is set for tests
    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = "test-secret-key-for-testing-purposes-only";
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock user data
    mockUser = {
      userId: 1,
      userEmail: "test@example.com",
      userPassword: "$2b$10$hashedpasswordhere",
      userRole: "ADMIN",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUserDao = {
      getUserForLogin: vi.fn().mockResolvedValue(mockUser),
      getUserByEmail: vi.fn().mockResolvedValue(null),
      createUser: vi.fn().mockResolvedValue(mockUser),
      updateUserPassword: vi.fn(),
    } as unknown as Mocked<UserDao>;

    mockPasswordService = {
      verifyPassword: vi.fn().mockResolvedValue(true),
      hashPassword: vi.fn().mockResolvedValue("hashed.password"),
    } as unknown as Mocked<PasswordService>;

    mockJwtService = {
      generateToken: vi.fn().mockReturnValue("fake.jwt.token"),
      verifyToken: vi.fn(),
    } as unknown as Mocked<JwtService>;

    // Create controller with injected deps
    loginController = new LoginController(
      mockUserDao,
      mockPasswordService,
      mockJwtService,
    );
  });

  describe("login", () => {
    it("should return 400 if email is missing", async () => {
      const req = { body: { password: "password123" } } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      await loginController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email and password are required",
      });
    });

    it("should return 401 if user is not found", async () => {
      mockUserDao.getUserForLogin.mockResolvedValueOnce(null);

      const req = {
        body: { email: "notfound@example.com", password: "password123" },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await loginController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid email or password",
      });
    });

    it("should return 401 if password is invalid", async () => {
      mockPasswordService.verifyPassword.mockResolvedValueOnce(false);

      const req = {
        body: { email: "test@example.com", password: "wrongpassword" },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await loginController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid email or password",
      });
    });

    it("should return 200 with token on successful login", async () => {
      mockUserDao.getUserForLogin.mockResolvedValueOnce(mockUser);
      mockPasswordService.verifyPassword.mockResolvedValueOnce(true);
      mockJwtService.generateToken.mockReturnValueOnce("fake.jwt.token");

      const req = {
        body: { email: "test@example.com", password: "password123" },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await loginController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: "fake.jwt.token" });
    });
  });

  describe("register", () => {
    it("should return 400 if password is too short", async () => {
      const req = {
        body: { email: "test@example.com", password: "short" },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      await loginController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Password must be at least 6 characters long",
      });
    });

    it("should return 409 if email already exists", async () => {
      mockUserDao.getUserByEmail.mockResolvedValueOnce(mockUser);

      const req = {
        body: { email: "test@example.com", password: "password123" },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await loginController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email is already registered",
      });
    });

    it("should return 201 on successful registration", async () => {
      mockUserDao.getUserByEmail.mockResolvedValueOnce(null);
      mockPasswordService.hashPassword.mockResolvedValueOnce("hashed.password");
      mockUserDao.createUser.mockResolvedValueOnce(mockUser);

      const req = {
        body: { email: "newuser@example.com", password: "password123" },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await loginController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });
  });

  //logout function currently inactive

  //   describe("logout", () => {
  //     it("should return 200 on logout", async () => {
  //       const req: any = {};
  //       const res: any = {
  //         status: vi.fn().mockReturnThis(),
  //         json: vi.fn(),
  //       };

  //       await loginController.logout(req, res);

  //       expect(res.status).toHaveBeenCalledWith(200);
  //       expect(res.json).toHaveBeenCalledWith({ message: "Logged out successfully" });
  //     });
  //   });
});
