import "dotenv/config";
import express from "express";
import { ApiJobRoleController } from "./controllers/apiJobRoleController";
import { JobRoleDao } from "./dao/jobRoleDao";
import { prisma } from "./db";
import { JobRoleService } from "./services/jobRoleService";

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
