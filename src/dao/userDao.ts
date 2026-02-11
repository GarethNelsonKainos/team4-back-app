import { prisma } from "../db";
import { User } from "../generated/client";

export class UserDao {
    async getUserByEmail(email: string): Promise<Pick<User, "userId" | "userEmail" | "createdAt" | "updatedAt"> | null> {
        return prisma.user.findUnique({
            where: { userEmail: email },
            select: {
                userId: true,
                userEmail: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async getUserForLogin(email: string): Promise<Pick<User, "userId" | "userEmail" | "userPassword"> | null> {
        return prisma.user.findUnique({
            where: { userEmail: email },
            select: {
                userId: true,
                userEmail: true,
                userPassword: true,
            },
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

    async updateUserPassword(userId: number, hashedPassword: string): Promise<User> {
        return prisma.user.update({
            where: { userId },
            data: { userPassword: hashedPassword, updatedAt: new Date() },
        });
    }

    async getUserById(userId: number): Promise<Pick<User, "userId" | "userEmail" | "userPassword"> | null> {
        return prisma.user.findUnique({
            where: { userId },
            select: {
                userId: true,
                userEmail: true,
                userPassword: true,
            },
        });
    }
}