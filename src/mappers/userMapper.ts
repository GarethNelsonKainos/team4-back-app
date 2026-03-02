import type { User } from "../generated/client.js";
import type { UserResponse } from "../models/userResponse.js";
import type UserRole from "../models/userRole.js";

export function toUserResponse(user: User): UserResponse {
	return {
		userId: user.userId,
		userEmail: user.userEmail,
		userRole: user.userRole as UserRole,
		createdAt: user.createdAt,
	};
}
