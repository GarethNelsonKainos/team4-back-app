import jwt from 'jsonwebtoken';



class JwtService {

    generateToken(userId: number): string {
        try {
            if (!userId || typeof userId !== 'number') {
                throw new Error('User ID must be a valid number');
            }

            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error('JWT_SECRET is not defined in environment variables');
            }

            const expiresIn: string | number = process.env.JWT_EXPIRATION || '1h';

            const payload = { userId };

            const token = jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);

            return token;


        } catch (error) {
            console.error('Error generating JWT token:', error);
            throw error;
        }
    }

    
    verifyToken(token: string): any {
        try {
            if (!token || typeof token !== 'string') {
                throw new Error('Token must be a non-empty string');
            }
            
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error('JWT_SECRET is not defined in environment variables');
            }

            const payload = jwt.verify(token, secret);

            return payload;
            
        } catch (error) {
            console.error('Error verifying JWT token:', error);
            throw error;
        }
    }
}

export const jwtService = new JwtService();
