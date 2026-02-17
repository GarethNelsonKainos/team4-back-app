import type { JobRoleDao } from "../dao/jobRoleDao";
import { JobRoleMapper } from "../mappers/jobRoleMapper";
import type {
	CreateJobRoleInput,
	UpdateJobRoleInput,
} from "../models/jobRoleData";
import type { JobRoleResponse } from "../models/jobRoleResponse";

export class JobRoleService {
	private jobRoleDao: JobRoleDao;

	constructor(jobRoleDao: JobRoleDao) {
		this.jobRoleDao = jobRoleDao;
	}

	public async getJobRoles(): Promise<JobRoleResponse[]> {
		const jobRolesData = await this.jobRoleDao.getJobRoles();
		return jobRolesData.map((jobRole) => JobRoleMapper.toResponse(jobRole));
	}

	public async getJobRoleById(id: number): Promise<JobRoleResponse | null> {
		const jobRoleData = await this.jobRoleDao.getJobRoleById(id);
		if (!jobRoleData) return null;
		return JobRoleMapper.toResponse(jobRoleData);
	}

	public async createJobRole(
		data: CreateJobRoleInput,
	): Promise<JobRoleResponse> {
		const jobRoleData = await this.jobRoleDao.createJobRole(data);
		return JobRoleMapper.toResponse(jobRoleData);
	}

	public async updateJobRole(
		id: number,
		data: UpdateJobRoleInput,
	): Promise<JobRoleResponse> {
		const jobRoleData = await this.jobRoleDao.updateJobRole(id, data);
		return JobRoleMapper.toResponse(jobRoleData);
	}

	public async deleteJobRole(id: number): Promise<void> {
		await this.jobRoleDao.deleteJobRole(id);
	}
}
