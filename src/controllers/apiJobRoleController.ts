import { Request, Response } from "express";
import { JobRoleService } from "../services/jobRoleService";

export class ApiJobRoleController {
  private jobRoleService: JobRoleService;

  constructor() {
    this.jobRoleService = new JobRoleService();
  }

  public getJobRoles = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobRoles = await this.jobRoleService.getJobRoles();
      res.json(jobRoles);
    } catch (error) {
      res.status(500).json({ message: "Failed to get job roles" });
    }
  };
}
