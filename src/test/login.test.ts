import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { LoginController } from "../controllers/loginController.js";
import { UserDao } from "../dao/userDao.js";
import * as passwordServiceModule from "../services/passwordService.js";
import * as jwtServiceModule from "../services/jwtService.js";

describe("LoginController", () => {
  let loginController: LoginController;
  let mockUser: any;

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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create controller
    loginController = new LoginController();

    // Mock UserDao methods
    vi.spyOn(UserDao.prototype, "getUserForLogin").mockResolvedValue(mockUser);
    vi.spyOn(UserDao.prototype, "getUserByEmail").mockResolvedValue(null);
    vi.spyOn(UserDao.prototype, "createUser").mockResolvedValue(mockUser);
  });

  describe("login", () => {
    it("should return 400 if email is missing", async () => {
      const req: any = { body: { password: "password123" } };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await loginController.login(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Email and password are required" });
    });

    it("should return 401 if user is not found", async () => {
      vi.spyOn(UserDao.prototype, "getUserForLogin").mockResolvedValueOnce(null);

      const req: any = { body: { email: "notfound@example.com", password: "password123" } };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await loginController.login(req, res);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid email or password" });
    });

    it("should return 401 if password is invalid", async () => {
      vi.spyOn(passwordServiceModule.passwordService, "verifyPassword").mockResolvedValueOnce(false);

      const req: any = { body: { email: "test@example.com", password: "wrongpassword" } };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await loginController.login(req, res);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid email or password" });
    });

    it("should return 200 with token on successful login", async () => {
      vi.spyOn(UserDao.prototype, "getUserForLogin").mockResolvedValueOnce(mockUser);
      vi.spyOn(passwordServiceModule.passwordService, "verifyPassword").mockResolvedValueOnce(true);
      vi.spyOn(jwtServiceModule.jwtService, "generateToken").mockReturnValueOnce("fake.jwt.token");

      const req: any = { body: { email: "test@example.com", password: "password123" } };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await loginController.login(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: "fake.jwt.token" });
    });
  });

  describe("register", () => {
    it("should return 400 if password is too short", async () => {
      const req: any = { body: { email: "test@example.com", password: "short" } };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await loginController.register(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Password must be at least 6 characters long" });
    });

    it("should return 409 if email already exists", async () => {
      vi.spyOn(UserDao.prototype, "getUserByEmail").mockResolvedValueOnce(mockUser);

      const req: any = { body: { email: "test@example.com", password: "password123" } };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await loginController.register(req, res);
      
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: "Email is already registered" });
    });

    it("should return 201 on successful registration", async () => {
      vi.spyOn(UserDao.prototype, "getUserByEmail").mockResolvedValueOnce(null);
      vi.spyOn(passwordServiceModule.passwordService, "hashPassword").mockResolvedValueOnce("hashed.password");
      vi.spyOn(UserDao.prototype, "createUser").mockResolvedValueOnce(mockUser);

      const req: any = { body: { email: "newuser@example.com", password: "password123" } };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await loginController.register(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should return 200 on logout", async () => {
      const req: any = {};
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await loginController.logout(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Logged out successfully" });
    });
  });
});