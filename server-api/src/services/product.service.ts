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
    // region Create Product Service
    public async createProduct(userBarcode: string, userId: string): Promise<any> {
        try {
            const fetchProductResponse = await axios.get(`https://products-test-aci.onrender.com/product/${userBarcode}`);
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
    public async getProducts(): Promise<IProduct[]> {
        try {
            const products = await this.productModelRespository.find().populate('category');
            return products as IProduct[];

        } catch (error) {
            console.error(`Error occured while getting products: ${error}`);
            throw error;
        }
    }
}

export default ProductService;