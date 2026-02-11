import "dotenv/config";
import express from "express";
import { Request, Response, NextFunction } from "express";
import { ApiJobRoleController } from "./controllers/apiJobRoleController";
import { LoginController } from "./controllers/loginController";
import { authMiddleware } from "./middleware/authMiddleware";

const app = express();

const apiJobRoleController = new ApiJobRoleController();
const loginController = new LoginController();

app.use(express.json());

// Public routes (no authentication required)
app.post("/api/login", loginController.login);
app.post("/api/register", loginController.register);
app.post("/api/logout", loginController.logout);

// Protected routes (authentication required)
app.post("/api/update-password", authMiddleware, loginController.updatePassword);
app.get("/api/job-roles", authMiddleware, apiJobRoleController.getJobRoles);

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
}

export { app };
