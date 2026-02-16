import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../generated/client";
import { JwtService } from "../services/jwtService";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userEmail?: string;
      userRole?: UserRole;
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

    const token = parts[1];

    // Validate token is in correct JWT format (header.payload.signature)
    if (!token || token.trim() === "") {
      res.status(401).json({ message: "Token is empty" });
      return;
    }

    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      res.status(401).json({
        message:
          "Invalid token format. JWT must have 3 parts (header.payload.signature)",
      });
      return;
    }

    // Ensure each part is non-empty
    if (tokenParts.some((part) => !part || part.trim() === "")) {
      res
        .status(401)
        .json({ message: "Invalid token format. JWT parts cannot be empty" });
      return;
    }

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

export const requireRoles = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userRole) {
      res.status(403).json({ message: "User role is missing" });
      return;
    }

    if (!allowedRoles.includes(req.userRole)) {
      res.status(403).json({ message: "Insufficient permissions" });
      return;
    }

    next();
  };
};
