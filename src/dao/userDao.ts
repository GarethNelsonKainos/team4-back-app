import { prisma } from "../db";
import type { User } from "../generated/client";
import UserRole from "../models/userRole";

export class UserDao {
	async getUserByEmail(email: string): Promise<User | null> {
		return prisma.user.findUnique({
			where: { userEmail: email },
		});
	}

	async getUserForLogin(email: string): Promise<User | null> {
		return prisma.user.findUnique({
			where: { userEmail: email },
		});
	}

	async createUser(
		email: string,
		hashedPassword: string,
		userRole: UserRole = UserRole.APPLICANT,
	): Promise<User> {
		return prisma.user.create({
			data: {
				userEmail: email,
				userPassword: hashedPassword,
				userRole: userRole,
			},
		});
	}

	async updateUserPassword(
		userId: number,
		hashedPassword: string,
	): Promise<User> {
		return prisma.user.update({
			where: { userId },
			data: { userPassword: hashedPassword, updatedAt: new Date() },
		});
	}

	async getUserById(userId: number): Promise<User | null> {
		return prisma.user.findUnique({
			where: { userId },
			include: { userRole: true },
		});
	}
}
