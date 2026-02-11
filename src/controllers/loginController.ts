import { Request, Response } from "express";
import { jwtService } from "../services/jwtService";
import { passwordService } from "../services/passwordService";
import { UserDao } from "../dao/userDao";

export class LoginController {
  private userDao: UserDao;
  
  constructor() {
    this.userDao = new UserDao();
  }

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body as { email?: string; password?: string };
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const user = await this.userDao.getUserForLogin(email);
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        const isPasswordValid = await passwordService.verifyPassword(password, user.userPassword);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        const token = jwtService.generateToken(user.userId);
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  };

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body as { email?: string; password?: string };
        
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ message: "Password must be at least 6 characters long" });
            return;
        }

        const existingUser = await this.userDao.getUserByEmail(email);
        if (existingUser) {
            res.status(409).json({ message: "Email is already registered" });
            return;
        }

        const hashedPassword = await passwordService.hashPassword(password);
        const newUser = await this.userDao.createUser(email, hashedPassword);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                userId: newUser.userId,
                userEmail: newUser.userEmail,
                createdAt: newUser.createdAt,
            },
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    try {
        // Logout is primarily handled client-side (client removes token from storage)
        // Server just confirms the logout
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  };

  public updatePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId;
        const { oldPassword, newPassword } = req.body as { oldPassword?: string; newPassword?: string };

        if (!oldPassword || !newPassword) {
            res.status(400).json({ message: "Old password and new password are required" });
            return;
        }

        if (newPassword.length < 6) {
            res.status(400).json({ message: "New password must be at least 6 characters long" });
            return;
        }

        const user = await this.userDao.getUserById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const isPasswordValid = await passwordService.verifyPassword(oldPassword, user.userPassword);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Current password is incorrect" });
            return;
        }

        const hashedPassword = await passwordService.hashPassword(newPassword);
        await this.userDao.updateUserPassword(userId, hashedPassword);

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  };
}

