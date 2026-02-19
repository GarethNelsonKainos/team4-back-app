import type { NextFunction, Request, Response } from "express";
import { JwtService } from "../services/jwtService";

declare global {
	namespace Express {
		interface Request {
			userId?: number;
			userEmail?: string;
			userRole?: string;
		}
	}
}

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			res.status(401).json({ message: "Authorization header is missing" });
			return;
		}

		const parts = authHeader.split(" ");
		if (parts.length !== 2 || parts[0] !== "Bearer") {
			res.status(401).json({
				message: "Invalid authorization header format. Use: Bearer <token>",
			});
			return;
		}

		console.log(authHeader)

		const token = parts[1];

		console.log(token);

		const jwtService = new JwtService();
		const decoded = jwtService.verifyToken(token);

		req.userId = decoded.userId;
		req.userEmail = decoded.userEmail;
		req.userRole = decoded.userRole;

		next();
	} catch (error) {
		console.error("Error during token verification:", error);
		res.status(401).json({ message: "Invalid or expired token" });
	}
};
