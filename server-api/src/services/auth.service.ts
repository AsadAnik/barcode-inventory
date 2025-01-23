import { User } from '../models';
import { BcryptUtils, TokenUtils } from '../lib/shared';

class AuthService {
    private readonly userModelRepository: typeof User;
    private readonly bcryptUtils: BcryptUtils;
    private readonly tokenUtils: TokenUtils;

    constructor(userModelRepository: typeof User = User) {
        this.userModelRepository = userModelRepository;
        this.bcryptUtils = new BcryptUtils();
        this.tokenUtils = new TokenUtils();
    }

    /**
     * USER LOGIN SERVICE
     * @param userInfo @Object - { emaiL: string, password: string }
     * @return Promise<{ any }>
     */
    // region Login Service
    public async loginUser(userInfo: { email: string, password: string }): Promise<any> {
        try {
            const user = await this.userModelRepository.findOne({ email: userInfo.email });
            if (!user) return { success: false, message: 'Invalid Credentials!' };

            const isPasswordMatch = await this.bcryptUtils.comparePassword(userInfo.password, user.password);
            if (!isPasswordMatch) return { success: false, message: 'Invalid Credentials!' };

            // Generate Token (Access & Refresh)
            const accessToken = this.tokenUtils.generateToken({ id: user._id, email: user.email }, '10m');
            const refreshToken = this.tokenUtils.generateToken({ id: user._id }, '7d');

            // Update..
            user.refreshToken = refreshToken;
            await user.save();

            return {
                success: true,
                message: 'Login Successful',
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                    },
                    accessToken,
                    refreshToken,
                }
            };

        } catch (error) {
            console.error(`Error to login user: ${error}`);
            throw error;
        }
    }


    /**
     * USER REGISTRATION SERVICE
     * @param userInfo
     */
    // region Registration Service
    public async register(userInfo: any): Promise<any> {
        try {
            const userExists = await this.userModelRepository.findOne({ email: userInfo.email });
            if (userExists) return {
                success: false,
                message: 'User already exists',
            }

            // Let's hashing the password here..
            userInfo.password = await this.bcryptUtils.hashPassword(userInfo.password);

            // store..
            const createdUser = await this.userModelRepository.create(userInfo);
            await createdUser.save();

            return { success: true, message: 'Registered User', user: createdUser }

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error;
        }
    }


    /**
     * USER LOGOUT
     * Own logout feature service
     */
    // region User Logout
    public async logoutUser(refreshToken: string): Promise<any> {
        try {
            // return await this.sessionService.logoutByRefreshToken(refreshToken);

        } catch (error) {
            console.error(`Error occured while do logout: ${error}`);
            throw error;
        }
    }
}

export default AuthService;