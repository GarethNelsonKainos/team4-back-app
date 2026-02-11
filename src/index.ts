import "dotenv/config";
import express from "express";
import { ApiJobRoleController } from "./controllers/apiJobRoleController";
import { JobRoleService } from "./services/jobRoleService";
import { JobRoleDao } from "./dao/jobRoleDao";
import { prisma } from "./db";
import { LoginController } from "./controllers/loginController";
import { UserDao } from "./dao/userDao";
import { PasswordService } from "./services/passwordService";
import { JwtService } from "./services/jwtService";
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

  const userDao = new UserDao();
  const passwordService = new PasswordService();
  const jwtService = new JwtService();

  const loginController = new LoginController(userDao, passwordService, jwtService);

  app.use(express.json());

  // Public routes (no authentication required)
  app.post("/api/login", loginController.login);
  app.post("/api/register", loginController.register);

  //logout currently deactivated until frontend linkup
  // app.post("/api/logout", loginController.logout);

  // Protected routes (authentication required)
  // app.post("/api/update-password", authMiddleware, loginController.updatePassword);
  app.get("/api/job-roles", authMiddleware, controller.getJobRoles);

  return app;
}

const app = createApp();

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.API_PORT, () => {
    console.log(`Server listening on port ${process.env.API_PORT}`);
  });
}

export { app };

