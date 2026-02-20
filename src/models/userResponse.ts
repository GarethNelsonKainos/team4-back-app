import type UserRole from "./userRole";

export interface UserResponse {
	userId: number;
	userEmail: string;
	userRole: UserRole;
	createdAt: Date;
}
