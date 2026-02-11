import jwt from "jsonwebtoken";

export interface JwtPayload {
	userId: number;
	userEmail: string;
	iat?: number; // Issued at time (added automatically by JWT)
	exp?: number; // Expiration time (added automatically by JWT)
}

export class JwtService {
	generateToken(userId: number, userEmail: string): string {
		try {
			if (!userId || typeof userId !== "number") {
				throw new Error("User ID must be a valid number");
			}

			if (!userEmail || typeof userEmail !== "string") {
				throw new Error("User email must be a valid string");
			}

			const secret = process.env.JWT_SECRET;
			if (!secret) {
				throw new Error("JWT_SECRET is not defined in environment variables");
			}

			const expiresIn: string | number = process.env.JWT_EXPIRATION || "1h";

			const payload: JwtPayload = { userId, userEmail };

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
