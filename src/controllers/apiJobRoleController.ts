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
}
