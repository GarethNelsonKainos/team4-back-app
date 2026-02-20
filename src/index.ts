import "dotenv/config";

import cors from "cors";
import express from "express";
import multer from "multer";

import { ApiJobRoleController } from "./controllers/apiJobRoleController";
import { ApplicationController } from "./controllers/applicationController";
import { LoginController } from "./controllers/loginController";
import { ApplicationDao } from "./dao/applicationDao";
import { JobRoleDao } from "./dao/jobRoleDao";
import { UserDao } from "./dao/userDao";
import { prisma } from "./db";
import { authMiddleware } from "./middleware/authMiddleware";
import { ApplicationService } from "./services/applicationService";
import { JobRoleService } from "./services/jobRoleService";
import { JwtService } from "./services/jwtService";
import { PasswordService } from "./services/passwordService";
import { S3Service } from "./services/s3Service";

interface AuthenticatedRequest extends express.Request {
	user?: { role: string };
}

function requireRoles(roles: string[]) {
	return (
		req: AuthenticatedRequest,
		res: express.Response,
		next: express.NextFunction,
	) => {
		const userRole = req.user?.role;
		if (!userRole || !roles.includes(userRole)) {
			return res.status(403).json({ error: "Forbidden" });
		}
		next();
	};
}

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
	const s3Service = new S3Service();
	const upload = multer({ storage: multer.memoryStorage() });

	// Job application setup
	const applicationDao = new ApplicationDao(prisma);
	const applicationService = new ApplicationService(
		applicationDao,
		new JobRoleDao(prisma),
	);
	const applicationController = new ApplicationController(
		applicationService,
		s3Service,
	);

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

	app.post(
		"/api/apply",
		authMiddleware,
		upload.single("cv"),
		applicationController.applyForJob,
	);

	// TODO: Uncomment these routes when needed for full application management
	/*
	app.get(
		"/api/applications/my-applications",
		authMiddleware,
		applicationController.getMyApplications,
	);
	app.get(
		"/api/applications/:applicationId",
		authMiddleware,
		applicationController.getApplicationById,
	);
	app.get(
		"/api/applications/can-apply/:jobRoleId",
		authMiddleware,
		applicationController.checkCanApply,
	);

	// Admin routes for job applications (authentication required)
	app.get(
		"/api/admin/job-roles/:jobRoleId/applications",
		authMiddleware,
		applicationController.getApplicationsForJobRole,
	);
	app.patch(
		"/api/admin/applications/:applicationId/status",
		authMiddleware,
		applicationController.updateApplicationStatus,
	);
	*/

	return app;
}

const app = createApp();

if (process.env.NODE_ENV !== "test") {
	app.listen(process.env.API_PORT, () => {
		console.log(`Server listening on port ${process.env.API_PORT}`);
	});
}

export { app };
