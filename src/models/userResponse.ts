import type UserRole from "./userRole.js";

export interface UserResponse {
	userId: number;
	userEmail: string;
	userRole: UserRole;
	createdAt: Date;
}
