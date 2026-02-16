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
			const idParam = Array.isArray(req.params.id)
				? req.params.id[0]
				: req.params.id;
			const jobRoleId = Number.parseInt(idParam, 10);

			if (Number.isNaN(jobRoleId)) {
				res.status(400).json({ message: "Invalid job role ID" });
				return;
			}

			const jobRole = await this.jobRoleService.getJobRoleById(jobRoleId);

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
}
