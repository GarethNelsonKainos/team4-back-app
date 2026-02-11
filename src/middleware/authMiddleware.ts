import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../services/jwtService';


declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ message: 'Authorization header is missing' });
      return;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({ message: 'Invalid authorization header format. Use: Bearer <token>' });
      return;
    }

    const token = parts[1];

    const decoded = jwtService.verifyToken(token);

    req.userId = decoded.userId;

    next();

  } catch (error) {
    console.error('Error during token verification:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
