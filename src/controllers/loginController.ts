import type { Request, Response } from "express";
import type { UserDao } from "../dao/userDao";
import { toUserResponse } from "../mappers/userMapper";
import type UserRole from "../models/userRole";
import type { JwtService } from "../services/jwtService";
import type { PasswordService } from "../services/passwordService";

export class LoginController {
	private userDao: UserDao;
	private passwordService: PasswordService;
	private jwtService: JwtService;

	constructor(
		userDao: UserDao,
		passwordService: PasswordService,
		jwtService: JwtService,
	) {
		this.userDao = userDao;
		this.passwordService = passwordService;
		this.jwtService = jwtService;
	}

	public login = async (req: Request, res: Response): Promise<void> => {
		try {
			const { email, password } = req.body as {
				email?: string;
				password?: string;
			};
			if (!email || !password) {
				res.status(400).json({ message: "Email and password are required" });
				return;
			}

			const user = await this.userDao.getUserForLogin(email);
			if (!user) {
				res.status(401).json({ message: "Invalid email or password" });
				return;
			}

			const isPasswordValid = await this.passwordService.verifyPassword(
				password,
				user.userPassword,
			);
			if (!isPasswordValid) {
				res.status(401).json({ message: "Invalid email or password" });
				return;
			}

			const token = this.jwtService.generateToken(
				user.userId,
				user.userEmail,
				user.userRole as UserRole,
			);
			res.status(200).json({ token });
		} catch (error) {
			console.error("Error during login:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	};

	public register = async (req: Request, res: Response): Promise<void> => {
		try {
			const { email, password } = req.body as {
				email?: string;
				password?: string;
			};

			if (!email || !password) {
				res.status(400).json({ message: "Email and password are required" });
				return;
			}

			if (password.length < 6) {
				res
					.status(400)
					.json({ message: "Password must be at least 6 characters long" });
				return;
			}

			const existingUser = await this.userDao.getUserByEmail(email);
			if (existingUser) {
				res.status(409).json({ message: "Email is already registered" });
				return;
			}

			//return with hashed and salt
			const hashedPassword = await this.passwordService.hashPassword(password);
			const newUser = await this.userDao.createUser(email, hashedPassword);

			res.status(201).json({
				message: "User registered successfully",
				user: toUserResponse(newUser),
			});
		} catch (error) {
			console.error("Error during registration:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	};

	//   public logout = async (req: Request, res: Response): Promise<void> => {
	//     try {
	//         // Logout is primarily handled client-side (client removes token from storage)
	//         // Server just confirms the logout
	//         res.status(200).json({ message: "Logged out successfully" });
	//     } catch (error) {
	//         console.error('Error during logout:', error);
	//         res.status(500).json({ message: 'Internal server error' });
	//     }
	//   };

	//logic for updating password needs reworked
	//current setup requires user to be logged in and have a token
	// but if they have forgotten their password this is impossible
	// only use old password for comparison purposes to ensure new is not same as old
	// apply this later when front end functionality is linked to back end

	//   public updatePassword = async (req: Request, res: Response): Promise<void> => {
	//     try {
	//         const userId = req.userId;
	//         // dont enforce old password entry, just compare in db
	//         //remove all old password data
	//         const { oldPassword, newPassword } = req.body as { oldPassword?: string; newPassword?: string };

	//         if (!oldPassword || !newPassword) {
	//             res.status(400).json({ message: "Old password and new password are required" });
	//             return;
	//         }

	//         if (newPassword.length < 6) {
	//             res.status(400).json({ message: "New password must be at least 6 characters long" });
	//             return;
	//         }

	//         //rethink logic, cannot compare old password if user is not logged in, need to verify token first, then compare old password with db, then update with new password
	//         const user = await this.userDao.getUserById(userId);
	//         if (!user) {
	//             res.status(404).json({ message: "User not found" });
	//             return;
	//         }

	//         const isPasswordValid = await passwordService.verifyPassword(oldPassword, user.userPassword);
	//         if (!isPasswordValid) {
	//             res.status(401).json({ message: "Current password is incorrect" });
	//             return;
	//         }

	//         const hashedPassword = await passwordService.hashPassword(newPassword);
	//         await this.userDao.updateUserPassword(userId, hashedPassword);

	//         res.status(200).json({ message: "Password updated successfully" });
	//     } catch (error) {
	//         console.error('Error updating password:', error);
	//         res.status(500).json({ message: 'Internal server error' });
	//     }
	//   };
}
