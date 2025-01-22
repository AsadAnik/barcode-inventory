import express from 'express';
import { ProductController } from '../controllers';

const router = express.Router();

// Object instance for UserController Class..
const productController = new ProductController();

/**
 * ---- Create Product Route ----
 * This will create a new product..
 */
router.post('/', productController.createProduct);


export default router;