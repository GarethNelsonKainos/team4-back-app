import "dotenv/config";
import express from "express";
import { Request, Response, NextFunction } from "express";
import { ApiJobRoleController } from "./controllers/apiJobRoleController";

const app = express();

const apiJobRoleController = new ApiJobRoleController();

app.use(express.json());

app.get("/api/job-roles", apiJobRoleController.getJobRoles);

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
}

export { app };
