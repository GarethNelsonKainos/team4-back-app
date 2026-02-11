import type { User } from "@prisma/client";
import { prisma } from "../db";

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

	async createUser(email: string, hashedPassword: string): Promise<User> {
		return prisma.user.create({
			data: {
				userEmail: email,
				userPassword: hashedPassword,
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
		});
	}
}
