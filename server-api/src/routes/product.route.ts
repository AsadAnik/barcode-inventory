import express from 'express';
import { ProductController } from '../controllers';

const router = express.Router();

// Object instance for UserController Class..
const productController = new ProductController();

/**
 * ---- Create Product Route ----
 * This will create a new product..
 * 
 * ---- Get Products Route ----
 * This will get all products..
 */
router.route('/')
    .post(productController.createProduct)
    .get(productController.getProducts);

/**
 * ---- Delete Product Route ----
 * This will delete a product..
 */
router.route('/:id')
    .patch(productController.updateProductsCategory)
    .delete(productController.deleteProduct);

export default router;