import jwt from "jsonwebtoken";
import type { UserRole } from "../generated/client";

export interface JwtPayload {
	userId: number;
	userEmail: string;
	userRole: UserRole;
	iat?: number; // Issued at time (added automatically by JWT)
	exp?: number; // Expiration time (added automatically by JWT)
}

export class JwtService {
	generateToken(userId: number, userEmail: string, userRole: UserRole): string {
		try {
			if (!userId || typeof userId !== "number") {
				throw new Error("User ID must be a valid number");
			}

			if (!userEmail || typeof userEmail !== "string") {
				throw new Error("User email must be a valid string");
			}

			if (!userRole || typeof userRole !== "string") {
				throw new Error("User role must be a valid string");
			}

			const secret = process.env.JWT_SECRET;
			if (!secret) {
				throw new Error("JWT_SECRET is not defined in environment variables");
			}

			const expiresIn: string | number = process.env.JWT_EXPIRATION || "1h";

			const payload: JwtPayload = { userId, userEmail, userRole };

			const token = jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);

			return token;
		} catch (error) {
			console.error("Error generating JWT token:", error);
			throw error;
		}
	}

	verifyToken(token: string): JwtPayload {
		try {
			if (!token || typeof token !== "string") {
				throw new Error("Token must be a non-empty string");
			}

			const secret = process.env.JWT_SECRET;
			if (!secret) {
				throw new Error("JWT_SECRET is not defined in environment variables");
			}

			const payload = jwt.verify(token, secret) as JwtPayload;

			return payload;
		} catch (error) {
			console.error("Error verifying JWT token:", error);
			throw error;
		}
	}
}
