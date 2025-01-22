import express from 'express';
import { UserController, AuthController } from '../controllers';

const router = express.Router();

// Object instance for UserController Class..
const userController = new UserController();
const authController = new AuthController();

/**
 * ---- Get Profile ----
 */
router.get('/profile', userController.profile);

/**
 * ---- Get Profile (Auth) ----
 */
router.get('/auth', userController.profileAuth);

/**
 * ---- Get Logout User ----
 */
router.get('/logout', authController.logout);

export default router;