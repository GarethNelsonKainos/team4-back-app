import "dotenv/config";
import express from "express";
import { Request, Response, NextFunction } from "express";
import { ApiJobRoleController } from "./controllers/apiJobRoleController";

const app = express();
const port = 3000;

const apiJobRoleController = new ApiJobRoleController();

app.use(express.json());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello world!");
});

app.get("/api/job-roles", apiJobRoleController.getJobRoles);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
