import { Product } from '../models';
import { IProduct } from '../types';
import axios from 'axios';

class ProductService {
    private readonly productModelRespository: typeof Product;

    constructor(productModelRespository: typeof Product = Product) {
        this.productModelRespository = productModelRespository;
    }

    /**
     * CREATE PRODUCT SERVICE
     * Service for create new Product
     * Create product by fetching details by API
     * And then create product into database with user id and category default
     * @param productData 
     * @param userId 
     * @returns 
     */
    // region Create Product
    public async createProduct(userBarcode: string, userId: string): Promise<any> {
        try {
            const productsFetchAPI = process.env.PRODUCT_FETCH_API || 'https://products-test-aci.onrender.com/product';
            const fetchProductResponse = await axios.get(`${productsFetchAPI}/${userBarcode}`);

            if (!fetchProductResponse) {
                throw new Error('Failed to fetch product data');
            }

            const productData = fetchProductResponse.data;
            if (!productData) {
                throw new Error('Failed to fetch product data');
            }

            // Create Product
            const { barcode, description } = productData.product;
            const name = description?.split(' ')[0];

            const product = new Product({
                name,
                barcode,
                description,
                category: null,
                user: userId,
            });

            return await product.save();

        } catch (error) {
            console.error(`Error occured while creating product: ${error}`);
            throw error;
        }
    }

    /**
     * GET PRODUCTS SERVICE
     * Service for get all products
     */
    // region Get Products
    public async getProducts(categoryId: string, userId: string): Promise<IProduct[]> {
        try {

            let filter: any = { user: userId };

            if (categoryId && categoryId !== 'null') {
                filter = {...filter, category: categoryId };

            } else if (categoryId === 'null') {
                filter.category = { $exists: false };
            }

            const products = await this.productModelRespository.find(filter).sort({ createdAt: -1 });
            return products as IProduct[];

        } catch (error) {
            console.error(`Error occured while getting products: ${error}`);
            throw error;
        }
    }

    /**
     * DELETE PRODUCT SERVICE
     * Service for get product by id
     * @param productId 
     * @returns 
     */
    //  region Delete Product
    public async deleteProduct(productId: string): Promise<any> {
        try {
            return await this.productModelRespository.findByIdAndDelete(productId);

        } catch (error) {
            console.error(`Error occured while getting products: ${error}`);
            throw error;
        }
    }

    /**
     * DELETE PRODUCT BY CATEGORY SERVICE
     * Service for get product by id
     * @param categoryId 
     * @returns 
     */
    // region Delete By Category
    public async deleteProductByCategory(categoryId: string): Promise<any> {
        try {
            return await this.productModelRespository.deleteMany({ category: categoryId });

        } catch (error) {
            console.error(`Error occured while getting products: ${error}`);
            throw error;
        }
    }
}

export default ProductService;