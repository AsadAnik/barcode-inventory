import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services';

class CategoryController {
    private readonly categoryService: CategoryService;

    constructor(categoryService: CategoryService = new CategoryService()) {
        this.categoryService = categoryService;
    }

    /**
     * ---- Get Categories Controller ----
     * This will get all categories..
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public getKanban = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user._id;
            const kanbanList = await this.categoryService.getProductsKanban(userId);
            if (!kanbanList || Object.keys(kanbanList).length === 0) {
                // If no categories or products found, send 404 response
                res.status(404).json({
                    success: false,
                    message: 'No categories found',
                });
            }

            // Respond with the structured Kanban list
            res.status(200).json({
                success: true,
                kanbanList,
            });


        } catch (error) {
            next(error);
        }
    }

    /**
     * ---- Create Category Controller ----
     * @param req 
     * @param res 
     * @param next 
     */
    public createCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user._id;
            const category = await this.categoryService.createCategory(req.body, userId);
            if (!category) res.status(400).json({
                success: false,
                message: 'Category not found'
            });

            res.status(200).json({
                success: true,
                category,
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * ---- Update Category Controller ----
     * @param req 
     * @param res 
     * @param next 
     */
    public updateCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryId = req.params.id;
            const categoryInfo = req.body;

            const category = await this.categoryService.updateCategory(categoryId, categoryInfo);
            if (!category) res.status(400).json({
                success: false,
                message: 'Category not found'
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * ---- Delete Category Controller ----
     * @param req 
     * @param res 
     * @param next 
     */
    public deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryId = req.params.id;
            await this.categoryService.deleteCategory(categoryId);

            res.status(200).json({
                success: true,
                message: 'Category deleted successfully',
            });

        } catch (error) {
            next(error);
        }
    }
}

export default CategoryController;