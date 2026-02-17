import "dotenv/config";
import cors from "cors";
import express from "express";
import { ApiJobRoleController } from "./controllers/apiJobRoleController";
import { LoginController } from "./controllers/loginController";
import { JobRoleDao } from "./dao/jobRoleDao";
import { UserDao } from "./dao/userDao";
import { prisma } from "./db";
import { authMiddleware, requireRoles } from "./middleware/authMiddleware";
import { JobRoleService } from "./services/jobRoleService";
import { JwtService } from "./services/jwtService";
import { PasswordService } from "./services/passwordService";

export function createApp(jobRoleController?: ApiJobRoleController) {
	const app = express();

	// Enable CORS for frontend (allow requests from port 3000)
	app.use(
		cors({
			origin: "http://localhost:3000",
			credentials: true,
		}),
	);

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

	const loginController = new LoginController(
		userDao,
		passwordService,
		jwtService,
	);

	app.use(express.json());

	// Public routes (no authentication required)
	app.post("/api/login", loginController.login);
	app.post("/api/register", loginController.register);

	//logout currently deactivated until frontend linkup
	// app.post("/api/logout", loginController.logout);

	// Public Job Roles endpoints (no authentication required)
	app.get("/api/job-roles", controller.getJobRoles);
	app.get("/api/job-roles/:id", controller.getJobRoleById);

	// Protected routes (authentication required)
	app.use("/api", authMiddleware);

	// Create job role - ADMIN only
	app.post("/api/job-roles", requireRoles(["ADMIN"]), controller.createJobRole);

	// Update job role - ADMIN only
	app.put(
		"/api/job-roles/:id",
		requireRoles(["ADMIN"]),
		controller.updateJobRole,
	);

	// Delete job role - ADMIN only
	app.delete(
		"/api/job-roles/:id",
		requireRoles(["ADMIN"]),
		controller.deleteJobRole,
	);

	return app;
}

const app = createApp();

if (process.env.NODE_ENV !== "test") {
	app.listen(process.env.API_PORT, () => {
		console.log(`Server listening on port ${process.env.API_PORT}`);
	});
}

export { app };
