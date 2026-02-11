import type { User } from "../generated/client";
import type { UserResponse } from "../models/userResponse";

export function toUserResponse(user: User): UserResponse {
	return {
		userId: user.userId,
		userEmail: user.userEmail,
		createdAt: user.createdAt,
	};
}
