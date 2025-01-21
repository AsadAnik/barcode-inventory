import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services';


class AuthController {
    private readonly authService: AuthService;

    constructor(authService: AuthService = new AuthService()) {
        this.authService = authService;
    }

    /**
     * ---- Register Controller ----
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} _next 
     */
    public register = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const userRegister = await this.authService.register(req.body);
            if (!userRegister.success) res.status(400).json(userRegister);
            res.status(200).json(userRegister);

        } catch (error) {
            res.json({ success: false, error });
        }
    }

    /**
     * ---- Login Controller ----
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next
     */
    public login = async (req: Request, res: Response | any, next: NextFunction) => {
        const reqBody = req.body;

        try {
            const authLogin = await this.authService.loginUser({ email: reqBody.email, password: reqBody.password });
            if (!authLogin.success) return res.status(400).json(authLogin);
            res.status(200).json(authLogin);

        } catch (error) {
            next(error);
        }
    }

    /**
     * ---- Forgot Password Controller ----
     * @param {Request} req 
     * @param {Response} res 
     */
    public async forgotPassword(_req: Request, res: Response) {
        res.status(200).send('Route for forgot password!');
    }

    /**
     * ---- User Logout ----
     * @param {Request} req 
     * @param {Response} res 
     */
    public logout = async (req: Request | any, res: Response | any, next: NextFunction) => {
        try {
            const requestUser = (req as any).user;
            const logoutUser = await this.authService.logoutUser(requestUser.refreshToken);
            if (!logoutUser.success) return res.status(400).json({ success: false, msg: 'Can not logout!' });

            res.status(200).json({
                isAuth: false,
                success: true,
                msg: 'Logged-Out, session deleted!'
            });

        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;