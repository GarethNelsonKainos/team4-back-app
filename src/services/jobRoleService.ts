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

		const jobRoles = prismaJobRoles.map((prismaJobRole) =>
			JobRoleMapper.fromPrisma(prismaJobRole),
		);

		const jobRoleResponses: JobRoleResponse[] = jobRoles.map((jobRole) => {
			return JobRoleMapper.toResponse(jobRole);
		});

		return jobRoleResponses;
	}

	public async getJobRoleById(
		jobRoleId: number,
	): Promise<JobRoleResponse | null> {
		const prismaJobRole = await this.jobRoleDao.getJobRoleById(jobRoleId);

		if (!prismaJobRole) {
			return null;
		}

		const jobRole = JobRoleMapper.fromPrisma(prismaJobRole);
		return JobRoleMapper.toResponse(jobRole);
	}
}
