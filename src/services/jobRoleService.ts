import type { JobRoleDao } from "../dao/jobRoleDao";
import { JobRoleMapper } from "../mappers/jobRoleMapper";
import type { JobRoleResponse } from "../models/jobRoleResponse";

export class JobRoleService {
	private jobRoleDao: JobRoleDao;

	constructor(jobRoleDao: JobRoleDao) {
		this.jobRoleDao = jobRoleDao;
	}

	public async getJobRoles(): Promise<JobRoleResponse[]> {
		const jobRoles = await this.jobRoleDao.getJobRoles();

		const jobRoleResponses: JobRoleResponse[] = jobRoles.map((jobRole) => {
			return JobRoleMapper.toResponse(jobRole);
		});

		return jobRoleResponses;
	}

	public async getJobRoleById(
		jobRoleId: number,
	): Promise<JobRoleResponse | null> {
		const jobRole = await this.jobRoleDao.getJobRoleById(jobRoleId);

		if (!jobRole) {
			return null;
		}

		return JobRoleMapper.toResponse(jobRole);
	}
}
