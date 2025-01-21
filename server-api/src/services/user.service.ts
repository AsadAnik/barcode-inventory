import { User } from '../models';

class UserService {
    private readonly userModelRepository: typeof User;

    constructor(userModelRepository: typeof User = User) {
        this.userModelRepository = userModelRepository;
    }

    /**
     * FIND USER BY USER_ID
     * Finds a user by their ID.
     * @param userId
     */
    // region Find User By ID
    public async findUser(userId: string): Promise<any> {
        try {
            const user = await this.userModelRepository.findById(userId).select('-password');
            return user;

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error;
        }
    }
}

export default UserService;