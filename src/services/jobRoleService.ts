import type { JobRoleDao } from "../dao/jobRoleDao";
import { JobRoleMapper } from "../mappers/jobRoleMapper";
import type { JobRoleResponse } from "../models/jobRoleResponse";

export class JobRoleService {
	private jobRoleDao: JobRoleDao;

	constructor(jobRoleDao: JobRoleDao) {
		this.jobRoleDao = jobRoleDao;
	}

	public async getJobRoles(): Promise<JobRoleResponse[]> {
		const prismaJobRoles = await this.jobRoleDao.getJobRoles();
		return prismaJobRoles.map((jobRole) => JobRoleMapper.toResponse(jobRole));
	}
}
