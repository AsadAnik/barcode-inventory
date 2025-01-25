import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services';


class ProductController {
    private readonly productService: ProductService;

    constructor(productService: ProductService = new ProductService()) {
        this.productService = productService;
    }

    /**
     * ---- Register Controller ----
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} _next 
     */
    public createProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const barcode = req.body?.barcode;
            const userId = (req as any).user._id;

            const product = await this.productService.createProduct(barcode, userId);

            res.status(200).json({
                success: true,
                product,
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * ---- Get Product Controller ----
     * @param req 
     * @param res 
     * @param _next 
     */
    public getProducts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { category } = req.query;
            const userId = (req as any).user._id;

            const products = await this.productService.getProducts(category as string, userId as string);
            if (!products) res.status(400).json({
                success: false,
                message: 'Product not found'
            });

            res.status(200).json({
                success: true,
                products,
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * ---- Update Product Controller ----
     * @param req 
     * @param res 
     * @param next 
     */
    public updateProductsCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productId = req.params.id;
            const categoryId = req.body.categoryId;

            const updatedProduct = await this.productService.updateProductsCategory(productId, categoryId);
            if (!updatedProduct) res.status(400).json({
                success: false,
                message: 'Product Cannot be updated'
            });

            res.status(200).json({
                success: true,
                message: 'Product updated successfully',
                updatedProduct,
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * ---- Delete Product Controller ----
     * @param req 
     * @param res 
     * @param next 
     */
    public deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productId = req.params.id;
            const deletedProduct = await this.productService.deleteProduct(productId);

            if (!deletedProduct) res.status(400).json({
                success: false,
                message: 'Product Cannot be deleted'
            });

            res.status(200).json({
                success: true,
                message: 'Product deleted successfully',
                deletedProduct,
            });

        } catch (error) {
            next(error);
        }
    }
}

export default ProductController;