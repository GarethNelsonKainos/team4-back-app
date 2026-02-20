import type { UserRole } from "../generated/client";

export interface UserResponse {
	userId: number;
	userEmail: string;
	userRole: UserRole;
	createdAt: Date;
}
