import * as jwt from 'jsonwebtoken';

class TokenUtils {
    private readonly jwtSecret: string = process.env.JWT_SECRET ?? 'SECRET';

    /**
     * TOKEN GENERATES HERE
     * @param payload 
     * @returns 
     */
    public generateToken = (payload: any, time: string = '15m'): string => {
        // Generate a JWT token
        const token = jwt.sign(payload, this.jwtSecret, {
            expiresIn: time,
        });

        return token;
    }

    /**
     * VERIFY THE TOKEN
     * @param token 
     * @returns 
     */
    public verifyToken = (token: string): any => {
        // Verify the JWT token
        const decoded = jwt.verify(token, this.jwtSecret);
        return decoded;
    }
}

export default TokenUtils;