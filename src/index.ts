import "dotenv/config";
import express from "express";
import { Request, Response, NextFunction } from "express";
import { ApiJobRoleController } from "./controllers/apiJobRoleController";
import { JobRoleService } from "./services/jobRoleService";
import { JobRoleDao } from "./dao/jobRoleDao";
import { prisma } from "./db";
import { LoginController } from "./controllers/loginController";
import { authMiddleware } from "./middleware/authMiddleware";

export function createApp(jobRoleController?: ApiJobRoleController) {
  const app = express();

  // Dependency injection setup
  const controller =
    jobRoleController ||
    (() => {
      const jobRoleDao = new JobRoleDao(prisma);
      const jobRoleService = new JobRoleService(jobRoleDao);
      return new ApiJobRoleController(jobRoleService);
    })();
const loginController = new LoginController();

  app.use(express.json());

// Public routes (no authentication required)
app.post("/api/login", loginController.login);
app.post("/api/register", loginController.register);
app.post("/api/logout", loginController.logout);

// Protected routes (authentication required)
app.post("/api/update-password", authMiddleware, loginController.updatePassword);
app.get("/api/job-roles", authMiddleware, controller.getJobRoles);

  return app;
}

const app = createApp();

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
}

export { app };

