import { Category } from '../models';
import { ICategory, ICategoryCreate, ICategoryUpdate } from '../types';
import ProductService from './product.service';

class CategoryService {
    private readonly categoryModelRepository: typeof Category;
    private readonly productService: ProductService;

    constructor(categoryModelRepository: typeof Category = Category, productService: ProductService = new ProductService()) {
        this.categoryModelRepository = categoryModelRepository;
        this.productService = productService;
    }

    /**
     * CREATE CATEGORY
     * Creates a new category.
     * @param categoryData 
     * @param userId
     * @returns 
     */
    // region Create Category
    public async createCategory(categoryData: ICategoryCreate, userId: string): Promise<ICategory> {
        try {
            const category = await this.categoryModelRepository.create({...categoryData, user: userId });
            return category as ICategory;

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error
        }
    }

    /**
     * GET CATEGORIES
     * Gets all categories.
     * @param userId 
     * @returns 
     */
    // region Get Categories
    public async getCategories(userId: string): Promise<ICategory[]> {
        try {
            const categories = await this.categoryModelRepository.find({ user: userId });
            return categories as ICategory[];

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error
        } 
    }


    /**
     * UPDATE CATEGORY
     * Updates an existing category.
     * @param categoryId
     * @param categoryData 
     * @returns 
     */
    // region Update Category
    public async updateCategory(categoryId: string, categoryData: ICategoryUpdate): Promise<ICategory> {
        try {
            const category = await this.categoryModelRepository.findByIdAndUpdate(categoryId, categoryData, { new: true });
            return category as ICategory;

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error
        }
    }


    /**
     * DELETE CATEGORY
     * Deletes an existing category.
     * @param categoryId 
     */
    // region Delete Category
    public async deleteCategory(categoryId: string): Promise<void> {
        try {
            // delete all categories from all products
            await this.productService.deleteProductByCategory(categoryId);
            // delete category
            await this.categoryModelRepository.findByIdAndDelete(categoryId);

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error
        }
    }
}

export default CategoryService;