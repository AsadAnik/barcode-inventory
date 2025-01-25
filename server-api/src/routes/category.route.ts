import express from 'express';
import { CategoryController } from '../controllers';

const router = express.Router();

// Object instance for UserController Class..
const categoryController = new CategoryController();


/**
 * ---- Get Kanban Route ----
 * This will get all categories with aggregated products..
 */
router.get('/kanban', categoryController.getKanban);

/**
 * ---- Get Categories Route ----
 * This will get all categories..
 * 
 * ---- Create Category Route ----
 * This will create a new category..
 */
router.route('/')
    .post(categoryController.createCategory);

/**
 * ---- Update Category Route ----
 * This will update a category..
 * 
 * ---- Delete Category Route ----
 * This will delete a category..
 */
router.route('/:id')
    .put(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

export default router;