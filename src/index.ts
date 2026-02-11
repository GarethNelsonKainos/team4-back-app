import "dotenv/config";
import express from "express";
import { Request, Response, NextFunction } from "express";
import { ApiJobRoleController } from "./controllers/apiJobRoleController";
import { JobRoleService } from "./services/jobRoleService";
import { JobRoleDao } from "./dao/jobRoleDao";
import { prisma } from "./db";

export function createApp(jobRoleController?: ApiJobRoleController) {
  const app = express();

  // Dependency injection setup - use provided controller or create default one
  const controller = jobRoleController || (() => {
    const jobRoleDao = new JobRoleDao(prisma);
    const jobRoleService = new JobRoleService(jobRoleDao);
    return new ApiJobRoleController(jobRoleService);
  })();

  app.use(express.json());

  app.get("/api/job-roles", controller.getJobRoles);

  return app;
}

const app = createApp();

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
}

export { app };
