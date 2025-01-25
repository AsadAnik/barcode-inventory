import { Product, Category } from '../models';
import { IProduct } from '../types';
import axios from 'axios';

class ProductService {
    private readonly productModelRespository: typeof Product;
    private readonly categoryModelRepository: typeof Category;

    constructor(productModelRespository: typeof Product = Product, categoryModelRepository: typeof Category = Category) {
        this.productModelRespository = productModelRespository;
        this.categoryModelRepository = categoryModelRepository;
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
    public async createProduct(userBarcode: string, userId: string) {
        try {
            const productsFetchAPI = process.env.PRODUCT_FETCH_API || 'https://products-test-aci.onrender.com/product';
            const fetchProductResponse = await axios.get(`${productsFetchAPI}/${userBarcode}`);

            if (!fetchProductResponse || !fetchProductResponse.data) {
                throw new Error('Failed to fetch product data');
            }

            const productData = fetchProductResponse.data.product;
            if (!productData) {
                throw new Error('Failed to fetch product details');
            }

            // Destructure and prepare product data
            const { barcode, description } = productData;
            const name = description?.split(' ')[0];

            // Check if the "Uncategorized" category exists for the user
            let uncategorizedCategory = await this.categoryModelRepository.findOne({
                name: 'Uncategorized',
                user: userId
            });

            if (!uncategorizedCategory) {
                // Create a new "Uncategorized" category for the user if it doesn't exist
                uncategorizedCategory = await this.categoryModelRepository.create({
                    name: 'Uncategorized',
                    user: userId,
                });
            }

            // Create and save the product in the "Uncategorized" category
            const product = new Product({
                name,
                barcode,
                description,
                category: uncategorizedCategory._id,
                user: userId,
            });

            return await product.save();

        } catch (error) {
            console.error(`Error occurred while creating product: ${error}`);
            throw error;
        }
    }

    /**
     * UPDATE PRODUCT CATEGORY SERVICE
     * Service for update product category
     * @param productId 
     * @param categoryId 
     * @returns 
     */
    public async updateProductsCategory(productId: string, categoryId: string): Promise<IProduct> {
        try {
            const product = await this.productModelRespository.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            product.category = categoryId;
            return await product.save();

        } catch (error) {
            console.error(`Error occured while updating product: ${error}`);
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