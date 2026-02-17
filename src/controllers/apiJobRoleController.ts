import type { Request, Response } from "express";
import type { JobRoleService } from "../services/jobRoleService";

export class ApiJobRoleController {
  private jobRoleService: JobRoleService;

  constructor(jobRoleService: JobRoleService) {
    this.jobRoleService = jobRoleService;
  }

  private validateCreateJobRoleInput(body: unknown): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const data = body as Record<string, unknown>;

    if (
      !data.roleName ||
      typeof data.roleName !== "string" ||
      data.roleName.trim() === ""
    ) {
      errors.push("Role name is required and must be a non-empty string");
    }

    if (
      !data.jobLocation ||
      typeof data.jobLocation !== "string" ||
      data.jobLocation.trim() === ""
    ) {
      errors.push("Job Location is required and must be a non-empty string");
    }

    if (
      !Number.isInteger(data.capabilityId) ||
      (data.capabilityId as number) <= 0
    ) {
      errors.push("capabilityId is required and must be a positive integer");
    }

    if (!Number.isInteger(data.bandId) || (data.bandId as number) <= 0) {
      errors.push("Band ID is required and must be a positive integer");
    }

    if (!data.closingDate) {
      errors.push("Closing Date is required");
    } else {
      const date = new Date(data.closingDate as string);
      if (Number.isNaN(date.getTime())) {
        errors.push("closingDate must be a valid date");
      }
    }

    if (
      !data.description ||
      typeof data.description !== "string" ||
      data.description.trim() === ""
    ) {
      errors.push("Job Description is required and must be a non-empty string");
    }

    if (
      !data.responsibilities ||
      typeof data.responsibilities !== "string" ||
      data.responsibilities.trim() === ""
    ) {
      errors.push(
        "Responsibilities are required and must be a non-empty string",
      );
    }

    if (
      !data.sharepointUrl ||
      typeof data.sharepointUrl !== "string" ||
      data.sharepointUrl.trim() === ""
    ) {
      errors.push("SharePoint URL is required and must be a non-empty string");
    } else {
      try {
        new URL(data.sharepointUrl);
      } catch {
        errors.push("SharePoint URL must be a valid URL");
      }
    }

    if (!Number.isInteger(data.statusId) || (data.statusId as number) <= 0) {
      errors.push("Status ID is required and must be a positive integer");
    }

    if (
      !Number.isInteger(data.numberOfOpenPositions) ||
      (data.numberOfOpenPositions as number) <= 0
    ) {
      errors.push(
        "Number of Open Positions is required and must be a positive integer",
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private validateUpdateJobRoleInput(body: unknown): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const data = body as Record<string, unknown>;

    if (Object.keys(data).length === 0) {
      errors.push("At least one field must be provided for update");
      return { valid: false, errors };
    }

    if (
      data.roleName !== undefined &&
      (typeof data.roleName !== "string" || data.roleName.trim() === "")
    ) {
      errors.push("Role Name must be a non-empty string");
    }

    if (
      data.jobLocation !== undefined &&
      (typeof data.jobLocation !== "string" || data.jobLocation.trim() === "")
    ) {
      errors.push("Job Location must be a non-empty string");
    }

    if (
      data.capabilityId !== undefined &&
      (!Number.isInteger(data.capabilityId) ||
        (data.capabilityId as number) <= 0)
    ) {
      errors.push("Capability ID must be a positive integer");
    }

    if (
      data.bandId !== undefined &&
      (!Number.isInteger(data.bandId) || (data.bandId as number) <= 0)
    ) {
      errors.push("Band ID must be a positive integer");
    }

    if (data.closingDate !== undefined) {
      const date = new Date(data.closingDate as string);
      if (Number.isNaN(date.getTime())) {
        errors.push("Closing Date must be a valid date");
      }
    }

    if (
      data.description !== undefined &&
      (typeof data.description !== "string" || data.description.trim() === "")
    ) {
      errors.push("Description must be a non-empty string");
    }

    if (
      data.responsibilities !== undefined &&
      (typeof data.responsibilities !== "string" ||
        data.responsibilities.trim() === "")
    ) {
      errors.push("Responsibilities must be a non-empty string");
    }

    if (data.sharepointUrl !== undefined) {
      if (
        typeof data.sharepointUrl !== "string" ||
        data.sharepointUrl.trim() === ""
      ) {
        errors.push("SharePoint URL must be a non-empty string");
      } else {
        try {
          new URL(data.sharepointUrl);
        } catch {
          errors.push("SharePoint URL must be a valid URL");
        }
      }
    }

    if (
      data.statusId !== undefined &&
      (!Number.isInteger(data.statusId) || (data.statusId as number) <= 0)
    ) {
      errors.push("Status ID must be a positive integer");
    }

    if (
      data.numberOfOpenPositions !== undefined &&
      (!Number.isInteger(data.numberOfOpenPositions) ||
        (data.numberOfOpenPositions as number) <= 0)
    ) {
      errors.push("Number of Open Positions must be a positive integer");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
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
      const numericId = Number(id);
      if (!Number.isInteger(numericId) || numericId <= 0) {
        res.status(400).json({ message: "Invalid job role ID" });
        return;
      }
      const jobRole = await this.jobRoleService.getJobRoleById(numericId);
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
      const validation = this.validateCreateJobRoleInput(req.body);
      if (!validation.valid) {
        res.status(400).json({
          message: "Invalid request body",
          errors: validation.errors,
        });
        return;
      }
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
      const numericId = Number(id);
      if (!Number.isInteger(numericId) || numericId <= 0) {
        res.status(400).json({ message: "Invalid job role ID" });
        return;
      }
      const validation = this.validateUpdateJobRoleInput(req.body);
      if (!validation.valid) {
        res.status(400).json({
          message: "Invalid request body",
          errors: validation.errors,
        });
        return;
      }
      const jobRole = await this.jobRoleService.updateJobRole(
        numericId,
        req.body,
      );
      if (!jobRole) {
        res.status(404).json({ message: "Job role not found" });
        return;
      }
      res.status(200).json(jobRole);
    } catch (error) {
      console.error("Error in updateJobRole:", error);
      res.status(500).json({ message: "Failed to update job role" });
    }
  };

  public deleteJobRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const numericId = Number(id);
      if (!Number.isInteger(numericId) || numericId <= 0) {
        res.status(400).json({ message: "Invalid job role ID" });
        return;
      }
      const deleted = await this.jobRoleService.deleteJobRole(numericId);
      if (!deleted) {
        res.status(404).json({ message: "Job role not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error in deleteJobRole:", error);
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2025"
      ) {
        res.status(404).json({ message: "Job role not found" });
        return;
      }
      res.status(500).json({ message: "Failed to delete job role" });
    }
  };
}
