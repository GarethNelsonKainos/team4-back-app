import type { User } from "../generated/client";
import type { UserResponse } from "../models/userResponse";

export function toUserResponse(user: User): UserResponse {
	return {
		userId: user.userId,
		userEmail: user.userEmail,
		userRole: user.userRole,
		createdAt: user.createdAt,
	};
}
