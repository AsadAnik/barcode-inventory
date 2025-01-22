/**
 * USER TYPE
 * This is user types
 */
interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * USER REGISTER
 * This is register user types
 */
interface IUserRegister {
    name?: string;
    email: string;
    password: string;
}

/**
 * USER LOGIN
 * This is login user types
 */
interface IUserLogin {
    email: string;
    password: string;
}

export { IUser, IUserLogin, IUserRegister };