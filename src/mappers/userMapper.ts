import type { User } from "../generated/client";
import type { UserResponse } from "../models/userResponse";
import type UserRole from "../models/userRole";

export function toUserResponse(user: User): UserResponse {
	return {
		userId: user.userId,
		userEmail: user.userEmail,
		userRole: user.userRole as UserRole,
		createdAt: user.createdAt,
	};
}
