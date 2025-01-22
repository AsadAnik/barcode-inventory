import { Category } from '../models';
import { ICategory, ICategoryCreate, ICategoryUpdate } from '../types';

class CategoryService {
    private readonly categoryModelRepository: typeof Category;

    constructor(categoryModelRepository: typeof Category = Category) {
        this.categoryModelRepository = categoryModelRepository;
    }

    /**
     * CREATE CATEGORY
     * Creates a new category.
     * @param categoryData 
     * @returns 
     */
    public async createCategory(categoryData: ICategoryCreate): Promise<ICategory> {
        try {
            const category = await this.categoryModelRepository.create(categoryData);
            return category as ICategory;

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error
        }
    }


    /**
     * UPDATE CATEGORY
     * Updates an existing category.
     * @param categoryData 
     * @returns 
     */
    public async updateCategory(categoryData: ICategoryUpdate): Promise<ICategory> {
        try {
            const category = await this.categoryModelRepository.findByIdAndUpdate(categoryData.id, { name: categoryData.name }, { new: true });
            return category as ICategory;

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error
        }
    }
}

export default CategoryService;