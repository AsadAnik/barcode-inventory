import express from 'express';
import { UserController, AuthController } from '../controllers';

const router = express.Router();

// Object instance for UserController Class..
const userController = new UserController();
const authController = new AuthController();

/**
 * ---- Get All Users ----
 */
router.get('/read_all_users', userController.showUsersController);

/**
 * ---- Get Profile By Id ----
 */
router.get('/profile_by_id', userController.profileById);

/**
 * ---- Get User of Owner ----
 */
router.get('/find_user', userController.postOwner);

/**
 * ---- Get Profile ----
 */
router.get('/profile', userController.profile);

/**
 * ---- Get Profile (Auth) ----
 */
router.get('/auth', userController.profileAuth);

/**
 * ---- Update Color Mode ----
 */
router.post('/user_colorMode_update', userController.updateColorMode);

/**
 * ---- User's Theme Mode Update ----
 */
router.post('/user_themeMode_updateName', userController.updateThemeMode);

/**
 * ---- Get Logout User ----
 */
router.get('/logout', authController.logout);

export default router;