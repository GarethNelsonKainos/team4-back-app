import { prisma } from "../db";
import type { User, UserRole } from "../generated/client";

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
    role: UserRole = "APPLICANT",
  ): Promise<User> {
    return prisma.user.create({
      data: {
        userEmail: email,
        userPassword: hashedPassword,
        userRole: role,
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
