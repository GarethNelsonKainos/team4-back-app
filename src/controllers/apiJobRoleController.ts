import type { Request, Response } from "express";
import type { JobRoleService } from "../services/jobRoleService";

export class ApiJobRoleController {
  private jobRoleService: JobRoleService;

  constructor(jobRoleService: JobRoleService) {
    this.jobRoleService = jobRoleService;
  }

  public getJobRoles = async (_req: Request, res: Response): Promise<void> => {
    try {
      const jobRoles = await this.jobRoleService.getJobRoles();
      res.status(200).json(jobRoles);
    } catch (error) {
      console.error("Error in getJobRoles:", error);
      res.status(500).json({ message: "Failed to get job roles" });
    }
  };

  public getJobRoleById = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const jobRole = await this.jobRoleService.getJobRoleById(Number(id));
      if (!jobRole) {
        res.status(404).json({ message: "Job role not found" });
        return;
      }
      res.status(200).json(jobRole);
    } catch (error) {
      console.error("Error in getJobRoleById:", error);
      res.status(500).json({ message: "Failed to get job role" });
    }
  };

  public createJobRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobRole = await this.jobRoleService.createJobRole(req.body);
      res.status(201).json(jobRole);
    } catch (error) {
      console.error("Error in createJobRole:", error);
      res.status(500).json({ message: "Failed to create job role" });
    }
  };

  public updateJobRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const jobRole = await this.jobRoleService.updateJobRole(
        Number(id),
        req.body,
      );
      res.status(200).json(jobRole);
    } catch (error) {
      console.error("Error in updateJobRole:", error);
      res.status(500).json({ message: "Failed to update job role" });
    }
  };

  public deleteJobRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.jobRoleService.deleteJobRole(Number(id));
      res.status(204).send();
    } catch (error) {
      console.error("Error in deleteJobRole:", error);
      res.status(500).json({ message: "Failed to delete job role" });
    }
  };
}
