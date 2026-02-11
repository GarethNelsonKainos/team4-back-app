import { User } from "@prisma/client";
import { UserResponse } from "../models/userResponse";

export class UserMapper {
  static toResponse(user: User): UserResponse {
    return {
      userId: user.userId,
      userEmail: user.userEmail,
      createdAt: user.createdAt,
    };
  }
}
