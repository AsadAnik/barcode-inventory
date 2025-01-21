import bcrypt from 'bcrypt';

class BcryptUtils {
    private readonly saltRounds: number = Number(process.env.PASSWORD_SALT) ?? 10;

    /**
     * HASH PASSWORD
     * @param password 
     * @returns 
     */
    public hashPassword = async (password: string): Promise<string> => {
        const salt = await bcrypt.genSalt(this.saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    };

    /**
     * COMPARE PASSWORD
     * @param password 
     * @param hash 
     * @returns 
     */
    public comparePassword = async (password: string, hash: string): Promise<boolean> => {
        const match = await bcrypt.compare(password, hash);
        return match;
    };
}

export default BcryptUtils;