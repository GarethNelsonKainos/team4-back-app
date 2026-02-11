import bcrypt from 'bcrypt';


class PasswordService {
    async hashPassword(plainPassword: string): Promise<string> {
    try {
        if (!plainPassword || typeof plainPassword !== 'string') {
            throw new Error('Password must be a non-empty string');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error; 
    }
}


    async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
            return isMatch;  
        } catch (error) {
            console.error('Error verifying password:', error);
            throw error; 
        }
    }
}

export const passwordService = new PasswordService();
