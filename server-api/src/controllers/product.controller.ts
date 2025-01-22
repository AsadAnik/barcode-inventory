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
    public createProduct = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const barcode = req.body?.barcode;
            const userId = (req as any).user._id;

            const product = await this.productService.createProduct(barcode, userId);
            // if (!product) res.status(400).json({
            //     success: false,
            //     message: 'Product not found'
            // });

            const productName = product

            res.status(200).json({
                success: true,
                product,
            });

        } catch (error) {
            res.json({ success: false, error });
        }
    }
}

export default ProductController;