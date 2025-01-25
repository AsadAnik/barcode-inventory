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
router.route('/').post(productController.createProduct);

/**
 * ---- Delete Product Route ----
 * This will delete a product..
 */
router.route('/:id')
    .delete(productController.deleteProduct);


/**
 * ---- Update Product's Category Route ----
 * This will update the category of a product..
 * This created for the Kanban feature about drag and drop to another category..
 */
router.patch('/:id/update-category', productController.updateProductsCategory);

export default router;